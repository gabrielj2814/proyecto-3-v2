const DriverPostgre=require("./driver_postgresql")

class TipoCamModelo extends DriverPostgre{

    constructor(){
        super()
        this.id_tipo_cam=""
        this.nombre_tipo_cam=""
        this.estatu_tipo_cam=""
    }

    setIdTipoCam(id){
        this.id_tipo_cam=id
    }

    setDatos(tipo_cam){
        this.id_tipo_cam=tipo_cam.id_tipo_cam
        this.nombre_tipo_cam=tipo_cam.nombre_tipo_cam
        this.estatu_tipo_cam=tipo_cam.estatu_tipo_cam
    }

    async consultarTodosModelo(){
        const SQL="SELECT * FROM ttipocam;"
        // console.log(SQL)
        return await this.query(SQL)
    }

    async consultarModelo(){
        const SQL=`SELECT * FROM ttipocam WHERE id_tipo_cam='${this.id_tipo_cam}';`
        // console.log(SQL)
        return await this.query(SQL)
    }

    registrarModelo(){
        const SQL=`INSERT INTO ttipocam(id_tipo_cam,nombre_tipo_cam,estatu_tipo_cam) VALUES('${this.id_tipo_cam}','${this.nombre_tipo_cam}','${this.estatu_tipo_cam}');`
        // console.log(SQL)
        this.query(SQL)
    }

    actualizarModelo(){
        const SQL=`UPDATE ttipocam SET nombre_tipo_cam='${this.nombre_tipo_cam}',estatu_tipo_cam='${this.estatu_tipo_cam}' WHERE id_tipo_cam='${this.id_tipo_cam}'`
        // console.log(SQL)
        this.query(SQL)
    }

    async consultarTipoCamPatronModelo(patron){
        const SQL=`SELECT * FROM ttipocam WHERE id_tipo_cam LIKE '%${patron}%' OR nombre_tipo_cam LIKE '%${patron}%';`
        // console.log(SQL)
        return await this.query(SQL)
    }

}

module.exports = TipoCamModelo