const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
ControladorFechaInscripcion=require("../../../controlador/c_fecha_inscripcion")


router.use(bodyparser.json())



module.exports = router 