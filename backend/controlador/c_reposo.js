const ReposoModelo=require("../modelo/m_reposo"),
VitacoraControlador=require("./c_vitacora")

const ReposoControlador={}

ReposoControlador.generarId=async (req,res) => {
    const reposo_modelo=new ReposoModelo()
    const reposo_result=await reposo_modelo.consultarTodosModelo()
    const id=`repo-${(reposo_result.rows.length)+1}`
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify({id:id}))
    res.end()
}

ReposoControlador.registrarControlador=async (req,res,next) => {
    var respuesta_api={mensaje:"",estado_peticion:""}
    const reposo_modelo=new ReposoModelo()
    const {reposo,token}=req.body
    reposo_modelo.setDatos(reposo)
    const reposo_result=await reposo_modelo.consultarModelo()
    if(!ReposoControlador.verificarExistencia(reposo_result)){
        reposo_modelo.registrarModelo()
        respuesta_api.mensaje="registro completado"
        respuesta_api.estado_peticion="200"
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"INSERT","treposo",reposo.id_reposo)
        next()
    }
    else{
        respuesta_api.mensaje="al registrar, porque hay un reposo con este mismo codigo -> "+reposo.id_reposo
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

ReposoControlador.consultarControlador=async (req,res,next) => {
    var respuesta_api={reposo:[],mensaje:"",estado_peticion:""}
    const reposo_modelo=new ReposoModelo()
    const {id,token}=req.params
    reposo_modelo.setId(id)
    const reposo_result=await reposo_modelo.consultarModelo()
    if(ReposoControlador.verificarExistencia(reposo_result)){
        respuesta_api.reposo=reposo_result.rows[0]
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_peticion="200"
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"SELECT","treposo",id)
        next()
    }
    else{
        respuesta_api.mensaje="al consultar, no hay ningun reposo con este codigo -> "+id
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

ReposoControlador.actualizarControlador=async (req,res,next) => {
    var respuesta_api={mensaje:"",estado_peticion:""}
    const reposo_modelo=new ReposoModelo()
    const {reposo,token}=req.body
    reposo_modelo.setDatos(reposo)
    const reposo_result=await reposo_modelo.consultarModelo()
    if(ReposoControlador.verificarExistencia(reposo_result)){
        reposo_modelo.actualizarModelo()
        respuesta_api.mensaje="actualización completada"
        respuesta_api.estado_peticion="200"
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"UPDATE","treposo",reposo.id_reposo)
        next()
    }
    else{
        respuesta_api.mensaje="al actualizar, no hay ningun reposo con este codigo -> "+reposo.id_reposo
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

ReposoControlador.consultarTodosControlador=async (req,res) => {
    var respuesta_api={reposos:[],mensaje:"",estado_peticion:""}
    const reposo_modelo=new ReposoModelo()
    const reposo_result=await reposo_modelo.consultarTodosModelo()
    if(ReposoControlador.verificarExistencia(reposo_result)){
        respuesta_api.reposos=reposo_result.rows
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje="al consultar, no hay ningun reposo con este codigo -> "+id
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

ReposoControlador.consultarReposoPatronControlador=async (req,res) => {
    var respuesta_api={reposos:[],mensaje:"",estado_peticion:""}
    const reposo_modelo=new ReposoModelo()
    const {patron}=req.params
    const reposo_result=await reposo_modelo.consultarReposoXPatron(patron)
    if(ReposoControlador.verificarExistencia(reposo_result)){
        respuesta_api.reposos=reposo_result.rows
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje="al consultar, no se a encontrado nigun resultado con este patron -> "+ patron
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

ReposoControlador.verificarExistencia=(result) => {
    return result.rows.length!=0
}

ReposoControlador.consultar=async (id) => {
    const reposo_modelo=new ReposoModelo()
    reposo_modelo.setId(id)
    const reposo_result=await reposo_modelo.consultarActivoModelo()
    return ReposoControlador.verificarExistencia(reposo_result)
}

module.exports= ReposoControlador

// const ReposoModelo=require("../modelo/m_reposo")

// const ReposoControlador={}

// ReposoControlador.generarId=async (req,res) => {
//     const reposo_modelo=new ReposoModelo()
//     const reposo_result=await reposo_modelo.consultarTodosModelo()
//     const id=`repo-${(reposo_result.rows.length)+1}`
//     res.writeHead(200,{"Content-Type":"application/json"})
//     res.write(JSON.stringify({id:id}))
//     res.end()
// }

// ReposoControlador.registrarControlador=async (req,res) => {
//     var respuesta_api={mensaje:"",estado_peticion:""}
//     const reposo_modelo=new ReposoModelo()
//     const {reposo}=req.body
//     reposo_modelo.setDatos(reposo)
//     const reposo_result=await reposo_modelo.consultarModelo()
//     if(!ReposoControlador.verificarExistencia(reposo_result)){
//         reposo_modelo.registrarModelo()
//         respuesta_api.mensaje="registro completado"
//         respuesta_api.estado_peticion="200"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje="al registrar, porque hay un reposo con este mismo codigo -> "+reposo.id_reposo
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// }

// ReposoControlador.consultarControlador=async (req,res) => {
//     var respuesta_api={reposo:[],mensaje:"",estado_peticion:""}
//     const reposo_modelo=new ReposoModelo()
//     const {id}=req.params
//     reposo_modelo.setId(id)
//     const reposo_result=await reposo_modelo.consultarModelo()
//     if(ReposoControlador.verificarExistencia(reposo_result)){
//         respuesta_api.reposo=reposo_result.rows[0]
//         respuesta_api.mensaje="consulta completada"
//         respuesta_api.estado_peticion="200"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje="al consultar, no hay ningun reposo con este codigo -> "+id
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// }

// ReposoControlador.actualizarControlador=async (req,res) => {
//     var respuesta_api={mensaje:"",estado_peticion:""}
//     const reposo_modelo=new ReposoModelo()
//     const {reposo}=req.body
//     reposo_modelo.setDatos(reposo)
//     const reposo_result=await reposo_modelo.consultarModelo()
//     if(ReposoControlador.verificarExistencia(reposo_result)){
//         reposo_modelo.actualizarModelo()
//         respuesta_api.mensaje="actualización completada"
//         respuesta_api.estado_peticion="200"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje="al actualizar, no hay ningun reposo con este codigo -> "+reposo.id_reposo
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// }

// ReposoControlador.consultarTodosControlador=async (req,res) => {
//     var respuesta_api={reposos:[],mensaje:"",estado_peticion:""}
//     const reposo_modelo=new ReposoModelo()
//     const reposo_result=await reposo_modelo.consultarTodosModelo()
//     if(ReposoControlador.verificarExistencia(reposo_result)){
//         respuesta_api.reposos=reposo_result.rows
//         respuesta_api.mensaje="consulta completada"
//         respuesta_api.estado_peticion="200"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje="al consultar, no hay ningun reposo con este codigo -> "+id
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// }

// ReposoControlador.consultarReposoPatronControlador=async (req,res) => {
//     var respuesta_api={reposos:[],mensaje:"",estado_peticion:""}
//     const reposo_modelo=new ReposoModelo()
//     const {patron}=req.params
//     const reposo_result=await reposo_modelo.consultarReposoXPatron(patron)
//     if(ReposoControlador.verificarExistencia(reposo_result)){
//         respuesta_api.reposos=reposo_result.rows
//         respuesta_api.mensaje="consulta completada"
//         respuesta_api.estado_peticion="200"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje="al consultar, no se a encontrado nigun resultado con este patron -> "+ patron
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// }

// ReposoControlador.verificarExistencia=(result) => {
//     return result.rows.length!=0
// }

// ReposoControlador.consultar=async (id) => {
//     const reposo_modelo=new ReposoModelo()
//     reposo_modelo.setId(id)
//     const reposo_result=await reposo_modelo.consultarActivoModelo()
//     return ReposoControlador.verificarExistencia(reposo_result)
// }

// module.exports= ReposoControlador