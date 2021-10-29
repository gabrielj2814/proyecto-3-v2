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

module.exports= ControladorAsignacionAulaProfesor