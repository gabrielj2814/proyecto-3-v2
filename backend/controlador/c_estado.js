const EstadoModelo=require("../modelo/m_estado")

const EstadoControlador={}

EstadoControlador.generarId=async (req,res)=>{
    const ESTADO=new EstadoModelo()
    const estado_result=await ESTADO.consultarTodosModelo()
    const id=`est-${(estado_result.rows.length)+1}`
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify({id:id}))
    res.end() 
}

EstadoControlador.registrarControlador= async (req,res) => {
    var respuesta_api={mensaje:"",estado_peticion:""}
    const {estado}=req.body
    const ESTADO=new EstadoModelo()
    ESTADO.setIdEstado(estado.id_estado)
    const estado_result=await ESTADO.consultarModelo()
    if(!EstadoControlador.verfificarExistencia(estado_result)){
        ESTADO.setDatos(estado)
        ESTADO.registrarModelo()
        respuesta_api.mensaje="registro completado"
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje=`al registrar por que ya hay un estado con este mismo codigo -> ${estado.id_estado}`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

EstadoControlador.verfificarExistencia=(result)=>{
    return result.rows.length!=0
}

EstadoControlador.consultarControlador = async (req,res) => {
    var respuesta_api={estado:[],mensaje:"",estado_peticion:""}
    const {id}=req.params
    const ESTADO=new EstadoModelo()
    ESTADO.setIdEstado(id)
    const estado_result=await ESTADO.consultarModelo()
    if(EstadoControlador.verfificarExistencia(estado_result)){
        respuesta_api.estado=estado_result.rows[0]
        respuesta_api.mensaje="consulta completada"
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje=`en la consulta, el estado consultado no existe`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

EstadoControlador.actualizarControlador= async (req,res) => {
    var respuesta_api={mensaje:"",estado_peticion:""}
    const {estado}=req.body
    const ESTADO=new EstadoModelo()
    ESTADO.setDatos(estado)
    const estado_result=await ESTADO.consultarModelo()
    if(EstadoControlador.verfificarExistencia(estado_result)){
        ESTADO.actualizarModelo()
        respuesta_api.mensaje=`actualización completada`
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje=`al actualizar, por que no existe`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

EstadoControlador.ConsultarTodosControlador= async (req,res)=> {
    var respuesta_api={estados:[],mensaje:"",estado_peticion:""}
    const ESTADO = new EstadoModelo()
    const estado_result= await ESTADO.consultarTodosModelo()
    if(EstadoControlador.verfificarExistencia(estado_result)){
        respuesta_api.estados=estado_result.rows
        respuesta_api.mensaje=`consulta completada`
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje=`no hay nada almacenado`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }

}

EstadoControlador.consultarEstadoPatronControlador= async (req,res) => {
    var respuesta_api={estados:[],mensaje:"",estado_peticion:""}
    const {patron}= req.params
    const ESTADO = new EstadoModelo()
    const estado_result= await ESTADO.consultarEstadoPatronModelo(patron)
    if(EstadoControlador.verfificarExistencia(estado_result)){
        respuesta_api.estados=estado_result.rows
        respuesta_api.mensaje=`consulta completada`
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje=`no se ha encontrado nada que coinsida con -> ${patron}`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }

}

module.exports = EstadoControlador