const express = require("express"),
  router = express.Router(),
  bodyparser = require("body-parser"),
  controladorParroquia = require("../../../controlador/c_parroquia")


router.use(bodyparser.json())

router.post("/registrar", controladorParroquia.registrar_parroquia)//registrar
router.get("/consultar-todos", controladorParroquia.consultarTodos)// consultar todos
router.get("/consultar/:id", controladorParroquia.consultar)// consulta especifica
router.get("/consultar-patron/:patron", controladorParroquia.consultarpatron) //consultar por patron
// router.get("/estudiantes-activos", controladorEstudiante.consultarEstudiantesActivos) //consultar todos los estudiantes activos
// router.get("/estudiantes-inactivos", controladorEstudiante.consultarEstudiantesInactivos) //consultar todos los estudiantes inactivos
router.put("/actualizar/:id", controladorParroquia.actualizar)// actualizar



module.exports = router 