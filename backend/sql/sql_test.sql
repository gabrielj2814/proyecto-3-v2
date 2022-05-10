select testudiante.* from tpromocion,tinscripcion,tasignacion_aula_profesor,tprofesor,ttrabajador,testudiante,tano_escolar where
      tpromocion.id_inscripcion = tinscripcion.id_inscripcion AND
      tinscripcion.id_estudiante=testudiante.id_estudiante AND
      tasignacion_aula_profesor.id_asignacion_aula_profesor = tinscripcion.id_asignacion_aula_profesor AND
      tasignacion_aula_profesor.id_profesor = tprofesor.id_profesor AND
      ttrabajador.id_cedula= tprofesor.id_cedula AND
      tasignacion_aula_profesor.estatus_asignacion_aula_profesor = '1' AND
      tasignacion_aula_profesor.id_ano_escolar = tano_escolar.id_ano_escolar AND tano_escolar.estatus_ano_escolar = '1';