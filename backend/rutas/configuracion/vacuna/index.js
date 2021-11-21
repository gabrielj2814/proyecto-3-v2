const express = require("express"),
  router = express.Router(),
  bodyparser = require("body-parser"),
  controladorVacuna = require("../../../controlador/c_lista_vacuna")


router.use(bodyparser.json())

router.post("/registrar", controladorVacuna.registrar_vacuna)//registrar
router.get("/consultar-todos", controladorVacuna.consultarTodos)// consultar todos
router.get("/consultar/:id", controladorVacuna.consultar)// consulta especifica
router.put("/actualizar/:id", controladorVacuna.actualizar)// actualizar



module.exports = router