const ReposoTrabajadorModelo=require("../modelo/m_reposo_trabajador"),
TrabajadorControlador=require("./c_trabajador"),
CamControlador=require("./c_cam"),
AsignacionMedicoEspecialidadControlador=require("./c_asignacion_medico_especialidad"),
ReposoControlador=require("./c_reposo"),
Moment=require("moment"),
VitacoraControlador=require("./c_vitacora")

const ReposoTrabajadorControlador={}

ReposoTrabajadorControlador.generarId=async (req,res) => {
    const reposo_trabajador_modelo=new ReposoTrabajadorModelo()
    const patron="repot-"+Moment().format("YYYY-MM-DD")
    const reposo_trabajador_result=await reposo_trabajador_modelo.consultarTodosXPatronModelo(patron)
    const id=`${patron}-${(reposo_trabajador_result.rows.length)+1}`
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify({id:id}))
    res.end()
}

ReposoTrabajadorControlador.registrarControlador=async (req,res,next) => {
    PermisoTrabajadorControlador=require("./c_permiso_trabajador")
    var respuesta_api={mensaje:"",estado_peticion:""}
    const reposo_trabajador_modelo=new ReposoTrabajadorModelo()
    const {reposo_trabajador,token} = req.body
    console.log(reposo_trabajador)
    reposo_trabajador_modelo.setDatos(reposo_trabajador)
    const reposo_trabajador_result=await reposo_trabajador_modelo.consultarModelo()
    if(!ReposoTrabajadorControlador.verificarExistencia(reposo_trabajador_result)){
        const trabajador_constrolador=new TrabajadorControlador()
        if(trabajador_constrolador.consultar(reposo_trabajador.id_cedula)){
            if(CamControlador.consultar(reposo_trabajador.id_cam)){
                if(AsignacionMedicoEspecialidadControlador.consultar(reposo_trabajador.id_asignacion_medico_especialidad)){
                    if(ReposoControlador.consultar(reposo_trabajador.id_reposo)){
                        const reposo_trabajador_result_2=await reposo_trabajador_modelo.consultarXReposoTrabajadorActivoModelo()
                        if(!ReposoTrabajadorControlador.verificarExistencia(reposo_trabajador_result_2)){
                            const permiso_trabajador_result=await PermisoTrabajadorControlador.consultarPermisoActivos(reposo_trabajador.id_cedula)
                            if(!ReposoTrabajadorControlador.verificarExistencia(permiso_trabajador_result)){
                                reposo_trabajador_modelo.registrarModelo()
                                respuesta_api.mensaje="registro completado"
                                respuesta_api.estado_peticion="200"
                                req.vitacora=VitacoraControlador.json(respuesta_api,token,"INSERT","treposotrabajador",reposo_trabajador.id_reposo_trabajador)
                                next()
                                // res.writeHead(200,{"Content-Type":"application/json"})
                                // res.write(JSON.stringify(respuesta_api))
                                // res.end()
                            }
                            else{
                                // -------
                                let result_permiso=await PermisoTrabajadorControlador.tumbarPermisoPorReposo(permiso_trabajador_result)
                                if(result_permiso.rowCount===1){
                                    reposo_trabajador_modelo.registrarModelo()
                                    respuesta_api.mensaje="registro completado"
                                    respuesta_api.estado_peticion="200"
                                    req.vitacora=VitacoraControlador.json(respuesta_api,token,"INSERT","treposotrabajador",reposo_trabajador.id_reposo_trabajador)
                                    next()
                                    
                                }
                                else{
                                    respuesta_api.mensaje=`no se pudo registrar el reposo`
                                    respuesta_api.estado_peticion="404"
                                    res.writeHead(200,{"Content-Type":"application/json"})
                                    res.write(JSON.stringify(respuesta_api))
                                    res.end()
                                }
                            }
                        }
                        else{
                            respuesta_api.mensaje=`error al registrar, el trabajador tiene un reposo activo (codigo del reposo activo '${reposo_trabajador_result_2.rows[0].id_reposo_trabajador}')`
                            respuesta_api.estado_peticion="404"
                            res.writeHead(200,{"Content-Type":"application/json"})
                            res.write(JSON.stringify(respuesta_api))
                            res.end()
                        }
                    }
                    else{
                        respuesta_api.mensaje="error al registrar, no hay ningun reposo con este codigo "+reposo_trabajador.id_reposo
                        respuesta_api.estado_peticion="404"
                        res.writeHead(200,{"Content-Type":"application/json"})
                        res.write(JSON.stringify(respuesta_api))
                        res.end()
                    }
                }
                else{
                    respuesta_api.mensaje="error al registrar, no hay ningun asignacion de especialida de medico con este codigo"+reposo_trabajador.id_asignacion_medico_especialidad
                    respuesta_api.estado_peticion="404"
                    res.writeHead(200,{"Content-Type":"application/json"})
                    res.write(JSON.stringify(respuesta_api))
                    res.end()
                }
            }
            else{
                respuesta_api.mensaje="error al registrar, no hay ningun CAM con este codigo o no esta activio"+reposo_trabajador.id_cam
                respuesta_api.estado_peticion="404"
                res.writeHead(200,{"Content-Type":"application/json"})
                res.write(JSON.stringify(respuesta_api))
                res.end()
            }
            
        }
        else{
            respuesta_api.mensaje="al registrar, no hay ningun trabajador con esta cedula o el trabajador no esta activo"+reposo_trabajador.id_cedula
            respuesta_api.estado_peticion="404"
            res.writeHead(200,{"Content-Type":"application/json"})
            res.write(JSON.stringify(respuesta_api))
            res.end()
        }
    }
    else{
        respuesta_api.mensaje="al registrar, no puede haber dos registros con el mismo codigo-> "+reposo_trabajador.id_reposo_trabajador
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

ReposoTrabajadorControlador.actualizarControlador=async (req,res,next) => {
    PermisoTrabajadorControlador=require("./c_permiso_trabajador")
    var respuesta_api={mensaje:"",estado_peticion:""}
    const reposo_trabajador_modelo=new ReposoTrabajadorModelo()
    const {reposo_trabajador,token} = req.body
    reposo_trabajador_modelo.setDatos(reposo_trabajador)
    const reposo_trabajador_result=await reposo_trabajador_modelo.consultarModelo()
    if(ReposoTrabajadorControlador.verificarExistencia(reposo_trabajador_result)){
        const trabajador_constrolador=new TrabajadorControlador()
        if(trabajador_constrolador.consultar(reposo_trabajador.id_cedula)){
            if(CamControlador.consultar(reposo_trabajador.id_cam)){
                if(AsignacionMedicoEspecialidadControlador.consultar(reposo_trabajador.id_asignacion_medico_especialidad)){
                    if(ReposoControlador.consultar(reposo_trabajador.id_reposo)){
                        const permiso_trabajador_result=await PermisoTrabajadorControlador.consultarPermisoActivos(reposo_trabajador.id_cedula)
                        if(!ReposoTrabajadorControlador.verificarExistencia(permiso_trabajador_result)){
                            reposo_trabajador_modelo.actualizarModelo()
                            respuesta_api.mensaje="actualización completada"
                            respuesta_api.estado_peticion="200"
                            req.vitacora=VitacoraControlador.json(respuesta_api,token,"UPDATE","treposotrabajador",reposo_trabajador.id_reposo_trabajador)
                            next()
                            // res.writeHead(200,{"Content-Type":"application/json"})
                            // res.write(JSON.stringify(respuesta_api))
                            // res.end()
                        }
                        else{
                            respuesta_api.mensaje="al actualizar, el trabajadortiene un permiso activo no puede realizar esta actualizacion"
                            respuesta_api.estado_peticion="404"
                            res.writeHead(200,{"Content-Type":"application/json"})
                            res.write(JSON.stringify(respuesta_api))
                            res.end()
                        }
                    }
                    else{
                        respuesta_api.mensaje="al actualizar, no hay ningun reposo con este codigo"+reposo_trabajador.id_reposo
                        respuesta_api.estado_peticion="404"
                        res.writeHead(200,{"Content-Type":"application/json"})
                        res.write(JSON.stringify(respuesta_api))
                        res.end()
                    }
                }
                else{
                    respuesta_api.mensaje="al actualizar, no hay ningun asignacion de especialida de medico con este codigo"+reposo_trabajador.id_asignacion_medico_especialidad
                    respuesta_api.estado_peticion="404"
                    res.writeHead(200,{"Content-Type":"application/json"})
                    res.write(JSON.stringify(respuesta_api))
                    res.end()
                }
            }
            else{
                respuesta_api.mensaje="al actualizar, no hay ningun CAM con este codigo "+reposo_trabajador.id_cam
                respuesta_api.estado_peticion="404"
                res.writeHead(200,{"Content-Type":"application/json"})
                res.write(JSON.stringify(respuesta_api))
                res.end()
            }
            
        }
        else{
            respuesta_api.mensaje="al actualizar, no hay ningun trabajador con esta cedula"+reposo_trabajador.id_cedula
            respuesta_api.estado_peticion="404"
            res.writeHead(200,{"Content-Type":"application/json"})
            res.write(JSON.stringify(respuesta_api))
            res.end()
        }
    }
    else{
        respuesta_api.mensaje="al actualizar, no hay nigun registron con este codigo -> "+reposo_trabajador.id_reposo_trabajador
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

ReposoTrabajadorControlador.consultarControlador=async (req,res,next) => {
    var respuesta_api={reposo_trabajador:[],mensaje:"",estado_peticion:""}
    const reposo_trabajador_modelo=new ReposoTrabajadorModelo()
    const {id,token} = req.params
    reposo_trabajador_modelo.setIdReposoTrabajador(id)
    const reposo_trabajador_result=await reposo_trabajador_modelo.consultarModelo()
    if(ReposoTrabajadorControlador.verificarExistencia(reposo_trabajador_result)){
        respuesta_api.reposo_trabajador=reposo_trabajador_result.rows[0]
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_peticion="200"
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"SELECT","treposotrabajador",id)
        next()
    }
    else{
        respuesta_api.mensaje="error al consultar, no hay nigun registro con este codigo -> "+id
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

ReposoTrabajadorControlador.consultarTodosControlador=async (req,res) => {
    var respuesta_api={reposo_trabajadores:[],mensaje:"",estado_peticion:""}
    const reposo_trabajador_modelo=new ReposoTrabajadorModelo()
    const reposo_trabajador_result=await reposo_trabajador_modelo.consultarTodosModelo()
    if(ReposoTrabajadorControlador.verificarExistencia(reposo_trabajador_result)){
        respuesta_api.reposo_trabajadores=reposo_trabajador_result.rows
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje="no hay ningun registro almacenado"
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

ReposoTrabajadorControlador.consultarReposoTrabajadorPatronControlador=async (req,res) => {
    var respuesta_api={reposo_trabajadores:[],mensaje:"",estado_peticion:""}
    const reposo_trabajador_modelo=new ReposoTrabajadorModelo()
    const {patron} = req.params
    const reposo_trabajador_result=await reposo_trabajador_modelo.consultarRepososTrabajadorPatronModelo(patron)
    if(ReposoTrabajadorControlador.verificarExistencia(reposo_trabajador_result)){
        respuesta_api.reposo_trabajadores=reposo_trabajador_result.rows
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje="al consultar, no se a encontrado ningun resultado -> "+patron
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

ReposoTrabajadorControlador.consultarRepososXFechaControlador=async (req,res) => {
    var respuesta_api={reposo_trabajadores:[],mensaje:"",estado_peticion:""}
    const reposo_trabajador_modelo=new ReposoTrabajadorModelo()
    const {desde,hasta} = req.params
    reposo_trabajador_modelo.setDatosFechas(desde,hasta)
    const reposo_trabajador_result=await reposo_trabajador_modelo.consultarRepososXFechaModelo()
    if(ReposoTrabajadorControlador.verificarExistencia(reposo_trabajador_result)){
        respuesta_api.reposo_trabajadores=reposo_trabajador_result.rows
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje=`al consultar, no se a encontrado ningun reposo entre estas fechas ${desde},${hasta}`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

ReposoTrabajadorControlador.caducarRepososControlador=async (req,res) => {
    var respuesta_api={mensaje:"",estado_peticion:""}
    const reposo_trabajador_modelo=new ReposoTrabajadorModelo()
    const {hasta} = req.params
    const reposo_trabajador_result=await reposo_trabajador_modelo.consultarTodosRepososFechaHastaModelo(hasta)
    if(ReposoTrabajadorControlador.verificarExistencia(reposo_trabajador_result)){
        var contador=0
        while(contador<reposo_trabajador_result.rows.length){
            const reposo_trabajador=reposo_trabajador_result.rows[contador]
            reposo_trabajador_modelo.setIdReposoTrabajador(reposo_trabajador.id_reposo_trabajador)
            reposo_trabajador_modelo.actualizarCaducarReposoModelo()
            contador++
        }
        respuesta_api.mensaje=`hoy ${hasta} sean caducado ${contador} ${(contador<=1)?'reposo':'reposos'}`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje=`no hay reposos que caduque hoy :)`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

ReposoTrabajadorControlador.consultarRepososTrabajadorFechaDesdeHasta=async (req,res,next) => {
    var respuesta_api={reposos_trabajador:[],mensaje:"",estado_peticion:""}
    const reposo_trabajador_modelo=new ReposoTrabajadorModelo()
    const {desde,hasta,cedula,token} = req.params
    reposo_trabajador_modelo.setDatosFechas(desde,hasta)
    reposo_trabajador_modelo.setCedulaTrabajador(cedula)
    const reposo_trabajador_result=await reposo_trabajador_modelo.consultarReposoTrabjadorFechaDesdeHasta()
    if(ReposoTrabajadorControlador.verificarExistencia(reposo_trabajador_result)){
        respuesta_api.reposos_trabajador=reposo_trabajador_result.rows
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_peticion="200"
        req.vitacora=VitacoraControlador.json(respuesta_api,token,"SELECT","treposotrabajador",cedula)
        next()
    }
    else{
        respuesta_api.mensaje=`al consultar, al trabajador -> ${cedula} no se a encontrado ningun reposo entre estas fechas ${desde},${hasta}`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

ReposoTrabajadorControlador.consultarReposoActivoTrabajdor=async (req,res) => {
    let {id_cedula} =req.params
    let datos= await ReposoTrabajadorControlador.consultarReposoActivo(id_cedula)
    if(datos.rowCount>0){
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify({estado:true}))
        res.end()
    }
    else{
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify({estado:false}))
        res.end()
    }
}

ReposoTrabajadorControlador.actualizarEstadoEntregaReposo=async (req,res) => {
    let AsistenciaControlador=require("../controlador/c_asistencia")
    var respuesta_api={mensaje:"",estado_peticion:""}
    let {id,estado} =req.params
    let reposo=new ReposoTrabajadorModelo()
    reposo.setIdReposoTrabajador(id)
    let result_reposo=await reposo.consultarModelo()
    if(result_reposo.rowCount>0){
        if(estado==="E"){
            reposo.actualizarEstadoEntregaReposo(id,estado)
            respuesta_api.mensaje=`el estado de la entrega del reposo a sido cambiado de forma exitosa`
            respuesta_api.estado_peticion="200"
            res.writeHead(200,{"Content-Type":"application/json"})
            res.write(JSON.stringify(respuesta_api))
            res.end()
        }
        else if(estado==="N"){
            // console.log(result_reposo.rows[0])
            let result_reposo_actualizado=await reposo.actualizarEstadoEntregaReposo(id,estado)
            if(result_reposo_actualizado.rowCount>0){
                let asistencia_result=await AsistenciaControlador.sustituirDiasInasistenciaJRPorInasistenciaI(result_reposo.rows[0])
                respuesta_api.mensaje=`el estado de la entrega del reposo a sido cambiado de forma exitosa`
                respuesta_api.estado_peticion="200"
                res.writeHead(200,{"Content-Type":"application/json"})
                res.write(JSON.stringify(respuesta_api))
                res.end()
            }
            
        }
    }
    else{
        respuesta_api.mensaje=`error al cambiar el estado de entrega de este reposos ${id}, el reposo no exite`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}



ReposoTrabajadorControlador.verificarExistencia= (result) => {
    return result.rows.length!=0
}

ReposoTrabajadorControlador.consultarRepososActivo=async () => {
    const reposo_trabajador_modelo=new ReposoTrabajadorModelo()
    const reposo_trabajador_result=await reposo_trabajador_modelo.consultarTodosActivoModelo()
    return reposo_trabajador_result
}

ReposoTrabajadorControlador.consultarReposoActivo=async (cedula) => {
    const reposo_trabajador_modelo=new ReposoTrabajadorModelo()
    reposo_trabajador_modelo.setCedulaTrabajador(cedula)
    const reposo_trabajador_result=await reposo_trabajador_modelo.consultarXReposoTrabajadorActivoModelo()
    return reposo_trabajador_result
}

ReposoTrabajadorControlador.verificarVencimiento= async (req,res) => {
    // consultarRepososActivos
    let info={
        repososCaducados:[],
        numeroDeRepososCaducados:0
    }
    const hoy=Moment()
    // console.log(hoy)
    const reposo_trabajador_modelo=new ReposoTrabajadorModelo()
    let datosConsultaReposos=await reposo_trabajador_modelo.consultarRepososActivos()
    let reposos=datosConsultaReposos.rows
    console.log("reposos =>>> ",reposos)
    for(let reposo of reposos){
        
        // reposo.fecha_hasta_reposo_trabajador=Moment(reposo.fecha_hasta_reposo_trabajador,"YYYY-MM-DD")
        let fechaReposo=Moment(reposo.fecha_hasta_reposo_trabajador)
        // let fechaReposo=Moment(new Date("2021-2-1"))
        if(hoy.isAfter(fechaReposo)){
            // console.log("OK")
            info.repososCaducados.push(reposo)
            info.numeroDeRepososCaducados+= 1
            reposo_trabajador_modelo.setIdReposoTrabajador(reposo.id_reposo_trabajador)
            reposo_trabajador_modelo.actualizarCaducarReposoModelo()
        }
        // console.log("datos reposo =>>> ",reposo)
    }
    // console.log("reposos =>>> ",reposos)
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(info))
    res.end()
}

ReposoTrabajadorControlador.verificarReposoTrabajadorActivo= async (req,res) => {
    let {cedula} =req.params
    const reposo_trabajador_modelo=new ReposoTrabajadorModelo()
    let result_asistencia= await reposo_trabajador_modelo.verificarReposoTrabajadorActivo(cedula)
    if(result_asistencia.rowCount>0){
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify({estado:true}))
        res.end()
    }
    else{
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify({estado:false}))
        res.end()
    }
}

ReposoTrabajadorControlador.interumpirReposo=async (req,res,next) => {
    let {id_reposo_trabajador,token} =req.body
    const reposo_trabajador_modelo=new ReposoTrabajadorModelo()
    let reposos_trabajador_result=await reposo_trabajador_modelo.interumpirReposo(id_reposo_trabajador)
    if(reposos_trabajador_result.rowCount>0){
        // res.writeHead(200,{"Content-Type":"application/json"})
        // res.write(JSON.stringify({estado:true}))
        // res.end()
        req.vitacora=VitacoraControlador.json({estado:true},token,"UPDATE","treposotrabajador",id_reposo_trabajador)
        next()
    }
    else{
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify({estado:false}))
        res.end()
    }
}

ReposoTrabajadorControlador.consultarUltimoReposo= async (req,res) => {
    let {id_cedula} =req.body
    const reposo_trabajador_modelo=new ReposoTrabajadorModelo()
    let reposos_trabajador_result=await reposo_trabajador_modelo.consultarRepososPorTrabajador(id_cedula)
    if(reposos_trabajador_result.rowCount>0){
        let fecha=Moment(reposos_trabajador_result.rows[0].fecha_desde_reposo_trabajador,"YYYY-MM-DD").format("YYYY-MM-DD")
        let fecha2=Moment(reposos_trabajador_result.rows[0].fecha_desde_reposo_trabajador,"YYYY-MM-DD").format("DD-MM-YYYY")
        let reposos_trabajador_result2=await reposo_trabajador_modelo.consultarRepososPorTrabajadorYFecha(id_cedula,fecha)
        let mensaje=null
        let colorAlert=null
        console.log(reposos_trabajador_result2)
        if(reposos_trabajador_result2.rows[0].estatu_reposo_trabajador==="1" && reposos_trabajador_result2.rows[0].estatu_entrega_reposo==="P"){
            mensaje="tienes un reposo activo, pero no has entregado el comprobante de tu reposo tienes asta el "+fecha2+" para entregarlo"
            colorAlert="warning"
            res.writeHead(200,{"Content-Type":"application/json"})
            res.write(JSON.stringify({
                mensaje,
                estado:true,
                colorAlert
            }))
            res.end()
        }
        if(reposos_trabajador_result2.rows[0].estatu_reposo_trabajador==="1" && reposos_trabajador_result2.rows[0].estatu_entrega_reposo==="E"){
            mensaje="tienes un reposo activo"
            colorAlert="success"
            res.writeHead(200,{"Content-Type":"application/json"})
            res.write(JSON.stringify({
                mensaje,
                estado:true,
                colorAlert
            }))
            res.end()
        }
        if(reposos_trabajador_result2.rows[0].estatu_entrega_reposo==="N"){
            mensaje="No entregaste el comprobante de tu reposo, por ende han baniado tu reposo por no entregarlo en la fecha establecida "+fecha2
            colorAlert="danger"
            res.writeHead(200,{"Content-Type":"application/json"})
            res.write(JSON.stringify({
                mensaje,
                estado:true,
                colorAlert,
                nuevoReposo:true
            }))
            res.end()
        }
        if(reposos_trabajador_result2.rows[0].estatu_reposo_trabajador==="0" && reposos_trabajador_result2.rows[0].estatu_entrega_reposo==="E"){
            mensaje="Tu reposo a culminado "
            colorAlert="success"
            res.writeHead(200,{"Content-Type":"application/json"})
            res.write(JSON.stringify({
                mensaje,
                estado:true,
                colorAlert,
                nuevoReposo:true
            }))
            res.end()
        }
        if(reposos_trabajador_result2.rows[0].estatu_reposo_trabajador==="2" ){
            mensaje="tu reposo a sido interumpido"
            colorAlert="success"
            res.writeHead(200,{"Content-Type":"application/json"})
            res.write(JSON.stringify({
                mensaje,
                estado:true,
                colorAlert,
                nuevoReposo:true
            }))
            res.end()
        }
        else{
            res.writeHead(200,{"Content-Type":"application/json"})
            res.write(JSON.stringify({
                mensaje:"no tiene ningun reposo",
                estado:true,
                colorAlert:"success"
            }))
            res.end()
        }
        

    }
    else{
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify({
            mensaje:"no tiene ningun reposo",
            estado:true,
            colorAlert:"success",
            nuevoReposo:true
        }))
        res.end()
    }
}



module.exports = ReposoTrabajadorControlador

