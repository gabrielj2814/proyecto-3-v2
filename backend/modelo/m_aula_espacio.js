const DriverPostgres = require('./driver_postgresql')

class ModeloAulaEspacio extends DriverPostgres {
  constructor(){
    super()
    this.id_aula_espacio = ""
    this.numero_aula_espacio = ""
    this.estatus_aula_espacio = ""
  }

  setDatos(aulaEspacio){
    this.id_aula_espacio = aulaEspacio.id_aula_espacio
    this.numero_aula_espacio = aulaEspacio.numero_aula_espacio
    this.estatus_aula_espacio = aulaEspacio.estatus_aula_espacio
  }

  setIdAulaEspacio(id){
    this.id_aula_espacio = id
  }

  async registrar(){
    const SQL = `INSERT INTO taula_espacio (numero_aula_espacio,estatus_aula_espacio) VALUES 
                  (${this.numero_aula_espacio}, '${this.estatus_aula_espacio}')
                  `

    return await this.query(SQL)
  }

  async consultar(){
    const SQL = `SELECT * FROM taula_espacio WHERE id_aula_espacio=${this.id_aula_espacio}`
    return await this.query(SQL)
  }

  async consultarTodos(){
    const SQL = 'SELECT * FROM taula_espacio'
    return await this.query(SQL)
  }

  async consultarAulaEspacio() {
    const SQL = `SELECT * FROM taula_espacio WHERE numero_aula_espacio=${this.numero_aula_espacio};`
    return await this.query(SQL)
  }

  async actualizar(){
    const SQL = `UPDATE taula_espacio SET numero_aula_espacio = ${this.numero_aula_espacio},
                  estatus_aula_espacio = '${this.estatus_aula_espacio}' WHERE id_aula_espacio=${this.id_aula_espacio}
                  `
    return await this.query(SQL)                  
  }

  // async aulaEspacioActivo(){
  //   const SQL = "SELECT * FROM taula_espacio WHERE estatus_aula_espacio='1' "
  //   return await this.query(SQL)
  // }

  // async aulaEspacioInactivo() {
  //   const SQL = "SELECT * FROM taula_espacio WHERE estatus_aula_espacio='0' "
  //   return await this.query(SQL)
  // }

}

module.exports = ModeloAulaEspacio