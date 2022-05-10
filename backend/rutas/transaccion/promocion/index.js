const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
controladorPromocion=require("../../../controlador/c_promocion"),
bitacora = require("../../../controlador/c_vitacora")

router.use(bodyparser.json())

router.post("/crear-promocion", controladorPromocion.registrar, bitacora.capturaDatos)
router.get("/consultar-promocion/:id/:token",controladorPromocion.consultar, bitacora.capturaDatos)
router.get("/consultar-todos/",controladorPromocion.consultarTodos)
router.get("/consultar-todos-promociones/:cedula",controladorPromocion.consultarPromocionProfesor)
router.get("/consultar-promocion-por-inscripcion/:id/:token",controladorPromocion.consultarPorInscripcion, bitacora.capturaDatos)
router.put("/actualizar/:id",controladorPromocion.actualizar)
router.get("/consultar-estudiantes/:cedula_profesor",controladorPromocion.consultarEstudiantesAsignados, bitacora.capturaDatos)

module.exports = router
