const HorarioModelo=require("../modelo/m_horario"),
Moment=require("moment")

const HorarioControlador={}

HorarioControlador.consultarHoraioActivoControlador=async (req,res) => {
    var respuesta_api={horaio:[],mensaje:"",estado_peticion:""}
    const horario_modelo=new HorarioModelo()
    const horario_result=await horario_modelo.consultarHorarioActivoModelo()
    if(HorarioControlador.verificarExistencia(horario_result)){
        respuesta_api.horaio=horario_result.rows[0]
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje="al consultar, no hay horario disponible"
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    
}

HorarioControlador.agregarNuevoHorarioControlador=async (req,res) => {
    var respuesta_api={mensaje:"registro completado",estado_peticion:"200"}
    const horario_modelo_viejo=new HorarioModelo()
    const horario_modelo_nuevo=new HorarioModelo()
    const {horario} = req.body
    horario_modelo_nuevo.setDatos(horario)
    const horario_result=await horario_modelo_viejo.consultarHorarioActivoModelo()
    if(HorarioControlador.verificarExistencia(horario_result)){
        horario_modelo_viejo.setDatos(horario_result.rows[0])
        horario_modelo_viejo.actualizarModelo()
        horario_modelo_nuevo.registrarModelo()
    }
    else{
        horario_modelo_nuevo.registrarModelo()
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

HorarioControlador.verificarExistencia=(result)=>{
    return result.rows.length!=0
}

HorarioControlador.consultarHorarioActivo=async () => {
    const horario_modelo=new HorarioModelo()
    const horario_result=await horario_modelo.consultarHorarioActivoModelo()
    return horario_result
}

HorarioControlador.verificarCumplimentoDeHorario=async (hora) => {
    var estado=false
    const result =await HorarioControlador.consultarHorarioActivo()
    if(HorarioControlador.verificarExistencia(result)){
        const hora_entrada=Moment(result.rows[0].horario_entrada,"HH:mmA")
        if(Moment(hora,"HH:mmA").isSameOrBefore(hora_entrada)){
            estado=true
        }
    }
    return estado
}

module.exports=HorarioControlador