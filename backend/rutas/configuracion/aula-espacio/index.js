const express = require("express"),
  router = express.Router(),
  bodyparser = require("body-parser"),
  controladorAulaEspacio = require("../../../controlador/c_aula_espacio"),
  bitacorra = require("../../../controlador/c_vitacora")


router.use(bodyparser.json())

router.post("/registrar", controladorAulaEspacio.registrar, bitacorra.capturaDatos)
router.get("/consultar/:id/:token", controladorAulaEspacio.consultar, bitacorra.capturaDatos)
router.get("/consultar-todos", controladorAulaEspacio.consultarTodos)
router.put("/actualizar/:id", controladorAulaEspacio.actualizar, bitacorra.capturaDatos)

module.exports = router