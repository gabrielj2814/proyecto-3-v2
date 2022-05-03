const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser")
const controladorProfesor=require("../../../controlador/c_profesor"),
bitacorra = require("../../../controlador/c_vitacora")

router.use(bodyparser.json())

router.post("/registrar",controladorProfesor.registrar, bitacorra.capturaDatos)
router.get("/consultar/:id/:token",controladorProfesor.consultar, bitacorra.capturaDatos)
router.put("/actualizar/:id",controladorProfesor.actualizar, bitacorra.capturaDatos)
router.get("/consultar-todos",controladorProfesor.consultarTodos)


module.exports = router