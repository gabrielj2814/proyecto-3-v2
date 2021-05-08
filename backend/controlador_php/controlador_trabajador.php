<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
include_once("../reporte_pdf/reporte_listado_trabajador.php");
include_once("./driverPostgresql.php");
$driver=new DriverPostgreSql();
$respuesta=[];
$SQL="";
$datosConsulta=[];
// print_r($_POST);
if(array_key_exists("id_cedula",$_POST)){
    // print("medico");
    $SQL="SELECT * FROM ttrabajador,tfunciontrabajador,ttipotrabajador WHERE ttrabajador.id_cedula='".$_POST["id_cedula"]."' AND 
    ttrabajador.id_funcion_trabajador=tfunciontrabajador.id_funcion_trabajador AND
    tfunciontrabajador.id_tipo_trabajador=ttipotrabajador.id_tipo_trabajador";
    $result=$driver->query($SQL);
    while($row = pg_fetch_array($result)){
        // print("-------");
        // print_r($row);
        $datosConsulta[]=$row;
    }
    // print_r($datosConsulta);
    if(count($datosConsulta)>0){
        $PDF=new PdfTrabajador($datosConsulta);
        $nombrePdf=$PDF->generarPdf();
        // print($nombrePdf);
        $respuesta["nombrePdf"]=$nombrePdf;
    }
    else{
        $respuesta["nombrePdf"]="false";
    }
}
else{

    // print("medico");
    $SQL="SELECT * FROM ttrabajador,tfunciontrabajador,ttipotrabajador WHERE ttrabajador.id_funcion_trabajador='".$_POST["id_funcion_trabajador"]."' AND 
    ttrabajador.id_funcion_trabajador=tfunciontrabajador.id_funcion_trabajador AND
    tfunciontrabajador.id_tipo_trabajador='".$_POST["id_tipo_trabajador"]."' AND
    tfunciontrabajador.id_tipo_trabajador=ttipotrabajador.id_tipo_trabajador AND 
    ttrabajador.sexo_trabajador='".$_POST["sexo"]."' AND 
    ttrabajador.designacion='".$_POST["designacion"]."' AND 
    ttrabajador.estatu_trabajador='".$_POST["estatu_trabajador"]."'";
    $result=$driver->query($SQL);
    while($row = pg_fetch_array($result)){
        // print("-------");
        // print_r($row);
        $datosConsulta[]=$row;
    }
    // print_r($datosConsulta);
    if(count($datosConsulta)>0){
        $PDF=new PdfTrabajador($datosConsulta);
        $nombrePdf=$PDF->generarPdf2();
        // print($nombrePdf);
        $respuesta["nombrePdf"]=$nombrePdf;
    }
    else{
        $respuesta["nombrePdf"]="false";
    }

}

print(json_encode($respuesta));




?>