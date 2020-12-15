const DriverPostgre=require("./driver_postgresql")

class Cam  extends DriverPostgre{

    constructor(){
        super()
        this.id_cam=""
        this.nombre_cam=""
        this.telefono_cam=""
        this.direccion_cam=""
        this.id_tipo_cam=""
        this.id_ciudad=""
        this.estatu_cam=""
    }

    setIdCam(id){
        this.id_cam=id
    }

    setDatos(cam){
        this.id_cam=cam.id_cam
        this.nombre_cam=cam.nombre_cam
        this.telefono_cam=cam.telefono_cam
        this.direccion_cam=cam.direccion_cam
        this.id_tipo_cam=cam.id_tipo_cam
        this.id_ciudad=cam.id_ciudad
        this.estatu_cam=cam.estatu_cam
    }

    async consultarTodosModelo(){
        const SQL=`SELECT * FROM tcam;`
        // console.log(SQL)
        return await this.query(SQL)
    }

    async consultarModelo(){
        const SQL=`SELECT * FROM tcam WHERE id_cam=${this.id_cam}`
        // console.log(SQL)
        return await this.query(SQL)
    }

    async consultarActivoModelo(id){
        const SQL=`SELECT * FROM tcam WHERE id_cam=${this.id_cam} AND estatu_cam='1';`
        // console.log(SQL)
        return await this.query(SQL)
    }

    async consultarCamXCiudadModelo(id){
        const SQL=`SELECT * FROM tcam WHERE id_ciudad='${id}'`
        // console.log(SQL)
        return await this.query(SQL)
    }

    registrarModelo(){
        const SQL=`INSERT INTO tcam (nombre_cam,telefono_cam,direccion_cam,id_tipo_cam,id_ciudad,estatu_cam) VALUES('${this.nombre_cam}','${this.telefono_cam}','${this.direccion_cam}','${this.id_tipo_cam}','${this.id_ciudad}','${this.estatu_cam}');`
        // console.log(SQL)
        this.query(SQL)
    }

    actualizarModelo(){
        const SQL=`UPDATE tcam SET nombre_cam='${this.nombre_cam}',telefono_cam='${this.telefono_cam}',direccion_cam='${this.direccion_cam}',id_tipo_cam='${this.id_tipo_cam}',id_ciudad='${this.id_ciudad}',estatu_cam='${this.estatu_cam}' WHERE id_cam=${this.id_cam};`
        // console.log(SQL)
        this.query(SQL)
    }

    async consultarCamPatronModelo(patron){
        const SQL=`SELECT * FROM tcam WHERE nombre_cam LIKE '%${patron}%';`
        console.log(SQL)
        return await this.query(SQL)
    }
}

module.exports = Cam