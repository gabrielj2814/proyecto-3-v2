const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
CiudadControlador=require("../../../controlador/c_ciudad")

router.use(bodyparser.json())

router.get("/generar-id",CiudadControlador.generarId)
router.post("/registrar",CiudadControlador.registrarControlador)
router.get("/consultar/:id",CiudadControlador.consultarControlador)
router.put("/actualizar/:id",CiudadControlador.actualizarControlador)
router.get("/consultar-todos",CiudadControlador.consultarTodosControlador)
router.get("/consultar-x-estado/:id",CiudadControlador.consultarCiudadXEstadoControlador)
router.get("/consultar-patron/:patron",CiudadControlador.consultarCiudadPatronControlador)

module.exports= router