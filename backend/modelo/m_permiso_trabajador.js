const DriverPostgre=require("./driver_postgresql")

class PermisoTrabajadorModelo extends DriverPostgre{

    constructor(){
        super()
        this.id_permiso_trabajador=""// formato -> pert-01-01-04-2020
        this.id_cedula=""
        this.id_permiso=""
		this.fecha_desde_permiso_trabajador=""
		this.fecha_hasta_permiso_trabajador=""
		this.estatu_permiso_trabajador=""
		this.permiso_trabajador_dias_aviles=""
    }

    set_datoIdPermisoTrabajador(id){
        this.id_permiso_trabajador=id
    }
    set_datoFechas(desde,hasta){
		this.fecha_desde_permiso_trabajador=desde,
		this.fecha_hasta_permiso_trabajador=hasta
    }

    setCedulaPermiso(cedula){
        this.id_cedula=cedula
    }

    set_datosActualizarPermiso(permiso_trabajador){
        this.id_permiso_trabajador=permiso_trabajador.id_permiso_trabajador,
		this.estatu_permiso_trabajador=permiso_trabajador.estatu_permiso_trabajador
    }

    set_datos(permiso_trabajador){
        this.id_permiso_trabajador=permiso_trabajador.id_permiso_trabajador,
        this.id_cedula=permiso_trabajador.id_cedula,
        this.id_permiso=permiso_trabajador.id_permiso,
		this.fecha_desde_permiso_trabajador=permiso_trabajador.fecha_desde_permiso_trabajador,
		this.fecha_hasta_permiso_trabajador=permiso_trabajador.fecha_hasta_permiso_trabajador,
		this.estatu_permiso_trabajador=(permiso_trabajador.estatu_permiso_trabajador==="E")?"E":"E",
		this.permiso_trabajador_dias_aviles="VC"
    }

    async consultarTodosModelo(fecha){
        const SQL=`SELECT * FROM tpermisotrabajador WHERE id_permiso_trabajador LIKE '%${fecha}%';`
        //console.log(SQL)
        return await this.query(SQL)
    }

    async consultarTodosActivoModelo(){
        const SQL=`SELECT * FROM tpermisotrabajador,tpermiso,ttrabajador WHERE tpermisotrabajador.estatu_permiso_trabajador='1' AND tpermisotrabajador.id_cedula=ttrabajador.id_cedula AND tpermisotrabajador.id_permiso=tpermiso.id_permiso;`
        //console.log(SQL)
        return await this.query(SQL)
    }

    async consultarPermisoHoyModelo(hoy,estatu){
        const SQL=`SELECT * FROM tpermisotrabajador,tpermiso,ttrabajador WHERE tpermisotrabajador.id_permiso_trabajador LIKE '%${hoy}%' AND tpermisotrabajador.estatu_permiso_trabajador='${estatu}' AND tpermisotrabajador.id_cedula=ttrabajador.id_cedula AND tpermisotrabajador.id_permiso=tpermiso.id_permiso;`//Moment
        //console.log(SQL)
        return await this.query(SQL)
    }

    registrarModelo(){
        const SQL=`INSERT INTO tpermisotrabajador(id_permiso_trabajador,id_cedula,fecha_desde_permiso_trabajador,fecha_hasta_permiso_trabajador,estatu_permiso_trabajador,permiso_trabajador_dias_aviles,id_permiso) VALUES('${this.id_permiso_trabajador}','${this.id_cedula}','${this.fecha_desde_permiso_trabajador}','${this.fecha_hasta_permiso_trabajador}','${this.estatu_permiso_trabajador}','${this.permiso_trabajador_dias_aviles}','${this.id_permiso}');`
        console.log(SQL)
        this.query(SQL)
    }

    async consultarPermisoTrabajadorModelo(){
        const SQL=`SELECT * FROM tpermisotrabajador,tpermiso,ttrabajador WHERE id_permiso_trabajador='${this.id_permiso_trabajador}' AND tpermisotrabajador.id_cedula=ttrabajador.id_cedula AND tpermisotrabajador.id_permiso=tpermiso.id_permiso;`
        //console.log(SQL)
        return await this.query(SQL)
    }

    async consultarPermisoTrabajadorXCedulaActivolModelo(){
        const SQL=`SELECT * FROM tpermisotrabajador WHERE id_cedula='${this.id_cedula}' AND estatu_permiso_trabajador='A' OR estatu_permiso_trabajador='E';`
        // console.log(SQL)
        return await this.query(SQL)
    }

    async consultarPermisoTrabajadorXCedulaEstatuModelo(id_cedula,estatu){
        const SQL=`SELECT * FROM tpermisotrabajador,tpermiso,ttrabajador WHERE tpermisotrabajador.id_cedula='${id_cedula}' AND estatu_permiso_trabajador='${estatu}' AND tpermisotrabajador.id_cedula=ttrabajador.id_cedula AND tpermisotrabajador.id_permiso=tpermiso.id_permiso;`
        //console.log(SQL)
        return await this.query(SQL)
    }

    async consultarPermisosXFechaModelo(){
        const SQL=`SELECT * FROM tpermisotrabajador WHERE fecha_desde_permiso_trabajador BETWEEN '${this.fecha_desde_permiso_trabajador}' AND '${this.fecha_hasta_permiso_trabajador}'`
        //console.log(SQL)
        return await this.query(SQL)
    }

    async consultarMensualModelo(fecha){
        const SQL=`SELECT * FROM tpermisotrabajador WHERE  id_permiso_trabajador LIKE '%${fecha}%'`
        //console.log(SQL)
        return await this.query(SQL)
    }

    actualizarEstatuPermisoModelo(){
        const SQL=`UPDATE tpermisotrabajador SET estatu_permiso_trabajador='${this.estatu_permiso_trabajador}'  WHERE id_permiso_trabajador='${this.id_permiso_trabajador}' AND estatu_permiso_trabajador='E'`
        //console.log(SQL)
        this.query(SQL)
    }

    actualizarDiasPermisoModelo(dias,fecha_hasta,id_permiso_trabajador){
        const SQL=`UPDATE tpermisotrabajador SET fecha_hasta_permiso_trabajador='${fecha_hasta}',permiso_trabajador_dias_aviles='${dias}' WHERE id_permiso_trabajador='${id_permiso_trabajador}';`
        //console.log(SQL)
        this.query(SQL)
    }

    actualizarCaducarPermisoModelo(){
        const SQL=`UPDATE tpermisotrabajador SET estatu_permiso_trabajador='C'  WHERE id_permiso_trabajador='${this.id_permiso_trabajador}' AND estatu_permiso_trabajador='A'`
        //console.log(SQL)
        this.query(SQL)
    }

    async consultarTodosPermisosFechaModelo(fecha){
        const SQL=`SELECT * FROM tpermisotrabajador WHERE fecha_hasta_permiso_trabajador='${fecha}';`
        //console.log(SQL)
        return await this.query(SQL)
    }
}

module.exports = PermisoTrabajadorModelo