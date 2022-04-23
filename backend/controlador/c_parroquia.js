const controladorParroquia = {}
const VitacoraControlador=require("./c_vitacora")

controladorParroquia.registrar_parroquia = async (req, res, next) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" }
  const ModeloParraquia = require("../modelo/m_parroquia");
  let { parroquia ,token } = req.body
  let modeloParroquia = new ModeloParraquia()
  modeloParroquia.setDatos(parroquia);
  let resultParroquia = await modeloParroquia.registrar()
  
  if (resultParroquia.rowCount > 0) {
    respuesta_api.mensaje = "registro completado"
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
    req.vitacora=VitacoraControlador.json(respuesta_api,token,"INSERT","tparroquia",resultParroquia.rows[0].id_parroquia)
    next()

  }
  else {
    respuesta_api.mensaje = "error al registrar a la parroquia"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "danger"
    res.writeHead(200, { "Content-Type": "application/json" })
    res.write(JSON.stringify(respuesta_api))
    res.end()
  }

}

controladorParroquia.consultarTodos = async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloParraquia = require("../modelo/m_parroquia")
  let modeloParroquia = new ModeloParraquia()
  let resultParroquia = await modeloParroquia.consultarTodos()
  if (resultParroquia.rowCount > 0) {
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.datos = resultParroquia.rows
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

controladorParroquia.consultar = async (req, res, next) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloParraquia = require("../modelo/m_parroquia")
  let { id ,token} = req.params
  let modeloParroquia = new ModeloParraquia()
  modeloParroquia.setIdParraquia(id)
  let resultParroquia = await modeloParroquia.consultar()
  if (resultParroquia.rowCount > 0) {
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.datos = resultParroquia.rows
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
    req.vitacora=VitacoraControlador.json(respuesta_api,token,"SELECT","tparroquia",resultParroquia.rows[0].id_parroquia)
    next()
  }
  else {
    respuesta_api.mensaje = "no se a encontrado el registro en la base de datos"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "danger"
    res.writeHead(200, { "Content-Type": "application/json" })
    res.write(JSON.stringify(respuesta_api))
    res.end()
  }

}

controladorParroquia.consultarpatron = async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloParraquia = require("../modelo/m_parroquia");
  const patron = req.params.patron
  let modeloParroquia = new ModeloParraquia()
  let resultParroquia = await modeloParroquia.consultarpatron(patron)

  if (resultParroquia.rowCount > 0) {
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.datos = resultParroquia.rows
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

controladorParroquia.consultarParroquiaXCiudadModulo = async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloParraquia = require("../modelo/m_parroquia");
  const ciudad = req.params.ciudad
  let modeloParroquia = new ModeloParraquia()
  let resultParroquia = await modeloParroquia.consultarParroquiaXCiudadModulo(ciudad)

  if (resultParroquia.rowCount > 0) {
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.datos = resultParroquia.rows
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

controladorParroquia.actualizar = async (req, res,next) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" }
  const ModeloParraquia = require("../modelo/m_parroquia")
  let { parroquia ,token} = req.body
  let { id } = req.params
  let modeloParroquia = new ModeloParraquia()
  modeloParroquia.setDatos(parroquia)
  modeloParroquia.setIdParraquia(id)
  let resultParroquia = await modeloParroquia.consultar()
  if (resultParroquia.rowCount > 0) {
    let resultParroquia2 = await modeloParroquia.actualizar()
    if (resultParroquia2.rowCount > 0) {
      respuesta_api.mensaje = "actualización completada"
      respuesta_api.estado_respuesta = true
      respuesta_api.color_alerta = "success"
      req.vitacora=VitacoraControlador.json(respuesta_api,token,"UPDATE","tparroquia",resultParroquia.rows[0].id_parroquia)
      next()
    }
    else {
      respuesta_api.mensaje = "error al actualizar"
      respuesta_api.estado_respuesta = false
      respuesta_api.color_alerta = "danger"
      res.writeHead(200, { "Content-Type": "application/json" })
      res.write(JSON.stringify(respuesta_api))
      res.end()
    }
  }
  else {
    respuesta_api.mensaje = "error al actualizar (este registro no se encuentra en la base de datos)"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "warning"
    res.writeHead(200, { "Content-Type": "application/json" })
    res.write(JSON.stringify(respuesta_api))
    res.end()
  }

}


module.exports = controladorParroquia;