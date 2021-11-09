const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
ControladorAula=require("../../../controlador/c_aula")


router.use(bodyparser.json())

router.post("/registrar",ControladorAula.registrar)
router.get("/consultar-todos",ControladorAula.consultarTodos)
router.get("/consultar/:id",ControladorAula.consultar)
router.put("/actualizar/:id",ControladorAula.actualizar)
router.get("/consultar-aula-por-grado/:id",ControladorAula.consultarAulasPorGrado)


module.exports= router