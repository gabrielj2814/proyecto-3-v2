const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
CamControlador=require("../../../controlador/c_cam")

router.use(bodyparser.json())

router.post("/registrar",CamControlador.registrarControlador)
router.get("/consultar/:id",CamControlador.consultarControlador)
router.put("/actualizar/:id",CamControlador.actualizarControlador)
router.get("/consultar-todos",CamControlador.ConsultarTodosControlador)
router.get("/consultar-x-ciudad/:id",CamControlador.consultarCamXCiudadControlador)
router.get("/consultar-patron/:patron",CamControlador.consultarCamPatronControlador)

module.exports= router