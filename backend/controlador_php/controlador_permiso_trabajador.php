<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
include_once("../reporte_pdf/reporte_listado_permiso.php");
include_once("./driverPostgresql.php");
$driver=new DriverPostgreSql();
$respuesta=[];
$SQL="";
$datosConsulta=[];
// print_r($_POST);
if(array_key_exists("id_cedula",$_POST)){
    // print("es");
    if($_POST["permiso_trabajador_tipo"]==="PR"){
        $SQL="SELECT * FROM tpermisotrabajador,ttrabajador,tpermiso,tasistencia WHERE 
        tpermisotrabajador.id_cedula='".$_POST["id_cedula"]."' AND
        tpermisotrabajador.id_cedula=ttrabajador.id_cedula AND
        tpermisotrabajador.estatu_permiso_trabajador='".$_POST["estatu_permiso_trabajador"]."' AND
        tpermisotrabajador.id_permiso=tpermiso.id_permiso AND
        tpermisotrabajador.permiso_trabajador_tipo='PR' AND
        tpermisotrabajador.id_permiso_trabajador=tasistencia.id_permiso_trabajador";
    }
    else{
        $SQL="SELECT * FROM tpermisotrabajador,ttrabajador,tpermiso WHERE (tpermisotrabajador.fecha_desde_permiso_trabajador  BETWEEN '".$_POST["fecha_desde_permiso_trabajador"]."' AND '".$_POST["fecha_hasta_permiso_trabajador"]."' ) AND 
        tpermisotrabajador.id_cedula='".$_POST["id_cedula"]."' AND
        tpermisotrabajador.id_cedula=ttrabajador.id_cedula AND
        tpermisotrabajador.estatu_permiso_trabajador='".$_POST["estatu_permiso_trabajador"]."' AND
        tpermisotrabajador.id_permiso=tpermiso.id_permiso AND
        tpermisotrabajador.permiso_trabajador_tipo='PN';";
    }
    // print($SQL);
    $result=$driver->query($SQL);
    while($row = pg_fetch_array($result)){
        // print("-------");
        // print_r($row);
        $datosConsulta[]=$row;
    }
    // print_r($datosConsulta);
    if(count($datosConsulta)>0){
        $PDF=new PdfListadoPermiso($datosConsulta);
        $nombrePdf=$PDF->generarPdf();
        // print($nombrePdf);
        $respuesta["nombrePdf"]=$nombrePdf;
    }
    else{
        $respuesta["nombrePdf"]="false";
    }
}
else{
    
    // print("lis");
    if($_POST["permiso_trabajador_tipo"]==="PR"){
        $SQL="SELECT * FROM tpermisotrabajador,ttrabajador,tpermiso,tasistencia WHERE
        tpermisotrabajador.id_cedula=ttrabajador.id_cedula AND
        tpermisotrabajador.estatu_permiso_trabajador='".$_POST["estatu_permiso_trabajador"]."' AND
        tpermisotrabajador.id_permiso=tpermiso.id_permiso AND
        tpermisotrabajador.permiso_trabajador_tipo='PR' AND
        tpermisotrabajador.id_permiso_trabajador=tasistencia.id_permiso_trabajador";
    }
    else{
        $SQL="SELECT * FROM tpermisotrabajador,ttrabajador,tpermiso WHERE (tpermisotrabajador.fecha_desde_permiso_trabajador  BETWEEN '".$_POST["fecha_desde_permiso_trabajador"]."' AND '".$_POST["fecha_hasta_permiso_trabajador"]."' ) AND 
        tpermisotrabajador.id_cedula=ttrabajador.id_cedula AND
        tpermisotrabajador.estatu_permiso_trabajador='".$_POST["estatu_permiso_trabajador"]."' AND
        tpermisotrabajador.id_permiso=tpermiso.id_permiso AND
        tpermisotrabajador.permiso_trabajador_tipo='PN';";
    }
    // print($SQL);
    $result=$driver->query($SQL);
    while($row = pg_fetch_array($result)){
        // print("-------");
        // print_r($row);
        $datosConsulta[]=$row;
    }
    // print_r($datosConsulta);
    if(count($datosConsulta)>0){
        $PDF=new PdfListadoPermiso($datosConsulta);
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