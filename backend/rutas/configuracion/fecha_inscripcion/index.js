const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
ControladorFechaInscripcion=require("../../../controlador/c_fecha_inscripcion"),
bitacorra = require('../../../controlador/c_vitacora')


router.use(bodyparser.json())

router.post("/registrar",ControladorFechaInscripcion.registrar, bitacorra.capturaDatos)
router.get("/consultar/:id/token",ControladorFechaInscripcion.consultar, bitacorra.capturaDatos)
router.get("/consultar-fecha-servidor",ControladorFechaInscripcion.consultarFechaServidor)
router.get("/consultar-todo",ControladorFechaInscripcion.consultarTodo)
router.get("/consultar-todo-2",ControladorFechaInscripcion.consultarTodo2)
router.put("/actualizar/:id",ControladorFechaInscripcion.actualizar, bitacorra.capturaDatos)
router.put("/abrir-inscripcion/:id",ControladorFechaInscripcion.reAbrirInscripcion)
router.put("/cerrar-inscripcion/:id",ControladorFechaInscripcion.cerrarInscripcion)
router.get("/consultar-fecha-inscripcion-actual",ControladorFechaInscripcion.consultarFechaInscripcionActual)

module.exports = router 