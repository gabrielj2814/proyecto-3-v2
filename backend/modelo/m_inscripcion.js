const DriverPostgres = require("./driver_postgresql")

class ModeloInscripcion extends DriverPostgres {
  constructor(){
    super();
    this.id_inscripcion = "";
    this.id_estudiante = "";
    this.id_asignacion_representante_estudiante = "";
    this.id_asignacion_aula_profesor = "";
    this.fecha_inscripcion = "";
    this.estatus_inscripcion = "";

  }

  setDatos(inscripcion){
    this.id_inscripcion = inscripcion.id_inscripcion;
    this.id_estudiante = inscripcion.id_estudiante;
    this.id_asignacion_representante_estudiante = inscripcion.id_asignacion_representante_estudiante;
    this.id_asignacion_aula_profesor = inscripcion.id_asignacion_aula_profesor;
    this.fecha_inscripcion = inscripcion.fecha_inscripcion;
    this.estatus_inscripcion = inscripcion.estatus_inscripcion;

  }

  setIdInscripcion(id){
    this.id_inscripcion = id
  }

  async registrar(){
    const SQL = `INSERT INTO tinscripcion (id_estudiante, id_asignacion_representante_estudiante, id_asignacion_aula_profesor, fecha_inscripcion, estatus_inscripcion)
                 VALUES ('${this.id_estudiante}', '${this.id_asignacion_representante_estudiante}', '${this.id_asignacion_aula_profesor}', '${this.fecha_inscripcion}',
                   '${this.estatus_inscripcion}')
                 `
    return await this.query(SQL)
  }

  /////////////////las funciones que me pediste crear//////////////////////
  
  async anoescolar(){
    const SQL = " SELECT * FROM tano_escolar WHERE estatus_ano_escolar='1' "

    return await this.query(SQL)
  }

  async profTrabajador(){
    const SQL = " SELECT * FROM tprofesor,ttrabajador WHERE tprofesor.id_cedula=ttrabajador.id_cedula AND ttrabajador.id_cedula=tprofesor.id_cedula "
    return await this.query(SQL)
  }

  async asig(){
    const SQL = "SELECT * FROM tasignacion_aula_profesor WHERE id_profesor=tasignacion_aula_profesor.id_profesor AND id_ano_escolar=tasignacion_aula_profesor.id_ano_escolar "
    return await this.query(SQL)
  }

  async estudiante(){
    const SQL = "SELECT * FROM tinscripcion,testudiante WHERE tinscripcion.id_asignacion_aula_profesor=tasignacion_aula_profesor.id_asignacion_aula_profesor AND testudiante.id_estudiante=tinscripcion.id_estudiante"
    return await this.query(SQL)
  }

  ///////////////////////////Y terminan ahi //////////////////////////////



  // async consultarTodas(){
    
  //   const SQL = `SELECT * FROM tinscripcion,tano_escolar,tprofesor,ttrabajador,tasignacion_aula_profesor WHERE 
  //               tano_escolar.estatus_ano_escolar='1' AND
  //               tprofesor.id_profesor='2' AND ttrabajador.id_cedula=tprofesor.id_cedula AND
  //               tasignacion_aula_profesor.id_ano_escolar = tano_escolar.id_ano_escolar AND
  //               tasignacion_aula_profesor.id_asignacion_aula_profesor= 3
                
  //               `
  //               return await this.query(SQL)
  // }
  
  

  async consultar(){
    const SQL = `SELECT * FROM tinscripcion
                 JOIN testudiante ON testudiante.id_estudiante = tinscripcion.id_estudiante
                 JOIN tasignacion_representante_estudiante ON tasignacion_representante_estudiante.id_asignacion_representante_estudiante = tinscripcion.id_asignacion_representante_estudiante
                 JOIN tasignacion_aula_profesor ON tasignacion_aula_profesor.id_asignacion_aula_profesor = tinscripcion.id_asignacion_aula_profesor WHERE
                 tinscripcion.id_inscripcion = ${this.id_inscripcion}
                 `
    return await this.query(SQL);
  }

  async actualizar(){
    const SQL = `UPDATE tinscripcion SET id_estudiante='${this.id_estudiante}', id_asignacion_representante_estudiante='${this.id_asignacion_representante_estudiante}',
                id_asignacion_aula_profesor= '${this.id_asignacion_aula_profesor}', fecha_inscripcion= '${this.fecha_inscripcion}',
                estatus_inscripcion= '${this.estatus_inscripcion}' WHERE id_inscripcion = ${this.id_inscripcion}

    `
    return await this.query(SQL);
  }
}

module.exports = ModeloInscripcion;
