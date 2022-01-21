const DriverPostgres = require("./driver_postgresql")

class ModelEnfermedadEstudiante extends DriverPostgres{
  constructor(){
    super();
    this.id_enfermedad_estudiante = "";
    this.id_estudiante = "";
    this.id_enfermedad = "";
  }

  setDatos(enfermedadEstudiante){
    this.id_estudiante = enfermedadEstudiante.id_estudiante;
    this.id_enfermedad = enfermedadEstudiante.id_enfermedad;
  }

  setIdEstudiante(id){
    this.id_estudiante = id;
  }

  async registrar(){    
    const SQL = `INSERT INTO enfermedad_estudiante(id_estudiante, id_enfermedad) 
    VALUES('${this.id_estudiante}','${this.id_enfermedad}');`;
    return await this.query(SQL);
  }

  async eliminar(){
    const SQL_DROP = `DELETE FROM enfermedad_estudiante WHERE id_estudiante = '${this.id_estudiante}';`;
    return await this.query(SQL_DROP);
  }

  async consultar(){
    const SQL = `SELECT * FROM enfermedad_estudiante WHERE id_estudiante = '${this.id_estudiante}' `;
    return await this.query(SQL);
  }
}

module.exports = ModelEnfermedadEstudiante;