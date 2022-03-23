const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
controladorBoleta=require("../../../controlador/c_boleta")

router.use(bodyparser.json())

router.post("/registrar",controladorBoleta.registrar)
router.post("/registrar-masivo",controladorBoleta.registrarMasivo)
router.get("/consultar-boletas/:id",controladorBoleta.consultarTodasLasBoletasDelInscripto)
// router.get("",controladorBoleta.consultarTodasLasBoleta)
router.put("/actualizar-observacion",controladorBoleta.actualizarObservacion)



module.exports = router 