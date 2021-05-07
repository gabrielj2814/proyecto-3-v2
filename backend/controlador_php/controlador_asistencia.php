<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
include_once("../reporte_pdf/reporte_listado_asistencia.php");
include_once("./driverPostgresql.php");
$driver=new DriverPostgreSql();
$respuesta=[];
$SQL="";
$datosConsulta=[];
// print_r($_POST);
if(array_key_exists("id_cedula",$_POST)){
    // print("especifico");
    $SQL="";
    if($_POST["id_permiso_trabajador"]==="1"){
        $SQL="SELECT * FROM tasistencia,ttrabajador WHERE (tasistencia.fecha_asistencia  BETWEEN '".$_POST["desde"]."' AND '".$_POST["hasta"]."' ) AND
        tasistencia.id_cedula='".$_POST["id_cedula"]."' AND 
        ttrabajador.id_cedula=tasistencia.id_cedula AND 
        tasistencia.estatu_cumplimiento_horario='".$_POST["estatu_cumplimiento_horario"]."' AND 
        tasistencia.estatu_asistencia='".$_POST["estatu_asistencia"]."' AND
        tasistencia.id_permiso_trabajador is null";
    }
    else if($_POST["id_permiso_trabajador"]==="0"){
        $SQL="SELECT * FROM tasistencia,ttrabajador WHERE (tasistencia.fecha_asistencia  BETWEEN '".$_POST["desde"]."' AND '".$_POST["hasta"]."' ) AND
        tasistencia.id_cedula='".$_POST["id_cedula"]."' AND 
        ttrabajador.id_cedula=tasistencia.id_cedula AND 
        tasistencia.estatu_cumplimiento_horario='".$_POST["estatu_cumplimiento_horario"]."' AND 
        tasistencia.estatu_asistencia='".$_POST["estatu_asistencia"]."' AND
        tasistencia.id_permiso_trabajador is not null";
    }
    // else{
    //     $SQL="SELECT * FROM tasistencia,ttrabajador WHERE (tasistencia.fecha_asistencia  BETWEEN '".$_POST["desde"]."' AND '".$_POST["hasta"]."' ) AND
    //     tasistencia.id_cedula='".$_POST["id_cedula"]."' AND 
    //     ttrabajador.id_cedula=tasistencia.id_cedula AND 
    //     tasistencia.estatu_cumplimiento_horario='".$_POST["estatu_cumplimiento_horario"]."' AND 
    //     tasistencia.estatu_asistencia='".$_POST["estatu_asistencia"]."' AND
    //     tasistencia.id_permiso_trabajador is null";
    // }

    // print($SQL);

    $result=$driver->query($SQL);
    while($row = pg_fetch_array($result)){
        // print("-------");
        // print_r($row);
        $datosConsulta[]=$row;
    }
    if(count($datosConsulta)>0){
        $PDF=new PdfListadoAsistencia($datosConsulta);
        $nombrePdf=$PDF->generarPdf();
        // print($nombrePdf);
        $respuesta["nombrePdf"]=$nombrePdf;
    }
    else{
        $respuesta["nombrePdf"]="false";
    }
}
else{
    
    // print("listado");
    $SQL="";
    if($_POST["id_permiso_trabajador"]==="1"){
        $SQL="SELECT * FROM tasistencia,ttrabajador WHERE (tasistencia.fecha_asistencia  BETWEEN '".$_POST["desde"]."' AND '".$_POST["hasta"]."' ) AND 
        ttrabajador.id_cedula=tasistencia.id_cedula AND 
        tasistencia.estatu_cumplimiento_horario='".$_POST["estatu_cumplimiento_horario"]."' AND 
        tasistencia.estatu_asistencia='".$_POST["estatu_asistencia"]."' AND
        tasistencia.id_permiso_trabajador is null";
    }
    else if($_POST["id_permiso_trabajador"]==="0"){
        $SQL="SELECT * FROM tasistencia,ttrabajador WHERE (tasistencia.fecha_asistencia  BETWEEN '".$_POST["desde"]."' AND '".$_POST["hasta"]."' ) AND 
        ttrabajador.id_cedula=tasistencia.id_cedula AND 
        tasistencia.estatu_cumplimiento_horario='".$_POST["estatu_cumplimiento_horario"]."' AND 
        tasistencia.estatu_asistencia='".$_POST["estatu_asistencia"]."' AND
        tasistencia.id_permiso_trabajador is not null";
    }

    // print($SQL);

    $result=$driver->query($SQL);
    while($row = pg_fetch_array($result)){
        // print("-------");
        // print_r($row);
        $datosConsulta[]=$row;
    }
    if(count($datosConsulta)>0){
        $PDF=new PdfListadoAsistencia($datosConsulta);
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