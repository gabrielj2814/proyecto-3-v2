const PermisoModelo=require("../modelo/m_permiso")

class PermisoControlador extends PermisoModelo{
    constructor(){
        super()
        this.id_permiso=""
        this.nombre_permiso=""
        this.dias_permiso=0
        this.estatu_permiso=""
        this.estatu_remunerado=""
        this.estatu_dias_aviles=""
    }

    async generarIdPermiso(){
        return await this.consultarTodos()
    }

    registrarControlador(permiso){
        this.set_datosModelo(permiso)
        this.registrarModelo()
    }

    async consultarControlador(id){
        this.set_idPermiso(id)
        return await this.consultarModelo()
    }

    async consultar(id){
        this.set_idPermiso(id)
        const result=await this.consultarActivoModelo()
        return result.rows.length!=0
    }

    async consultarTodosControlador(){
        return await this.consultarTodos()
    }

    async consultarPermisoPatronControlador(patron){
        return await this.consultarPermisoPatronModelo(patron)
    }

    actualizarControlador(permiso){
        this.set_datosModelo(permiso)
        this.actualizarModelo()
    }
}

module.exports = PermisoControlador