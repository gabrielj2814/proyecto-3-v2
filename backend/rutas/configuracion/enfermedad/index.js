const express = require("express"),
  router = express.Router(),
  bodyparser = require("body-parser"),
  controladorEnfermedad = require("../../../controlador/c_lista_enfermedad"),
  bitacorra = require("../../../controlador/c_vitacora")


router.use(bodyparser.json())

router.post("/registrar", controladorEnfermedad.registrar_enfermedad, bitacorra.capturaDatos)//registrar
router.get("/consultar-todos", controladorEnfermedad.consultarTodos)// consultar todos
router.get("/consultar/:id/:token", controladorEnfermedad.consultar, bitacorra.capturaDatos)// consulta especifica
router.get("/consultar-patron/:patron", controladorEnfermedad.consultarpatron)// consulta especifica
router.put("/actualizar/:id", controladorEnfermedad.actualizar, bitacorra.capturaDatos)// actualizar



module.exports = router