const DriverPostgreSQL = require("./driver_postgresql");
const ModuloAnoEscolar = require("./m_ano_escolar");

class ModeloVacuna extends DriverPostgreSQL{

    constructor(){
        super();
        this.id_vacuna="";
        this.nombre_vacuna="";
        this.estaus_vacuna="";
    }

    setDatos(vacuna){
        this.id_vacuna=vacuna.id_vacuna;
        this.nombre_vacuna=vacuna.nombre_vacuna;
        this.estaus_vacuna=vacuna.estaus_vacuna;
    }

    setIdVacuna(id){
        this.id_vacuna=id;
    }

    async registrar(){
        const SQL=`INSERT INTO tlista_vacuna(
            nombre_vacuna,
            estaus_vacuna
        ) VALUES(
            '${this.nombre_vacuna}',
            '${this.estaus_vacuna}'
        ) RETURNING id_vacuna;`
        return await this.query(SQL)
    }

    async consultar(){
        const SQL=`SELECT * FROM tlista_vacuna WHERE id_vacuna=${this.id_vacuna};`
        return await this.query(SQL)
    }
    
    async consultarTodos(){
        const SQL=`SELECT * FROM tlista_vacuna;`
        return await this.query(SQL)
    }

    async actualizar(){
        const SQL=`UPDATE SET nombre_vacuna='${this.nombre_vacuna}',estaus_vacuna='${this.estaus_vacuna}' WHERE  id_vacuna=${this.id_vacuna};`
        return await this.query(SQL)
    }

    async consultarVacunaPorPatron(patron){
        const SQL=`SELECT * FROM tlista_vacuna WHERE nombre_vacuna LIKE S'%{this.nombre_vacuna}%';`
        return await this.query(SQL)
    }

}

module.exports = ModeloVacuna