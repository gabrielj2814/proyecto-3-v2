const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser")
const controladorProfesor=require("../../../controlador/c_profesor")

router.use(bodyparser.json())

router.post("/registrar",controladorProfesor.registrar)
router.get("/consultar/:id",controladorProfesor.consultar)


module.exports = router