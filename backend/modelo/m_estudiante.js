const DriverPostgre = require("./driver_postgresql")
const ModuloModelo = require("./m_modulo")

class ModeloEstudiante extends DriverPostgre {

  constructor() {
    super()
    this.id_estudiante = ""
    this.cedula_escolar = ""
    this.cedula_estudiante = ""
    this.nombres_estudiante = ""
    this.apellidos_estudiante = ""
    this.fecha_nacimiento_estudiante = ""
    this.direccion_nacimiento_estudiante = ""
    this.id_ciudad = ""
    this.sexo_estudiante = ""
    this.procedencia_estudiante = ""
    this.escolaridad_estudiante = ""
    this.vive_con_estudiante = ""
    this.estatus_estudiante = ""

  }

  setDatos(estudiante) {
    this.id_estudiante = estudiante.id_estudiante
    this.cedula_escolar = estudiante.cedula_escolar
    this.cedula_estudiante = estudiante.cedula_estudiante
    this.nombres_estudiante = estudiante.nombres_estudiante
    this.apellidos_estudiante = estudiante.apellidos_estudiante
    this.fecha_nacimiento_estudiante = estudiante.fecha_nacimiento_estudiante
    this.direccion_nacimiento_estudiante = estudiante.direccion_nacimiento_estudiante
    this.id_ciudad = estudiante.id_ciudad
    this.sexo_estudiante = estudiante.sexo_estudiante
    this.procedencia_estudiante = estudiante.procedencia_estudiante
    this.escolaridad_estudiante = estudiante.escolaridad_estudiante
    this.vive_con_estudiante = estudiante.vive_con_estudiante
    this.estatus_estudiante = estudiante.estatus_estudiante
  }

  setIdEstudiante(id) {
    this.id_estudiante = id
  }

  async registrar() {
    const SQL = `INSERT INTO testudiante(cedula_escolar, cedula_estudiante, nombres_estudiante, apellidos_estudiante, fecha_nacimiento_estudiante
      direccion_nacimiento_estudiante, id_ciudad, sexo_estudiante, procedencia_estudiante, escolaridad_estudiante, vive_con_estudiante,
      estatus_estudiante) VALUES ('${this.cedula_escolar}', '${this.cedula_estudiante}', '${this.nombres_estudiante}', '${this.apellidos_estudiante}', 
      '${this.fecha_nacimiento_estudiante}', '${this.direccion_nacimiento_estudiante}', '${this.id_ciudad}', '${this.sexo_estudiante}', 
      ${this.procedencia_estudiante}', '${this.escolaridad_estudiante}', '${this.vive_con_estudiante}', '${this.estatus_estudiante}')`

      return await this.query(SQL);
    }

  async consultarTodos() {
    const SQL = 'SELECT * FROM testudiante'

    return await this.query(SQL);
  }

  async consultar(){
    const SQL = `SELECT * FROM testudiante WHERE id_estudiante=${this.id_estudiante}`

    return await this.query(SQL);
  }

  async actualizar(){
    const SQL = `UPDATE testudiante SET cedula_escolar=${this.cedula_escolar}, cedula_estudiante=${this.cedula_estudiante}, 
    nombres_estudiante=${this.nombres_estudiante}, apellidos_estudiante=${this.apellidos_estudiante}, fecha_nacimiento_estudiante= ${this.fecha_nacimiento_estudiante},
    direccion_nacimiento_estudiante= ${this.direccion_nacimiento_estudiante}, id_ciudad=${this.id_ciudad}, sexo_estudiante=${this.sexo_estudiante},
    procedencia_estudiante=${this.procedencia_estudiante}, escolaridad_estudiante=${this.escolaridad_estudiante}, vive_con_estudiante= ${this.vive_con_estudiante}, 
    estatus_estudiante=${this.estatus_estudiante}`

    return await this.query(SQL);
  }


}

module.exports = ModeloEstudiante;