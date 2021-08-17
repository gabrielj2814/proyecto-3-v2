const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
controladorGrado=require("../../../controlador/c_grado")


router.use(bodyparser.json())

// router.get()// consultar todos
// router.get()// consulta especifica
router.post("/registrar",controladorGrado.registrar_grador)//registrar
// router.put()// actualizar



module.exports = router 