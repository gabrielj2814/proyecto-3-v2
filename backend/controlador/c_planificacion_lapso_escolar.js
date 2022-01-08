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

controladorPlanificacionLapsoEscolar.crearLapsoAcademico= async (req,res) => {
    const ModeloPlanificacionLapsoEscolar=require("../modelo/m_planificacion_lapso_escolar")
    const ModeloLapsoAcademico=require("../modelo/m_lapso_academico")
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let {id_cedula} =req.body;
    let planificacionLapsoEscolar=new ModeloPlanificacionLapsoEscolar()
    let resultIdAsignacinoAulaProfesor=await planificacionLapsoEscolar.consultarIdAsignacinoAulaProfesor(id_cedula)
    let respuestaCreacionPlanificaion=[]
    if(resultIdAsignacinoAulaProfesor.rowCount>0){
        for(let asignacionesAulaProfesor of resultIdAsignacinoAulaProfesor.rows){
            planificacionLapsoEscolar.setIdAsignacionAulaProfesor(asignacionesAulaProfesor.id_asignacion_aula_profesor)
            let resultIdPlanificaionAsignacionAula=await planificacionLapsoEscolar.consultarIdPlanificaionAsignacionAula()
            if(resultIdPlanificaionAsignacionAula.rowCount===1){
                let planificaion=resultIdPlanificaionAsignacionAula.rows[0]
                let lapso=new ModeloLapsoAcademico()
                let resultLapsosPlanificacion=await lapso.consultarlapsoPorPalnificacion(planificaion.id_planificacion_lapso_escolar)
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


module.exports= controladorPlanificacionLapsoEscolar