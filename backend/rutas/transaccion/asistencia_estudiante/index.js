
const express=require("express")
const router=express.Router()
const bodyParser=require("body-parser")
const ControladorAsistenciaEstudiante=require("../../../controlador/c_asistencia_estudiante")

router.use(bodyParser.json())

router.put("/actualizar-estado",ControladorAsistenciaEstudiante.actualizarEstadoAsistencia)
router.put("/actualizar-observacion",ControladorAsistenciaEstudiante.actualizarObservacionAsistencia)
router.post("/crear-asistencia/:cedula",ControladorAsistenciaEstudiante.crearAsistenciaDeHoy)


module.exports = router