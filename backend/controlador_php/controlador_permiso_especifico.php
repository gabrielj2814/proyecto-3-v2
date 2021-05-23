<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
include_once("./driverPostgresql.php");
include_once("../reporte_pdf/reporte_permiso_especifico.php");
$driver=new DriverPostgreSql();
$respuesta=[];
$result=$driver->query("SELECT * FROM tcintillo WHERE estatu_foto_cintillo='1'");
$result_cintillo=$driver->resultDatos($result);

$SQL="SELECT * FROM tpermiso,tpermisotrabajador,ttrabajador WHERE tpermisotrabajador.id_permiso_trabajador='".$_POST["id_permiso_trabajador"]."' AND tpermisotrabajador.id_cedula=ttrabajador.id_cedula AND tpermisotrabajador.id_permiso=tpermiso.id_permiso;";

$result_permiso=$driver->query($SQL);
$permiso[]=$driver->resultDatos($result_permiso);
// print_r($permiso);
$PDF=new PdfPermisoEspecifico($permiso,$result_cintillo);
$respuesta["nombrePdf"]=$PDF->generarPdf();
print(json_encode($respuesta));

?>