const TipoCamModelo=require("../modelo/m_tipo_cam")
const VitacoraControlador = require("./c_vitacora")

const TipoCamControlador={}

TipoCamControlador.generarId=async (req,res) => {
    const TIPOCAM=new TipoCamModelo()
    const tipo_cam_result=await TIPOCAM.consultarTodosModelo()
    const id=`tipc-${(tipo_cam_result.rows.length)+1}`
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify({id:id}))
    res.end()
}

TipoCamControlador.registrarControlador=async (req,res,next) => {
    var respuesta_api={mensaje:"",estado_peticion:""}
    const {tipo_cam,token} = req.body
    const TIPOCAM=new TipoCamModelo()
    TIPOCAM.setDatos(tipo_cam)
    const tipo_cam_result=await TIPOCAM.consultarModelo()
    if(!TipoCamControlador.verificarExistencia(tipo_cam_result)){
        TIPOCAM.registrarModelo()
        respuesta_api.mensaje=`registro completado`
        respuesta_api.estado_peticion="200"
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"INSERT","ttipocam",tipo_cam.id_tipo_cam)
        next()
        // res.writeHead(200,{"Content-Type":"application/json"})
        // res.write(JSON.stringify(respuesta_api))
        // res.end()
    }
    else{
        respuesta_api.mensaje=`al registrar, por que ya hay un tipo de centro de asistencia medica con el mismo codigo -> ${tipo_cam.id_tipo_cam}`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

TipoCamControlador.consultarControlador=async (req,res,next) => {
    var respuesta_api={tipo_cam:[],mensaje:"",estado_peticion:""}
    const {id,token} = req.params
    const TIPOCAM=new TipoCamModelo()
    TIPOCAM.setIdTipoCam(id)
    const tipo_cam_result=await TIPOCAM.consultarModelo()
    if(TipoCamControlador.verificarExistencia(tipo_cam_result)){
        respuesta_api.tipo_cam=tipo_cam_result.rows[0]
        respuesta_api.mensaje=`consulta completada`
        respuesta_api.estado_peticion="200"
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"SELECT","ttipocam",id)
        next()
        // res.writeHead(200,{"Content-Type":"application/json"})
        // res.write(JSON.stringify(respuesta_api))
        // res.end()
    }
    else{
        respuesta_api.mensaje=`el elemento consultado no ha sido encontrado`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

TipoCamControlador.actualizarControlador=async (req,res,next) => {
    var respuesta_api={mensaje:"",estado_peticion:""}
    const {tipo_cam,token} = req.body
    const TIPOCAM=new TipoCamModelo()
    TIPOCAM.setDatos(tipo_cam)
    const tipo_cam_result=await TIPOCAM.consultarModelo()
    if(TipoCamControlador.verificarExistencia(tipo_cam_result)){
        TIPOCAM.actualizarModelo()
        respuesta_api.mensaje=`actualización completada`
        respuesta_api.estado_peticion="200"
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"UPDATE","ttipocam",tipo_cam.id_tipo_cam)
        next()
        // res.writeHead(200,{"Content-Type":"application/json"})
        // res.write(JSON.stringify(respuesta_api))
        // res.end()
    }
    else{
        respuesta_api.mensaje=`al actualizar, por que no hay ningun tipo de centro de asistencia medica con este codigo codigo -> ${tipo_cam.id_tipo_cam}`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

TipoCamControlador.consultarTodosControlador=async (req,res) => {
    var respuesta_api={tipo_cams:[],mensaje:"",estado_peticion:""}
    const TIPOCAM=new TipoCamModelo()
    const tipo_cam_result=await TIPOCAM.consultarTodosModelo()
    if(TipoCamControlador.verificarExistencia(tipo_cam_result)){
        respuesta_api.tipo_cams=tipo_cam_result.rows
        respuesta_api.mensaje=`consulta completada`
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje=`no hay ningun registro`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

TipoCamControlador.consultarTipoCamPatronControlador=async (req,res) => {
    var respuesta_api={tipo_cams:[],mensaje:"",estado_peticion:""}
    const {patron}=req.params
    const TIPOCAM=new TipoCamModelo()
    const tipo_cam_result=await TIPOCAM.consultarTipoCamPatronModelo(patron)
    if(TipoCamControlador.verificarExistencia(tipo_cam_result)){
        respuesta_api.tipo_cams=tipo_cam_result.rows
        respuesta_api.mensaje=`consulta completada`
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje=`no se a encontrado ningun resultado`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

TipoCamControlador.verificarExistencia=(result)=>{
    return result.rows.length!=0
}

module.exports= TipoCamControlador


// const TipoCamModelo=require("../modelo/m_tipo_cam")

// const TipoCamControlador={}

// TipoCamControlador.generarId=async (req,res) => {
//     const TIPOCAM=new TipoCamModelo()
//     const tipo_cam_result=await TIPOCAM.consultarTodosModelo()
//     const id=`tipc-${(tipo_cam_result.rows.length)+1}`
//     res.writeHead(200,{"Content-Type":"application/json"})
//     res.write(JSON.stringify({id:id}))
//     res.end()
// }

// TipoCamControlador.registrarControlador=async (req,res) => {
//     var respuesta_api={mensaje:"",estado_peticion:""}
//     const {tipo_cam} = req.body
//     const TIPOCAM=new TipoCamModelo()
//     TIPOCAM.setDatos(tipo_cam)
//     const tipo_cam_result=await TIPOCAM.consultarModelo()
//     if(!TipoCamControlador.verificarExistencia(tipo_cam_result)){
//         TIPOCAM.registrarModelo()
//         respuesta_api.mensaje=`registro completado`
//         respuesta_api.estado_peticion="200"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje=`al registrar, por que ya hay un tipo de centro de asistencia medica con el mismo codigo -> ${tipo_cam.id_tipo_cam}`
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// }

// TipoCamControlador.consultarControlador=async (req,res) => {
//     var respuesta_api={tipo_cam:[],mensaje:"",estado_peticion:""}
//     const {id} = req.params
//     const TIPOCAM=new TipoCamModelo()
//     TIPOCAM.setIdTipoCam(id)
//     const tipo_cam_result=await TIPOCAM.consultarModelo()
//     if(TipoCamControlador.verificarExistencia(tipo_cam_result)){
//         respuesta_api.tipo_cam=tipo_cam_result.rows[0]
//         respuesta_api.mensaje=`consulta completada`
//         respuesta_api.estado_peticion="200"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje=`el elemento consultado no ha sido encontrado`
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// }

// TipoCamControlador.actualizarControlador=async (req,res) => {
//     var respuesta_api={mensaje:"",estado_peticion:""}
//     const {tipo_cam} = req.body
//     const TIPOCAM=new TipoCamModelo()
//     TIPOCAM.setDatos(tipo_cam)
//     const tipo_cam_result=await TIPOCAM.consultarModelo()
//     if(TipoCamControlador.verificarExistencia(tipo_cam_result)){
//         TIPOCAM.actualizarModelo()
//         respuesta_api.mensaje=`actualización completada`
//         respuesta_api.estado_peticion="200"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje=`al actualizar, por que no hay ningun tipo de centro de asistencia medica con este codigo codigo -> ${tipo_cam.id_tipo_cam}`
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// }

// TipoCamControlador.consultarTodosControlador=async (req,res) => {
//     var respuesta_api={tipo_cams:[],mensaje:"",estado_peticion:""}
//     const TIPOCAM=new TipoCamModelo()
//     const tipo_cam_result=await TIPOCAM.consultarTodosModelo()
//     if(TipoCamControlador.verificarExistencia(tipo_cam_result)){
//         respuesta_api.tipo_cams=tipo_cam_result.rows
//         respuesta_api.mensaje=`consulta completada`
//         respuesta_api.estado_peticion="200"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje=`no hay ningun registro`
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// }

// TipoCamControlador.consultarTipoCamPatronControlador=async (req,res) => {
//     var respuesta_api={tipo_cams:[],mensaje:"",estado_peticion:""}
//     const {patron}=req.params
//     const TIPOCAM=new TipoCamModelo()
//     const tipo_cam_result=await TIPOCAM.consultarTipoCamPatronModelo(patron)
//     if(TipoCamControlador.verificarExistencia(tipo_cam_result)){
//         respuesta_api.tipo_cams=tipo_cam_result.rows
//         respuesta_api.mensaje=`consulta completada`
//         respuesta_api.estado_peticion="200"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje=`no se a encontrado ningun resultado`
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// }

// TipoCamControlador.verificarExistencia=(result)=>{
//     return result.rows.length!=0
// }

// module.exports= TipoCamControlador