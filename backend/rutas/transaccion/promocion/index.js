const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
controladorPromocion=require("../../../controlador/c_promocion")

router.use(bodyparser.json())

router.post("/crear-promocion",controladorPromocion.registrar)
router.get("/consultar-promocion/:id",controladorPromocion.consultar)
router.get("/consultar-promocion-por-inscripcion/:id",controladorPromocion.consultarPorInscripcion)
router.put("/actualizar",controladorPromocion.actualizar)

module.exports = router 