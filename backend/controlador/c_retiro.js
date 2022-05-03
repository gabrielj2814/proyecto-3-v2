const ControladorRetiro={}
const ModeloRetiro=require("../modelo/m_retiro")

const VitacoraControlador = require("./c_vitacora")

ControladorRetiro.registrar= async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    const {retiro} = req.body
    const modeloRetiro=new ModeloRetiro()
    modeloRetiro.setDatos(retiro)
    let resultRetiro=await modeloRetiro.registrar()
    if(resultRetiro.rowCount>0){
        respuesta_api.mensaje="solicitud de retiro enviada"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
        
    }
    else{
        respuesta_api.mensaje="No se pudo procesar el solicitud de retiro"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()

}

ControladorRetiro.actualizar= async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    const {retiro} = req.body
    const modeloRetiro=new ModeloRetiro()
    modeloRetiro.setIdRetiro(retiro.id_retiro)
    modeloRetiro.setEstado(retiro.estado_retiro)
    let resultRetiro=await modeloRetiro.actualizar()
    if(resultRetiro.rowCount>0){
        respuesta_api.mensaje="solicitud actualizado con existo"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
       
    }
    else{
        respuesta_api.mensaje="error al actualizar la solicitud de retiro"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

ControladorRetiro.consultar = async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    let { id_retiro } = req.params
    const modeloRetiro=new ModeloRetiro()
    modeloRetiro.setIdRetiro(id_retiro)
    let consultaRetiro=await modeloRetiro.consultar()
    if(consultaRetiro.rowCount>0){
        respuesta_api.datos=consultaRetiro.rows
        respuesta_api.mensaje="solicitud actualizado con existo"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
        
    }
    else{
        respuesta_api.mensaje="error al actualizar la solicitud de retiro"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

ControladorRetiro.consultarPorEstado= async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    const {estado,fechaDesde,fechaHasta} = req.params
    const modeloRetiro=new ModeloRetiro()
    modeloRetiro.setEstado(estado)
    let resultRetiro=await modeloRetiro.consultarPorEstado(fechaDesde,fechaHasta)
    if(resultRetiro.rowCount>0){
        respuesta_api.mensaje="retiros consultados"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
        respuesta_api.datos=resultRetiro.rows
    }
    else{
        respuesta_api.mensaje="error al consultar"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

module.exports = ControladorRetiro
