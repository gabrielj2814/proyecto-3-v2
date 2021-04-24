const express = require("express"),
router=express.Router(),
bcrypt=require("bcrypt"),
bodyparser=require("body-parser"),
TrabajadorControlador=require("../../../controlador/c_trabajador"),
VitacoraControlador=require("../../../controlador/c_vitacora")

router.use(bodyparser.json())

router.get("/",(req,res)=>{
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify({msj:"hola mundo"}))
    res.end()
})

router.get("/fecha-servidor",(req,res)=>{
    const Moment=require("moment")
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify({
        fechaServidor:Moment().format("YYYY-MM-DD")
    }))
    res.end()
})

router.post("/registrar",async (req,res,next)=>{
    var respuesta_api={mensaje:"registro completado",estado_peticion:"200"}
    const trabajador_form=req.body.trabajador,
    {token}= req.body,
    TRABAJADOR=new TrabajadorControlador(),
    trabajador=await TRABAJADOR.consultarControlador(trabajador_form.id_cedula)
    if(trabajador.rows.length===0){
        TRABAJADOR.registrarConstrolador(trabajador_form)
        req.vitacora=VitacoraControlador.json(respuesta_api,token,'INSERT',"ttrabajador",trabajador_form.id_cedula)
        next()
    }
    else{
        respuesta_api.mensaje="no se a podido realizar el registro por que ya hay un trabajador con esa misma cedula"
        respuesta_api.estado_peticion="500"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
},VitacoraControlador.capturaDatos)

router.get("/consultar/:id/:token",async (req,res,next)=>{
    const {id,token}= req.params
    var respuesta_api={trabajador:"",mensaje:"",estado_peticion:""}
    const TRABAJADOR=new TrabajadorControlador()
    const trabajador=await TRABAJADOR.consultarControlador(id)
    if(trabajador.rows.length!=0){
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_peticion="200"
        trabajador.rows[0].respuesta_1=""
        trabajador.rows[0].respuesta_2=""
        respuesta_api.trabajador=trabajador.rows[0]
        req.vitacora=VitacoraControlador.json(respuesta_api,token,'SELECT',"ttrabajador",id)
        next()
    }
    else{
        respuesta_api.mensaje="el trabajador consultado no existe en la base de datos"
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
},VitacoraControlador.capturaDatos)

router.put("/actualizar/:id",async (req,res,next)=>{
    var respuesta_api={mensaje:"actualizacion completada",estado_peticion:"200"}
    const trabajador_form=req.body.trabajador,
    {token}=req.body,
    TRABAJADOR=new TrabajadorControlador(),
    trabajador=await TRABAJADOR.consultarControlador(trabajador_form.id_cedula)
    if(trabajador.rows.length===1){
        TRABAJADOR.actualizarControlador(trabajador_form)
        req.vitacora=VitacoraControlador.json(respuesta_api,token,'UPDATE',"ttrabajador",trabajador_form.id_cedula)
        next()
    }
    else{
        respuesta_api.mensaje="el trabajador consultado no existe en la base de datos"
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
},VitacoraControlador.capturaDatos)

router.patch("/activar-cuenta/:id",async (req,res)=>{
    const datos_clienet=req.body.trabajador
    var respuesta_api={trabajador:"",mensaje:"",estado_peticion:""}
    const TRABAJADOR=new TrabajadorControlador()
    const trabajador=await TRABAJADOR.consultarControlador(datos_clienet.id_cedula)
    if(trabajador.rows.length===1){
        if(trabajador.rows[0].estatu_cuenta==="0"){
            const clave_encriptada=await TRABAJADOR.encriptarClave(bcrypt,datos_clienet.clave_trabajador)
            datos_clienet.clave_trabajador=clave_encriptada
            await TRABAJADOR.activarCuentaControlador(datos_clienet)
            respuesta_api.mensaje="la activación del usuario a sido completada"
            respuesta_api.estado_peticion="200"
            res.writeHead(200,{"Content-Type":"application/json"})
            res.write(JSON.stringify(respuesta_api))
            res.end()
        }
        else{
            respuesta_api.mensaje="no se puedo realizar la operacion por que le usuario ya realizo este procedimiento"
            respuesta_api.estado_peticion="200"
            res.writeHead(200,{"Content-Type":"application/json"})
            res.write(JSON.stringify(respuesta_api))
            res.end()
        }
    }
    else{
        respuesta_api.mensaje="el trabajador consultado no existe en la base de datos"
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
})

router.get("/consultar-todos",async (req,res)=>{
    var respuesta_api={trabajadores:[],mensaje:"",estado_peticion:""}
    const TRABAJADOR=new TrabajadorControlador()
    const trabajador=await TRABAJADOR.consultarTodosControlador()
    if(trabajador.rows.length!==0){
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_peticion="200"
        respuesta_api.trabajadores=trabajador.rows
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje="el trabajador consultado no existe en la base de datos"
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
})

router.get("/consultar-patron/:patron",async (req,res)=>{
    var respuesta_api={trabajadores:[],mensaje:"busqueda completada",estado_peticion:"200"}
    const patron=req.params.patron
    const TRABAJADOR=new TrabajadorControlador()
    const trabajador=await TRABAJADOR.consultarPatronControlador(patron)
    respuesta_api.trabajadores=trabajador.rows
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
})

// 

router.get("/consultar-trabajador/:id",async (req,res)=>{
    const {id}= req.params
    var respuesta_api={trabajador:"",mensaje:"",estado_peticion:""}
    const TRABAJADOR=new TrabajadorControlador()
    const trabajador=await TRABAJADOR.consultarControlador(id)
    if(trabajador.rows.length!=0){
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_peticion="200"
        respuesta_api.trabajador=trabajador.rows[0]
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
        // req.vitacora=VitacoraControlador.json(respuesta_api,token,'SELECT',"ttrabajador",id)
        // next()
    }
    else{
        respuesta_api.mensaje="el trabajador consultado no existe en la base de datos"
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
})

router.get("/cambiar-clave/:id/:claveNueva/:respuesta1/:respuesta2",async (req,res)=>{
    let {id,claveNueva,respuesta1,respuesta2}= req.params
    var respuesta_api={mensaje:"",estado_peticion:""}
    const TRABAJADOR=new TrabajadorControlador()
    claveNueva=await TRABAJADOR.encriptarClave(bcrypt,claveNueva)           
    const trabajador=await TRABAJADOR.cambiarClaveControlador(id,claveNueva,respuesta1,respuesta2)
    if(trabajador.rowCount>0){
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
        // req.vitacora=VitacoraControlador.json(respuesta_api,token,'SELECT',"ttrabajador",id)
        // next()
    }
    else{
        respuesta_api.mensaje="el trabajador consultado no existe en la base de datos o las respuestas de las preguntas de seguridad son incorrectas"
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
})


module.exports = router















// const express = require("express"),
// router=express.Router(),
// bcrypt=require("bcrypt"),
// bodyparser=require("body-parser"),
// TrabajadorControlador=require("../../../controlador/c_trabajador")

// router.use(bodyparser.json())

// router.get("/",(req,res)=>{
//     res.writeHead(200,{"Content-Type":"application/json"})
//     res.write(JSON.stringify({msj:"hola mundo"}))
//     res.end()
// })

// router.post("/registrar",async (req,res)=>{
//     var respuesta_api={mensaje:"registro completado",estado_peticion:"200"}
//     const trabajador_form=req.body.trabajador
//     const TRABAJADOR=new TrabajadorControlador()
//     const trabajador=await TRABAJADOR.consultarControlador(trabajador_form.id_cedula)
//     if(trabajador.rows.length===0){
//         TRABAJADOR.registrarConstrolador(trabajador_form)
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje="no se a podido realizar el registro por que ya hay un trabajador con esa misma cedula"
//         respuesta_api.estado_peticion="500"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// })

// router.get("/consultar/:id",async (req,res)=>{
//     const id= req.params.id
//     var respuesta_api={trabajador:"",mensaje:"",estado_peticion:""}
//     const TRABAJADOR=new TrabajadorControlador()
//     const trabajador=await TRABAJADOR.consultarControlador(id)
//     if(trabajador.rows.length!=0){
//         respuesta_api.mensaje="consulta completada"
//         respuesta_api.estado_peticion="200"
//         trabajador.rows[0].respuesta_1=""
//         trabajador.rows[0].respuesta_2=""
//         respuesta_api.trabajador=trabajador.rows[0]
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje="el trabajador consultado no existe en la base de datos"
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// })

// router.put("/actualizar/:id",async (req,res)=>{
//     var respuesta_api={mensaje:"actualizacion completada",estado_peticion:"200"}
//     const trabajador_form=req.body.trabajador
//     const TRABAJADOR=new TrabajadorControlador()
//     const trabajador=await TRABAJADOR.consultarControlador(trabajador_form.id_cedula)
//     if(trabajador.rows.length===1){
//         TRABAJADOR.actualizarControlador(trabajador_form)
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje="el trabajador consultado no existe en la base de datos"
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// })

// router.patch("/activar-cuenta/:id",async (req,res)=>{
//     const datos_clienet=req.body.trabajador;
//     var respuesta_api={trabajador:"",mensaje:"",estado_peticion:""}
//     const TRABAJADOR=new TrabajadorControlador()
//     // problema
//     const trabajador=await TRABAJADOR.consultarControlador(datos_clienet.id_cedula)
//     console.log(trabajador);
//     if(trabajador.rows.length===1){
//         if(trabajador.rows[0].estatu_cuenta==="0"){
//             const clave_encriptada=await TRABAJADOR.encriptarClave(bcrypt,datos_clienet.clave_trabajador)
//             datos_clienet.clave_trabajador=clave_encriptada
//             await TRABAJADOR.activarCuentaControlador(datos_clienet)
//             respuesta_api.mensaje="la activación del usuario a sido completada"
//             respuesta_api.estado_peticion="200"
//             res.writeHead(200,{"Content-Type":"application/json"})
//             res.write(JSON.stringify(respuesta_api))
//             res.end()
//         }
//         else{
//             respuesta_api.mensaje="no se puedo realizar la operacion por que le usuario ya realizo este procedimiento"
//             respuesta_api.estado_peticion="200"
//             res.writeHead(200,{"Content-Type":"application/json"})
//             res.write(JSON.stringify(respuesta_api))
//             res.end()
//         }
//     }
//     else{
//         respuesta_api.mensaje="el trabajador consultado no existe en la base de datos"
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     // res.writeHead(200,{"Content-Type":"application/json"})
//     // res.write(JSON.stringify(trabajador))
//     // res.end()
// })

// router.get("/consultar-todos",async (req,res)=>{
//     var respuesta_api={trabajadores:[],mensaje:"",estado_peticion:""}
//     const TRABAJADOR=new TrabajadorControlador()
//     const trabajador=await TRABAJADOR.consultarTodosControlador()
//     if(trabajador.rows.length!==0){
//         respuesta_api.mensaje="consulta completada"
//         respuesta_api.estado_peticion="200"
//         respuesta_api.trabajadores=trabajador.rows
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje="el trabajador consultado no existe en la base de datos"
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// })

// router.get("/consultar-patron/:patron",async (req,res)=>{
//     var respuesta_api={trabajadores:[],mensaje:"busqueda completada",estado_peticion:"200"}
//     const patron=req.params.patron
//     const TRABAJADOR=new TrabajadorControlador()
//     const trabajador=await TRABAJADOR.consultarPatronControlador(patron)
//     respuesta_api.trabajadores=trabajador.rows
//     res.writeHead(200,{"Content-Type":"application/json"})
//     res.write(JSON.stringify(respuesta_api))
//     res.end()
// })

// module.exports = router