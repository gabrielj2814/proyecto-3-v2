const controladorInscripcion = {}

controladorInscripcion.registrar_inscripcion = async ( req, res) => {
  const respuesta_api = { mensaje: "", estado_respuesta: false, color_alerta: "" };
  const ModeloInscripcion = require("../modelo/m_inscripcion");
  let { inscripcion } = req.body
  let modeloInscripcion = new ModeloInscripcion()
  modeloInscripcion.setDatos(inscripcion)
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

controladorInscripcion.obtenerEstudianteProfesor=async (cedulaProfesor) => {
    const ModeloInscripcion=require('../modelo/m_inscripcion')
    let modeloInscripcion= new ModeloInscripcion()
    const resultAnoActual=await modeloInscripcion.consultarAnoEscolar()
    const resultProfesor=await modeloInscripcion.consultarProfesorTrabajador(cedulaProfesor)
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
                    datosProfesor,
                    datosAnoActual,
                    datosAsignacion,
                    listaDeEstudiantes:resultEstudiantesInscriptos.rows,
                    estado:true

                }
            }
            else{
                return {
                    estado:false,
                    mensaje:"error el profesor no tiene estudiantes inscriptos"
                }
            }

        }
        else{
            return {
                estado:false,
                mensaje:"error este profesor no tiene asiganciones activas"
            }
        }
    }
    else{
        return {
            estado:false,
            mensaje:"error este profesor no esta registra o no hay un año activo corriendo"
        }
    }



}



module.exports = controladorInscripcion
