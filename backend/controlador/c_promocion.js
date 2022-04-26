const ControladorPromocion={}
const ModeloPromocion= require("../modelo/m_promocion")

ControladorPromocion.registrar= async (req,res) => {
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

ControladorPromocion.consultar= async (req,res) => {
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

ControladorPromocion.consultarTodos= async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let modeloPromocion = new ModeloPromocion()
    const resultPromocion=await modeloPromocion.consultarTodos()
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

ControladorPromocion.consultarPorInscripcion= async (req,res) => {
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

ControladorPromocion.actualizar= async (req,res) => {
    const ControladorInscripcion=require("./c_inscripcion")
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    const {promocion} = req.body
    let { id } = req.params
    let modeloPromocion = new ModeloPromocion()
    modeloPromocion.setDatos(promocion)
    modeloPromocion.setIdInscripcion(id)
    const resultPromocion=await modeloPromocion.actualizar()
    if(resultPromocion.rowCount>0){
      if(promocion.estatus_promocion === "A"){
        if(ControladorInscripcion.culminarInscripcion(promocion.id_inscripcion)){
          respuesta_api.mensaje="actualización completado"
          respuesta_api.estado_respuesta=true
          respuesta_api.color_alerta="success"
        }else{
          respuesta_api.mensaje="error: se creo la promocion pero no se pudo culminar la inscripción"
          respuesta_api.estado_respuesta=true
          respuesta_api.color_alerta="danger"
        }
      }else{
        respuesta_api.mensaje="actualización completado"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
      }
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

ControladorPromocion.consultarEstudiantesAsignados= async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    const controladorInscripcion=require("./c_inscripcion")
    let {cedula_profesor} = req.params
    let datos=await controladorInscripcion.obtenerEstudianteProfesor2(cedula_profesor)
    if(datos.estado){
        respuesta_api.mensaje="lista de estudiantes"
        respuesta_api.datos=datos.listaDeEstudiantes
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="no tiene estudiantes"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }

    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}


module.exports= ControladorPromocion
