const moment = require("moment")
const ModeloAsistenciaEstudiante=require("../modelo/m_asistencia_estudiante")
const ControladorAsistenciaEstudiante={}


ControladorAsistenciaEstudiante.crearAsistenciaDeHoy= async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let modeloAsistenciaEstudiante=new ModeloAsistenciaEstudiante()
    const controladorInscripcion=require("./c_inscripcion")
    let {cedula} = req.params
    let resultAsistenciaDeHoy= await modeloAsistenciaEstudiante.consultarAsistenciaDeHoy()
    let datos=await controladorInscripcion.obtenerEstudianteProfesor(cedula)
    if(resultAsistenciaDeHoy.rowCount>0){
        respuesta_api.mensaje="ya hay asistencia de hoy"
        respuesta_api.datos=resultAsistenciaDeHoy.rows
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        if(datos.estado===true){
            for(let estudiante of datos.listaDeEstudiantes){
                let datosAsistencia={
                    id_asistencia_estudiante:"",
                    id_inscripcion:estudiante.id_inscripcion,
                    fecha_asistencia_estudiante:moment().format("YYYY-MM-DD"),
                    estatus_asistencia_estudiante:"",
                    observacion_asistencia_estudiante:""
                }
                modeloAsistenciaEstudiante.setDatos(datosAsistencia)
                modeloAsistenciaEstudiante.registrarAsistencia()
            }
            resultAsistenciaDeHoy= await modeloAsistenciaEstudiante.consultarAsistenciaDeHoy()
            respuesta_api.mensaje="no hay asistencia de hoy asi que se creo"
            respuesta_api.datos=resultAsistenciaDeHoy.rows
            respuesta_api.estado_respuesta=true
            respuesta_api.color_alerta="success"
        }
    }
    
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}


ControladorAsistenciaEstudiante.actualizarEstadoAsistencia= async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    let {asistencia} = req.body
    let modeloAsistenciaEstudiante=new ModeloAsistenciaEstudiante()
    modeloAsistenciaEstudiante.setIdAsistencia(asistencia.id_asistencia_estudiante)
    let resultAsistencia = await modeloAsistenciaEstudiante.actualizarEstadoAsistencia(asistencia.estatus_asistencia_estudiante)
    if(resultAsistencia.rowCount>0){
        respuesta_api.mensaje="actualizacion de estado completada"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="error al actualizar el estado"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

ControladorAsistenciaEstudiante.actualizarObservacionAsistencia= async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    let {asistencia} = req.body
    let modeloAsistenciaEstudiante=new ModeloAsistenciaEstudiante()
    modeloAsistenciaEstudiante.setIdAsistencia(asistencia.id_asistencia_estudiante)
    let resultAsistencia= await modeloAsistenciaEstudiante.actualizarObservacion(asistencia.observacion_asistencia_estudiante)
    if(resultAsistencia.rowCount>0){
        respuesta_api.mensaje="actualizacion de observacion completada"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="error al actualizar el observacion"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

module.exports=ControladorAsistenciaEstudiante

