const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
controladorNota=require("../../../controlador/c_nota")

router.use(bodyparser.json())

router.post("/crear/:id_boleta",controladorNota.crear)
router.put("/actualizar-nota",controladorNota.actualizarNota)
router.get("/consultar-notas/:id",controladorNota.consultarNotaBoleta)


module.exports = router 