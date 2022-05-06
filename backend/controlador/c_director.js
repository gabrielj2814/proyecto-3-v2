const controladorDirector = {}

const VitacoraControlador = require("./c_vitacora")

controladorDirector.registrar_director = async (req, res, next) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" }
  const ModeloDirector = require("../modelo/m_director")
  let { director, token } = req.body
  let modeloDirector = new ModeloDirector()
  modeloDirector.setDatos(director)
  let resultDirector = await modeloDirector.registrar()
  if (resultDirector.rowCount > 0) {
    respuesta_api.mensaje = "Registro completado"
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
    req.vitacora = VitacoraControlador.json(respuesta_api, token, "INSERT", "tdirector", director.id_director)
    next()
  }
  else {
    respuesta_api.mensaje = "Error al registrar el director"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "danger"
    res.writeHead(200, { "Content-Type": "application/json" })
    res.write(JSON.stringify(respuesta_api))
    res.end()
  }
}

controladorDirector.consultarTodos = async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloDirector = require("../modelo/m_director")
  let modeloDirector = new ModeloDirector()
  let resultDirector = await modeloDirector.consultarTodos()
  if (resultDirector.rowCount > 0) {
    respuesta_api.mensaje = "Consulta completada"
    respuesta_api.datos = resultDirector.rows
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

controladorDirector.consultar = async (req, res, next) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloDirector = require("../modelo/m_director")
  let { id, token } = req.params
  let modeloDirector = new ModeloDirector()
  modeloDirector.setIdDirector(id)
  let resultDirector = await modeloDirector.consultar()
  if (resultDirector.rowCount > 0) {
    respuesta_api.mensaje = "Consulta completada"
    respuesta_api.datos = resultDirector.rows
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
    req.vitacora = VitacoraControlador.json(respuesta_api, token, "SELECT", "tdirector", id)
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

controladorDirector.consultarpatron = async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloDirector = require("../modelo/m_director");
  const patron = req.params.patron
  let modeloDirector = new ModeloDirector()
  let resultDirector = await modeloDirector.consultarPatron(patron)

  if (resultDirector.rowCount > 0) {
    respuesta_api.mensaje = "Consulta completada"
    respuesta_api.datos = resultDirector.rows
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
  }
  else {
    respuesta_api.mensaje = "No se Ha encontrado registro en la base de datos"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "danger"
  }
  res.writeHead(200, { "Content-Type": "application/json" })
  res.write(JSON.stringify(respuesta_api))
  res.end()
}

controladorDirector.actualizar = async (req, res, next) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" }
  const ModeloDirector = require("../modelo/m_director")
  let { director, token } = req.body
  let { id } = req.params
  let modeloDirector = new ModeloDirector()
  modeloDirector.setDatos(director)
  modeloDirector.setIdDirector(id)
  let resultDirector = await modeloDirector.consultar()
  if (resultDirector.rowCount > 0) {
    let resultDirector2 = await modeloDirector.actualizar()
    if (resultDirector2.rowCount > 0) {
      respuesta_api.mensaje = "Actualización completada"
      respuesta_api.estado_respuesta = true
      respuesta_api.color_alerta = "success"
      req.vitacora = VitacoraControlador.json(respuesta_api, token, "UPDATE", "tdirector", director.id_director)
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



module.exports = controladorDirector;