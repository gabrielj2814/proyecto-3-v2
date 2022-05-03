const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
ControladorAula=require("../../../controlador/c_aula"),
bitacorra = require("../../../controlador/c_vitacora")


router.use(bodyparser.json())

router.post("/registrar",ControladorAula.registrar, bitacorra.capturaDatos)
router.get("/consultar-todos",ControladorAula.consultarTodos)
router.get("/consultar/:id/:token",ControladorAula.consultar, bitacorra.capturaDatos)
router.put("/actualizar/:id",ControladorAula.actualizar, bitacorra.capturaDatos)
router.get("/consultar-aula-por-grado/:id",ControladorAula.consultarAulasPorGrado)


module.exports= router