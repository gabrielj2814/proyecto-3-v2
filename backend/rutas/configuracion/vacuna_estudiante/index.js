const express=require("express"),router = express.Router(),bodyparser = require("body-parser")
const controladorVacunaEstudiante = require("../../../controlador/c_vacuna_estudiante")

router.use(bodyparser.json())
router.post("/registrar",controladorVacunaEstudiante.registrar)
router.get("/consultar/:id",controladorVacunaEstudiante.consultar)

module.exports = router;