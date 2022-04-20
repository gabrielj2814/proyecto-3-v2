<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
include_once("../reporte_pdf/reporte_lista_profesores.php");
include_once("./driverPostgresql.php");
$driver=new DriverPostgreSql();
$respuesta=[];
$SQL="";
$datosConsulta=[];
// print_r($_POST);
$result=$driver->query("SELECT * FROM tcintillo WHERE estatu_foto_cintillo='1'");
$result_cifrado=$driver->resultDatos($result);
$respuesta=$result_cifrado;

print(json_encode($respuesta));
?>