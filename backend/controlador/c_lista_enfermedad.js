const controladorListaEnfermedad = {}
const VitacoraControlador = require("./c_vitacora")

controladorListaEnfermedad.registrar_enfermedad = async (req, res,next) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" }
  const ModeloEnfermedad = require("../modelo/m_lista_enfermedad")
  let { enfermedad, token } = req.body
  let modeloEnfermedad = new ModeloEnfermedad()
  modeloEnfermedad.setDatos(enfermedad)
  let resultEnfermedad = await modeloEnfermedad.registrar()
  if (resultEnfermedad.rowCount > 0) {
    respuesta_api.mensaje = "Registro completado"
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
    req.vitacora = VitacoraControlador.json(respuesta_api, token, "INSERT", "tlista_enfermedad", enfermedad.id_enfermedad)
    next()
  }
  else {
    respuesta_api.mensaje = "Error al registrar el grado"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "danger"
    res.writeHead(200, { "Content-Type": "application/json" })
    res.write(JSON.stringify(respuesta_api))
    res.end()
  }
}

controladorListaEnfermedad.consultarTodos = async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloEnfermedad = require("../modelo/m_lista_enfermedad")
  let modeloEnfermedad = new ModeloEnfermedad()
  let resultEnfermedad = await modeloEnfermedad.consultarTodos()
  if (resultEnfermedad.rowCount > 0) {
    respuesta_api.mensaje = "Consulta completada"
    respuesta_api.datos = resultEnfermedad.rows
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

controladorListaEnfermedad.consultar = async (req, res, next) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloEnfermedad = require("../modelo/m_lista_enfermedad")
  let { id , token} = req.params
  let modeloEnfermedad = new ModeloEnfermedad()
  modeloEnfermedad.setIdEnfermedad(id)
  let resultEnfermedad = await modeloEnfermedad.consultar()
  if (resultEnfermedad.rowCount > 0) {
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.datos = resultEnfermedad.rows
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
    req.vitacora = VitacoraControlador.json(respuesta_api, token, "SELECT", "tlista_enfermedad", id)
    next()
  }
  else {
    respuesta_api.mensaje = "No se ha encontrado registro en la base de datos"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "danger"
    res.writeHead(200, { "Content-Type": "application/json" })
    res.write(JSON.stringify(respuesta_api))
    res.end()
  }
}

controladorListaEnfermedad.consultarpatron = async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloEnfermedad = require("../modelo/m_lista_enfermedad");
  const patron = req.params.patron
  let modeloEnfermedad = new ModeloEnfermedad()
  let resultEnfermedad = await modeloEnfermedad.consultarPatron(patron)

  if (resultEnfermedad.rowCount > 0) {
    respuesta_api.mensaje = "Consulta completada"
    respuesta_api.datos = resultEnfermedad.rows
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

controladorListaEnfermedad.actualizar = async (req, res, next) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" }
  const ModeloEnfermedad = require("../modelo/m_lista_enfermedad")
  let { enfermedad, token } = req.body
  let { id } = req.params
  let modeloEnfermedad = new ModeloEnfermedad()
  modeloEnfermedad.setDatos(enfermedad)
  modeloEnfermedad.setIdEnfermedad(id)
  let resultEnfermedad = await modeloEnfermedad.consultar()
  if (resultEnfermedad.rowCount > 0) {
    let resultEnfermedad2 = await modeloEnfermedad.actualizar()
    if (resultEnfermedad2.rowCount > 0) {
      respuesta_api.mensaje = "Actualización completada"
      respuesta_api.estado_respuesta = true
      respuesta_api.color_alerta = "success"
      req.vitacora = VitacoraControlador.json(respuesta_api, token, "UPDATE", "tlista_enfermedad", enfermedad.id_enfermedad)
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

module.exports = controladorListaEnfermedad;