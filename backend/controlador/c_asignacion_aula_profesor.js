const ModeloAsignacionAulaProfesor=require("../modelo/m_asignacion_aula_profesor")
const ControladorAsignacionAulaProfesor={}

ControladorAsignacionAulaProfesor.registrar=async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    let {asignacionAulaProfesor} = req.body
    let modeloAsignacionAulaProfesor=new ModeloAsignacionAulaProfesor()
    modeloAsignacionAulaProfesor.setDatos(asignacionAulaProfesor)
    let resultAsignacionAulaProfesor=await modeloAsignacionAulaProfesor.consultarProProfesorAnoEscolarYAula()
    if(resultAsignacionAulaProfesor.rowCount===0){
        let resultAsignacionAulaProfesor2=await modeloAsignacionAulaProfesor.registrar()
        if(resultAsignacionAulaProfesor2.rowCount>0){
            respuesta_api.mensaje="registro completado"
            respuesta_api.estado_respuesta=true
            respuesta_api.color_alerta="success" 
        }
        else{
            respuesta_api.mensaje="error al registrar"
            respuesta_api.estado_respuesta=true
            respuesta_api.color_alerta="danger" 
        }
    }
    else if(resultAsignacionAulaProfesor.rowCount>0){
        respuesta_api.mensaje="error al registrar (el profesor ya fue asignado a esa aula)"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

ControladorAsignacionAulaProfesor.consultar=async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let {id} = req.params
    let modeloAsignacionAulaProfesor=new ModeloAsignacionAulaProfesor()
    modeloAsignacionAulaProfesor.setdatoIdAsignacionAulaProfesor(id)
    let resultAsignacionAulaProfesor= await modeloAsignacionAulaProfesor.consultar()
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

ControladorAsignacionAulaProfesor.consultarDisponibilidadAula=async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    let {id_ano_escolar,id_aula} = req.params
    let modeloAsignacionAulaProfesor=new ModeloAsignacionAulaProfesor()
    modeloAsignacionAulaProfesor.setdatoIdAnoEscolar(id_ano_escolar)
    modeloAsignacionAulaProfesor.setdatoIdAula(id_aula)
    let resultAsignacionAulaProfesor= await modeloAsignacionAulaProfesor.consultarDisponibilidadAula()
    if(resultAsignacionAulaProfesor.rowCount===0){
        respuesta_api.mensaje="aula disponible"
        respuesta_api.datos={disponibilidadAula:true}
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="succes"
    }
    else{
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

ControladorAsignacionAulaProfesor.actualizar=async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    let {asignacionAulaProfesor} = req.body
    let modeloAsignacionAulaProfesor=new ModeloAsignacionAulaProfesor()
    modeloAsignacionAulaProfesor.setDatos(asignacionAulaProfesor)
    let resultAsignacionAulaProfesor= await modeloAsignacionAulaProfesor.actualizar()
    if(resultAsignacionAulaProfesor.rowCount>0){
        respuesta_api.mensaje="actualización completada"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="error al actualizar ( no se entrol el registro )"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
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


module.exports= ControladorAsignacionAulaProfesor