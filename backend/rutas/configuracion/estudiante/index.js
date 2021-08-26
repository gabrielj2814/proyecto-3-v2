const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
controladorEstudiante=require("../../../controlador/c_estudiante")


router.use(bodyparser.json())

router.post("/registrar", controladorEstudiante.registrar_estudiante)//registrar
router.get("/consultar-todos", controladorEstudiante.consultar_todos)// consultar todos
router.get("/consultar/:id", controladorEstudiante.consultar)// consulta especifica
router.put("/actualizar/:id", controladorEstudiante.actualizar)// actualizar



module.exports = router 