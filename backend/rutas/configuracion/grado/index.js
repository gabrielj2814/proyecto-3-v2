const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
controladorGrado=require("../../../controlador/c_grado"),
  bitacorra = require("../../../controlador/c_vitacora")



router.use(bodyparser.json())

router.post("/registrar",controladorGrado.registrar_grador, bitacorra.capturaDatos)//registrar
router.get("/consultar-todos",controladorGrado.consultarTodos)// consultar todos
router.get("/consultar/:id/:token",controladorGrado.consultar, bitacorra.capturaDatos)// consulta especifica
router.put("/actualizar/:id",controladorGrado.actualizar, bitacorra.capturaDatos)// actualizar
router.get("/verificar-existencia-secciones-grados",controladorGrado.verificarQueTodosLosGradosTenganSecciones)



module.exports = router 