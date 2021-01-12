const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser")
//controlador
const PermisoControlador=require("../../../controlador/c_permiso"),
VitacoraControlador=require("../../../controlador/c_vitacora")

router.use(bodyparser.json())

router.get("/",(req,res)=>{
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify({mensaje:"hola"}))
    res.end()
})

router.get("/generar-id",async (req,res)=>{
    const PERMISO=new PermisoControlador(),
    permiso=await PERMISO.generarIdPermiso()
    var id=`per-${(permiso.rows.length)+1}`
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify({id:id}))
    res.end()
})

router.post("/registrar",async(req,res,next)=>{
    const permiso_form= req.body.permiso,
    token=req.body.token,
    respuesta_api={mensaje:"registro completado con exito",estado_peticion:"200"}
    PERMISO=new PermisoControlador()
    const permiso=await PERMISO.consultarControlador(permiso_form.id_permiso)
    if(permiso.rows.length===0){
        PERMISO.registrarControlador(permiso_form)
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"INSERT","tpermiso",permiso_form.id_permiso)
        next()
    }
    else{
        respuesta_api.mensaje="el permiso no puedo ser registro por que ya hay un epermiso con el mismo codigo"
        respuesta_api.estado_peticion="500"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
},VitacoraControlador.capturaDatos)

router.get("/consultar/:id/:token",async (req,res,next)=>{
    const {id}=req.params,
    {token}=req.params,
    PERMISO=new PermisoControlador()
    var respuesta_api={permiso:"",mensaje:"",estado_peticion:""}
    const permiso=await PERMISO.consultarControlador(id)
    if(permiso.rows.length!==0){
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_peticion="200"
        respuesta_api.permiso=permiso.rows[0]
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"SELECT","tpermiso",id)
        next()
    }
    else{
        respuesta_api.mensaje="el permiso consultado no existe en la base de datos"
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
},VitacoraControlador.capturaDatos)

router.put("/actualizar/:id",async (req,res,next)=>{
    const permiso_form=req.body.permiso,
    {token}=req.body,
    PERMISO=new PermisoControlador()
    var respuesta_api={mensaje:"actualización completada",estado_peticion:"200"}
    const permiso=await PERMISO.consultarControlador(permiso_form.id_permiso)
    if(permiso.rows.length===1){
        PERMISO.actualizarControlador(permiso_form)
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"UPDATE","tpermiso",permiso_form.id_permiso)
        next()
    }
    else{
        respuesta_api.mensaje="el permiso consultado no existe en la base de datos"
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
},VitacoraControlador.capturaDatos)

router.get("/consultar-permisos",async (req,res)=>{
    var  respuesta_api={permisos:[],mensaje:"consulta completada",estado_peticion:"200"}
    const PERMISO=new PermisoControlador(),
    permisos=await PERMISO.consultarTodosControlador()
    if(permisos.rows.length!==0){
        respuesta_api.permisos=permisos.rows
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.estado_peticion="404"
        respuesta_api.mensaje="elemento no encontrado"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
})

router.get(`/consultar-perfiles-patron/:patron`,async (req,res)=>{
    var respuesta_api={permisos:[],mensaje:"busqueda completada",estado_peticion:"200"}
    const patron=req.params.patron
    PERMISO=new PermisoControlador(),
    permisos=await PERMISO.consultarPermisoPatronControlador(patron)
    respuesta_api.permisos=permisos.rows
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
})

module.exports= router

// const express=require("express"),
// router=express.Router(),
// bodyparser=require("body-parser")
// //controlador
// const PermisoControlador=require("../../../controlador/c_permiso")

// router.use(bodyparser.json())

// router.get("/",(req,res)=>{
//     res.writeHead(200,{"Content-Type":"application/json"})
//     res.write(JSON.stringify({mensaje:"hola"}))
//     res.end()
// })

// router.get("/generar-id",async (req,res)=>{
//     const PERMISO=new PermisoControlador(),
//     permiso=await PERMISO.generarIdPermiso()
//     var id=`per-${(permiso.rows.length)+1}`
//     res.writeHead(200,{"Content-Type":"application/json"})
//     res.write(JSON.stringify({id:id}))
//     res.end()
// })

// router.post("/registrar",async(req,res)=>{
//     const permiso_form= req.body.permiso,
//     respuesta_api={mensaje:"registro completado con exito",estado_peticion:"200"}
//     PERMISO=new PermisoControlador()
//     const permiso=await PERMISO.consultarControlador(permiso_form.id_permiso)
//     if(permiso.rows.length===0){
//         PERMISO.registrarControlador(permiso_form)
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje="el permiso no puedo ser registro por que ya hay un epermiso con el mismo codigo"
//         respuesta_api.estado_peticion="500"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// })

// router.get("/consultar/:id",async (req,res)=>{
//     const id=req.params.id,
//     PERMISO=new PermisoControlador()
//     var respuesta_api={permiso:"",mensaje:"",estado_peticion:""}
//     const permiso=await PERMISO.consultarControlador(id)
//     if(permiso.rows.length!==0){
//         respuesta_api.mensaje="consulta completada"
//         respuesta_api.estado_peticion="200"
//         respuesta_api.permiso=permiso.rows[0]
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje="el permiso consultado no existe en la base de datos"
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// })

// router.put("/actualizar/:id",async (req,res)=>{
//     //const id=req.params.id,
//     permiso_form=req.body.permiso,
//     PERMISO=new PermisoControlador()
//     var respuesta_api={mensaje:"actualización completada",estado_peticion:"200"}
//     const permiso=await PERMISO.consultarControlador(permiso_form.id_permiso)
//     if(permiso.rows.length===1){
//         PERMISO.actualizarControlador(permiso_form)
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje="el permiso consultado no existe en la base de datos"
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// })

// router.get("/consultar-permisos",async (req,res)=>{
//     var  respuesta_api={permisos:[],mensaje:"consulta completada",estado_peticion:"200"}
//     const PERMISO=new PermisoControlador(),
//     permisos=await PERMISO.consultarTodosControlador()
//     if(permisos.rows.length!==0){
//         respuesta_api.permisos=permisos.rows
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.estado_peticion="404"
//         respuesta_api.mensaje="elemento no encontrado"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// })

// router.get(`/consultar-perfiles-patron/:patron`,async (req,res)=>{
//     var respuesta_api={permisos:[],mensaje:"busqueda completada",estado_peticion:"200"}
//     const patron=req.params.patron
//     PERMISO=new PermisoControlador(),
//     permisos=await PERMISO.consultarPermisoPatronControlador(patron)
//     respuesta_api.permisos=permisos.rows
//     res.writeHead(200,{"Content-Type":"application/json"})
//     res.write(JSON.stringify(respuesta_api))
//     res.end()
// })

// module.exports= router