let ModeloFechaInscripcion=require("../modelo/m_fecha_inscripcion")
let ControladorFechaInscripcion={}

ControladorFechaInscripcion.registrar=async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    let {fecha_inscripcion}=req.body
    let modeloFechaInscripcion=new ModeloFechaInscripcion()
    modeloFechaInscripcion.setDatos(fecha_inscripcion)
    let resultFecha=await modeloFechaInscripcion.registrar()
    if(resultFecha.rowCount>0){
        respuesta_api.mensaje="registro completado"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="error al registrar la fecha inscripcion"
        respuesta_api.estado_respuesta=false
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

ControladorFechaInscripcion.consultarFechaServidor=async (req,res) => {
    const Moment=require("moment")
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify({
        fechaServidor:Moment().format("YYYY-MM-DD")
    }))
    res.end()
}

ControladorFechaInscripcion.consultarFechaInscripcionActual=async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let modeloFechaInscripcion=new ModeloFechaInscripcion()
    let resultFecha=await modeloFechaInscripcion.consultarFechaInscripcionActual()
    if(resultFecha.rowCount>0){
        respuesta_api.mensaje="consulta completada"
        respuesta_api.datos=resultFecha.rows[0]
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

ControladorFechaInscripcion.consultar=async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let {id}=req.params
    let modeloFechaInscripcion=new ModeloFechaInscripcion()
    modeloFechaInscripcion.setIdFechaInscripcion(id)
    let resultFecha=await modeloFechaInscripcion.consultar()
    if(resultFecha.rowCount>0){
        respuesta_api.mensaje="consulta completada"
        respuesta_api.datos=resultFecha.rows[0]
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

ControladorFechaInscripcion.consultarTodo=async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let modeloFechaInscripcion=new ModeloFechaInscripcion()
    let resultFecha=await modeloFechaInscripcion.consultarTodo()
    if(resultFecha.rowCount>0){
        respuesta_api.mensaje="consulta completada"
        respuesta_api.datos=resultFecha.rows
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

ControladorFechaInscripcion.consultarTodo2=async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let modeloFechaInscripcion=new ModeloFechaInscripcion()
    let resultFecha=await modeloFechaInscripcion.consultarTodo2()
    if(resultFecha.rowCount>0){
        respuesta_api.mensaje="consulta completada"
        respuesta_api.datos=resultFecha.rows
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

ControladorFechaInscripcion.actualizar=async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    let {fecha_inscripcion}=req.body
    let modeloFechaInscripcion=new ModeloFechaInscripcion()
    modeloFechaInscripcion.setDatos(fecha_inscripcion)
    let resultFecha=await modeloFechaInscripcion.actualizar()
    if(resultFecha.rowCount>0){
        respuesta_api.mensaje="actualización completada"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="error al actualizar la fecha inscripcion"
        respuesta_api.estado_respuesta=false
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

ControladorFechaInscripcion.reAbrirInscripcion=async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    let {id}=req.params
    let modeloFechaInscripcion=new ModeloFechaInscripcion()
    modeloFechaInscripcion.setIdFechaInscripcion(id)
    let resultFecha=await modeloFechaInscripcion.reAbrirInscripcion()
    if(resultFecha.rowCount>0){
        respuesta_api.mensaje="se ha re-aperturar la inscripción"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="error al re-aperturar la inscripción (ya se reaperturo la inscripcion y por lo mismo ya no se puede volver abrir)"
        respuesta_api.estado_respuesta=false
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

ControladorFechaInscripcion.cerrarInscripcion=async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    let {id}=req.params
    let modeloFechaInscripcion=new ModeloFechaInscripcion()
    modeloFechaInscripcion.setIdFechaInscripcion(id)
    let resultFecha=await modeloFechaInscripcion.cerrarInscripcion()
    if(resultFecha.rowCount>0){
        respuesta_api.mensaje="se ha cerrado la inscripción"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="error al cerrar inscripción"
        respuesta_api.estado_respuesta=false
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

ControladorFechaInscripcion.verficarCierreDeInscripcion=async (req,res) => {}


module.exports= ControladorFechaInscripcion