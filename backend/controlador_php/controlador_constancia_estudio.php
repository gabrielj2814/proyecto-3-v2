<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
include_once("../reporte_pdf/reporte_constancia_estudio.php");
include_once("./driverPostgresql.php");
$driver=new DriverPostgreSql();
$respuesta=[];
$SQL="";
$datosConsulta=[];
// print_r($_POST);
$result_cintillo=$driver->query("SELECT * FROM tcintillo WHERE estatu_foto_cintillo='1'");
$result_cintillo=$driver->resultDatos($result_cintillo);

$SQL="
select *
from tinscripcion,tasignacion_representante_estudiante,tasignacion_aula_profesor,testudiante,trepresentante,tprofesor,ttrabajador,taula,tgrado,tano_escolar where
tinscripcion.id_inscripcion=".$_POST["id_inscripcion"]." AND
trepresentante.id_cedula_representante = tasignacion_representante_estudiante.id_cedula_representante AND
tasignacion_aula_profesor.id_asignacion_aula_profesor = tinscripcion.id_asignacion_aula_profesor AND
testudiante.id_estudiante = tinscripcion.id_estudiante AND
tprofesor.id_profesor=tasignacion_aula_profesor.id_profesor AND
ttrabajador.id_cedula=tprofesor.id_cedula AND
tasignacion_aula_profesor.id_aula=taula.id_aula AND
tgrado.id_grado=taula.id_grado AND
tano_escolar.id_ano_escolar=tasignacion_aula_profesor.id_ano_escolar AND
tasignacion_representante_estudiante.id_asignacion_representante_estudiante = tinscripcion.id_asignacion_representante_estudiante;
";
$result=$driver->query($SQL);
while($row = pg_fetch_array($result)){
    // print("-------");
    // print_r($row);
    $SQL2="SELECT * FROM 
    tparroquia,
    tciudad,
    testado WHERE 
    tparroquia.id_parroquia=".$row["id_parroquia_nacimiento"]." AND
    tciudad.id_ciudad=tparroquia.id_ciudad AND
    testado.id_estado=tciudad.id_estado
    ";
    $row["ubicacion"]=null;
    $resultUbicacion=$driver->query($SQL2);
    while($row2 = pg_fetch_array($resultUbicacion)){
        // print("-------");
        // print_r($row);
        $row["ubicacion"]=$row2;
    }
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
    $PDF=new PdfConstanciaEstudio($datosConsulta,$_POST["nombre_usuario"],$datosDirector,$result_cintillo);
    $nombrePdf=$PDF->generarPdf($_POST["fecha"]);
    // print($nombrePdf);
    
    $respuesta["nombrePdf"]=$nombrePdf;
}
else{
    $respuesta["nombrePdf"]="false";
}


print(json_encode($respuesta));



?>