const DriverPostgre = require("./driver_postgresql")

class listaVacunaModelo extends DriverPostgre {

  constructor() {
    super()
    this.id_vacuna = ""
    this.nombre_vacuna = ""
    this.estaus_vacuna = ""
  }

  setIdVacuna(id) {
    this.id_vacuna = id
  }

  setDatos(vacuna) {
    this.id_vacuna = vacuna.id_vacuna
    this.nombre_vacuna = vacuna.nombre_vacuna
    this.estaus_vacuna = vacuna.estaus_vacuna
  }

  async registrar(){
    const SQL = `INSERT INTO tlista_vacuna(nombre_vacuna, estaus_vacuna) VALUES('${this.nombre_vacuna}',
      '${this.estaus_vacuna}')`
    
    return await this.query(SQL);
  }

  async consultarTodos(){
    const SQL = 'SELECT * FROM tlista_vacuna'

    return await this.query(SQL)
  }

  async consultar(){
    const SQL = `SELECT * FROM tlista_vacuna WHERE id_vacuna=${this.id_vacuna}`;
    return await this.query(SQL)
  }

  async actualizar() {
    const SQL = `UPDATE tlista_vacuna SET
        nombre_vacuna='${this.nombre_vacuna}',
        estaus_vacuna='${this.estaus_vacuna}'
        WHERE id_vacuna=${this.id_vacuna}
        `
    return await this.query(SQL)
  }
}

module.exports = listaVacunaModelo;