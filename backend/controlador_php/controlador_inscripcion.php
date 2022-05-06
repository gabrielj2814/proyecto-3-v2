<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
include_once("../reporte_pdf/reporte_inscripcion.php");
include_once("./driverPostgresql.php");
$driver=new DriverPostgreSql();
$respuesta=[];
$SQL="";
$datosConsulta=[];
// print_r($_POST);
$result_cintillo=$driver->query("SELECT * FROM tcintillo WHERE estatu_foto_cintillo='1'");
$result_cintillo=$driver->resultDatos($result_cintillo);

$SQL="SELECT * FROM 
ttrabajador,
tprofesor,
tano_escolar,
tgrado,
taula,
tasignacion_aula_profesor,
tinscripcion,
testudiante
WHERE 
ttrabajador.id_cedula='".$_POST["cedula_usuario"]."' AND
tprofesor.id_cedula=ttrabajador.id_cedula AND
tasignacion_aula_profesor.id_profesor=tprofesor.id_profesor AND
tano_escolar.id_ano_escolar=tasignacion_aula_profesor.id_ano_escolar AND
tano_escolar.estatus_ano_escolar='1' AND
taula.id_aula=tasignacion_aula_profesor.id_aula AND
tgrado.id_grado=taula.id_grado AND
tinscripcion.id_inscripcion=".$_POST["id_inscripcion"]." AND
tinscripcion.id_asignacion_aula_profesor=tasignacion_aula_profesor.id_asignacion_aula_profesor AND
testudiante.id_estudiante=tinscripcion.id_estudiante
;
";
$result=$driver->query($SQL);
while($row = pg_fetch_array($result)){
// print("-------");
// print_r($row);


$SQL3="SELECT * FROM 
tparroquia,
tciudad,
testado WHERE 
tparroquia.id_parroquia=".$row["id_parroquia_nacimiento"]." AND
tciudad.id_ciudad=tparroquia.id_ciudad AND
testado.id_estado=tciudad.id_estado
";
$row["ubicacion"]=null;
$resultUbicacion=$driver->query($SQL3);
while($row3 = pg_fetch_array($resultUbicacion)){
    // print("-------");
    // print_r($row);
    $row["ubicacion"]=$row3;
}
$SQL4="SELECT * FROM 
vacuna_estudiante,
tlista_vacuna
WHERE 
vacuna_estudiante.id_estudiante=".$row["id_estudiante"]." AND
tlista_vacuna.id_vacuna=vacuna_estudiante.id_vacuna;
";
$row["vacunas"]=[];
$vacunas=$driver->query($SQL4);
while($row4 = pg_fetch_array($vacunas)){
    // print("-------");
    // print_r($row);
    $row["vacunas"][]=$row4;
}
$datosConsulta[]=$row;
}
foreach($datosConsulta as $key => $datoConsulta){
    $SQL2="SELECT * FROM 
    trepresentante,
    tasignacion_representante_estudiante
    WHERE 
    tasignacion_representante_estudiante.id_estudiante=".$datoConsulta['id_estudiante']." AND
    trepresentante.id_cedula_representante=tasignacion_representante_estudiante.id_cedula_representante
    ";
    $datosConsulta[$key]["representante"]=[];
    $result2=$driver->query($SQL2);
    while($row2 = pg_fetch_array($result2)){
        print("-------");
        print_r($row2);
        $datosConsulta[$key]["representante"][]=$row2;
    }
}

// print_r($datosConsulta);
if(count($datosConsulta)>0){
   $PDF=new PdfInscripcion($datosConsulta,$_POST["nombre_usuario"],$result_cintillo);
   $nombrePdf=$PDF->generarPdf();
   // // print($nombrePdf);
   $respuesta["nombrePdf"]=$nombrePdf;
}
else{
   $respuesta["nombrePdf"]="false";
}

print(json_encode($respuesta));
?>