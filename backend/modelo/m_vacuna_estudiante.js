const DriverPostgres = require("./driver_postgresql")

class ModelVacunadEstudiante extends DriverPostgres{
  constructor(){
    super();
    this.id_vacuna_estudinte = "";
    this.id_estudiante = "";
    this.id_vacuna = "";
  }

  setDatos(vacunaEstudiante){
    this.id_estudiante = vacunaEstudiante.id_estudiante;
    this.id_vacuna = vacunaEstudiante.id_vacuna;
  }

  setIdEstudiante(id){
    this.id_estudiante = id;
  }

  async registrar(){    
    const SQL = `INSERT INTO vacuna_estudiante(id_estudiante, id_vacuna) 
    VALUES('${this.id_estudiante}','${this.id_vacuna}');`;
    return await this.query(SQL);
  }

  async eliminar(){
    const SQL_DROP = `DELETE FROM vacuna_estudiante WHERE id_estudiante = '${this.id_estudiante}';`;
    return await this.query(SQL_DROP);
  }

  async consultar(){
    const SQL = `SELECT * FROM vacuna_estudiante WHERE id_estudiante = '${this.id_estudiante}' `;
    return await this.query(SQL);
  }
}

module.exports = ModelVacunadEstudiante;