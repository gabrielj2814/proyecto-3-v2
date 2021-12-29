const DriverPostgre = require("./driver_postgresql")
const ModuloModelo = require("./m_modulo")

class ModuloAnoEscolar extends DriverPostgre {
  constructor(){
    super()

    this.id_ano_escolar = ""
    this.ano_desde = ""
    this.ano_hasta = ""
    this.fecha_inicio_ano_escolar = ""
    this.fecha_cierre_ano_escolar = ""
    this.estatus_ano_escolar = ""
    this.seguimiento_ano_escolar = ""
  }

  setDatos(anoescolar) {
    this.id_ano_escolar = anoescolar.id_ano_escolar
    this.ano_desde = anoescolar.ano_desde
    this.ano_hasta = anoescolar.ano_hasta
    this.fecha_inicio_ano_escolar = anoescolar.fecha_inicio_ano_escolar
    this.fecha_cierre_ano_escolar = anoescolar.fecha_cierre_ano_escolar
    this.estatus_ano_escolar = anoescolar.estatus_ano_escolar
    this.seguimiento_ano_escolar = anoescolar.seguimiento_ano_escolar
  }

  setIdAnoEscolar(id){
    this.id_ano_escolar = id
  }

  async registrar(){
    const SQL = `INSERT INTO tano_escolar(ano_desde, ano_hasta, fecha_inicio_ano_escolar, fecha_cierre_ano_escolar, estatus_ano_escolar, seguimiento_ano_escolar)
                  VALUES('${this.ano_desde}', '${this.ano_hasta}', '${this.fecha_inicio_ano_escolar}', '${this.fecha_cierre_ano_escolar}', 
                  '${this.estatus_ano_escolar}', '${this.seguimiento_ano_escolar}')
                `
    return await this.query(SQL)
  }

  async consultar() {
    const SQL = `SELECT * FROM tano_escolar WHERE id_ano_escolar=${this.id_ano_escolar}`

    return await this.query(SQL);
  }

  async consultarSeguimiento() {
    const SQL = `SELECT * FROM tano_escolar WHERE seguimiento_ano_escolar='2';`

    return await this.query(SQL);
  }
  
  async consultarAnoEscolarActivo() {
    const SQL = `SELECT * FROM tano_escolar WHERE estatus_ano_escolar='1';`

    return await this.query(SQL);
  }

  async consultarTodos() {
    const SQL = 'SELECT * FROM tano_escolar'

    return await this.query(SQL);
  }

  async consultarpatron(patron){
    const SQL = `SELECT * FROM tano_escolar WHERE ano_desde LIKE '%${patron}%' OR ano_hasta LIKE '%${patron}%' `
    return await this.query(SQL);
  }

  async actualizar(){
    const SQL = `UPDATE tano_escolar SET ano_desde ='${this.ano_desde}', ano_hasta=  '${this.ano_hasta}', fecha_inicio_ano_escolar='${this.fecha_inicio_ano_escolar}',
                  fecha_cierre_ano_escolar='${this.fecha_cierre_ano_escolar}', estatus_ano_escolar= '${this.estatus_ano_escolar}',
                  seguimiento_ano_escolar= '${this.seguimiento_ano_escolar}' WHERE id_ano_escolar = '${this.id_ano_escolar}'
               `
    return await this.query(SQL)
  }
}

module.exports = ModuloAnoEscolar;