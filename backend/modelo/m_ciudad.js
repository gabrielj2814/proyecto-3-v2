const DriverPostgre=require("./driver_postgresql")

class CiudadModelo extends DriverPostgre{

    constructor(){
        super()
        this.id_ciudad=""
        this.nombre_ciudad=""
        this.id_estado=""
        this.estatu_ciudad=""
    }

    setIdCiudad(id){
        this.id_ciudad=id
    }

    setDatos(ciudad){
        this.id_ciudad=ciudad.id_ciudad
        this.nombre_ciudad=ciudad.nombre_ciudad
        this.id_estado=ciudad.id_estado
        this.estatu_ciudad=ciudad.estatu_ciudad
    }

    async consultarTodosModelo(){
        const SQL="SELECT * FROM tciudad;"
        return await this.query(SQL)
    }

    async consultarModelo(){
        const SQL=`SELECT * FROM tciudad WHERE id_ciudad='${this.id_ciudad}'`
        //console.log(SQL)
        return await this.query(SQL)
    }

    registrarModelo(){
        const SQL=`INSERT INTO tciudad(id_ciudad,nombre_ciudad,id_estado,estatu_ciudad) VALUES('${this.id_ciudad}','${this.nombre_ciudad}','${this.id_estado}','${this.estatu_ciudad}');`
        //console.log(SQL)
        this.query(SQL)
    }

    actualizarModelo(){
        const SQL=`UPDATE tciudad SET nombre_ciudad='${this.nombre_ciudad}',id_estado='${this.id_estado}',estatu_ciudad='${this.estatu_ciudad}' WHERE id_ciudad='${this.id_ciudad}';`
        //console.log(SQL)
        this.query(SQL)
    }

    async consultarCiudadPatronModelo(patron){
        const SQL=`SELECT * FROM tciudad WHERE id_ciudad LIKE '%${patron}%' OR nombre_ciudad LIKE '%${patron}%';`
        // console.log(SQL)
        return await this.query(SQL)
    }

    async consultarCiudadXEstadoModelo(estado){
        const SQL=`SELECT * FROM tciudad WHERE id_estado='${estado}'`
        //console.log(SQL)
        return await this.query(SQL)
    }

}

module.exports = CiudadModelo