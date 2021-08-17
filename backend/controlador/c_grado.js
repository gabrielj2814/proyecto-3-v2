const controlador_grado={}

controlador_grado.registrar_grador=async (req,res) => {
    const respuesta_api={mensaje:"hola",estado_respuesta:false,color_alerta:""}
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()

}


module.exports=controlador_grado