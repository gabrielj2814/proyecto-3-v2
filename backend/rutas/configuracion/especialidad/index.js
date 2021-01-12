const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
EspecialidadControlador=require("../../../controlador/c_especialidad"),
VitacoraControlador=require("../../../controlador/c_vitacora")

router.use(bodyparser.json())

router.post("/registrar",EspecialidadControlador.registrarControlador,VitacoraControlador.capturaDatos)
router.get("/consultar/:id/:token",EspecialidadControlador.consultarControlador,VitacoraControlador.capturaDatos)
router.put("/actualizar/:id",EspecialidadControlador.actualizarControlador,VitacoraControlador.capturaDatos)
router.get("/consultar-todos",EspecialidadControlador.consultarTodosControlador)
router.get("/consultar-patron/:patron",EspecialidadControlador.consultarEspecialidadPatronControlador)

module.exports = router

// const express=require("express"),
// router=express.Router(),
// bodyparser=require("body-parser")
// EspecialidadControlador=require("../../../controlador/c_especialidad")

// router.use(bodyparser.json())

// router.post("/registrar",EspecialidadControlador.registrarControlador)
// router.get("/consultar/:id",EspecialidadControlador.consultarControlador)
// router.put("/actualizar/:id",EspecialidadControlador.actualizarControlador)
// router.get("/consultar-todos",EspecialidadControlador.consultarTodosControlador)
// router.get("/consultar-patron/:patron",EspecialidadControlador.consultarEspecialidadPatronControlador)

// // {
// //     "especialidad":{
// //         "id_especialidad":1
// //         "nombre_especialidad":"especialidad uno",
// //         "estatu_especialidad":"1"
// //     }
// // }

// module.exports = router