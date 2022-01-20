const DriverPostgre = require("./driver_postgresql")
const ModuloModelo = require("./m_modulo")

class ModuloVacunaEstudiante extends DriverPostgre {
	constructor(){
		super()
		this.id_vacuna_estudiante = ""
		this.id_estudiante = ""
		this.id_vacuna = ""

	}

	setDatos(vacuna_estudiante){
		this.id_vacuna_estudiante = vacuna_estudiante.id_vacuna_estudiante
		this.id_estudiante = vacuna_estudiante.id_estudiante
		this.id_vacuna = vacuna_estudiante.id_vacuna
	}

	setIdVacunaEstudiante(id){
		this.id_estudiante = id
	}

	async regitrarVacunaEstudiante(){
		const SQL = `INSERT INTO vacuna_estudiante(id_estudiante, id_vacuna) VALUES ('${this.id_estudiante}','${this.id_vacuna}')`

		return await this.query(SQL);
	}

	async eliminarVacunaEstudiante(){
		const SQL = `DELETE FROM vacuna_estudiante WHERE id_estudiante = '${this.id_estudiante}'`
		return await this.query(SQL);
	}
}

module.exports = ModuloVacunaEstudiante;