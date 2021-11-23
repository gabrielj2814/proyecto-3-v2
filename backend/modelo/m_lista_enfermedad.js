const DriverPostgre = require("./driver_postgresql")

class listaEnfermedadModelo extends DriverPostgre {

  constructor() {
    super()
    this.id_enfermedad = ""
    this.nombre_enfermedad = ""
    this.estaus_enfermedad = ""
  }

  setIdEnfermedad(id) {
    this.id_enfermedad = id
  }

  setDatos(enfermedad) {
    this.id_enfermedad = enfermedad.id_enfermedad
    this.nombre_enfermedad = enfermedad.nombre_enfermedad
    this.estaus_enfermedad = enfermedad.estaus_enfermedad
  }

  async registrar(){
    const SQL = `INSERT INTO tlista_enfermedad(nombre_enfermedad, estaus_enfermedad) VALUES('${this.nombre_enfermedad}',
      '${this.estaus_enfermedad}')`
    
    return await this.query(SQL);
  }

  async consultarTodos(){
    const SQL = 'SELECT * FROM tlista_enfermedad'

    return await this.query(SQL)
  }

  async consultar(){
    const SQL = `SELECT * FROM tlista_enfermedad WHERE id_enfermedad=${this.id_enfermedad}`;
    return await this.query(SQL)
  }

  async consultarPatron(patron){
    const SQL = `SELECT * FROM tlista_enfermedad WHERE  nombre_enfermedad LIKE '%${patron}%'`;
    return await this.query(SQL)
  }

  async actualizar() {
    const SQL = `UPDATE tlista_enfermedad SET
        nombre_enfermedad='${this.nombre_enfermedad}',
        estaus_enfermedad='${this.estaus_enfermedad}'
        WHERE id_enfermedad=${this.id_enfermedad}
        `
    return await this.query(SQL)
  }
}

module.exports = listaEnfermedadModelo;