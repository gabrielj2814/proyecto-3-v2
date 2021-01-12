const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
CamControlador=require("../../../controlador/c_cam"),
VitacoraControlador=require("../../../controlador/c_vitacora")

router.use(bodyparser.json())

router.post("/registrar",CamControlador.registrarControlador,VitacoraControlador.capturaDatos)
router.get("/consultar/:id/:token",CamControlador.consultarControlador,VitacoraControlador.capturaDatos)
router.put("/actualizar/:id",CamControlador.actualizarControlador,VitacoraControlador.capturaDatos)
router.get("/consultar-todos",CamControlador.ConsultarTodosControlador)
router.get("/consultar-x-ciudad/:id",CamControlador.consultarCamXCiudadControlador)
router.get("/consultar-patron/:patron",CamControlador.consultarCamPatronControlador)

module.exports= router

// const express=require("express"),
// router=express.Router(),
// bodyparser=require("body-parser"),
// CamControlador=require("../../../controlador/c_cam")

// router.use(bodyparser.json())

// router.post("/registrar",CamControlador.registrarControlador)
// router.get("/consultar/:id",CamControlador.consultarControlador)
// router.put("/actualizar/:id",CamControlador.actualizarControlador)
// router.get("/consultar-todos",CamControlador.ConsultarTodosControlador)
// router.get("/consultar-x-ciudad/:id",CamControlador.consultarCamXCiudadControlador)
// router.get("/consultar-patron/:patron",CamControlador.consultarCamPatronControlador)

// module.exports= router