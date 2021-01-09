// configuracion de API REST CON EXPRESSJS
//modulos app server
const express=require("express"),
app =express(),
logger=require("morgan"),
cors=require("cors");
// importando rutas de los modulos 
const rutas_modulo_login=require("./rutas/login"),
rutas_modulo_acceso=require("./rutas/configuracion/acceso"),
rutas_modulo_permiso=require("./rutas/configuracion/permiso"),
rutas_modulo_tipo_trabajador=require("./rutas/configuracion/tipo-trabajador"),
rutas_modulo_trabajador=require("./rutas/configuracion/trabajador"),
rutas_modulo_funcion_trabajador=require("./rutas/configuracion/funcion-trabajador"),
rutas_modulo_permiso_trabajador=require("./rutas/transaccion/permiso-trabajador"),
rutas_modulo_estado=require("./rutas/configuracion/estado"),
rutas_modulo_ciudad=require("./rutas/configuracion/ciudad"),
rutas_modulo_tipo_cam=require("./rutas/configuracion/tipo-cam"),
rutas_modulo_cam=require("./rutas/configuracion/cam"),
rutas_modulo_medico=require("./rutas/configuracion/medico"),
rutas_modelo_especialidad=require("./rutas/configuracion/especialidad"),
rutas_modulo_asignacion_medico_especialidad=require("./rutas/configuracion/asignacion-medico-especialidad"),
rutas_modulo_reposo=require("./rutas/configuracion/reposo"),
rutas_modulo_reposo_trabajador=require("./rutas/transaccion/reposo-trabajador"),
rutas_modulo_horario=require("./rutas/configuracion/horario"),
rutas_modulo_asistencia=require("./rutas/transaccion/asistencia")
//SET
app.set("puerto",8080)
// USE
app
.use(logger('dev'))
.use(cors())
// rutas de los modulos
.use("/login",rutas_modulo_login)
.use("/configuracion/acceso",rutas_modulo_acceso)
.use("/configuracion/medico",rutas_modulo_medico)
.use("/configuracion/especialidad",rutas_modelo_especialidad)
.use("/configuracion/tipo-cam",rutas_modulo_tipo_cam)
.use("/configuracion/cam",rutas_modulo_cam)
.use("/configuracion/permiso",rutas_modulo_permiso)
.use("/configuracion/tipo-trabajador",rutas_modulo_tipo_trabajador)
.use("/configuracion/trabajador",rutas_modulo_trabajador)
.use("/configuracion/funcion-trabajador",rutas_modulo_funcion_trabajador)
.use("/configuracion/estado",rutas_modulo_estado)
.use("/configuracion/ciudad",rutas_modulo_ciudad)
.use("/configuracion/asignacion-medico-especialidad",rutas_modulo_asignacion_medico_especialidad)
.use("/configuracion/reposo",rutas_modulo_reposo)
.use("/configuracion/horario",rutas_modulo_horario)
.use("/transaccion/permiso-trabajador",rutas_modulo_permiso_trabajador)
.use("/transaccion/reposo-trabajador",rutas_modulo_reposo_trabajador)
.use("/transaccion/asistencia",rutas_modulo_asistencia)

module.exports = app