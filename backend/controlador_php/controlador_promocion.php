<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
include_once("./driverPostgresql.php");
include_once("../reporte_pdf/reporte_promocion.php");
$driver=new DriverPostgreSql();
$respuesta=[];
// id_reposo_trabajador
// nombrePdf
$result=$driver->query("SELECT * FROM tcintillo WHERE estatu_foto_cintillo='1'");
$result_cintillo=$driver->resultDatos($result);

$SQL="
select *
from tinscripcion,tasignacion_representante_estudiante,tasignacion_aula_profesor,testudiante,tpromocion,trepresentante,tprofesor,ttrabajador,taula,tgrado,tano_escolar where
tpromocion.id_promocion=".$_POST["id_promocion"]." AND
trepresentante.id_cedula_representante = tasignacion_representante_estudiante.id_cedula_representante AND
tasignacion_aula_profesor.id_asignacion_aula_profesor = tinscripcion.id_asignacion_aula_profesor AND
tinscripcion.id_inscripcion = tpromocion.id_inscripcion AND
testudiante.id_estudiante = tinscripcion.id_estudiante AND
tprofesor.id_profesor=tasignacion_aula_profesor.id_profesor AND
ttrabajador.id_cedula=tprofesor.id_cedula AND
tasignacion_aula_profesor.id_aula=taula.id_aula AND
tgrado.id_grado=taula.id_grado AND
tano_escolar.id_ano_escolar=tasignacion_aula_profesor.id_ano_escolar AND
tasignacion_representante_estudiante.id_asignacion_representante_estudiante = tinscripcion.id_asignacion_representante_estudiante;
";
$resultPromocion=$driver->query($SQL);
while($row = pg_fetch_array($resultPromocion)){
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
    $PDF=new PdfPromocion($datosConsulta,$_POST["nombre_usuario"],$datosDirector,$result_cintillo);
    $nombrePdf=$PDF->generarPdf();
    // // print($nombrePdf);
    $respuesta["nombrePdf"]=$nombrePdf;
}
else{
    $respuesta["nombrePdf"]="false";
}

// print_r($reposo);
print(json_encode($respuesta));
?>