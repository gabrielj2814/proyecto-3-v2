const DriverPostgre=require("./driver_postgresql")
const Moment=require("moment")

class ModeloRetiro extends DriverPostgre{

    constructor(){
        super()
        this.id_retiro=""
        this.id_inscripcion=""
        this.cedula_representante_solicitud=""
        this.motivo_retiro=""
        this.fecha_retiro=""
        this.estado_retiro=""
    }

    setIdRetiro(id){
        this.id_retiro=id
    }

    setIdInscripcion(id){
        this.id_inscripcion=id
    }

    setDatos(datos){
        this.id_retiro=datos.id_retiro
        this.id_inscripcion=datos.id_inscripcion
        this.cedula_representante_solicitud=datos.cedula_representante_solicitud
        this.motivo_retiro=datos.motivo_retiro
        this.fecha_retiro=datos.fecha_retiro
        this.estado_retiro=datos.estado_retiro
    }


    async registrar(){
        const SQL=`INSERT INTO tretiro(
            id_inscripcion,
            cedula_representante_solicitud,
            motivo_retiro,
            fecha_retiro,
            estado_retiro
        )
        VALUES(
            ${this.id_inscripcion},
            ${this.cedula_representante_solicitud},
            '${this.motivo_retiro}',
            '${this.fecha_retiro}',
            'E'
        ) RETURNING id_retiro`
        return await this.query(SQL)
    }

    async actualizar(){
        const SQL=`UPDATE tretiro SET
        estado_retiro='${this.estado_retiro}'
        WHERE
        id_retiro=${this.id_retiro}
        `
        return await this.query(SQL)
    }

    async consultarPorEstado(){
        const SQL=`SELECT * FROM 
        tretiro
        WHERE
        tretiro.id_retiro=${this.tretiro}
        `
        return await this.query(SQL)
    }

}

module.exports= ModeloRetiro