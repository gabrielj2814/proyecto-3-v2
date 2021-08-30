const DriverPostgresql=require("./driver_postgresql")

class ModeloAula extends DriverPostgresql{


    constructor(){
        super();
        this.id_aula=""
        this.id_grado=""
        this.nombre_aula=""
        this.estatus_aula=""
    }

    setDatos(aula){
        this.id_aula=aula.id_aula
        this.id_grado=aula.id_grado
        this.nombre_aula=aula.nombre_aula
        this.estatus_aula=aula.estatus_aula
    }

    setIdAula(id){
        this.id_aula=id
    }

    setIdGrado(id){
        this.id_grado=id
    }

    async registrar(){
        const SQL=`INSERT INTO taula(
                id_grado,
                nombre_aula,
                estatus_aula
            )
            VALUES(
                ${this.id_grado},
                '${this.nombre_aula}',
                '${this.estatus_aula}'
            ) RETURNIGN id_aula`
        return await this.query(SQL)
    }

    async consultarTodos(){
        const SQL=`SELECT * FROM tgrado,taula WHERE tgrado.id_grado=taula.id_grado`
        return await this.query(SQL)
    }

    async consultarEspecifico(){
        const SQL=`SELECT * FROM tgrado,taula WHERE taula.id_aula=${this.id_aula} AND tgrado.id_grado=taula.id_grado`
    }

    async actualizar(){
        const SQL=`UPDATE taula SET 
        id_grado=${this.id_grado},
        nombre_aula='${this.nombre_aula}',
        estatus_aula='${this.estatus_aula}'
        WHERE 
        id_aula=${this.id_aula}
        `
        return await this.query(SQL)
    }

    async consultarAulaPorGrado(grado){
        const SQL=`SELECT * FROM tgrado,taula WHERE tgrado.id_grado=${this.id_grado} AND  tgrado.id_grado=taula.id_grado`
        return await this.query(SQL)
    }

}

module.exports= ModeloAula