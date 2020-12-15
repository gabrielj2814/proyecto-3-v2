const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
EstadoControlador=require("../../../controlador/c_estado")

router.use(bodyparser.json())

router.get("/generar-id",EstadoControlador.generarId)
router.post("/registrar",EstadoControlador.registrarControlador)
router.get("/consultar/:id",EstadoControlador.consultarControlador)
router.put("/actualizar/:id",EstadoControlador.actualizarControlador)
router.get("/consultar-todos",EstadoControlador.ConsultarTodosControlador)
router.get("/consultar-patron/:patron",EstadoControlador.consultarEstadoPatronControlador)

module.exports = router