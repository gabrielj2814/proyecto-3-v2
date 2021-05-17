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
    $SQL="";
    $trosos=[];
    if(array_key_exists("array_estatu_permiso_trabajador",$_POST)){

        $contador=0;
        $trososConsultaEstadoPermisoTrabajador=[];
        while($contador<count($_POST["array_estatu_permiso_trabajador"])){
            $consultaEstadoPermisoTrabajador="tpermisotrabajador.estatu_permiso_trabajador='".$_POST["array_estatu_permiso_trabajador"][$contador]."'";
            $trososConsultaEstadoPermisoTrabajador[]=$consultaEstadoPermisoTrabajador;
            $contador++;
        }
        $joinEstadoPermisoTrabajador="";
        if(count($trososConsultaEstadoPermisoTrabajador)>1){
            $joinEstadoPermisoTrabajador="(".join(" OR ",$trososConsultaEstadoPermisoTrabajador).")";
            
        }
        else{
            $joinEstadoPermisoTrabajador="(".$trososConsultaEstadoPermisoTrabajador[0].")";
        }
        $trosos[]=$joinEstadoPermisoTrabajador;
    }

    $estado=false;

    if($_POST["permiso_trabajador_tipo"]==="PR"){
        $estado=true;
        $trosos[]="("."tpermisotrabajador.permiso_trabajador_tipo='PR' AND tpermisotrabajador.id_permiso_trabajador=tasistencia.id_permiso_trabajador".")";
    }
    else{
        $trosos[]="("."tpermisotrabajador.permiso_trabajador_tipo='PN'".")";
    }

    if(array_key_exists("array_id_permiso",$_POST)){

        $contador=0;
        $trososConsultaIdPermiso=[];
        while($contador<count($_POST["array_id_permiso"])){
            $consultaIdPermiso="tpermisotrabajador.id_permiso='".$_POST["array_id_permiso"][$contador]."'";
            $trososConsultaIdPermiso[]=$consultaIdPermiso;
            $contador++;
        }
        $joinIdPermiso="";
        if(count($trososConsultaIdPermiso)>1){
            $joinIdPermiso="(".join(" OR ",$trososConsultaIdPermiso).")";
            
        }
        else{
            $joinIdPermiso="(".$trososConsultaIdPermiso[0].")";
        }
        $trosos[]=$joinIdPermiso;
    }

    if(array_key_exists("fecha_desde_permiso_trabajador",$_POST) && array_key_exists("fecha_hasta_permiso_trabajador",$_POST)){
        if($_POST["fecha_desde_permiso_trabajador"]!=="" && $_POST["fecha_hasta_permiso_trabajador"]!==""){
            $trosos[]="(tpermisotrabajador.fecha_desde_permiso_trabajador BETWEEN '".$_POST["fecha_desde_permiso_trabajador"]."' AND '".$_POST["fecha_hasta_permiso_trabajador"]."')";
        }
    }

    if(count($trosos)>0){
        $unirTodo=join(" AND ",$trosos);
        // $SQL="SELECT * FROM ttrabajador,tpermiso,tpermisotrabajador WHERE tpermisotrabajador.id_cedula='".$_POST["id_cedula"]."' AND tpermisotrabajador.id_cedula=ttrabajador.id_cedula AND tpermisotrabajador.id_permiso=tpermiso.id_permiso AND ".$unirTodo;
        if($estado){
            $SQL="SELECT * FROM ttrabajador,tpermiso,tpermisotrabajador,tasistencia WHERE tpermisotrabajador.id_cedula='".$_POST["id_cedula"]."' AND tpermisotrabajador.id_cedula=ttrabajador.id_cedula AND tpermisotrabajador.id_permiso=tpermiso.id_permiso AND ".$unirTodo;
        }
        else{
            $SQL="SELECT * FROM ttrabajador,tpermiso,tpermisotrabajador WHERE tpermisotrabajador.id_cedula='".$_POST["id_cedula"]."' AND tpermisotrabajador.id_cedula=ttrabajador.id_cedula AND tpermisotrabajador.id_permiso=tpermiso.id_permiso AND ".$unirTodo;
        }
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
    
    $SQL="";
    $trosos=[];

    if(array_key_exists("array_estatu_permiso_trabajador",$_POST)){

        $contador=0;
        $trososConsultaEstadoPermisoTrabajador=[];
        while($contador<count($_POST["array_estatu_permiso_trabajador"])){
            $consultaEstadoPermisoTrabajador="tpermisotrabajador.estatu_permiso_trabajador='".$_POST["array_estatu_permiso_trabajador"][$contador]."'";
            $trososConsultaEstadoPermisoTrabajador[]=$consultaEstadoPermisoTrabajador;
            $contador++;
        }
        $joinEstadoPermisoTrabajador="";
        if(count($trososConsultaEstadoPermisoTrabajador)>1){
            $joinEstadoPermisoTrabajador="(".join(" OR ",$trososConsultaEstadoPermisoTrabajador).")";
            
        }
        else{
            $joinEstadoPermisoTrabajador="(".$trososConsultaEstadoPermisoTrabajador[0].")";
        }
        $trosos[]=$joinEstadoPermisoTrabajador;
    }
    $estado=false;

    if($_POST["permiso_trabajador_tipo"]==="PR"){
        $estado=true;
        $trosos[]="("."tpermisotrabajador.permiso_trabajador_tipo='PR' AND tpermisotrabajador.id_permiso_trabajador=tasistencia.id_permiso_trabajador".")";
    }
    else{
        $trosos[]="("."tpermisotrabajador.permiso_trabajador_tipo='PN'".")";
    }

    if(array_key_exists("array_id_permiso",$_POST)){

        $contador=0;
        $trososConsultaIdPermiso=[];
        while($contador<count($_POST["array_id_permiso"])){
            $consultaIdPermiso="tpermisotrabajador.id_permiso='".$_POST["array_id_permiso"][$contador]."'";
            $trososConsultaIdPermiso[]=$consultaIdPermiso;
            $contador++;
        }
        $joinIdPermiso="";
        if(count($trososConsultaIdPermiso)>1){
            $joinIdPermiso="(".join(" OR ",$trososConsultaIdPermiso).")";
            
        }
        else{
            $joinIdPermiso="(".$trososConsultaIdPermiso[0].")";
        }
        $trosos[]=$joinIdPermiso;
    }

    if(array_key_exists("fecha_desde_permiso_trabajador",$_POST) && array_key_exists("fecha_hasta_permiso_trabajador",$_POST)){
        if($_POST["fecha_desde_permiso_trabajador"]!=="" && $_POST["fecha_hasta_permiso_trabajador"]!==""){
            $trosos[]="(tpermisotrabajador.fecha_desde_permiso_trabajador BETWEEN '".$_POST["fecha_desde_permiso_trabajador"]."' AND '".$_POST["fecha_hasta_permiso_trabajador"]."')";
        }
    }

    if(count($trosos)>0){
        $unirTodo=join(" AND ",$trosos);
        if($estado){
            $SQL="SELECT * FROM ttrabajador,tpermiso,tpermisotrabajador,tasistencia WHERE tpermisotrabajador.id_cedula=ttrabajador.id_cedula AND tpermisotrabajador.id_permiso=tpermiso.id_permiso AND ".$unirTodo;
        }
        else{
            $SQL="SELECT * FROM ttrabajador,tpermiso,tpermisotrabajador WHERE tpermisotrabajador.id_cedula=ttrabajador.id_cedula AND tpermisotrabajador.id_permiso=tpermiso.id_permiso AND ".$unirTodo;

        }
    }
    else{
        $SQL="SELECT * FROM ttrabajador,tpermiso,tpermisotrabajador WHERE tpermisotrabajador.id_cedula=ttrabajador.id_cedula AND tpermisotrabajador.id_permiso=tpermiso.id_permiso";
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