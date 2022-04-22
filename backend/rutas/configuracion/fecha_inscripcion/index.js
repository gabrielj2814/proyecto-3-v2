const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
ControladorFechaInscripcion=require("../../../controlador/c_fecha_inscripcion")


router.use(bodyparser.json())

router.post("/registrar",ControladorFechaInscripcion.registrar)
router.get("/consultar/:id",ControladorFechaInscripcion.consultar)
router.get("/consultar-fecha-servidor",ControladorFechaInscripcion.consultarFechaServidor)
router.get("/consultar-todo",ControladorFechaInscripcion.consultarTodo)
router.get("/consultar-todo-2",ControladorFechaInscripcion.consultarTodo2)
router.put("/actualizar/:id",ControladorFechaInscripcion.actualizar)
router.put("/abrir-inscripcion/:id",ControladorFechaInscripcion.reAbrirInscripcion)
router.put("/cerrar-inscripcion/:id",ControladorFechaInscripcion.cerrarInscripcion)
router.get("/consultar-fecha-inscripcion-actual",ControladorFechaInscripcion.consultarFechaInscripcionActual)

module.exports = router 