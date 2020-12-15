const ModuloModelo=require("../modelo/m_modulo")

class ModuloControlador extends ModuloModelo{

    constructor(){
        super();
        this.id_modulo="";
        this.id_perfil="";
        this.modulo_principal="";
        this.sub_modulo="";
        this.estatu_modulo="";
    }

    set_datosControlador(datos,id_perfil){
        this.id_perfil=id_perfil;
        this.modulo_principal=datos.modulo_principal;
        this.sub_modulo=datos.sub_modulo;
        this.estatu_modulo=datos.estatu_modulo;
    }

    registrarControlador(modulo,id_perfil){
        this.set_datosModelo(modulo,id_perfil)
        this.registrarModelo()
    }

    actualizarControlador(datos){
        this.set_datosModelo(datos)
        this.actualizarModelo()
    }

    async consultarModuloXIdPerfilControlador(id_perfil){
        this.set_idPerfil(id_perfil)
        const modulos= await this.consultarModuloXIdPerfilModelo()
        return modulos
    }

}

module.exports = ModuloControlador