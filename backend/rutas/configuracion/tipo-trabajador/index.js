const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
TipoTrabajadorControlador=require("../../../controlador/c_tipo_trabajador"),
VitacoraControlador=require("../../../controlador/c_vitacora")

router.use(bodyparser.json())

router.get("/",(req,res)=>{
    
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify({mensaje:"hola mundo"}))
    res.end()

})

router.get("/generar-id",async (req,res)=>{
    const TIPOTRABAJADOR=new TipoTrabajadorControlador(),
    tipo_trabajador=await TIPOTRABAJADOR.generarId()
    id=`tipot-${(tipo_trabajador.rows.length)+1}`
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify({id:id}))
    res.end()
})

router.post("/registrar",async (req,res,next)=>{
    const TIPOTRABAJADOR=new TipoTrabajadorControlador(),
    respuesta_api={mensaje:"registro completado con exito",estado_peticion:"200"},
    tipo_trabajador_form=req.body.tipo_trabajador,
    {token} = req.body
    const tipo_trabajador=await TIPOTRABAJADOR.consultarControlador(tipo_trabajador_form.id_tipo_trabajador)
    if(tipo_trabajador.rows.length===0){
        TIPOTRABAJADOR.registrarControlador(tipo_trabajador_form)
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"INSERT","ttipotrabajador",tipo_trabajador_form.id_tipo_trabajador)
        next()
        // res.writeHead(200,{"Content-Type":"application/json"})
        // res.write(JSON.stringify(respuesta_api))
        // res.end()
    }
    else{
        respuesta_api.mensaje="el registro no pudo ser completado por que ya hay un tipo trabajador con el mismo codigo"
        respuesta_api.estado_peticion="500"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
},VitacoraControlador.capturaDatos)

router.get("/consultar/:id/:token",async (req,res,next)=>{
    const TIPOTRABAJADOR=new TipoTrabajadorControlador(),
    {id}=req.params,
    {token}=req.params
    var respuesta_api={tipo_trabajador:[],mensaje:"",estado_peticion:""}
    const tipo_trabajador=await TIPOTRABAJADOR.consultarControlador(id)
    if(tipo_trabajador.rows.length!==0){
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_peticion="200"
        respuesta_api.tipo_trabajador=tipo_trabajador.rows[0]
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"SELECT","ttipotrabajador",id)
        next()
    }
    else{
        respuesta_api.mensaje="la consulta no pudo ser completada por que el id no exite en la base de datos"
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
},VitacoraControlador.capturaDatos)

router.put("/actualizar/:id",async (req,res,next)=>{
    const TIPOTRABAJADOR=new TipoTrabajadorControlador(),
    tipo_trabajador_form=req.body.tipo_trabajador,
    {token}=req.body
    var respuesta_api={mensaje:"actualizacion completada con exito",estado_peticion:"200"}
    const tipo_trabajador=await TIPOTRABAJADOR.consultarControlador(tipo_trabajador_form.id_tipo_trabajador)
    if(tipo_trabajador.rows.length===1){
        TIPOTRABAJADOR.actualizarControlador(tipo_trabajador_form)
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"UPDATE","ttipotrabajador",tipo_trabajador_form.id_tipo_trabajador)
        next()
    }
    else{
        respuesta_api.mensaje="la consulta no pudo ser completada por que el id no exite en la base de datos"
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
},VitacoraControlador.capturaDatos)

router.get("/consultar-tipos-trabajador",async (req,res)=>{
    const TIPOTRABAJADOR=new TipoTrabajadorControlador()
    var respuesta_api={tipos_trabajador:[],mensaje:"",estado_peticion:""}
    const tipo_trabajador=await TIPOTRABAJADOR.consultarTodosTiposTrabajadores()
    if(tipo_trabajador.rows.length!==0){
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_peticion="200"
        respuesta_api.tipos_trabajador=tipo_trabajador.rows
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje="elementos no encontrado"
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
})

router.get("/consultar-tipos-trabajador-patron/:patron",async (req,res)=>{
    var respuesta_api={tipos_trabajadores:[],mensaje:"busqueda completada",estado_peticion:"200"}
    const patron=req.params.patron,
    TIPOTRABAJADOR=new TipoTrabajadorControlador(),
    tipos_trabajadores=await TIPOTRABAJADOR.consultarTipoTrabajadorPatronControlador(patron)
    respuesta_api.tipos_trabajadores=tipos_trabajadores.rows
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
})

module.exports = router

// const express=require("express"),
// router=express.Router(),
// bodyparser=require("body-parser"),
// TipoTrabajadorControlador=require("../../../controlador/c_tipo_trabajador")

// router.use(bodyparser.json())

// router.get("/",(req,res)=>{
    
//     res.writeHead(200,{"Content-Type":"application/json"})
//     res.write(JSON.stringify({mensaje:"hola mundo"}))
//     res.end()

// })

// router.get("/generar-id",async (req,res)=>{
//     const TIPOTRABAJADOR=new TipoTrabajadorControlador(),
//     tipo_trabajador=await TIPOTRABAJADOR.generarId()
//     id=`tipot-${(tipo_trabajador.rows.length)+1}`
//     res.writeHead(200,{"Content-Type":"application/json"})
//     res.write(JSON.stringify({id:id}))
//     res.end()
// })

// router.post("/registrar",async (req,res)=>{
//     const TIPOTRABAJADOR=new TipoTrabajadorControlador(),
//     respuesta_api={mensaje:"registro completado con exito",estado_peticion:"200"},
//     tipo_trabajador_form=req.body.tipo_trabajador
//     const tipo_trabajador=await TIPOTRABAJADOR.consultarControlador(tipo_trabajador_form.id_tipo_trabajador)
//     if(tipo_trabajador.rows.length===0){
//         TIPOTRABAJADOR.registrarControlador(tipo_trabajador_form)
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje="el registro no pudo ser completado por que ya hay un tipo trabajador con el mismo codigo"
//         respuesta_api.estado_peticion="500"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// })

// router.get("/consultar/:id",async (req,res)=>{
//     const TIPOTRABAJADOR=new TipoTrabajadorControlador(),
//     id=req.params.id
//     var respuesta_api={tipo_trabajador:[],mensaje:"",estado_peticion:""}
//     const tipo_trabajador=await TIPOTRABAJADOR.consultarControlador(id)
//     if(tipo_trabajador.rows.length!==0){
//         respuesta_api.mensaje="consulta completada"
//         respuesta_api.estado_peticion="200"
//         respuesta_api.tipo_trabajador=tipo_trabajador.rows[0]
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje="la consulta no pudo ser completada por que el id no exite en la base de datos"
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// })

// router.put("/actualizar/:id",async (req,res)=>{
//     const TIPOTRABAJADOR=new TipoTrabajadorControlador(),
//     tipo_trabajador_form=req.body.tipo_trabajador
//     var respuesta_api={mensaje:"actualizacion completada con exito",estado_peticion:"200"}
//     const tipo_trabajador=await TIPOTRABAJADOR.consultarControlador(tipo_trabajador_form.id_tipo_trabajador)
//     if(tipo_trabajador.rows.length===1){
//         TIPOTRABAJADOR.actualizarControlador(tipo_trabajador_form)
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje="la consulta no pudo ser completada por que el id no exite en la base de datos"
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// })

// router.get("/consultar-tipos-trabajador",async (req,res)=>{
//     const TIPOTRABAJADOR=new TipoTrabajadorControlador()
//     var respuesta_api={tipos_trabajador:[],mensaje:"",estado_peticion:""}
//     const tipo_trabajador=await TIPOTRABAJADOR.consultarTodosTiposTrabajadores()
//     if(tipo_trabajador.rows.length!==0){
//         respuesta_api.mensaje="consulta completada"
//         respuesta_api.estado_peticion="200"
//         respuesta_api.tipos_trabajador=tipo_trabajador.rows
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje="elementos no encontrado"
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// })

// router.get("/consultar-tipos-trabajador-patron/:patron",async (req,res)=>{
//     var respuesta_api={tipos_trabajadores:[],mensaje:"busqueda completada",estado_peticion:"200"}
//     const patron=req.params.patron,
//     TIPOTRABAJADOR=new TipoTrabajadorControlador(),
//     tipos_trabajadores=await TIPOTRABAJADOR.consultarTipoTrabajadorPatronControlador(patron)
//     respuesta_api.tipos_trabajadores=tipos_trabajadores.rows
//     res.writeHead(200,{"Content-Type":"application/json"})
//     res.write(JSON.stringify(respuesta_api))
//     res.end()
// })

// module.exports = router