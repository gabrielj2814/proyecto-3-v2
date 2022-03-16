const DriverPostgres = require("./driver_postgresql")

class ModeloInscripcion extends DriverPostgres {
  constructor(){
    super();
    this.id_inscripcion = "";
    this.id_estudiante = "";
    this.id_asignacion_representante_estudiante = "";
    this.id_asignacion_aula_profesor = "";
    this.fecha_inscripcion = "";
    this.estatus_inscripcion = "";
  }

  setDatos(inscripcion){
    this.id_inscripcion = inscripcion.id_inscripcion;
    this.id_estudiante = inscripcion.id_estudiante;
    this.id_asignacion_representante_estudiante = inscripcion.id_asignacion_representante_estudiante;
    this.id_asignacion_aula_profesor = inscripcion.id_asignacion_aula_profesor;
    this.fecha_inscripcion = inscripcion.fecha_inscripcion;
    this.estatus_inscripcion = inscripcion.estatus_inscripcion;
  }

  setIdInscripcion(id){
    this.id_inscripcion = id
  }

  async registrar(){
    const SQL = `INSERT INTO tinscripcion (id_estudiante, id_asignacion_representante_estudiante, id_asignacion_aula_profesor, fecha_inscripcion, estatus_inscripcion)
                 VALUES ('${this.id_estudiante}', '${this.id_asignacion_representante_estudiante}', '${this.id_asignacion_aula_profesor}', '${this.fecha_inscripcion}',
                   '${this.estatus_inscripcion}')
                 `
    return await this.query(SQL)
  }

  async consultarTodas(){
    const SQL = `SELECT * FROM tinscripcion 
                  JOIN testudiante ON testudiante.id_estudiante = tinscripcion.id_estudiante
                  JOIN tasignacion_aula_profesor ON tasignacion_aula_profesor.id_asignacion_aula_profesor = tinscripcion.id_asignacion_aula_profesor
                `

    // JOIN tasignacion_representante_estudiante ON tasignacion_representante_estudiante.id_asignacion_representante_estudiante = tinscripcion.id_asignacion_representante_estudiante

    return await this.query(SQL)
  }

  async consultar(){
    const SQL = `SELECT * FROM tinscripcion
                 JOIN testudiante ON testudiante.id_estudiante = tinscripcion.id_estudiante
                 JOIN tasignacion_representante_estudiante ON tasignacion_representante_estudiante.id_asignacion_representante_estudiante = tinscripcion.id_asignacion_representante_estudiante
                 JOIN tasignacion_aula_profesor ON tasignacion_aula_profesor.id_asignacion_aula_profesor = tinscripcion.id_asignacion_aula_profesor WHERE
                 tinscripcion.id_inscripcion = ${this.id_inscripcion}
                 `
    return await this.query(SQL);
  }

  async actualizar(){
    const SQL = `UPDATE tinscripcion SET id_estudiante='${this.id_estudiante}', id_asignacion_representante_estudiante='${this.id_asignacion_representante_estudiante}',
                id_asignacion_aula_profesor= '${this.id_asignacion_aula_profesor}', fecha_inscripcion= '${this.fecha_inscripcion}',
                estatus_inscripcion= '${this.estatus_inscripcion}' WHERE id_inscripcion = ${this.id_inscripcion}

    `
    return await this.query(SQL);
  }
}

module.exports = ModeloInscripcion;
