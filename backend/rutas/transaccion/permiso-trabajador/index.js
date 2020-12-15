const express=require("express"),
router=express.Router(),
bodyParser=require("body-parser"),
PermisoTrabajadorControlador=require("../../../controlador/c_permiso_trabajador")

//USE
router.use(bodyParser.json())

router.get("/",(req,res)=>{
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify({msj:"hola mundo"}))
    res.end()
})

router.get("/generar-id",PermisoTrabajadorControlador.generarId)
router.post("/registrar",PermisoTrabajadorControlador.registrarControlador)
router.get("/consultar/:id",PermisoTrabajadorControlador.consultaPermisoTrabajadorControlador)
router.get("/consultar-ultimo/:id",PermisoTrabajadorControlador.consultarPermisoTrabajadorXCedulaEstatuControlador)
router.put("/actualizar-estatu/:id",PermisoTrabajadorControlador.actualizarEstatuPermisoControlador)
router.patch("/actualizar-dias-aviles/:id",PermisoTrabajadorControlador.actualizarDiasAvilesPermiso)
router.get("/consultar-estatu/:estatu",PermisoTrabajadorControlador.consultarPermisoHoyControlador)
router.get("/caducar-permisos/:hasta",PermisoTrabajadorControlador.caducarPermisoTrabajadorControlador)
//reportes
router.get("/reporte-fecha/:desde/:hasta",PermisoTrabajadorControlador.consultarPermisosXFechaControlador)
router.get("/reporte-mensual",PermisoTrabajadorControlador.consultarMensualControlador)

const json={

    "permiso_trabajador":{
        "id_permiso_trabajador":"pert-2020-06-18-1",// formato -> pert-01-01-04-2020
        "id_cedula":"27636392",
        "id_permiso":"per-1",
		"fecha_desde_permiso_trabajador":"2020-06-18",
		"fecha_hasta_permiso_trabajador":"2020-06-20",
		"estatu_permiso_trabajador":"A",
		"permiso_trabajador_dias_aviles":"1"
    }

}

module.exports = router