<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
include_once("./driverPostgresql.php");
$driver=new DriverPostgreSql();
$respuesta=[];
$SQL="SELECT * FROM tpermiso,tpermisotrabajador,ttrabajador WHERE tpermisotrabajador.id_permiso_trabajador='".$_POST["id_permiso_trabajador"]."' AND tpermisotrabajador.id_cedula=ttrabajador.id_cedula AND tpermisotrabajador.id_permiso=tpermiso.id_permiso;";

$result_permiso=$driver->query($SQL);
$permiso=$driver->resultDatos($result_permiso);
print_r($permiso);

?>