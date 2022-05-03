
const moment = require('moment');
moment.locale('es');

const controladorAnoEscolar = {}
const VitacoraControlador = require("./c_vitacora")

controladorAnoEscolar.registrar_ano_escolar = async (req, res, next) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" };
  const ModeloAnoEscolar = require("../modelo/m_ano_escolar");
  let { anoescolar, token } = req.body
  let modeloAnoEscolar = new ModeloAnoEscolar()
  modeloAnoEscolar.setDatos(anoescolar)
  let resultAnoEscolar = await modeloAnoEscolar.registrar()
  if (resultAnoEscolar.rowCount > 0) {
    respuesta_api.mensaje = "registro completado"
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
    req.vitacora = VitacoraControlador.json(respuesta_api, token, "INSERT", "tano_escolar", anoescolar.id_ano_escolar)
    next()
  }
  else {
    respuesta_api.mensaje = "error al registrar el año escolar"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "danger"
    res.writeHead(200, { "Content-Type": "application/json" })
    res.write(JSON.stringify(respuesta_api))
    res.end()
  }
}

controladorAnoEscolar.consultar_todos = async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloAnoEscolar = require("../modelo/m_ano_escolar");
  let modeloAnoEscolar = new ModeloAnoEscolar()
  let resultAnoEscolar = await modeloAnoEscolar.consultarTodos()

  if (resultAnoEscolar.rowCount > 0) {
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.datos = resultAnoEscolar.rows
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

controladorAnoEscolar.getDateNow = async (req, res) => {
  // const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }

  const hoy = moment();

  const formato = 'YYYY-MM-DD';
  const fecha = await hoy.format(formato)
  //console.log({ data: fecha });
  res.json({
    mensaje: 'consulta completada',
    datos: fecha,
    estado_respuesta: true,
    color_alerta: "success"
  })
}


controladorAnoEscolar.consultar= async (req, res, next) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloAnoEscolar = require("../modelo/m_ano_escolar");
  let {id, token} = req.params
  let modeloAnoEscolar = new ModeloAnoEscolar()
  modeloAnoEscolar.setIdAnoEscolar(id)
  let resultAnoEscolar = await modeloAnoEscolar.consultar()

  if (resultAnoEscolar.rowCount > 0) {
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.datos = resultAnoEscolar.rows
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
    req.vitacora = VitacoraControlador.json(respuesta_api, token, "SELECT", "tano_escolar", resultAnoEscolar.rows[0].id_ano_escolar)
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

controladorAnoEscolar.consultarAnoSeguimiento = async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloAnoEscolar = require("../modelo/m_ano_escolar");
  let modeloAnoEscolar = new ModeloAnoEscolar()
  let resultAnoEscolar = await modeloAnoEscolar.consultarSeguimiento()

  if (resultAnoEscolar.rowCount > 0) {
    respuesta_api.mensaje = "Ya existe un año escolar en planificación "
    respuesta_api.datos = resultAnoEscolar.rows
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

controladorAnoEscolar.consultarAnoEscolarActivo= async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloAnoEscolar = require("../modelo/m_ano_escolar");
  let modeloAnoEscolar = new ModeloAnoEscolar()
  let resultAnoEscolar = await modeloAnoEscolar.consultarAnoEscolarActivo()

  if (resultAnoEscolar.rowCount > 0) {
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.datos = resultAnoEscolar.rows
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
  }
  else {
    respuesta_api.mensaje = "No existe un año escolar activo"
    respuesta_api.estado_respuesta = false
    respuesta_api.color_alerta = "danger"
  }
  res.writeHead(200, { "Content-Type": "application/json" })
  res.write(JSON.stringify(respuesta_api))
  res.end()
}

controladorAnoEscolar.consultarpatron = async (req, res) => {
  const respuesta_api = { mensaje: "", datos: [], estado_respuesta: false, color_alerta: "" }
  const ModeloAnoEscolar = require("../modelo/m_ano_escolar");
  const patron = req.params.patron
  let modeloAnoEscolar = new ModeloAnoEscolar()
  let resultAnoEscolar = await modeloAnoEscolar.consultarpatron(patron)

  if (resultAnoEscolar.rowCount > 0) {
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.datos = resultAnoEscolar.rows
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

controladorAnoEscolar.actualizar = async (req, res) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" }
  const ModeloAnoEscolar = require("../modelo/m_ano_escolar");
  let { anoescolar, token } = req.body
  let { id } = req.params
  let modeloAnoEscolar = new ModeloAnoEscolar()
  modeloAnoEscolar.setDatos(anoescolar)
  modeloAnoEscolar.setIdAnoEscolar(id)

  let resultAnoEscolar = await modeloAnoEscolar.actualizar()

  if (resultAnoEscolar.rowCount > 0) {
    let resultAnoEscolar2 = await modeloAnoEscolar.actualizar()
    if (resultAnoEscolar2.rowCount > 0) {
      respuesta_api.mensaje = "actualización completada"
      respuesta_api.estado_respuesta = true
      respuesta_api.color_alerta = "success"
      req.vitacora = VitacoraControlador.json(respuesta_api, token, "UPDATE", "tano_escolar", anoescolar.id_ano_escolar)
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

controladorAnoEscolar.verificarAnoEscolar= async (req,res) => {
  const ModeloAnoEscolar = require("../modelo/m_ano_escolar");
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" }
  const hoy=moment().format("YYYY-MM-DD")
  let AnoEscolar=new ModeloAnoEscolar()
  let resultAnoEscolar=await AnoEscolar.consultarAnoEscolarActivo()
  // console.log("=>>>>>>>>>>>>>>>>>>>>",resultAnoEscolar.rows)
  if(resultAnoEscolar.rowCount===1){
    const AnoEscolarActual=resultAnoEscolar.rows[0]
    let fechaDeCierreAnoActual=moment(AnoEscolarActual.fecha_cierre_ano_escolar,"YYYY-MM-DD").format("YYYY-MM-DD")
    if(moment(hoy).isAfter(fechaDeCierreAnoActual)){
      AnoEscolar.setIdAnoEscolar(AnoEscolarActual.id_ano_escolar)
      let resultAnoEscolar2=await AnoEscolar.cierreDeAnoEscolar()
      // if(resultAnoEscolar2.rowCount>0){
      //   console.log("=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>OK")
      // }
    }
  }

  let resultAnoEscolar3=await AnoEscolar.consultarSeguimiento()
  if(resultAnoEscolar3.rowCount===1){
    const AnoEscolarSeguimiento=resultAnoEscolar3.rows[0]
    let fechaDeAperturaAnoSeguiente=moment(AnoEscolarSeguimiento.fecha_inicio_ano_escolar,"YYYY-MM-DD").format("YYYY-MM-DD")
    if(moment(hoy).isSameOrAfter(fechaDeAperturaAnoSeguiente)){
      AnoEscolar.setIdAnoEscolar(AnoEscolarSeguimiento.id_ano_escolar)
      let resultAnoEscolar4=await AnoEscolar.aperturaDeAnoEscolar()
      // if(resultAnoEscolar4.rowCount===1){
      //   console.log("ABRIENDO AUTOMATICAMENTE NUEVO AÑO ESCOLAR")
      // }
    }
  }


  res.writeHead(200, { "Content-Type": "application/json" })
  res.write(JSON.stringify(respuesta_api))
  res.end()

}

controladorAnoEscolar.consultarAnoEscolarSiguiente= async (req,res) => {
  const ModeloAnoEscolar = require("../modelo/m_ano_escolar");
  const respuesta_api = { mensaje: "",datos:[],estado_respuesta: false, color_alerta: "" }
  let AnoEscolar=new ModeloAnoEscolar()
  let resultAnoEscolar=await AnoEscolar.consultarSeguimiento()
  // console.log("=>>>>>>>>>>>>>>>>>>>>",resultAnoEscolar.rows)
  if(resultAnoEscolar.rowCount===1){
    respuesta_api.datos=resultAnoEscolar.rows
    respuesta_api.mensaje="si hay un año escolar planificado"
    respuesta_api.estado_respuesta=true
    respuesta_api.color_alerta="success"
  }
  else{
    respuesta_api.mensaje="no hay un año escolar planificado"
    respuesta_api.estado_respuesta=false
    respuesta_api.color_alerta="success"
  }

  res.writeHead(200, { "Content-Type": "application/json" })
  res.write(JSON.stringify(respuesta_api))
  res.end()

}

module.exports = controladorAnoEscolar
