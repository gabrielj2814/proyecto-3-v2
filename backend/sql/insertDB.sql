INSERT INTO tperfil(id_perfil,nombre_perfil,estatu_perfil) VALUES('prl-1','web master','1');

INSERT INTO tmodulo(id_perfil,modulo_principal,sub_modulo,estatu_modulo) VALUES('prl-1','/dashboard/configuracion','/asignacion-representante-estudiante','1');
INSERT INTO tmodulo(id_perfil,modulo_principal,sub_modulo,estatu_modulo) VALUES('prl-1','/dashboard/configuracion','/ano-escolar','1');
INSERT INTO tmodulo(id_perfil,modulo_principal,sub_modulo,estatu_modulo) VALUES('prl-1','/dashboard/configuracion','/trabajador','1');

INSERT INTO ttipotrabajador(id_tipo_trabajador,descripcion_tipo_trabajador,estatu_tipo_trabajador) VALUES('tipot-1','docente a','1');
INSERT INTO ttipotrabajador(id_tipo_trabajador,descripcion_tipo_trabajador,estatu_tipo_trabajador) VALUES('tipot-2','docente b','1');

INSERT INTO thorario (horario_descripcion,horario_entrada,horario_salida,estatu_horario) VALUES('horario estandar','07:00AM','10:00AM','1');

INSERT INTO tfunciontrabajador(id_funcion_trabajador,funcion_descripcion,id_tipo_trabajador,estatu_funcion_trabajador,id_horario) VALUES('funt-1','funcion a','tipot-1','1',1);
INSERT INTO tfunciontrabajador(id_funcion_trabajador,funcion_descripcion,id_tipo_trabajador,estatu_funcion_trabajador,id_horario) VALUES('funt-2','funcion b','tipot-1','1',1);
INSERT INTO tfunciontrabajador(id_funcion_trabajador,funcion_descripcion,id_tipo_trabajador,estatu_funcion_trabajador,id_horario) VALUES('funt-3','funcion c','tipot-2','1',1);
INSERT INTO tfunciontrabajador(id_funcion_trabajador,funcion_descripcion,id_tipo_trabajador,estatu_funcion_trabajador,id_horario) VALUES('funt-4','funcion d','tipot-2','1',1);

INSERT INTO ttrabajador(id_cedula,nombres,apellidos,sexo_trabajador,telefono_movil,telefono_local,correo,direccion,grado_instruccion,titulo_grado_instruccion,designacion,fecha_nacimiento,fecha_ingreso,estatu_trabajador,id_perfil,id_funcion_trabajador,pregunta_1,pregunta_2,respuesta_1,respuesta_2,clave_trabajador,estatu_cuenta) VALUES('27636392','gabriel jesus','valera castillo','1','04160430565','04160430565','gabriel@gmail.com','barrio araguaney calle 7','tsu','informatica','1','1998-02-28','1998-02-28','1','prl-1','funt-1','no-tiene','no-tiene','no-tiene','no-tiene','no-tiene-clave','0');

INSERT INTO tpermiso(id_permiso,nombre_permiso,dias_permiso,estatu_remunerado,estatu_dias_aviles,estatu_permiso,estatu_tipo_permiso) VALUES('per-1','permiso x','20','1','1','1','1');

INSERT INTO testado(id_estado,nombre_estado,estatu_estado) VALUES('est-1','portuguesa','1');
INSERT INTO testado(id_estado,nombre_estado,estatu_estado) VALUES('est-2','lara','1');

INSERT INTO tciudad(id_ciudad,nombre_ciudad,id_estado,estatu_ciudad) VALUES('ciu-1','acarigua','est-1','1');
INSERT INTO tciudad(id_ciudad,nombre_ciudad,id_estado,estatu_ciudad) VALUES('ciu-2','araure','est-1','1');
INSERT INTO tciudad(id_ciudad,nombre_ciudad,id_estado,estatu_ciudad) VALUES('ciu-3','barquisimeto','est-2','1');

INSERT INTO ttipocam (id_tipo_cam,nombre_tipo_cam,estatu_tipo_cam) VALUES('tipc-1','tipo cam','1');

INSERT INTO tcam (nombre_cam,telefono_cam,direccion_cam,id_tipo_cam,id_ciudad,estatu_cam) VALUES('cam x','04160430565','ala verga','tipc-1','ciu-1','1');

INSERT INTO tmedico(id_medico,nombre_medico,apellido_medico) VALUES('med-2021-03-17-1','el pelon','de brazzer');

INSERT INTO tespecialidad(nombre_especialidad,estatu_especialidad) VALUES('especialidad uno','1');

INSERT INTO tasignacionmedicoespecialidad(id_asignacion_medico_especialidad,id_medico,id_especialidad,estatu_asignacion) VALUES('ams-2020-06-15-1','med-2021-03-17-1',1,'1');

INSERT INTO treposo(id_reposo,nombre_reposo,estatu_reposo) VALUES('repo-1','reposo uno','1');
