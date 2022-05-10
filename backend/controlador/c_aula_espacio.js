const controladorAulaEspacio = {}
const ModeloAulaEspacio = require('../modelo/m_aula_espacio')
const VitacoraControlador = require("./c_vitacora")

controladorAulaEspacio.registrar = async(req, res, next) =>{
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" }
  let { aulaEspacio, token } = req.body
  let modeloAulaEspacio = new ModeloAulaEspacio()
  modeloAulaEspacio.setDatos(aulaEspacio)
  let aulaEspacioExist = await modeloAulaEspacio.consultarAulaEspacio()
  if (aulaEspacioExist.rowCount === 0) {
    let resultAulaEspacio = await modeloAulaEspacio.registrar()
    if (resultAulaEspacio.rowCount > 0) {
      respuesta_api.mensaje = "Registro completado con exito"
      respuesta_api.estado_respuesta = true
      respuesta_api.color_alerta = "success"
      req.vitacora = VitacoraControlador.json(respuesta_api, token, "INSERT", "taula_espacio", aulaEspacio.id_aula_espacio)
      next()
    }
    else {
      
      respuesta_api.mensaje = "Error al registrar Aula Espacio"
      respuesta_api.estado_respuesta = false
      respuesta_api.color_alerta = "danger"
      res.writeHead(200, { "Content-Type": "application/json" })
      res.write(JSON.stringify(respuesta_api))
      res.end()

    }

  } else {
    respuesta_api.mensaje = "Esta Aula Espacio ya se encuentra registrada"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "danger"
    res.writeHead(200, { "Content-Type": "application/json" })
    res.write(JSON.stringify(respuesta_api))
    res.end()
  }
}

controladorAulaEspacio.consultarTodos = async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  let modeloAulaEspacio = new ModeloAulaEspacio()
  let resultAulaEspacio = await modeloAulaEspacio.consultarTodos()
  if (resultAulaEspacio.rowCount > 0) {
    respuesta_api.mensaje = "Consulta completada"
    respuesta_api.datos = resultAulaEspacio.rows
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
  }
  else {
    respuesta_api.mensaje = "No se ha encontrado registro en la base de datos"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "danger"
  }
  res.writeHead(200, { "Content-Type": "application/json" })
  res.write(JSON.stringify(respuesta_api))
  res.end()
}

controladorAulaEspacio.consultar = async (req, res, next) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  let { id, token } = req.params
  let modeloAulaEspacio = new ModeloAulaEspacio()
  modeloAulaEspacio.setIdAulaEspacio(id)
  let resultAulaEspacio = await modeloAulaEspacio.consultar()
  if (resultAulaEspacio.rowCount > 0) {
    respuesta_api.mensaje = "Consulta completada"
    respuesta_api.datos = resultAulaEspacio.rows
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
    req.vitacora = VitacoraControlador.json(respuesta_api, token, "SELECT", "taula_espacio", id)
    next()
  }
  else {
    respuesta_api.mensaje = "No se ha encontrado el registro en la base de datos"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "danger"
    res.writeHead(200, { "Content-Type": "application/json" })
    res.write(JSON.stringify(respuesta_api))
    res.end()
  }
}

controladorAulaEspacio.actualizar = async (req, res, next) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" }
  let { aulaEspacio, token } = req.body
  let { id } = req.params
  let modeloAulaEspacio = new ModeloAulaEspacio()
  modeloAulaEspacio.setDatos(aulaEspacio)
  modeloAulaEspacio.setIdAulaEspacio(id)
  let resultAulaEspacio = await modeloAulaEspacio.consultar()
  if (resultAulaEspacio.rowCount > 0) {
    let resultAulaEspacio2 = await modeloAulaEspacio.actualizar()
    if (resultAulaEspacio2.rowCount > 0) {
      respuesta_api.mensaje = "Actualización completada"
      respuesta_api.estado_respuesta = true
      respuesta_api.color_alerta = "success"
      req.vitacora = VitacoraControlador.json(respuesta_api, token, "UPDATE", "taula_espacio", aulaEspacio.id_aula_espacio)
      next()
    }
    else {
      respuesta_api.mensaje = "Error al actualizar"
      respuesta_api.estado_respuesta = false
      respuesta_api.color_alerta = "danger"
      res.writeHead(200, { "Content-Type": "application/json" })
      res.write(JSON.stringify(respuesta_api))
      res.end()
    }
  }
  else {
    respuesta_api.mensaje = "Error al actualizar (este registro no se encuentra en la base de datos)"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "warning"
    res.writeHead(200, { "Content-Type": "application/json" })
    res.write(JSON.stringify(respuesta_api))
    res.end()
  }
  
}


module.exports = controladorAulaEspacio