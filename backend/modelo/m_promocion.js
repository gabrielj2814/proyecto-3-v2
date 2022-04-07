const DriverPostgre=require("./driver_postgresql")
const Moment=require("moment")

class ModeloPromocion extends DriverPostgre{

    constructor(){
        super()
        this.id_promocion=""
        this.id_inscripcion=""
        this.fecha_promocion=""
        this.descripcion_logro=""
        this.recomendacion_pariente=""
        this.nota_promocion=""
        this.descripcion_nota_promocion=""
        this.dias_promocion=""
    }

    setIdPromocion(id){
        this.id_promocion=id
    }
    
    setIdInscripcion(id){
        this.id_inscripcion=id
    }

    setDatos(datos){
        this.id_promocion=datos.id_promocion
        this.id_inscripcion=datos.id_inscripcion
        this.fecha_promocion=datos.fecha_promocion
        this.descripcion_logro=datos.descripcion_logro
        this.recomendacion_pariente=datos.recomendacion_pariente
        this.nota_promocion=datos.nota_promocion
        this.descripcion_nota_promocion=datos.descripcion_nota_promocion
        this.dias_promocion=datos.dias_promocion
    }

    async registrar(){
        let fecha=Moment().format("YYYY-MM-DD")
        const SQL=`INSERT INTO tpromocion(
            id_inscripcion,
            fecha_promocion,
            descripcion_logro,
            recomendacion_pariente,
            nota_promocion,
            descripcion_nota_promocion,
            dias_promocion,
        )
        VALUES(
            ${this.id_inscripcion},
            '${fecha}',
            '${this.descripcion_logro}',
            '${this.recomendacion_pariente}',
            '${this.nota_promocion}',
            '${this.descripcion_nota_promocion}',
            '${this.dias_promocion}'
        ) RETURNING id_promocion`
        return await this.query(SQL)
    }
    
    async actualizar(){
        const SQL=`UPDATE tpromocion SET
        nota_promocion='${this.nota_promocion}',
        descripcion_nota_promocion='${this.descripcion_nota_promocion}',
        descripcion_logro='${this.descripcion_logro}',
        recomendacion_pariente='${this.recomendacion_pariente}',
        dias_promocion='${this.dias_promocion}'
        WHERE
        id_inscripcion=${id_inscripcion}
        `
        return await this.query(SQL)
    }
    
    async consultar(){
        const SQL=`SELECT * FROM tpromocion WHERE id_promocion=${this.id_promocion}`
        return await this.query(SQL)
    }
    
    async consultarPorIdInscripcion(){
        const SQL=`SELECT * FROM tpromocion WHERE id_inscripcion=${this.id_inscripcion}`
        return await this.query(SQL)
    }

}

module.exports= ModeloPromocion