const DriverPostgre=require("./driver_postgresql")

class VitacoraModelo extends DriverPostgre{

    constructor(){
        super()
    }


    async consultaSql(SQL){
        return await this.query(SQL)
    }

}

module.exports = VitacoraModelo