const express=require("express"),
router=express.Router(),
bodyParser=require("body-parser"),
//controladores
PerfilControlador=require("../../../controlador/c_perfil"),
ModuloControlador=require("../../..//controlador/c_modulo");
//USE
router.use(bodyParser.json())

router.get("/",(req,res)=>{
    res.end(`
        <h1> inicio acceso</h1>
    `)
})

router.get("/generar-id-perfil",async (req,res)=>{
    const PERFIL=new PerfilControlador(),
    id=await PERFIL.generarIdPerfil()
    string_json=JSON.stringify(id)
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(string_json)
    res.end() 
})


router.post("/registrar",async (req,res)=>{
    const {perfil,modulos}=req.body,
    PERFIL=new PerfilControlador()
    var respuesta_api={mensaje:"registro completado con exito",estado_peticion:"200"}
    const perfil_consulta=await PERFIL.consultarPerfilControlador(perfil.id_perfil);
    if(perfil_consulta.rows.length===0){
        PERFIL.registrarControlador(perfil)
        var veces=0
        while(veces<modulos.length){
            const MODULO=new ModuloControlador()
            MODULO.registrarControlador(modulos[veces],perfil.id_perfil)
            veces+=1
        }
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end() 
    }
    else{
        respuesta_api.estado_peticion="404"
        respuesta_api.mensaje="el perfil consultado no exite en la base de datos"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
})

router.get("/consultar/:id",async (req,res)=>{
    const PERFIL=new PerfilControlador(),
    {id}=req.params
    var respuesta_api={perfil:"",modulos:"",mensaje:"",estado_peticion:""}
    const perfil=await PERFIL.consultarPerfilControlador(id);
    if(perfil.rows.length!==0){
        respuesta_api.perfil=perfil.rows[0]
        //console.log(`el perfil con el id -> ${id} existe`)
        const MODULO=new ModuloControlador(),
        modulos=await MODULO.consultarModuloXIdPerfilControlador(respuesta_api.perfil.id_perfil)
        respuesta_api.modulos=modulos.rows
        respuesta_api.estado_peticion="200"
        respuesta_api.mensaje="consulta completada"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.estado_peticion="404"
        respuesta_api.mensaje="el perfil consultado no exite en la base de datos"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
})

router.get("/consultar-perfiles-patron/:patron",async (req,res)=>{
    const patron=req.params.patron,
    PERFIL=new PerfilControlador()
    var respuesta_api={perfiles:[],mensaje:"perfiles encontrados",estado_peticion:"200"}
    const perfiles=await PERFIL.consultarPerfilXPatronControlador(patron)
    respuesta_api.perfiles=perfiles.rows
    res.writeHead(200,{"Contetn-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()

})

router.get("/consultar-perfiles",async (req,res)=>{
    const PERFIL=new PerfilControlador(),
    perfiles=await PERFIL.consultarPerfilesControlador()
    var respuesta_api={perfiles:[],modulos:"",mensaje:"perfiles encontrados",estado_peticion:"200"}
    if(perfiles.rows.length!==0){
        respuesta_api.perfiles=perfiles.rows
        res.writeHead(200,{"Contetn-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.estado_peticion="404"
        respuesta_api.mensaje="error: elemento no encontrado"
        res.writeHead(404,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }

})

router.put("/actualizar/:id",async (req,res)=>{
    const PERFIL=new PerfilControlador(),
    {perfil,modulos}=req.body
    var respuesta_api={perfiles:[],modulos:"",mensaje:"El perfil a sido actualizado con exito",estado_peticion:"200"}
    const perfil_consulta=await PERFIL.consultarPerfilControlador(perfil.id_perfil);
    if(perfil_consulta.rows.length===1){
        PERFIL.actualizarPerfilControlador(perfil)
        var veces=0;
        while(veces<modulos.length){
            modulo=modulos[veces]
            if(modulos[veces].id_modulo){
                const MODULO=new ModuloControlador()
                MODULO.actualizarControlador(modulo)
            }
            else{
                const MODULO=new ModuloControlador()
                MODULO.registrarControlador(modulos[veces],perfil.id_perfil)
            }
            veces+=1
        }
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
    else{
        respuesta_api.estado_peticion="404"
        respuesta_api.mensaje="el perfil consultado no exite en la base de datos"
        res.writeHead(200,{"Content-Type":"application/json"})
        res.write(JSON.stringify(respuesta_api))
        res.end()
    }
})

module.exports = router