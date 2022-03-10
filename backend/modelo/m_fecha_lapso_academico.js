const DriverPostgre = require("./driver_postgresql")
class ModuloFechaLapsoAcademico extends DriverPostgre {
    constructor(){
        super()
        this.id_fecha_lapso_academico = ""
        this.id_ano_escolar = ""
        this.numero_lapos = ""
        this.fecha_lapso_inicio = ""
        this.fecha_lapso_cierre = ""
        this.estado_fecha_lapso = ""
    }

    setDatos(datos){
        this.id_fecha_lapso_academico = datos.id_fecha_lapso_academico
        this.id_ano_escolar = datos.id_ano_escolar
        this.numero_lapos = datos.numero_lapos
        this.fecha_lapso_inicio = datos.fecha_lapso_inicio
        this.fecha_lapso_cierre = datos.fecha_lapso_cierre
        this.estado_fecha_lapso = datos.estado_fecha_lapso
    }
    
    setIdFechaLapsoAcademico(id){
        this.id_fecha_lapso_academico = id
    }
    
    setIdAnoEscolar(id){
        this.id_ano_escolar = id
    }

    async registrar(){
        const SQL=`INSERT INTO tfecha_lapso_academico(
            id_ano_escolar,
            numero_lapos,
            fecha_lapso_inicio,
            fecha_lapso_cierre,
            estado_fecha_lapso
        )VALUES (
            ${this.id_ano_escolar},
            '${this.numero_lapos}',
            '${this.fecha_lapso_inicio}',
            '${this.fecha_lapso_cierre}',
            '${this.estado_fecha_lapso}'
        ) RETURNING id_fecha_lapso_academico;`
        return await this.query(SQL)
    }

    async consultar(){
        const SQL=`SELECT * FROM 
        tfecha_lapso_academico,
        tano_escolar
        WHERE 
        tfecha_lapso_academico.id_fecha_lapso_academico=${this.id_fecha_lapso_academico} AND
        tano_escolar.id_ano_escolar=tfecha_lapso_academico.id_ano_escolar`
        return await this.query(SQL)
    }

    async consultarPorFechaLapsosPorAnoEscolar(){
        const SQL=`SELECT * FROM 
        tfecha_lapso_academico,
        tano_escolar 
        WHERE 
        tfecha_lapso_academico.id_ano_escolar=${this.id_ano_escolar} AND
        tano_escolar.id_ano_escolar=tfecha_lapso_academico.id_ano_escolar;`
        return await this.query(SQL)
    }

    async consultarTodo(){
        const SQL=`SELECT * FROM 
        tfecha_lapso_academico,
        tano_escolar
        WHERE 
        tano_escolar.id_ano_escolar=tfecha_lapso_academico.id_ano_escolar;
        `
        return await this.query(SQL)
    }

    async actualizar(){
        const SQL=`UPDATE tfecha_lapso_academico SET
            id_ano_escolar=${this.id_ano_escolar},
            numero_lapos='${this.numero_lapos}',
            fecha_lapso_inicio='${this.fecha_lapso_inicio}',
            fecha_lapso_cierre='${this.fecha_lapso_cierre}',
            estado_fecha_lapso='${this.estado_fecha_lapso}'
            WHERE 
            id_fecha_lapso_academico=${this.id_fecha_lapso_academico}
            ;`
        return await this.query(SQL)
    }
}

module.exports = ModuloFechaLapsoAcademico;