const DriverPostgre=require("./driver_postgresql")

class ReposoTrabajadorModelo extends DriverPostgre {

    constructor(){
        super()
        this.id_reposo_trabajador=""
        this.id_cedula=""
        this.id_reposo=""
        this.fecha_desde_reposo_trabajador=""
        this.fecha_hasta_reposo_trabajador=""
        this.estatu_reposo_trabajador=""
        this.descripcion_reposo_trabajador=""
        this.id_cam=""
        this.id_asignacion_medico_especialidad=""
        this.total_dias_reposo_trabajador=""
        this.total_dias_no_aviles_reposo_trabajador=""
        this.cantidad_dias_entrega_reposo_trabajador=""
        this.fecha_desde_entrega_reposo_trabajador=""
        this.fecha_hasta_entrega_reposo_trabajador=""
        this.estatu_entrega_reposo=""
    }

    setDatos(reposo_trabajador){
        this.id_reposo_trabajador=reposo_trabajador.id_reposo_trabajador
        this.id_cedula=reposo_trabajador.id_cedula
        this.id_reposo=reposo_trabajador.id_reposo
        this.fecha_desde_reposo_trabajador=reposo_trabajador.fecha_desde_reposo_trabajador
        this.fecha_hasta_reposo_trabajador=reposo_trabajador.fecha_hasta_reposo_trabajador
        this.estatu_reposo_trabajador=reposo_trabajador.estatu_reposo_trabajador
        this.descripcion_reposo_trabajador=reposo_trabajador.descripcion_reposo_trabajador
        this.id_cam=reposo_trabajador.id_cam
        this.id_asignacion_medico_especialidad=reposo_trabajador.id_asignacion_medico_especialidad
        this.total_dias_reposo_trabajador=reposo_trabajador.total_dias_reposo_trabajador
        this.total_dias_no_aviles_reposo_trabajador=reposo_trabajador.total_dias_no_aviles_reposo_trabajador
        this.cantidad_dias_entrega_reposo_trabajador=reposo_trabajador.cantidad_dias_entrega_reposo_trabajador
        this.fecha_desde_entrega_reposo_trabajador=reposo_trabajador.fecha_desde_entrega_reposo_trabajador
        this.fecha_hasta_entrega_reposo_trabajador=reposo_trabajador.fecha_hasta_entrega_reposo_trabajador
        this.estatu_entrega_reposo=reposo_trabajador.estatu_entrega_reposo
    }

    setIdReposoTrabajador(id){
        this.id_reposo_trabajador=id
    }

    setDatosFechas(desde,hasta){
        this.fecha_desde_reposo_trabajador=desde
        this.fecha_hasta_reposo_trabajador=hasta
    }

    setCedulaTrabajador(cedula){
        this.id_cedula=cedula
    }

    async consultarRepososActivos(){
        const SQL=`SELECT * FROM treposotrabajador WHERE estatu_reposo_trabajador='1';`
        return await this.query(SQL)
    }

    async consultarRepososXFechaModelo(){
        const SQL=`SELECT * FROM treposotrabajador WHERE fecha_desde_reposo_trabajador BETWEEN '${this.fecha_desde_reposo_trabajador}' AND '${this.fecha_hasta_reposo_trabajador}'`
        //console.log(SQL)
        return await this.query(SQL)
    }

    async consultarTodosModelo(){
        const SQL="SELECT * FROM treposotrabajador,ttrabajador,treposo,tcam,tasignacionmedicoespecialidad WHERE treposotrabajador.id_cedula=ttrabajador.id_cedula AND treposotrabajador.id_reposo=treposo.id_reposo AND treposotrabajador.id_cam=tcam.id_cam AND treposotrabajador.id_asignacion_medico_especialidad=tasignacionmedicoespecialidad.id_asignacion_medico_especialidad"
        return await this.query(SQL)
    }

    async consultarTodosActivoModelo(){
        const SQL="SELECT * FROM treposotrabajador,ttrabajador,treposo,tcam,tasignacionmedicoespecialidad WHERE treposotrabajador.estatu_reposo_trabajador='1' AND treposotrabajador.id_cedula=ttrabajador.id_cedula AND treposotrabajador.id_reposo=treposo.id_reposo AND treposotrabajador.id_cam=tcam.id_cam AND treposotrabajador.id_asignacion_medico_especialidad=tasignacionmedicoespecialidad.id_asignacion_medico_especialidad"
        return await this.query(SQL)
    }

    async consultarTodosXPatronModelo(patron){
        const SQL=`SELECT * FROM treposotrabajador WHERE id_reposo_trabajador LIKE '%${patron}%';`
        return await this.query(SQL)
    }

    async consultarRepososTrabajadorPatronModelo(patron){
        const SQL=`SELECT * FROM treposotrabajador WHERE id_reposo_trabajador LIKE '%${patron}%' OR id_cedula LIKE '%${patron}%';`
        return await this.query(SQL)
    }

    async consultarModelo(){
        const SQL=`SELECT * FROM treposotrabajador,ttrabajador,treposo,tcam,tasignacionmedicoespecialidad WHERE treposotrabajador.id_reposo_trabajador='${this.id_reposo_trabajador}' AND treposotrabajador.id_cedula=ttrabajador.id_cedula AND treposotrabajador.id_reposo=treposo.id_reposo AND treposotrabajador.id_cam=tcam.id_cam AND treposotrabajador.id_asignacion_medico_especialidad=tasignacionmedicoespecialidad.id_asignacion_medico_especialidad`
        return await this.query(SQL)
    }

    async consultarXReposoTrabajadorActivoModelo(){
        const SQL=`SELECT * FROM treposotrabajador,ttrabajador,treposo,tcam,tasignacionmedicoespecialidad WHERE treposotrabajador.id_cedula='${this.id_cedula}' AND treposotrabajador.estatu_reposo_trabajador='1' AND treposotrabajador.id_cedula=ttrabajador.id_cedula AND treposotrabajador.id_reposo=treposo.id_reposo AND treposotrabajador.id_cam=tcam.id_cam AND treposotrabajador.id_asignacion_medico_especialidad=tasignacionmedicoespecialidad.id_asignacion_medico_especialidad`
        return await this.query(SQL)
    }

    registrarModelo(){
        const SQL=`INSERT INTO treposotrabajador(
            id_reposo_trabajador,
            id_cedula,
            id_reposo,
            fecha_desde_reposo_trabajador,
            fecha_hasta_reposo_trabajador,
            estatu_reposo_trabajador,
            descripcion_reposo_trabajador,
            id_cam,
            id_asignacion_medico_especialidad,
            total_dias_reposo_trabajador,
            total_dias_no_aviles_reposo_trabajador,
            cantidad_dias_entrega_reposo_trabajador,
            fecha_desde_entrega_reposo_trabajador,
            fecha_hasta_entrega_reposo_trabajador,
            estatu_entrega_reposo
            ) VALUES(
                '${this.id_reposo_trabajador}',
                '${this.id_cedula}',
                '${this.id_reposo}',
                '${this.fecha_desde_reposo_trabajador}',
                '${this.fecha_hasta_reposo_trabajador}',
                '${this.estatu_reposo_trabajador}',
                '${this.descripcion_reposo_trabajador}',
                ${this.id_cam},
                '${this.id_asignacion_medico_especialidad}',
                '${this.total_dias_reposo_trabajador}',
                '${this.total_dias_no_aviles_reposo_trabajador}',
                '${this.cantidad_dias_entrega_reposo_trabajador}',
                '${this.fecha_desde_entrega_reposo_trabajador}',
                '${this.fecha_hasta_entrega_reposo_trabajador}',
                '${this.estatu_entrega_reposo}'
                );`
        this.query(SQL)
    }

    actualizarModelo(){
        const SQL=`UPDATE treposotrabajador SET id_cedula='${this.id_cedula}',id_reposo='${this.id_reposo}',fecha_desde_reposo_trabajador='${this.fecha_desde_reposo_trabajador}',fecha_hasta_reposo_trabajador='${this.fecha_hasta_reposo_trabajador}',descripcion_reposo_trabajador='${this.descripcion_reposo_trabajador}',id_cam=${this.id_cam},id_asignacion_medico_especialidad='${this.id_asignacion_medico_especialidad}',estatu_reposo_trabajador=${this.estatu_reposo_trabajador} WHERE id_reposo_trabajador='${this.id_reposo_trabajador}' ;`
        this.query(SQL)
        // estatu_reposo_trabajador='${this.estatu_reposo_trabajador}'
    }

    actualizarCaducarReposoModelo(){
        const SQL=`UPDATE treposotrabajador SET estatu_reposo_trabajador='0' WHERE id_reposo_trabajador='${this.id_reposo_trabajador}' AND estatu_reposo_trabajador='1';`
        this.query(SQL)
        // estatu_reposo_trabajador='${this.estatu_reposo_trabajador}'
    }

    async actualizarEstadoEntregaReposo(id,estadoEntrega){
        let SQL=``
        if(estadoEntrega==="E"){
            SQL=`UPDATE treposotrabajador SET estatu_entrega_reposo='${estadoEntrega}' WHERE id_reposo_trabajador='${id}'`
        }
        else if(estadoEntrega==="N"){
            
            SQL=`UPDATE treposotrabajador SET estatu_entrega_reposo='${estadoEntrega}',estatu_reposo_trabajador='0' WHERE id_reposo_trabajador='${id}'`
        }
        return await this.query(SQL)
    }

    async consultarTodosRepososFechaHastaModelo(fecha){
        const SQL=`SELECT * FROM treposotrabajador WHERE fecha_hasta_reposo_trabajador='${fecha}'`
        return await this.query(SQL)
    }

}

module.exports = ReposoTrabajadorModelo