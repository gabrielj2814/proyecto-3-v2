const DriverPostgreSQL = require("./driver_postgresql");

class ModeloAsignacionAulaProfesorEspecialista extends DriverPostgreSQL{

    constructor(){
        super()
        this.id_asignacion_aula_profesor_especialista=""
        this.id_especialista=""
        this.id_asignacion_aula_profesor=""
    }

    setDatos(AsignacionAulaProfesorEspecialista){
        this.id_asignacion_aula_profesor_especialista=AsignacionAulaProfesorEspecialista.id_asignacion_aula_profesor_especialista
        this.id_especialista=AsignacionAulaProfesorEspecialista.id_especialista
        this.id_asignacion_aula_profesor=AsignacionAulaProfesorEspecialista.id_asignacion_aula_profesor
    }

    setIdAsignacionAulaProfesor(id){
        this.id_asignacion_aula_profesor=id
    }

    async registrar(){
        const SQL=`INSERT INTO tasignacion_aula_profesor_especialista(
            id_especialista,
            id_asignacion_aula_profesor
        ) VALUES(
            ${this.id_especialista},
            ${this.id_asignacion_aula_profesor}
        ) RETURNING id_asignacion_aula_profesor_especialista;`
        return await this.query(SQL)
    }
    
    async eliminarPorAsignacionAulaProfesor(){
        const SQL=`DELETE FROM tasignacion_aula_profesor_especialista WHERE id_asignacion_aula_profesor=${this.id_asignacion_aula_profesor}`
        return await this.query(SQL)
    }

    async consultarPorAsignacionAulaProfesor(){
        const SQL=`SELECT * FROM tasignacion_aula_profesor_especialista WHERE id_asignacion_aula_profesor=${this.id_asignacion_aula_profesor}`
        return await this.query(SQL)
    }




}

module.exports= ModeloAsignacionAulaProfesorEspecialista
