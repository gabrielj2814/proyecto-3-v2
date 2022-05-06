<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
include_once("../reporte_pdf/reportes_matricula_inical.php");
include_once("../reporte_pdf/reportes_matricula_final.php");
include_once("./driverPostgresql.php");
$driver=new DriverPostgreSql();
$respuesta=[];
$SQL="";
$datosConsulta=[];
// print_r($_POST);
$result=$driver->query("SELECT * FROM tcintillo WHERE estatu_foto_cintillo='1'");
$result_cifrado=$driver->resultDatos($result);

if($_POST["tipo_matricula"]==="I"){
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
    tinscripcion.id_asignacion_aula_profesor=tasignacion_aula_profesor.id_asignacion_aula_profesor AND
    testudiante.id_estudiante=tinscripcion.id_estudiante
    ;
    ";
    $result=$driver->query($SQL);
    while($row = pg_fetch_array($result)){
        // print("-------");
        // print_r($row);
        $datosConsulta[]=$row;
    }
    if(count($datosConsulta)>0){
        $PDF=new PdfMatriculaInicial($datosConsulta,$_POST["nombre_usuario"],$result_cifrado);
        $nombrePdf=$PDF->generarPdf();
        // // print($nombrePdf);
        $respuesta["nombrePdf"]=$nombrePdf;
    }
    else{
        $respuesta["nombrePdf"]="false";
    }
}
else{
    // print("matricula final");
    $SQL="SELECT * FROM 
    ttrabajador,
    tprofesor,
    tano_escolar,
    tgrado,
    taula,
    tasignacion_aula_profesor,
    tinscripcion,
    testudiante,
    tpromocion
    WHERE 
    ttrabajador.id_cedula='".$_POST["cedula_usuario"]."' AND
    tprofesor.id_cedula=ttrabajador.id_cedula AND
    tasignacion_aula_profesor.id_profesor=tprofesor.id_profesor AND
    tano_escolar.id_ano_escolar=tasignacion_aula_profesor.id_ano_escolar AND
    tano_escolar.estatus_ano_escolar='1' AND
    taula.id_aula=tasignacion_aula_profesor.id_aula AND
    tgrado.id_grado=taula.id_grado AND
    tinscripcion.estatus_inscripcion<>'R' AND
    tinscripcion.id_asignacion_aula_profesor=tasignacion_aula_profesor.id_asignacion_aula_profesor AND
    testudiante.id_estudiante=tinscripcion.id_estudiante AND
    tpromocion.id_inscripcion=tinscripcion.id_inscripcion
    ;
    ";
    $SQL2="SELECT * FROM 
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
    tinscripcion.id_asignacion_aula_profesor=tasignacion_aula_profesor.id_asignacion_aula_profesor AND
    tinscripcion.estatus_inscripcion='R' AND
    testudiante.id_estudiante=tinscripcion.id_estudiante
    ;
    ";
    $result=$driver->query($SQL);
    while($row = pg_fetch_array($result)){
        // print("-------");
        // print_r($row);
        $datosConsulta[]=$row;
    }
    $result=$driver->query($SQL2);
    while($row = pg_fetch_array($result)){
        // print("-------");
        // print_r($row);
        $datosConsulta[]=$row;
    }
    if(count($datosConsulta)>0){
        $PDF=new PdfMatriculaFinal($datosConsulta,$_POST["nombre_usuario"],$result_cifrado);
        $nombrePdf=$PDF->generarPdf();
        // // print($nombrePdf);
        $respuesta["nombrePdf"]=$nombrePdf;
    }
    else{
        $respuesta["nombrePdf"]="false";
    }
}

print(json_encode($respuesta));

?>