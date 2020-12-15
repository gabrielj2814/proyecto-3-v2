const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser")
EspecialidadControlador=require("../../../controlador/c_especialidad")

router.use(bodyparser.json())

router.post("/registrar",EspecialidadControlador.registrarControlador)
router.get("/consultar/:id",EspecialidadControlador.consultarControlador)
router.put("/actualizar/:id",EspecialidadControlador.actualizarControlador)
router.get("/consultar-todos",EspecialidadControlador.consultarTodosControlador)
router.get("/consultar-patron/:patron",EspecialidadControlador.consultarEspecialidadPatronControlador)

// {
//     "especialidad":{
//         "id_especialidad":1
//         "nombre_especialidad":"especialidad uno",
//         "estatu_especialidad":"1"
//     }
// }

module.exports = router