const DriverPostgre=require("./driver_postgresql")

class ModeloNota extends DriverPostgre{

    constructor(){
        super()
        this.id_nota=""
        this.id_boleta=""
        this.id_objetivo_lapso_academico=""
        this.nota=""
        this.observacion_nota=""
        this.fecha_nota=""
    }

    setIdNota(id){
        this.id_nota=id
    }
    
    setIdBoleta(id){
        this.id_boleta=id
    }
    
    setIdObjetivoLapsoAcademico(id){
        this.id_objetivo_lapso_academico=id
    }

    setDatos(datos){
        this.id_nota=datos.id_nota
        this.id_boleta=datos.id_boleta
        this.id_objetivo_lapso_academico=datos.id_objetivo_lapso_academico
        this.nota=datos.nota
        this.observacion_nota=datos.observacion_nota
        this.fecha_nota=datos.fecha_nota
    }

    async crearNotaIndicador(){
        const SQL=`INSERT INTO tnota(
            id_boleta,
            id_objetivo_lapso_academico,
            nota,
            observacion_nota,
            fecha_nota
        )
        VALUES(
            ${this.id_boleta},
            ${this.id_objetivo_lapso_academico},
            '-',
            '${this.observacion_nota}',
            '${this.fecha_nota}'
        )`
        return await this.query(SQL)
    }

    async actualizarNota(nota){
        const SQL=`UPDATE tnota SET nota='${nota}' WHERE id_nota=${this.id_nota}`
        return await this.query(SQL)
    }

    async consultarNotasBoleta(){
        const SQL=`SELECT * FROM tnota,tobjetivo_lapso_academico WHERE tnota.id_boleta=${this.id_boleta} AND tobjetivo_lapso_academico.id_objetivo_lapso_academico=tnota.id_objetivo_lapso_academico`
        return await this.query(SQL)
    }

}

module.exports= ModeloNota