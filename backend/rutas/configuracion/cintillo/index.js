const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
fileUpLoad=require("express-fileupload"),
ControladorCintillo=require("../../../controlador/c_cintillo"),
VitacoraControlador=require("../../../controlador/c_vitacora")

router.use(bodyparser.json())
router.use(fileUpLoad())

router.post("/subir-cintillo",ControladorCintillo.subirCintillo)
router.post("/enviar-foto/:fecha/:hora",ControladorCintillo.enviarFoto)
router.get("/consultar-todos",ControladorCintillo.consultarTodosLosCintillos)
router.get("/consultar-activo",ControladorCintillo.consultarCintilloActivo)
router.put("/actualizar-cintillo",ControladorCintillo.actualizarCintillo)
router.delete("/eliminar-cintillo/:id",ControladorCintillo.eliminarCintillo)

module.exports =router