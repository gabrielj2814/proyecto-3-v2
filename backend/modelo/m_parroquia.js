const DriverPostgres = require("./driver_postgresql")

class ModuloParroquia extends DriverPostgres {
  constructor() {
    super();
    this.id_parroquia = ""
    this.nombre_parroquia = ""
    this.id_ciudad = ""
    this.estatu_parroquia = ""
  }

  setDatos(parroquia){
    this.id_parroquia = parroquia.id_parroquia
    this.nombre_parroquia = parroquia.nombre_parroquia
    this.id_ciudad = parroquia.id_ciudad
    this.estatu_parroquia = parroquia.estatu_parroquia
  }

  setIdParraquia(id){
    this.id_parroquia = id
  }

  async registrar() {
    const SQL = ` INSERT INTO tparroquia (nombre_parroquia,id_ciudad,estatu_parroquia) VALUES ('${this.nombre_parroquia}',
                  '${this.id_ciudad}','${this.estatu_parroquia}') RETURNING id_parroquia;
    `
    return await this.query(SQL)
  }

  async consultarTodos() {
    const SQL = 'SELECT * FROM tparroquia JOIN tciudad ON tciudad.id_ciudad = tparroquia.id_ciudad JOIN testado ON testado.id_estado = tciudad.id_estado'

    return await this.query(SQL);
  }

  async consultar() {
    const SQL = `SELECT * FROM tparroquia JOIN tciudad ON tciudad.id_ciudad = tparroquia.id_ciudad WHERE
    tparroquia.id_parroquia=${this.id_parroquia}`

    return await this.query(SQL);
  }

  async consultarpatron(patron) {
    const SQL = `SELECT * FROM tparroquia JOIN tciudad ON tciudad.id_ciudad = tparroquia.id_ciudad JOIN testado ON testado.id_estado = tciudad.id_estado WHERE tparroquia.nombre_parroquia LIKE '%${patron}%'`

    return await this.query(SQL);
  }

  async consultarParroquiaXCiudadModulo(ciudad){
    const SQL = `SELECT * FROM tparroquia WHERE id_ciudad='${ciudad}'`
    //console.log(SQL)
    return await this.query(SQL)
  }

  async actualizar(){
    const SQL = ` UPDATE tparroquia SET nombre_parroquia= '${this.nombre_parroquia}', id_ciudad= '${this.id_ciudad}',
                  estatu_parroquia= '${this.estatu_parroquia}'

    `
    return await this.query(SQL);
  }
}

module.exports = ModuloParroquia;
