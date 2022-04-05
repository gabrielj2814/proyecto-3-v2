const DriverPostgre = require("./driver_postgresql")
const ModuloModelo = require("./m_modulo")


class ModeloRepresentante extends DriverPostgre {
  constructor(){
    super()
    this.id_cedula_representante = ""
    this.nombres_representante = ""
    this.apellidos_representante = ""
    this.fecha_nacimiento_representante = ""
    this.nivel_instruccion_representante = ""
    this.ocupacion_representante = ""
    this.direccion_representante = ""
    this.id_ciudad = ""
    this.telefono_movil_representante = ""
    this.telefono_local_representante = ""
    this.numero_hijos_representante = ""
    this.constitucion_familiar_representante = ""
    this.ingresos_representante = ""
    this.tipo_vivienda_representante  = ""
    this.numero_estudiante_inicial_representante = ""
    this.numero_estudiante_grado_1_representante = ""
    this.numero_estudiante_grado_2_representante = ""
    this.numero_estudiante_grado_3_representante = ""
    this.numero_estudiante_grado_4_representante = ""
    this.numero_estudiante_grado_5_representante = ""
    this.numero_estudiante_grado_6_representante = ""
    this.estatus_representante = ""
    this.id_parroquia = "";

  }

  setDatos(representante) {
    this.id_cedula_representante = representante.id_cedula_representante
    this.nueva_cedula = representante.nueva_cedula
    this.nombres_representante = representante.nombres_representante
    this.apellidos_representante = representante.apellidos_representante
    this.fecha_nacimiento_representante = representante.fecha_nacimiento_representante
    this.nivel_instruccion_representante = representante.nivel_instruccion_representante
    this.ocupacion_representante = representante.ocupacion_representante
    this.direccion_representante = representante.direccion_representante
    this.id_ciudad = representante.id_ciudad
    this.telefono_movil_representante = representante.telefono_movil_representante
    this.telefono_local_representante = representante.telefono_local_representante
    this.numero_hijos_representante = representante.numero_hijos_representante
    this.constitucion_familiar_representante = representante.constitucion_familiar_representante
    this.ingresos_representante = representante.ingresos_representante
    this.tipo_vivienda_representante = representante.tipo_vivienda_representante
    this.numero_estudiante_inicial_representante = representante.numero_estudiante_inicial_representante
    this.numero_estudiante_grado_1_representante = representante.numero_estudiante_grado_1_representante
    this.numero_estudiante_grado_2_representante = representante.numero_estudiante_grado_2_representante
    this.numero_estudiante_grado_3_representante = representante.numero_estudiante_grado_3_representante
    this.numero_estudiante_grado_4_representante = representante.numero_estudiante_grado_4_representante
    this.numero_estudiante_grado_5_representante = representante.numero_estudiante_grado_5_representante
    this.numero_estudiante_grado_6_representante = representante.numero_estudiante_grado_6_representante
    this.estatus_representante = representante.estatus_representante
    this.id_parroquia = representante.id_parroquia
  }

  setIdRepresentante(id) {
    this.id_cedula_representante = id
  }

  async registrar () {
    const SQL = `INSERT INTO trepresentante(id_cedula_representante, nombres_representante,apellidos_representante, fecha_nacimiento_representante,
      nivel_instruccion_representante, ocupacion_representante, direccion_representante, telefono_movil_representante,
      telefono_local_representante, numero_hijos_representante, constitucion_familiar_representante, ingresos_representante, tipo_vivienda_representante,
      numero_estudiante_inicial_representante, numero_estudiante_grado_1_representante, numero_estudiante_grado_2_representante, numero_estudiante_grado_3_representante,
      numero_estudiante_grado_4_representante, numero_estudiante_grado_5_representante, numero_estudiante_grado_6_representante,
      estatus_representante,id_parroquia) VALUES('${this.id_cedula_representante}', '${this.nombres_representante}', '${this.apellidos_representante}',
      '${this.fecha_nacimiento_representante}', '${this.nivel_instruccion_representante}', '${this.ocupacion_representante}', '${this.direccion_representante}',
      '${this.telefono_movil_representante}', '${this.telefono_local_representante}', '${this.numero_hijos_representante}',
      '${this.constitucion_familiar_representante}', '${this.ingresos_representante}', '${this.tipo_vivienda_representante}', '${this.numero_estudiante_inicial_representante}',
      '${this.numero_estudiante_grado_1_representante}', '${this.numero_estudiante_grado_2_representante}', '${this.numero_estudiante_grado_3_representante}',
      '${this.numero_estudiante_grado_4_representante}', '${this.numero_estudiante_grado_5_representante}', '${this.numero_estudiante_grado_6_representante}',
      '${this.estatus_representante}','${this.id_parroquia}')`

    return await this.query(SQL);
  }

  async registroPadres(){
    const SQL = `INSERT INTO trepresentante(id_cedula_representante, nombres_representante,apellidos_representante, fecha_nacimiento_representante,
      nivel_instruccion_representante, ocupacion_representante,telefono_movil_representante,
      telefono_local_representante, constitucion_familiar_representante, ingresos_representante, tipo_vivienda_representante,
      estatus_representante) VALUES('${this.id_cedula_representante}', '${this.nombres_representante}', '${this.apellidos_representante}',
      '${this.fecha_nacimiento_representante}', '${this.nivel_instruccion_representante}', '${this.ocupacion_representante}','${this.telefono_movil_representante}',
      '${this.telefono_local_representante}','${this.constitucion_familiar_representante}', '${this.ingresos_representante}',
      '${this.tipo_vivienda_representante}','${this.estatus_representante}')`

    return await this.query(SQL);
  }

  async consultarTodos() {
    const SQL = 'SELECT * FROM trepresentante'

    return await this.query(SQL);
  }

  async consultar () {
    const SQL = `SELECT * FROM trepresentante JOIN tciudad ON tciudad.id_ciudad=trepresentante.id_ciudad WHERE id_cedula_representante='${this.id_cedula_representante}'`

    return await this.query(SQL);
  }

  async consultarRepresentantesActivos() {
    const SQL = `SELECT * FROM trepresentante WHERE estatus_representante='1' `

    return this.query(SQL);
  }

  async consultarRepresentantesInactivos() {
    const SQL = `SELECT * FROM trepresentante WHERE estatus_representante='0' `

    return this.query(SQL);
  }

  async consultarpatron (patron) {
    const SQL = `SELECT * FROM trepresentante WHERE id_cedula_representante LIKE '%${patron}%' OR nombres_representante LIKE '%${patron}%' OR apellidos_representante LIKE '%${patron}%'`

    return await this.query(SQL);
  }


  async actualizar() {
    const SQL = `UPDATE trepresentante SET nombres_representante='${this.nombres_representante}',
    apellidos_representante='${this.apellidos_representante}', fecha_nacimiento_representante='${this.fecha_nacimiento_representante}',
    nivel_instruccion_representante='${this.nivel_instruccion_representante}', ocupacion_representante='${this.ocupacion_representante}',
    direccion_representante='${this.direccion_representante}', telefono_movil_representante='${this.telefono_movil_representante}',
    telefono_local_representante='${this.telefono_local_representante}',numero_hijos_representante= '${this.numero_hijos_representante}',
    constitucion_familiar_representante='${this.constitucion_familiar_representante}', ingresos_representante='${this.ingresos_representante}',
    tipo_vivienda_representante='${this.tipo_vivienda_representante}', numero_estudiante_inicial_representante='${this.numero_estudiante_inicial_representante}',
    numero_estudiante_grado_1_representante='${this.numero_estudiante_grado_1_representante}', numero_estudiante_grado_2_representante='${this.numero_estudiante_grado_2_representante}',
    numero_estudiante_grado_3_representante='${this.numero_estudiante_grado_3_representante}', numero_estudiante_grado_4_representante='${this.numero_estudiante_grado_4_representante}',
    numero_estudiante_grado_5_representante='${this.numero_estudiante_grado_5_representante}', numero_estudiante_grado_6_representante='${this.numero_estudiante_grado_6_representante}',
    estatus_representante=${this.estatus_representante},id_parroquia=${this.id_parroquia} WHERE id_cedula_representante='${this.id_cedula_representante}'`


    return await this.query(SQL);
  }

  async actualizar_2(nueva_cedula) {
    const SQL = `UPDATE trepresentante SET id_cedula_representante='${this.nueva_cedula}', nombres_representante='${this.nombres_representante}',
    apellidos_representante='${this.apellidos_representante}', fecha_nacimiento_representante='${this.fecha_nacimiento_representante}',
    nivel_instruccion_representante='${this.nivel_instruccion_representante}', ocupacion_representante='${this.ocupacion_representante}',
    direccion_representante='${this.direccion_representante}',telefono_movil_representante='${this.telefono_movil_representante}',
    telefono_local_representante='${this.telefono_local_representante}',numero_hijos_representante= '${this.numero_hijos_representante}',
    constitucion_familiar_representante='${this.constitucion_familiar_representante}', ingresos_representante='${this.ingresos_representante}',
    tipo_vivienda_representante='${this.tipo_vivienda_representante}', numero_estudiante_inicial_representante='${this.numero_estudiante_inicial_representante}',
    numero_estudiante_grado_1_representante='${this.numero_estudiante_grado_1_representante}', numero_estudiante_grado_2_representante='${this.numero_estudiante_grado_2_representante}',
    numero_estudiante_grado_3_representante='${this.numero_estudiante_grado_3_representante}', numero_estudiante_grado_4_representante='${this.numero_estudiante_grado_4_representante}',
    numero_estudiante_grado_5_representante='${this.numero_estudiante_grado_5_representante}', numero_estudiante_grado_6_representante='${this.numero_estudiante_grado_6_representante}',
    estatus_representante=${this.estatus_representante},id_parroquia=${this.id_parroquia} WHERE id_cedula_representante='${this.id_cedula_representante}'`

    return await this.query(SQL);
  }


}

module.exports = ModeloRepresentante;
