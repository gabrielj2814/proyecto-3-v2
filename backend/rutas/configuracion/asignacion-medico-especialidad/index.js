const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
AsignacionMedicoEspecialidadControlador=require("../../../controlador/c_asignacion_medico_especialidad"),
VitacoraControlador=require("../../../controlador/c_vitacora")

router.use(bodyparser.json())

router.get("/generar-id",AsignacionMedicoEspecialidadControlador.generarId)
router.post("/registrar",AsignacionMedicoEspecialidadControlador.registrarControlador,VitacoraControlador.capturaDatos)
router.get("/consultar/:id/:token",AsignacionMedicoEspecialidadControlador.consultarControlador,VitacoraControlador.capturaDatos)
router.put("/actualizar/:id",AsignacionMedicoEspecialidadControlador.actualizarControlador,VitacoraControlador.capturaDatos)
router.get("/consultar-todos",AsignacionMedicoEspecialidadControlador.consultarTodosControlador)
router.get("/consultar-asignacion-por-medico/:id",AsignacionMedicoEspecialidadControlador.consultarAsignacionPorMedico)
router.get("/consultar-asignacion-por-especialidad/:id",AsignacionMedicoEspecialidadControlador.consultarAsignacionPorEspecialidad)

module.exports= router

// const express=require("express"),
// router=express.Router(),
// bodyparser=require("body-parser"),
// AsignacionMedicoEspecialidadControlador=require("../../../controlador/c_asignacion_medico_especialidad")

// router.use(bodyparser.json())

// router.get("/generar-id",AsignacionMedicoEspecialidadControlador.generarId)
// router.post("/registrar",AsignacionMedicoEspecialidadControlador.registrarControlador)
// router.get("/consultar/:id",AsignacionMedicoEspecialidadControlador.consultarControlador)
// router.put("/actualizar/:id",AsignacionMedicoEspecialidadControlador.actualizarControlador)
// router.get("/consultar-todos",AsignacionMedicoEspecialidadControlador.consultarTodosControlador)

// module.exports= router