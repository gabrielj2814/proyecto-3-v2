const DriverPostgre=require("./driver_postgresql")

class ReposoModelo extends DriverPostgre {

    constructor(){
        super()
        this.id_reposo="" //-- repo-121
        this.nombre_reposo=""
        this.estatu_reposo=""
    }

    setDatos(reposos){
        this.id_reposo=reposos.id_reposo
        this.nombre_reposo=reposos.nombre_reposo
        this.estatu_reposo=reposos.estatu_reposo
    }

    setId(id){
        this.id_reposo=id
    }

    async consultarTodosModelo(){
        const SQL="SELECT * FROM treposo;"
        return await this.query(SQL)
    }

    async consultarModelo(){
        const SQL=`SELECT * FROM treposo WHERE id_reposo='${this.id_reposo}';`
        return await this.query(SQL)
    }

    async consultarActivoModelo(){
        const SQL=`SELECT * FROM treposo WHERE id_reposo='${this.id_reposo}' AND estatu_reposo='1';`
        return await this.query(SQL)
    }

    registrarModelo(){
        const SQL=`INSERT INTO treposo(id_reposo,nombre_reposo,estatu_reposo) VALUES('${this.id_reposo}','${this.nombre_reposo}','${this.estatu_reposo}');`
        this.query(SQL)
    }

    actualizarModelo(){
        const SQL=`UPDATE treposo SET nombre_reposo='${this.nombre_reposo}',estatu_reposo='${this.estatu_reposo}' WHERE id_reposo='${this.id_reposo}';`
        this.query(SQL)
    }

    async consultarReposoXPatron(patron){
        const SQL=`SELECT * FROM treposo WHERE id_reposo LIKE '%${patron}%' OR nombre_reposo LIKE '%${patron}%';`
        return await this.query(SQL)
    }

}

module.exports = ReposoModelo