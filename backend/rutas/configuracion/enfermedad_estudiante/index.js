const express=require("express"),router = express.Router(),bodyparser = require("body-parser")
const controladorEnfermedadEstudiante = require("../../../controlador/c_enfermedad_estudiante")

router.use(bodyparser.json())
router.post("/registrar",controladorEnfermedadEstudiante.registrar)
router.get("/consultar/:id",controladorEnfermedadEstudiante.consultar)

module.exports = router;