const express=require("express"),
router=express.Router(),
controladorVacuna=require("../../../controlador/c_vacuna"),
bodyParse=require("body-parser")

router.use(bodyParse.json())



module.exports = router