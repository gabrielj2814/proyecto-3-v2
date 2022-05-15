const DriverPostgre = require("./driver_postgresql")
const ModuloModelo = require("./m_modulo")

class ModeloEstudiante extends DriverPostgre {

  constructor() {
    super()
    this.id_estudiante = ""
    this.codigo_cedula_escolar = ""
    this.cedula_escolar = ""
    this.cedula_estudiante = ""
    this.nombres_estudiante = ""
    this.apellidos_estudiante = ""
    this.fecha_nacimiento_estudiante = ""
    this.direccion_nacimiento_estudiante = ""
    this.id_parroquia_nacimiento = ""
    this.id_parroquia_vive = ""
    this.enfermedades_estudiante = ""
    this.sexo_estudiante = ""
    this.procedencia_estudiante = ""
    this.vive_con_estudiante = ""
    this.estatus_estudiante = ""
  }

  setDatos(estudiante) {
    this.id_estudiante = estudiante.id_estudiante
    this.cedula_escolar = (estudiante.cedula_escolar != 'No tiene') ? estudiante.cedula_escolar : 'null';
    this.cedula_estudiante = (estudiante.cedula_estudiante != 'No tiene') ? estudiante.cedula_estudiante : 'null';
    this.nombres_estudiante = estudiante.nombres_estudiante
    this.apellidos_estudiante = estudiante.apellidos_estudiante
    this.fecha_nacimiento_estudiante = estudiante.fecha_nacimiento_estudiante
    this.direccion_nacimiento_estudiante = estudiante.direccion_nacimiento_estudiante
    this.id_parroquia_nacimiento = estudiante.id_parroquia_nacimiento
    this.id_parroquia_vive = estudiante.id_parroquia_vive
    this.enfermedades_estudiante = estudiante.enfermedades_estudiante
    this.sexo_estudiante = estudiante.sexo_estudiante
    this.procedencia_estudiante = estudiante.procedencia_estudiante
    this.vive_con_estudiante = estudiante.vive_con_estudiante
    this.estatus_estudiante = estudiante.estatus_estudiante
    this.codigo_cedula_escolar = estudiante.codigo_cedula_escolar
  }

  setIdEstudiante(id) {
    this.id_estudiante = id
  }

  async registrar() {
    let SQL = `INSERT INTO testudiante(codigo_cedula_escolar,cedula_escolar, cedula_estudiante, nombres_estudiante, apellidos_estudiante, fecha_nacimiento_estudiante,
      direccion_nacimiento_estudiante, id_parroquia_nacimiento, id_parroquia_vive, enfermedades_estudiante, sexo_estudiante, procedencia_estudiante, vive_con_estudiante,
      estatus_estudiante) VALUES ('${this.codigo_cedula_escolar}','${this.cedula_escolar}', '${this.cedula_estudiante}', '${this.nombres_estudiante}', '${this.apellidos_estudiante}',
      '${this.fecha_nacimiento_estudiante}', '${this.direccion_nacimiento_estudiante}', '${this.id_parroquia_nacimiento}','${this.id_parroquia_vive}', '${this.enfermedades_estudiante}',
      '${this.sexo_estudiante}','${this.procedencia_estudiante}', '${this.vive_con_estudiante}', '${this.estatus_estudiante}')
      RETURNING id_estudiante`.replace("'null'","null");

      return await this.query(SQL);
    }

  async consultarTodos() {
    const SQL = 'SELECT * FROM testudiante'

    return await this.query(SQL);
  }

  async consultarEstudiantesActivos () {
    const SQL = `SELECT * FROM testudiante WHERE estatus_estudiante='1' `

    return this.query(SQL);
  }

  async consultarEstudiantesInactivos() {
    const SQL = `SELECT * FROM testudiante WHERE estatus_estudiante='0' `

    return this.query(SQL);
  }


  async consultar(){
    const SQL = `SELECT * FROM testudiante WHERE testudiante.id_estudiante=${this.id_estudiante}`

    return await this.query(SQL);
  }

  async consultarpatron(patron) {
    const SQL = `SELECT * FROM testudiante WHERE cedula_escolar LIKE '%${patron}%' OR cedula_estudiante LIKE '%${patron}%' OR
    nombres_estudiante LIKE '%${patron}%' OR apellidos_estudiante LIKE '%${patron}%'`

    return await this.query(SQL);
  }

  async actualizar(){
    const SQL = `UPDATE testudiante SET cedula_escolar='${this.cedula_escolar}', cedula_estudiante='${this.cedula_estudiante}',
    nombres_estudiante='${this.nombres_estudiante}', apellidos_estudiante='${this.apellidos_estudiante}', fecha_nacimiento_estudiante= '${this.fecha_nacimiento_estudiante}',
    direccion_nacimiento_estudiante= '${this.direccion_nacimiento_estudiante}', id_parroquia_nacimiento='${this.id_parroquia_nacimiento}', id_parroquia_vive='${this.id_parroquia_vive}',
    enfermedades_estudiante='${this.enfermedades_estudiante}',sexo_estudiante='${this.sexo_estudiante}', procedencia_estudiante='${this.procedencia_estudiante}', vive_con_estudiante= '${this.vive_con_estudiante}',
    estatus_estudiante='${this.estatus_estudiante}' WHERE id_estudiante='${this.id_estudiante}'`.replace("'null'","null");

    return await this.query(SQL);
  }

  async desctivarEstudiante(){
    const SQL = `UPDATE testudiante SET estatus_estudiante='0' WHERE id_estudiante='${this.id_estudiante}'`;
    return await this.query(SQL);
  }


}

module.exports = ModeloEstudiante;
