const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
controladorGrado=require("../../../controlador/c_estudiante")


router.use(bodyparser.json())

router.post("/registrar", controladorGrado.registrar_estudiante)//registrar
router.get("/consultar-todos", controladorGrado.consultar_todos)// consultar todos
router.get("/consultar/:id", controladorGrado.consultar)// consulta especifica
router.put("/actualizar/:id", controladorGrado.actualizar)// actualizar



module.exports = router 