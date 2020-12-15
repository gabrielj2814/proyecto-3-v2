const CiudadModelo=require("../modelo/m_ciudad")

const CiudadControlador={}

CiudadControlador.generarId= async (req,res)=> {
    const CIUDAD = new CiudadModelo()
    const ciudad_result=await CIUDAD.consultarTodosModelo()
    const id=`ciu-${(ciudad_result.rows.length)+1}`
    res.writeHead(200,{"Content-Type":"applicaction/json"})
    res.write(JSON.stringify({id:id}))
    res.end()
}

CiudadControlador.registrarControlador=async (req,res) => {
    var respuesta_api={mensaje:"",estado_peticion:""}
    const CIUDAD= new CiudadModelo()
    const {ciudad}=req.body
    CIUDAD.setDatos(ciudad)
    const ciudad_result=await CIUDAD.consultarModelo()
    if(!CiudadControlador.verificarExistencia(ciudad_result)){
        CIUDAD.registrarModelo()
        respuesta_api.mensaje=`registro completado`
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje=`al registrar por que ya hay una ciudad con este mismo codigo -> ${ciudad.id_ciudad}`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

CiudadControlador.consultarControlador= async (req,res) => {
    var respuesta_api={ciudad:[],mensaje:"",estado_peticion:""}
    const {id}=req.params
    const CIUDAD= new CiudadModelo()
    CIUDAD.setIdCiudad(id)
    const ciudad_result= await CIUDAD.consultarModelo()
    if(CiudadControlador.verificarExistencia(ciudad_result)){
        respuesta_api.ciudad=ciudad_result.rows[0]
        respuesta_api.mensaje=`consulta completada`
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje=`al consultar, por que no hay ninguna ciudad con este codigo-> ${id}`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }

}

CiudadControlador.consultarCiudadXEstadoControlador= async (req,res) => {
    var respuesta_api={ciudades:[],mensaje:"",estado_peticion:""}
    const {id}=req.params
    const CIUDAD= new CiudadModelo()
    const ciudad_result= await CIUDAD.consultarCiudadXEstadoModelo(id)
    if(CiudadControlador.verificarExistencia(ciudad_result)){
        respuesta_api.ciudades=ciudad_result.rows
        respuesta_api.mensaje=`consulta completada`
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje=`al consultar, por que no hay ninguna ciudad que pertenesca a este codigo de estado ${id}`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }

}

CiudadControlador.actualizarControlador=async (req,res) => {
    var respuesta_api={mensaje:"",estado_peticion:""}
    const CIUDAD = new CiudadModelo()
    const {ciudad}= req.body
    CIUDAD.setDatos(ciudad)
    const ciudad_result=await CIUDAD.consultarModelo()
    if(CiudadControlador.verificarExistencia(ciudad_result)){
        CIUDAD.actualizarModelo()
        respuesta_api.mensaje=`actualización completada`
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje=`al actualizar, por que no hay ninguna ciudad con este codigo-> ${id}`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    
}

CiudadControlador.consultarTodosControlador = async (req,res) => {
    var respuesta_api={ciudades:[],mensaje:"",estado_peticion:""}
    const CIUDAD=new CiudadModelo()
    const ciudad_result=await CIUDAD.consultarTodosModelo()
    if(CiudadControlador.verificarExistencia(ciudad_result)){
        respuesta_api.ciudades=ciudad_result.rows
        respuesta_api.mensaje=`consulta completada`
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje=`no hay ciudades registradas`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
}

CiudadControlador.consultarCiudadPatronControlador= async (req,res) => {
    var respuesta_api={ciudades:[],mensaje:"",estado_peticion:""}
    const CIUDAD=new CiudadModelo()
    const {patron}=req.params
    const ciudad_result=await CIUDAD.consultarCiudadPatronModelo(patron)
    if(CiudadControlador.verificarExistencia(ciudad_result)){
        respuesta_api.ciudades=ciudad_result.rows
        respuesta_api.mensaje=`consulta completada`
        respuesta_api.estado_peticion="200"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.mensaje=`no hay ciudades registradas con este patron -> ${patron}`
        respuesta_api.estado_peticion="404"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }

}

CiudadControlador.verificarExistencia= (result) => {
    return result.rows.length!=0
}

module.exports = CiudadControlador