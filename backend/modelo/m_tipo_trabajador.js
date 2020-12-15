const DriverPostgre=require("./driver_postgresql")

class TipoTrabajadorModelo extends DriverPostgre{

    constructor(){
        super()
        this.id_tipo_trabajador=""
        this.descripcion_tipo_trabajador=""
        this.estatu_tipo_trabajador=""
    }

    set_datosModelo(tipo_trabajador){
        this.id_tipo_trabajador=tipo_trabajador.id_tipo_trabajador
        this.descripcion_tipo_trabajador=tipo_trabajador.descripcion_tipo_trabajador
        this.estatu_tipo_trabajador=tipo_trabajador.estatu_tipo_trabajador
    }

     set_idTipoTrabajador(id){
        this.id_tipo_trabajador=id
     }

    registrarModelo(){
        const SQL=`INSERT INTO ttipotrabajador(id_tipo_trabajador,descripcion_tipo_trabajador,estatu_tipo_trabajador) VALUES('${this.id_tipo_trabajador}','${this.descripcion_tipo_trabajador}','${this.estatu_tipo_trabajador}');`
        //console.log(SQL)
        this.query(SQL)
    }

    actualizarModelo(){
        const SQL=`UPDATE ttipotrabajador SET descripcion_tipo_trabajador='${this.descripcion_tipo_trabajador}',estatu_tipo_trabajador='${this.estatu_tipo_trabajador}' WHERE id_tipo_trabajador='${this.id_tipo_trabajador}';`
        //console.log(SQL)
        this.query(SQL)
    }

    async consultarTodos(){
        const SQL="SELECT * FROM ttipotrabajador;"
        //console.log(SQL)
        return await this.query(SQL)
    }

    async consultarModelo(){
        const SQL=`SELECT * FROM ttipotrabajador WHERE id_tipo_trabajador='${this.id_tipo_trabajador}';`
        //console.log(SQL)
        return await this.query(SQL)
    }

    async consultarTipoTrabajadorPatronModelo(patron){
        const SQL=`SELECT * FROM ttipotrabajador WHERE id_tipo_trabajador LIKE '%${patron}%' OR descripcion_tipo_trabajador LIKE '%${patron}%';`
        //console.log(SQL)
        return await this.query(SQL)
    }


}

module.exports = TipoTrabajadorModelo