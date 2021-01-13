const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
ReposoTrabajadorControlador=require("../../../controlador/c_reposo_trabajador"),
VitacoraControlador=require("../../../controlador/c_vitacora")

router.use(bodyparser.json())
// localhost:8080/transaccion/reposo-trabajador/consultar/repot-2020-05-25-25
router.get("/generar-id",ReposoTrabajadorControlador.generarId)
router.post("/registrar",ReposoTrabajadorControlador.registrarControlador,VitacoraControlador.capturaDatos)
router.get("/consultar/:id/:token",ReposoTrabajadorControlador.consultarControlador,VitacoraControlador.capturaDatos)
router.put("/actualizar/:id",ReposoTrabajadorControlador.actualizarControlador,VitacoraControlador.capturaDatos)
router.get("/consultar-todos",ReposoTrabajadorControlador.consultarTodosControlador)
router.get("/consultar-patron/:patron",ReposoTrabajadorControlador.consultarReposoTrabajadorPatronControlador)
router.get("/consultar-reposo/:desde/:hasta",ReposoTrabajadorControlador.consultarRepososXFechaControlador)
router.get("/caducar-reposos/:hasta",ReposoTrabajadorControlador.caducarRepososControlador)
router.get("/consultar-reposo-trabajador/:cedula/:desde/:hasta/:token",ReposoTrabajadorControlador.consultarRepososTrabajadorFechaDesdeHasta,VitacoraControlador.capturaDatos)


const json={
    "reposo_trabajador":{
        "id_reposo_trabajador":"repot-2020-06-17-1",
        "id_cedula":"27636392",
        "id_reposo":"repo-1",
        "fecha_desde_reposo_trabajador":"2020-06-17",
        "fecha_hasta_reposo_trabajador":"2020-06-20",
        "estatu_reposo_trabajador":"1",
        "descripcion_reposo_trabajador":"hola mundo sql 2",
        "id_cam":"1",
        "id_asignacion_medico_especialidad":"ams-2020-06-15-1"
    }
}

module.exports= router

// const ReposoTrabajadorControlador = require("../../../controlador/c_reposo_trabajador")
// const ReposoControlador = require("../../../controlador/c_reposo")

// const express=require("express"),
// router=express.Router(),
// bodyparser=require("body-parser"),
// RepososTrabajadorControlador=require("../../../controlador/c_reposo_trabajador")

// router.use(bodyparser.json())
// // localhost:8080/transaccion/reposo-trabajador/consultar/repot-2020-05-25-25
// router.get("/generar-id",RepososTrabajadorControlador.generarId)
// router.post("/registrar",RepososTrabajadorControlador.registrarControlador)
// router.get("/consultar/:id",ReposoTrabajadorControlador.consultarControlador)
// router.put("/actualizar/:id",RepososTrabajadorControlador.actualizarControlador)
// router.get("/consultar-todos",ReposoTrabajadorControlador.consultarTodosControlador)
// router.get("/consultar-patron/:patron",ReposoTrabajadorControlador.consultarReposoTrabajadorPatronControlador)
// router.get("/consultar-reposo/:desde/:hasta",ReposoTrabajadorControlador.consultarRepososXFechaControlador)
// router.get("/caducar-reposos/:hasta",ReposoTrabajadorControlador.caducarRepososControlador)

// // const json={
// //     "reposo_trabajador":{
// //         "id_reposo_trabajador":"repot-2020-06-17-1",
// //         "id_cedula":"27636392",
// //         "id_reposo":"repo-1",
// //         "fecha_desde_reposo_trabajador":"2020-06-17",
// //         "fecha_hasta_reposo_trabajador":"2020-06-20",
// //         "estatu_reposo_trabajador":"1",
// //         "descripcion_reposo_trabajador":"hola mundo sql 2",
// //         "id_cam":"1",
// //         "id_asignacion_medico_especialidad":"ams-2020-06-15-1"
// //     }
// // }

// module.exports= router