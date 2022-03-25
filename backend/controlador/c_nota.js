const ControladorNota={}
const ModeloNota= require("../modelo/m_nota")
const Moment=require("moment")

ControladorNota.crear=async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    const ControladorBoleta=require("./c_boleta")
    let {id_boleta} = req.params
    let estadoCreacion=false
    let listaErrores=[]
    let datosBoleta=await ControladorBoleta.consultarBoletaDelInscripto(id_boleta)
    if(datosBoleta.rowCount>0){
        for(let datos of datosBoleta.rows){
            estadoCreacion=true
            let modeloNota=new ModeloNota()
            let fecha=Moment().format("YYYY-MM-DD")
            let json={
                id_nota:"",
                id_boleta:id_boleta,
                id_objetivo_lapso_academico:datos.id_objetivo_lapso_academico,
                nota:"-",
                observacion_nota:"sin observación",
                fecha_nota:fecha,
            }
            modeloNota.setDatos(json)
            let resultNota=await modeloNota.crearNotaIndicador()
            if(resultNota.rowCount<=0){
                listaErrores.push(json)
            }
        }
        respuesta_api.mensaje="SI"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="sucees"
        respuesta_api.datos=listaErrores
    }
    else{
        respuesta_api.mensaje="NO"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()

}

ControladorNota.actualizarNota=async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    let modeloNota=new ModeloNota()
    let {nota} = req.body
    modeloNota.setIdNota(nota.id_nota)
    let resultNota=await modeloNota.actualizarNota(nota.nota)
    if(resultNota.rowCount>0){
        respuesta_api.mensaje="Actualizando nota"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="Error al actualizar nota"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

ControladorNota.consultarNotaBoleta=async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let modeloNota=new ModeloNota()
    let {id} = req.params
    modeloNota.setIdBoleta(id)
    let resultNota=await modeloNota.consultarNotasBoleta()
    if(resultNota.rowCount>0){
        respuesta_api.mensaje="Notas consultadas exitosamente"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
        respuesta_api.datos=resultNota.rows
    }
    else{
        respuesta_api.mensaje="Error al consultar las  notas de la boleta"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()

}

module.exports = ControladorNota