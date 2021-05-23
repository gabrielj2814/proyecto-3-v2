<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
include_once("./driverPostgresql.php");
include_once("../reporte_pdf/reporte_reposo_especifico.php");
$driver=new DriverPostgreSql();
$respuesta=[];
// id_reposo_trabajador
// nombrePdf
$result=$driver->query("SELECT * FROM tcintillo WHERE estatu_foto_cintillo='1'");
$result_cintillo=$driver->resultDatos($result);

$SQL="SELECT * FROM treposo,ttrabajador,treposotrabajador,tcam,tasignacionmedicoespecialidad,tmedico,tespecialidad WHERE 
    treposotrabajador.id_reposo_trabajador='".$_POST["id_reposo_trabajador"]."' AND 
    treposotrabajador.id_cedula=ttrabajador.id_cedula AND
    treposotrabajador.id_reposo=treposo.id_reposo AND 
    treposotrabajador.id_cam=tcam.id_cam AND 
    treposotrabajador.id_asignacion_medico_especialidad=tasignacionmedicoespecialidad.id_asignacion_medico_especialidad AND
    tasignacionmedicoespecialidad.id_medico=tmedico.id_medico AND 
    tasignacionmedicoespecialidad.id_especialidad=tespecialidad.id_especialidad
    ";

$result_reposo=$driver->query($SQL);
$reposo[]=$driver->resultDatos($result_reposo);

$PDF=new PdfReposoEspecifico($reposo,$result_cintillo);
$respuesta["nombrePdf"]=$PDF->generarPdf();


// print_r($reposo);
print(json_encode($respuesta));

?>