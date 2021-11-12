const ModuloVacuna=require("../modelo/m_vacuna")
const ControladorVacuna={}


ControladorVacuna.registrar=async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    let {vacuna} = req.body
    let Vacuna=new ModuloVacuna()
    Vacuna.setDatos(vacuna)
    let resultVacuna=await Vacuna.registrar()
    if(resultVacuna.rowCount>0){
        respuesta_api.mensaje="Registro completado"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="error al registrar"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}



module.exports = ControladorVacuna