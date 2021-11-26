const express = require("express"),
  router = express.Router(),
  bodyparser = require("body-parser"),
  controladorEnfermedad = require("../../../controlador/c_lista_enfermedad")


router.use(bodyparser.json())

router.post("/registrar", controladorEnfermedad.registrar_enfermedad)//registrar
router.get("/consultar-todos", controladorEnfermedad.consultarTodos)// consultar todos
router.get("/consultar/:id", controladorEnfermedad.consultar)// consulta especifica
router.get("/consultar-patron/:patron", controladorEnfermedad.consultarpatron)// consulta especifica
router.put("/actualizar/:id", controladorEnfermedad.actualizar)// actualizar



module.exports = router