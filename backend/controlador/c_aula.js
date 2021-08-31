const ModeloAula=require("../modelo/m_aula")

const ControladorAula={}

ControladorAula.registrar=async (req,res) => {
    const respuesta_api={mensaje:"",estado_respuesta:false,color_alerta:""}
    let {aula} = req.body
    let Aula=new ModeloAula()
    Aula.setDatos(aula)
    let resultAula=await Aula.registrar()
    if(resultAula.rowCount>0){
        respuesta_api.mensaje="Registro completado"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="success"
    }
    else{
        respuesta_api.mensaje="error al registrar"
        respuesta_api.estado_respuesta=true
        respuesta_api.color_alerta="danger"
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()

}


module.exports=ControladorAula