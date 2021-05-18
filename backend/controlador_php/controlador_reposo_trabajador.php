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
$result=$driver->query("SELECT * FROM tcintillo WHERE estatu_foto_cintillo='1'");
$result_cifrado=$driver->resultDatos($result);

if(array_key_exists("id_cedula",$_POST)){
    $SQL="";
    $trosos=[];
    if(array_key_exists("array_estatu_reposo_trabajador",$_POST)){

        $contador=0;
        $trososConsultaEstadoReposoTrabajador=[];
        while($contador<count($_POST["array_estatu_reposo_trabajador"])){
            $consultaEstadoReposoTrabajador="treposotrabajador.estatu_reposo_trabajador='".$_POST["array_estatu_reposo_trabajador"][$contador]."'";
            $trososConsultaEstadoReposoTrabajador[]=$consultaEstadoReposoTrabajador;
            $contador++;
        }
        $joinEstadoReposoTrabajador="";
        if(count($trososConsultaEstadoReposoTrabajador)>1){
            $joinEstadoReposoTrabajador="(".join(" OR ",$trososConsultaEstadoReposoTrabajador).")";
            
        }
        else{
            $joinEstadoReposoTrabajador="(".$trososConsultaEstadoReposoTrabajador[0].")";
        }
        $trosos[]=$joinEstadoReposoTrabajador;
    }

    if(array_key_exists("array_id_reposo",$_POST)){

        $contador=0;
        $trososConsultaIdReposo=[];
        while($contador<count($_POST["array_id_reposo"])){
            $consultaIdReposo="treposotrabajador.id_reposo='".$_POST["array_id_reposo"][$contador]."'";
            $trososConsultaIdReposo[]=$consultaIdReposo;
            $contador++;
        }
        $joinIdReposo="";
        if(count($trososConsultaIdReposo)>1){
            $joinIdReposo="(".join(" OR ",$trososConsultaIdReposo).")";
            
        }
        else{
            $joinIdReposo="(".$trososConsultaIdReposo[0].")";
        }
        $trosos[]=$joinIdReposo;
    }

    if(array_key_exists("array_estado_entrega",$_POST)){

        $contador=0;
        $trososConsultaEstadoEntregaReposo=[];
        while($contador<count($_POST["array_estado_entrega"])){
            $consultaEstadoEntregaReposo="treposotrabajador.estatu_entrega_reposo='".$_POST["array_estado_entrega"][$contador]."'";
            $trososConsultaEstadoEntregaReposo[]=$consultaEstadoEntregaReposo;
            $contador++;
        }
        $joinEstadoEntregaReposo="";
        if(count($trososConsultaEstadoEntregaReposo)>1){
            $joinEstadoEntregaReposo="(".join(" OR ",$trososConsultaEstadoEntregaReposo).")";
            
        }
        else{
            $joinEstadoEntregaReposo="(".$trososConsultaEstadoEntregaReposo[0].")";
        }
        $trosos[]=$joinEstadoEntregaReposo;
    }
    
    if(array_key_exists("fecha_desde_reposo_trabajador",$_POST) && array_key_exists("fecha_hasta_reposo_trabajador",$_POST)){
        if($_POST["fecha_desde_reposo_trabajador"]!=="" && $_POST["fecha_hasta_reposo_trabajador"]!==""){
            $trosos[]="(treposotrabajador.fecha_desde_reposo_trabajador BETWEEN '".$_POST["fecha_desde_reposo_trabajador"]."' AND '".$_POST["fecha_hasta_reposo_trabajador"]."')";
        }
    }


    // print_r($trosos);

    if(count($trosos)>0){
        $unirTodo=join(" AND ",$trosos);
        $SQL="SELECT * FROM ttrabajador,treposo,treposotrabajador WHERE treposotrabajador.id_cedula='".$_POST["id_cedula"]."' AND treposotrabajador.id_cedula=ttrabajador.id_cedula AND treposotrabajador.id_reposo=treposo.id_reposo AND ".$unirTodo;
    }
    else{
        $SQL="SELECT * FROM ttrabajador,treposo,treposotrabajador WHERE treposotrabajador.id_cedula='".$_POST["id_cedula"]."' AND treposotrabajador.id_cedula=ttrabajador.id_cedula AND treposotrabajador.id_reposo=treposo.id_reposo";
    }

     $result=$driver->query($SQL);
     while($row = pg_fetch_array($result)){
         // print("-------");
         // print_r($row);
         $datosConsulta[]=$row;
    }
    // print_r($datosConsulta);
     if(count($datosConsulta)>0){
         $PDF=new PdfListadoReposo($datosConsulta,$_POST["nombre_usuario"],$result_cifrado);
         $nombrePdf=$PDF->generarPdf();
         // print($nombrePdf);
         $respuesta["nombrePdf"]=$nombrePdf;
     }
     else{
         $respuesta["nombrePdf"]="false";
     }
}
else{

    $SQL="";
    $trosos=[];
    if(array_key_exists("array_estatu_reposo_trabajador",$_POST)){

        $contador=0;
        $trososConsultaEstadoReposoTrabajador=[];
        while($contador<count($_POST["array_estatu_reposo_trabajador"])){
            $consultaEstadoReposoTrabajador="treposotrabajador.estatu_reposo_trabajador='".$_POST["array_estatu_reposo_trabajador"][$contador]."'";
            $trososConsultaEstadoReposoTrabajador[]=$consultaEstadoReposoTrabajador;
            $contador++;
        }
        $joinEstadoReposoTrabajador="";
        if(count($trososConsultaEstadoReposoTrabajador)>1){
            $joinEstadoReposoTrabajador="(".join(" OR ",$trososConsultaEstadoReposoTrabajador).")";
            
        }
        else{
            $joinEstadoReposoTrabajador="(".$trososConsultaEstadoReposoTrabajador[0].")";
        }
        $trosos[]=$joinEstadoReposoTrabajador;
    }

    if(array_key_exists("array_id_reposo",$_POST)){

        $contador=0;
        $trososConsultaIdReposo=[];
        while($contador<count($_POST["array_id_reposo"])){
            $consultaIdReposo="treposotrabajador.id_reposo='".$_POST["array_id_reposo"][$contador]."'";
            $trososConsultaIdReposo[]=$consultaIdReposo;
            $contador++;
        }
        $joinIdReposo="";
        if(count($trososConsultaIdReposo)>1){
            $joinIdReposo="(".join(" OR ",$trososConsultaIdReposo).")";
            
        }
        else{
            $joinIdReposo="(".$trososConsultaIdReposo[0].")";
        }
        $trosos[]=$joinIdReposo;
    }

    if(array_key_exists("array_estado_entrega",$_POST)){

        $contador=0;
        $trososConsultaEstadoEntregaReposo=[];
        while($contador<count($_POST["array_estado_entrega"])){
            $consultaEstadoEntregaReposo="treposotrabajador.estatu_entrega_reposo='".$_POST["array_estado_entrega"][$contador]."'";
            $trososConsultaEstadoEntregaReposo[]=$consultaEstadoEntregaReposo;
            $contador++;
        }
        $joinEstadoEntregaReposo="";
        if(count($trososConsultaEstadoEntregaReposo)>1){
            $joinEstadoEntregaReposo="(".join(" OR ",$trososConsultaEstadoEntregaReposo).")";
            
        }
        else{
            $joinEstadoEntregaReposo="(".$trososConsultaEstadoEntregaReposo[0].")";
        }
        $trosos[]=$joinEstadoEntregaReposo;
    }
    
    if(array_key_exists("fecha_desde_reposo_trabajador",$_POST) && array_key_exists("fecha_hasta_reposo_trabajador",$_POST)){
        if($_POST["fecha_desde_reposo_trabajador"]!=="" && $_POST["fecha_hasta_reposo_trabajador"]!==""){
            $trosos[]="(treposotrabajador.fecha_desde_reposo_trabajador BETWEEN '".$_POST["fecha_desde_reposo_trabajador"]."' AND '".$_POST["fecha_hasta_reposo_trabajador"]."')";
        }
    }


    // print_r($trosos);

    if(count($trosos)>0){
        $unirTodo=join(" AND ",$trosos);
        $SQL="SELECT * FROM ttrabajador,treposo,treposotrabajador WHERE treposotrabajador.id_cedula=ttrabajador.id_cedula AND treposotrabajador.id_reposo=treposo.id_reposo AND ".$unirTodo;
    }
    else{
        $SQL="SELECT * FROM ttrabajador,treposo,treposotrabajador WHERE treposotrabajador.id_cedula=ttrabajador.id_cedula AND treposotrabajador.id_reposo=treposo.id_reposo";
    }

    // print($SQL);


    // print($SQL);
    $result=$driver->query($SQL);
    while($row = pg_fetch_array($result)){
        // print("-------");
        // print_r($row);
        $datosConsulta[]=$row;
   }
//    print_r($datosConsulta);
    if(count($datosConsulta)>0){
        $PDF=new PdfListadoReposo($datosConsulta,$_POST["nombre_usuario"],$result_cifrado);
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