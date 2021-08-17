const controladorGrado={}

controladorGrado.registrar_grador=async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    const ModeloGrado=require("../modelo/m_grado")
    let {grado}=req.body
    let modeloGrado=new ModeloGrado()
    modeloGrado.setDatos(grado)
    let resultGrado=await modeloGrado.registrar()
    if(resultGrado.rowCount>0){
        respuesta_api.mensaje="registro completado"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="error al registrar el grado"
        respuesta_api.estado_respuesta=false
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
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



module.exports=controladorGrado