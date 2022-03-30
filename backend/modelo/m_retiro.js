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
        this.estadoEspera="E"
        this.estadoRezado="R"
        this.estadoAprobado="R"
    }

    setIdRetiro(id){
        this.id_retiro=id
    }

    setIdInscripcion(id){
        this.id_inscripcion=id
    }
    
    setEstado(estado){
        this.estado_retiro=estado
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
        let fecha=Moment().format("YYYY-MM-DD")
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
            '${fecha}',
            '${this.this.estadoEspera}'
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

    async consultarPorEstado(fechaDesde,fechaHasta){
        const SQL=`SELECT * FROM 
        tretiro
        WHERE
        (fecha_retiro BETWEEN '${fechaDesde}' AND '${fechaHasta}') AND
        estado_retiro='${this.estado_retiro}'

        `
        return await this.query(SQL)
    }

}

module.exports= ModeloRetiro