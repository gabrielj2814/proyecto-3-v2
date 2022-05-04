const express=require("express"),
router=express.Router(),
ControladorVacuna=require("../../../controlador/c_vacuna"),
bodyParse=require("body-parser"),
bitacorra = require("../../../controlador/c_vitacora")

router.use(bodyParse.json())

router.post("/registrar",ControladorVacuna.registrar, bitacorra.capturaDatos)
router.get("/consultar/:id/:token",ControladorVacuna.consultar, bitacorra.capturaDatos)
router.get("/consultar-todos",ControladorVacuna.consultarTodos)
router.get("/consultar-por-patron/:patron",ControladorVacuna.consultarPorPatron)
router.put("/actualizar/:id",ControladorVacuna.actualizar, bitacorra.capturaDatos)


module.exports = router