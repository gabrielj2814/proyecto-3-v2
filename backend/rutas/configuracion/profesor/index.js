const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser")
const controladorProfesor=require("../../../controlador/c_profesor")

router.use(bodyparser.json())

router.post("/registrar",controladorProfesor.registrar)


module.exports = router