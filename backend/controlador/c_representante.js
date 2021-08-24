const controladorRepresentante = {};

controladorRepresentante.registrar_representante = async(req, res) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" };
  const ModeloRepresentante = require("../modelo/m_representante");
  let { representante } = req.body
  let modeloRepresentante = new ModeloRepresentante()
  modeloRepresentante.setDatos(representante)
  modeloEstudiante.setDatos(estudiante)
  let resultRepresentante = await modeloRepresentante.registrar()
  if (resultRepresentante.rowCount > 0) {
    respuesta_api.mensaje = "registro completado"
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
  }
  else {
    respuesta_api.mensaje = "error al registrar el estudiante"
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
  let resultRepresentante = await modeloRepresentante.registrar()

  if (resultRepresentante.rowCount > 0) {
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.datos = resultGrado.rows
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

controladorEstudiante.consultar = async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloRepresentante = require("../modelo/m_representante");
  let { id } = req.params
  let modeloRepresentante = new ModeloRepresentante()
  modeloRepresentante.setIdEstudiante(id)
  let resultRepresentante = await modeloRepresentante.consultar()

  if (resultRepresentante.rowCount > 0) {
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.datos = resultGrado.rows
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

controladorEstudiante.actualizar = async (req, res) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" }
  const ModeloEstudiante = require("../modelo/m_representante");
  let { representante } = req.body
  let { id } = req.params
  let modeloRepresentante = new ModeloEstudiante()
  modeloRepresentante.setDatos(representante)
  modeloRepresentante.setIdEstudiante(id)

  let resultRepresentante = await modeloRepresentante+-.actualizar()

  if (resultRepresentante.rowCount > 0) {
    let resultRepresentante2 = await modeloRepresentante.actualizar()
    if (resultRepresentante2.rowCount > 0) {
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