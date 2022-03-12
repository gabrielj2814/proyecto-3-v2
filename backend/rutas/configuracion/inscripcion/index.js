const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
controladorInscripcion = require("../../../controlador/c_inscripcion")

router.post("/registrar", controladorInscripcion.registrar_inscripcion)//registrar
router.get("/consultar-todas", controladorInscripcion.consultarTodas)//consultar todas las inscripciones
router.get("/consultar/:id", controladorInscripcion.consultar) //consultar una inscripcion
router.put("/actualizar/:id", controladorInscripcion.actualizar) //actualizar una inscripción


module.exports = router
