const PostgreDriver=require("./driver_postgresql")

class ModeloObjetivoLapsoAcademico extends PostgreDriver{


    constructor(){
        super();
        this.id_objetivo_lapso_academico="";
        this.id_lapso_academico="";
        this.descripcion_objetivo_academico="";
        this.estatu_objetivo_lapso_academico="";
    }

    setDatos(datos){
        this.id_objetivo_lapso_academico=datos.id_objetivo_lapso_academico;
        this.id_lapso_academico=datos.id_lapso_academico;
        this.descripcion_objetivo_academico=datos.descripcion_objetivo_academico;
        this.estatu_objetivo_lapso_academico=datos.estatu_objetivo_lapso_academico;
    }

    setIdObjetivoLapsoAcademico(id){
        this.id_objetivo_lapso_academico=id;
    }
    
    setIdLapsoAcademico(id){
        this.id_lapso_academico=id;
    }

    async crearObjetivo(){
        const SQL=`
        INSERT INTO tobjetivo_lapso_academico(
            id_lapso_academico,
            descripcion_objetivo_academico,
            estatu_objetivo_lapso_academico
        )
        VALUES(
            ${this.id_lapso_academico},
            '${this.descripcion_objetivo_academico}',
            '${this.estatu_objetivo_lapso_academico}'
        )
        RETURNING id_objetivo_lapso_academico; `;
        return await this.query(SQL);
    }
    
    async consultar(){
        const SQL=`SELECT * FORM tobjetivo_lapso_academico WHERE id_objetivo_lapso_academico=${this.id_objetivo_lapso_academico}`;
        return await this.query(SQL);
    }
    
    async eliminar(){
        const SQL=`DELETE FROM tobjetivo_lapso_academico WHERE id_objetivo_lapso_academico=${this.id_objetivo_lapso_academico}`;
        return await this.query(SQL);
    }

    async actualizar(){
        const SQL=`
        UPDATE tobjetivo_lapso_academico SET 
        id_lapso_academico=${this.id_lapso_academico},
        descripcion_objetivo_academico='${this.descripcion_objetivo_academico}',
        estatu_objetivo_lapso_academico='${this.estatu_objetivo_lapso_academico}'
        WHERE 
        id_objetivo_lapso_academico=${this.id_objetivo_lapso_academico}
        `;
        return await this.query(SQL);
    }

    async consultarTodos(){
        const SQL=`SELECT * FROM tobjetivo_lapso_academico`;
        return await this.query(SQL);
    }

    async consultarTodosActivos(){
        const SQL=`SELECT * FROM tobjetivo_lapso_academico WHERE `;
        return await this.query(SQL);
    }

}

module.exports= ModeloObjetivoLapsoAcademico