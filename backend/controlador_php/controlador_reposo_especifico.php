<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
include_once("./driverPostgresql.php");
$driver=new DriverPostgreSql();
$respuesta=[];
// id_reposo_trabajador
$SQL="SELECT * FROM treposo,ttrabajador,treposotrabajador WHERE treposotrabajador.id_reposo_trabajador='".$_POST["id_reposo_trabajador"]."' AND treposotrabajador.id_cedula=ttrabajador.id_cedula AND treposotrabajador.id_reposo=treposo.id_reposo";

$result_reposo=$driver->query($SQL);
$reposo=$driver->resultDatos($result_reposo);
print_r($reposo);

?>