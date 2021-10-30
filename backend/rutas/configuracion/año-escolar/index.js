const express = require("express"),
  router = express.Router(),
  bodyparser = require("body-parser"),
  controladorAnoEscolar = require("../../../controlador/c_año_escolar")


router.use(bodyparser.json())

router.post("/registrar", controladorAnoEscolar.registrar_ano_escolar)//registrar
router.get("/consultar-todos", controladorAnoEscolar.consultar_todos)// consultar todos
router.get("/consultar-patron/:patron", controladorAnoEscolar.consultarpatron) //consultar por patron
router.get("/consultar/:id", controladorAnoEscolar.consultar) //consultar
router.get("/consultar-ano-escolar-activo", controladorAnoEscolar.consultarAnoEscolarActivo) //consultar año escolar activo
router.put("/actualizar/:id", controladorAnoEscolar.actualizar)// actualizar



module.exports = router