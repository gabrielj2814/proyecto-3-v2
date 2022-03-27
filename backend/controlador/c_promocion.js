const ControladorPromocion={}
const ModeloPromocion= require("../modelo/m_promocion")

ControladorPromocion.registrar= async () => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    const {promocion} = req.body
    let modeloPromocion = new ModeloPromocion()
    modeloPromocion.setDatos(promocion)
    const resultPromocion=await modeloPromocion.registrar()
    if(resultPromocion.rowCount>0){
        respuesta_api.mensaje="Registro completado"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="error al registrar(la promocion)"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

ControladorPromocion.consultar= async () => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    const {id} = req.params
    let modeloPromocion = new ModeloPromocion()
    modeloPromocion.setIdPromocion(id)
    const resultPromocion=await modeloPromocion.consultar()
    if(resultPromocion.rowCount>0){
        respuesta_api.mensaje="consula completada"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
        respuesta_api.datos=resultPromocion.rows
    }
    else{
        respuesta_api.mensaje="error al consultar(la promocion)"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

ControladorPromocion.consultarPorInscripcion= async () => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    const {id} = req.params
    let modeloPromocion = new ModeloPromocion()
    modeloPromocion.setIdInscripcion(id)
    const resultPromocion=await modeloPromocion.consultarPorIdInscripcion()
    if(resultPromocion.rowCount>0){
        respuesta_api.mensaje="consula completada"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
        respuesta_api.datos=resultPromocion.rows
    }
    else{
        respuesta_api.mensaje="error al consultar(la promocion)"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

ControladorPromocion.actualizar= async () => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    const {promocion} = req.body
    let modeloPromocion = new ModeloPromocion()
    modeloPromocion.setDatos(promocion)
    const resultPromocion=await modeloPromocion.actualizar()
    if(resultPromocion.rowCount>0){
        respuesta_api.mensaje="actualización completado"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="error al actualizar"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}


module.exports= ControladorPromocion