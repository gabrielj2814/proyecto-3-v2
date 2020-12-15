const DriverPostgre=require("./driver_postgresql")

class HorarioModelo extends DriverPostgre{

    constructor(){
        super()
        this.id_horario=""
        this.horario_entrada=""
        this.horario_salida=""
        this.estatu_horario=""
    }

    setDatos(horario){
        this.id_horario=(horario.id_horario)?horario.id_horario:""
        this.horario_entrada=horario.horario_entrada
        this.horario_salida=horario.horario_salida
        this.estatu_horario=(horario.estatu_horario)?horario.estatu_horario:""
    }

    setId(id){
        this.id_horario=id
    }

    async consultarHorarioActivoModelo(){
        const SQL="SELECT * FROM thorario WHERE estatu_horario='1';"
        return await this.query(SQL)
    }

    registrarModelo(){
        const SQL=`INSERT INTO thorario(horario_entrada,horario_salida,estatu_horario) VALUES('${this.horario_entrada}','${this.horario_salida}','1')`
        this.query(SQL)
    }

    actualizarModelo(){
        const SQL=`UPDATE thorario SET estatu_horario='0'  WHERE id_horario=${this.id_horario}`
        this.query(SQL)
    }

}

module.exports= HorarioModelo