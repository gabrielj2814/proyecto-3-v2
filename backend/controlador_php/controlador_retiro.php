<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
include_once("../reporte_pdf/reporte_retiro.php");
include_once("./driverPostgresql.php");
$driver=new DriverPostgreSql();
$respuesta=[];
$SQL="";
$datosConsulta=[];
// print_r($_POST);
$result=$driver->query("SELECT * FROM tcintillo WHERE estatu_foto_cintillo='1'");
$result_cifrado=$driver->resultDatos($result);

$SQL="
select *
from tinscripcion,tasignacion_representante_estudiante,tasignacion_aula_profesor,testudiante,tretiro,trepresentante,tprofesor,ttrabajador,taula,tgrado,tano_escolar where
tretiro.id_retiro=".$_POST["id_retiro"]." AND
trepresentante.id_cedula_representante = tasignacion_representante_estudiante.id_cedula_representante AND
tasignacion_aula_profesor.id_asignacion_aula_profesor = tinscripcion.id_asignacion_aula_profesor AND
tinscripcion.id_inscripcion = tretiro.id_inscripcion AND
testudiante.id_estudiante = tinscripcion.id_estudiante AND
tprofesor.id_profesor=tasignacion_aula_profesor.id_profesor AND
ttrabajador.id_cedula=tprofesor.id_cedula AND
tasignacion_aula_profesor.id_aula=taula.id_aula AND
tgrado.id_grado=taula.id_grado AND
tano_escolar.id_ano_escolar=tasignacion_aula_profesor.id_ano_escolar AND
tasignacion_representante_estudiante.id_asignacion_representante_estudiante = tinscripcion.id_asignacion_representante_estudiante;
";
$resultRetiro=$driver->query($SQL);
while($row = pg_fetch_array($resultRetiro)){
    // print("-------");
    // print_r($row);
    $datosConsulta[]=$row;
}

$SQLDirector="
SELECT * FROM
tdirector,
ttrabajador
WHERE 
tdirector.estatus_director='1' AND
ttrabajador.id_cedula=tdirector.id_cedula;
";
$resultDirector=$driver->query($SQLDirector);
$datosDirector=[];
while($row = pg_fetch_array($resultDirector)){
    // print("-------");
    // print_r($row);
    $datosDirector[]=$row;
}

// print_r($datosConsulta);
if(count($datosConsulta)>0){
    $PDF=new PdfRetiro($datosConsulta,$_POST["nombre_usuario"],$datosDirector,$result_cifrado);
    $nombrePdf=$PDF->generarPdf();
    // // print($nombrePdf);
    $respuesta["nombrePdf"]=$nombrePdf;
 }
 else{
    $respuesta["nombrePdf"]="false";
 }


print(json_encode($respuesta));

?>