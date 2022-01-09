const moment = require("moment")


const controladorPlanificacionLapsoEscolar={}

controladorPlanificacionLapsoEscolar.crearPlanificacion=async (req,res) => {
    const ModeloPlanificacionLapsoEscolar=require("../modelo/m_planificacion_lapso_escolar")
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let {id_cedula} =req.body;
    let planificacionLapsoEscolar=new ModeloPlanificacionLapsoEscolar()
    let resultIdAsignacinoAulaProfesor=await planificacionLapsoEscolar.consultarIdAsignacinoAulaProfesor(id_cedula)
    let respuestaCreacionPlanificaion=[]
    if(resultIdAsignacinoAulaProfesor.rowCount>0){
        for(let asignacionesAulaProfesor of resultIdAsignacinoAulaProfesor.rows){
            planificacionLapsoEscolar.setIdAsignacionAulaProfesor(asignacionesAulaProfesor.id_asignacion_aula_profesor)
            let resultIdPlanificaionAsignacionAula=await planificacionLapsoEscolar.consultarIdPlanificaionAsignacionAula()
            if(resultIdPlanificaionAsignacionAula.rowCount===0){
                let fechaCreacionPlanificacionlapsoEscolar=moment().format("YYYY-MM-DD")
                let datos={
                    id_planificacion_lapso_escolar:null,
                    id_asignacion_aula_profesor:asignacionesAulaProfesor.id_asignacion_aula_profesor,
                    fecha_de_creacion_planificacion_lapso_escolar:fechaCreacionPlanificacionlapsoEscolar
                }
                planificacionLapsoEscolar.setDatos(datos)
                let resultCreacionPlanificaion=await planificacionLapsoEscolar.registrarPlanificacion()
                if(resultCreacionPlanificaion.rowCount>0){
                    respuestaCreacionPlanificaion.push({mensaje:`planificaión del año escolar ${asignacionesAulaProfesor.ano_desde} - ${asignacionesAulaProfesor.ano_hasta} creada con exito`})
                }
            }
        }
    }
    else{ 
        respuesta_api.mensaje="error al crear las planificaciones escolares (el profesor no a sido asignado a ninguna aula)"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }

    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()

}

controladorPlanificacionLapsoEscolar.consultarPlanificacion=async (req,res) => {
    const ModeloPlanificacionLapsoEscolar=require("../modelo/m_planificacion_lapso_escolar")
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let {cedula} =req.params;
    let planificacionLapsoEscolar=new ModeloPlanificacionLapsoEscolar()
    let resultIdAsignacinoAulaProfesor=await planificacionLapsoEscolar.consultarIdAsignacinoAulaProfesor(cedula)
    if(resultIdAsignacinoAulaProfesor.rowCount>0){
        for(let asignacionesAulaProfesor of resultIdAsignacinoAulaProfesor.rows){
            planificacionLapsoEscolar.setIdAsignacionAulaProfesor(asignacionesAulaProfesor.id_asignacion_aula_profesor)
            let resultIdPlanificaionAsignacionAula=await planificacionLapsoEscolar.consultarIdPlanificaionAsignacionAula()
            if(resultIdPlanificaionAsignacionAula.rowCount>0){
                respuesta_api.mensaje="planificaciones consultadas con exito)"
                respuesta_api.datos.push(resultIdPlanificaionAsignacionAula.rows[0])
                respuesta_api.estado_respuesta=true
                respuesta_api.color_alerta="danger"
            }
            else{
                respuesta_api.mensaje="no hay planificaciones creadas)"
                respuesta_api.estado_respuesta=true
                respuesta_api.color_alerta="danger"
            }
            
        }
    }
    else{ 
        respuesta_api.mensaje="error al consultar hoy tiene aualas asignadas)"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }

    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

controladorPlanificacionLapsoEscolar.crearLapsoAcademico= async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    const ModeloPlanificacionLapsoEscolar=require("../modelo/m_planificacion_lapso_escolar")
    const ModeloLapsoAcademico=require("../modelo/m_lapso_academico")
    let {id_cedula} =req.body;
    let planificacionLapsoEscolar=new ModeloPlanificacionLapsoEscolar()
    let resultIdAsignacinoAulaProfesor=await planificacionLapsoEscolar.consultarIdAsignacinoAulaProfesor(id_cedula)
    if(resultIdAsignacinoAulaProfesor.rowCount>0){
        for(let asignacionesAulaProfesor of resultIdAsignacinoAulaProfesor.rows){
            planificacionLapsoEscolar.setIdAsignacionAulaProfesor(asignacionesAulaProfesor.id_asignacion_aula_profesor)
            let resultIdPlanificaionAsignacionAula=await planificacionLapsoEscolar.consultarIdPlanificaionAsignacionAula()
            if(resultIdPlanificaionAsignacionAula.rowCount===1){
                let planificaion=resultIdPlanificaionAsignacionAula.rows[0]
                let lapso=new ModeloLapsoAcademico()
                let resultLapsosPlanificacion=await lapso.consultarlapsoPorPlanificacion(planificaion.id_planificacion_lapso_escolar)
                if(resultLapsosPlanificacion.rowCount===0){
                    let contador=0;
                    while(contador<3){
                        let lapso2=new ModeloLapsoAcademico()
                        let fechaCreacionLapso=moment().format("YYYY-MM-DD")
                        let jsonLapso={
                            id_lapso_academico:"",
                            id_planificacion_lapso_escolar:planificaion.id_planificacion_lapso_escolar,
                            nombre_lapso_academico:contador+1,
                            estatu_lapso_academico:1, 
                            fecha_de_creacion_lapso_academico:fechaCreacionLapso
                        }
                        lapso2.setDatos(jsonLapso)
                        lapso2.creatLapsoAcademico()
                        contador+=1;
                    }
                }
                else{
                    respuesta_api.mensaje="ya hay lapsos asignado a planificaciones"
                    respuesta_api.estado_respuesta=true
                    respuesta_api.color_alerta="succes"
                }
                
            }
        }
    }
    else{ 
        respuesta_api.mensaje="error al crear los lapso escolares (el profesor tiene niguna planificación)"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }

    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

controladorPlanificacionLapsoEscolar.consultarLapsoPorPlanificacion= async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    const ModeloLapsoAcademico=require("../modelo/m_lapso_academico")
    let {id_planificaion} = req.params
    let lapso=new ModeloLapsoAcademico()
    let result= await lapso.consultarlapsoPorPlanificacion(id_planificaion)
    if(result.rowCount>0){
        respuesta_api.datos=result.rows
        respuesta_api.mensaje="lapsos consultados con exito"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="succes"
    }
    else{
        respuesta_api.mensaje="error al consultar los lapso academicos (no hay lapso academicos creados)"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"

    }

    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

controladorPlanificacionLapsoEscolar.crearObjetivo=async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    const ModeloObjetivoLapsoAcademico=require("../modelo/m_objetivo_lapso_academico")
    let {objetivo} = req.body
    let Objetivo=new ModeloObjetivoLapsoAcademico()
    Objetivo.setDatos(objetivo)
    let result=await Objetivo.crearObjetivo()
    if(result.rowCount>0){
        respuesta_api.mensaje="Objetivo creado con exito"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="Error al crear el objetivo"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

controladorPlanificacionLapsoEscolar.actualizar=async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    const ModeloObjetivoLapsoAcademico=require("../modelo/m_objetivo_lapso_academico")
    let {objetivo} = req.body
    let Objetivo=new ModeloObjetivoLapsoAcademico()
    Objetivo.setDatos(objetivo)
    let result=await Objetivo.actualizar()
    if(result.rowCount>0){
        respuesta_api.mensaje="Objetivo actualizado con exito"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="Error al actualizar el objetivo"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

controladorPlanificacionLapsoEscolar.consultarTodos=async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    const ModeloObjetivoLapsoAcademico=require("../modelo/m_objetivo_lapso_academico")
    let Objetivo=new ModeloObjetivoLapsoAcademico()
    let result=await Objetivo.consultarTodos()
    if(result.rowCount>0){
        respuesta_api.mensaje="Objetivos consultados exitosamente"
        respuesta_api.datos=result.rows
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="Error al consultar los objetivo : no hay objetivos"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

controladorPlanificacionLapsoEscolar.eliminar=async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    const ModeloObjetivoLapsoAcademico=require("../modelo/m_objetivo_lapso_academico")
    let {id} = req.params
    let Objetivo=new ModeloObjetivoLapsoAcademico()
    Objetivo.setIdObjetivoLapsoAcademico(id)
    let result=await Objetivo.eliminar()
    if(result.rowCount>0){
        respuesta_api.mensaje="Objetivo eliminado con exito"
        respuesta_api.datos=result.rows
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="Error al eliminar el objetivo"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}



module.exports= controladorPlanificacionLapsoEscolar