const DriverPostgre = require("./driver_postgresql")
const ModuloModelo = require("./m_modulo")

class ModeloAsigRepresentanteEstudiante extends DriverPostgre {
  constructor(){
    super()
    this.id_asignacion_representante_estudiante = ""
    this.id_estudiante = ""
    this.id_cedula_representante = ""
    this.tipo_representante = ""
    this.parentesco = ""
    this.estatus_asignacion_representante_estudiante = ""
  }

  setDatos(asigRepresenteEstudiante){
    this.id_asignacion_representante_estudiante = asigRepresenteEstudiante.id_asignacion_representante_estudiante
    this.id_estudiante = asigRepresenteEstudiante.id_estudiante
    this.id_cedula_representante = asigRepresenteEstudiante.id_cedula_representante
    this.tipo_representante = asigRepresenteEstudiante.tipo_representante
    this.parentesco = asigRepresenteEstudiante.parentesco
    this.estatus_asignacion_representante_estudiante = asigRepresenteEstudiante.estatus_asignacion_representante_estudiante
  }

  setIdAsigRepresentanteEstudiante(id){
    this.id_asignacion_representante_estudiante = id
  }

  async registrar(){
    const SQL = `INSERT INTO tasignacion_representante_estudiante(id_estudiante, id_cedula_representante, tipo_representante,
                  parentesco, estatus_asignacion_representante_estudiante) VALUES ('${this.id_estudiante}', '${this.id_cedula_representante}',
                  '${this.tipo_representante}', '${this.parentesco}','${this.estatus_asignacion_representante_estudiante}')
                `
    return await this.query(SQL)
  }

  async consultarTodos(){
    const SQL = `SELECT * FROM tasignacion_representante_estudiante
    JOIN testudiante ON testudiante.id_estudiante = tasignacion_representante_estudiante.id_estudiante
    JOIN trepresentante ON trepresentante.id_cedula_representante = tasignacion_representante_estudiante.id_cedula_representante`;

    return await this.query(SQL)
  }

  async consultar() {
    const SQL = `SELECT * FROM tasignacion_representante_estudiante
                  JOIN testudiante ON testudiante.id_estudiante = tasignacion_representante_estudiante.id_estudiante
                  JOIN trepresentante ON trepresentante.id_cedula_representante = tasignacion_representante_estudiante.id_cedula_representante  WHERE
                  tasignacion_representante_estudiante.id_asignacion_representante_estudiante=${this.id_asignacion_representante_estudiante}
                `
                return await this.query(SQL);
  }
//JOIN tciudad ON tciudad.id_ciudad = testudiante.id_ciudad

  async consultarpatron(patron) {
    const SQL = `SELECT * FROM tasignacion_representante_estudiante
                LEFT JOIN testudiante ON testudiante.id_estudiante = tasignacion_representante_estudiante.id_estudiante
                LEFT JOIN trepresentante ON trepresentante.id_cedula_representante = tasignacion_representante_estudiante.id_cedula_representante
                WHERE testudiante.cedula_escolar LIKE '%${patron}%' OR testudiante.cedula_estudiante LIKE '%${patron}%' OR trepresentante.id_cedula_representante LIKE '%${patron}%'
              `

    return await this.query(SQL)
  }

  async actualizar(){
    const SQL = `UPDATE tasignacion_representante_estudiante SET id_estudiante= '${this.id_estudiante}',
                 id_cedula_representante= '${this.id_cedula_representante}', tipo_representante= '${this.tipo_representante}',
                 parentesco = '${this.parentesco}',estatus_asignacion_representante_estudiante = '${this.estatus_asignacion_representante_estudiante}'
                 WHERE id_asignacion_representante_estudiante = '${this.id_asignacion_representante_estudiante}'
                `

    return await this.query(SQL)
  }

  async consultarAsignacionPorIdEstudiante(idEstudiante) {
    const SQL = `SELECT * FROM tasignacion_representante_estudiante WHERE id_estudiante=${idEstudiante} `
    return await this.query(SQL);
  }

}

module.exports = ModeloAsigRepresentanteEstudiante;
