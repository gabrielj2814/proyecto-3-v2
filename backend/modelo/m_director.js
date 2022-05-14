const DriverPostgre = require("./driver_postgresql")
const ModuloModelo = require("./m_modulo")

class ModuloDirector extends DriverPostgre{
  constructor() {
    super()

    this.id_director = ""
    this.id_cedula = ""
    this.estatus_director = ""
  }

  setDatos(director){
    this.id_director = director.id_director
    this.id_cedula = director.id_cedula
    this.estatus_director = director.estatus_director
  }

  setIdDirector(id){
    this.id_director= id
  }

  async registrar(){
    const SQL = `INSERT INTO tdirector(id_cedula, estatus_director) VALUES ('${this.id_cedula}','${this.estatus_director}')`

    return await this.query(SQL);
  }

  async consultarTodos() {
    const SQL = "SELECT tdirector.*,ttrabajador.nombres,ttrabajador.apellidos FROM tdirector,ttrabajador WHERE ttrabajador.id_cedula=tdirector.id_cedula"

    return await this.query(SQL);
  }

  async consultar() {
    const SQL = `SELECT * FROM tdirector WHERE id_director=${this.id_director}`

    return await this.query(SQL);
  }

  async consultarActivo() {
    const SQL = `SELECT * FROM tdirector WHERE estatus_director='1'`
    return await this.query(SQL);
  }

  async consultarPatron(patron){
    const SQL = `SELECT tdirector.*,ttrabajador.nombres,ttrabajador.apellidos FROM tdirector,ttrabajador WHERE tdirector.id_cedula LIKE '%${patron}%' 
        AND ttrabajador.id_cedula=tdirector.id_cedula`
    return await this.query(SQL);
  }

  async actualizar(){
    const SQL = `UPDATE tdirector SET id_cedula= '${this.id_cedula}', estatus_director = '${this.estatus_director}'
              WHERE id_director=${this.id_director}
    `

    return await this.query(SQL);
  }
}

module.exports = ModuloDirector;
