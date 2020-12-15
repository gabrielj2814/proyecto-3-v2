const TipoTrabajadorModelo = require("../modelo/m_tipo_trabajador")

class TipoTrabajadorControlador extends TipoTrabajadorModelo{

    constructor(){
        super()
        this.id_tipo_trabajador=""
        this.descripcion_tipo_trabajador=""
        this.estatu_tipo_trabajador=""
    }

    async generarId(){
        return await this.consultarTodos()
    }

    registrarControlador(tipo_trabajador){
        this.set_datosModelo(tipo_trabajador)
        this.registrarModelo()
    }

    async consultarControlador(id){
        this.set_idTipoTrabajador(id)
        return await this.consultarModelo()
    }

    async consultarTodosTiposTrabajadores(){
        return await this.consultarTodos()
    }

    async consultarTipoTrabajadorPatronControlador(patron){
        return await this.consultarTipoTrabajadorPatronModelo(patron)
    }

    actualizarControlador(tipo_trabajador){
        this.set_datosModelo(tipo_trabajador)
        this.actualizarModelo()
    }
    
}

module.exports = TipoTrabajadorControlador