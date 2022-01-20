const controladorEstudiante = {};

controladorEstudiante.registrar_estudiante = async (req, res) => {
  const respuesta_api = { mensaje: "", datos:[], estado_respuesta: false, color_alerta: "" };
  const ModeloEstudiante = require("../modelo/m_estudiante");
  let { estudiante } = req.body
  let modeloEstudiante = new ModeloEstudiante()
  modeloEstudiante.setDatos(estudiante)
  let resultEstudiante = await modeloEstudiante.registrar()
  if (resultEstudiante.rowCount > 0) {
    const resultEstudiante2 = await modeloEstudiante.registrar()
    respuesta_api.datos = resultEstudiante2.rows[0].id_estudiante
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

controladorEstudiante.consultar_todos = async(req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloEstudiante = require("../modelo/m_estudiante");
  let modeloEstudiante = new ModeloEstudiante()
  let resultEstudiante = await modeloEstudiante.consultarTodos()

  if (resultEstudiante.rowCount > 0) {
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.datos = resultEstudiante.rows
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
  const ModeloEstudiante = require("../modelo/m_estudiante");
  let { id } = req.params
  let modeloEstudiante = new ModeloEstudiante()
  modeloEstudiante.setIdEstudiante(id)
  let resultEstudiante = await modeloEstudiante.consultar()

  if (resultEstudiante.rowCount > 0) {
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.datos = resultEstudiante.rows
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

controladorEstudiante.consultarpatron = async(req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloEstudiante = require("../modelo/m_estudiante");
  const patron = req.params.patron
  let modeloEstudiante = new ModeloEstudiante()
  let resultEstudiante = await modeloEstudiante.consultarpatron(patron)

  if (resultEstudiante.rowCount > 0) {
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.datos = resultEstudiante.rows
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

controladorEstudiante.consultarEstudiantesActivos = async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloEstudiante = require("../modelo/m_estudiante");
  let modeloEstudiante = new ModeloEstudiante()
  let resultEstudiante = await modeloEstudiante.consultarEstudiantesActivos()

  if (resultEstudiante.rowCount > 0) {
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.datos = resultEstudiante.rows
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

controladorEstudiante.consultarEstudiantesInactivos = async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloEstudiante = require("../modelo/m_estudiante");
  let modeloEstudiante = new ModeloEstudiante()
  let resultEstudiante = await modeloEstudiante.consultarEstudiantesInactivos()

  if (resultEstudiante.rowCount > 0) {
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.datos = resultEstudiante.rows
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

controladorEstudiante.actualizar = async(req, res) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" }
  const ModeloEstudiante = require("../modelo/m_estudiante");
  let { estudiante } = req.body
  let { id } = req.params
  let modeloEstudiante = new ModeloEstudiante()
  modeloEstudiante.setDatos(estudiante)
  modeloEstudiante.setIdEstudiante(id)

  let resultEstudiante = await modeloEstudiante.actualizar()

  if (resultEstudiante.rowCount > 0) {
    let resultEstudiante2 = await modeloEstudiante.actualizar()
    if (resultEstudiante2.rowCount > 0) {
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

          //vacuna_estudiante, --------------------------------
          //el modelo que se encarga -----------------------
          //de registrar la vacuna_estudiante------------------
controladorEstudiante.registrar_vacuna_estudiante = async (req, res) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" };
  const ModeloVacunaEstudiante = require("../modelo/m_vacuna_estudiante");
  let { vacuna_estudiante } = req.body
  let modeloVacunaEstudiante = new ModeloVacunaEstudiante()
  modeloVacunaEstudiante.setDatos(vacuna_estudiante)
  let resultVacunaEstudiante = await modeloVacunaEstudiante.regitrarVacunaEstudiante()
  if (resultVacunaEstudiante.rowCount > 0) {
    respuesta_api.mensaje = "registro completado"
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
  }
  else {
    respuesta_api.mensaje = "error al registrar la vacuna del estudiante"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "danger"
  }
  res.writeHead(200, { "Content-Type": "application/json" })
  res.write(JSON.stringify(respuesta_api))
  res.end()
}


          //vacuna_estudiante, --------------------------------
          //el modelo que se encarga -----------------------
          //de eliminar la vacuna_estudiante------------------
controladorEstudiante.eliminar_vacuna_estudiante = async (req, res) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" };
  const ModeloVacunaEstudiante = require("../modelo/m_vacuna_estudiante");
  let { id } = req.params
  let modeloVacunaEstudiante = new ModeloVacunaEstudiante()
  modeloVacunaEstudiante.setIdVacunaEstudiante(id)
  let resultVacunaEstudiante = await modeloVacunaEstudiante.eliminarVacunaEstudiante()
  if (resultVacunaEstudiante) {
    respuesta_api.mensaje = "registro Elimnado"
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
  }
  else {
    respuesta_api.mensaje = "error al eliminar vacuna el estudiante"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "danger"
  }
  res.writeHead(200, { "Content-Type": "application/json" })
  res.write(JSON.stringify(respuesta_api))
  res.end()
}



//---------------------enfermedad_estudiante, --------------------------------
//el modelo que se encarga -----------------------
//de registrar la enfermedad_estudiante------------------
controladorEstudiante.registrar_enfermedad_estudiante = async (req, res) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" };
  const ModeloEnfermedadEstudiante = require("../modelo/m_enfermedad_estudiante");
  let { enfermedad_estudiante } = req.body
  let modeloEnfermedadEstudiante = new ModeloEnfermedadEstudiante()
  modeloEnfermedadEstudiante.setDatos(enfermedad_estudiante)
  let resultEnfermedadEstudiante = await modeloEnfermedadEstudiante.regitrarEnfermedadEstudiante()
  if (resultEnfermedadEstudiante.rowCount > 0) {
    respuesta_api.mensaje = "registro completado"
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
  }
  else {
    respuesta_api.mensaje = "error al registrar la enfermedad del estudiante"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "danger"
  }
  res.writeHead(200, { "Content-Type": "application/json" })
  res.write(JSON.stringify(respuesta_api))
  res.end()
}

//--------------------enfermedad_estudiante, --------------------------------
//el modelo que se encarga -----------------------
//de eliminar la enfermedad_estudiante------------------
controladorEstudiante.eliminar_enfermedad_estudiante = async (req, res) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" };
  const ModeloEnfermedadEstudiante = require("../modelo/m_enfermedad_estudiante");
  let { id } = req.params
  let modeloEnfermedadEstudiante = new ModeloEnfermedadEstudiante()
  modeloEnfermedadEstudiante.setIdEnfermedadEstudiante(id)
  let resultEnfermedadEstudiante = await modeloEnfermedadEstudiante.EliminarEnfermedadEstudiante()
  if (resultEnfermedadEstudiante) {
    respuesta_api.mensaje = "registro Elimnado"
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
  }
  else {
    respuesta_api.mensaje = "error al eliminar la enfermedad el estudiante"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "danger"
  }
  res.writeHead(200, { "Content-Type": "application/json" })
  res.write(JSON.stringify(respuesta_api))
  res.end()
}

module.exports = controladorEstudiante;