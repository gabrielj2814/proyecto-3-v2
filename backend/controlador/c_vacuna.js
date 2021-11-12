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

ControladorVacuna.consultar=async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let {id} = req.params
    let Vacuna=new ModuloVacuna()
    Vacuna.setIdVacuna(id)
    let resultVacuna=await Vacuna.consultar()
    if(resultVacuna.rowCount>0){
        respuesta_api.datos=resultVacuna.rows
        respuesta_api.mensaje="Consulta completada"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
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

ControladorVacuna.consultarTodos=async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let Vacuna=new ModuloVacuna()
    let resultVacuna=await Vacuna.consultarTodos()
    if(resultVacuna.rowCount>0){
        respuesta_api.datos=resultVacuna.rows
        respuesta_api.mensaje="Consulta completada"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
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


module.exports = ControladorVacuna