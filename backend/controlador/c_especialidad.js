const EspecialidadModelo=require("../modelo/m_especialidad"),
VitacoraControlador=require("./c_vitacora")

const EspecialidadControlador={}

EspecialidadControlador.registrarControlador=async (req,res,next) => {
    var respuesta_api={mensaje:"",estado_peticion:""}
    const ESPECIALIDAD=new EspecialidadModelo()
    const {especialidad,token} = req.body
    ESPECIALIDAD.setDatos(especialidad)
    const especialidad_result=await ESPECIALIDAD.consultarModelo()
    if(!EspecialidadControlador.verificarExistencia(especialidad_result)){
        ESPECIALIDAD.registrarModelo()
        respuesta_api.mensaje="registro completado"
        respuesta_api.estado_peticion="200"
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"INSERT","tespecialidad",especialidad.id_especialidad)
        next()
        // res.writeHead(200,{"Content-Type":"application/json"})
        // res.write(JSON.stringify(respuesta_api))
        // res.end()
    }
    else{
        respuesta_api.mensaje=`al registrar, ya hay un resgitro con este codigo -> ${especialidad.id_especialidad}`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

EspecialidadControlador.consultarControlador=async (req,res,next) => {
    var respuesta_api={especialidad:[],mensaje:"",estado_peticion:""}
    const ESPECIALIDAD=new EspecialidadModelo()
    const {id,token} = req.params
    ESPECIALIDAD.setIdEspecialidad(id)
    const especialidad_result=await ESPECIALIDAD.consultarModelo()
    if(EspecialidadControlador.verificarExistencia(especialidad_result)){
        respuesta_api.especialidad=especialidad_result.rows[0]
        respuesta_api.mensaje=`consulta completada`
        respuesta_api.estado_peticion="200"
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"SELECT","tespecialidad",id)
        next()
        // res.writeHead(200,{"Content-Type":"application/json"})
        // res.write(JSON.stringify(respuesta_api))
        // res.end()
    }
    else{
        respuesta_api.mensaje=`al consultar, no hay ninguna especialidad con este codigo -> ${id}`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

EspecialidadControlador.actualizarControlador=async (req,res,next) => {
    var respuesta_api={mensaje:"",estado_peticion:""}
    const ESPECIALIDAD=new EspecialidadModelo()
    const {especialidad,token} = req.body
    ESPECIALIDAD.setDatos(especialidad)
    const especialidad_result=await ESPECIALIDAD.consultarModelo()
    if(EspecialidadControlador.verificarExistencia(especialidad_result)){
        ESPECIALIDAD.actualizarModelo()
        respuesta_api.mensaje=`actualización completada`
        respuesta_api.estado_peticion="200"
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"UPDATE","tespecialidad",especialidad.id_especialidad)
        next()
        // res.writeHead(200,{"Content-Type":"application/json"})
        // res.write(JSON.stringify(respuesta_api))
        // res.end()
    }
    else{
        respuesta_api.mensaje=`al actualizar, no hay ninguna especialidad con este codigo -> ${id}`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

EspecialidadControlador.consultarTodosControlador=async (req,res) => {
    var respuesta_api={especialidades:[],mensaje:"",estado_peticion:""}
    const ESPECIALIDAD=new EspecialidadModelo()
    const especialidad_result=await ESPECIALIDAD.consultarTodosModelo()
    if(EspecialidadControlador.verificarExistencia(especialidad_result)){
        respuesta_api.especialidades=especialidad_result.rows
        respuesta_api.mensaje=`consulta completada`
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje=`al consultar, no hay ninguna especialidad`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

EspecialidadControlador.consultarEspecialidadPatronControlador=async (req,res) => {
    var respuesta_api={especialidades:[],mensaje:"",estado_peticion:""}
    const ESPECIALIDAD=new EspecialidadModelo()
    const {patron} = req.params
    const especialidad_result=await ESPECIALIDAD.consultarEspecialidadPatronModelo(patron)
    if(EspecialidadControlador.verificarExistencia(especialidad_result)){
        respuesta_api.especialidades=especialidad_result.rows
        respuesta_api.mensaje=`consulta completada`
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje=`no se a encontrado nigun resultado`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

EspecialidadControlador.verificarExistencia=(result) => {
    return result.rows.length!=0
}

EspecialidadControlador.consultar= async  (id) => {
    const ESPECIALIDAD=new EspecialidadModelo()
    ESPECIALIDAD.setIdEspecialidad(id)
    const especialidad_result=await ESPECIALIDAD.consultarModelo()
    return EspecialidadControlador.verificarExistencia(especialidad_result)
}

module.exports= EspecialidadControlador

// const EspecialidadModelo=require("../modelo/m_especialidad")

// const EspecialidadControlador={}

// EspecialidadControlador.registrarControlador=async (req,res) => {
//     var respuesta_api={mensaje:"",estado_peticion:""}
//     const ESPECIALIDAD=new EspecialidadModelo()
//     const {especialidad} = req.body
//     ESPECIALIDAD.setDatos(especialidad)
//     ESPECIALIDAD.registrarModelo()
//     respuesta_api.mensaje="registro completado"
//     respuesta_api.estado_peticion="200"
//     res.writeHead(200,{"Content-Type":"application/json"})
//     res.write(JSON.stringify(respuesta_api))
//     res.end()
// }

// EspecialidadControlador.consultarControlador=async (req,res) => {
//     var respuesta_api={especialidad:[],mensaje:"",estado_peticion:""}
//     const ESPECIALIDAD=new EspecialidadModelo()
//     const {id} = req.params
//     ESPECIALIDAD.setIdEspecialidad(id)
//     const especialidad_result=await ESPECIALIDAD.consultarModelo()
//     if(EspecialidadControlador.verificarExistencia(especialidad_result)){
//         respuesta_api.especialidad=especialidad_result.rows[0]
//         respuesta_api.mensaje=`consulta completada`
//         respuesta_api.estado_peticion="200"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje=`al consultar, no hay ninguna especialidad con este codigo -> ${id}`
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// }

// EspecialidadControlador.actualizarControlador=async (req,res) => {
//     var respuesta_api={mensaje:"",estado_peticion:""}
//     const ESPECIALIDAD=new EspecialidadModelo()
//     const {especialidad} = req.body
//     ESPECIALIDAD.setDatos(especialidad)
//     const especialidad_result=await ESPECIALIDAD.consultarModelo()
//     if(EspecialidadControlador.verificarExistencia(especialidad_result)){
//         ESPECIALIDAD.actualizarModelo()
//         respuesta_api.mensaje=`actualización completada`
//         respuesta_api.estado_peticion="200"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje=`al actualizar, no hay ninguna especialidad con este codigo -> ${id}`
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// }

// EspecialidadControlador.consultarTodosControlador=async (req,res) => {
//     var respuesta_api={especialidades:[],mensaje:"",estado_peticion:""}
//     const ESPECIALIDAD=new EspecialidadModelo()
//     const especialidad_result=await ESPECIALIDAD.consultarTodosModelo()
//     if(EspecialidadControlador.verificarExistencia(especialidad_result)){
//         respuesta_api.especialidades=especialidad_result.rows
//         respuesta_api.mensaje=`consulta completada`
//         respuesta_api.estado_peticion="200"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje=`al consultar, no hay ninguna especialidad`
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// }

// EspecialidadControlador.consultarEspecialidadPatronControlador=async (req,res) => {
//     var respuesta_api={especialidades:[],mensaje:"",estado_peticion:""}
//     const ESPECIALIDAD=new EspecialidadModelo()
//     const {patron} = req.params
//     const especialidad_result=await ESPECIALIDAD.consultarEspecialidadPatronModelo(patron)
//     if(EspecialidadControlador.verificarExistencia(especialidad_result)){
//         respuesta_api.especialidades=especialidad_result.rows
//         respuesta_api.mensaje=`consulta completada`
//         respuesta_api.estado_peticion="200"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje=`no se a encontrado nigun resultado`
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// }

// EspecialidadControlador.verificarExistencia=(result) => {
//     return result.rows.length!=0
// }

// EspecialidadControlador.consultar= async  (id) => {
//     const ESPECIALIDAD=new EspecialidadModelo()
//     ESPECIALIDAD.setIdEspecialidad(id)
//     const especialidad_result=await ESPECIALIDAD.consultarModelo()
//     return EspecialidadControlador.verificarExistencia(especialidad_result)
// }

// module.exports= EspecialidadControlador