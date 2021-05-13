const DriverPostgre=require("../modelo/driver_postgresql"),
ServisWebToken=require('../servicios'),
Moment=require("moment")

const VitacoraControlador={}

VitacoraControlador.json=(respuesta_api,token,operacion,tabla,aquien) => {
    return {
        respuesta_api:respuesta_api,
        token:token,
        operacion:operacion,
        tabla:tabla,
        aquien:aquien
    }
}

VitacoraControlador.capturaDatos=async (req,res) => {
    const {vitacora} = req
    const token_decodificado= await VitacoraControlador.decodificarToken(vitacora.token)
    const SQL=VitacoraControlador.crearSql(vitacora.tabla,vitacora.operacion,vitacora.aquien,token_decodificado.id_cedula)
    const postgreSql=new DriverPostgre()
    postgreSql.query(SQL)
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(vitacora.respuesta_api))
    res.end()
}

VitacoraControlador.decodificarToken=async (token) => {
    var token_decodificado=""
    await ServisWebToken.decodificarToken(token)
    .then(respuesta => {
        token_decodificado=respuesta.usuario
    })
    // .catch(error=> {
        
    // })
    return token_decodificado
}

VitacoraControlador.crearSql=(tabla,operacion,aquien,id_cedula)=> {
    const fecha_operacion=Moment().format("YYYY-MM-DD")
    const SQL=`INSERT INTO tvitacora(id_cedula,operacion,tabla,fecha_operacion,aquien) VALUES('${id_cedula}','${operacion}','${tabla}','${fecha_operacion}','${aquien}')`
    return SQL
}

VitacoraControlador.consultarRegistros= async (req,res) => {
    let respuesta_api={vitacora:[],mensaje:"",estado_peticion:""}
    const VitacoraModelo=require("../modelo/m_bitacora")
    const vitacora_modelo=new VitacoraModelo()
    const {vitacora}= req.body
    let lista_sql=[]
    let lista_vitacora=[]
    let SQL=`SELECT * FROM tvitacora,ttrabajador WHERE tvitacora.id_cedula=ttrabajador.id_cedula AND (fecha_operacion BETWEEN '${vitacora.fecha_desde}' AND '${vitacora.fecha_desde}')`
    if(vitacora["id_cedula"] && vitacora["id_cedula"].length==8){
        SQL+=` AND (tvitacora.id_cedula='${vitacora.id_cedula}')`
    }
    if(vitacora["tablas"]){
        let contador=0
        while(contador<vitacora.tablas.length){
            let lista_operaciones=vitacora.operaciones.map(operacion=> {
                return `tvitacora.operacion='${operacion}'`
            })
            const sql_completo=`${SQL} AND (tvitacora.tabla='${vitacora.tablas[contador]}') AND (${lista_operaciones.join(" OR ")}) ;`
            lista_sql.push(sql_completo)
            contador++
        }
        let contador2=0
        while(contador2<lista_sql.length){
            const repuesta=await vitacora_modelo.consultaSql(lista_sql[contador2])
            if(VitacoraControlador.verificarExistecnia(repuesta)){
                lista_vitacora.push(repuesta.rows)
            }
            contador2++
        }
        if(lista_vitacora.length>0){
            respuesta_api.vitacora=lista_vitacora
            respuesta_api.mensaje="consulta completada"
            respuesta_api.estado_peticion="200"
        }
        else{
            respuesta_api.mensaje=`al consultar , ningun trabajador a realizado operaciones en los modulos consultados -> ${vitacora.tablas.join(", ")}`
            respuesta_api.estado_peticion="404"
        }
    }
    else{
        const respuesta=await vitacora_modelo.consultaSql(SQL)
        if(VitacoraControlador.verificarExistecnia(respuesta)){
            respuesta_api.vitacora=respuesta.rows
            respuesta_api.mensaje="consulta completada"
            respuesta_api.estado_peticion="200"
            
        }
        else{
            respuesta_api.mensaje="al consultar , no hay registros en la bitacora"
            respuesta_api.estado_peticion="404"
        }
    }
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write(JSON.stringify(respuesta_api))
    res.end()
}

VitacoraControlador.verificarExistecnia=(result) => {
    return result.rows.length>0
}


module.exports = VitacoraControlador