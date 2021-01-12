const ReposoControlador = require("../../../controlador/c_reposo")

const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
VitacoraControaldor=require("../../../controlador/c_vitacora")

router.use(bodyparser.json())

router.get("/generar-id",ReposoControlador.generarId)
router.post("/registrar",ReposoControlador.registrarControlador,VitacoraControaldor.capturaDatos)
router.get("/consultar/:id/:token",ReposoControlador.consultarControlador,VitacoraControaldor.capturaDatos)
router.put("/actualizar/:id",ReposoControlador.actualizarControlador,VitacoraControaldor.capturaDatos)
router.get("/consultar-todos",ReposoControlador.consultarTodosControlador)
router.get("/consultar-patron/:patron",ReposoControlador.consultarReposoPatronControlador)

const json={
    "reposo":{
        "id_reposo":"repo-2",
        "nombre_reposo":"reposo dos",
        "dias_reposo":"10",
        "estatu_reposo":"1"
    }
}

module.exports= router

// const ReposoControlador = require("../../../controlador/c_reposo")

// const express=require("express"),
// router=express.Router(),
// bodyparser=require("body-parser")

// router.use(bodyparser.json())

// router.get("/generar-id",ReposoControlador.generarId)
// router.post("/registrar",ReposoControlador.registrarControlador)
// router.get("/consultar/:id",ReposoControlador.consultarControlador)
// router.put("/actualizar/:id",ReposoControlador.actualizarControlador)
// router.get("/consultar-todos",ReposoControlador.consultarTodosControlador)
// router.get("/consultar-patron/:patron",ReposoControlador.consultarReposoPatronControlador)

// const json={
//     "reposo":{
//         "id_reposo":"repo-2",
//         "nombre_reposo":"reposo dos",
//         "dias_reposo":"10",
//         "estatu_reposo":"1"
//     }
// }

// module.exports= router