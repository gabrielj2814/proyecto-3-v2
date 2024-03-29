const express = require("express"),
  router = express.Router(),
  bodyparser = require("body-parser")
const controladorEspecialista = require("../../../controlador/c_especialista"),
  bitacorra = require("../../../controlador/c_vitacora")

router.use(bodyparser.json())

router.post("/registrar", controladorEspecialista.registrar, bitacorra.capturaDatos)
router.get("/consultar/:id/:token", controladorEspecialista.consultar, bitacorra.capturaDatos)
router.get("/consultar-por-cedula/:cedula/:token", controladorEspecialista.consultarPorCedula, bitacorra.capturaDatos)
router.get("/consultar-todos", controladorEspecialista.consultar_todos)
router.get("/consultar-todos-activo", controladorEspecialista.consultar_todos_activos)
router.put("/actualizar/:id", controladorEspecialista.actualizar, bitacorra.capturaDatos)


module.exports = router