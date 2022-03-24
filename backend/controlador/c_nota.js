const ControladorNota={}
const ModeloNota= require("../modelo/m_nota")

ControladorNota.crear=async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    const ControladorBoleta=require("./c_boleta")
    let {id_boleta} = req.params
    let datosBoleta=await ControladorBoleta.consultarBoletaDelInscripto(id_boleta)
    // let modeloNota=new ModeloNota()

}

ControladorNota.actualizarNota=async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    let modeloNota=new ModeloNota()

}

ControladorNota.consultarNotaBoleta=async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    let modeloNota=new ModeloNota()

}

module.exports = ControladorNota