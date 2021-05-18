<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
include_once("../reporte_pdf/reporte_listado_trabajador.php");
include_once("./driverPostgresql.php");
$driver=new DriverPostgreSql();
$respuesta=[];
$SQL="";
$datosConsulta=[];
// print_r($_POST);
$result=$driver->query("SELECT * FROM tcintillo WHERE estatu_foto_cintillo='1'");
$result_cifrado=$driver->resultDatos($result);

if(array_key_exists("id_cedula",$_POST)){
    // print("medico");
    $SQL_asistencia="SELECT * FROM tasistencia WHERE id_cedula='".$_POST["id_cedula"]."' AND horario_salida_asistencia='--:--AM' AND estatu_asistencia='P' ;";
    // print($SQL_asistencia);
    $result_asistencia=$driver->query($SQL_asistencia);
    $datosConsultaAsistencia=[];
    while($rowAsistencia = pg_fetch_array($result_asistencia)){
        // print("-------");
        // print_r($row);
        $datosConsultaAsistencia[]=$rowAsistencia;
    }


    $SQL="SELECT * FROM ttrabajador,tfunciontrabajador,ttipotrabajador WHERE ttrabajador.id_cedula='".$_POST["id_cedula"]."' AND 
    ttrabajador.id_funcion_trabajador=tfunciontrabajador.id_funcion_trabajador AND
    tfunciontrabajador.id_tipo_trabajador=ttipotrabajador.id_tipo_trabajador";
    $result=$driver->query($SQL);
    while($row = pg_fetch_array($result)){
        // print("-------");
        // print_r($row);
        $datosConsulta[]=$row;
    }
    // print_r($datosConsulta);
    if(count($datosConsulta)>0){
        $PDF=new PdfTrabajador($datosConsulta,$_POST["nombre_usuario"],$result_cifrado);
        $nombrePdf=$PDF->generarPdf($datosConsultaAsistencia);
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

    if(array_key_exists("array_id_tipo_trabajador",$_POST)){

        $contador=0;
        $trososConsultaIdTipoTrabajador=[];
        while($contador<count($_POST["array_id_tipo_trabajador"])){
            $consultaIdTipoTrabajador="tfunciontrabajador.id_tipo_trabajador='".$_POST["array_id_tipo_trabajador"][$contador]."'";
            $trososConsultaIdTipoTrabajador[]=$consultaIdTipoTrabajador;
            $contador++;
        }
        $joinIdTipoTrabajador="";
        if(count($trososConsultaIdTipoTrabajador)>1){
            $joinIdTipoTrabajador="(".join(" OR ",$trososConsultaIdTipoTrabajador).")";
            
        }
        else{
            $joinIdTipoTrabajador="(".$trososConsultaIdTipoTrabajador[0].")";
        }
        $trosos[]=$joinIdTipoTrabajador;
    }
    // else{
    //     $trosos[]="ttrabajador.id_funcion_trabajador=tfunciontrabajador.id_funcion_trabajador AND tfunciontrabajador.id_tipo_trabajador=ttipotrabajador.id_tipo_trabajador";
    // }
    
    if(array_key_exists("array_id_funcion_trabajador",$_POST)){

        $contador=0;
        $trososConsultaIdFuncionTrabajador=[];
        while($contador<count($_POST["array_id_funcion_trabajador"])){
            $consultaIdFuncionTrabajador="ttrabajador.id_funcion_trabajador='".$_POST["array_id_funcion_trabajador"][$contador]."'";
            $trososConsultaIdFuncionTrabajador[]=$consultaIdFuncionTrabajador;
            $contador++;
        }
        $joinIdFuncionTrabajador="";
        if(count($trososConsultaIdFuncionTrabajador)>1){
            $joinIdFuncionTrabajador="(".join(" OR ",$trososConsultaIdFuncionTrabajador).")";
            
        }
        else{
            $joinIdFuncionTrabajador="(".$trososConsultaIdFuncionTrabajador[0].")";
        }
        $trosos[]=$joinIdFuncionTrabajador;
    }
    
    if(array_key_exists("array_sexo",$_POST)){

        $contador=0;
        $trososConsultaSexo=[];
        while($contador<count($_POST["array_sexo"])){
            $consultaSexo="ttrabajador.sexo_trabajador='".$_POST["array_sexo"][$contador]."'";
            $trososConsultaSexo[]=$consultaSexo;
            $contador++;
        }
        $joinSexo="";
        if(count($trososConsultaSexo)>1){
            $joinSexo="(".join(" OR ",$trososConsultaSexo).")";
            
        }
        else{
            $joinSexo="(".$trososConsultaSexo[0].")";
        }
        $trosos[]=$joinSexo;
    }

    if(array_key_exists("array_designacion",$_POST)){

        $contador=0;
        $trososConsultaDesignacion=[];
        while($contador<count($_POST["array_designacion"])){
            $consultaDesignacion="ttrabajador.designacion='".$_POST["array_designacion"][$contador]."'";
            $trososConsultaDesignacion[]=$consultaDesignacion;
            $contador++;
        }
        $joinDesignacion="";
        if(count($trososConsultaDesignacion)>1){
            $joinDesignacion="(".join(" OR ",$trososConsultaDesignacion).")";
            
        }
        else{
            $joinDesignacion="(".$trososConsultaDesignacion[0].")";
        }
        $trosos[]=$joinDesignacion;
    }
    
    if(array_key_exists("array_estatu_trabajador",$_POST)){

        $contador=0;
        $trososConsultaEstadoTrabajador=[];
        while($contador<count($_POST["array_estatu_trabajador"])){
            $consultaEstadoTrabajador="ttrabajador.estatu_trabajador='".$_POST["array_estatu_trabajador"][$contador]."'";
            $trososConsultaEstadoTrabajador[]=$consultaEstadoTrabajador;
            $contador++;
        }
        $joinEstadoTrabajador="";
        if(count($trososConsultaEstadoTrabajador)>1){
            $joinEstadoTrabajador="(".join(" OR ",$trososConsultaEstadoTrabajador).")";
            
        }
        else{
            $joinEstadoTrabajador="(".$trososConsultaEstadoTrabajador[0].")";
        }
        $trosos[]=$joinEstadoTrabajador;
    }
    
    // print_r($trosos);

    if(count($trosos)>0){
        $unirTodo=join(" AND ",$trosos);
        $SQL="SELECT * FROM ttrabajador,tfunciontrabajador,ttipotrabajador WHERE ttrabajador.id_cedula=ttrabajador.id_cedula AND ttrabajador.id_funcion_trabajador=tfunciontrabajador.id_funcion_trabajador AND tfunciontrabajador.id_tipo_trabajador=ttipotrabajador.id_tipo_trabajador AND ".$unirTodo;
    }
    else{
        $SQL="SELECT * FROM ttrabajador,tfunciontrabajador,ttipotrabajador WHERE ttrabajador.id_cedula=ttrabajador.id_cedula AND ttrabajador.id_funcion_trabajador=tfunciontrabajador.id_funcion_trabajador AND tfunciontrabajador.id_tipo_trabajador=ttipotrabajador.id_tipo_trabajador ";
    }
    
    $result=$driver->query($SQL);
    while($row = pg_fetch_array($result)){
        // print("-------");
        // print_r($row);
        $datosConsulta[]=$row;
    }
    // print_r($datosConsulta);
    if(count($datosConsulta)>0){
        $PDF=new PdfTrabajador($datosConsulta,$_POST["nombre_usuario"],$result_cifrado);
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