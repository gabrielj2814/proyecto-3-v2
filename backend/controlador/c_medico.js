
const MedicoModelo=require("../modelo/m_medico"),
VitacoraControlador=require("./c_vitacora"),
Moment=require("moment")

const MedicoControlador={}

MedicoControlador.generarId= async (req,res) => {
    const MEDICO=new MedicoModelo()
    let fecha=Moment().format("YYYY-MM-DD")
    let datosMedicos=await MEDICO.consultarTodosModeloPatronId(fecha)
    res.writeHead(200,{"Content-Type":"application/json"})
    let id=`med-${fecha}-${datosMedicos.rowCount+1}`
    res.write(JSON.stringify({id}))
    res.end()
}

MedicoControlador.registrarControlador=async (req,res,next) => {
    var respuesta_api={mensaje:"",estado_peticion:""}
    const {medico,token} = req.body
    const MEDICO=new MedicoModelo()
    MEDICO.setDatos(medico)
    const medico_result=await MEDICO.consultarModelo()
    if(!MedicoControlador.verificarExistencia(medico_result)){
        MEDICO.registrarModelo()
        respuesta_api.mensaje=`registro completado`
        respuesta_api.estado_peticion="200"
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"INSERT","tmedico",medico.id_medico)
        next()
    }
    else{
        respuesta_api.mensaje=`al registrar , por que ya hay un medico con este codigo -> ${medico.id_medico}`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

MedicoControlador.consultarControlador=async (req,res,next) => {
    var respuesta_api={medico:[],mensaje:"",estado_peticion:""}
    const {id,token} = req.params
    const MEDICO=new MedicoModelo()
    MEDICO.setIdMedico(id)
    const medico_result=await MEDICO.consultarModelo()
    if(MedicoControlador.verificarExistencia(medico_result)){
        respuesta_api.medico=medico_result.rows[0]
        respuesta_api.mensaje=`consulta completada`
        respuesta_api.estado_peticion="200"
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"SELECT","tmedico",id)
        next()
    }
    else{
        respuesta_api.mensaje=`al consultar , por que no ya hay nigun medico con este codigo -> ${medico.id_medico}`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

MedicoControlador.actualizarControlador=async (req,res,next) => {
    var respuesta_api={mensaje:"",estado_peticion:""}
    const {medico,token} = req.body
    const MEDICO=new MedicoModelo()
    MEDICO.setDatos(medico)
    const medico_result=await MEDICO.consultarModelo()
    if(MedicoControlador.verificarExistencia(medico_result)){
        MEDICO.actualizarModelo()
        respuesta_api.mensaje=`actualización completada`
        respuesta_api.estado_peticion="200"
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"UPDATE","tmedico",medico.id_medico)
        next()
    }
    else{
        respuesta_api.mensaje=`al registrar , por que no hay ningun medico con este codigo -> ${medico.id_medico}`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

MedicoControlador.consultarTodosControlador=async (req,res) => {
    var respuesta_api={medicos:[],mensaje:"",estado_peticion:""}
    const MEDICO=new MedicoModelo()
    const medico_result=await MEDICO.consultarTodosModelo()
    if(MedicoControlador.verificarExistencia(medico_result)){
        respuesta_api.medicos=medico_result.rows
        respuesta_api.mensaje=`consulta completada`
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje=`al consultar , por que no ya hay nigun medico registrado`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

MedicoControlador.consultarMedicoPatronControlador=async (req,res) => {
    var respuesta_api={medicos:[],mensaje:"",estado_peticion:""}
    const {patron} = req.params
    const MEDICO=new MedicoModelo()
    const medico_result=await MEDICO.consultarMedicoPatronModelo(patron)
    if(MedicoControlador.verificarExistencia(medico_result)){
        respuesta_api.medicos=medico_result.rows
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

MedicoControlador.verificarExistencia=(result) => {
    return result.rows.length!=0
}

MedicoControlador.consultar=async(id) => {
    const MEDICO=new MedicoModelo()
    MEDICO.setIdMedico(id)
    const medico_result=await MEDICO.consultarModelo()
    return MedicoControlador.verificarExistencia(medico_result)
}

module.exports= MedicoControlador

// const MedicoModelo=require("../modelo/m_medico")

// const MedicoControlador={}

// MedicoControlador.registrarControlador=async (req,res) => {
//     var respuesta_api={mensaje:"",estado_peticion:""}
//     const {medico} = req.body
//     const MEDICO=new MedicoModelo()
//     MEDICO.setDatos(medico)
//     const medico_result=await MEDICO.consultarModelo()
//     if(!MedicoControlador.verificarExistencia(medico_result)){
//         MEDICO.registrarModelo()
//         respuesta_api.mensaje=`registro completado`
//         respuesta_api.estado_peticion="200"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje=`al registrar , por que ya hay un medico con este codigo -> ${medico.id_medico}`
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// }

// MedicoControlador.consultarControlador=async (req,res) => {
//     var respuesta_api={medico:[],mensaje:"",estado_peticion:""}
//     const {id} = req.params
//     const MEDICO=new MedicoModelo()
//     MEDICO.setIdMedico(id)
//     const medico_result=await MEDICO.consultarModelo()
//     if(MedicoControlador.verificarExistencia(medico_result)){
//         respuesta_api.medico=medico_result.rows[0]
//         respuesta_api.mensaje=`consulta completada`
//         respuesta_api.estado_peticion="200"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje=`al consultar , por que no ya hay nigun medico con este codigo -> ${medico.id_medico}`
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// }

// MedicoControlador.actualizarControlador=async (req,res) => {
//     var respuesta_api={mensaje:"",estado_peticion:""}
//     const {medico} = req.body
//     const MEDICO=new MedicoModelo()
//     MEDICO.setDatos(medico)
//     const medico_result=await MEDICO.consultarModelo()
//     if(MedicoControlador.verificarExistencia(medico_result)){
//         MEDICO.actualizarModelo()
//         respuesta_api.mensaje=`actualización completada`
//         respuesta_api.estado_peticion="200"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje=`al registrar , por que no hay ningun medico con este codigo -> ${medico.id_medico}`
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// }

// MedicoControlador.consultarTodosControlador=async (req,res) => {
//     var respuesta_api={medicos:[],mensaje:"",estado_peticion:""}
//     const MEDICO=new MedicoModelo()
//     const medico_result=await MEDICO.consultarTodosModelo()
//     if(MedicoControlador.verificarExistencia(medico_result)){
//         respuesta_api.medicos=medico_result.rows
//         respuesta_api.mensaje=`consulta completada`
//         respuesta_api.estado_peticion="200"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje=`al consultar , por que no ya hay nigun medico registrado`
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// }

// MedicoControlador.consultarMedicoPatronControlador=async (req,res) => {
//     var respuesta_api={medicos:[],mensaje:"",estado_peticion:""}
//     const {patron} = req.params
//     const MEDICO=new MedicoModelo()
//     const medico_result=await MEDICO.consultarMedicoPatronModelo(patron)
//     if(MedicoControlador.verificarExistencia(medico_result)){
//         respuesta_api.medicos=medico_result.rows
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

// MedicoControlador.verificarExistencia=(result) => {
//     return result.rows.length!=0
// }

// MedicoControlador.consultar=async(id) => {
//     const MEDICO=new MedicoModelo()
//     MEDICO.setIdMedico(id)
//     const medico_result=await MEDICO.consultarModelo()
//     return MedicoControlador.verificarExistencia(medico_result)
// }

// module.exports= MedicoControlador