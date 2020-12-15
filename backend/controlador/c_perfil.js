const PerfilModelo= require("../modelo/m_perfil")

class PerfilControlador extends PerfilModelo{

    constructor(){
        super();
        this.id_perfil="";
        this.nombre_perfil="";
        this.estatu_perfil="";
    }

    set_datosControlador(datos){
        this.id_perfil=datos.id_perfil;
        this.nombre_perfil=datos.nombre_perfil;
        this.estatu_perfil=datos.estatu_perfil;
    }

    async generarIdPerfil(){
        const consulta=await this.consultarTodosModelo(),
        numero_id=1+consulta.rows.length,
        id=`prl-${numero_id}`;
        return {id:id}

    }

    registrarControlador(perfil){
        this.set_datosModelo(perfil)
        this.registrarModelo()
    }

    actualizarPerfilControlador(datos){
        this.set_datosModelo(datos)
        this.actualizarModelo()
    }

    async consultarPerfilControlador(id){
        this.set_idPerfil(id)
        const perfil=await this.consultarPerfilModelo()
        return perfil
    }

    async consultarPerfilXPatronControlador(patron){
        return await this.consultarPerfilXPatronModelo(patron)
    }

    async consultarPerfilesControlador(){
        const perfiles=await this.consultarTodosModelo()
        return perfiles
    }

}

module.exports = PerfilControlador