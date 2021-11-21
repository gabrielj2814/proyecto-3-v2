const controladorListaVacuna = {}

controladorListaVacuna.registrar_vacuna = async (req, res) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" }
  const ModeloVacuna = require("../modelo/m_lista_vacuna")
  let { vacuna } = req.body
  let modeloVacuna = new ModeloVacuna()
  modeloVacuna.setDatos(vacuna)
  let resultVacuna = await modeloVacuna.registrar()
  if (resultVacuna.rowCount > 0) {
    respuesta_api.mensaje = "registro completado"
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
  }
  else {
    respuesta_api.mensaje = "error al registrar el grado"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "danger"
  }
  res.writeHead(200, { "Content-Type": "application/json" })
  res.write(JSON.stringify(respuesta_api))
  res.end()
}

controladorListaVacuna.consultarTodos = async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloVacuna = require("../modelo/m_lista_vacuna")
  let modeloVacuna = new ModeloVacuna()
  let resultVacuna = await modeloVacuna.consultarTodos()
  if (resultVacuna.rowCount > 0) {
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.datos = resultVacuna.rows
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

controladorListaVacuna.consultar = async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloVacuna = require("../modelo/m_lista_vacuna")
  let { id } = req.params
  let modeloVacuna = new ModeloVacuna()
  modeloVacuna.setIdVacuna(id)
  let resultVacuna = await modeloVacuna.consultar()
  if (resultVacuna.rowCount > 0) {
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.datos = resultVacuna.rows
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

controladorListaVacuna.actualizar = async (req, res) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" }
  const ModeloVacuna = require("../modelo/m_lista_vacuna")
  let { vacuna } = req.body
  let { id } = req.params
  let modeloVacuna = new ModeloVacuna()
  modeloVacuna.setDatos(vacuna)
  modeloVacuna.setIdVacuna(id)
  let resultVacuna = await modeloVacuna.consultar()
  if (resultVacuna.rowCount > 0) {
    let resultVacuna2 = await modeloVacuna.actualizar()
    if (resultVacuna2.rowCount > 0) {
      respuesta_api.mensaje = "actualización completada"
      respuesta_api.estado_respuesta = true
      respuesta_api.color_alerta = "success"
    }
    else {
      respuesta_api.mensaje = "error al actualizar"
      respuesta_api.estado_respuesta = false
      respuesta_api.color_alerta = "danger"
    }
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

module.exports = controladorListaVacuna;