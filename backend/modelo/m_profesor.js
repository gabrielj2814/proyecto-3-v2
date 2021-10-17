const DriverPostgres=require("./driver_postgresql")

class ModeloProfesor extends DriverPostgres{

    constructor(){
        super()
        this.id_profesor=""
        this.id_cedula=""
        this.estatus_profesor=""
    }

    setDatos(profesor){
        this.id_profesor=profesor.id_profesor
        this.id_cedula=profesor.id_cedula
        this.estatus_profesor=profesor.estatus_profesor
    }

    setIdProfesor(id){
        this.id_profesor=id
    }
    
    setIdCedulaProfesor(id){
        this.id_cedula=id
    }

    async registrar(){
        const SQL=`INSERT INTO tprofesor(
            id_cedula,
            estatus_profesor
        ) VALUES(
            '${this.id_cedula}',
            '${this.estatus_profesor}'
        ) RETURNING id_profesor`;
        return await this.query(SQL)
    }

    async consultar(){
        const SQL=`SELECT * FROM tprofesor,ttrabajador WHERE tprofesor.id_profesor=${this.id_profesor} AND  ttrabajador.id_cedula=tprofesor.id_cedula`;
        return await this.query(SQL)
    }
    
    async consultarPorCedula(){
        const SQL=`SELECT * FROM tprofesor,ttrabajador WHERE tprofesor.id_profesor=${this.id_cedula} AND  ttrabajador.id_cedula=tprofesor.id_cedula`;
        return await this.query(SQL)
    }

    async consultarTodos(){
        const SQL=`SELECT * FROM tprofesor,ttrabajador WHERE ttrabajador.id_cedula=tprofesor.id_cedula`;
        return await this.query(SQL)
    }

    async actualizar(){
        const SQL=`UPDATE tprofesor SET
            id_cedula='${this.id_cedula}',
            estatus_profesor='${this.id_profesor}'
            WHERE 
            id_profesor=${this.id_profesor};
        `
        return await this.query(SQL)
    }

}

module.exports= ModeloProfesor