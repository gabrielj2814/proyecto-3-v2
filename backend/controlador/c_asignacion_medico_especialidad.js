const AsignacionMedicoEspecialidadModelo=require("../modelo/m_asignacion_medico_especialidad"),
VitacoraControlador=require("./c_vitacora")

const MedicoControlador=require("./c_medico"),
EspecialidadControlador=require("./c_especialidad")

const Moment=require("moment")

const AsignacionMedicoEspecialidadControlador={}

AsignacionMedicoEspecialidadControlador.generarId=async (req,res) => {
    const medico_especialidad=new AsignacionMedicoEspecialidadModelo()
    const patron=`ams-${(Moment().format("YYYY-MM-DD"))}`
    const medico_especialidad_result=await medico_especialidad.consultarTodosXPatronModelo(patron)
    const id=`${patron}-${(medico_especialidad_result.rows.length)+1}`
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify({id:id}))
    res.end()
}

AsignacionMedicoEspecialidadControlador.registrarControlador=async (req,res,next) => {
    var respuesta_api={mensaje:"",estado_peticion:""}
    const medico_especialidad=new AsignacionMedicoEspecialidadModelo()
    const {medico_especialidad_json,token} = req.body
    medico_especialidad.setDatos(medico_especialidad_json)
    const medico_especialidad_result=await medico_especialidad.consultarModelo()
    if(!AsignacionMedicoEspecialidadControlador.verificarExistencia(medico_especialidad_result)){
        const respuesta_medico =await MedicoControlador.consultar(medico_especialidad_json.id_medico)
        if(respuesta_medico){
            const respuesta_especialidad=await EspecialidadControlador.consultar(medico_especialidad_json.id_especialidad)
            if(respuesta_especialidad){
                const medico_especialidad_result_2=await medico_especialidad.consultarMedicoYEspecialidadModelo()
                if(!AsignacionMedicoEspecialidadControlador.verificarExistencia(medico_especialidad_result_2)){
                    medico_especialidad.registrarModelo()
                    respuesta_api.mensaje="registro completado"
                    respuesta_api.estado_peticion="200"
                    req.vitacora=VitacoraControlador.json(respuesta_api,token,"INSERT","tasignacionmedicoespecialidad",medico_especialidad_json.id_asignacion_medico_especialidad)
                    next()
                    // res.writeHead(200,{"Content-Type":"application/json"})
                    // res.write(JSON.stringify(respuesta_api))
                    // res.end()
                }
                else{
                    respuesta_api.mensaje=`al registrar, el medico ${medico_especialidad_result_2.rows[0].nombre_medico+" "+medico_especialidad_result_2.rows[0].apellido_medico} ya tiene asignada la especialidad ${medico_especialidad_result_2.rows[0].nombre_especialidad}`
                    respuesta_api.estado_peticion="404"
                    res.writeHead(200,{"Content-Type":"application/json"})
                    res.write(JSON.stringify(respuesta_api))
                    res.end()
                }
            }
            else{
                respuesta_api.mensaje="al registrar , no hay ningun especialidad con este codigo ->"+medico_especialidad_json.id_especialidad
                respuesta_api.estado_peticion="404"
                res.writeHead(200,{"Content-Type":"application/json"})
                res.write(JSON.stringify(respuesta_api))
                res.end() 
            }
        }
        else{
            respuesta_api.mensaje="al registrar , no hay ningun medico con este codigo ->"+medico_especialidad_json.id_medico
            respuesta_api.estado_peticion="404"
            res.writeHead(200,{"Content-Type":"application/json"})
            res.write(JSON.stringify(respuesta_api))
            res.end() 
        }
    }
    else{
        respuesta_api.mensaje="al registrar , por que ya hay un registro coneste mismo codigo "+medico_especialidad_json.id_asignacion_medico_especialidad
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    
}

AsignacionMedicoEspecialidadControlador.consultarControlador=async (req,res,next) => {
    var respuesta_api={medico_especialidad:[],mensaje:"",estado_peticion:""}
    const medico_especialidad=new AsignacionMedicoEspecialidadModelo()
    const {id,token} = req.params
    medico_especialidad.setIdAsignacionMedicoEspecialidad(id)
    const medico_especialidad_result=await medico_especialidad.consultarModelo()
    if(AsignacionMedicoEspecialidadControlador.verificarExistencia(medico_especialidad_result)){
        respuesta_api.medico_especialidad=medico_especialidad_result.rows[0]
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_peticion="200"
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"SELECT","tasignacionmedicoespecialidad",id)
        next()
        // res.writeHead(200,{"Content-Type":"application/json"})
        // res.write(JSON.stringify(respuesta_api))
        // res.end()
    }
    else{
        respuesta_api.mensaje="al consultar, no hay ningun registro con este codigo -> "+id
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    
}

AsignacionMedicoEspecialidadControlador.actualizarControlador=async (req,res,next) => {
    var respuesta_api={mensaje:"",estado_peticion:""}
    const medico_especialidad=new AsignacionMedicoEspecialidadModelo()
    const {medico_especialidad_json,token} = req.body
    medico_especialidad.setDatos(medico_especialidad_json)
    const medico_especialidad_result=await medico_especialidad.consultarModelo()
    if(AsignacionMedicoEspecialidadControlador.verificarExistencia(medico_especialidad_result)){
        const respuesta_medico =await MedicoControlador.consultar(medico_especialidad_json.id_medico)
        if(respuesta_medico){
            const respuesta_especialidad=await EspecialidadControlador.consultar(medico_especialidad_json.id_especialidad)
            if(respuesta_especialidad){
                medico_especialidad.actualizarModelo()
                respuesta_api.mensaje="actualiazación completada"
                respuesta_api.estado_peticion="200"
                req.vitacora=VitacoraControlador.json(respuesta_api,token,"UPDATE","tasignacionmedicoespecialidad",medico_especialidad_json.id_asignacion_medico_especialidad)
                next()
                // res.writeHead(200,{"Content-Type":"application/json"})
                // res.write(JSON.stringify(respuesta_api))
                // res.end()
            }
            else{
                respuesta_api.mensaje="al actualizar , no hay ningun especialidad con este codigo ->"+medico_especialidad_json.id_especialidad
                respuesta_api.estado_peticion="404"
                res.writeHead(200,{"Content-Type":"application/json"})
                res.write(JSON.stringify(respuesta_api))
                res.end() 
            }
        }
        else{
            respuesta_api.mensaje="al actualizar , no hay ningun medico con este codigo ->"+medico_especialidad_json.id_medico
            respuesta_api.estado_peticion="404"
            res.writeHead(200,{"Content-Type":"application/json"})
            res.write(JSON.stringify(respuesta_api))
            res.end() 
        }
    }
    else{
        respuesta_api.mensaje="al actualizar, no hay ningun registro con este codigo -> "+medico_especialidad
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    
}

AsignacionMedicoEspecialidadControlador.consultarTodosControlador=async (req,res) => {
    var respuesta_api={medico_especialidades:[],mensaje:"",estado_peticion:""}
    const medico_especialidad=new AsignacionMedicoEspecialidadModelo()
    const medico_especialidad_result=await medico_especialidad.consultarTodosModelo()
    if(AsignacionMedicoEspecialidadControlador.verificarExistencia(medico_especialidad_result)){
        respuesta_api.medico_especialidades=medico_especialidad_result.rows
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje="al consultar, no hay ningun registro almacenado"
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    
}

AsignacionMedicoEspecialidadControlador.consultarAsignacionPorMedico=async (req,res) => {
    var respuesta_api={medico_especialidad:[],mensaje:"",estado_peticion:""}
    const medico_especialidad=new AsignacionMedicoEspecialidadModelo()
    const {id} = req.params
    const medico_especialidad_result=await medico_especialidad.consultarAsignacionPorMedico(id)
    if(AsignacionMedicoEspecialidadControlador.verificarExistencia(medico_especialidad_result)){
        respuesta_api.medico_especialidad=medico_especialidad_result.rows
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje="al consultar, no hay ningun registro con este codigo -> "+id
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    
}

AsignacionMedicoEspecialidadControlador.consultarAsignacionPorEspecialidad=async (req,res) => {
    var respuesta_api={medico_especialidad:[],mensaje:"",estado_peticion:""}
    const medico_especialidad=new AsignacionMedicoEspecialidadModelo()
    const {id} = req.params
    const medico_especialidad_result=await medico_especialidad.consultarAsignacionPorEspecialidad(id)
    if(AsignacionMedicoEspecialidadControlador.verificarExistencia(medico_especialidad_result)){
        respuesta_api.medico_especialidad=medico_especialidad_result.rows
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje="al consultar, no hay ningun registro con este codigo -> "+id
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    
}

AsignacionMedicoEspecialidadControlador.verificarExistencia= (result) => {
    return result.rows.length!=0
}

AsignacionMedicoEspecialidadControlador.consultar=async (id) => {
    const medico_especialidad=new AsignacionMedicoEspecialidadModelo()
    medico_especialidad.setIdAsignacionMedicoEspecialidad(id)
    const medico_especialidad_result=await medico_especialidad.consultarModelo()
    return AsignacionMedicoEspecialidadControlador.verificarExistencia(medico_especialidad_result)
}

module.exports = AsignacionMedicoEspecialidadControlador


// const AsignacionMedicoEspecialidadModelo=require("../modelo/m_asignacion_medico_especialidad")

// const MedicoControlador=require("./c_medico"),
// EspecialidadControlador=require("./c_especialidad")

// const Moment=require("moment")

// const AsignacionMedicoEspecialidadControlador={}

// AsignacionMedicoEspecialidadControlador.generarId=async (req,res) => {
//     const medico_especialidad=new AsignacionMedicoEspecialidadModelo()
//     const patron=`ams-${(Moment().format("YYYY-MM-DD"))}`
//     const medico_especialidad_result=await medico_especialidad.consultarTodosXPatronModelo(patron)
//     const id=`${patron}-${(medico_especialidad_result.rows.length)+1}`
//     res.writeHead(200,{"Content-Type":"application/json"})
//     res.write(JSON.stringify({id:id}))
//     res.end()
// }

// AsignacionMedicoEspecialidadControlador.registrarControlador=async (req,res) => {
//     var respuesta_api={mensaje:"",estado_peticion:""}
//     const medico_especialidad=new AsignacionMedicoEspecialidadModelo()
//     const {medico_especialidad_json} = req.body
//     medico_especialidad.setDatos(medico_especialidad_json)
//     const medico_especialidad_result=await medico_especialidad.consultarModelo()
//     if(!AsignacionMedicoEspecialidadControlador.verificarExistencia(medico_especialidad_result)){
//         const repuesta_medico =await MedicoControlador.consultar(medico_especialidad_json.id_medico)
//         if(repuesta_medico){
//             const repuesta_especialidad=await EspecialidadControlador.consultar(medico_especialidad_json.id_especialidad)
//             if(repuesta_especialidad){
//                 const medico_especialidad_result_2=await medico_especialidad.consultarMedicoYEspecialidadModelo()
//                 if(!AsignacionMedicoEspecialidadControlador.verificarExistencia(medico_especialidad_result_2)){
//                     medico_especialidad.registrarModelo()
//                     respuesta_api.mensaje="registro completado"
//                     respuesta_api.estado_peticion="200"
//                     res.writeHead(200,{"Content-Type":"application/json"})
//                     res.write(JSON.stringify(respuesta_api))
//                     res.end()
//                 }
//                 else{
//                     respuesta_api.mensaje=`al registrar, el medico ${medico_especialidad_result_2.rows[0].nombre_medico+" "+medico_especialidad_result_2.rows[0].apellido_medico} ya tiene asignada la especialidad ${medico_especialidad_result_2.rows[0].nombre_especialidad}`
//                     respuesta_api.estado_peticion="404"
//                     res.writeHead(200,{"Content-Type":"application/json"})
//                     res.write(JSON.stringify(respuesta_api))
//                     res.end()
//                 }
//             }
//             else{
//                 respuesta_api.mensaje="al registrar , no hay ningun especialidad con este codigo ->"+medico_especialidad_json.id_especialidad
//                 respuesta_api.estado_peticion="404"
//                 res.writeHead(200,{"Content-Type":"application/json"})
//                 res.write(JSON.stringify(respuesta_api))
//                 res.end() 
//             }
//         }
//         else{
//             respuesta_api.mensaje="al registrar , no hay ningun medico con este codigo ->"+medico_especialidad_json.id_medico
//             respuesta_api.estado_peticion="404"
//             res.writeHead(200,{"Content-Type":"application/json"})
//             res.write(JSON.stringify(respuesta_api))
//             res.end() 
//         }
//     }
//     else{
//         respuesta_api.mensaje="al registrar , por que ya hay un registro coneste mismo codigo "+medico_especialidad_json.id_asignacion_medico_especialidad
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
    
// }

// AsignacionMedicoEspecialidadControlador.consultarControlador=async (req,res) => {
//     var respuesta_api={medico_especialidad:[],mensaje:"",estado_peticion:""}
//     const medico_especialidad=new AsignacionMedicoEspecialidadModelo()
//     const {id} = req.params
//     medico_especialidad.setIdAsignacionMedicoEspecialidad(id)
//     const medico_especialidad_result=await medico_especialidad.consultarModelo()
//     if(AsignacionMedicoEspecialidadControlador.verificarExistencia(medico_especialidad_result)){
//         respuesta_api.medico_especialidad=medico_especialidad_result.rows[0]
//         respuesta_api.mensaje="consulta completada"
//         respuesta_api.estado_peticion="200"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje="al consultar, no hay ningun registro con este codigo -> "+id
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
    
// }

// AsignacionMedicoEspecialidadControlador.actualizarControlador=async (req,res) => {
//     var respuesta_api={mensaje:"",estado_peticion:""}
//     const medico_especialidad=new AsignacionMedicoEspecialidadModelo()
//     const {medico_especialidad_json} = req.body
//     medico_especialidad.setDatos(medico_especialidad_json)
//     const medico_especialidad_result=await medico_especialidad.consultarModelo()
//     if(AsignacionMedicoEspecialidadControlador.verificarExistencia(medico_especialidad_result)){
//         const repuesta_medico =await MedicoControlador.consultar(medico_especialidad_json.id_medico)
//         if(repuesta_medico){
//             const repuesta_especialidad=await EspecialidadControlador.consultar(medico_especialidad_json.id_especialidad)
//             if(repuesta_especialidad){
//                 const medico_especialidad_result_2=await medico_especialidad.consultarMedicoYEspecialidadModelo()
//                 if(!AsignacionMedicoEspecialidadControlador.verificarExistencia(medico_especialidad_result_2)){
//                     medico_especialidad.actualizarModelo()
//                     respuesta_api.mensaje="actualiazación completada"
//                     respuesta_api.estado_peticion="200"
//                     res.writeHead(200,{"Content-Type":"application/json"})
//                     res.write(JSON.stringify(respuesta_api))
//                     res.end()
//                 }
//                 else{
//                     respuesta_api.mensaje=`al actualizar, el medico ${medico_especialidad_result_2.rows[0].nombre_medico+" "+medico_especialidad_result_2.rows[0].apellido_medico} ya tiene asignada la especialidad ${medico_especialidad_result_2.rows[0].nombre_especialidad}`
//                     respuesta_api.estado_peticion="404"
//                     res.writeHead(200,{"Content-Type":"application/json"})
//                     res.write(JSON.stringify(respuesta_api))
//                     res.end()
//                 }
//             }
//             else{
//                 respuesta_api.mensaje="al actualizar , no hay ningun especialidad con este codigo ->"+medico_especialidad_json.id_especialidad
//                 respuesta_api.estado_peticion="404"
//                 res.writeHead(200,{"Content-Type":"application/json"})
//                 res.write(JSON.stringify(respuesta_api))
//                 res.end() 
//             }
//         }
//         else{
//             respuesta_api.mensaje="al actualizar , no hay ningun medico con este codigo ->"+medico_especialidad_json.id_medico
//             respuesta_api.estado_peticion="404"
//             res.writeHead(200,{"Content-Type":"application/json"})
//             res.write(JSON.stringify(respuesta_api))
//             res.end() 
//         }
//     }
//     else{
//         respuesta_api.mensaje="al actualizar, no hay ningun registro con este codigo -> "+medico_especialidad
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
    
// }

// AsignacionMedicoEspecialidadControlador.consultarTodosControlador=async (req,res) => {
//     var respuesta_api={medico_especialidades:[],mensaje:"",estado_peticion:""}
//     const medico_especialidad=new AsignacionMedicoEspecialidadModelo()
//     const medico_especialidad_result=await medico_especialidad.consultarTodosModelo()
//     if(AsignacionMedicoEspecialidadControlador.verificarExistencia(medico_especialidad_result)){
//         respuesta_api.medico_especialidades=medico_especialidad_result.rows
//         respuesta_api.mensaje="consulta completada"
//         respuesta_api.estado_peticion="200"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje="al consultar, no hay ningun registro almacenado"
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
    
// }

// AsignacionMedicoEspecialidadControlador.verificarExistencia= (result) => {
//     return result.rows.length!=0
// }

// AsignacionMedicoEspecialidadControlador.consultar=async (id) => {
//     const medico_especialidad=new AsignacionMedicoEspecialidadModelo()
//     medico_especialidad.setIdAsignacionMedicoEspecialidad(id)
//     const medico_especialidad_result=await medico_especialidad.consultarModelo()
//     return AsignacionMedicoEspecialidadControlador.verificarExistencia(medico_especialidad_result)
// }

// module.exports = AsignacionMedicoEspecialidadControlador
