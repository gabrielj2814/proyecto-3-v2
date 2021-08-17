const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
controladorGrado=require("../../../controlador/c_grado")


router.use(bodyparser.json())

router.post("/registrar",controladorGrado.registrar_grador)//registrar
router.get("/consultar-todos",controladorGrado.consultarTodos)// consultar todos
router.get("/consultar/:id",controladorGrado.consultar)// consulta especifica
router.put("/actualizar/:id",controladorGrado.actualizar)// actualizar



module.exports = router 