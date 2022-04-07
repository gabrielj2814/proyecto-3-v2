const express = require("express"),
  router = express.Router(),
  bodyparser = require("body-parser"),
  controladorRepresentante = require("../../../controlador/c_representante")


router.use(bodyparser.json())

router.post("/registrar", controladorRepresentante.registrar_representante)//registrar
router.post("/registrar-padres", controladorRepresentante.registrar_padres)//registrar padre
router.get("/consultar-todos", controladorRepresentante.consultar_todos)// consultar todos
router.get("/consultar/:id", controladorRepresentante.consultar)// consulta especifica
router.get("/consultar-patron/:patron", controladorRepresentante.consultarpatron) //consultar por patron
router.get("/representantes-activos", controladorRepresentante.consultarRepresentantesActivos) //consultar todos los representantes activos
router.get("/representantes-inactivos", controladorRepresentante.consultarRepresentantesInactivos) //consultar todos los representantes activos
router.put("/actualizar/:id", controladorRepresentante.actualizar)// actualizar


module.exports = router
