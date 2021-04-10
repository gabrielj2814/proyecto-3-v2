const AsistenciaModelo=require("../modelo/m_asistencia"),
HorarioControlador=require("./c_horario"),
ReposoTrabajadorControlador=require("./c_reposo_trabajador"),
PermisoTrabajadorControlador=require("./c_permiso_trabajador"),
TrabajadorControlador=require("./c_trabajador"),
Moment=require("moment"),
VitacoraControlador=require("./c_vitacora")

const AsistenciaControlador={}

AsistenciaControlador.generarId=async (hoy) => {
    const asistencia_modelo=new AsistenciaModelo()
    const asistencia_result = await asistencia_modelo.consultarFechaModelo(hoy)
    const id=`ais-${hoy}-${(asistencia_result.rows.length)+1}`
    return id
}

AsistenciaControlador.presenteControlador=async (req,res,next) => {
    var respuesta_api={mensaje:"",estado_peticion:""}
    const {asistencia,token}= req.body
    const reposo_result=await ReposoTrabajadorControlador.consultarReposoActivo(asistencia.cedula)
    const permiso_result=await PermisoTrabajadorControlador.consultarPermisoActivos(asistencia.cedula)
    if( AsistenciaControlador.verificarExistencia(reposo_result) || AsistenciaControlador.verificarExistencia(permiso_result)){
        respuesta_api.mensaje="error al registrar la asistencia del trabajador, por que el trabajador tiene actualmente un permiso o un reposo activo "
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        let trabajador=new TrabajadorControlador()
        let datosTrabajador=await trabajador.consultarControlador(asistencia.cedula)
        console.log("datos =>>> ",datosTrabajador.rows)
        const datosHorario=await HorarioControlador.consultarHorarioAsistencia(datosTrabajador.rows[0].id_horario)
        console.log("datos =>>> ",datosHorario.rows)
        // respuesta_api.mensaje="hola"
        // respuesta_api.estado_peticion="404"
        // res.writeHead(200,{"Content-Type":"application/json"})
        // res.write(JSON.stringify(respuesta_api))
        // res.end()
        if(AsistenciaControlador.verificarExistencia(datosHorario)){
            const hoy=Moment().format("YYYY-MM-DD")
            const hora=Moment().format("HH:mmA")
            const json={
                id_asistencia:"",
                id_cedula:asistencia.cedula,
                horario_entrada_asistencia:"",
                horario_salida_asistencia:"",
                estatu_asistencia:"",
                estatu_cumplimiento_horario:"",
                id_horario:datosHorario.rows[0].id_horario
            }
            AsistenciaControlador.asistir(res,hoy,hora,json,respuesta_api,next,req,token)
        }
        else{
            respuesta_api.mensaje="error al registrar la asistencia del trabajador, no se a registrado horario de entrada en el sistema"
            respuesta_api.estado_peticion="404"
            res.writeHead(200,{"Content-Type":"application/json"})
            res.write(JSON.stringify(respuesta_api))
            res.end()
        }
        
    }
    
}

AsistenciaControlador.verificarInasistenciasJustificada= async (req,res) => {
    var respuesta_api={mensaje:"",estado_peticion:""}
    const horario_result=await HorarioControlador.consultarHorarioActivo()
    if(AsistenciaControlador.verificarExistencia(horario_result)){
        const reposo_result=await ReposoTrabajadorControlador.consultarRepososActivo()
        var contador_reposo=0
        while(contador_reposo<reposo_result.rows.length){
            const reposo=reposo_result.rows[contador_reposo]
            // console.log(reposo)
            AsistenciaControlador.registrarInasistencia(reposo,"IJR")
            contador_reposo++
        }
        //-----
        const permiso_result=await PermisoTrabajadorControlador.consultarPermisosActivos()
        var contador_permiso=0
        while(contador_permiso<permiso_result.rows.length){
            const permiso=permiso_result.rows[contador_permiso]
            // console.log(reposo)
            AsistenciaControlador.registrarInasistencia(permiso,"IJP")
            contador_permiso++
        }
        respuesta_api.mensaje="trabajando"
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje="error al registrar la asistencia del trabajador, no se a registrado horario de entrada en el sistema"
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

AsistenciaControlador.registrarInasistencia=async (inasistencia_justificada,tipo_inasistencia_justificada) => {
    const asistencia_modelo=new AsistenciaModelo()
    const hoy=Moment().format("YYYY-MM-DD")
    const id=await AsistenciaControlador.generarId(hoy)
    const json={
        id_asistencia:id,
        id_cedula:inasistencia_justificada.id_cedula,
        horario_entrada_asistencia:"--:--AM",
        horario_salida_asistencia:"--:--AM",
        estatu_asistencia:tipo_inasistencia_justificada,
        estatu_cumplimiento_horario:"N"
    }
    asistencia_modelo.setDatos(json)
    const asistencia_result=await asistencia_modelo.consultarTrabajadorAsistenciaModelo(hoy,json.id_cedula)
    if(!AsistenciaControlador.verificarExistencia(asistencia_result)){
        asistencia_modelo.registrarModelo()
    }
    else{
        console.log("no re realizo el registro")
    }
}

AsistenciaControlador.asistir=async (res,hoy,hora,json,respuesta_api,next,req,token) => {
        const asistencia_modelo=new AsistenciaModelo()
        const asistencia_result=await asistencia_modelo.consultarTrabajadorAsistenciaModelo(hoy,json.id_cedula)
        if(AsistenciaControlador.verificarExistencia(asistencia_result)){
            if(asistencia_result.rows[0].horario_salida_asistencia==="--:--AM" && asistencia_result.rows[0].estatu_asistencia==="P"){
                json.id_asistencia=asistencia_result.rows[0].id_asistencia
                json.horario_salida_asistencia=hora
                asistencia_modelo.setDatos(json)
                asistencia_modelo.actualizarModelo()
                respuesta_api.mensaje="adios que tenga un buen dia"
                respuesta_api.estado_peticion="200"///////////////////////
                req.vitacora=VitacoraControlador.json(respuesta_api,token,"UPDATE","tasistencia",json.id_asistencia)
                next()
            }
            else{
                respuesta_api.mensaje="ya este trabajador se retiro"
                respuesta_api.estado_peticion="200"
                res.writeHead(200,{"Content-Type":"application/json"})
                res.write(JSON.stringify({json,respuesta_api}))
                res.end()
            }
        }
        else{
            const id=await AsistenciaControlador.generarId(hoy)
            json.id_asistencia=id
            json.horario_entrada_asistencia=hora
            json.horario_salida_asistencia="--:--AM"
            json.estatu_asistencia="P"
            json.estatu_cumplimiento_horario=await AsistenciaControlador.cumpliirHoraioAsistencia(hora,json.id_horario)
            asistencia_modelo.setDatos(json)
            asistencia_modelo.registrarModelo()
            respuesta_api.mensaje="que tenga un feliz dia de trabajo"
            respuesta_api.estado_peticion="200"//////////////
            req.vitacora=VitacoraControlador.json(respuesta_api,token,"INSERT","tasistencia",id)
            next()
        }
}

AsistenciaControlador.cumpliirHoraioAsistencia=async (hora,id_horario) => {
    const cumpliir_horario=await HorarioControlador.verificarCumplimentoDeHorario(hora,id_horario)
    if(cumpliir_horario){
        return "C"
        }
    else{
        return "N"
    }
}

AsistenciaControlador.verificarInasistenciaInjustificada=async (req,res) => {
    var respuesta_api={mensaje:"",estado_peticion:""}
    const trabajador_controlador=new TrabajadorControlador()
    const trabajador_result=await trabajador_controlador.consultarTodosActivos()
    var contador=0
    while(contador<trabajador_result.rows.length){
        const trabajador=trabajador_result.rows[contador]
        const reposo_result=await ReposoTrabajadorControlador.consultarReposoActivo(trabajador.id_cedula)
        const permiso_result=await PermisoTrabajadorControlador.consultarPermisoActivos(trabajador.id_cedula)
        if(!AsistenciaControlador.verificarExistencia(reposo_result) && !AsistenciaControlador.verificarExistencia(permiso_result)){
            AsistenciaControlador.registrarInasistencia(trabajador,"II")
        }
        contador++
    }
    respuesta_api.mensaje="escaneo completado"
    respuesta_api.estado_peticion="200"
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

AsistenciaControlador.consultarAsistenciasFechaControlador=async (req,res) => {
    var respuesta_api={asistencias:[],mensaje:"",estado_peticion:""}
    const asistencia_modelo=new AsistenciaModelo()
    const {fecha} = req.params
    const asistencia_result=await asistencia_modelo.consultarFechaModelo(fecha)
    if(AsistenciaControlador.verificarExistencia(asistencia_result)){
        respuesta_api.asistencias=asistencia_result.rows
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje="no hay asistencias en al lista"
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

AsistenciaControlador.consultarAsistenciasTrabajadorControlador=async (req,res) => {
    var respuesta_api={asistencias:[],mensaje:"",estado_peticion:""}
    const asistencia_modelo=new AsistenciaModelo()
    const {cedula} = req.params
    asistencia_modelo.setCedula(cedula)
    const asistencia_result=await asistencia_modelo.consultarAsistenciaTrabajadorModelo()
    if(AsistenciaControlador.verificarExistencia(asistencia_result)){
        respuesta_api.asistencias=asistencia_result.rows
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje="el trabajador no tiene asistencias"
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

AsistenciaControlador.consultarAsistenciaControlador= async (req,res,next) => {
    var respuesta_api={asistencia:[],mensaje:"",estado_peticion:""}
    const {cedula,token}=req.params,
    hoy=Moment().format("YYYY-MM-DD"),
    asistencia_modelo=new AsistenciaModelo()
    result_asistencia=await asistencia_modelo.consultarTrabajadorAsistenciaModelo(hoy,cedula)
    if(AsistenciaControlador.verificarExistencia(result_asistencia)){
        respuesta_api.asistencia=result_asistencia.rows[0]
        respuesta_api.mensaje="vino el trabajador"
        respuesta_api.estado_peticion="202"
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"SELECT","tasistencia",cedula)
        next()
    }
    else{
        respuesta_api.mensaje="no ha asistido el dia de hoy"
        respuesta_api.estado_peticion="404"
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"SELECT","tasistencia",cedula)
        next()
    }

}

AsistenciaControlador.consultarTodasLasAsistenciasControlador= async (req,res,next) => {
    var respuesta_api={asistencias:[],mensaje:"",estado_peticion:""}
    asistencia_modelo=new AsistenciaModelo()
    result_asistencia=await asistencia_modelo.consultarTodosModelo()
    if(AsistenciaControlador.verificarExistencia(result_asistencia)){
        respuesta_api.asistencias=result_asistencia.rows
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje="no hay asistencias"
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}


AsistenciaControlador.consultarAsistenciaHoy= async (req,res) => {
    var respuesta_api={asistencias:[],mensaje:"",estado_peticion:""}
    asistencia_modelo=new AsistenciaModelo()
    let result_asistencia=await asistencia_modelo.consultarAsistenciaHoy()
    if(result_asistencia.rowCount>0){
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_peticion="200"
        respuesta_api.asistencias=result_asistencia.rows
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje="no hay ninguna asistencia el dia de hoy"
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

AsistenciaControlador.verificarExistencia=(result) => {
    return result.rows.length!=0
}

AsistenciaControlador.asignarPermisoRetiroAsistencia= async (fecha,cedula,idPermiso,horaSalida) => {
    let asistencia_modelo=new AsistenciaModelo()
    let datos=await asistencia_modelo.consultarTrabajadorAsistenciaModelo(fecha,cedula)
    if(datos.rowCount>0){
        return await asistencia_modelo.asignarPermisoRetiroAsistenciaTrabajador(fecha,cedula,idPermiso,horaSalida)
    }
    else{
        return datos
    }

    
}

AsistenciaControlador.sustituirDiasInasistenciaJRPorInasistenciaI = async (reposo) => {
    let asistencia=new AsistenciaModelo()
    return await asistencia.sustituirDiasInasistenciaJRPorInasistenciaI(reposo.id_cedula,Moment(reposo.fecha_desde_reposo_trabajador,"YYYY-MM-DD").format("YYYY-MM-DD"),Moment(reposo.fecha_hasta_reposo_trabajador,"YYYY-MM-DD").format("YYYY-MM-DD"))
}

module.exports= AsistenciaControlador

// const AsistenciaModelo=require("../modelo/m_asistencia"),
// HorarioControlador=require("./c_horario"),
// ReposoTrabajadorControlador=require("./c_reposo_trabajador"),
// PermisoTrabajadorControlador=require("./c_permiso_trabajador"),
// TrabajadorControlador=require("./c_trabajador"),
// Moment=require("moment")

// const AsistenciaControlador={}

// AsistenciaControlador.generarId=async (hoy) => {
//     const asistencia_modelo=new AsistenciaModelo()
//     const asistencia_result = await asistencia_modelo.consultarFechaModelo(hoy)
//     const id=`ais-${hoy}-${(asistencia_result.rows.length)+1}`
//     return id
// }

// AsistenciaControlador.presenteControlador=async (req,res) => {
//     var respuesta_api={mensaje:"",estado_peticion:""}
//     const {asistencia}= req.body
//     const reposo_result=await ReposoTrabajadorControlador.consultarReposoActivo(asistencia.cedula)
//     const permiso_result=await PermisoTrabajadorControlador.consultarPermisoActivos(asistencia.cedula)
//     if( AsistenciaControlador.verificarExistencia(reposo_result) || AsistenciaControlador.verificarExistencia(permiso_result)){
//         respuesta_api.mensaje="error al registrar la asistencia del trabajador, por que el trabajador tiene actualmente un permiso o un reposo activo"
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         const horario_result=await HorarioControlador.consultarHorarioActivo()
//         if(AsistenciaControlador.verificarExistencia(horario_result)){
//             const hoy=Moment().format("YYYY-MM-DD")
//             const hora=Moment().format("HH:mmA")
//             const json={
//                 id_asistencia:"",
//                 id_cedula:asistencia.cedula,
//                 horario_entrada_asistencia:"",
//                 horario_salida_asistencia:"",
//                 estatu_asistencia:"",
//                 estatu_cumplimiento_horario:""
//             }
//             AsistenciaControlador.asistir(res,hoy,hora,json,respuesta_api)
//         }
//         else{
//             respuesta_api.mensaje="error al registrar la asistencia del trabajador, no se a registrado horario de entrada en el sistema"
//             respuesta_api.estado_peticion="404"
//             res.writeHead(200,{"Content-Type":"application/json"})
//             res.write(JSON.stringify(respuesta_api))
//             res.end()
//         }
//     }
// }

// AsistenciaControlador.verificarInasistenciasJustificada= async (req,res) => {
//     var respuesta_api={mensaje:"",estado_peticion:""}
//     const horario_result=await HorarioControlador.consultarHorarioActivo()
//     if(AsistenciaControlador.verificarExistencia(horario_result)){
//         const reposo_result=await ReposoTrabajadorControlador.consultarRepososActivo()
//         var contador_reposo=0
//         while(contador_reposo<reposo_result.rows.length){
//             const reposo=reposo_result.rows[contador_reposo]
//             // console.log(reposo)
//             AsistenciaControlador.registrarInasistencia(reposo,"IJR")
//             contador_reposo++
//         }
//         //-----
//         const permiso_result=await PermisoTrabajadorControlador.consultarPermisosActivos()
//         var contador_permiso=0
//         while(contador_permiso<permiso_result.rows.length){
//             const permiso=permiso_result.rows[contador_permiso]
//             // console.log(reposo)
//             AsistenciaControlador.registrarInasistencia(permiso,"IJP")
//             contador_permiso++
//         }
//         respuesta_api.mensaje="trabajando"
//         respuesta_api.estado_peticion="200"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje="error al registrar la asistencia del trabajador, no se a registrado horario de entrada en el sistema"
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// }

// AsistenciaControlador.registrarInasistencia=async (inasistencia_justificada,tipo_inasistencia_justificada) => {
//     const asistencia_modelo=new AsistenciaModelo()
//     const hoy=Moment().format("YYYY-MM-DD")
//     const id=await AsistenciaControlador.generarId(hoy)
//     const json={
//         id_asistencia:id,
//         id_cedula:inasistencia_justificada.id_cedula,
//         horario_entrada_asistencia:"--:--AM",
//         horario_salida_asistencia:"--:--AM",
//         estatu_asistencia:tipo_inasistencia_justificada,
//         estatu_cumplimiento_horario:"N"
//     }
//     asistencia_modelo.setDatos(json)
//     const asistencia_result=await asistencia_modelo.consultarTrabajadorAsistenciaModelo(hoy,json.id_cedula)
//     if(!AsistenciaControlador.verificarExistencia(asistencia_result)){
//         asistencia_modelo.registrarModelo()
//     }
//     else{
//         console.log("no re realizo el registro")
//     }
// }

// AsistenciaControlador.asistir=async (res,hoy,hora,json,respuesta_api) => {
//         const asistencia_modelo=new AsistenciaModelo()
//         const asistencia_result=await asistencia_modelo.consultarTrabajadorAsistenciaModelo(hoy,json.id_cedula)
//         if(AsistenciaControlador.verificarExistencia(asistencia_result)){
//             if(asistencia_result.rows[0].horario_salida_asistencia==="--:--AM" && asistencia_result.rows[0].estatu_asistencia==="P"){
//                 json.id_asistencia=asistencia_result.rows[0].id_asistencia
//                 json.horario_salida_asistencia=hora
//                 asistencia_modelo.setDatos(json)
//                 asistencia_modelo.actualizarModelo()
//                 respuesta_api.mensaje="adios que tenga un buen dia"
//                 respuesta_api.estado_peticion="200"
//                 res.writeHead(200,{"Content-Type":"application/json"})
//                 res.write(JSON.stringify({json,respuesta_api}))
//                 res.end()
//             }
//             else{
//                 respuesta_api.mensaje="ya este trabajador se retiro"
//                 respuesta_api.estado_peticion="200"
//                 res.writeHead(200,{"Content-Type":"application/json"})
//                 res.write(JSON.stringify({json,respuesta_api}))
//                 res.end()
//             }
//         }
//         else{
//             const id=await AsistenciaControlador.generarId(hoy)
//             json.id_asistencia=id
//             json.horario_entrada_asistencia=hora
//             json.horario_salida_asistencia="--:--AM"
//             json.estatu_asistencia="P"
//             json.estatu_cumplimiento_horario=await AsistenciaControlador.cumpliirHoraioAsistencia(hora)
//             asistencia_modelo.setDatos(json)
//             asistencia_modelo.registrarModelo()
//             respuesta_api.mensaje="que tenga un feliz dia de trabajo"
//             respuesta_api.estado_peticion="200"
//             res.writeHead(200,{"Content-Type":"application/json"})
//             res.write(JSON.stringify({json,respuesta_api}))
//             res.end()
//         }
// }

// AsistenciaControlador.cumpliirHoraioAsistencia=async (hora) => {
//     const cumpliir_horario=await HorarioControlador.verificarCumplimentoDeHorario(hora)
//     if(cumpliir_horario){
//         return "C"
//         }
//     else{
//         return "N"
//     }
// }

// AsistenciaControlador.verificarInasistenciaInjustificada=async (req,res) => {
//     var respuesta_api={mensaje:"",estado_peticion:""}
//     const trabajador_controlador=new TrabajadorControlador()
//     const trabajador_result=await trabajador_controlador.consultarTodosActivos()
//     var contador=0
//     while(contador<trabajador_result.rows.length){
//         const trabajador=trabajador_result.rows[contador]
//         const reposo_result=await ReposoTrabajadorControlador.consultarReposoActivo(trabajador.id_cedula)
//         const permiso_result=await PermisoTrabajadorControlador.consultarPermisoActivos(trabajador.id_cedula)
//         if(!AsistenciaControlador.verificarExistencia(reposo_result) && !AsistenciaControlador.verificarExistencia(permiso_result)){
//             AsistenciaControlador.registrarInasistencia(trabajador,"II")
//         }
//         contador++
//     }
//     respuesta_api.mensaje="escaneo completado"
//     respuesta_api.estado_peticion="200"
//     res.writeHead(200,{"Content-Type":"application/json"})
//     res.write(JSON.stringify(respuesta_api))
//     res.end()
// }

// AsistenciaControlador.consultarAsistenciasFechaControlador=async (req,res) => {
//     var respuesta_api={asistencias:[],mensaje:"",estado_peticion:""}
//     const asistencia_modelo=new AsistenciaModelo()
//     const {fecha} = req.params
//     const asistencia_result=await asistencia_modelo.consultarFechaModelo(fecha)
//     if(AsistenciaControlador.verificarExistencia(asistencia_result)){
//         respuesta_api.asistencias=asistencia_result.rows
//         respuesta_api.mensaje="consulta completada"
//         respuesta_api.estado_peticion="200"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje="no hay asistencias en al lista"
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// }

// AsistenciaControlador.consultarAsistenciasTrabajadorControlador=async (req,res) => {
//     var respuesta_api={asistencias:[],mensaje:"",estado_peticion:""}
//     const asistencia_modelo=new AsistenciaModelo()
//     const {cedula} = req.params
//     asistencia_modelo.setCedula(cedula)
//     const asistencia_result=await asistencia_modelo.consultarAsistenciaTrabajadorModelo()
//     if(AsistenciaControlador.verificarExistencia(asistencia_result)){
//         respuesta_api.asistencias=asistencia_result.rows
//         respuesta_api.mensaje="consulta completada"
//         respuesta_api.estado_peticion="200"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
//     else{
//         respuesta_api.mensaje="el trabajador no tiene asistencias"
//         respuesta_api.estado_peticion="404"
//         res.writeHead(200,{"Content-Type":"application/json"})
//         res.write(JSON.stringify(respuesta_api))
//         res.end()
//     }
// }

// AsistenciaControlador.verificarExistencia=(result) => {
//     return result.rows.length!=0
// }

// module.exports= AsistenciaControlador