const DriverPostgre=require("./driver_postgresql")

class EstadoModelo extends DriverPostgre{

    constructor(){
        super()
        this.id_estado=""
        this.nombre_estado=""
        this.estatu_estado=""
    }

    setIdEstado(id){
        this.id_estado=id
    }

    setDatos(estado){
        this.id_estado=estado.id_estado
        this.nombre_estado=estado.nombre_estado
        this.estatu_estado=estado.estatu_estado
    }

    async consultarTodosModelo(){
        const SQL="SELECT * FROM testado;"
        return await this.query(SQL)
    }

    async consultarModelo(){
        const SQL=`SELECT * FROM testado WHERE id_estado='${this.id_estado}';`
        //console.log(SQL)
        return await this.query(SQL)
    }

    registrarModelo(){
        const SQL=`INSERT INTO testado(id_estado,nombre_estado,estatu_estado) VALUES('${this.id_estado}','${this.nombre_estado}','${this.estatu_estado}');`
        //console.log(SQL)
        this.query(SQL)
    }

    actualizarModelo(){
        const SQL=`UPDATE testado SET nombre_estado='${this.nombre_estado}',estatu_estado='${this.estatu_estado}' WHERE id_estado='${this.id_estado}';`
        //console.log(SQL)
        this.query(SQL)
    }

    async consultarEstadoPatronModelo(patron){
        const SQL=`SELECT * FROM testado WHERE id_estado LIKE '%${patron}%' OR nombre_estado LIKE '%${patron}%';`
        console.log(SQL)
        return await this.query(SQL)
    }

}

module.exports = EstadoModelo