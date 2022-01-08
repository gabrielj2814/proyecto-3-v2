const PostgreDriver=require("./driver_postgresql")

class ModeloLapsoAcademico extends PostgreDriver{


    constructor(){
        super();
        this.id_lapso_academico="";
        this.id_planificacion_lapso_escolar="";
        this.nombre_lapso_academico="";
        this.estatu_lapso_academico="";
        this.fecha_de_creacion_lapso_academico="";
    }

    setDatos(datos){
        this.id_lapso_academico=datos.id_lapso_academico;
        this.id_planificacion_lapso_escolar=datos.id_planificacion_lapso_escolar;
        this.nombre_lapso_academico=datos.nombre_lapso_academico;
        this.estatu_lapso_academico=datos.estatu_lapso_academico;
        this.fecha_de_creacion_lapso_academico=datos.fecha_de_creacion_lapso_academico;
    }

    setIdLapsoAcademico(id){
        this.id_lapso_academico=id;
    }

    setIdPlanificacionLapsoescolar(id){
        this.id_planificacion_lapso_escolar=id;
    }

    async creatLapsoAcademico(){
        const SQL=`
        INSERT INTO tlapso_academico(
            id_planificacion_lapso_escolar,
            nombre_lapso_academico,
            estatu_lapso_academico,
            fecha_de_creacion_lapso_academico
        )
        VALUES(
            ${this.id_planificacion_lapso_escolar},
            '${this.nombre_lapso_academico}',
            '${this.estatu_lapso_academico}',
            '${this.fecha_de_creacion_lapso_academico}'
        )
        RETURNING id_lapso_academico;`;
        return await this.query(SQL)
    }

    async consultarlapsoPorPalnificacion($id){
        const SQL=`
        SELECT * FROM
        tlapso_academico
        WHERE 
        id_planificacion_lapso_escolar=${$id}`
        return await this.query(SQL);
    }


}

module.exports= ModeloLapsoAcademico