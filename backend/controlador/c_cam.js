const CamModelo=require("../modelo/m_cam"),
VitacoraControlador=require("./c_vitacora")

const CamControlador={}

CamControlador.registrarControlador=async (req,res,next) => {
    var respuesta_api={mensaje:"",estado_peticion:""}
    const CAM=new CamModelo()
    const {cam,token}=req.body
    CAM.setDatos(cam)
    const cam_result=await CAM.consultarModelo()
    if(!CamControlador.verificarExistencia(cam_result)){
        CAM.registrarModelo()
        respuesta_api.mensaje=`registro completado`
        respuesta_api.estado_peticion="200"
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"INSERT","tcam",cam.id_cam)
        next()
    }
    else{
        respuesta_api.mensaje=`al registrar, ya hay un registro con este codigo -> ${cam.id_cam}`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    
}

CamControlador.consultarControlador=async (req,res,next) => {
    var respuesta_api={cam:[],mensaje:"",estado_peticion:""}
    const CAM=new CamModelo()
    const {id,token}=req.params
    CAM.setIdCam(id)
    const cam_result=await CAM.consultarModelo()
    if(CamControlador.verificarExistencia(cam_result)){
        respuesta_api.cam=cam_result.rows[0]
        respuesta_api.mensaje=`consulta completada`
        respuesta_api.estado_peticion="200"
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"SELECT","tcam",id)
        next()
    }
    else{
        respuesta_api.mensaje=`al consultar, no hay ningun centro de asistencia medica coneste codigo -> ${id}`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

CamControlador.actualizarControlador=async (req,res,next) => {
    var respuesta_api={mensaje:"",estado_peticion:""}
    const CAM=new CamModelo()
    const {cam,token}=req.body
    CAM.setDatos(cam)
    const cam_result=await CAM.consultarModelo()
    if(CamControlador.verificarExistencia(cam_result)){
        CAM.actualizarModelo()
        respuesta_api.mensaje=`actualización completada`
        respuesta_api.estado_peticion="200"
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"UPDATE","tcam",cam.id_cam)
        next()
    }
    else{
        respuesta_api.mensaje=`al actualizar,por que no hay ningun centro de asistencia medica con este codigo -> ${id}`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

CamControlador.ConsultarTodosControlador=async (req,res) => {
    var respuesta_api={cams:[],mensaje:"",estado_peticion:""}
    const CAM=new CamModelo()
    const cam_result=await CAM.consultarTodosModelo()
    if(CamControlador.verificarExistencia(cam_result)){
        respuesta_api.cams=cam_result.rows
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

CamControlador.consultarCamPatronControlador=async (req,res) => {
    var respuesta_api={cams:[],mensaje:"",estado_peticion:""}
    const CAM=new CamModelo()
    const {patron}=req.params
    const cam_result=await CAM.consultarCamPatronModelo(patron)
    if(CamControlador.verificarExistencia(cam_result)){
        respuesta_api.cams=cam_result.rows
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

CamControlador.verificarExistencia=(result) => {
    return result.rows.length!=0
}

CamControlador.consultarCamXCiudadControlador=async (req,res) => {
    var respuesta_api={cams:[],mensaje:"",estado_peticion:""}
    const CAM=new CamModelo()
    const {id}=req.params
    const cam_result=await CAM.consultarCamXCiudadModelo(id)
    if(CamControlador.verificarExistencia(cam_result)){
        respuesta_api.cams=cam_result.rows
        respuesta_api.mensaje=`consulta completada`
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje=`al consultar, no hay ningun centro de asistencia medica en esta ciudad -> ${id}`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

CamControlador.consultar=async (id) => {
    const CAM=new CamModelo()
    CAM.setIdCam(id)
    const cam_result=await CAM.consultarActivoModelo()
    return CamControlador.verificarExistencia(cam_result)
}

module.exports= CamControlador

// const CamModelo=require("../modelo/m_cam")

// const CamControlador={}

// CamControlador.registrarControlador=async (req,res) => {
//     var respuesta_api={mensaje:"",estado_peticion:""}
//     const CAM=new CamModelo()
//     const {cam}=req.body
//     CAM.setDatos(cam)
//     CAM.registrarModelo()
//     respuesta_api.mensaje=`registro completado`
//     respuesta_api.estado_peticion="200"
//     res.writeHead(200,{"Content-Type":"application/json"})
//     res.write(JSON.stringify(respuesta_api))
//     res.end()
// }

// CamControlador.consultarControlador=async (req,res) => {
//     var respuesta_api={cam:[],mensaje:"",estado_peticion:""}
//     const CAM=new CamModelo()
//     const {id}=req.params
//     CAM.setIdCam(id)
//     const cam_result=await CAM.consultarModelo()
//     if(CamControlador.verificarExistencia(cam_result)){
//         respuesta_api.cam=cam_result.rows[0]
//         respuesta_api.mensaje=`consulta completada`
//         respuesta_api.estado_peticion="200"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje=`al consultar, no hay ningun centro de asistencia medica coneste codigo -> ${id}`
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// }

// CamControlador.actualizarControlador=async (req,res) => {
//     var respuesta_api={mensaje:"",estado_peticion:""}
//     const CAM=new CamModelo()
//     const {cam}=req.body
//     CAM.setDatos(cam)
//     const cam_result=await CAM.consultarModelo()
//     if(CamControlador.verificarExistencia(cam_result)){
//         CAM.actualizarModelo()
//         respuesta_api.mensaje=`actualización completada`
//         respuesta_api.estado_peticion="200"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje=`al actualizar,por que no hay ningun centro de asistencia medica con este codigo -> ${id}`
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// }

// CamControlador.ConsultarTodosControlador=async (req,res) => {
//     var respuesta_api={cams:[],mensaje:"",estado_peticion:""}
//     const CAM=new CamModelo()
//     const cam_result=await CAM.consultarTodosModelo()
//     if(CamControlador.verificarExistencia(cam_result)){
//         respuesta_api.cams=cam_result.rows
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

// CamControlador.consultarCamPatronControlador=async (req,res) => {
//     var respuesta_api={cams:[],mensaje:"",estado_peticion:""}
//     const CAM=new CamModelo()
//     const {patron}=req.params
//     const cam_result=await CAM.consultarCamPatronModelo(patron)
//     if(CamControlador.verificarExistencia(cam_result)){
//         respuesta_api.cams=cam_result.rows
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

// CamControlador.verificarExistencia=(result) => {
//     return result.rows.length!=0
// }

// CamControlador.consultarCamXCiudadControlador=async (req,res) => {
//     var respuesta_api={cams:[],mensaje:"",estado_peticion:""}
//     const CAM=new CamModelo()
//     const {id}=req.params
//     const cam_result=await CAM.consultarCamXCiudadModelo(id)
//     if(CamControlador.verificarExistencia(cam_result)){
//         respuesta_api.cams=cam_result.rows
//         respuesta_api.mensaje=`consulta completada`
//         respuesta_api.estado_peticion="200"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje=`al consultar, no hay ningun centro de asistencia medica en esta ciudad -> ${id}`
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// }

// CamControlador.consultar=async (id) => {
//     const CAM=new CamModelo()
//     CAM.setIdCam(id)
//     const cam_result=await CAM.consultarActivoModelo()
//     return CamControlador.verificarExistencia(cam_result)
// }

// module.exports= CamControlador