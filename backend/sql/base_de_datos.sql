CREATE DATABASE proyecto_3;

CREATE TABLE tperfil(
    id_perfil character varying(6) NOT NULL,
    nombre_perfil character varying(150) NOT NULL,
    estatu_perfil character(1) NOT NULL,
    constraint PK_id_perfil primary key(id_perfil)
);

INSERT INTO tperfil(id_perfil,nombre_perfil,estatu_perfil) VALUES('prl-1','web master','1');

CREATE TABLE tmodulo(
    id_modulo SERIAL,
    id_perfil character varying(6) NOT NULL,
    modulo_principal character varying(200) NOT NULL,
    sub_modulo character varying(200) NOT NULL,
    estatu_modulo character(1) NOT NULL,
    constraint PK_id_modulo primary key(id_modulo),
    constraint FK_id_perfil foreign key(id_perfil) references tperfil(id_perfil) on update cascade on delete cascade
);

INSERT INTO tmodulo(id_perfil,modulo_principal,sub_modulo,estatu_modulo) VALUES('prl-1','/dashboard/configuracion','/acceso','1');
INSERT INTO tmodulo(id_perfil,modulo_principal,sub_modulo,estatu_modulo) VALUES('prl-1','/dashboard/configuracion','/tipo-trabajador','1');
INSERT INTO tmodulo(id_perfil,modulo_principal,sub_modulo,estatu_modulo) VALUES('prl-1','/dashboard/configuracion','/funcion-trabajador','1');
INSERT INTO tmodulo(id_perfil,modulo_principal,sub_modulo,estatu_modulo) VALUES('prl-1','/dashboard/configuracion','/horario','1');
INSERT INTO tmodulo(id_perfil,modulo_principal,sub_modulo,estatu_modulo) VALUES('prl-1','/dashboard/configuracion','/trabajador','1');
INSERT INTO tmodulo(id_perfil,modulo_principal,sub_modulo,estatu_modulo) VALUES('prl-1','/dashboard/configuracion','/medico','1');
INSERT INTO tmodulo(id_perfil,modulo_principal,sub_modulo,estatu_modulo) VALUES('prl-1','/dashboard/configuracion','/especialidad','1');
INSERT INTO tmodulo(id_perfil,modulo_principal,sub_modulo,estatu_modulo) VALUES('prl-1','/dashboard/configuracion','/asignacion-especialidad-medico','1');
INSERT INTO tmodulo(id_perfil,modulo_principal,sub_modulo,estatu_modulo) VALUES('prl-1','/dashboard/configuracion','/estado','1');
INSERT INTO tmodulo(id_perfil,modulo_principal,sub_modulo,estatu_modulo) VALUES('prl-1','/dashboard/configuracion','/ciudad','1');
INSERT INTO tmodulo(id_perfil,modulo_principal,sub_modulo,estatu_modulo) VALUES('prl-1','/dashboard/configuracion','/tipo-cam','1');
INSERT INTO tmodulo(id_perfil,modulo_principal,sub_modulo,estatu_modulo) VALUES('prl-1','/dashboard/configuracion','/cam','1');
INSERT INTO tmodulo(id_perfil,modulo_principal,sub_modulo,estatu_modulo) VALUES('prl-1','/dashboard/configuracion','/reposo','1');
INSERT INTO tmodulo(id_perfil,modulo_principal,sub_modulo,estatu_modulo) VALUES('prl-1','/dashboard/configuracion','/permiso','1');
INSERT INTO tmodulo(id_perfil,modulo_principal,sub_modulo,estatu_modulo) VALUES('prl-1','/dashboard/configuracion','/cintillo-home','1');
INSERT INTO tmodulo(id_perfil,modulo_principal,sub_modulo,estatu_modulo) VALUES('prl-1','/dashboard/transaccion','/permiso-trabajador','1');
INSERT INTO tmodulo(id_perfil,modulo_principal,sub_modulo,estatu_modulo) VALUES('prl-1','/dashboard/transaccion','/reposo-trabajador','1');
INSERT INTO tmodulo(id_perfil,modulo_principal,sub_modulo,estatu_modulo) VALUES('prl-1','/dashboard/transaccion','/asistencia/lista','1');
INSERT INTO tmodulo(id_perfil,modulo_principal,sub_modulo,estatu_modulo) VALUES('prl-1','/dashboard/transaccion','/asistencia','1');
INSERT INTO tmodulo(id_perfil,modulo_principal,sub_modulo,estatu_modulo) VALUES('prl-1','/dashboard/seguridad','/bitacora','1');

CREATE TABLE ttipotrabajador(
    id_tipo_trabajador character varying(8) NOT NULL,
    descripcion_tipo_trabajador character varying(150) NOT NULL,
    estatu_tipo_trabajador character(1) NOT NULL,
    constraint PK_id_tipo_trabajador primary key(id_tipo_trabajador)
);

INSERT INTO ttipotrabajador(id_tipo_trabajador,descripcion_tipo_trabajador,estatu_tipo_trabajador) VALUES('tipot-1','docente a','1');
INSERT INTO ttipotrabajador(id_tipo_trabajador,descripcion_tipo_trabajador,estatu_tipo_trabajador) VALUES('tipot-2','docente b','1');

CREATE TABLE thorario(
    id_horario SERIAL,
    horario_descripcion character varying(150) NOT NULL,
    horario_entrada character varying(7) NOT NULL,
    horario_salida character varying(7) NOT NULL,
    estatu_horario character(1) NOT NULL,
    constraint PK_id_horario primary key(id_horario)
);

INSERT INTO thorario (horario_descripcion,horario_entrada,horario_salida,estatu_horario) VALUES('horario estandar','07:00AM','10:00AM','1');

CREATE TABLE tfunciontrabajador(
    id_funcion_trabajador character varying(10) NOT NULL,
    funcion_descripcion character varying(3000) NOT NULL,
    id_tipo_trabajador character varying(8) NOT NULL,
    estatu_funcion_trabajador character(1) NOT NULL,
    id_horario INTEGER NOT NULL,
    constraint PK_id_funcion_trabajador primary key(id_funcion_trabajador),
    constraint FK_id_tipo_trabajador foreign key(id_tipo_trabajador) references ttipotrabajador(id_tipo_trabajador) on update cascade on delete cascade,
    constraint FK_id_horario foreign key(id_horario) references thorario(id_horario) on update cascade on delete cascade
);

INSERT INTO tfunciontrabajador(id_funcion_trabajador,funcion_descripcion,id_tipo_trabajador,estatu_funcion_trabajador,id_horario) VALUES('funt-1','funcion a','tipot-1','1',1);
INSERT INTO tfunciontrabajador(id_funcion_trabajador,funcion_descripcion,id_tipo_trabajador,estatu_funcion_trabajador,id_horario) VALUES('funt-2','funcion b','tipot-1','1',1);
INSERT INTO tfunciontrabajador(id_funcion_trabajador,funcion_descripcion,id_tipo_trabajador,estatu_funcion_trabajador,id_horario) VALUES('funt-3','funcion c','tipot-2','1',1);
INSERT INTO tfunciontrabajador(id_funcion_trabajador,funcion_descripcion,id_tipo_trabajador,estatu_funcion_trabajador,id_horario) VALUES('funt-4','funcion d','tipot-2','1',1);

CREATE TABLE ttrabajador(
    id_cedula character varying(8) NOT NULL,
    nombres character varying(150) NOT NULL,
    apellidos character varying(150) NOT NULL,
    sexo_trabajador character(1) NOT NULL,
    telefono_movil character varying(11),
    telefono_local character varying(11),
    correo character varying(360) NOT NULL,
    direccion character varying(3000) NOT NULL,
    clave_trabajador character varying(300) NOT NULL,
    grado_instruccion character varying(150) NOT NULL,
    titulo_grado_instruccion character varying(150) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    fecha_ingreso DATE NOT NULL,
    pregunta_1 character varying(250) NOT NULL,
    pregunta_2 character varying(250) NOT NULL,
    respuesta_1 character varying(250) NOT NULL,
    respuesta_2 character varying(250) NOT NULL,
    id_perfil character varying(6) NOT NULL,
    id_funcion_trabajador character varying(10) NOT NULL,
    estatu_trabajador character(1) NOT NULL,
    designacion character(1) NOT NULL,
    estatu_cuenta character(1) NOT NULL,
    fecha_inactividad DATE NULL,
    constraint PK_id_cedula primary key(id_cedula),
    constraint FK_id_perfil_trabajador foreign key(id_perfil) references tperfil(id_perfil) on update cascade on delete cascade,
    constraint FK_id_funcion_trabajador foreign key(id_funcion_trabajador) references tfunciontrabajador(id_funcion_trabajador) on update cascade on delete cascade
);

INSERT INTO ttrabajador(id_cedula,nombres,apellidos,sexo_trabajador,telefono_movil,telefono_local,correo,direccion,grado_instruccion,titulo_grado_instruccion,designacion,fecha_nacimiento,fecha_ingreso,estatu_trabajador,id_perfil,id_funcion_trabajador,pregunta_1,pregunta_2,respuesta_1,respuesta_2,clave_trabajador,estatu_cuenta) VALUES('27636392','gabriel jesus','valera castillo','1','04160430565','04160430565','gabriel@gmail.com','barrio araguaney calle 7','tsu','informatica','1','1998-02-28','1998-02-28','1','prl-1','funt-1','no-tiene','no-tiene','no-tiene','no-tiene','no-tiene-clave','0');

-- ALTER TABLE ttrabajador ADD COLUMN fecha_inactividad DATE NULL;

CREATE TABLE tpermiso(
    id_permiso character varying(8) NOT NULL,
    nombre_permiso character varying(150) NOT NULL,
    dias_permiso character varying(4) NULL,
    estatu_remunerado character(1) NOT NULL,
    estatu_dias_aviles character(1) NOT NULL,
    estatu_permiso character(1) NOT NULL,
    estatu_tipo_permiso character(1) NULL,
    constraint PK_id_permiso primary key(id_permiso)
);

INSERT INTO tpermiso(id_permiso,nombre_permiso,dias_permiso,estatu_remunerado,estatu_dias_aviles,estatu_permiso,estatu_tipo_permiso) VALUES('per-1','permiso x','20','1','1','1','1');

CREATE TABLE tpermisotrabajador(
    id_permiso_trabajador character varying(19) NOT NULL,
    id_cedula character varying(8)  NOT NULL,
    id_permiso character varying(8) NOT NULL,
    fecha_desde_permiso_trabajador DATE NULL,
    fecha_hasta_permiso_trabajador DATE NULL,
    estatu_permiso_trabajador character(1) NOT NULL,-- E significa en espera, A significa aprovado, C significa culminado, D significa denegado, I significa interumpido 
    permiso_trabajador_dias_aviles character varying(3) NOT NULL,
    permiso_trabajador_tipo character varying(2) NOT NULL, -- PN, PR / PN permiso normal / PR permiso de retiro para salir temprano
    numero_permiso INTEGER NOT NULL,
    constraint PK_id_permiso_trabajador primary key(id_permiso_trabajador),
    constraint FK_id_cedula_tpermisotrabajador foreign key(id_cedula) references ttrabajador(id_cedula) on update cascade on delete cascade,
    constraint FK_id_permiso_tpermisotrabajador foreign key(id_permiso) references tpermiso(id_permiso) on update cascade on delete cascade 
);

-- estado del id_permis
-- E -> espera
-- A -> aprovado
-- C -> culminado
-- D -> denegado
-- ALTER TABLE tpermisotrabajador ADD COLUMN numero_permiso INTEGER NULL;
-- DELETE FROM tasistencia; 
-- DELETE FROM tpermisotrabajador; 
-- DELETE FROM treposotrabajador; 


-- INSERT INTO tpermisotrabajador(id_permiso_trabajador,id_cedula,id_permiso,fecha_desde_permiso_trabajador,fecha_hasta_permiso_trabajador,estatu_permiso_trabajador,permiso_trabajador_dias_aviles) VALUES('pert-2020-06-18-1','27636392','per-1','2020-06-18','2020-06-20','A','1');

CREATE TABLE testado(
    id_estado character varying(6) NOT NULL,
    nombre_estado character varying(150) NOT NULL,
    estatu_estado character(1) NOT NULL,
    constraint PK_id_estado primary key(id_estado)
);

INSERT INTO testado(id_estado,nombre_estado,estatu_estado) VALUES('est-1','portuguesa','1');
INSERT INTO testado(id_estado,nombre_estado,estatu_estado) VALUES('est-2','lara','1');

CREATE TABLE tciudad(
    id_ciudad character varying(8) NOT NULL,
    nombre_ciudad character varying(150) NOT NULL,
    id_estado character varying(6) NOT NULL,
    estatu_ciudad character(1) NOT NULL,
    constraint PK_id_ciudad primary key(id_ciudad),
    constraint FK_id_estado_tciudad foreign key(id_estado) references testado(id_estado) on update cascade on delete cascade
);

INSERT INTO tciudad(id_ciudad,nombre_ciudad,id_estado,estatu_ciudad) VALUES('ciu-1','acarigua','est-1','1');
INSERT INTO tciudad(id_ciudad,nombre_ciudad,id_estado,estatu_ciudad) VALUES('ciu-2','araure','est-1','1');
INSERT INTO tciudad(id_ciudad,nombre_ciudad,id_estado,estatu_ciudad) VALUES('ciu-3','barquisimeto','est-2','1');

CREATE TABLE ttipocam(
    id_tipo_cam character varying(7) NOT NULL,
    nombre_tipo_cam character varying(150) NOT NULL,
    estatu_tipo_cam character(1) NOT NULL,
    constraint PK_id_tipo_cam primary key(id_tipo_cam)
);

INSERT INTO ttipocam (id_tipo_cam,nombre_tipo_cam,estatu_tipo_cam) VALUES('tipc-1','tipo cam','1');

CREATE TABLE tcam(
    id_cam SERIAL ,
    nombre_cam character varying(150) NOT NULL,
    telefono_cam character varying(11) NOT NULL,
    direccion_cam character varying(3000) NOT NULL,
    id_tipo_cam character varying(7) NOT NULL,
    id_ciudad character varying(8) NOT NULL,
    estatu_cam character(1) NOT NULL,
    constraint PK_id_cam primary key(id_cam),
    constraint FK_id_tipo_cam_tcam foreign key(id_tipo_cam) references ttipocam(id_tipo_cam) on update cascade on delete cascade,
    constraint FK_id_ciudad_tcam foreign key(id_ciudad) references tciudad(id_ciudad) on update cascade on delete cascade
);

INSERT INTO tcam (nombre_cam,telefono_cam,direccion_cam,id_tipo_cam,id_ciudad,estatu_cam) VALUES('cam x','04160430565','ala verga','tipc-1','ciu-1','1');

CREATE TABLE tmedico(
    id_medico character varying(17) NOT NULL,-- med-2020-02-12-01
    nombre_medico character varying(150) NOT NULL,
    apellido_medico character varying(150) NOT NULL,
    constraint PK_id_medico primary key(id_medico)
);

INSERT INTO tmedico(id_medico,nombre_medico,apellido_medico) VALUES('med-2021-03-17-1','el pelon','de brazzer');

CREATE TABLE tespecialidad(
    id_especialidad SERIAL ,
    nombre_especialidad character varying(150) NOT NULL,
    estatu_especialidad character(1) NOT NULL,
    constraint PK_id_especialidad primary key(id_especialidad)
);

INSERT INTO tespecialidad(nombre_especialidad,estatu_especialidad) VALUES('especialidad uno','1');

CREATE TABLE tasignacionmedicoespecialidad(
    id_asignacion_medico_especialidad character varying(17),
    id_medico character varying(50) NOT NULL,
    id_especialidad INTEGER NOT NULL,
    estatu_asignacion character(1) NOT NULL,
    constraint PK_id_asignacion_medico_especialidad primary key(id_asignacion_medico_especialidad),
    constraint FK_id_medico_tasignacionmedicoespecialidad foreign key(id_medico) references tmedico(id_medico) on update cascade on delete cascade,
    constraint FK_id_especialidad_tasignacionmedicoespecialidad foreign key(id_especialidad) references tespecialidad(id_especialidad) on update cascade on delete cascade
);

INSERT INTO tasignacionmedicoespecialidad(id_asignacion_medico_especialidad,id_medico,id_especialidad,estatu_asignacion) VALUES('ams-2020-06-15-1','med-2021-03-17-1',1,'1');

CREATE TABLE treposo( 
    id_reposo character varying(8) NOT NULL,
    nombre_reposo character varying(150) NOT NULL,
    estatu_reposo character(1) NOT NULL,
    constraint PK_id_reposo primary key(id_reposo)
);

INSERT INTO treposo(id_reposo,nombre_reposo,estatu_reposo) VALUES('repo-1','reposo uno','1');

CREATE TABLE treposotrabajador(
    id_reposo_trabajador character varying(19) NOT NULL,-- repot-2020-05-25-25
    id_cedula character varying(8) NOT NULL,
    id_reposo character varying(8) NOT NULL,
    fecha_desde_reposo_trabajador DATE NOT NULL,
    fecha_hasta_reposo_trabajador DATE NOT NULL,
    estatu_reposo_trabajador character(1) NOT NULL,-- 1 significa activo, 0 significa Inactivo, 2 significa interumpido
    descripcion_reposo_trabajador character varying(3000) NOT NULL,
    id_cam INTEGER NOT NULL,
    id_asignacion_medico_especialidad character varying(17) NOT NULL,--
    total_dias_reposo_trabajador character varying(3),
    total_dias_no_aviles_reposo_trabajador character varying(3),
    cantidad_dias_entrega_reposo_trabajador character varying(2),
    fecha_desde_entrega_reposo_trabajador DATE NOT NULL,
    fecha_hasta_entrega_reposo_trabajador DATE NOT NULL,
    estatu_entrega_reposo character(1),
    numero_reposo INTEGER NOT NULL,
    constraint PK_id_reposo_trabajador primary key(id_reposo_trabajador),
    constraint FK_id_cedula_treposotrabajador foreign key(id_cedula) references ttrabajador(id_cedula) on update cascade on delete cascade,
    constraint FK_id_reposo_treposotrabajador foreign key(id_reposo) references treposo(id_reposo) on update cascade on delete cascade,
    constraint FK_id_cam_treposotrabajador foreign key(id_cam) references tcam(id_cam) on update cascade on delete cascade,
    constraint FK_id_asignacion_medico_especialidad_treposotrabajador foreign key(id_asignacion_medico_especialidad) references tasignacionmedicoespecialidad(id_asignacion_medico_especialidad) on update cascade on delete cascade
);
--  estado de entrega del reposo 
-- estado P en espera
-- estado E entrego
-- estado N no entrego
-- ALTER TABLE treposotrabajador ADD COLUMN numero_reposo INTEGER NULL;

-- INSERT INTO treposotrabajador(id_reposo_trabajador,id_cedula,id_reposo,fecha_desde_reposo_trabajador,fecha_hasta_reposo_trabajador,estatu_reposo_trabajador,descripcion_reposo_trabajador,id_cam,id_asignacion_medico_especialidad) VALUES('repot-2020-05-25-25','27636392','repo-1','2020-06-17','2020-06-20','1','hola mundo SQL',1,'ams-2020-06-15-1');

-- asi-2020-06-27-25
CREATE TABLE  tasistencia(
    id_asistencia character varying(17) NOT NULL,
    id_cedula character varying(8) NOT NULL,
    fecha_asistencia DATE NOT NULL,
    horario_entrada_asistencia character varying(7) NOT NULL,
    horario_salida_asistencia character varying(7) NOT NULL,
    estatu_asistencia character varying(3) NOT NULL,
    estatu_cumplimiento_horario character(1) NOT NULL,
    id_permiso_trabajador character varying(19) NULL,
    observacion_asistencia character varying(3000) NULL,
    constraint PK_id_asistencia primary key(id_asistencia),
    constraint FK_id_cedula_tasistencia foreign key(id_cedula) references ttrabajador(id_cedula) on update cascade on delete cascade,
    constraint FK_id_permiso_trabajador foreign key(id_permiso_trabajador) references tpermisotrabajador(id_permiso_trabajador) on update cascade on delete cascade
);

-- ALTER TABLE tasistencia ADD COLUMN observacion_asistencia character varying(3000) NULL;

CREATE TABLE tvitacora(
    id_vitacora SERIAL,
    id_cedula character varying(8) NOT NULL,
    operacion character varying(6) NOT NULL,
    tabla character varying(150) NOT NULL,
    fecha_operacion DATE NOT NULL,
    aquien character varying(150),
    constraint PK_id_vitacora primary key(id_vitacora),
    constraint FK_id_cedula_tvitacora foreign key(id_cedula) references ttrabajador(id_cedula) on update cascade on delete cascade
);

CREATE TABLE tcintillo(
    id_foto_cintillo serial,
    nombre_foto_cintillo character varying(150) NOT NULL,
    extension_foto_cintillo character varying(5) ,
    fecha_subida_foto DATE NOT NULL,
    hora_subida_foto character varying(10) NOT NULL,-- 12-12-12AM
    estatu_foto_cintillo character(1) NOT NULL,
    constraint PK_id_foto_cintillo primary key(id_foto_cintillo)
);
