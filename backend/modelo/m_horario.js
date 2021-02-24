const DriverPostgre=require("./driver_postgresql")

class HorarioModelo extends DriverPostgre{

    constructor(){
        super()
        this.id_horario=""
        this.horario_descripcion=""
        this.horario_entrada=""
        this.horario_salida=""
        this.estatu_horario=""
    }

    setDatos(horario){
        this.id_horario=horario.id_horario
        this.horario_descripcion=horario.horario_descripcion
        this.horario_entrada=horario.horario_entrada
        this.horario_salida=horario.horario_salida
        this.estatu_horario=horario.estatu_horario
    }

    setId(id){
        this.id_horario=id
    }

    async consultarHorarioActivoModelo(){
        const SQL="SELECT * FROM thorario WHERE estatu_horario='1';"
        return await this.query(SQL)
    }

    async registrarModelo(){
        const SQL=`INSERT INTO thorario(horario_descripcion,horario_entrada,horario_salida,estatu_horario) VALUES('${this.horario_descripcion}','${this.horario_entrada}','${this.horario_salida}','1')`
        return await this.query(SQL)
    }

    async consultarTodosLosHorarios(){
        const SQL="SELECT * FROM thorario"
        return await this.query(SQL)
    }

    async actualizarHorario(){
        const SQL=`
            UPDATE thorario SET
            horario_descripcion='${this.horario_descripcion}',
            horario_entrada='${this.horario_entrada}',
            horario_salida='${this.horario_salida}',
            estatu_horario='${this.estatu_horario}'
            WHERE 
            id_horario=${this.id_horario}
        `
        return await this.query(SQL)
    }

    actualizarModelo(){
        const SQL=`UPDATE thorario SET estatu_horario='0'  WHERE id_horario=${this.id_horario}`
        this.query(SQL)
    }

}

module.exports= HorarioModelo