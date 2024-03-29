const { json } = require("express")
const controladorPlanificacionLapsoEscolar = require("../../../controlador/c_planificacion_lapso_escolar")

const express=require("express"),
router=express.Router(),
ControladorPlanificacionLapsoEscolar=require("../../../controlador/c_planificacion_lapso_escolar"),
bodyParse=require("body-parser")

router.use(bodyParse.json())

router.post("/crear-planificacion",ControladorPlanificacionLapsoEscolar.crearPlanificacion)
router.get("/consultar-planificacion/:cedula",ControladorPlanificacionLapsoEscolar.consultarPlanificacion)
router.post("/crear-lapso",ControladorPlanificacionLapsoEscolar.crearLapsoAcademico)
router.get("/consultar-lapso/:id_planificaion",ControladorPlanificacionLapsoEscolar.consultarLapsoPorPlanificacion)
router.get("/consultar-lapso/lapso/:id_lapso",ControladorPlanificacionLapsoEscolar.consultarLapso)
router.post("/crear-objetivo",ControladorPlanificacionLapsoEscolar.crearObjetivo)
router.put("/actualizar-objetivo",ControladorPlanificacionLapsoEscolar.actualizar)
router.put("/actualizar-estado-lapso",ControladorPlanificacionLapsoEscolar.actualizarEstadoLapso)
router.get("/consultar-todos-objetivo/:id_lapso",ControladorPlanificacionLapsoEscolar.consultarTodos)
router.delete("/eliminar-objetivo/:id",ControladorPlanificacionLapsoEscolar.eliminar)
router.put("/asignar-fecha-lapso/:idFecha/:idLapso",ControladorPlanificacionLapsoEscolar.asignarFechaLapso)



module.exports= router