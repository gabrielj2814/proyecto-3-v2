const ModeloFechaLapsoAcademico=require("../modelo/m_fecha_lapso_academico")
let ControladorFechaLapsoAcademico={}


ControladorFechaLapsoAcademico.registrar= async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    let {fechaLapsoInscripcion} = req.body
    let modeloFechaLapsoAcademico= new ModeloFechaLapsoAcademico()
    modeloFechaLapsoAcademico.setDatos(fechaLapsoInscripcion)
    let result =await modeloFechaLapsoAcademico.registrar()
    if(result.rowCount>0){
        respuesta_api.mensaje="registro completado"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="error al registrar las fechas del lapso"
        respuesta_api.estado_respuesta=false
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

ControladorFechaLapsoAcademico.consultar= async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let {id} = req.params
    let modeloFechaLapsoAcademico= new ModeloFechaLapsoAcademico()
    modeloFechaLapsoAcademico.setIdFechaLapsoAcademico(id)
    let result =await modeloFechaLapsoAcademico.consultar()
    if(result.rowCount>0){
        respuesta_api.datos=result.rows
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="error al consultar"
        respuesta_api.estado_respuesta=false
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

ControladorFechaLapsoAcademico.consultarPorAnoEscolor= async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let {id} = req.params
    let modeloFechaLapsoAcademico= new ModeloFechaLapsoAcademico()
    modeloFechaLapsoAcademico.setIdAnoEscolar(id)
    let result =await modeloFechaLapsoAcademico.consultarPorFechaLapsosPorAnoEscolar()
    if(result.rowCount>0){
        respuesta_api.datos=result.rows
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="error al consultar"
        respuesta_api.estado_respuesta=false
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

ControladorFechaLapsoAcademico.consultarTodos= async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let modeloFechaLapsoAcademico= new ModeloFechaLapsoAcademico()
    let result =await modeloFechaLapsoAcademico.consultarTodo()
    if(result.rowCount>0){
        respuesta_api.datos=result.rows
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="error al consultar"
        respuesta_api.estado_respuesta=false
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

ControladorFechaLapsoAcademico.actulizar= async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    let {fechaLapsoInscripcion} = req.body
    let modeloFechaLapsoAcademico= new ModeloFechaLapsoAcademico()
    modeloFechaLapsoAcademico.setDatos(fechaLapsoInscripcion)
    let result =await modeloFechaLapsoAcademico.actualizar()
    if(result.rowCount>0){
        respuesta_api.mensaje="actualización completado"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="error al registrar las fechas del lapso"
        respuesta_api.estado_respuesta=false
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

module.exports = ControladorFechaLapsoAcademico