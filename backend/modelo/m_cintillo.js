const DriverPostgreSQL=require("./driver_postgresql")

class ModeloCintillo extends DriverPostgreSQL{


    constructor(){
        super()
        this.id_foto_cintillo=""
        this.nombre_foto_cintillo=""
        this.fecha_subida_foto=""
        this.hora_subida_foto=""
        this.estatu_foto_cintillo=""
    }

    setDatos(datos){
        this.nombre_foto_cintillo=datos.nombre_foto_cintillo
        this.fecha_subida_foto=datos.fecha_subida_foto
        this.hora_subida_foto=datos.hora_subida_foto
        this.estatu_foto_cintillo=datos.estatu_foto_cintillo
    }

    setIdCintillo(id){
        this.id_foto_cintillo=id
    }

    registrarFoto(){
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
        this.query(SQL)
    }

    desactivarCintilloActiva(){
        const SQL=`
        UPDATE tcintillo SET 
        estatu_foto_cintillo='0'
        WHERE estatu_foto_cintillo='1'
        `
        this.query(SQL)
    }

    eliminarRegistro(fecha,hora){
        const SQL=`
        DELETE FROM tcintillo 
        WHERE 
        fecha_subida_foto='${fecha}'
        hora_subida_foto='${hora}'
        `
        this.query(SQL)
    }

}

module.exports = ModeloCintillo