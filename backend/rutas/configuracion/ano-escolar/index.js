const express = require("express"),
  router = express.Router(),
  bodyparser = require("body-parser"),
  controladorAnoEscolar = require("../../../controlador/c_ano_escolar"),
  bitacora = require("../../../controlador/c_vitacora")


router.use(bodyparser.json())

router.post("/registrar", controladorAnoEscolar.registrar_ano_escolar, bitacora.capturaDatos)//registrar
router.get("/consultar-todos", controladorAnoEscolar.consultar_todos)// consultar todos
router.get("/fecha-actual", controladorAnoEscolar.getDateNow)// consultar todos
router.get("/consultar-patron/:patron", controladorAnoEscolar.consultarpatron) //consultar por patron
router.get("/consultar/:id/:token", controladorAnoEscolar.consultar, bitacora.capturaDatos) //consultar
router.get("/consultar-seguimiento-anual", controladorAnoEscolar.consultarAnoSeguimiento) //consultar segumiento año escolar
router.get("/consultar-ano-escolar-activo", controladorAnoEscolar.consultarAnoEscolarActivo) //consultar año escolar activo
router.get("/chequear-ano-escolar", controladorAnoEscolar.verificarAnoEscolar)// chequear ano ecolar este
router.get("/consultar-ano-escolar-siguiente", controladorAnoEscolar.consultarAnoEscolarSiguiente)// chequear ano ecolar
router.put("/actualizar/:id", controladorAnoEscolar.actualizar, bitacora.capturaDatos)// actualizar

module.exports = router