const controladorEstudiante = {};
const VitacoraControlador = require("./c_vitacora")

controladorEstudiante.registrar_estudiante = async (req, res, next) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" };
  const ModeloEstudiante = require("../modelo/m_estudiante");
  let { estudiante, token } = req.body
  let modeloEstudiante = new ModeloEstudiante()
  modeloEstudiante.setDatos(estudiante)
  let resultEstudiante = await modeloEstudiante.registrar()
  if (resultEstudiante.rowCount > 0) {
    respuesta_api.mensaje = "registro completado"
    respuesta_api.datos = resultEstudiante.rows
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
    req.vitacora = VitacoraControlador.json(respuesta_api, token, "INSERT", "testudiante", estudiante.id_estudiante)
    next()
  }
  else {
    respuesta_api.mensaje = "error al registrar el estudiante"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "danger"
    res.writeHead(200, { "Content-Type": "application/json" })
    res.write(JSON.stringify(respuesta_api))
    res.end()
  }
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

controladorEstudiante.consultarTodosLosEstudiantesIncompletos = async(req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  let {queEstoyBuscando} = req.params
  let registrosIncompletos="i"
  let registrosCompletos="c"
  const ModeloEstudiante = require("../modelo/m_estudiante");
  const ControladorAsignacionRepresentanteEstudiante = require("./c_asignacion_representante_estudiante");
  let modeloEstudiante = new ModeloEstudiante()
  let buscando=((queEstoyBuscando===registrosIncompletos)?false:(queEstoyBuscando===registrosCompletos)?true:null)
  if(buscando!==null){
    let resultEstudiante = await modeloEstudiante.consultarTodos()
    for(let contador=0;contador<resultEstudiante.rows.length;contador++){
      resultEstudiante.rows[contador]["existenciaAsignacionRepresentanteEstudainte"]= await ControladorAsignacionRepresentanteEstudiante.consultarAsignacionPorIdEstudiante(resultEstudiante.rows[contador].id_estudiante)
    }
    console.log("datos => ",resultEstudiante.rows)
    filtrado=resultEstudiante.rows.filter(filtradoEstudaintes => buscando===filtradoEstudaintes.existenciaAsignacionRepresentanteEstudainte)
    console.log("que sucede => ",filtrado)
    if(filtrado.length>0){
      let seBuscoPor=((queEstoyBuscando===registrosIncompletos)?"Registros Incompletos":"Registros Completados")
      respuesta_api.mensaje = "consulta completada tipo de busqueda => "+seBuscoPor
      respuesta_api.datos = filtrado
      respuesta_api.estado_respuesta = true
      respuesta_api.color_alerta = "success"
    }
    else{
      respuesta_api.mensaje = "no se a encontrado registro en la base de datos"
      respuesta_api.estado_respuesta = false
      respuesta_api.color_alerta = "danger"
    }
  }
  else{
      respuesta_api.mensaje = "paso un parametro no valido"
      respuesta_api.estado_respuesta = false
      respuesta_api.color_alerta = "danger"
  }
 
  // if (resultEstudiante.rowCount > 0) {

  // }
  // else {

  // }
  res.writeHead(200, { "Content-Type": "application/json" })
  res.write(JSON.stringify(respuesta_api))
  res.end()
}

controladorEstudiante.consultar = async (req, res, next) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloEstudiante = require("../modelo/m_estudiante");
  let { id, token } = req.params
  let modeloEstudiante = new ModeloEstudiante()
  modeloEstudiante.setIdEstudiante(id)
  let resultEstudiante = await modeloEstudiante.consultar()

  if (resultEstudiante.rowCount > 0) {
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.datos = resultEstudiante.rows
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
    req.vitacora = VitacoraControlador.json(respuesta_api, token, "SELECT", "testudiante", id)
    next()
  }
  else {
    respuesta_api.mensaje = "no se a encontrado registro en la base de datos"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "danger"
    res.writeHead(200, { "Content-Type": "application/json" })
    res.write(JSON.stringify(respuesta_api))
    res.end()
  }

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

controladorEstudiante.actualizar = async(req, res, next) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" }
  const ModeloEstudiante = require("../modelo/m_estudiante");
  let { estudiante, token } = req.body
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
      req.vitacora = VitacoraControlador.json(respuesta_api, token, "UPDATE", "testudiante", estudiante.id_estudiante)
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

module.exports = controladorEstudiante;