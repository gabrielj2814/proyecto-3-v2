const DriverPostgreSQL = require("./driver_postgresql");

class ModeloAsignacionAulaProfesor extends DriverPostgreSQL{

    constructor(){
        super()
        this.id_asignacion_aula_profesor=""
        this.id_profesor=""
        this.id_aula=""
        this.id_ano_escolar=""
        this.estatus_asignacion_aula_profesor=""
        this.numero_total_de_estudiantes=""
        this.id_especialista=""
        this.id_aula_espacio=""
    }

    setDatos(AsignacionAulaProfesor){
        this.id_asignacion_aula_profesor=AsignacionAulaProfesor.id_asignacion_aula_profesor
        this.id_profesor=AsignacionAulaProfesor.id_profesor
        this.id_aula=AsignacionAulaProfesor.id_aula
        this.id_ano_escolar=AsignacionAulaProfesor.id_ano_escolar
        this.estatus_asignacion_aula_profesor=AsignacionAulaProfesor.estatus_asignacion_aula_profesor
        this.numero_total_de_estudiantes=AsignacionAulaProfesor.numero_total_de_estudiantes
        this.id_especialista=AsignacionAulaProfesor.id_especialista
        this.id_aula_espacio=AsignacionAulaProfesor.id_aula_espacio
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
            numero_total_de_estudiantes,
            estatus_asignacion_aula_profesor,
            id_especialista,
            id_aula_espacio
        ) VALUES(
            ${this.id_profesor},
            ${this.id_aula},
            ${this.id_ano_escolar},
            ${this.numero_total_de_estudiantes},
            '1',
            ${this.id_especialista},
            ${this.id_aula_espacio}
        ) RETURNING id_asignacion_aula_profesor;`
        return await this.query(SQL)
    }

    async consultar(){
        const SQL=`SELECT * FROM tasignacion_aula_profesor,tprofesor,tgrado,taula,tano_escolar WHERE
        tasignacion_aula_profesor.id_asignacion_aula_profesor=${this.id_asignacion_aula_profesor} AND
        tprofesor.id_profesor=tasignacion_aula_profesor.id_profesor AND
        tgrado.id_grado=taula.id_grado AND
        taula.id_aula=tasignacion_aula_profesor.id_aula AND
        tano_escolar.id_ano_escolar=tasignacion_aula_profesor.id_ano_escolar;`
        return await this.query(SQL)
    }

    async consultarTodos(){
        const SQL=`SELECT * FROM tasignacion_aula_profesor,tprofesor,tgrado,taula,tano_escolar,ttrabajador WHERE
        tprofesor.id_profesor=tasignacion_aula_profesor.id_profesor AND
        tgrado.id_grado=taula.id_grado AND
        taula.id_aula=tasignacion_aula_profesor.id_aula AND
        tano_escolar.id_ano_escolar=tasignacion_aula_profesor.id_ano_escolar AND
        tprofesor.id_cedula=ttrabajador.id_cedula
        ;`
        return await this.query(SQL)
    }

    async consultarTodosPorAnoEscolar(){
        const SQL=`SELECT * FROM tasignacion_aula_profesor,tprofesor,tgrado,taula,tano_escolar,ttrabajador WHERE
        tasignacion_aula_profesor.id_ano_escolar=${this.id_ano_escolar} AND
        tprofesor.id_profesor=tasignacion_aula_profesor.id_profesor AND
        tgrado.id_grado=taula.id_grado AND
        taula.id_aula=tasignacion_aula_profesor.id_aula AND
        tano_escolar.id_ano_escolar=tasignacion_aula_profesor.id_ano_escolar AND
        tprofesor.id_cedula=ttrabajador.id_cedula
        ;`
        return await this.query(SQL)
    }

    async consultarProfesor(){
        const SQL=`SELECT * FROM tasignacion_aula_profesor,tprofesor,taula,tano_escolar WHERE
        tasignacion_aula_profesor.id_profesor=${this.id_profesor} AND
        tprofesor.id_profesor=tasignacion_aula_profesor.id_profesor AND
        taula.id_aula=tasignacion_aula_profesor.id_aula AND
        tano_escolar.id_ano_escolar=tasignacion_aula_profesor.id_ano_escolar;`
        return await this.query(SQL)
    }

    async consultarProProfesorAnoEscolarYAula(){
        const SQL=`SELECT * FROM tasignacion_aula_profesor,tprofesor,taula,tano_escolar WHERE
        tasignacion_aula_profesor.id_profesor=${this.id_profesor} AND
        tasignacion_aula_profesor.id_ano_escolar=${this.id_ano_escolar} AND
        tasignacion_aula_profesor.id_aula=${this.id_aula} AND
        tprofesor.id_profesor=tasignacion_aula_profesor.id_profesor AND
        taula.id_aula=tasignacion_aula_profesor.id_aula AND
        tano_escolar.id_ano_escolar=tasignacion_aula_profesor.id_ano_escolar;`
        return await this.query(SQL)
    }

    async consultarProfesorPorAnoYAula(){
        const SQL=`SELECT * FROM tasignacion_aula_profesor,tprofesor,taula,tano_escolar WHERE
        tasignacion_aula_profesor.id_ano_escolar=${this.id_ano_escolar} AND
        tasignacion_aula_profesor.id_aula=${this.id_aula} AND
        tprofesor.id_profesor=tasignacion_aula_profesor.id_profesor AND
        taula.id_aula=tasignacion_aula_profesor.id_aula AND
        tano_escolar.id_ano_escolar=tasignacion_aula_profesor.id_ano_escolar;`
        return await this.query(SQL)
    }

    async consultarProfesorPorAnoYAulaEspacio(idAnnoEscolar,idAulaEspacio){
        const SQL=`SELECT * FROM tasignacion_aula_profesor WHERE
        id_ano_escolar=${idAnnoEscolar} AND
        id_aula_espacio=${idAulaEspacio};`
        return await this.query(SQL)
    }

    async consultarDisponibilidadProfesor(){
        const SQL=`SELECT * FROM tasignacion_aula_profesor,tprofesor,taula,tano_escolar WHERE
        tasignacion_aula_profesor.id_profesor=${this.id_profesor} AND
        tasignacion_aula_profesor.id_ano_escolar=${this.id_ano_escolar} AND
        tprofesor.id_profesor=tasignacion_aula_profesor.id_profesor AND
        taula.id_aula=tasignacion_aula_profesor.id_aula AND
        tano_escolar.id_ano_escolar=tasignacion_aula_profesor.id_ano_escolar;`
        return await this.query(SQL)
    }

    async consultarDisponibilidadAula(){
        const SQL=`SELECT * FROM tasignacion_aula_profesor,tprofesor,taula,tano_escolar WHERE
        tasignacion_aula_profesor.id_ano_escolar=${this.id_ano_escolar} AND
        tasignacion_aula_profesor.id_aula=${this.id_aula} AND
        tasignacion_aula_profesor.estatus_asignacion_aula_profesor='1' AND
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
        estatus_asignacion_aula_profesor='${this.estatus_asignacion_aula_profesor}',
        numero_total_de_estudiantes=${this.numero_total_de_estudiantes},
        id_especialista=${this.id_especialista},
        id_aula_espacio=${this.id_aula_espacio}
        WHERE
        id_asignacion_aula_profesor=${this.id_asignacion_aula_profesor}
        `
        return await this.query(SQL)
    }

    async consultarAsignacionActual(cedula){
        const SQL=`SELECT * FROM tasignacion_aula_profesor,tprofesor,ttrabajador,tgrado,taula,tano_escolar WHERE
        tprofesor.id_cedula='${cedula}' AND
        ttrabajador.id_cedula=tprofesor.id_cedula AND
        tasignacion_aula_profesor.id_profesor=tprofesor.id_profesor AND
        taula.id_aula=tasignacion_aula_profesor.id_aula AND
        tgrado.id_grado=taula.id_grado AND
        tano_escolar.id_ano_escolar=tasignacion_aula_profesor.id_ano_escolar AND
        tano_escolar.estatus_ano_escolar='1' AND
        tasignacion_aula_profesor.estatus_asignacion_aula_profesor='1'
        ;`
        return await this.query(SQL)
    }

}

module.exports= ModeloAsignacionAulaProfesor
