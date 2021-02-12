const DriverPostgreSQL=require("./driver_postgresql")

class ModeloCintillo extends DriverPostgreSQL{


    constructor(){
        super()
        this.id_foto_cintillo=""
        this.nombre_foto_cintillo=""
        this.extension_foto_cintillo=""
        this.fecha_subida_foto=""
        this.hora_subida_foto=""
        this.estatu_foto_cintillo=""
    }

    setDatos(datos){
        this.nombre_foto_cintillo=datos.nombre_foto_cintillo
        this.extension_foto_cintillo=datos.extension_foto_cintillo
        this.fecha_subida_foto=datos.fecha_subida_foto
        this.hora_subida_foto=datos.hora_subida_foto
        this.estatu_foto_cintillo=datos.estatu_foto_cintillo
    }

    setIdCintillo(id){
        this.id_foto_cintillo=id
    }

    async registrarFoto(){
        const SQL=`
        INSERT INTO tcintillo (
            nombre_foto_cintillo,
            fecha_subida_foto,
            hora_subida_foto,
            estatu_foto_cintillo
            )
            VALUES(
                '${this.nombre_foto_cintillo}',
                '${this.fecha_subida_foto}',
                '${this.hora_subida_foto}',
                '${this.estatu_foto_cintillo}'
            )
        `
        return this.query(SQL)
    }

    async agregarExtencion(extencion,fecha,hora){
        const SQL=`
        UPDATE tcintillo SET 
        extension_foto_cintillo='${extencion}'
        WHERE
        fecha_subida_foto='${fecha}' 
        AND
        hora_subida_foto='${hora}'
        `
        return this.query(SQL)
    }
    
    async actualizarCintillo(){
        const SQL=`
        UPDATE tcintillo SET
        nombre_foto_cintillo='${this.nombre_foto_cintillo}',
        fecha_subida_foto='${this.fecha_subida_foto}',
        hora_subida_foto='${this.hora_subida_foto}',
        estatu_foto_cintillo='${this.estatu_foto_cintillo}'
        WHERE
        id_foto_cintillo=${this.id_foto_cintillo}
        `
        return this.query(SQL)
    }

    async actualizarCintilloFechaHoraSubida(fecha,hora){
        const SQL=`
        UPDATE tcintillo SET
        fecha_subida_foto='${fecha}',
        hora_subida_foto='${hora}'
        WHERE
        id_foto_cintillo=${this.id_foto_cintillo}
        `
        return this.query(SQL)
    }

    desactivarCintilloActiva(){
        const SQL=`
        UPDATE tcintillo SET 
        estatu_foto_cintillo='0'
        WHERE estatu_foto_cintillo='1'
        `
        this.query(SQL)
    }
    
    async consultarCintilloActivo(){
        const SQL=`
        SELECT * FROM tcintillo WHERE estatu_foto_cintillo='1'
        `
        return await this.query(SQL)
    }

    eliminarRegistro(fecha,hora){
        const SQL=`
        DELETE FROM tcintillo 
        WHERE 
        fecha_subida_foto='${fecha}'
        AND
        hora_subida_foto='${hora}'
        `
        this.query(SQL)
    }

    async consultarTodos(){
        const SQL="SELECT * FROM tcintillo ORDER BY estatu_foto_cintillo DESC"
        return this.query(SQL)
    }
    
    async consultarCintillo(){
        const SQL=`SELECT * FROM tcintillo WHERE id_foto_cintillo=${this.id_foto_cintillo}`
        return this.query(SQL)
    }

    async consultarCintilloActivo(){
        const SQL=`SELECT * FROM tcintillo WHERE estatu_foto_cintillo='1'`
        return this.query(SQL)
    }

    async eliminarCintillo(){
        const SQL=`DELETE FROM tcintillo WHERE id_foto_cintillo=${this.id_foto_cintillo}`
        return await this.query(SQL)
    }

}

module.exports = ModeloCintillo