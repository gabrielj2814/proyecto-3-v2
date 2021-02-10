const ModeloCintillo=require("../modelo/m_cintillo")
let Moment =require("moment")
const fs=require("fs").promises,
fs2=require("fs"),
fes=require("fs-extra"),
mkdirp=require("mkdirp")

const nombreDirectorio="./upload/cintillo/"

let ControladorCintillo={}

// {
//     nombre_foto_cintillo: "foto z",
//     fecha_subida_foto: "",
//     hora_subida_foto: "",
//     estatu_foto_cintillo: ""
//   }
ControladorCintillo.subirCintillo= (req,res) => {
    if(req.body.cintillo){
        let {cintillo} = req.body
        // multipart/form-data
        cintillo.fecha_subida_foto=Moment().format("YYYY-MM-DD")
        cintillo.hora_subida_foto=Moment().format("hh-mm-ssA")
        cintillo.estatu_foto_cintillo="1"
        const cintrilloModelo=new ModeloCintillo()
        cintrilloModelo.setDatos(cintillo)
        cintrilloModelo.desactivarCintilloActiva()
        cintrilloModelo.registrarFoto()
        console.log(cintillo)
    }
    const nombreFotoCintillo=`cintillo-${Moment().format("YYYY-MM-DD")}_${Moment().format("hh-mm-ssA")}`
    ControladorCintillo.subrirFoto(req,res,nombreFotoCintillo,Moment().format("YYYY-MM-DD"),Moment().format("hh-mm-ssA"))
}

ControladorCintillo.subrirFoto=(req,res,nombreFoto,fecha,hora) => {
    let Archivo=req.files.archivo
    var estado=false
    const extencion=ControladorCintillo.optenerExtencion(Archivo.name)
    Archivo.name=nombreFoto+"."+extencion
    Archivo.mv(`${nombreDirectorio}${Archivo.name}`,error => {
        if(error) {
            const cintrilloModelo=new ModeloCintillo()
            cintrilloModelo.eliminarRegistro(fecha,hora)
            const respuesta={
                estado:false,
                mensaje:"error al registrar la foto del cintillo",
            }
            estado=false
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

ControladorCintillo.optenerExtencion= (nombre) => {
    let nomberCortado=nombre.split(".")
    return nomberCortado[nomberCortado.length-1]
}

module.exports= ControladorCintillo