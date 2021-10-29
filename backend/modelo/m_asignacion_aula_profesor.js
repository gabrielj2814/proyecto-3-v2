const DriverPostgreSQL = require("./driver_postgresql");

class ModeloAsignacionAulaProfesor extends DriverPostgreSQL{

    constructor(){
        super()
        this.id_asignacion_aula_profesor=""
        this.id_profesor=""
        this.id_aula=""
        this.id_ano_escolar=""
        this.estatus_asignacion_aula_profesor=""
    }

    setDatos(AsignacionAulaProfesor){
        this.id_asignacion_aula_profesor=AsignacionAulaProfesor.id_asignacion_aula_profesor
        this.id_profesor=AsignacionAulaProfesor.id_profesor
        this.id_aula=AsignacionAulaProfesor.id_aula
        this.id_ano_escolar=AsignacionAulaProfesor.id_ano_escolar
        this.estatus_asignacion_aula_profesor=AsignacionAulaProfesor.estatus_asignacion_aula_profesor
    }

    setdatoIdAsignacionAulaProfesor(id){
        this.id_asignacion_aula_profesor=id
    }

    setdatoIdProfesor(id){
        this.id_profesor=id
    }
    
    setdatoIdAula(id){
        this.id_aula=id
    }
    
    setdatoIdAnoEscolar(id){
        this.id_ano_escolar=id
    }

    async registrar(){
        const SQL=`INSERT INTO tasignacion_aula_profesor(
            id_profesor,
            id_aula,
            id_ano_escolar,
            estatus_asignacion_aula_profesor
        ) VALUES(
            ${this.id_profesor},
            ${this.id_aula},
            ${this.id_ano_escolar},
            '${this.estatus_asignacion_aula_profesor}',
        ) RETURNING id_asignacion_aula_profesor;`
        return await this.query(SQL)
    }

    async consultar(){
        const SQL=`SELECT * FROM tasignacion_aula_profesor,tprofesor,taula,tano_escolar WHERE
        tasignacion_aula_profesor.id_asignacion_aula_profesor=${this.id_asignacion_aula_profesor} AND
        tprofesor.id_profesor=tasignacion_aula_profesor.id_profesor AND
        taula.id_aula=tasignacion_aula_profesor.id_aula AND
        tano_escolar.id_ano_escolar=tasignacion_aula_profesor.id_ano_escolar;`
        return await this.query(SQL)
    }
    
    async consultarTodos(){
        const SQL=`SELECT * FROM tasignacion_aula_profesor,tprofesor,taula,tano_escolar WHERE
        tprofesor.id_profesor=tasignacion_aula_profesor.id_profesor AND
        taula.id_aula=tasignacion_aula_profesor.id_aula AND
        tano_escolar.id_ano_escolar=tasignacion_aula_profesor.id_ano_escolar;`
        return await this.query(SQL)
    }
    
    async consultarTodosPorAnoEscolar(){
        const SQL=`SELECT * FROM tasignacion_aula_profesor,tprofesor,taula,tano_escolar WHERE
        tasignacion_aula_profesor.id_aula=${this.id_ano_escolar} AND
        tprofesor.id_profesor=tasignacion_aula_profesor.id_profesor AND
        taula.id_aula=tasignacion_aula_profesor.id_aula AND
        tano_escolar.id_ano_escolar=tasignacion_aula_profesor.id_ano_escolar;`
        return await this.query(SQL)
    }

    async actualizar(){
        const SQL=`UPDATE tasignacion_aula_profesor SET
        id_profesor=${this.id_profesor},
        id_aula=${this.id_aula},
        id_ano_escolar=${this.id_ano_escolar},
        estatus_asignacion_aula_profesor='${this.estatus_asignacion_aula_profesor}'
        WHERE 
        id_asignacion_aula_profesor=${this.id_asignacion_aula_profesor}
        `
        return await this.query(SQL)
    }

    






}