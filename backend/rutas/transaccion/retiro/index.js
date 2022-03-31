const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
ControladorRetiro=require("../../../controlador/c_retiro")

router.use(bodyparser.json())

router.post("/registrar",ControladorRetiro.registrar)

router.put("/actualizar",ControladorRetiro.actualizar)

router.get("/consultar-por-estado/:estado/:fechaDesde/:fechaHasta",ControladorRetiro.consultarPorEstado)

module.exports = router 