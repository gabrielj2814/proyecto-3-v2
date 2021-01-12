const express = require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
AsistenciaControlador=require("../../../controlador/c_asistencia"),
VitacoraControlador=require("../../../controlador/c_vitacora")

router.use(bodyparser.json())

router.post("/presente",AsistenciaControlador.presenteControlador,VitacoraControlador.capturaDatos)
router.get("/consultar-asistencia-trabajador/:cedula/:token",AsistenciaControlador.consultarAsistenciaControlador,VitacoraControlador.capturaDatos)
router.get("/verificar-inasistencias-justificada",AsistenciaControlador.verificarInasistenciasJustificada)
router.get("/verificar-inasistencias-injustificada",AsistenciaControlador.verificarInasistenciaInjustificada)
router.get("/consultar-asistencias-trabajador/:cedula",AsistenciaControlador.consultarAsistenciasTrabajadorControlador)
router.get("/consultar-asistencias-por-fecha/:fecha",AsistenciaControlador.consultarAsistenciasFechaControlador)
router.get("/consultar-todas-las-asistencias",AsistenciaControlador.consultarTodasLasAsistenciasControlador)



module.exports= router

// const express = require("express"),
// router=express.Router(),
// bodyparser=require("body-parser"),
// AsistenciaControlador=require("../../../controlador/c_asistencia")

// router.use(bodyparser.json())

// router.post("/presente",AsistenciaControlador.presenteControlador)
// router.get("/verificar-inasistencias-justificada",AsistenciaControlador.verificarInasistenciasJustificada)
// router.get("/verificar-inasistencias-injustificada",AsistenciaControlador.verificarInasistenciaInjustificada)
// router.get("/consultar-asistencias-trabajador/:cedula",AsistenciaControlador.consultarAsistenciasTrabajadorControlador)
// router.get("/consultar-asistencias-por-fecha/:fecha",AsistenciaControlador.consultarAsistenciasFechaControlador)

// module.exports= router