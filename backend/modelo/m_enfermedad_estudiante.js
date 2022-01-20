const DriverPostgre = require("./driver_postgresql")
const ModuloModelo = require("./m_modulo")

class ModuloEnfermedadEstudiante extends DriverPostgre {
	constructor(){
		super()
		this.id_enfermedad_estudiante = ""
		this.id_estudiante = ""
		this.id_enfermedad = ""

	}

	setDatos(enfermedad_estudiante){
		this.id_enfermedad_estudiante = enfermedad_estudiante.id_enfermedad_estudiante
		this.id_estudiante = enfermedad_estudiante.id_estudiante
		this.id_enfermedad = enfermedad_estudiante.id_enfermedad
	}

	setIdEnfermedadEstudiante(id){
		this.id_estudiante = id
	}

	async regitrarEnfermedadEstudiante(){
		const SQL = `INSERT INTO enfermedad_estudiante(id_estudiante, id_enfermedad) VALUES ('${this.id_estudiante}','${this.id_enfermedad}')`

		return await this.query(SQL);
	}

	async EliminarEnfermedadEstudiante(){
		const SQL = `DELETE FROM enfermedad_estudiante WHERE id_estudiante = '${this.id_estudiante}' `

		return await this.query(SQL);
	}
}

module.exports = ModuloEnfermedadEstudiante;