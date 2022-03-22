const ControladorBoleta={}
const ModeloBoleta= require("../modelo/m_Boleta")

ControladorBoleta.registrar= async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    const {boleta} = req.body
    let modeloBoleta = new ModeloBoleta()
    modeloBoleta.setDatos(boleta)
    let resultBoleta=await modeloBoleta.consultarTodasLasBoletasDelInscripto()
    if(resultBoleta.rowCount===0){
        const resultRegistroBoleta=await modeloBoleta.registrar()
        if(resultRegistroBoleta.rowCount>0){
                respuesta_api.mensaje="Registro completado"
                respuesta_api.estado_respuesta=true
                respuesta_api.color_alerta="success"
        }
        else{
            respuesta_api.mensaje="error al registrar la boleta"
            respuesta_api.estado_respuesta=true
            respuesta_api.color_alerta="danger"
        }
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()


}


ControladorBoleta.registrarMasivo= async (req,res) => {
    const respuesta_api={mensaje:"",boletasCreadas:[],boletasNoCreadas:[],estado_respuesta:false,color_alerta:""}
    const {boletas} = req.body
    let boletasCreadas=[]
    let boletasNoCreadas=[]
    for(let boleta of boletas){
        let modeloBoleta = new ModeloBoleta()
        modeloBoleta.setDatos(boleta)
        let resultBoleta=await modeloBoleta.consultarTodasLasBoletasDelInscripto()
        if(resultBoleta.rowCount===0){
            const resultRegistroBoleta=await modeloBoleta.registrar()
            if(resultRegistroBoleta.rowCount>0){
                boletasCreadas.push(boleta)
            }
            else{
                boletasNoCreadas.push(boleta)
            }
        }
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

ControladorBoleta.consultarTodasLasBoletasDelInscripto= async (req,res) => {

}

ControladorBoleta.consultarTodasLasBoleta= async (req,res) => {

}

ControladorBoleta.actualizarObservacion= async (req,res) => {

}

module.exports = ControladorBoleta