
const express=require("express")
const router=express.Router()
const bodyParser=require("body-parser")
const ControladorAsignacionAulaProfesor=require("../../../controlador/c_asignacion_aula_profesor")

router.use(bodyParser.json())

router.post("/registrar",ControladorAsignacionAulaProfesor.registrar)


module.exports = router