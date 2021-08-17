const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
controladorGrado=require("../../../controlador/c_grado")


router.use(bodyparser.json())

// router.get()// consulta especifica
router.post("/registrar",controladorGrado.registrar_grador)//registrar
router.get("/consultar-todos",controladorGrado.consultarTodos)// consultar todos
// router.put()// actualizar



module.exports = router 