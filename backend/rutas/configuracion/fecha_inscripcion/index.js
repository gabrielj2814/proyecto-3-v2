const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
ControladorFechaInscripcion=require("../../../controlador/c_fecha_inscripcion")


router.use(bodyparser.json())

router.post("/registrar",ControladorFechaInscripcion.registrar)
router.get("/consultar/:id",ControladorFechaInscripcion.consultar)
router.get("/consultar-todo",ControladorFechaInscripcion.consultarTodo)
router.put("/actualizar/:id",ControladorFechaInscripcion.actualizar)
router.put("/abrir-inscripcion/:id",ControladorFechaInscripcion.reAbrirInscripcion)
router.put("/cerrar-inscripcion/:id",ControladorFechaInscripcion.cerrarInscripcion)

module.exports = router 