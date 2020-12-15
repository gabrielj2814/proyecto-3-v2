const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
AsignacionMedicoEspecialidadControlador=require("../../../controlador/c_asignacion_medico_especialidad")

router.use(bodyparser.json())

router.get("/generar-id",AsignacionMedicoEspecialidadControlador.generarId)
router.post("/registrar",AsignacionMedicoEspecialidadControlador.registrarControlador)
router.get("/consultar/:id",AsignacionMedicoEspecialidadControlador.consultarControlador)
router.put("/actualizar/:id",AsignacionMedicoEspecialidadControlador.actualizarControlador)
router.get("/consultar-todos",AsignacionMedicoEspecialidadControlador.consultarTodosControlador)

module.exports= router