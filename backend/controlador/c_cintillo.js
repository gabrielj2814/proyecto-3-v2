const ModeloCintillo=require("../modelo/m_cintillo")
let Moment =require("moment")
const fs=require("fs").promises,
fs2=require("fs"),
fes=require("fs-extra"),
mkdirp=require("mkdirp")

const nombreDirectorio="./upload/cintillo/"

let ControladorCintillo={}

// {
//     "nombre_foto_cintillo": "foto z",
//     "extension_foto_cintillo": "foto z",
//     "fecha_subida_foto": "",
//     "hora_subida_foto": "",
//     "estatu_foto_cintillo": ""
//   }

ControladorCintillo.subirCintillo=async  (req,res) => {
    let respuesta={
        estado:false,
        mensaje:"",
    }
    let {cintillo} = req.body
    cintillo.fecha_subida_foto=Moment().format("YYYY-MM-DD")
    cintillo.hora_subida_foto=Moment().format("hh-mm-ssA")
    cintillo.estatu_foto_cintillo="1"
    const cintilloModelo=new ModeloCintillo()
    cintilloModelo.setDatos(cintillo)
    await cintilloModelo.desactivarCintilloActiva()
    const registro=await cintilloModelo.registrarFoto()
    console.log(registro)
    if(registro.rowCount>0){
        respuesta.estado=true
        respuesta.fecha=cintillo.fecha_subida_foto
        respuesta.hora=cintillo.hora_subida_foto
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta))
        res.end()
    }
    else{
        respuesta.estado=false
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta))
        res.end()
    }

    // const nombreFotoCintillo=`cintillo-${Moment().format("YYYY-MM-DD")}_${Moment().format("hh-mm-ssA")}`
    // ControladorCintillo.subrirFoto(req,res,nombreFotoCintillo,Moment().format("YYYY-MM-DD"),Moment().format("hh-mm-ssA"))
}

ControladorCintillo.enviarFoto=async (req,res) => {
    const {fecha,hora}=req.params
    let Archivo=req.files.archivo
    const extencion=ControladorCintillo.optenerExtencion(Archivo.name)
    const cintilloModelo=new ModeloCintillo()
    let actualizarCintillo=await cintilloModelo.agregarExtencion(extencion,fecha,hora)
    if(actualizarCintillo.rowCount>0){
        const nombreFotoCintillo=`cintillo-${fecha}_${hora}`
        console.log(nombreFotoCintillo)
        ControladorCintillo.subrirFoto(req,res,nombreFotoCintillo,fecha,hora)
    }
    else{
        const respuesta={
            estado:false,
            mensaje:"error al registrar la foto del cintillo .",
        }
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta))
        res.end()
    }
    

}

ControladorCintillo.subrirFoto=(req,res,nombreFoto,fecha,hora) => {
    let Archivo=req.files.archivo
    var estado=false
    const extencion=ControladorCintillo.optenerExtencion(Archivo.name)
    Archivo.name=nombreFoto+"."+extencion
    Archivo.mv(`${nombreDirectorio}${Archivo.name}`,error => {
        if(error) {
            const cintilloModelo=new ModeloCintillo()
            cintilloModelo.eliminarRegistro(fecha,hora)
            const respuesta={
                estado:false,
                mensaje:"error al registrar la foto del cintillo",
            }
            res.writeHead(200,{"Content-Type":"application/json"})
            res.write(JSON.stringify(respuesta))
            res.end()
        }
        else{
            const respuesta={
                estado:true,
                mensaje:"registro completado",
            }
            res.writeHead(200,{"Content-Type":"application/json"})
            res.write(JSON.stringify(respuesta))
            res.end()
        }
        
    })
}

ControladorCintillo.consultarTodosLosCintillos= async (req,res) => {
    const cintilloModelo=new ModeloCintillo()
    let repuesta={
        estado:false,
        mensaje:"",
        datos:[],
    }
    let consultaCintillos=await cintilloModelo.consultarTodos()
    if(consultaCintillos.rowCount>0){
        repuesta.estado=true
        repuesta.mensaje="consulta completada"
        repuesta.datos=consultaCintillos.rows
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(repuesta))
        res.end()
    }
    else{
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(repuesta))
        res.end()
    }
    
}

ControladorCintillo.consultarCintilloActivo= async (req,res) => {
    const cintilloModelo=new ModeloCintillo()
    let repuesta={
        estado:false,
        mensaje:"",
        datos:[]
    }
    let consultaCintillos=await cintilloModelo.consultarCintilloActivo()
    if(consultaCintillos.rowCount>0){
        repuesta.estado=true
        repuesta.mensaje="consulta completada"
        repuesta.datos=consultaCintillos.rows
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(repuesta))
        res.end()
    }
    else{
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(repuesta))
        res.end()
    }
    
}

ControladorCintillo.actualizarCintillo= async (req,res) => {
    let repuesta={
        estado:false,
        mensaje:"",
    }
    const {cintillo}=req.body
    // console.log(cintillo)

    const cintilloModelo=new ModeloCintillo()
    cintilloModelo.setIdCintillo(cintillo.id_foto_cintillo)
    cintilloModelo.setDatos(cintillo)
    let estado=null
    

    if(cintillo.estatu_foto_cintillo==="1"){
        await cintilloModelo.desactivarCintilloActiva()
        const actualizarCintillo=await cintilloModelo.actualizarCintillo()
        estado=actualizarCintillo.rowCount
        repuesta.estatu_foto_cintillo=true

    }
    else{
        const actualizarCintillo=await cintilloModelo.actualizarCintillo()
        estado=actualizarCintillo.rowCount
        repuesta.estatu_foto_cintillo=false
    }


    if(cintillo.actualizarFoto){
        let datosCintillo=await cintilloModelo.consultarCintillo()
        // console.log(datosCintillo.rows)
        let cintilloRespuesta=datosCintillo.rows[0]
        const fechaCintillo=Moment(cintilloRespuesta.fecha_subida_foto,"YYYY-MM-DD")
        let nombreFoto=`cintillo-${cintillo.fecha_subida_foto}_${cintillo.hora_subida_foto}.${cintilloRespuesta.extension_foto_cintillo}`
        console.log(" =>>>> ",nombreFoto)
        ControladorCintillo.eliminarFoto(nombreFoto)
        repuesta.fecha=Moment().format("YYYY-MM-DD")
        repuesta.hora=Moment().format("hh-mm-ssA")
        cintilloModelo.actualizarCintilloFechaHoraSubida(repuesta.fecha,repuesta.hora);
    }


    if(estado>0){
        repuesta.estado=true
        repuesta.mensaje="actualización completada"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(repuesta))
        res.end()
    }
    else{
        repuesta.estado=false
        repuesta.mensaje="no se puedo actualizar el registro"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(repuesta))
        res.end()
    }
    
}

ControladorCintillo.eliminarCintillo=async (req,res) => {
    let repuesta={
        estado:false,
        mensaje:""
    }
    const {id}=req.params
    const cintilloModelo=new ModeloCintillo()
    cintilloModelo.setIdCintillo(id)
    let datosCintillo=await cintilloModelo.consultarCintillo()
    // console.log(datosCintillo.rows)
    let cintillo=datosCintillo.rows[0]
    const fechaCintillo=Moment(cintillo.fecha_subida_foto,"YYYY-MM-DD")
    let nombreFoto=`cintillo-${fechaCintillo.format("YYYY-MM-DD")}_${cintillo.hora_subida_foto}.${cintillo.extension_foto_cintillo}`
    let eliminarCintillo=await cintilloModelo.eliminarCintillo()
    if(eliminarCintillo.rowCount>0){
        repuesta.estado=true
        repuesta.mensaje="eliminación completada"
        ControladorCintillo.eliminarFoto(nombreFoto)
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(repuesta))
        res.end()
    }
    else{
        // console.log("eliminar =>>> ",eliminarCintillo)
        repuesta.mensaje="error al eliminar el cintillo no esta en la base de datos"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(repuesta))
        res.end()
    }
}

ControladorCintillo.eliminarFoto= (nombreFoto) => {
    const ruta_completa=`${nombreDirectorio}${nombreFoto}`
    console.log(ruta_completa)
    fes.remove(ruta_completa,error =>{
        if(error) {
            console.log("no borro la foto")
        }
        else{
            console.log("borro la foto")
        }
    })

}

ControladorCintillo.optenerExtencion= (nombre) => {
    let nomberCortado=nombre.split(".")
    return nomberCortado[nomberCortado.length-1]
}

module.exports= ControladorCintillo