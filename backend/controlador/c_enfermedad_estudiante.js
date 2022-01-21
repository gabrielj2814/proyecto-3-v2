const controladorEnfermedadEstudiante = {}
const ModeloEnfermedadEstudiante = require("../modelo/m_enfermedad_estudiante")

controladorEnfermedadEstudiante.registrar = async (req, res) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: ""}
  const { enfermedades } = req.body
  const { id_enfermedad, id_estudiante } = enfermedades
  let modelo_enfermedad_estudiante = new ModeloEnfermedadEstudiante()
  
  modelo_enfermedad_estudiante.setIdEstudiante(id_estudiante);
  await modelo_enfermedad_estudiante.eliminar();
  
  await id_enfermedad.forEach( async (enfermedad) => {
    modelo_enfermedad_estudiante.setDatos({
      id_enfermedad: enfermedad,
      id_estudiante: id_estudiante
    });

    await modelo_enfermedad_estudiante.registrar();
  })
  respuesta_api.mensaje = "Registro completado"
  respuesta_api.estado_respuesta = true
  respuesta_api.color_alerta = "success"
  res.writeHead(200,{"Content-Type":"application/json"})
  res.write(JSON.stringify(respuesta_api))
  res.end()
}

controladorEnfermedadEstudiante.consultar = async (req, res) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: ""}
  const {id} = req.params
  let modelo_enfermedad_estudiante = new ModeloEnfermedadEstudiante()
  modelo_enfermedad_estudiante.setIdEstudiante(id);
  let resultEnfermedades_estudiante = await modelo_enfermedad_estudiante.consultar()
  if(resultEnfermedades_estudiante.rowCount > 0){
    respuesta_api.datos = resultEnfermedades_estudiante.rows
    respuesta_api.mensaje = "consulta completada"
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "success"
  }
  else{
    respuesta_api.mensaje = "error al consultar"
    respuesta_api.estado_respuesta = true
    respuesta_api.color_alerta = "danger"
  }
  res.writeHead(200,{"Content-Type":"application/json"})
  res.write(JSON.stringify(respuesta_api))
  res.end()
}

module.exports = controladorEnfermedadEstudiante;