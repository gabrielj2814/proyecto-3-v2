const express = require("express"),
  router = express.Router(),
  bodyparser = require("body-parser"),
  controladorParroquia = require("../../../controlador/c_parroquia"),
  bitacora=require("../../../controlador/c_vitacora")


router.use(bodyparser.json())

router.post("/registrar", controladorParroquia.registrar_parroquia,bitacora.capturaDatos)//registrar
router.get("/consultar-todos", controladorParroquia.consultarTodos)// consultar todos
router.get("/consultar/:id/:token", controladorParroquia.consultar,bitacora.capturaDatos)// consulta especifica
router.get("/consultar-patron/:patron", controladorParroquia.consultarpatron) //consultar por patron
router.get("/consultar-ciudad/:ciudad", controladorParroquia.consultarParroquiaXCiudadModulo) // consultar todas las ciudades por id_ciudad
// router.get("/estudiantes-activos", controladorEstudiante.consultarEstudiantesActivos) //consultar todos los estudiantes activos
// router.get("/estudiantes-inactivos", controladorEstudiante.consultarEstudiantesInactivos) //consultar todos los estudiantes inactivos
router.put("/actualizar/:id", controladorParroquia.actualizar,bitacora.capturaDatos)// actualizar



module.exports = router 