const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser")
const controladorProfesor=require("../../../controlador/c_profesor")

router.use(bodyparser.json())

router.post("/registrar",controladorProfesor.registrar)
router.get("/consultar/:id",controladorProfesor.consultar)
router.put("/actualizar/:id",controladorProfesor.actualizar)
router.get("/consultar-todos",controladorProfesor.consultarTodos)


module.exports = router