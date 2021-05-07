<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
include_once("../reporte_pdf/reporte_listado_especialidad.php");
include_once("./driverPostgresql.php");
$driver=new DriverPostgreSql();
$respuesta=[];
$SQL="";
$datosConsulta=[];
// print_r($_POST);
if(array_key_exists("id_medico",$_POST)){
    // print("medico");
    $SQL="SELECT * FROM tasignacionmedicoespecialidad,tespecialidad,tmedico WHERE tasignacionmedicoespecialidad.id_medico='".$_POST["id_medico"]."' AND
    tasignacionmedicoespecialidad.id_medico=tmedico.id_medico AND
    tasignacionmedicoespecialidad.id_especialidad=tespecialidad.id_especialidad;";
    $result=$driver->query($SQL);
    while($row = pg_fetch_array($result)){
        // print("-------");
        // print_r($row);
        $datosConsulta[]=$row;
    }
    if(count($datosConsulta)>0){
        $PDF=new PdfListaEspecialidades($datosConsulta);
        $nombrePdf=$PDF->generarPdf();
        // print($nombrePdf);
        $respuesta["nombrePdf"]=$nombrePdf;
    }
    else{
        $respuesta["nombrePdf"]=null;
    }
}
else if(array_key_exists("id_especialidad",$_POST)){
    // print("especialidad");
    $SQL="SELECT * FROM tasignacionmedicoespecialidad,tespecialidad,tmedico WHERE tasignacionmedicoespecialidad.id_especialidad=".$_POST["id_especialidad"]." AND
    tasignacionmedicoespecialidad.id_medico=tmedico.id_medico AND
    tasignacionmedicoespecialidad.id_especialidad=tespecialidad.id_especialidad;";
    $result=$driver->query($SQL);
    
    while($row = pg_fetch_array($result)){
        // print("-------");
        // print_r($row);
        $datosConsulta[]=$row;
    }
    if(count($datosConsulta)>0){
        $PDF=new PdfListaEspecialidades($datosConsulta);
        $nombrePdf=$PDF->generarPdf();
        // print($nombrePdf);
        $respuesta["nombrePdf"]=$nombrePdf;
    }
    else{
        $respuesta["nombrePdf"]=null;
    }
    // print_r($datosConsulta);
    
}

print(json_encode($respuesta));
?>