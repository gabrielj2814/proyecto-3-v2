const DriverPostgre=require("./driver_postgresql")
const Moment=require("moment")

class ModeloBoleta extends DriverPostgre{

    constructor(){
        super()
        this.id_boleta=""
        this.id_inscripcion=""
        this.id_lapso_academico=""
        this.observacion_boleta=""
        this.fecha_boleta=""
    }

    setIdBoleta(id){
        this.id_boleta=id
    }

    setIdInscripcion(id){
        this.id_inscripcion=id
    }

    setIdLapso(id){
        this.id_lapso_academico=id
    }
    
    setDatos(datos){
        this.id_boleta=datos.id_boleta
        this.id_inscripcion=datos.id_inscripcion
        this.id_lapso_academico=datos.id_lapso_academico
        this.observacion_boleta=datos.observacion_boleta
        this.fecha_boleta=datos.fecha_boleta
    }

    async registrar(){
        let fecha=Moment().format("YYYY-MM-DD")
        const SQL=`INSERT INTO tboleta(
            id_inscripcion,
            id_lapso_academico,
            observacion_boleta,
            fecha_boleta
        )
        VALUES(
            ${this.id_inscripcion},
            ${this.id_lapso_academico},
            'sin observacion',
            '${fecha}'
        ) RETURNING id_boleta;`
        return await this.query(SQL)

    }

    async consultaInscripcion(){
        const SQL=`SELECT * FROM tboleta WHERE id_inscripcion=${this.id_inscripcion};`
        return await this.query(SQL)
    }
    
    async consultaInscripcionYLapso(){
        const SQL=`SELECT * FROM tboleta WHERE id_inscripcion=${this.id_inscripcion} AND id_lapso_academico=${this.id_lapso_academico};`
        return await this.query(SQL)
    }
    async consultarBoletasPorInscripcion(){
        const SQL=`SELECT * FROM tboleta WHERE id_inscripcion=${this.id_inscripcion};`
        return await this.query(SQL)
    }
    
    async consultarBoletaPorInscripcion(){
        // tboleta.id_inscripcion=${this.id_inscripcion} AND 
        const SQL=`SELECT * FROM 
        tboleta,
        tlapso_academico,
        tobjetivo_lapso_academico 
        WHERE 
        tboleta.id_boleta=${this.id_boleta} AND 
        tlapso_academico.id_lapso_academico=tboleta.id_lapso_academico AND 
        tobjetivo_lapso_academico.id_lapso_academico=tlapso_academico.id_lapso_academico`
        return await this.query(SQL)
    }

    async consultar(){
        const SQL=`SELECT * FROM tboleta WHERE id_boleta=${this.id_boleta};`
        return await this.query(SQL)
    }
    
    async actualizarObservacion(){
        const SQL=`UPDATE tboleta SET observacion_boleta='${this.observacion_boleta}' WHERE id_boleta=${this.id_boleta};`
        return await this.query(SQL)
    }


}

// SELECT * FROM tboleta,tlapso_academico,tlapso_academico WHERE tboleta.id_boleta=${this.id_boleta} AND tlapso_academico.id_lapso_academico=tboleta.id_lapso_academico AND tobjetivo_lapso_academico.id_lapso_academico=tlapso_academico.id_lapso_academico
module.exports = ModeloBoleta