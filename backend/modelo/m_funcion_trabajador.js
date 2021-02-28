const DriverPostgre=require("./driver_postgresql.js")

class FuncionTrabajadorModelo extends DriverPostgre{

    constructor(){
        super()
        this.id_funcion_trabajador=""
        this.funcion_descripcion=""
        this.id_tipo_trabajador=""
        this.estatu_funcion_trabajador=""
        this.id_horario=""
    }

    set_datosModelo(funcion){
        this.id_funcion_trabajador=funcion.id_funcion_trabajador
        this.funcion_descripcion=funcion.funcion_descripcion
        this.id_tipo_trabajador=funcion.id_tipo_trabajador
        this.estatu_funcion_trabajador=funcion.estatu_funcion_trabajador
        this.id_horario=funcion.id_horario
    }

    set_datoIdFuncionTrabajador(id){
        this.id_funcion_trabajador=id
    }

    set_datoIdTipoTrabajador(id){
        this.id_tipo_trabajador=id
    }

    registrarModelo(){
        const SQL=`INSERT INTO tfunciontrabajador(id_funcion_trabajador,funcion_descripcion,id_tipo_trabajador,estatu_funcion_trabajador,id_horario) VALUES('${this.id_funcion_trabajador}','${this.funcion_descripcion}','${this.id_tipo_trabajador}','${this.estatu_funcion_trabajador}',${this.id_horario})`
        //console.log(SQL)
        this.query(SQL)
    }

    actualizarModelo(){
        const SQL=`UPDATE tfunciontrabajador SET funcion_descripcion='${this.funcion_descripcion}',id_tipo_trabajador='${this.id_tipo_trabajador}',estatu_funcion_trabajador='${this.estatu_funcion_trabajador}',id_horario=${this.id_horario} WHERE id_funcion_trabajador='${this.id_funcion_trabajador}';`
        //console.log(SQL)
        this.query(SQL)
    }

    async consultarModelo(){
        const SQL=`SELECT * FROM tfunciontrabajador,ttipotrabajador,thorario WHERE tfunciontrabajador.id_funcion_trabajador='${this.id_funcion_trabajador}' AND tfunciontrabajador.id_tipo_trabajador=ttipotrabajador.id_tipo_trabajador AND tfunciontrabajador.id_horario=thorario.id_horario;`
        //console.log(SQL)
        return await this.query(SQL)
    }

    async consultarTodosModelo(){
        const SQL=`SELECT * FROM tfunciontrabajador;`
        //console.log(SQL)
        return await this.query(SQL)
    }

    async consultarFuncionXIdTipoTrabajadorModelo(){
        const SQL=`SELECT * FROM tfunciontrabajador WHERE id_tipo_trabajador='${this.id_tipo_trabajador}';`
        //console.log(SQL)
        return await this.query(SQL)
    }

    async consultarPatronModelo(patron){
        const SQL=`SELECT * FROM tfunciontrabajador WHERE (id_funcion_trabajador LIKE '%${patron}%') OR (funcion_descripcion LIKE '%${patron}%');`
        //console.log(SQL)
        return await this.query(SQL)
    }

}

module.exports = FuncionTrabajadorModelo