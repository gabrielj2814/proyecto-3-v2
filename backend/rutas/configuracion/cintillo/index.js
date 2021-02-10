const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
fileUpLoad=require("express-fileupload"),
ControladorCintillo=require("../../../controlador/c_cintillo"),
VitacoraControlador=require("../../../controlador/c_vitacora")

router.use(bodyparser.json())
router.use(fileUpLoad())

router.post("/subir-cintillo",ControladorCintillo.subirCintillo)

module.exports =router