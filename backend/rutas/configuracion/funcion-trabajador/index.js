
const express = require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
FuncionTrabajadorControlador=require("../../../controlador/c_funcion_trabajador"),
VitacoraControlador=require("../../../controlador/c_vitacora")

router.use(bodyparser.json())

router.get("/",(req,res)=>{
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify({msj:"hola mundo"}))
    res.end()
})

router.get("/generar-id",async(req,res)=>{
    const FUNCION=new FuncionTrabajadorControlador()
    const id=await FUNCION.generarId()
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify({id:id}))
    res.end()
})

router.post("/registrar",async (req,res,next)=>{
    var funcion_form=req.body.funcion
    const {token}=req.body
    var respuesta_api={mensaje:"registro completado",estado_peticion:"200"}
    const FUNCION=new FuncionTrabajadorControlador()
    const funcion=await FUNCION.consultarControlador(funcion_form.id_funcion_trabajador)
    if(funcion.rows.length===0){
        FUNCION.registrarConstrolador(funcion_form)
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"INSERT","tfunciontrabajador",funcion_form.id_funcion_trabajador)
        next()
        // res.writeHead(200,{"Content-Type":"application/json"})
        // res.write(JSON.stringify(respuesta_api))
        // res.end()
    }
    else{
        respuesta_api.estado_peticion="404"
        respuesta_api.mensaje="la funcion no a podido ser registra por que ya hay una dyncion el el mismo codigo"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
},VitacoraControlador.capturaDatos)

router.get("/consultar/:id/:token",async(req,res,next)=>{
    const {id,token}=req.params
    var respuesta_api={funciones:[],mensaje:"",estado_peticion:""}
    const FUNCION=new FuncionTrabajadorControlador()
    const funcion=await FUNCION.consultarControlador(id)
    if(funcion.rows.length!==0){
        respuesta_api.estado_peticion="200"
        respuesta_api.mensaje="consulta completada"
        respuesta_api.funciones=funcion.rows[0]
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"SELECT","tfunciontrabajador",id)
        next()
    }
    else{
        respuesta_api.estado_peticion="404"
        respuesta_api.mensaje="el elemento consultado no exite en la base de datos"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
},VitacoraControlador.capturaDatos)

router.put("/actualizar/:id",async (req,res,next)=>{
    const funcion_form=req.body.funcion,
    {token}=req.body
    var respuesta_api={mensaje:"actualización completada",estado_peticion:"200"}
    const FUNCION=new FuncionTrabajadorControlador()
    const funcion=await FUNCION.consultarControlador(funcion_form.id_funcion_trabajador)
    if(funcion.rows.length===1){
        FUNCION.actualizarControlador(funcion_form)
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"UPDATE","tfunciontrabajador",funcion_form.id_funcion_trabajador)
        next()
    }
    else{
        respuesta_api.estado_peticion="404"
        respuesta_api.mensaje="el elemento consultado no exite en la base de datos"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
},VitacoraControlador.capturaDatos)

router.get("/consultar-todos",async(req,res)=>{
    const id=req.params.id
    var respuesta_api={funciones:[],mensaje:"",estado_peticion:""}
    const FUNCION=new FuncionTrabajadorControlador()
    const funcion=await FUNCION.consultarTodosControlador()
    if(funcion.rows.length!==0){
        respuesta_api.estado_peticion="200"
        respuesta_api.mensaje="consulta completada"
        respuesta_api.funciones=funcion.rows
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.estado_peticion="404"
        respuesta_api.mensaje="el elemento consultado no exite en la base de datos"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
})

router.get("/consultar-id-tipo-trabajador/:id",async (req,res)=>{
    var respuesta_api={funciones:[],mensaje:"consulta completada",estado_peticion:"200"}
    const FUNCION=new FuncionTrabajadorControlador()
    const id=req.params.id
    const funcion=await FUNCION.consultarFuncionXIdTipoTrabajadorControlador(id)
    if(funcion.rows){
        if(funcion.rows.length!==0){
            respuesta_api.funciones=funcion.rows
            res.writeHead(200,{"Content-Type":"application/json"})
            res.write(JSON.stringify(respuesta_api))
            res.end()
        }
        else{
            respuesta_api.mensaje="no hay funciones almacenadas con este id->"+id
            respuesta_api.estado_peticion="404"
            res.writeHead(200,{"Content-Type":"application/json"})
            res.write(JSON.stringify({respuesta_api}))
            res.end()
        }
    }
    else{
        respuesta_api.mensaje="error en el servidor"
        respuesta_api.estado_peticion="500"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify({respuesta_api}))
        res.end()
    }
})

router.get("/consultar-patron/:patron",async (req,res)=>{
    const patron=req.params.patron
    var respuesta_api={funciones:[],mensaje:"consulta completada",estado_peticion:"200"}
    const FUNCION=new FuncionTrabajadorControlador()
    const funcion=await FUNCION.consultarPatronControlador(patron)

    if(funcion.rows.length!==0){
        respuesta_api.funciones=funcion.rows
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje="no hay funciones almacenadas"
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify({respuesta_api}))
        res.end()
    }
})

module.exports = router

// const express = require("express"),
// router=express.Router(),
// bodyparser=require("body-parser"),
// FuncionTrabajadorControlador=require("../../../controlador/c_funcion_trabajador")

// router.use(bodyparser.json())

// router.get("/",(req,res)=>{
//     res.writeHead(200,{"Content-Type":"application/json"})
//     res.write(JSON.stringify({msj:"hola mundo"}))
//     res.end()
// })

// router.get("/generar-id",async(req,res)=>{
//     const FUNCION=new FuncionTrabajadorControlador()
//     const id=await FUNCION.generarId()
//     res.writeHead(200,{"Content-Type":"application/json"})
//     res.write(JSON.stringify({id:id}))
//     res.end()
// })

// router.post("/registrar",async (req,res)=>{
//     var funcion_form=req.body.funcion
//     var respuesta_api={mensaje:"registro completado",estado_peticion:"200"}
//     const FUNCION=new FuncionTrabajadorControlador()
//     const funcion=await FUNCION.consultarControlador(funcion_form.id_funcion_trabajador)
//     if(funcion.rows.length===0){
//         FUNCION.registrarConstrolador(funcion_form)
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.estado_peticion="404"
//         respuesta_api.mensaje="la funcion no a podido ser registra por que ya hay una dyncion el el mismo codigo"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// })

// router.get("/consultar/:id",async(req,res)=>{
//     const id=req.params.id
//     var respuesta_api={funciones:[],mensaje:"",estado_peticion:""}
//     const FUNCION=new FuncionTrabajadorControlador()
//     const funcion=await FUNCION.consultarControlador(id)
//     if(funcion.rows.length!==0){
//         respuesta_api.estado_peticion="200"
//         respuesta_api.mensaje="consulta completada"
//         respuesta_api.funciones=funcion.rows[0]
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.estado_peticion="404"
//         respuesta_api.mensaje="el elemento consultado no exite en la base de datos"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// })

// router.put("/actualizar/:id",async (req,res)=>{
//     const funcion_form=req.body.funcion
//     var respuesta_api={mensaje:"actualización completada",estado_peticion:"200"}
//     const FUNCION=new FuncionTrabajadorControlador()
//     const funcion=await FUNCION.consultarControlador(funcion_form.id_funcion_trabajador)
//     if(funcion.rows.length===1){
//         FUNCION.actualizarControlador(funcion_form)
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.estado_peticion="404"
//         respuesta_api.mensaje="el elemento consultado no exite en la base de datos"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// })

// router.get("/consultar-todos",async(req,res)=>{
//     const id=req.params.id
//     var respuesta_api={funciones:[],mensaje:"",estado_peticion:""}
//     const FUNCION=new FuncionTrabajadorControlador()
//     const funcion=await FUNCION.consultarTodosControlador()
//     if(funcion.rows.length!==0){
//         respuesta_api.estado_peticion="200"
//         respuesta_api.mensaje="consulta completada"
//         respuesta_api.funciones=funcion.rows
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.estado_peticion="404"
//         respuesta_api.mensaje="el elemento consultado no exite en la base de datos"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// })

// router.get("/consultar-id-tipo-trabajador/:id",async (req,res)=>{
//     var respuesta_api={funciones:[],mensaje:"consulta completada",estado_peticion:"200"}
//     const FUNCION=new FuncionTrabajadorControlador()
//     const id=req.params.id
//     const funcion=await FUNCION.consultarFuncionXIdTipoTrabajadorControlador(id)
//     if(funcion.rows){
//         if(funcion.rows.length!==0){
//             respuesta_api.funciones=funcion.rows
//             res.writeHead(200,{"Content-Type":"application/json"})
//             res.write(JSON.stringify(respuesta_api))
//             res.end()
//         }
//         else{
//             respuesta_api.mensaje="no hay funciones almacenadas con este id->"+id
//             respuesta_api.estado_peticion="404"
//             res.writeHead(200,{"Content-Type":"application/json"})
//             res.write(JSON.stringify({respuesta_api}))
//             res.end()
//         }
//     }
//     else{
//         respuesta_api.mensaje="error en el servidor"
//         respuesta_api.estado_peticion="500"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify({respuesta_api}))
//         res.end()
//     }
// })

// router.get("/consultar-patron/:patron",async (req,res)=>{
//     const patron=req.params.patron
//     var respuesta_api={funciones:[],mensaje:"consulta completada",estado_peticion:"200"}
//     const FUNCION=new FuncionTrabajadorControlador()
//     const funcion=await FUNCION.consultarPatronControlador(patron)

//     if(funcion.rows.length!==0){
//         respuesta_api.funciones=funcion.rows
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje="no hay funciones almacenadas"
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify({respuesta_api}))
//         res.end()
//     }
// })

// module.exports = router