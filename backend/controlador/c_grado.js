const controladorGrado={}

const VitacoraControlador = require("./c_vitacora")

controladorGrado.registrar_grador=async (req,res, next) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    const ModeloGrado=require("../modelo/m_grado")
    let {grado, token}=req.body
    let modeloGrado=new ModeloGrado()
    modeloGrado.setDatos(grado)
    let resultGrado=await modeloGrado.registrar()
    if(resultGrado.rowCount>0){
        respuesta_api.mensaje="registro completado"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
        req.vitacora = VitacoraControlador.json(respuesta_api, token, "INSERT", "tgrado", grado.id_grado)
        next()
    }
    else{
        respuesta_api.mensaje="error al registrar el grado"
        respuesta_api.estado_respuesta=false
        respuesta_api.color_alerta="danger"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

controladorGrado.consultarTodos=async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    const ModeloGrado=require("../modelo/m_grado")
    let modeloGrado=new ModeloGrado()
    let resultGrado=await modeloGrado.consultarTodos()
    if(resultGrado.rowCount>0){
        respuesta_api.mensaje="consulta completada"
        respuesta_api.datos=resultGrado.rows
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

controladorGrado.consultar=async (req,res, next) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    const ModeloGrado=require("../modelo/m_grado")
    let {id, token}=req.params
    let modeloGrado=new ModeloGrado()
    modeloGrado.setIdGrado(id)
    let resultGrado=await modeloGrado.consultar()
    if(resultGrado.rowCount>0){
        respuesta_api.mensaje="consulta completada"
        respuesta_api.datos=resultGrado.rows
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
        req.vitacora = VitacoraControlador.json(respuesta_api, token, "SELECT", "tgrado", id)
        next()
    }
    else{
        respuesta_api.mensaje="no se a encontrado el registro en la base de datos"
        respuesta_api.estado_respuesta=false
        respuesta_api.color_alerta="danger"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

controladorGrado.actualizar= async (req,res, next) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    const ModeloGrado=require("../modelo/m_grado")
    let {grado, token}=req.body
    let {id}=req.params
    let modeloGrado=new ModeloGrado()
    modeloGrado.setDatos(grado)
    modeloGrado.setIdGrado(id)
    let resultGrado=await modeloGrado.consultar()
    if(resultGrado.rowCount>0){
        let resultGrado2=await modeloGrado.actualizar()
        if(resultGrado2.rowCount>0){
            respuesta_api.mensaje="actualización completada"
            respuesta_api.estado_respuesta=true
            respuesta_api.color_alerta="success"
            req.vitacora = VitacoraControlador.json(respuesta_api, token, "UPDATE", "tgrado", grado.id_grado)
            next()
        }
        else{
            respuesta_api.mensaje="error al actualizar"
            respuesta_api.estado_respuesta=false
            respuesta_api.color_alerta="danger"
            res.writeHead(200, { "Content-Type": "application/json" })
            res.write(JSON.stringify(respuesta_api))
            res.end()
        }
    }
    else{
        respuesta_api.mensaje="error al actualizar (este registro no se encuentra en la base de datos)"
        respuesta_api.estado_respuesta=false
        respuesta_api.color_alerta="warning"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}



module.exports=controladorGrado