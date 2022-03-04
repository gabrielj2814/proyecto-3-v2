const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
ControladorFechaLapsoAcademico=require("../../../controlador/c_fecha_lapso_academico")


router.use(bodyparser.json())

router.post("/registrar",ControladorFechaLapsoAcademico.registrar)
router.get("/consultar/:id",ControladorFechaLapsoAcademico.consultar)
router.get("/consultar-todo",ControladorFechaLapsoAcademico.consultarTodos)
router.get("/consultar-por-ano-escolar/:id",ControladorFechaLapsoAcademico.consultarPorAnoEscolor)
router.put("/actualizar/:id",ControladorFechaLapsoAcademico.actulizar)
// router.get("/consultar-fecha-servidor",)

module.exports = router 