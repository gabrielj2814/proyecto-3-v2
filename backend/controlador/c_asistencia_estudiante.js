const ModeloAsistenciaEstudiante=require("../modelo/m_asistencia_estudiante")
const ControladorAsistenciaEstudiante={}


ControladorAsistenciaEstudiante.crearAsistenciaDeHoy= async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    const controladorInscripcion=require("./c_inscripcion")
    let {cedula} = req.params
    let datos=await controladorInscripcion.obtenerEstudianteProfesor(cedula)

    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify({
        datoss:datos
    }))
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

