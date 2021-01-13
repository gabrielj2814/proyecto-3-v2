const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
VitacoraControlador=require("../../../controlador/c_vitacora")

router.use(bodyparser.json())

router.post("/consultar",VitacoraControlador.consultarRegistros)

// const json={
//     vitacora:{
//         fecha_desde:"",
//         fecha_hasta:"",
//         id_cedula:"",
//         tablas:[],
//         operaciones:[]
//     }
// }

// const json2={
//     "vitacora":{
//         "fecha_desde":"19-07-2020",
//         "fecha_hasta":"19-07-2020",
//         "id_cedula":"27636392",
//         "tablas":["ttrabajador","tpermiso","tmedico","tcam"],
//         "operaciones":["INSERT","SELECT","UPDATE"]
//     }
// }

module.exports = router