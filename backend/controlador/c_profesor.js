const controladorProfesor={}
const ModeloProfesor= require("../modelo/m_profesor")

controladorProfesor.registrar=async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    const {profesor} = req.body
    let modelo_profesor = new ModeloProfesor()
    modelo_profesor.setDatos(profesor)
    const resultProfesor=await modelo_profesor.consultarPorCedula()
    if(resultProfesor.rowCount===0){
        const resultProfesor2=await modelo_profesor.registrar()
        respuesta_api.mensaje="Registro complatado"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="error al registrar( el profesor ya esta registrado)"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
    
}

controladorProfesor.consultar=async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    const {id} = req.params
    let modelo_profesor = new ModeloProfesor()
    modelo_profesor.setIdProfesor(id)
    let resultProfesor=await modelo_profesor.consultar()
    if(resultProfesor.rowCount>0){
        respuesta_api.datos=resultProfesor.rows
        respuesta_api.mensaje="consulta completada"
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

controladorProfesor.actualizar=async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    const {profesor} = req.body
    let modelo_profesor=new ModeloProfesor()
    modelo_profesor.setDatos(profesor)
    let resultProfesor=await modelo_profesor.actualizar()
    if(resultProfesor.rowCount > 0){
        respuesta_api.mensaje="actualización completada"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="error al actualizar (no se a encontrado el registro)"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

controladorProfesor.consultarTodos=async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    const {id} = req.params
    let modelo_profesor = new ModeloProfesor()
    modelo_profesor.setIdProfesor(id)
    let resultProfesor=await modelo_profesor.consultarTodos()
    if(resultProfesor.rowCount>0){
        respuesta_api.datos=resultProfesor.rows
        respuesta_api.mensaje="consulta completada"
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


module.exports = controladorProfesor