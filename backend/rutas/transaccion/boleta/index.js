const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
controladorBoleta=require("../../../controlador/c_boleta")

router.use(bodyparser.json())

router.post("",controladorBoleta.registrar)
router.post("",controladorBoleta.registrarMasivo)
router.get("",controladorBoleta.consultarTodasLasBoletasDelInscripto)
router.get("",controladorBoleta.consultarTodasLasBoleta)
router.get("",controladorBoleta.actualizarObservacion)



module.exports = router 