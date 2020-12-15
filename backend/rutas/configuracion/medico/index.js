const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
MedicoControlador=require("../../../controlador/c_medico")

router.use(bodyparser.json())

router.post("/registrar",MedicoControlador.registrarControlador)
router.get("/consultar/:id",MedicoControlador.consultarControlador)
router.put("/actualizar/:id",MedicoControlador.actualizarControlador)
router.get("/consultar-todos",MedicoControlador.consultarTodosControlador)
router.get("/consultar-patron/:patron",MedicoControlador.consultarMedicoPatronControlador)

// {
//     "medico":{
//         "id_medico":"med-1",
//         "nombre_medico":"el pelon",
//         "apellido_medico":"de brazzer"
//     }
// }


module.exports = router