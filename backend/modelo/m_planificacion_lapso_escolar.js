const PostgreDriver=require("./driver_postgresql")

class ModeloPlanificacionLapsoEscolar extends PostgreDriver{


    constructor(){
        super();
        this.id_planificacion_lapso_escolar="";
        this.id_asignacion_aula_profesor="";
        this.fecha_de_creacion_planificacion_lapso_escolar="";
    }

    setDatos(datos){
        this.id_planificacion_lapso_escolar=datos.id_planificacion_lapso_escolar;
        this.id_asignacion_aula_profesor=datos.id_asignacion_aula_profesor;
        this.fecha_de_creacion_planificacion_lapso_escolar=datos.fecha_de_creacion_planificacion_lapso_escolar;
    }

    setIdPlanificacionLapsoescolar(id){
        this.id_planificacion_lapso_escolar=id;
    }
    
    setIdAsignacionAulaProfesor(id){
        this.id_asignacion_aula_profesor=id;
    }

    async registrarPlanificacion(){
        const SQL=`
            INSERT INTO tplanificacion_lapso_escolar(
                id_asignacion_aula_profesor,
                fecha_de_creacion_planificacion_lapso_escolar
            )
            VALUES(
                ${this.id_asignacion_aula_profesor},
                '${this.fecha_de_creacion_planificacion_lapso_escolar}'
            ) RETURNING id_planificacion_lapso_escolar ;
        `;
        return await this.query(SQL);
    }

    async consultarIdPlanificaionAsignacionAula(){
        const SQL=`
        SELECT * FROM
        tplanificacion_lapso_escolar,
        tasignacion_aula_profesor,
        tano_escolar
        WHERE
        tplanificacion_lapso_escolar.id_asignacion_aula_profesor=${this.id_asignacion_aula_profesor} AND
        tasignacion_aula_profesor.id_asignacion_aula_profesor=tplanificacion_lapso_escolar.id_asignacion_aula_profesor AND
        tano_escolar.id_ano_escolar=tasignacion_aula_profesor.id_ano_escolar
        
        `;
        return await this.query(SQL);
    }

    async consultarIdAsignacinoAulaProfesor(id_cedula){
        const SQL=`
        SELECT tasignacion_aula_profesor.id_asignacion_aula_profesor,tano_escolar.id_ano_escolar,tano_escolar.ano_desde,tano_escolar.ano_hasta FROM
        ttrabajador,
        tprofesor,
        tasignacion_aula_profesor,
        tano_escolar
        WHERE
        ttrabajador.id_cedula='${id_cedula}' AND 
        tprofesor.id_cedula=ttrabajador.id_cedula AND 
        tprofesor.estatus_profesor='1' AND 
        tasignacion_aula_profesor.id_profesor=tprofesor.id_profesor AND 
        tano_escolar.id_ano_escolar=tasignacion_aula_profesor.id_ano_escolar AND
        (tano_escolar.seguimiento_ano_escolar='1' OR
        tano_escolar.seguimiento_ano_escolar='2');
        `;
        return await this.query(SQL);
    }


}

module.exports= ModeloPlanificacionLapsoEscolar