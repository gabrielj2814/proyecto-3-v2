const DriverPostgre=require("./driver_postgresql")
const Moment=require("moment")

class AsistenciaModelo extends DriverPostgre {

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

    actualizarEstadoAsistencia(){

    }

    actualizarObservacion(){

    }

    crearAsistenciaDeHoy(){

    }




} 