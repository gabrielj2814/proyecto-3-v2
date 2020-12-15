const DriverPostgreSQL=require("./driver_postgresql");

class PerfilModelo extends DriverPostgreSQL{

    constructor(){
        super()
        this.id_perfil="";
        this.nombre_perfil="";
        this.estatu_perfil="";
    }

    set_datosModelo(datos){
        this.id_perfil=datos.id_perfil;
        this.nombre_perfil=datos.nombre_perfil;
        this.estatu_perfil=datos.estatu_perfil;
    }

    set_idPerfil(id){
        this.id_perfil=id;
    }

    registrarModelo(){
        const SQL=`INSERT INTO tperfil(id_perfil,nombre_perfil,estatu_perfil) VALUES('${this.id_perfil}','${this.nombre_perfil}','${this.estatu_perfil}')`
        //console.log(SQL)
        this.query(SQL)
    }

    actualizarModelo(){
        const SQL=`UPDATE tperfil SET nombre_perfil='${this.nombre_perfil}',estatu_perfil='${this.estatu_perfil}' WHERE id_perfil='${this.id_perfil}';`;
        //console.log(SQL)
        this.query(SQL)
    }

    async consultarTodosModelo(){
        const SQL="SELECT * FROM tperfil;"
        //console.log(SQL)
        return await this.query(SQL);

    }

    async consultarPerfilXPatronModelo(patron){
        const SQL=`SELECT * FROM tperfil WHERE id_perfil LIKE '%${patron}%' OR nombre_perfil LIKE '%${patron}%';`
        //console.log(SQL)
        return await this.query(SQL);
    }

    async consultarPerfilModelo(){
        const SQL=`SELECT * FROM tperfil WHERE id_perfil='${this.id_perfil}';`
        //console.log(SQL)
        return await this.query(SQL);
    }

}

module.exports = PerfilModelo