const ControladorBoleta={}
const ModeloBoleta= require("../modelo/m_Boleta")

ControladorBoleta.registrar= async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    const {boleta} = req.body
    let modeloBoleta = new ModeloBoleta()
    modeloBoleta.setDatos(boleta)
    let resultBoleta=await modeloBoleta.consultaInscripcionYLapso()
    if(resultBoleta.rowCount===0){
        const resultRegistroBoleta=await modeloBoleta.registrar()
        if(resultRegistroBoleta.rowCount>0){
                respuesta_api.mensaje="Registro completado"
                respuesta_api.estado_respuesta=true
                respuesta_api.color_alerta="success"
        }
        else{
            respuesta_api.mensaje="error al registrar la boleta"
            respuesta_api.estado_respuesta=true
            respuesta_api.color_alerta="danger"
        }
    }
    else{
        respuesta_api.mensaje="el estudiante ya tiene una boleta con este lapso"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()


}


ControladorBoleta.registrarMasivo= async (req,res) => {
    const respuesta_api={mensaje:"",boletasCreadas:[],boletasNoCreadas:[],estado_respuesta:false,color_alerta:""}
    const {boletas} = req.body
    let boletasCreadas=[]
    let boletasNoCreadas=[]
    for(let boleta of boletas){
        let modeloBoleta = new ModeloBoleta()
        modeloBoleta.setDatos(boleta)
        let resultBoleta=await modeloBoleta.consultaInscripcionYLapso()
        if(resultBoleta.rowCount===0){
            const resultRegistroBoleta=await modeloBoleta.registrar()
            if(resultRegistroBoleta.rowCount>0){
                boletasCreadas.push(boleta)
            }
        }
        else{
            boletasNoCreadas.push(boleta)
        }
    }
    respuesta_api.boletasCreadas=boletasCreadas
    respuesta_api.boletasNoCreadas=boletasNoCreadas
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

ControladorBoleta.consultarTodasLasBoletasDelInscripto= async (req,res) => {
    const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
    const {id} = req.params
    let modeloBoleta = new ModeloBoleta()
    modeloBoleta.setIdInscripcion(id)
    let resultBoleta=await modeloBoleta.consultaBoletarPorInscripcion()
    if(resultBoleta.rowCount>0){
        respuesta_api.mensaje="boeltas del estudiante consultadas"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
        respuesta_api.datos=resultBoleta.rows
    }
    else{
        respuesta_api.mensaje="el estudiantes no tiene boletas creadas"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

// ControladorBoleta.consultarTodasLasBoleta= async (req,res) => {
//     const respuesta_api={mensaje:"",datos:[],estado_respuesta:false,color_alerta:""}
//     const {id} = req.params
//     let modeloBoleta = new ModeloBoleta()
//     modeloBoleta.setIdInscripcion(id)
//     let resultBoleta=await modeloBoleta.consultaBoletarPorInscripcion()
//     if(resultBoleta.rowCount>0){
//         respuesta_api.mensaje="boeltas del estudiante consultadas"
//         respuesta_api.estado_respuesta=true
//         respuesta_api.color_alerta="success"
//         respuesta_api.datos=resultBoleta.rows
//     }
//     else{
//         respuesta_api.mensaje="el estudiantes no tiene boletas creadas"
//         respuesta_api.estado_respuesta=true
//         respuesta_api.color_alerta="danger"
//     }
//     res.writeHead(200,{"Content-Type":"application/json"})
//     res.write(JSON.stringify(respuesta_api))
//     res.end()
// }

ControladorBoleta.actualizarObservacion= async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    const {boleta} = req.body
    let modeloBoleta = new ModeloBoleta()
    modeloBoleta.setDatos(boleta)
    let resultBoleta=await modeloBoleta.actualizarObservacion()
    if(resultBoleta.rowCount>0){
        respuesta_api.mensaje="actualizacion completada de observacion"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="error al actualizar la observacion"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

module.exports = ControladorBoleta