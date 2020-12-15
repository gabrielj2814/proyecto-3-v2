const moment =require("moment"),
jwt=require("jwt-simple"),
config=require("../config")

const ServisWebToken={}

ServisWebToken.crearToken=(id_cedula,usuario,id_perfil)=>{
    const payload={
        id_cedula:id_cedula,
        nombre_usuario:usuario,
        id_perfil:id_perfil,
        fecha_creacion:moment().unix(),
        fecha_vencimiento:moment().add(14,'days').unix()
    }
    const token=jwt.encode(payload,config.CLAVE_TOKEN)
    return token
}

ServisWebToken.decodificarToken=(token)=>{
    const decodificado=new Promise((resolve,reject)=>{
        try{
            const token_decodificado=jwt.decode(token,config.CLAVE_TOKEN)
            if(token.fecha_vencimiento <= moment().unix()){
                reject({
                    estatu:401,
                    mensaje:"el token a expirado"
                })
            }
            resolve({
                usuario:{
                    id_cedula:token_decodificado.id_cedula,
                    nombre_usuario:token_decodificado.nombre_usuario,
                    id_perfil:token_decodificado.id_perfil,
                }
            })
        }
        catch (error){
            reject({
                estatu:500,
                mensaje:"token invalido"
            })
        }
    })
    return decodificado
}

module.exports = ServisWebToken