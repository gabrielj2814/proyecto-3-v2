const controladorInscripcion = {}

controladorInscripcion.registrar_inscripcion = async ( req, res) => {
    const respuesta_api = { mensaje: "", datos:[],estado_respuesta: false, color_alerta: "" };
    const ModeloInscripcion = require("../modelo/m_inscripcion");
    const ControladorAsignacionAulaProfesor=require("./c_asignacion_aula_profesor")
    let modeloInscripcion = new ModeloInscripcion()
    let { inscripcion } = req.body
    modeloInscripcion.setDatos(inscripcion)
    let consultarInscripcionActiva=await modeloInscripcion.consultarValidandoInscripcionEstudiante()
    if(consultarInscripcionActiva.rowCount===0){
        let datosDeAsignacionAula=await ControladorAsignacionAulaProfesor.consultarDatosAsignacion(inscripcion.id_asignacion_aula_profesor)
        let listaDeInscriptos=await modeloInscripcion.consultarInscripcionesPorAsignacion()
        let totalDeCuposDisponibles=datosDeAsignacionAula.numero_total_de_estudiantes-listaDeInscriptos.rowCount
        console.log("total de cupos =>>>> ",totalDeCuposDisponibles)
        if(listaDeInscriptos.rowCount<=datosDeAsignacionAula.numero_total_de_estudiantes){
            let resultInscripcion= await modeloInscripcion.registrar()
            if(resultInscripcion.rowCount>0){
                respuesta_api.mensaje="registro completado"
                respuesta_api.estado_respuesta=true
                respuesta_api.color_alerta="success"
            }
            else{
                respuesta_api.mensaje="error al realizar la inscripción"
                respuesta_api.estado_respuesta=false
                respuesta_api.color_alerta="danger"
            }
            // let inscripcionesEstudiate=await modeloInscripcion.consultarInscripcionesEstudiante()
            // if(inscripcionesEstudiate.rowCount===0){
            //     console.log("el estudiante no esta inscrpto en esta aula")
            // }
            // else{
            //     console.log("el estudiante intento inscripbir otra vez en la misma aula ")
            // }

        }
        else{
            respuesta_api.mensaje="error no cupos disponibles"
            respuesta_api.estado_respuesta=false
            respuesta_api.color_alerta="danger"
        }
    }
    else{
        respuesta_api.mensaje="error el estudiante ya esta inscripto"
        respuesta_api.estado_respuesta=false
        respuesta_api.datos=consultarInscripcionActiva.rows[0]
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

controladorInscripcion.consultarTodas= async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    const ModeloInscripcion=require('../modelo/m_inscripcion')
    // const patron = req.body.patron
    let modeloInscripcion=new ModeloInscripcion()
    // modeloInscripcion.setIdProfesor(patron)
    let resultInscripcion = await modeloInscripcion.consultarTodas()
    if(resultInscripcion.rowCount>0){
        respuesta_api.mensaje="consulta completada"
        respuesta_api.datos=resultInscripcion.rows
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="no se a encontrado registro en la base de datos"
        respuesta_api.estado_respuesta=false
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

controladorInscripcion.consultar=async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    const ModeloInscripcion=require('../modelo/m_inscripcion')
    let {id}=req.params
    let modeloInscripcion=new ModeloInscripcion()
    modeloInscripcion.setIdInscripcion(id)
    let resultInscripcion=await modeloInscripcion.consultar()
    if(resultInscripcion.rowCount>0){
        respuesta_api.mensaje="consulta completada"
        respuesta_api.datos=resultInscripcion.rows
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="no se a encontrado el registro en la base de datos"
        respuesta_api.estado_respuesta=false
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

controladorInscripcion.cambio = async (req, res) =>{
    const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" } 
    const ModeloInscripcion = require('../modelo/m_inscripcion')
    let { cambio } = req.body
    let { id } = req.params
    let modeloInscripcion = new ModeloInscripcion()
    modeloInscripcion.setCambio(cambio)
    modeloInscripcion.setIdInscripcion(id)
    let resultInscripcion = await modeloInscripcion.cambioDeAula()
    if(resultInscripcion.rowCount > 0) {
        let resultInscripcion2 = await modeloInscripcion.cambioDeAula()
        if(resultInscripcion2.rowCount > 0 ){
            respuesta_api.mensaje = "actualización completada"
            respuesta_api.estado_respuesta = true
            respuesta_api.color_alerta = "success"
        }
        else {
            respuesta_api.mensaje = "error al Cambiar"
            respuesta_api.estado_respuesta = false
            respuesta_api.color_alerta = "danger"
        }
    }
    else {
        respuesta_api.mensaje = "error al realizar el cambio (Este registro no se encuentra en la base de datos)"
        respuesta_api.estado_respuesta = false
        respuesta_api.color_alerta = "warning"
    }
    res.writeHead(200, { "Content-Type": "application/json" })
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

controladorInscripcion.actualizar= async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    const ModeloInscripcion=require('../modelo/m_inscripcion')
    let {inscripcion}=req.body
    let {id}=req.params
    let modeloInscripcion=new ModeloInscripcion()
    modeloInscripcion.setDatos(inscripcion)
    modeloInscripcion.setIdInscripcion(id)
    let resultInscripcion=await modeloInscripcion.actualizar()
    if(resultInscripcion.rowCount>0){
        let resultInscripcion2=await modeloInscripcion.actualizar()
        if(resultInscripcion2.rowCount>0){
            respuesta_api.mensaje="actualización completada"
            respuesta_api.estado_respuesta=true
            respuesta_api.color_alerta="success"
        }
        else{
            respuesta_api.mensaje="error al actualizar"
            respuesta_api.estado_respuesta=false
            respuesta_api.color_alerta="danger"
        }
    }
    else{
        respuesta_api.mensaje="error al actualizar (este registro no se encuentra en la base de datos)"
        respuesta_api.estado_respuesta=false
        respuesta_api.color_alerta="warning"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

controladorInscripcion.culminarInscripcion= async (id_inscripcion) => {
    const ModeloInscripcion=require('../modelo/m_inscripcion')
    let modeloInscripcion=new ModeloInscripcion()
    modeloInscripcion.setIdInscripcion(id_inscripcion)
    let resultInscripcion=await modeloInscripcion.culminar()
    if(resultInscripcion.rowCount>0){
        return true
    }
    else{
        return false
    }
}

controladorInscripcion.obtenerEstudianteProfesor=async (req,res) => {
    const ModeloInscripcion=require('../modelo/m_inscripcion')
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:"",datos:[]}
    let {cedula} = req.params;
    let modeloInscripcion= new ModeloInscripcion()
    const resultAnoActual=await modeloInscripcion.consultarAnoEscolarActivo()
    const resultProfesor=await modeloInscripcion.consultarProfesorTrabajador(cedula)
    // console.log("profesor =>>> ",resultProfesor.rows)
    // console.log("ano =>>> ",resultAnoActual.rows)
    if(resultProfesor.rowCount>0 && resultAnoActual.rowCount>0){
        let datosProfesor=resultProfesor.rows[0]
        let datosAnoActual=resultAnoActual.rows[0]
        const consultarAsigancionActulaProfesor=await modeloInscripcion.consultarAsigancionActulaProfesor(datosProfesor.id_profesor,datosAnoActual.id_ano_escolar)
        // console.log("asignacion =>>> ",consultarAsigancionActulaProfesor.rows)
        if(consultarAsigancionActulaProfesor.rowCount>0){
            let datosAsignacion=consultarAsigancionActulaProfesor.rows[0]
            const resultEstudiantesInscriptos= await modeloInscripcion.consultarEstudiantesPorAsignacion(datosAsignacion.id_asignacion_aula_profesor)
            // console.log("inscriptos =>>> ",resultEstudiantesInscriptos.rows)
            if(resultEstudiantesInscriptos.rowCount>0){
                respuesta_api.datos = {
                    datosProfesor,
                    datosAnoActual,
                    datosAsignacion,
                    listaDeEstudiantes:resultEstudiantesInscriptos.rows,
                }
                respuesta_api.estado_respuesta = true;
                respuesta_api.color_alerta="success"
                respuesta_api.mensaje="consulta completada"

            }
            else{
                respuesta_api.estado_respuesta = false;
                respuesta_api.mensaje = "error el profesor no tiene estudiantes inscriptos";
                respuesta_api.color_alerta="danger"
            }

        }
        else{
          respuesta_api.estado_respuesta = false;
          respuesta_api.color_alerta="danger"
          respuesta_api.mensaje = "error este profesor no tiene asiganciones activas";
        }
    }
    else{
      respuesta_api.estado_respuesta = false;
      respuesta_api.color_alerta="danger"
      respuesta_api.mensaje = "error este profesor no esta registra o no hay un año activo corriendo";
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

controladorInscripcion.obtenerEstudianteProfesor2=async (cedula) => {
    const ModeloInscripcion=require('../modelo/m_inscripcion')
    let modeloInscripcion= new ModeloInscripcion()
    const resultAnoActual=await modeloInscripcion.consultarAnoEscolarActivo()
    const resultProfesor=await modeloInscripcion.consultarProfesorTrabajador(cedula)
    // console.log("profesor =>>> ",resultProfesor.rows)
    // console.log("ano =>>> ",resultAnoActual.rows)
    if(resultProfesor.rowCount>0 && resultAnoActual.rowCount>0){
        let datosProfesor=resultProfesor.rows[0]
        let datosAnoActual=resultAnoActual.rows[0]
        const consultarAsigancionActulaProfesor=await modeloInscripcion.consultarAsigancionActulaProfesor(datosProfesor.id_profesor,datosAnoActual.id_ano_escolar)
        // console.log("asignacion =>>> ",consultarAsigancionActulaProfesor.rows)
        if(consultarAsigancionActulaProfesor.rowCount>0){
            let datosAsignacion=consultarAsigancionActulaProfesor.rows[0]
            const resultEstudiantesInscriptos= await modeloInscripcion.consultarEstudiantesPorAsignacion(datosAsignacion.id_asignacion_aula_profesor)
            // console.log("inscriptos =>>> ",resultEstudiantesInscriptos.rows)
            if(resultEstudiantesInscriptos.rowCount>0){
                return {
                    estado:true,
                    datosProfesor,
                    datosAnoActual,
                    datosAsignacion,
                    listaDeEstudiantes:resultEstudiantesInscriptos.rows,
                }

            }
            else{
                return {}
            }

        }
        else{
            return {}
        }
    }
    else{
        return {}
    }
}

controladorInscripcion.obtenerAulaProfesor = async (req, res) => {
    const ModeloInscripcion = require('../modelo/m_inscripcion')
    const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "", datos: [] }
    let { idAula } = req.params;
    let modeloInscripcion = new ModeloInscripcion()
    const resultProfesor = await modeloInscripcion.consultarProfesorAula(idAula)

    if (resultProfesor.rowCount > 0){
        respuesta_api.datos = resultProfesor.rows;
        respuesta_api.estado_respuesta = true;
        respuesta_api.color_alerta = "success"
        respuesta_api.mensaje = "consulta completada"

    }else{
        respuesta_api.estado_respuesta = false;
        respuesta_api.color_alerta = "danger"
        respuesta_api.mensaje = "No se encontraron resultado de su busqueda";
    }
    res.writeHead(200, { "Content-Type": "application/json" })
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

controladorInscripcion.ObtenerEstudiantesInscritos = async (req, res) => {
    const ModeloInscripcion = require('../modelo/m_inscripcion')
    const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "", datos: [] }
    let modeloInscripcion = new ModeloInscripcion()
    const estudiantesInscritos = await modeloInscripcion.ConsultarEstudiantesInscritos()

    if (estudiantesInscritos.rowCount > 0){
        respuesta_api.datos = estudiantesInscritos.rows
        respuesta_api.estado_respuesta = true;
        respuesta_api.color_alerta = "success"
        respuesta_api.mensaje = "consulta completada"

    }else{
        respuesta_api.estado_respuesta = false;
        respuesta_api.color_alerta = "danger"
        respuesta_api.mensaje = "No se encontraron resultado de su busqueda";
    }
    res.writeHead(200, { "Content-Type": "application/json" })
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

module.exports = controladorInscripcion
