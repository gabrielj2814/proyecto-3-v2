const express=require("express"),
router=express.Router(),
bodyparser=require("body-parser"),
controladorEstudiante=require("../../../controlador/c_estudiante"),
bitacorra = require("../../../controlador/c_vitacora")


router.use(bodyparser.json())

router.post("/registrar", controladorEstudiante.registrar_estudiante, bitacorra.capturaDatos)//registrar
router.get("/consultar-todos", controladorEstudiante.consultar_todos)// consultar todos
router.get("/consultar-todos/:queEstoyBuscando", controladorEstudiante.consultarTodosLosEstudiantesIncompletos)// consultar todos
router.get("/consultar/:id/:token", controladorEstudiante.consultar, bitacorra.capturaDatos)// consulta especifica
router.get("/consultar-patron/:patron", controladorEstudiante.consultarpatron) //consultar por patron
router.get("/estudiantes-activos", controladorEstudiante.consultarEstudiantesActivos) //consultar todos los estudiantes activos
router.get("/estudiantes-inactivos", controladorEstudiante.consultarEstudiantesInactivos) //consultar todos los estudiantes inactivos
router.put("/actualizar/:id", controladorEstudiante.actualizar, bitacorra.capturaDatos)// actualizar



module.exports = router 