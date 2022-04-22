class DriverPostgreSQL {

    constructor(){
        const {Pool} =require("pg"),
        config={
            user:"gabriel",
            host:"localhost",

            password:"stark",
            database:"proyecto_4_test"

        }
        this.database=new Pool(config);
    }

    conexion(){
        this.database.connect()
    }

    async conexion2(sql){
        let datos=[]
        await this.database.connect()
        .then (async cliente => {
            console.log("----------Inicio---------");
            console.log("consulta sql =>>> ",sql);
            console.log("----------Fin------------");
            await cliente.query (sql)
            .then(res => {
                cliente.release ();
                // console.log (res.rows [0]);
                datos=res
            })
            .catch (e => {
                cliente.release ();
                console.log (e.stack);
            })
        })
        .finally (() => {
            setTimeout(() => {
                this.database.end(() => {
                console.log("cerrando la conexion con la base de datos")})
            },1000)
        });
        return datos
    }
    async query(sql){
        // return await this.conexion2(sql)
        return await this.conexion2(sql)
        // console.log("----------Inicio---------");
        // console.log("consulta sql ->>>",sql);
        // console.log("----------Fin------------");
        // const respuesta=await this.database.query(sql)

        // return respuesta
    }


}

module.exports = DriverPostgreSQL
