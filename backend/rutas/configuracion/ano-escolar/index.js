const express = require("express"),
  router = express.Router(),
  bodyparser = require("body-parser"),
  controladorAnoEscolar = require("../../../controlador/c_ano_escolar")


router.use(bodyparser.json())

router.post("/registrar", controladorAnoEscolar.registrar_ano_escolar)//registrar
router.get("/consultar-todos", controladorAnoEscolar.consultar_todos)// consultar todos
router.get("/fecha-actual", controladorAnoEscolar.getDateNow)// consultar todos
router.get("/consultar-patron/:patron", controladorAnoEscolar.consultarpatron) //consultar por patron
router.put("/actualizar/:id", controladorAnoEscolar.actualizar)// actualizar



module.exports = router