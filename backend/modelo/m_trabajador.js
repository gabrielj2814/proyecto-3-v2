const DriverPostgre=require("./driver_postgresql")

class TrabajadorModelo extends DriverPostgre{

    constructor(){
        super()
        this.id_cedula=""
        this.nombres=""
        this.apellidos=""
        this.sexo_trabajador=""
        this.telefono_movil=""
        this.telefono_local=""
        this.correo=""
        this.direccion=""
        this.grado_instruccion=""
        this.titulo_grado_instruccion=""
        this.designacion=""
        this.fecha_nacimiento=""
        this.fecha_ingreso=""
        this.estatu_trabajador=""
        this.pregunta_1=""
        this.pregunta_2=""
        this.respuesta_1=""
        this.respuesta_2=""
        this.clave_trabajador=""
        this.estatu_cuenta=""
        this.id_perfil=""
        this.id_funcion_trabajador=""
    }

    set_datosRegistrarModelo(trabajador){
        this.id_cedula=trabajador.id_cedula
        this.nombres=trabajador.nombres
        this.apellidos=trabajador.apellidos
        this.sexo_trabajador=trabajador.sexo_trabajador
        this.telefono_movil=trabajador.telefono_movil
        this.telefono_local=trabajador.telefono_local
        this.correo=trabajador.correo
        this.direccion=trabajador.direccion
        this.grado_instruccion=trabajador.grado_instruccion
        this.titulo_grado_instruccion=trabajador.titulo_grado_instruccion
        this.designacion=trabajador.designacion
        this.fecha_nacimiento=trabajador.fecha_nacimiento
        this.fecha_ingreso=trabajador.fecha_ingreso
        this.estatu_trabajador=trabajador.estatu_trabajador
        this.id_perfil=trabajador.id_perfil
        this.id_funcion_trabajador=trabajador.id_funcion_trabajador
    }

    set_datoCuenta(trabajador){
        this.id_cedula=trabajador.id_cedula
        this.pregunta_1=trabajador.pregunta_1
        this.pregunta_2=trabajador.pregunta_2
        this.respuesta_1=trabajador.respuesta_1
        this.respuesta_2=trabajador.respuesta_2
        this.clave_trabajador=trabajador.clave_trabajador
        this.estatu_cuenta="1"
    }

    set_idCedula(id){
        this.id_cedula=id
    }

    registrarModelo(trabajador){
        const SQL=`INSERT INTO ttrabajador(id_cedula,nombres,apellidos,sexo_trabajador,telefono_movil,telefono_local,correo,direccion,grado_instruccion,titulo_grado_instruccion,designacion,fecha_nacimiento,fecha_ingreso,estatu_trabajador,id_perfil,id_funcion_trabajador,pregunta_1,pregunta_2,respuesta_1,respuesta_2,clave_trabajador,estatu_cuenta) VALUES('${this.id_cedula}','${this.nombres}','${this.apellidos}','${this.sexo_trabajador}','${this.telefono_movil}','${this.telefono_local}','${this.correo}','${this.direccion}','${this.grado_instruccion}','${this.titulo_grado_instruccion}','${this.designacion}','${this.fecha_nacimiento}','${this.fecha_ingreso}','${this.estatu_trabajador}','${this.id_perfil}','${this.id_funcion_trabajador}','no-tiene','no-tiene','no-tiene','no-tiene','no-tiene-clave','0')`
        //console.log(SQL)
        this.query(SQL)
    }

    async consultarModelo(){
        const SQL=`SELECT * FROM ttrabajador,ttipotrabajador,tfunciontrabajador,tperfil WHERE ttrabajador.id_cedula='${this.id_cedula}' AND ttrabajador.id_perfil=tperfil.id_perfil AND ttrabajador.id_funcion_trabajador=tfunciontrabajador.id_funcion_trabajador AND tfunciontrabajador.id_tipo_trabajador=ttipotrabajador.id_tipo_trabajador`
        //console.log(SQL)
        return await this.query(SQL)
    }

    async consultarActivoModelo(cedula){
        const SQL=`SELECT * FROM ttrabajador,ttipotrabajador,tfunciontrabajador,tperfil WHERE ttrabajador.id_cedula='${cedula}' AND ttrabajador.estatu_trabajador='1'  AND ttrabajador.id_perfil=tperfil.id_perfil AND ttrabajador.id_funcion_trabajador=tfunciontrabajador.id_funcion_trabajador AND tfunciontrabajador.id_tipo_trabajador=ttipotrabajador.id_tipo_trabajador`
        //console.log(SQL)
        return await this.query(SQL)
    }

    async consultarTodosActivoModelo(cedula){
        const SQL=`SELECT * FROM ttrabajador,ttipotrabajador,tfunciontrabajador,tperfil WHERE ttrabajador.estatu_trabajador='1'  AND ttrabajador.id_perfil=tperfil.id_perfil AND ttrabajador.id_funcion_trabajador=tfunciontrabajador.id_funcion_trabajador AND tfunciontrabajador.id_tipo_trabajador=ttipotrabajador.id_tipo_trabajador`
        //console.log(SQL)
        return await this.query(SQL)
    }

    async consultarTodosModelo(){
        const SQL=`SELECT * FROM ttrabajador`
        //console.log(SQL)
        return await this.query(SQL)
    }

    async consultarPatronModelo(patron){
        const SQL=`SELECT * FROM ttrabajador WHERE id_cedula LIKE '%${patron}%' OR nombres LIKE '%${patron}%' OR apellidos LIKE '%${patron}%'`
        //console.log(SQL)
        return await this.query(SQL)
    }


    actualizarModelo(){
        const SQL=`UPDATE ttrabajador SET nombres='${this.nombres}',apellidos='${this.apellidos}',sexo_trabajador='${this.sexo_trabajador}',telefono_movil='${this.telefono_movil}',telefono_local='${this.telefono_local}',correo='${this.correo}',direccion='${this.direccion}',grado_instruccion='${this.grado_instruccion}',titulo_grado_instruccion='${this.titulo_grado_instruccion}',designacion='${this.designacion}',fecha_nacimiento='${this.fecha_nacimiento}',fecha_ingreso='${this.fecha_ingreso}',estatu_trabajador='${this.estatu_trabajador}',id_perfil='${this.id_perfil}',id_funcion_trabajador='${this.id_funcion_trabajador}' WHERE id_cedula='${this.id_cedula}'`
        //console.log(SQL)
        this.query(SQL)
    }

    activarCuentaModelo(){
        const SQL=`UPDATE ttrabajador SET clave_trabajador='${this.clave_trabajador}',pregunta_1='${this.pregunta_1}',pregunta_2='${this.pregunta_2}',respuesta_1='${this.respuesta_1}',respuesta_2='${this.respuesta_2}',estatu_cuenta='${this.estatu_cuenta}' WHERE id_cedula='${this.id_cedula}'`
        //console.log(SQL)
        this.query(SQL)
    }

    async cambiarClaveModelo(id,claveNueva,respuesta1,respuesta2){
        const SQL=`UPDATE ttrabajador SET clave_trabajador='${claveNueva}' WHERE id_cedula='${id}' AND respuesta_1='${respuesta1}' AND respuesta_2='${respuesta2}'`
        return await this.query(SQL)
    }
    
}

module.exports = TrabajadorModelo