const controladorRepresentante = {};

controladorRepresentante.registrar_representante = async(req, res) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" };
  const ModeloRepresentante = require("../modelo/m_representante");
  let { representante } = req.body
  let modeloRepresentante = new ModeloRepresentante()
  modeloRepresentante.setDatos(representante)
  let resultRepresentante = await modeloRepresentante.registrar()
  if (resultRepresentante.rowCount > 0) {
    respuesta_api.mensaje = "registro completado"
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
  }
  else {
    respuesta_api.mensaje = "error al registrar el representante"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "danger"
  }
  res.writeHead(200, { "Content-Type": "application/json" })
  res.write(JSON.stringify(respuesta_api))
  res.end()
}

controladorRepresentante.consultar_todos = async(req, res) =>{
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloRepresentante = require("../modelo/m_representante");
  let modeloRepresentante = new ModeloRepresentante()
  let resultRepresentante = await modeloRepresentante.consultarTodos()

  if (resultRepresentante.rowCount > 0) {
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.datos = resultRepresentante.rows
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
  }
  else {
    respuesta_api.mensaje = "no se a encontrado registro en la base de datos"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "danger"
  }
  res.writeHead(200, { "Content-Type": "application/json" })
  res.write(JSON.stringify(respuesta_api))
  res.end()
}

controladorRepresentante.consultar = async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloRepresentante = require("../modelo/m_representante");
  let { id } = req.params
  let modeloRepresentante = new ModeloRepresentante()
  modeloRepresentante.setIdRepresentante(id)
  let resultRepresentante = await modeloRepresentante.consultar()

  if (resultRepresentante.rowCount > 0) {
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.datos = resultRepresentante.rows
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
  }
  else {
    respuesta_api.mensaje = "no se a encontrado registro en la base de datos"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "danger"
  }
  res.writeHead(200, { "Content-Type": "application/json" })
  res.write(JSON.stringify(respuesta_api))
  res.end()

}

controladorRepresentante.consultarRepresentantesActivos = async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloRepresentante = require("../modelo/m_representante");
  let modeloRepresentante = new ModeloRepresentante()
  let resultRepresentante = await modeloRepresentante.consultarRepresentantesActivos()

  if (resultRepresentante.rowCount > 0) {
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.datos = resultRepresentante.rows
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
  }
  else {
    respuesta_api.mensaje = "no se a encontrado registro en la base de datos"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "danger"
  }
  res.writeHead(200, { "Content-Type": "application/json" })
  res.write(JSON.stringify(respuesta_api))
  res.end()

}

controladorRepresentante.consultarRepresentantesInactivos = async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloRepresentante = require("../modelo/m_representante");
  let modeloRepresentante = new ModeloRepresentante()
  let resultRepresentante = await modeloRepresentante.consultarRepresentantesInactivos()

  if (resultRepresentante.rowCount > 0) {
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.datos = resultRepresentante.rows
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
  }
  else {
    respuesta_api.mensaje = "no se a encontrado registro en la base de datos"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "danger"
  }
  res.writeHead(200, { "Content-Type": "application/json" })
  res.write(JSON.stringify(respuesta_api))
  res.end()

}

controladorRepresentante.consultarpatron = async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloRepresentante = require("../modelo/m_representante");
  const patron = req.params.patron
  let modeloRepresentante = new ModeloRepresentante()
  let resultRepresentante = await modeloRepresentante.consultarpatron(patron)

  if (resultRepresentante.rowCount > 0) {
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.datos = resultRepresentante.rows
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
  }
  else {
    respuesta_api.mensaje = "no se a encontrado registro en la base de datos"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "danger"
  }
  res.writeHead(200, { "Content-Type": "application/json" })
  res.write(JSON.stringify(respuesta_api))
  res.end()
}

controladorRepresentante.actualizar = async (req, res) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" }
  const ModeloRepresentante = require("../modelo/m_representante");
  let { representante } = req.body
  let { id } = req.params
  let modeloRepresentante = new ModeloRepresentante()
  modeloRepresentante.setDatos(representante)
  modeloRepresentante.setIdRepresentante(id)

  let resultRepresentante = ""

  if (representante.nueva_cedula) {
    resultRepresentante = await modeloRepresentante.actualizar_2();
  }else {
    resultRepresentante = await modeloRepresentante.actualizar();
  }

  if (resultRepresentante.rowCount > 0) {
    respuesta_api.mensaje = "actualización completada"
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
  }
  else {
    respuesta_api.mensaje = "error al actualizar (este registro no se encuentra en la base de datos)"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "warning"
  }
  res.writeHead(200, { "Content-Type": "application/json" })
  res.write(JSON.stringify(respuesta_api))
  res.end()
}

module.exports = controladorRepresentante;