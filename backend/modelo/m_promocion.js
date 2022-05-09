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
        this.estatus_promocion= ""
        this.nota_rezacho_promocion= ""
    }

    setIdPromocion(id){
        this.id_promocion=id
    }

    setIdInscripcion(id){
        this.id_inscripcion=id
    }

    setDatos(promocion){
        this.id_promocion=promocion.id_promocion
        this.id_inscripcion=promocion.id_inscripcion
        this.fecha_promocion=promocion.fecha_promocion
        this.descripcion_logro=promocion.descripcion_logro
        this.recomendacion_pariente=promocion.recomendacion_pariente
        this.nota_promocion=promocion.nota_promocion
        this.descripcion_nota_promocion=promocion.descripcion_nota_promocion
        this.dias_promocion=promocion.dias_promocion
        this.estatus_promocion =promocion.estatus_promocion
        this.nota_rezacho_promocion =promocion.nota_rezacho_promocion
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
            estatus_promocion,
            nota_rezacho_promocion
        )
        VALUES(
            ${this.id_inscripcion},
            '${fecha}',
            '${this.descripcion_logro}',
            '${this.recomendacion_pariente}',
            '${this.nota_promocion}',
            '${this.descripcion_nota_promocion}',
            '${this.dias_promocion}',
            '${this.estatus_promocion}',
            '${this.nota_rezacho_promocion}'
        ) RETURNING id_promocion`
        return await this.query(SQL)
    }

    async actualizar(){
        const SQL=`UPDATE tpromocion SET
        descripcion_logro='${this.descripcion_logro}',
        recomendacion_pariente='${this.recomendacion_pariente}',
        nota_promocion='${this.nota_promocion}',
        descripcion_nota_promocion='${this.descripcion_nota_promocion}',
        dias_promocion='${this.dias_promocion}',
        estatus_promocion = '${this.estatus_promocion}',
        nota_rezacho_promocion = '${this.nota_rezacho_promocion}'
        WHERE
        id_inscripcion = ${this.id_inscripcion}
        `
        return await this.query(SQL)
    }

    async consultar(){
        const SQL=`SELECT tpromocion.*,testudiante.*,tprofesor.id_cedula,ttrabajador.nombres,ttrabajador.apellidos
        FROM tpromocion,tinscripcion,testudiante,tasignacion_aula_profesor,tano_escolar,tprofesor,ttrabajador WHERE
        tpromocion.id_inscripcion = tinscripcion.id_inscripcion AND
        tinscripcion.id_estudiante = testudiante.id_estudiante AND
        tasignacion_aula_profesor.id_asignacion_aula_profesor = tinscripcion.id_asignacion_aula_profesor AND
        tasignacion_aula_profesor.id_profesor = tprofesor.id_profesor AND
        tprofesor.id_cedula = ttrabajador.id_cedula AND
        tasignacion_aula_profesor.estatus_asignacion_aula_profesor = '1' AND
        tasignacion_aula_profesor.id_ano_escolar = tano_escolar.id_ano_escolar AND tano_escolar.estatus_ano_escolar = '1' AND
        tpromocion.id_promocion=${this.id_promocion}`
        return await this.query(SQL)
    }

    async consultarTodos(){
      const SQL=`select * from tpromocion,tinscripcion,tasignacion_aula_profesor,tprofesor,ttrabajador,testudiante,tano_escolar where
      tpromocion.id_inscripcion = tinscripcion.id_inscripcion AND
      tinscripcion.id_estudiante=testudiante.id_estudiante AND
      tasignacion_aula_profesor.id_asignacion_aula_profesor = tinscripcion.id_asignacion_aula_profesor AND
      tasignacion_aula_profesor.id_profesor = tprofesor.id_profesor AND
      ttrabajador.id_cedula= tprofesor.id_cedula AND
      tasignacion_aula_profesor.estatus_asignacion_aula_profesor = '1' AND
      tasignacion_aula_profesor.id_ano_escolar = tano_escolar.id_ano_escolar AND tano_escolar.estatus_ano_escolar = '1';`;
      return await this.query(SQL)
    }

    async consultarPorIdInscripcion(){
        const SQL=`SELECT * FROM tpromocion WHERE id_inscripcion=${this.id_inscripcion}`
        return await this.query(SQL)
    }

}

module.exports= ModeloPromocion
