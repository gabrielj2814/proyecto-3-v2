const controladorVacunaEstudiante = {}
const ModelVacunadEstudiante = require("../modelo/m_vacuna_estudiante")

controladorVacunaEstudiante.registrar = async (req, res) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: ""}
  const { vacunas } = req.body
  const { id_vacuna, id_estudiante } = vacunas;
  let modelo_vacuna_estudiante = new ModelVacunadEstudiante()
  modelo_vacuna_estudiante.setIdEstudiante(id_estudiante);
  await modelo_vacuna_estudiante.eliminar();

  if(id_vacuna != [] || id_vacuna[0] != undefined){
    await id_vacuna.forEach( async (vacuna) => {
      modelo_vacuna_estudiante.setDatos({
        id_vacuna: vacuna,
        id_estudiante: id_estudiante
      });
  
      await modelo_vacuna_estudiante.registrar();
    })
  }  

  respuesta_api.mensaje = "Registro completado"
  respuesta_api.estado_respuesta = true
  respuesta_api.color_alerta = "success"
  res.writeHead(200,{"Content-Type":"application/json"})
  res.write(JSON.stringify(respuesta_api))
  res.end()
}

controladorVacunaEstudiante.consultar = async (req, res) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: ""}
  const {id} = req.params
  let modelo_vacuna_estudiante = new ModelVacunadEstudiante()
  modelo_vacuna_estudiante.setIdEstudiante(id);
  let resultVacunas_estudiante = await modelo_vacuna_estudiante.consultar()
  if(resultVacunas_estudiante.rowCount > 0){
    respuesta_api.datos = resultVacunas_estudiante.rows
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

module.exports = controladorVacunaEstudiante;