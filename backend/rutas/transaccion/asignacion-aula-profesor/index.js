
const express=require("express")
const router=express.Router()
const bodyParser=require("body-parser")
const ControladorAsignacionAulaProfesor=require("../../../controlador/c_asignacion_aula_profesor"),
bitacorra = require("../../../controlador/c_vitacora")

router.use(bodyParser.json())

router.post("/registrar",ControladorAsignacionAulaProfesor.registrar, bitacorra.capturaDatos)
router.get("/consultar/:id/:token",ControladorAsignacionAulaProfesor.consultar, bitacorra.capturaDatos)
router.get("/consultar-todos",ControladorAsignacionAulaProfesor.consultarTodos)
router.post("/consultar-aulas-espacio-disponible",ControladorAsignacionAulaProfesor.consultarAulasEspacioDisponibles)
router.get("/consultar-por-ano-escolar/:id",ControladorAsignacionAulaProfesor.consultarPorAnoEscolar)
router.get("/consultar-disponibilidad-aula/:id_ano_escolar/:id_aula",ControladorAsignacionAulaProfesor.consultarDisponibilidadAula)
router.get("/consultar-disponibilidad-profesor/:id_ano_escolar/:id_profesor",ControladorAsignacionAulaProfesor.consultarDisponibilidadProfesor)
router.put("/actualizar/:id",ControladorAsignacionAulaProfesor.actualizar, bitacorra.capturaDatos)
router.get("/consultar-aula-por-ano-actual/:id_ano_escolar/:id_aula",ControladorAsignacionAulaProfesor.consularProfesorPorAulaYAno)
router.get("/consultar-asignacion-actual/:cedula",ControladorAsignacionAulaProfesor.consularAsigancionActualProfesor)
router.get("/verificar-disponibilidad-trabajador/:cedula",ControladorAsignacionAulaProfesor.verificarDisponibilidadTrabajador)


module.exports = router