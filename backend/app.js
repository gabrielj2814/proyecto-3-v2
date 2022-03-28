// configuracion de API REST CON EXPRESSJS
//modulos app server
const express=require("express"),
app =express(),
logger=require("morgan"),
cors=require("cors"),
fs=require("fs"),
bodyParser=require("body-parser");
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
rutas_modulo_asistencia=require("./rutas/transaccion/asistencia"),
rutas_modulo_bitacora=require("./rutas/transaccion/bitacora"),
rutas_modulo_cintillo=require("./rutas/configuracion/cintillo")
// --------------------------------
const rutas_modulo_grado=require("./rutas/configuracion/grado")
const rutas_modulo_aula=require("./rutas/configuracion/aula")
const rutas_modulo_estudiante = require("./rutas/configuracion/estudiante")
const rutas_modulo_representante = require("./rutas/configuracion/representante")
const rutas_modulo_asignacion_representante_estudiante = require('./rutas/configuracion/asignacion-representante-estudiante')
const rutas_modulo_profesor = require('./rutas/configuracion/profesor')
const rutas_modulo_ano_escolar = require('./rutas/configuracion/ano-escolar')
const rutas_modulo_asignacion_aula_profesor = require('./rutas/transaccion/asignacion-aula-profesor')
const rutas_modula_lista_enfermedad = require('./rutas/configuracion/enfermedad')
const rutas_modulo_vacuna = require('./rutas/configuracion/vacuna')
const rutas_modulo_vacuna_estudiante = require("./rutas/configuracion/vacuna_estudiante")
const rutas_modulo_enfermedad_estudiante = require("./rutas/configuracion/enfermedad_estudiante")
const rutas_modulo_planificacion_lapso_escolar = require('./rutas/configuracion/planificacion-lapso-escolar')
const rutas_modulo_fecha_inscripcion = require('./rutas/configuracion/fecha_inscripcion')
const rutas_modulo_fecha_lapso_academico = require('./rutas/configuracion/fecha-lapso-academico')
const rutas_modulo_inscripcion = require('./rutas/configuracion/inscripcion')
const rutas_modulo_asistencia_estudiante = require('./rutas/transaccion/asistencia_estudiante')
const rutas_modulo_boleta = require('./rutas/transaccion/boleta')
const rutas_modulo_nota = require('./rutas/transaccion/nota')
const rutas_modulo_promocion = require('./rutas/transaccion/promocion')
const rutas_modulo_parroquia = require('./rutas/configuracion/parroquia')
//SET
app.set("puerto",8080)
// USE
app.use(express.static(__dirname+"/upload"))

app
.use(logger('dev'))
.use(cors())

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
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
.use("/configuracion/cintillo",rutas_modulo_cintillo)
.use("/transaccion/permiso-trabajador",rutas_modulo_permiso_trabajador)
.use("/transaccion/reposo-trabajador",rutas_modulo_reposo_trabajador)
.use("/transaccion/asistencia",rutas_modulo_asistencia)
.use("/transaccion/bitacora",rutas_modulo_bitacora)
//
app.use("/configuracion/grado",rutas_modulo_grado)
app.use("/configuracion/aula",rutas_modulo_aula)
app.use("/configuracion/estudiante", rutas_modulo_estudiante)
app.use("/configuracion/representante", rutas_modulo_representante)
app.use("/configuracion/asignacion-representante-estudiante", rutas_modulo_asignacion_representante_estudiante)
app.use("/configuracion/profesor", rutas_modulo_profesor)
app.use("/configuracion/ano-escolar", rutas_modulo_ano_escolar)
app.use("/configuracion/vacuna", rutas_modulo_vacuna)
app.use("/configuracion/enfermedad", rutas_modula_lista_enfermedad)
app.use("/configuracion/enfermedad_estudiante", rutas_modulo_enfermedad_estudiante)
app.use("/configuracion/vacuna_estudiante", rutas_modulo_vacuna_estudiante)
app.use("/transaccion/asignacion-aula-profesor", rutas_modulo_asignacion_aula_profesor)
app.use("/transaccion/planificacion-lapso-escolar", rutas_modulo_planificacion_lapso_escolar)
app.use("/configuracion/fecha-inscripcion", rutas_modulo_fecha_inscripcion)
app.use("/configuracion/fecha-lapso-academico", rutas_modulo_fecha_lapso_academico)
app.use("/configuracion/inscripcion", rutas_modulo_inscripcion)
app.use("/transaccion/asistencia-estudiante", rutas_modulo_asistencia_estudiante)
app.use("/transaccion/boleta", rutas_modulo_boleta)
app.use("/transaccion/nota", rutas_modulo_nota)
app.use("/transaccion/promocion", rutas_modulo_promocion)
app.use("/configuracion/parroquia", rutas_modulo_parroquia)

// app.get("/ver-imagen",(req,res) => {
//     // console.log(fs.createReadStream(__dirname+"/upload/cintillo/cintillo-2021-02-11_05-11-56PM.png").read())
//     // console.log(fs.createReadStream(__dirname+"/upload/cintillo/cintillo-2021-02-11_05-11-56PM.png"))
//     console.log(__dirname+"\\upload\\cintillo\\cintillo-2021-02-11_05-11-56PM.png")
//     res.writeHead(200,{"Content-Type":"image/png"})
//     fs.createReadStream(__dirname+"\\upload\\cintillo\\cintillo-2021-02-11_05-11-56PM.png").pipe(res)
//     res.end()
// })

module.exports = app
