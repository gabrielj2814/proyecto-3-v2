const controladorEspecialista = {}
const ModuloEspecialista = require("../modelo/m_especialista")
const VitacoraControlador = require("./c_vitacora")

controladorEspecialista.registrar = async (req, res, next) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" }
  const { especialista, token } = req.body
  let modelo_especialista = new ModuloEspecialista()
  modelo_especialista.setDatos(especialista)
  const resultEspecialista = await modelo_especialista.registrar()
  if (resultEspecialista.rowCount > 0) {
    respuesta_api.mensaje = "Registro completado con exito."
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
    req.vitacora = VitacoraControlador.json(respuesta_api, token, "INSERT", "tespecialista", especialista.id_especialista)
    next()
  }
  else {
    respuesta_api.mensaje = "Error al registrar"
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "danger"
    res.writeHead(200, { "Content-Type": "application/json" })
    res.write(JSON.stringify(respuesta_api))
    res.end()
  }
}

controladorEspecialista.consultar = async (req, res, next) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const { id, token } = req.params
  let modelo_especialista = new ModuloEspecialista()
  modelo_especialista.setIdEspecialista(id)
  let resultEspecialista = await modelo_especialista.consultar()
  if (resultEspecialista.rowCount > 0) {
    respuesta_api.datos = resultEspecialista.rows
    respuesta_api.mensaje = "Consulta completada"
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
    req.vitacora = VitacoraControlador.json(respuesta_api, token, "SELECT", "tespecialista", id)
    next()
  }
  else {
    respuesta_api.mensaje = "Error al consultar"
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "danger"
    res.writeHead(200, { "Content-Type": "application/json" })
    res.write(JSON.stringify(respuesta_api))
    res.end()
  }
}


controladorEspecialista.actualizar = async (req, res, next) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" }
  const { especialista, token } = req.body
  let { id } = req.params
  let modelo_especialista = new ModuloEspecialista()
  modelo_especialista.setDatos(especialista)
  modelo_especialista.setIdEspecialista(id)
  let resultEspecialista = await modelo_especialista.actualizar()
  if (resultEspecialista.rowCount > 0) {
    respuesta_api.mensaje = "Actualización completada"
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
    req.vitacora = VitacoraControlador.json(respuesta_api, token, "UPDATE", "tespecialista", especialista.id_especialista)
    next()
  }
  else {
    respuesta_api.mensaje = "Error al actualizar (no se a encontrado este registro)"
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "danger"
    res.writeHead(200, { "Content-Type": "application/json" })
    res.write(JSON.stringify(respuesta_api))
    res.end()
  }
}

controladorEspecialista.consultarPorCedula = async (req, res, next) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const { cedula, token } = req.params
  let modelo_especialista = new ModuloEspecialista()
  modelo_especialista.setCedulaEspecialista(cedula)
  let resultEspecialista = await modelo_especialista.consultarPorCedula()
  if (resultEspecialista.rowCount > 0) {
    respuesta_api.datos = resultEspecialista.rows
    respuesta_api.mensaje = "Consulta completada"
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
    req.vitacora = VitacoraControlador.json(respuesta_api, token, "SELECT", "tespecialista", cedula)
    next()
  }
  else {
    respuesta_api.mensaje = "Error al consultar"
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "danger"
    res.writeHead(200, { "Content-Type": "application/json" })
    res.write(JSON.stringify(respuesta_api))
    res.end()
  }
}

controladorEspecialista.consultar_todos = async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  let modelo_especialista = new ModuloEspecialista()
  let resultEspecialista = await modelo_especialista.consultarTodos()
  if (resultEspecialista.rowCount > 0) {
    respuesta_api.datos = resultEspecialista.rows
    respuesta_api.mensaje = "Consulta completada"
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
  }
  else {
    respuesta_api.mensaje = "Error al consultar"
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "danger"
  }
  res.writeHead(200, { "Content-Type": "application/json" })
  res.write(JSON.stringify(respuesta_api))
  res.end()
}

controladorEspecialista.consultar_todos_activos = async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  let modelo_especialista = new ModuloEspecialista()
  let resultEspecialista = await modelo_especialista.consultarTodosActivos()
  if (resultEspecialista.rowCount > 0) {
    respuesta_api.datos = resultEspecialista.rows
    respuesta_api.mensaje = "Consulta completada"
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
  }
  else {
    respuesta_api.mensaje = "Error al consultar"
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "danger"
  }
  res.writeHead(200, { "Content-Type": "application/json" })
  res.write(JSON.stringify(respuesta_api))
  res.end()
}


module.exports = controladorEspecialista
