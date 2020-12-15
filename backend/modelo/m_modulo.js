const DrvierPostgreSQL=require("./driver_postgresql")

class ModuloModelo extends DrvierPostgreSQL{

    constructor(){
        super();
        this.id_modulo="";
        this.id_perfil="";
        this.modulo_principal="";
        this.sub_modulo="";
        this.estatu_modulo="";
    }

    set_datosModelo(datos,id_perfil){
        this.id_modulo=(datos.id_modulo)?datos.id_modulo:""
        this.id_perfil=id_perfil;
        this.modulo_principal=datos.modulo_principal;
        this.sub_modulo=datos.sub_modulo;
        this.estatu_modulo=datos.estatu_modulo;
    }

    set_idPerfil(id){
        this.id_perfil=id;
    }

    registrarModelo(){
        const SQL=`INSERT INTO tmodulo(id_perfil,modulo_principal,sub_modulo,estatu_modulo) VALUES('${this.id_perfil}','${this.modulo_principal}','${this.sub_modulo}','${this.estatu_modulo}');`
        //console.log(SQL)
        this.query(SQL)
    }

    actualizarModelo(){
        const SQL=`UPDATE tmodulo SET modulo_principal='${this.modulo_principal}',sub_modulo='${this.sub_modulo}',estatu_modulo='${this.estatu_modulo}' WHERE id_modulo=${this.id_modulo};`
        console.log(SQL)
        this.query(SQL)
    }

    async consultarModuloXIdPerfilModelo(){
        const SQL=`SELECT * FROM tmodulo WHERE id_perfil='${this.id_perfil}';`
        //console.log(SQL);
        return await this.query(SQL)
    }

}

module.exports = ModuloModelo