const PostgreDriver=require("./driver_postgresql")

class PermisoModelo extends PostgreDriver{

    constructor(){
        super()
        this.id_permiso=""
        this.nombre_permiso=""
        this.dias_permiso=0
        this.estatu_permiso=""
        this.estatu_remunerado=""
        this.estatu_dias_aviles=""
        this.estatu_tipo_permiso=""
    }

    set_idPermiso(id){
        this.id_permiso=id
    }

    set_datosModelo(permiso){
        this.id_permiso=permiso.id_permiso
        this.nombre_permiso=permiso.nombre_permiso
        this.dias_permiso=permiso.dias_permiso
        this.estatu_permiso=permiso.estatu_permiso
        this.estatu_remunerado=permiso.estatu_remunerado
        this.estatu_dias_aviles=permiso.estatu_dias_aviles
        this.estatu_tipo_permiso=permiso.estatu_tipo_permiso
    }

    registrarModelo(){
        const SQL=`INSERT INTO tpermiso(id_permiso,nombre_permiso,dias_permiso,estatu_permiso,estatu_remunerado,estatu_dias_aviles,estatu_tipo_permiso) VALUES('${this.id_permiso}','${this.nombre_permiso}','${this.dias_permiso}','${this.estatu_permiso}','${this.estatu_remunerado}','${this.estatu_dias_aviles}','${this.estatu_tipo_permiso}');`
        //console.log(SQL)
        this.query(SQL)
    }

    async consultarTodos(){
        const SQL=`SELECT * FROM tpermiso;`
        //console.log(SQL)
        return await this.query(SQL)
    }

    async consultarModelo(){
        const SQL=`SELECT * FROM tpermiso WHERE id_permiso='${this.id_permiso}';`
        //console.log(SQL)
        return await this.query(SQL)
    }

    async consultarActivoModelo(){
        const SQL=`SELECT * FROM tpermiso WHERE id_permiso='${this.id_permiso}' AND estatu_permiso='1';`
        //console.log(SQL)
        return await this.query(SQL)
    }

    async consultarPermisoPatronModelo(patron){
        const SQL=`SELECT * FROM tpermiso WHERE id_permiso LIKE '%${patron}%' OR nombre_permiso LIKE '%${patron}%';`
        //console.log(SQL)
        return await this.query(SQL)
    }

    actualizarModelo(){
        const SQL=`UPDATE tpermiso SET nombre_permiso='${this.nombre_permiso}',dias_permiso='${this.dias_permiso}',estatu_permiso='${this.estatu_permiso}',estatu_remunerado='${this.estatu_remunerado}',estatu_dias_aviles='${this.estatu_dias_aviles}',estatu_tipo_permiso='${this.estatu_tipo_permiso}' WHERE id_permiso='${this.id_permiso}';`
        //console.log(SQL)
        return this.query(SQL)
    }

}

module.exports = PermisoModelo