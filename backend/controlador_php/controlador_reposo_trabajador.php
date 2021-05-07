<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
include_once("../reporte_pdf/reporte_listado_reposo.php");
include_once("./driverPostgresql.php");
$driver=new DriverPostgreSql();
$respuesta=[];
$SQL="";
$datosConsulta=[];
// print_r($_POST);
if(array_key_exists("id_cedula",$_POST)){
    $SQL="SELECT * FROM ttrabajador,treposo,treposotrabajador WHERE (treposotrabajador.fecha_desde_reposo_trabajador  BETWEEN '".$_POST["fecha_desde_reposo_trabajador"]."' AND '".$_POST["fecha_hasta_reposo_trabajador"]."' ) AND
    treposotrabajador.id_cedula='".$_POST["id_cedula"]."' AND 
    treposotrabajador.id_cedula=ttrabajador.id_cedula AND
    treposotrabajador.id_reposo='".$_POST["id_reposo"]."' AND 
    treposotrabajador.id_reposo=treposo.id_reposo  AND 
    treposotrabajador.estatu_reposo_trabajador='".$_POST["estatu_reposo_trabajador"]."';";
     $result=$driver->query($SQL);
     while($row = pg_fetch_array($result)){
         // print("-------");
         // print_r($row);
         $datosConsulta[]=$row;
    }
    // print_r($datosConsulta);
     if(count($datosConsulta)>0){
         $PDF=new PdfListadoReposo($datosConsulta);
         $nombrePdf=$PDF->generarPdf();
         // print($nombrePdf);
         $respuesta["nombrePdf"]=$nombrePdf;
     }
     else{
         $respuesta["nombrePdf"]="false";
     }
}
else{
    $SQL="SELECT * FROM ttrabajador,treposo,treposotrabajador WHERE (treposotrabajador.fecha_desde_reposo_trabajador  BETWEEN '".$_POST["fecha_desde_reposo_trabajador"]."' AND '".$_POST["fecha_hasta_reposo_trabajador"]."' ) AND
    treposotrabajador.id_cedula=ttrabajador.id_cedula AND
    treposotrabajador.id_reposo='".$_POST["id_reposo"]."' AND 
    treposotrabajador.id_reposo=treposo.id_reposo  AND 
    treposotrabajador.estatu_reposo_trabajador='".$_POST["estatu_reposo_trabajador"]."';";
    // print($SQL);
    $result=$driver->query($SQL);
    while($row = pg_fetch_array($result)){
        // print("-------");
        // print_r($row);
        $datosConsulta[]=$row;
   }
//    print_r($datosConsulta);
    if(count($datosConsulta)>0){
        $PDF=new PdfListadoReposo($datosConsulta);
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