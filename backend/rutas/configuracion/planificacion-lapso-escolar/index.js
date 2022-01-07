const { json } = require("express")
const controladorPlanificacionLapsoEscolar = require("../../../controlador/c_planificacion_lapso_escolar")

const express=require("express"),
router=express.Router(),
ControladorPlanificacionLapsoEscolar=require("../../../controlador/c_planificacion_lapso_escolar"),
bodyParse=require("body-parser")

router.use(bodyParse.json())

router.post("/crear-planificacion",ControladorPlanificacionLapsoEscolar.crearPlanificacion)



module.exports= router