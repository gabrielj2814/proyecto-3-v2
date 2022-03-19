const DriverPostgre=require("./driver_postgresql")
const Moment=require("moment")

class ModeloAsistenciaEstudiante extends DriverPostgre {

    constructor(){
        super()
        this.id_asistencia_estudiante=""
        this.id_inscripcion=""
        this.fecha_asistencia_estudiante=""
        this.estatus_asistencia_estudiante=""
        this.observacion_asistencia_estudiante=""
    }
    
    setIdAsistencia(id){
        this.id_asistencia_estudiante=id
    }
    
    setIdInscripcion(id){
        this.id_inscripcion=id
    }

    setDatos(datos){
        this.id_asistencia_estudiante=datos.id_asistencia_estudiante
        this.id_inscripcion=datos.id_inscripcion
        this.fecha_asistencia_estudiante=datos.fecha_asistencia_estudiante
        this.estatus_asistencia_estudiante=datos.estatus_asistencia_estudiante
        this.observacion_asistencia_estudiante=datos.observacion_asistencia_estudiante
    }

    async actualizarEstadoAsistencia(estado){
        const SQL=`UPDATE tasistencia_estudiante SET 
        estatus_asistencia_estudiante='${estado}'
        WHERE 
        id_asistencia_estudiante=${this.id_asistencia_estudiante}
        `
        return await this.query(SQL)
    }

    async actualizarObservacion(observacion){
        const SQL=`UPDATE tasistencia_estudiante SET 
        observacion_asistencia_estudiante='${observacion}'
        WHERE 
        id_asistencia_estudiante=${this.id_asistencia_estudiante}
        `
        return await this.query(SQL)
    }

    async registrarAsistencia(){
        // test insert INSERT INTO tasistencia_estudiante(id_inscripcion,fecha_asistencia_estudiante,estatus_asistencia_estudiante,observacion_asistencia_estudiante)VALUES(1,'2022/03/15','1','la puta que te pario') RETURNING id_asistencia_estudiante;
            
        const SQL=`INSERT INTO tasistencia_estudiante(
            id_inscripcion,
            fecha_asistencia_estudiante,
            estatus_asistencia_estudiante,
            observacion_asistencia_estudiante
            )
            VALUES(
                ${this.id_inscripcion},
                '${this.fecha_asistencia_estudiante}',
                '${this.estatus_asistencia_estudiante}',
                '${this.observacion_asistencia_estudiante}'
            ) RETURNING id_asistencia_estudiante;
            `
        return await this.query(SQL)
    }

    async consultarAsistenciaDeHoy(){
        let fecha=Moment().format("YYYY-MM-DD")
        const SQL=`SELECT * FROM 
        testudiante,
        tinscripcion,
        tasistencia_estudiante 
        WHERE
        tasistencia_estudiante.fecha_asistencia_estudiante='${fecha}' AND
        tinscripcion.id_inscripcion=tasistencia_estudiante.id_inscripcion AND
        testudiante.id_estudiante=tinscripcion.id_estudiante
        `;
        return await this.query(SQL)
    }

} 

module.exports = ModeloAsistenciaEstudiante