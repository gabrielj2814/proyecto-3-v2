const DriverPostgre=require("./driver_postgresql")
const Moment=require("moment")
class AsistenciaModelo extends DriverPostgre {

    constructor(){
        super()
        this.id_asistencia=""
        this.id_cedula=""
        this.horario_entrada_asistencia=""
        this.horario_salida_asistencia=""
        this.estatu_asistencia=""
        this.estatu_cumplimiento_horario=""
        this.id_permiso_trabajador=""
    }

    setDatos(asistencia){
        this.id_asistencia=asistencia.id_asistencia
        this.id_cedula=asistencia.id_cedula
        this.horario_entrada_asistencia=asistencia.horario_entrada_asistencia
        this.horario_salida_asistencia=asistencia.horario_salida_asistencia
        this.estatu_asistencia=asistencia.estatu_asistencia
        this.estatu_cumplimiento_horario=asistencia.estatu_cumplimiento_horario
    }

    setCedula(cedula){
        this.id_cedula=cedula
    }

    async consultarTodosModelo(){
        const SQL=`SELECT * FROM tasistencia;`
        return await this.query(SQL)
    }

    async consultarFechaModelo(hoy){
        const SQL=`SELECT * FROM tasistencia WHERE id_asistencia LIKE '%${hoy}%';`
        return await this.query(SQL)
    }

    async consultarAsistenciaTrabajadorModelo(){
        const SQL=`SELECT * FROM tasistencia WHERE id_cedula='${this.id_cedula}';`
        return await this.query(SQL)
    }

    async consultarTrabajadorAsistenciaModelo(hoy,cedula){
        const SQL=`SELECT * FROM tasistencia WHERE id_asistencia LIKE '%${hoy}%' AND id_cedula='${cedula}';`
        return await this.query(SQL)
    }

    registrarModelo(){
        let fecha_asistencia=Moment()
        const SQL=`INSERT INTO tasistencia(id_asistencia,id_cedula,horario_entrada_asistencia,horario_salida_asistencia,estatu_asistencia,estatu_cumplimiento_horario,fecha_asistencia) VALUES('${this.id_asistencia}','${this.id_cedula}','${this.horario_entrada_asistencia}','${this.horario_salida_asistencia}','${this.estatu_asistencia}','${this.estatu_cumplimiento_horario}','${fecha_asistencia.format("YYYY-MM-DD")}');`
        this.query(SQL)
    }

    actualizarModelo(){
        const SQL=`UPDATE tasistencia SET horario_salida_asistencia='${this.horario_salida_asistencia}'  WHERE id_asistencia='${this.id_asistencia}'`
        this.query(SQL)
    }

    async asignarPermisoRetiroAsistenciaTrabajador(fecha,cedula,idPermiso,horaSalida){
        const SQL=`UPDATE tasistencia SET id_permiso_trabajador='${idPermiso}',horario_salida_asistencia='${horaSalida}' WHERE id_cedula='${cedula}' AND id_asistencia LIKE '%${fecha}%' AND horario_salida_asistencia='--:--AM'`
        return await this.query(SQL)
    }

    async sustituirDiasInasistenciaJRPorInasistenciaI(cedula,fechaDesde,fechaHasta){
        // IJR
        const SQL=`UPDATE tasistencia SET estatu_asistencia='II' WHERE id_cedula='${cedula}' AND  estatu_asistencia='IJR' AND (fecha_asistencia BETWEEN '${fechaDesde}' AND '${fechaHasta}') ;`
        return await this.query(SQL)
    }
}

module.exports = AsistenciaModelo