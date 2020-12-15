const DriverPostgre=require("./driver_postgresql")

class AsignacionMedicoEspecialidadModelo extends DriverPostgre {

    constructor(){// ams -> asignacion medico especialidad ams-2020-05-02-1
        super()
        this.id_asignacion_medico_especialidad="" //ams-año-mes-dia-numero registro
        this.id_medico=""
        this.id_especialidad=""
    }

    setDatos(medico_especialidad){
        this.id_asignacion_medico_especialidad=medico_especialidad.id_asignacion_medico_especialidad
        this.id_medico=medico_especialidad.id_medico
        this.id_especialidad=medico_especialidad.id_especialidad
    }

    setIdAsignacionMedicoEspecialidad(id){
        this.id_asignacion_medico_especialidad=id
    }

    async consultarTodosModelo(){
        const SQL="SELECT * FROM tasignacionmedicoespecialidad,tmedico,tespecialidad WHERE tasignacionmedicoespecialidad.id_medico=tmedico.id_medico AND tasignacionmedicoespecialidad.id_especialidad=tespecialidad.id_especialidad ;"
        return await this.query(SQL)
    }

    async consultarTodosXPatronModelo(patron){
        const SQL=`SELECT * FROM tasignacionmedicoespecialidad WHERE id_asignacion_medico_especialidad LIKE '%${patron}%';`
        return await this.query(SQL)
    }

    async consultarModelo(){
        const SQL=`SELECT * FROM tasignacionmedicoespecialidad,tmedico,tespecialidad WHERE tasignacionmedicoespecialidad.id_asignacion_medico_especialidad='${this.id_asignacion_medico_especialidad}' AND tasignacionmedicoespecialidad.id_medico=tmedico.id_medico AND tasignacionmedicoespecialidad.id_especialidad=tespecialidad.id_especialidad;`
        return await this.query(SQL)
    }

    async consultarMedicoYEspecialidadModelo(){
        const SQL=`SELECT * FROM tasignacionmedicoespecialidad,tmedico,tespecialidad WHERE tasignacionmedicoespecialidad.id_medico='${this.id_medico}' AND tasignacionmedicoespecialidad.id_especialidad='${this.id_especialidad}' AND tasignacionmedicoespecialidad.id_medico=tmedico.id_medico AND tasignacionmedicoespecialidad.id_especialidad=tespecialidad.id_especialidad;`
        return await this.query(SQL)
    }

    registrarModelo(){
        const SQL=`INSERT INTO tasignacionmedicoespecialidad(id_asignacion_medico_especialidad,id_medico,id_especialidad) VALUES('${this.id_asignacion_medico_especialidad}','${this.id_medico}',${this.id_especialidad});`
        this.query(SQL)
    }
    
    actualizarModelo(){
        const SQL=`UPDATE tasignacionmedicoespecialidad SET id_medico='${this.id_medico}',id_especialidad=${this.id_especialidad} WHERE id_asignacion_medico_especialidad='${this.id_asignacion_medico_especialidad}';`
        this.query(SQL)
    }
}

module.exports = AsignacionMedicoEspecialidadModelo