const controladorAsignacionRepresentantEstudiante = {}

const VitacoraControlador = require("./c_vitacora")

controladorAsignacionRepresentantEstudiante.registrar_asig_representante_estudiante = async (req, res) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" };
  const ModeloAsigRepresentanteEstudiante = require('../modelo/m_asignacion_representante_estudiante');
  let { asigRepresenteEstudiante } = req.body
  let modeloAsigRepresentanteEstudiante = new ModeloAsigRepresentanteEstudiante()
  modeloAsigRepresentanteEstudiante.setDatos(asigRepresenteEstudiante);
  let resultAsigRepEst = await modeloAsigRepresentanteEstudiante.registrar()
  if (resultAsigRepEst.rowCount > 0) {
    respuesta_api.mensaje = "registro completado"
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
    
  }
  else {
    respuesta_api.mensaje = "error al registrar a la asignación "
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "danger"
  }
  res.writeHead(200, { "Content-Type": "application/json" })
  res.write(JSON.stringify(respuesta_api))
  res.end()
}

controladorAsignacionRepresentantEstudiante.consultar_todos = async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloAsigRepresentanteEstudiante = require("../modelo/m_asignacion_representante_estudiante");
  let modeloAsigRepresentanteEstudiante = new ModeloAsigRepresentanteEstudiante()
  let resultAsigRepEst = await modeloAsigRepresentanteEstudiante.consultarTodos()

  if (resultAsigRepEst.rowCount > 0) {
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.datos = resultAsigRepEst.rows
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

controladorAsignacionRepresentantEstudiante.consultar = async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloAsigRepresentanteEstudiante = require("../modelo/m_asignacion_representante_estudiante");
  let modeloAsigRepresentanteEstudiante = new ModeloAsigRepresentanteEstudiante()
  let resultAsigRepEst = await modeloAsigRepresentanteEstudiante.consultar()

  if (resultAsigRepEst.rowCount > 0) {
    respuesta_api.mensaje = "Consulta completada"
    respuesta_api.datos = resultAsigRepEst.rows
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

controladorAsignacionRepresentantEstudiante.consultar = async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloAsigRepresentanteEstudiante = require("../modelo/m_asignacion_representante_estudiante");
  let { id } = req.params
  let modeloAsigRepresentanteEstudiante = new ModeloAsigRepresentanteEstudiante()
  modeloAsigRepresentanteEstudiante.setIdAsigRepresentanteEstudiante(id)
  let resultAsigRepEst = await modeloAsigRepresentanteEstudiante.consultar()

  if (resultAsigRepEst.rowCount > 0) {
    respuesta_api.mensaje = "Consulta completada"
    respuesta_api.datos = resultAsigRepEst.rows
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

controladorAsignacionRepresentantEstudiante.consultarpatron = async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloAsigRepresentanteEstudiante = require("../modelo/m_asignacion_representante_estudiante");
  const patron = req.params.patron
  let modeloAsigRepresentanteEstudiante = new ModeloAsigRepresentanteEstudiante()
  let resultAsigRepEst = await modeloAsigRepresentanteEstudiante.consultarpatron(patron)

  if (resultAsigRepEst.rowCount > 0) {
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.datos = resultAsigRepEst.rows
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

controladorAsignacionRepresentantEstudiante.actualizar = async (req, res) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" }
  const ModeloAsigRepresentanteEstudiante = require("../modelo/m_asignacion_representante_estudiante");
  let { asigRepresenteEstudiante } = req.body
  let { id } = req.params
  let modeloAsigRepresentanteEstudiante = new ModeloAsigRepresentanteEstudiante()
  modeloAsigRepresentanteEstudiante.setDatos(asigRepresenteEstudiante)
  modeloAsigRepresentanteEstudiante.setIdAsigRepresentanteEstudiante(id)

  let resultAsigRepEst = await modeloAsigRepresentanteEstudiante.actualizar()

  if (resultAsigRepEst.rowCount > 0) {
    let resultAsigRepEst2 = await modeloAsigRepresentanteEstudiante.actualizar()
    if (resultAsigRepEst2.rowCount > 0) {
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

module.exports = controladorAsignacionRepresentantEstudiante;