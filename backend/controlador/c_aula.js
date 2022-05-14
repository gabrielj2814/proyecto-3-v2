const ModeloAula=require("../modelo/m_aula")

const ControladorAula={}
const VitacoraControlador = require("./c_vitacora")

ControladorAula.registrar=async (req,res, next) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    let {aula, token} = req.body
    let Aula=new ModeloAula()
    Aula.setDatos(aula)
    let resultAula=await Aula.registrar()
    if(resultAula.rowCount>0){
        respuesta_api.mensaje="Registro completado"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
        req.vitacora = VitacoraControlador.json(respuesta_api, token, "INSERT", "taula", aula.id_aula)
        next()
    }
    else{
        respuesta_api.mensaje="error al registrar"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }

}


ControladorAula.consultarTodos=async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let Aula=new ModeloAula()
    let resultAula=await Aula.consultarTodos()
    if(resultAula.rowCount>0){
        respuesta_api.datos=resultAula.rows
        respuesta_api.mensaje="Consulta completada"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="error al consultar no hay aulas"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

ControladorAula.consultar=async (req,res, next) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let {id, token} = req.params
    let Aula=new ModeloAula()
    Aula.setIdAula(id)
    let resultAula=await Aula.consultar()
    if(resultAula.rowCount>0){
        respuesta_api.datos=resultAula.rows
        respuesta_api.mensaje="Consulta completada"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
        req.vitacora = VitacoraControlador.json(respuesta_api, token, "SELECT", "taula",id)
        next()
    }
    else{
        respuesta_api.mensaje="error al consultar no hay aulas"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

ControladorAula.actualizar=async (req,res, next) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    let {aula, token} = req.body
    let Aula=new ModeloAula()
    Aula.setDatos(aula)
    let resultAula=await Aula.actualizar()
    if(resultAula.rowCount>0){
        respuesta_api.mensaje="Actualización completada"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
        req.vitacora = VitacoraControlador.json(respuesta_api, token, "UPDATE", "taula", aula.id_aula)
        next()
    }
    else{
        respuesta_api.mensaje="error al actualizar (este registro no se encuantran en la base de datos)"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    } 

}


ControladorAula.consultarAulasPorGrado=async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let {id} = req.params
    let Aula=new ModeloAula()
    Aula.setIdGrado(id)
    let resultAula=await Aula.consultarAulaPorGrado()
    if(resultAula.rowCount>0){
        respuesta_api.datos=resultAula.rows
        respuesta_api.mensaje="Consulta completada"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="error al consultar no hay aulas"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

ControladorAula.consultarAulasPorGrado2=async (id) => {
    let Aula=new ModeloAula()
    Aula.setIdGrado(id)
    let resultAula=await Aula.consultarAulaPorGrado()
    return resultAula
}

module.exports=ControladorAula