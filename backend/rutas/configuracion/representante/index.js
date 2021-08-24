const express = require("express"),
  router = express.Router(),
  bodyparser = require("body-parser"),
  controladorGrado = require("../../../controlador/c_representante")


router.use(bodyparser.json())

router.post("/registrar", controladorRepresentante.registrar_representante)//registrar
router.get("/consultar-todos", controladorRepresentante.consultar_todos)// consultar todos
router.get("/consultar/:id", controladorRepresentante.consultar)// consulta especifica
router.put("/actualizar/:id", controladorRepresentante.actualizar)// actualizar


module.exports = router