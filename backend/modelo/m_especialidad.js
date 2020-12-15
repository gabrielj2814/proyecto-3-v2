const DriverPostgre=require("./driver_postgresql")

class EspecialidadModelo extends DriverPostgre {

    constructor(){
        super()
        this.id_especialidad=""
        this.nombre_especialidad=""
        this.estatu_especialidad=""
    }

    setIdEspecialidad(id){
        this.id_especialidad=id
    }

    setDatos(especialidad){
        this.id_especialidad=especialidad.id_especialidad
        this.nombre_especialidad=especialidad.nombre_especialidad
        this.estatu_especialidad=especialidad.estatu_especialidad
    }

    async consultarTodosModelo(){
        const SQL="SELECT * FROM tespecialidad;"
        console.log(SQL)
        return await this.query(SQL)
    }

    async consultarModelo(){
        const SQL=`SELECT * FROM tespecialidad WHERE id_especialidad=${this.id_especialidad};`
        // console.log(SQL)
        return await this.query(SQL)
    }

    registrarModelo(){
        const SQL=`INSERT INTO tespecialidad(nombre_especialidad,estatu_especialidad) VALUES('${this.nombre_especialidad}','${this.estatu_especialidad}');`
        // console.log(SQL)
        this.query(SQL)
    }

    actualizarModelo(){
        const SQL=`UPDATE tespecialidad SET nombre_especialidad='${this.nombre_especialidad}',estatu_especialidad='${this.estatu_especialidad}' WHERE id_especialidad=${this.id_especialidad}`
        // console.log(SQL)
        this.query(SQL)
    }

    async consultarEspecialidadPatronModelo(patron){
        const SQL=`SELECT * FROM tespecialidad WHERE nombre_especialidad LIKE '%${patron}%';`
        // console.log(SQL)
        return await this.query(SQL)
    }

}

module.exports = EspecialidadModelo