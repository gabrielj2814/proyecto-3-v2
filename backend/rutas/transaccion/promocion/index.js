const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
controladorPromocion=require("../../../controlador/c_promocion")
// botacorra = require("../../../controlador/c_vitacora")

router.use(bodyparser.json())

router.post("/crear-promocion",controladorPromocion.registrar)
router.get("/consultar-promocion/:id/:token",controladorPromocion.consultar)
router.get("/consultar-todos/",controladorPromocion.consultarTodos)
router.get("/consultar-promocion-por-inscripcion/:id/:token",controladorPromocion.consultarPorInscripcion)
router.put("/actualizar/:id",controladorPromocion.actualizar)
router.get("/consultar-estudiantes/:cedula_profesor",controladorPromocion.consultarEstudiantesAsignados)

module.exports = router
