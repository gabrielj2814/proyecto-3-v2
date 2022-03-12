const controladorInscripcion = {}

controladorInscripcion.registrar_inscripcion = async ( req, res) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" };
  const ModeloInscripcion = require("../modelo/m_inscripcion");
  let { inscripcion } = req.body
  let modeloInscripcion = new ModeloInscripcion()
  modeloInscripcion.setDatos(inscripcion)
  let resultInscripcion= await modeloInscripcion.registrar()
  if(resultInscripcion.rowCount>0){
      respuesta_api.mensaje="registro completado"
      respuesta_api.estado_respuesta=true
      respuesta_api.color_alerta="success"
  }
  else{
      respuesta_api.mensaje="error al realizar la inscripción"
      respuesta_api.estado_respuesta=false
      respuesta_api.color_alerta="danger"
  }
  res.writeHead(200,{"Content-Type":"application/json"})
  res.write(JSON.stringify(respuesta_api))
  res.end()
}

controladorInscripcion.consultarTodas= async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    const ModeloInscripcion=require('../modelo/m_inscripcion')
    let modeloInscripcion=new ModeloInscripcion()
    let resultInscripcion = await modeloInscripcion.consultarTodas()
    if(resultInscripcion.rowCount>0){
        respuesta_api.mensaje="consulta completada"
        respuesta_api.datos=resultInscripcion.rows
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="no se a encontrado registro en la base de datos"
        respuesta_api.estado_respuesta=false
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

controladorInscripcion.consultar=async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    const ModeloInscripcion=require('../modelo/m_inscripcion')
    let {id}=req.params
    let modeloInscripcion=new ModeloInscripcion()
    modeloInscripcion.setIdInscripcion(id)
    let resultInscripcion=await modeloInscripcion.consultar()
    if(resultInscripcion.rowCount>0){
        respuesta_api.mensaje="consulta completada"
        respuesta_api.datos=resultInscripcion.rows
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="no se a encontrado el registro en la base de datos"
        respuesta_api.estado_respuesta=false
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

controladorInscripcion.actualizar= async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    const ModeloInscripcion=require('../modelo/m_inscripcion')
    let {inscripcion}=req.body
    let {id}=req.params
    let modeloInscripcion=new ModeloInscripcion()
    modeloInscripcion.setDatos(inscripcion)
    modeloInscripcion.setIdInscripcion(id)
    let resultInscripcion=await modeloInscripcion.actualizar()
    if(resultInscripcion.rowCount>0){
        let resultInscripcion2=await modeloInscripcion.actualizar()
        if(resultInscripcion2.rowCount>0){
            respuesta_api.mensaje="actualización completada"
            respuesta_api.estado_respuesta=true
            respuesta_api.color_alerta="success"
        }
        else{
            respuesta_api.mensaje="error al actualizar"
            respuesta_api.estado_respuesta=false
            respuesta_api.color_alerta="danger"
        }
    }
    else{
        respuesta_api.mensaje="error al actualizar (este registro no se encuentra en la base de datos)"
        respuesta_api.estado_respuesta=false
        respuesta_api.color_alerta="warning"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}



module.exports = controladorInscripcion
