const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
controladorPromocion=require("../../../controlador/c_promocion")

router.use(bodyparser.json())

// router.post("/crear/:id_boleta",controladorPromocion.crear)


module.exports = router 