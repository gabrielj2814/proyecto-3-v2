const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
bcrypt=require("bcrypt"),
TrabajadorControlador=require("../../controlador/c_trabajador")
//servicios
const ServisWebToken=require("../../servicios")

router.use(bodyparser.json())

router.get("/iniciar-session/:usuario/:clave",async(req,res)=>{
    const usuario= req.params.usuario
    const clave= req.params.clave
    var respuesta_api={token:"",mensaje:"",estado_peticion:""}
    const TRABAJADOR=new TrabajadorControlador()
    const trabajador=await TRABAJADOR.consultarControlador(usuario)
    if(trabajador.rows.length!=0){
        if(bcrypt.compareSync(clave,trabajador.rows[0].clave_trabajador)){
            console.log("clave correcta creacion del token")
            const id_cedula=trabajador.rows[0].id_cedula,
            nombre_usuario=trabajador.rows[0].nombres+" "+trabajador.rows[0].apellidos,
            id_perfil=trabajador.rows[0].id_perfil
            const token=ServisWebToken.crearToken(id_cedula,nombre_usuario,id_perfil)
            respuesta_api.token=token
            respuesta_api.mensaje="sesion creada correctamente"
            respuesta_api.estado_peticion="200"
            respuesta_api.estado_sesion=true
            res.writeHead(200,{"Content-Type":"application/json"})
            res.write(JSON.stringify(respuesta_api))
            res.end()
        }
        else{
            respuesta_api.mensaje="error al iniciar revise si la clave o el usuario esten bien escrito"
            respuesta_api.estado_peticion="404"
            respuesta_api.estado_sesion=false
            res.writeHead(200,{"Content-Type":"application/json"})
            res.write(JSON.stringify(respuesta_api))
            res.end()
        }
    }
    else{
        respuesta_api.mensaje="este usuario ->"+usuario+" no exite en la base de datos"
        respuesta_api.estado_peticion="404"
        respuesta_api.estado_sesion=false
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
})

router.get("/verificar-sesion:token",(req,res)=>{
    var token=req.params.token
    ServisWebToken.decodificarToken(token)
    .then(respuesta=>{
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta))
        res.end()
    })
    .catch(error=>{
        if(error.estatu===404){
            es.writeHead(200,{"Content-Type":"application/json"})
            res.write(JSON.stringify(error))
            res.end()
        }
        else{
            es.writeHead(500,{"Content-Type":"application/json"})
            res.write(JSON.stringify(error))
            res.end()
        }
    })
})

module.exports = router