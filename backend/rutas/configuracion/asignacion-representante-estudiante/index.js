const express = require("express"),
  router = express.Router(),
  bodyparser = require("body-parser"),
  controladorAsignacionRepresentanteEstudiante = require("../../../controlador/c_asignacion_representante_estudiante")
  


router.use(bodyparser.json())

router.post("/registrar", controladorAsignacionRepresentanteEstudiante.registrar_asig_representante_estudiante)//registrar
router.get("/consultar-todos", controladorAsignacionRepresentanteEstudiante.consultar_todos)// consultar todos
router.get("/consultar/:id/:token", controladorAsignacionRepresentanteEstudiante.consultar)// consulta especifica
router.get("/consultar-patron/:patron", controladorAsignacionRepresentanteEstudiante.consultarpatron) //consultar por patron
// router.get("/representantes-activos", controladorRepresentante.consultarRepresentantesActivos) //consultar todos los representantes activos
// router.get("/representantes-inactivos", controladorRepresentante.consultarRepresentantesInactivos) //consultar todos los representantes activos
router.put("/actualizar/:id", controladorAsignacionRepresentanteEstudiante.actualizar)// actualizar


module.exports = router