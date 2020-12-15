const FuncionTrabajadorModelo=require("../modelo/m_funcion_trabajador")

class FuncionTrabajadorControlador extends FuncionTrabajadorModelo{

    constructor(){
        super()
        this.id_funcion_trabajador=""
        this.funcion_descripcion=""
        this.id_tipo_trabajador=""
        this.estatu_funcion_trabajador=""
    }

    async generarId(){
        const funcion=await this.consultarTodosModelo()
        const id=`funt-${(funcion.rows.length)+1}`
        return id
    }

    registrarConstrolador(funcion){
        this.set_datosModelo(funcion)
        this.registrarModelo()
    }

    actualizarControlador(funcion){
        this.set_datosModelo(funcion)
        this.actualizarModelo()
    }

    async consultarControlador(id){
        this.set_datoIdFuncionTrabajador(id)
        return await this.consultarModelo()
    }

    async consultarTodosControlador(){
        return await this.consultarTodosModelo()
    }

    async consultarFuncionXIdTipoTrabajadorControlador(id){
        this.set_datoIdTipoTrabajador(id)
        return await this.consultarFuncionXIdTipoTrabajadorModelo()
    }

    async consultarPatronControlador(patron){
        return await this.consultarPatronModelo(patron)
    }
}

module.exports = FuncionTrabajadorControlador