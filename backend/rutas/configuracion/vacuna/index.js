const express=require("express"),
router=express.Router(),
ControladorVacuna=require("../../../controlador/c_vacuna"),
bodyParse=require("body-parser")

router.use(bodyParse.json())

router.post("/registrar",ControladorVacuna.registrar)
router.get("/consultar/:id",ControladorVacuna.consultar)


module.exports = router