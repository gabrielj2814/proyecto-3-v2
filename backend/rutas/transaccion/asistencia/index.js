const express = require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
AsistenciaControlador=require("../../../controlador/c_asistencia")

router.use(bodyparser.json())

router.post("/presente",AsistenciaControlador.presenteControlador)
router.get("/verificar-inasistencias-justificada",AsistenciaControlador.verificarInasistenciasJustificada)
router.get("/verificar-inasistencias-injustificada",AsistenciaControlador.verificarInasistenciaInjustificada)
router.get("/consultar-asistencias-trabajador/:cedula",AsistenciaControlador.consultarAsistenciasTrabajadorControlador)
router.get("/consultar-asistencias-por-fecha/:fecha",AsistenciaControlador.consultarAsistenciasFechaControlador)

module.exports= router