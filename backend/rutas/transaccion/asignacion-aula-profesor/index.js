
const express=require("express")
const router=express.Router()
const bodyParser=require("body-parser")
const ControladorAsignacionAulaProfesor=require("../../../controlador/c_asignacion_aula_profesor")

router.use(bodyParser.json())

router.post("/registrar",ControladorAsignacionAulaProfesor.registrar)
router.get("/consultar/:id",ControladorAsignacionAulaProfesor.consultar)
router.get("/consultar-todos",ControladorAsignacionAulaProfesor.consultarTodos)
router.get("/consultar-por-ano-escolar/:id",ControladorAsignacionAulaProfesor.consultarPorAnoEscolar)
router.put("/actualizar/:id",ControladorAsignacionAulaProfesor.actualizar)


module.exports = router