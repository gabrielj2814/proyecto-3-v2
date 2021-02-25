const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
HorarioControlador=require("../../../controlador/c_horario"),
VitacoraControaldor=require("../../../controlador/c_vitacora")

router.use(bodyparser.json())

router.get("/consultar-activo",HorarioControlador.consultarHorarioActivoControlador)
router.get("/consultar-todos",HorarioControlador.consultarTodosLosHorarios)
router.post("/agregar-horario",HorarioControlador.agregarNuevoHorarioControlador,VitacoraControaldor.capturaDatos)
router.put("/actualizar/:id",HorarioControlador.actualizarHorario,VitacoraControaldor.capturaDatos)
router.get("/consultar/:id",HorarioControlador.consultarHorario)
const json={
    "horario":{
        "horario_entrada":"07:30AM",
        "horario_salida":"10:30AM"
    }
}

module.exports=router

// const express=require("express"),
// router=express.Router(),
// bodyparser=require("body-parser"),
// HorarioControlador=require("../../../controlador/c_horario")

// router.use(bodyparser.json())

// router.get("/consultar-activo",HorarioControlador.consultarHoraioActivoControlador)
// router.post("/agregar-horario",HorarioControlador.agregarNuevoHorarioControlador)
// const json={
//     "horario":{
//         "horario_entrada":"07:30AM",
//         "horario_salida":"10:30AM"
//     }
// }

// module.exports=router