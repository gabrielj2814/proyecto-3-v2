const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
ControladorFechaLapsoAcademico=require("../../../controlador/c_fecha_lapso_academico")


router.use(bodyparser.json())

// router.post("/registrar",)
// router.get("/consultar/:id",)
// router.get("/consultar-todo",)
// router.get("/consultar-por-ano-escolar/:id",)
// router.put("/actualizar/:id",)
// router.get("/consultar-fecha-servidor",)

module.exports = router 