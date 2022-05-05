<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
include_once("../reporte_pdf/reporte_asistencia_semanal_estudiante.php");
include_once("./driverPostgresql.php");
$driver=new DriverPostgreSql();
$respuesta=[];
$SQL="";
// $datosConsulta=[];
// print_r($_POST["estudiantes"]);
$result=$driver->query("SELECT * FROM tcintillo WHERE estatu_foto_cintillo='1'");
$result_cifrado=$driver->resultDatos($result);
foreach($_POST["estudiantes"] AS $key => $estudiante){
    $_POST["estudiantes"][$key]["asistencias"]=[];
    $id_inscripcion=$_POST["estudiantes"][$key]["id_inscripcion"];
    foreach($_POST["listaFecha"] AS $fecha){
        $SQL="SELECT * FROM tasistencia_estudiante 
        WHERE 
        id_inscripcion=".$id_inscripcion." AND
        fecha_asistencia_estudiante='".$fecha."';";
        $_POST["estudiantes"][$key]["asistencias"][$fecha]=[];
        $result=$driver->query($SQL);
        while($row = pg_fetch_array($result)){
            // print("-------");
            // print_r($row);
            $_POST["estudiantes"][$key]["asistencias"][$fecha]=$row;
        }
    }
    // ======
    // ======
    // ======
    $SQL2="
    select *
    from tinscripcion,tasignacion_aula_profesor,tprofesor,ttrabajador,taula,tgrado,tano_escolar where
    tasignacion_aula_profesor.id_asignacion_aula_profesor = tinscripcion.id_asignacion_aula_profesor AND
    tinscripcion.id_inscripcion =".$_POST["estudiantes"][$key]["id_inscripcion"]."AND
    tprofesor.id_profesor=tasignacion_aula_profesor.id_profesor AND
    ttrabajador.id_cedula=tprofesor.id_cedula AND
    tasignacion_aula_profesor.id_aula=taula.id_aula AND
    tgrado.id_grado=taula.id_grado AND
    tano_escolar.id_ano_escolar=tasignacion_aula_profesor.id_ano_escolar;
    ";
    $resultInscripcion=$driver->query($SQL2);
    while($row = pg_fetch_array($resultInscripcion)){
        // print("-------");
        // print_r($row);
        $_POST["estudiantes"][$key]["datosExtra"]=$row;
    }

}
$estudiantes=$_POST["estudiantes"];
if(count($estudiante)>0){
    $PDF=new PdfAsistenciaSemanal($estudiantes,$_POST["listaFecha"],$_POST["nombre_usuario"],$result_cifrado);
    $nombrePdf=$PDF->generarPdf();
    // print($nombrePdf);
    $respuesta["nombrePdf"]=$nombrePdf;
}
else{
    $respuesta["nombrePdf"]="false";
}

print(json_encode($respuesta));
// print_r($_POST["estudiantes"][0]["datosExtra"]);