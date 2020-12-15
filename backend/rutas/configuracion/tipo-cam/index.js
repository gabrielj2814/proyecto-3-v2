const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
TipoCamControlador=require("../../../controlador/c_tipo_cam")

router.use(bodyparser.json())

router.get("/generar-id",TipoCamControlador.generarId)
router.post("/registrar",TipoCamControlador.registrarControlador)
router.get("/consultar/:id",TipoCamControlador.consultarControlador)
router.put("/actualizar/:id",TipoCamControlador.actualizarControlador)
router.get("/consultar-todos",TipoCamControlador.consultarTodosControlador)
router.get("/consultar-patron/:patron",TipoCamControlador.consultarTipoCamPatronControlador)

// const json={
//     "tipo_cam":{
//         "id_tipo_cam":"tipc-1",
//         "nombre_tipo_cam":"tipo cam",
//         "estatu_tipo_cam":"1"
//     }
// }

// {
//     "tipo_cam":{
//         "id_tipo_cam":"tipc-1",
//         "nombre_tipo_cam":"tipo cam dos",
//         "estatu_tipo_cam":"0"
//     }
// }


module.exports= router