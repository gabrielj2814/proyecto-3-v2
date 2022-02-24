const DriverPostgre=require("./driver_postgresql")

class ModeloFechaInscripcion extends DriverPostgre{

    constructor(){
        super()
        this.id_fecha_incripcion=""
        this.id_ano_escolar=""
        this.fecha_incripcion_desde=""
        this.fecha_incripcion_hasta=""
        this.fecha_tope_inscripcion=""
        this.estado_reapertura_inscripcion=""
    }

    setDatos(datos){
        this.id_fecha_incripcion=datos.id_fecha_incripcion
        this.id_ano_escolar=datos.id_ano_escolar
        this.fecha_incripcion_desde=datos.fecha_incripcion_desde
        this.fecha_incripcion_hasta=datos.fecha_incripcion_hasta
        this.fecha_tope_inscripcion=datos.fecha_tope_inscripcion
        this.estado_reapertura_inscripcion=datos.estado_reapertura_inscripcion
    }

    setIdFechaInscripcion(id){
        this.id_fecha_incripcion=id
    }
    
    setIdAnoEscolar(id){
        this.id_ano_escolar=id
    }

    async registrar(){
        const SQL=`INSERT INTO tfecha_incripcion(
            id_ano_escolar,
            fecha_incripcion_desde,
            fecha_incripcion_hasta,
            fecha_tope_inscripcion,
            estado_reapertura_inscripcion
        )
        VALUES(
            ${this.id_ano_escolar},
            '${this.fecha_incripcion_desde}',
            '${this.fecha_incripcion_hasta}',
            '${this.fecha_tope_inscripcion}',
            '0'
        ) RETURNING id_fecha_incripcion;`;
        return await this.query(SQL)
    }

    async consultar(){
        const SQL=`SELECT * FROM 
        tfecha_incripcion,
        tano_escolar 
        WHERE 
        tfecha_incripcion.id_fecha_incripcion=${this.id_fecha_incripcion} AND 
        tano_escolar.id_ano_escolar=tfecha_incripcion.id_ano_escolar;
        `;
        return await this.query(SQL)
    }
    
    async consultarTodo(){
        const SQL=`SELECT * FROM 
        tfecha_incripcion,
        tano_escolar 
        WHERE 
        tano_escolar.id_ano_escolar=tfecha_incripcion.id_ano_escolar;
        `;
        return await this.query(SQL)
    }
    
    async consultarTodo2(){
        const SQL=`SELECT * FROM 
        tfecha_incripcion,
        tano_escolar 
        WHERE 
        tano_escolar.id_ano_escolar=tfecha_incripcion.id_ano_escolar AND
        (tano_escolar.seguimiento_ano_escolar='1' OR tano_escolar.seguimiento_ano_escolar='2');
        `;
        return await this.query(SQL)
    }

    async actualizar(){
        const SQL=`UPDATE tfecha_incripcion SET
        id_ano_escolar=${this.id_ano_escolar},
        fecha_incripcion_desde='${this.fecha_incripcion_desde}',
        fecha_incripcion_hasta='${this.fecha_incripcion_hasta}',
        fecha_tope_inscripcion='${this.fecha_tope_inscripcion}',
        estado_reapertura_inscripcion='${this.estado_reapertura_inscripcion}'
        WHERE 
        id_fecha_incripcion=${this.id_fecha_incripcion}
        `;
        return this.query(SQL)
    }
    
    async reAbrirInscripcion(){
        const SQL=`UPDATE tfecha_incripcion SET
        estado_reapertura_inscripcion='1'
        WHERE 
        id_fecha_incripcion=${this.id_fecha_incripcion} AND estado_reapertura_inscripcion='0'
        `;
        return this.query(SQL)
    }
    
    async cerrarInscripcion(){
        const SQL=`UPDATE tfecha_incripcion SET
        estado_reapertura_inscripcion='2'
        WHERE 
        id_fecha_incripcion=${this.id_fecha_incripcion} AND estado_reapertura_inscripcion='1'
        `;
        return this.query(SQL)
    }


}

module.exports= ModeloFechaInscripcion;