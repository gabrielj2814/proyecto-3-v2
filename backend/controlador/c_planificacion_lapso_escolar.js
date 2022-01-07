const moment = require("moment")
const ModeloPlanificacionLapsoEscolar=require("../modelo/m_planificacion_lapso_escolar")

const controladorPlanificacionLapsoEscolar={}

controladorPlanificacionLapsoEscolar.crearPlanificacion=async (req,res) => {
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

module.exports= controladorPlanificacionLapsoEscolar