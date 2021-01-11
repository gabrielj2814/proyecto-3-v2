class DriverPostgreSQL {

    constructor(){
        const {Pool} =require("pg"),
        config={
            user:"gabriel",
            host:"localhost",
            password:"stark",
            database:"proyecto_3"
        }
        this.database=new Pool(config);
    }

    conexion(){
        this.database.connect()
    }

    async query(sql){
        this.conexion()
        console.log("----------Inicio---------");
        console.log("consulta sql ->>>",sql);
        console.log("----------Fin------------");
        const respuesta=await this.database.query(sql)
        // console.log(respuesta)
        return respuesta
        //console.log("estoy en el driver de conexion")
    }


}

// let driver =new DriverPostgreSQL()
// console.log(driver.query("SELECT * FROM ttrabajador;"))

module.exports = DriverPostgreSQL