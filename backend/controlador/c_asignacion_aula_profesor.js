const ModeloAsignacionAulaProfesor=require("../modelo/m_asignacion_aula_profesor")
const ControladorAsignacionAulaProfesor={}

const VitacoraControlador = require("./c_vitacora")

ControladorAsignacionAulaProfesor.registrar=async (req,res, next) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    const ModeloAsignacionAulaProfesorEspecialista=require("../modelo/m_asignacion_aula_profesor_especialista")
    let {asignacionAulaProfesor,especialistas, token} = req.body
    let modeloAsignacionAulaProfesor=new ModeloAsignacionAulaProfesor()
    modeloAsignacionAulaProfesor.setDatos(asignacionAulaProfesor)
    let resultAsignacionAulaProfesor=await modeloAsignacionAulaProfesor.consultarProProfesorAnoEscolarYAula()
    if(resultAsignacionAulaProfesor.rowCount===0){
        let resultAsignacionAulaProfesor2=await modeloAsignacionAulaProfesor.registrar()
        if(resultAsignacionAulaProfesor2.rowCount>0){
            respuesta_api.mensaje="registro completado"
            respuesta_api.estado_respuesta=true
            respuesta_api.color_alerta="success" 
            let modeloAsignacionAulaProfesorEspecialista=new ModeloAsignacionAulaProfesorEspecialista()
            modeloAsignacionAulaProfesorEspecialista.setIdAsignacionAulaProfesor(resultAsignacionAulaProfesor2.rows[0].id_asignacion_aula_profesor)
            modeloAsignacionAulaProfesorEspecialista.eliminarPorAsignacionAulaProfesor()
            for(let especialista of especialistas){
                let datos={
                    id_asignacion_aula_profesor_especialista:"",
                    id_especialista:especialista,
                    id_asignacion_aula_profesor:resultAsignacionAulaProfesor2.rows[0].id_asignacion_aula_profesor
                }
                modeloAsignacionAulaProfesorEspecialista.setDatos(datos)
                modeloAsignacionAulaProfesorEspecialista.registrar()
            }
            req.vitacora = VitacoraControlador.json(respuesta_api, token, "INSERT", "tasignacion_aula_profesor", resultAsignacionAulaProfesor2.rows[0].id_asignacion_aula_profesor)
            next()
        }
        else{
            respuesta_api.mensaje="error al registrar"
            respuesta_api.estado_respuesta=true
            respuesta_api.color_alerta="danger" 
            res.writeHead(200, { "Content-Type": "application/json" })
            res.write(JSON.stringify(respuesta_api))
            res.end()
        }
    }
    else if(resultAsignacionAulaProfesor.rowCount>0){
        respuesta_api.mensaje="error al registrar (el profesor ya fue asignado a esa aula)"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

ControladorAsignacionAulaProfesor.consultar=async (req,res, next) => {
    const ModeloAsignacionAulaProfesorEspecialista=require("../modelo/m_asignacion_aula_profesor_especialista")
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let {id, token} = req.params
    let modeloAsignacionAulaProfesor=new ModeloAsignacionAulaProfesor()
    modeloAsignacionAulaProfesor.setdatoIdAsignacionAulaProfesor(id)
    let resultAsignacionAulaProfesor= await modeloAsignacionAulaProfesor.consultar()
    if(resultAsignacionAulaProfesor.rowCount>0){
        let modeloAsignacionAulaProfesorEspecialista=new ModeloAsignacionAulaProfesorEspecialista()
        modeloAsignacionAulaProfesorEspecialista.setIdAsignacionAulaProfesor(resultAsignacionAulaProfesor.rows[0].id_asignacion_aula_profesor)
        let resultAsignacionAulaProfesorEspecialista=await modeloAsignacionAulaProfesorEspecialista.consultarPorAsignacionAulaProfesor()
        resultAsignacionAulaProfesor.rows[0]["especialistas"]=resultAsignacionAulaProfesorEspecialista.rows
        respuesta_api.mensaje="Consultar completada"
        respuesta_api.datos=resultAsignacionAulaProfesor.rows
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="succes"
        req.vitacora = VitacoraControlador.json(respuesta_api, token, "SELECT", "tasignacion_aula_profesor", id)
        next()
    }
    else{
        respuesta_api.mensaje="Error al consultar ( no se entrol el registro )"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

ControladorAsignacionAulaProfesor.consultarDisponibilidadAula=async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let {id_ano_escolar,id_aula} = req.params
    let modeloAsignacionAulaProfesor=new ModeloAsignacionAulaProfesor()
    modeloAsignacionAulaProfesor.setdatoIdAnoEscolar(id_ano_escolar)
    modeloAsignacionAulaProfesor.setdatoIdAula(id_aula)
    let resultAsignacionAulaProfesor= await modeloAsignacionAulaProfesor.consultarDisponibilidadAula()
    console.log("que verga paso ",resultAsignacionAulaProfesor.rowCount)
    if(resultAsignacionAulaProfesor.rowCount===0){
        console.log("SI")
        respuesta_api.mensaje="aula disponible"
        respuesta_api.datos={disponibilidadAula:true}
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="succes"
    }
    else{
        console.log("no")
        respuesta_api.mensaje="aula no disponible"
        respuesta_api.datos={disponibilidadAula:false}
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

ControladorAsignacionAulaProfesor.consultarDisponibilidadProfesor=async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let {id_ano_escolar,id_profesor} = req.params
    let modeloAsignacionAulaProfesor=new ModeloAsignacionAulaProfesor()
    modeloAsignacionAulaProfesor.setdatoIdAnoEscolar(id_ano_escolar)
    modeloAsignacionAulaProfesor.setdatoIdProfesor(id_profesor)
    let resultAsignacionAulaProfesor= await modeloAsignacionAulaProfesor.consultarDisponibilidadProfesor()
    if(resultAsignacionAulaProfesor.rowCount===0){
        respuesta_api.mensaje="profesor disponible"
        respuesta_api.datos={disponibilidadProfesor:true}
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="succes"
    }
    else{
        respuesta_api.mensaje="profesor no disponible"
        respuesta_api.datos={disponibilidadProfesor:false}
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

ControladorAsignacionAulaProfesor.consultarTodos=async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let modeloAsignacionAulaProfesor=new ModeloAsignacionAulaProfesor()
    let resultAsignacionAulaProfesor= await modeloAsignacionAulaProfesor.consultarTodos()
    if(resultAsignacionAulaProfesor.rowCount>0){
        respuesta_api.mensaje="consultar completada"
        respuesta_api.datos=resultAsignacionAulaProfesor.rows
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="succes"
    }
    else{
        respuesta_api.mensaje="error al consultar ( no se entrol el registro )"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

ControladorAsignacionAulaProfesor.consultarAulasEspacioDisponibles=async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let {idAnnoEscolar,aulas} = req.body
    let modeloAsignacionAulaProfesor=new ModeloAsignacionAulaProfesor()
    let aulasEspaciosDisponibles=[]
    for(let contador=0;contador<aulas.length;contador++){
        let aula=aulas[contador]
        let resultAsignacionAulaProfesor= await modeloAsignacionAulaProfesor.consultarProfesorPorAnoYAulaEspacio(idAnnoEscolar,aula.id_aula_espacio)
        if(resultAsignacionAulaProfesor.rowCount===0){
            aulasEspaciosDisponibles.push(aula)
        }
    }
    respuesta_api.mensaje="consultar completada"
    respuesta_api.datos=aulasEspaciosDisponibles
    respuesta_api.estado_respuesta=true
    respuesta_api.color_alerta="succes"
    
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

ControladorAsignacionAulaProfesor.consultarPorAnoEscolar=async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let {id} = req.params
    let modeloAsignacionAulaProfesor=new ModeloAsignacionAulaProfesor()
    modeloAsignacionAulaProfesor.setdatoIdAnoEscolar(id)
    let resultAsignacionAulaProfesor= await modeloAsignacionAulaProfesor.consultarTodosPorAnoEscolar()
    if(resultAsignacionAulaProfesor.rowCount>0){
        respuesta_api.mensaje="consultar completada"
        respuesta_api.datos=resultAsignacionAulaProfesor.rows
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="succes"
    }
    else{
        respuesta_api.mensaje="error al consultar ( no se entrol el registro )"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

ControladorAsignacionAulaProfesor.actualizar=async (req,res, next) => {
    const ModeloAsignacionAulaProfesorEspecialista=require("../modelo/m_asignacion_aula_profesor_especialista")
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    let {asignacionAulaProfesor,especialistas, token} = req.body
    let modeloAsignacionAulaProfesor=new ModeloAsignacionAulaProfesor()
    modeloAsignacionAulaProfesor.setDatos(asignacionAulaProfesor)
    let resultAsignacionAulaProfesor= await modeloAsignacionAulaProfesor.actualizar()
    if(resultAsignacionAulaProfesor.rowCount>0){
        respuesta_api.mensaje="actualización completada"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
        let modeloAsignacionAulaProfesorEspecialista=new ModeloAsignacionAulaProfesorEspecialista()
        modeloAsignacionAulaProfesorEspecialista.setIdAsignacionAulaProfesor(asignacionAulaProfesor.id_asignacion_aula_profesor)
        modeloAsignacionAulaProfesorEspecialista.eliminarPorAsignacionAulaProfesor()
        for(let especialista of especialistas){
            let datos={
                id_asignacion_aula_profesor_especialista:"",
                id_especialista:especialista,
                id_asignacion_aula_profesor:asignacionAulaProfesor.id_asignacion_aula_profesor
            }
            modeloAsignacionAulaProfesorEspecialista.setDatos(datos)
            modeloAsignacionAulaProfesorEspecialista.registrar()
        }
        req.vitacora = VitacoraControlador.json(respuesta_api, token, "UPDATE", "tasignacion_aula_profesor", asignacionAulaProfesor.id_asignacion_aula_profesor)
        next()
    }
    else{
        respuesta_api.mensaje="error al actualizar ( no se entrol el registro )"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

ControladorAsignacionAulaProfesor.consularProfesorPorAulaYAno = async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    let {id_ano_escolar,id_aula} = req.params
    let modeloAsignacionAulaProfesor=new ModeloAsignacionAulaProfesor()
    modeloAsignacionAulaProfesor.setdatoIdAula(id_aula)
    modeloAsignacionAulaProfesor.setdatoIdAnoEscolar(id_ano_escolar)
    let resultAsignacionAulaProfesor= await modeloAsignacionAulaProfesor.consultarProfesorPorAnoYAula()
    if(resultAsignacionAulaProfesor.rowCount>0){
        respuesta_api.mensaje="consultar completada"
        respuesta_api.datos=resultAsignacionAulaProfesor.rows[0]
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="succes"
    }
    else{
        respuesta_api.mensaje="error al consultar ( no se entrol el registro )"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()


}

ControladorAsignacionAulaProfesor.consularAsigancionActualProfesor= async (req,res) => {
    const ModeloInscripcion = require("../modelo/m_inscripcion");
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let {cedula} = req.params
    let modeloAsignacionAulaProfesor=new ModeloAsignacionAulaProfesor()
    let modeloInscripcion = new ModeloInscripcion()
    let resultAsignacionActualProfesor= await modeloAsignacionAulaProfesor.consultarAsignacionActual(cedula)
    if(resultAsignacionActualProfesor.rowCount>0){
        let asignacionAulaProf=resultAsignacionActualProfesor.rows[0]
        modeloInscripcion.setIdAsignacionAulaProfesor(asignacionAulaProf.id_asignacion_aula_profesor)
        let listaDeInscriptos=await modeloInscripcion.consultarInscripcionesPorAsignacion()
        respuesta_api.mensaje="consultar completada"
        respuesta_api.datos=resultAsignacionActualProfesor.rows[0]
        respuesta_api.cuposRestantes=resultAsignacionActualProfesor.rows[0].numero_total_de_estudiantes-listaDeInscriptos.rowCount
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="succes"
    }
    else{
        respuesta_api.mensaje="error al consultar ( no se entro el registro )"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()


}

ControladorAsignacionAulaProfesor.verificarDisponibilidadTrabajador= async (req,res) => {
    // esta funcion se ultiliza para consultrar si el trabajador esta activo 
    // ademas ve si tiene un reposos o un permiso activo para evitar que se puede registrar el trabajador
    // en asignacion aula profesor
    const ModeloTrabajador = require("../modelo/m_trabajador");
    const ModeloPermisoTrabajador = require("../modelo/m_permiso_trabajador");
    const ModeloReposoTrabajador = require("../modelo/m_reposo_trabajador");
    const modeloTrabajador=new ModeloTrabajador()
    const respuesta_api={mensaje:"",disponibilidad:false,estado_respuesta:false,color_alerta:""}
    let {cedula} = req.params
    modeloTrabajador.set_idCedula(cedula)
    let resultTrabajador=await modeloTrabajador.consultarModelo()
    if(resultTrabajador.rowCount>0){
        let trabajador=resultTrabajador.rows[0]
        if(trabajador.estatu_trabajador==="1"){
            const modeloPermisoTrabajador=new ModeloPermisoTrabajador()
            modeloPermisoTrabajador.setCedulaPermiso(cedula)
            let resultPermisoTrabajador=await modeloPermisoTrabajador.consultarPermisoTrabajadorXCedulaActivolModelo()
            if(resultPermisoTrabajador.rowCount===0){
                const modeloReposoTrabajador=new ModeloReposoTrabajador()
                modeloReposoTrabajador.setCedulaTrabajador(cedula)
                let resultReporsoTrabajador=await modeloReposoTrabajador.consultarXReposoTrabajadorActivoModelo() 
                if(resultReporsoTrabajador.rowCount===0){
                    respuesta_api.mensaje=""
                    respuesta_api.disponibilidad=true
                    respuesta_api.estado_respuesta=true
                    respuesta_api.color_alerta="success"
                }
                else{
                    respuesta_api.mensaje="error al consultar el profesor tiene un reposo activo"
                    respuesta_api.estado_respuesta=true
                    respuesta_api.color_alerta="danger"
                }
            }
            else{
                respuesta_api.mensaje="error al consultar el profesor tiene un permiso activo"
                respuesta_api.estado_respuesta=true
                respuesta_api.color_alerta="danger"
            }
        }
        else{
            respuesta_api.mensaje="error al consultar el profesor no esta activo"
            respuesta_api.estado_respuesta=true
            respuesta_api.color_alerta="danger"
        }
    }
    else{
        respuesta_api.mensaje="error al consultar el profesor no existe en la base de datos"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    // console.log("datos => ",resultTrabajador)
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()


}

// ==================
// ==================
// ==================

ControladorAsignacionAulaProfesor.consultarDatosAsignacion= async (id) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let modeloAsignacionAulaProfesor=new ModeloAsignacionAulaProfesor()
    modeloAsignacionAulaProfesor.setdatoIdAsignacionAulaProfesor(id)
    let resultAsignacionAulaProfesor= await modeloAsignacionAulaProfesor.consultar()
    if(resultAsignacionAulaProfesor.rowCount>0){
        return resultAsignacionAulaProfesor.rows[0]
    }
    else{
        return []
    }
}

ControladorAsignacionAulaProfesor.consultarAsignacionActualInscripcion= async () => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let modeloAsignacionAulaProfesor=new ModeloAsignacionAulaProfesor()
    let resultAsignacionAulaProfesor= await modeloAsignacionAulaProfesor.consultarAsignacionActualInscripcion()
    if(resultAsignacionAulaProfesor.rowCount>0){
        return resultAsignacionAulaProfesor.rows
    }
    else{
        return []
    }
}


module.exports= ControladorAsignacionAulaProfesor