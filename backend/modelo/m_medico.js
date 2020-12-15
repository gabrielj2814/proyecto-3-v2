const DriverPostgre=require("./driver_postgresql")

class MedicoModelo extends DriverPostgre{

    constructor(){
        super()
        this.id_medico=""
        this.nombre_medico=""
        this.apellido_medico=""
    }

    setIdMedico(id){
        this.id_medico=id
    }

    setDatos(medico){
        this.id_medico=medico.id_medico
        this.nombre_medico=medico.nombre_medico
        this.apellido_medico=medico.apellido_medico
    }

    async consultarTodosModelo(){
        const SQL="SELECT * FROM tmedico;"
        // console.log(SQL)
        return await this.query(SQL)
    }

    async consultarModelo(){
        const SQL=`SELECT * FROM tmedico WHERE id_medico='${this.id_medico}';`
        // console.log(SQL)
        return await this.query(SQL)
    }

    registrarModelo(){
        const SQL=`INSERT INTO tmedico(id_medico,nombre_medico,apellido_medico) VALUES('${this.id_medico}','${this.nombre_medico}','${this.apellido_medico}');`
        // console.log(SQL)
        this.query(SQL)
    }

    actualizarModelo(){
        const SQL=`UPDATE tmedico SET nombre_medico='${this.nombre_medico}',apellido_medico='${this.apellido_medico}' WHERE id_medico='${this.id_medico}';`
        // console.log(SQL)
        this.query(SQL)
    }

    async consultarMedicoPatronModelo(patron){
        const SQL=`SELECT * FROM tmedico WHERE id_medico LIKE '%${patron}%' OR nombre_medico LIKE '%${patron}%';`
        console.log(SQL)
        return await this.query(SQL)
    }

}

module.exports = MedicoModelo