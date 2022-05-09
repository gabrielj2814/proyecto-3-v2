const DriverPostgres = require("./driver_postgresql")

class ModeloEspecialista extends DriverPostgres{

  constructor(){
    super()
    this.id_especialista = ""
    this.id_cedula = ""
    this.especialidad = ""
    this.estatus_especialista = ""
  }

  setDatos(especialista) {
    this.id_especialista = especialista.id_especialista
    this.id_cedula = especialista.id_cedula
    this.especialidad = especialista.especialidad
    this.estatus_especialista = especialista.estatus_especialista
  }

  setIdEspecialista(id){
    this.id_especialista = id
  }

  setCedulaEspecialista(cedula) {
    this.id_cedula = cedula
  }

  async registrar(){
    const SQL = `INSERT INTO tespecialista(id_cedula,especialidad,estatus_especialista) VALUES
                ('${this.id_cedula}','${this.especialidad}','${this.estatus_especialista}')`

    return await this.query(SQL)
  }

  async consultar(){
    const SQL = `SELECT * FROM tespecialista,ttrabajador WHERE id_especialista = ${this.id_especialista}
                  AND  ttrabajador.id_cedula=tespecialista.id_cedula `

    return await this.query(SQL)
  }

  async consultarPorCedula() {
    const SQL = `SELECT * FROM tespecialista,ttrabajador WHERE tespecialista.id_cedula='${this.id_cedula}'
    AND  ttrabajador.id_cedula=tespecialista.id_cedula`
    return await this.query(SQL)
  }

  async consultarTodos(){
    const SQL = 'SELECT * FROM tespecialista JOIN ttrabajador ON ttrabajador.id_cedula=tespecialista.id_cedula'
    
    return await this.query(SQL)
  }

  async actualizar(){
    const SQL = `UPDATE tespecialista SET id_cedula='${this.id_cedula}',especialidad='${this.especialidad}',
    estatus_especialista= '${this.estatus_especialista}' WHERE  id_especialista = ${this.id_especialista}`

    return await this.query(SQL)
  }

}

module.exports = ModeloEspecialista