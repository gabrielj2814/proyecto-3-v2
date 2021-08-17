const DriverPostgre=require("./driver_postgresql")
const ModuloModelo = require("./m_modulo")

class ModeloGrado extends DriverPostgre{

    constructor(){
        super()
        this.id_grado=""
        this.numero_grado=""
        this.estatus_grado=""
    }

    setDatos(grado){
        this.id_grado=grado.id_grado
        this.numero_grado=grado.numero_grado
        this.estatus_grado=grado.estatus_grado
    }

    async registrar(){
        const SQL=`INSERT INTO tgrado(numero_grado,estatus_grado) VALUES('${this.numero_grado}','${this.estatus_grado}')`
        return await this.query(SQL)
    }

    async consultarTodos(){
        const SQL=`SELECT * FROM tgrado;`
        return await this.query(SQL)
    }




}

module.exports= ModeloGrado