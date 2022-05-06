const express = require("express"),
  router = express.Router(),
  bodyparser = require("body-parser"),
  controladorDirector = require("../../../controlador/c_director"),
  bitacorra = require("../../../controlador/c_vitacora")


router.use(bodyparser.json())

router.post("/registrar", controladorDirector.registrar_director, bitacorra.capturaDatos)//registrar
router.get("/consultar-todos", controladorDirector.consultarTodos)// consultar todos
router.get("/consultar/:id/:token", controladorDirector.consultar, bitacorra.capturaDatos)// consulta especifica
router.put("/actualizar/:id", controladorDirector.actualizar, bitacorra.capturaDatos)// actualizar
router.get("/consultar-patron/:patron", controladorDirector.consultarpatron)



module.exports = router