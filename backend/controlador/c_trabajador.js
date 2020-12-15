const TrabajadorModelo=require("../modelo/m_trabajador")

class TrabajadorControlador extends TrabajadorModelo{

    constructor(){
        super()
        this.id_cedula=""
        this.nombres=""
        this.apellidos=""
        this.sexo_trabajador=""
        this.telefono_movil=""
        this.telefono_local=""
        this.correo=""
        this.direccion=""
        this.grado_instruccion=""
        this.designacion=""
        this.fecha_nacimiento=""
        this.fecha_ingreso=""
        this.estatu_trabajador=""
        this.pregunta_1=""
        this.pregunta_2=""
        this.respuesta_1=""
        this.respuesta_2=""
        this.clave_trabajador=""
        this.estatu_cuenta=""
        this.id_perfil=""
        this.id_funcion_trabajador=""
    }

    registrarConstrolador(trabajador){
        this.set_datosRegistrarModelo(trabajador)
        this.registrarModelo()
    }

    async consultarControlador(id){
        this.set_idCedula(id)
        return await this.consultarModelo()
    }

    async consultar(id){//TODO: esta funcion estaciendo importada por reposo trabajador y permiso trabajador OJO al refactorisar
        const result=await this.consultarActivoModelo(id)
        return result.rows.length!=0
    }

    async consultarTodosActivos(){//TODO: esta funcion estaciendo importada por asistencia
        const result=await this.consultarTodosActivoModelo()
        return result
    }

    async consultarTodosControlador(){
        return await this.consultarTodosModelo()
    }

    async consultarPatronControlador(patron){
        return await this.consultarPatronModelo(patron)
    }

    actualizarControlador(trabajador){
        this.set_datosRegistrarModelo(trabajador)
        this.actualizarModelo()
    }

    async encriptarClave(bcrypt,clave){
        const rondas_sal=10
        const sal=await bcrypt.genSaltSync(rondas_sal)
        const hash=await bcrypt.hash(clave,sal)
        return hash
    }

    async activarCuentaControlador(trabajador){
        this.set_datoCuenta(trabajador)
        this.activarCuentaModelo()
    }

}

module.exports = TrabajadorControlador