const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
controladorNota=require("../../../controlador/c_nota")

router.use(bodyparser.json())

router.post("/crear/:id_boleta",controladorNota.crear)
router.put("/actualizar-nota",controladorNota.actualizarNota)
router.put("/consultar-notas/:id_boleta",controladorNota.consultarNotaBoleta)


module.exports = router 