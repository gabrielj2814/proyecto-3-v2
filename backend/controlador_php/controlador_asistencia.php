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
    $trosos=[];
    if(array_key_exists("array_mes",$_POST)){
        $trososConsultaMes=[];
        $contador=0;
        $estado=false;
        while($contador<count($_POST["array_mes"])){
            $mes=$_POST["array_mes"][$contador];
            if($mes==="null"){
                $estado=true;
                break;
            }
            else{
                $ano=date("Y");
                $consultaMes="tasistencia.id_asistencia LIKE '%".$ano."-".$_POST["array_mes"][$contador]."%'";
                $trososConsultaMes[]=$consultaMes;
            }
            $contador++;
        }
        if($estado){
            $piesaRangoFecha="(tasistencia.fecha_asistencia  BETWEEN '".$_POST["desde"]."' AND '".$_POST["hasta"]."' )";
            // print("$piesaRangoFecha");
            $trosos[]=$piesaRangoFecha;
        }
        else{
            $join_meses="";
            if(count($trososConsultaMes)>1){
                $join_meses="(".join(" OR ",$trososConsultaMes).")";
                
            }
            else{
                $join_meses="(".$trososConsultaMes[0].")";
            }
            // print("$join_meses");
            $trosos[]=$join_meses;
        }
        
    }
    if(array_key_exists("array_estatu_asistencia",$_POST)){
        $contador=0;
        $trososConsultaEstadoAsistencia=[];
        while($contador<count($_POST["array_estatu_asistencia"])){
            $consultaEstadoAsistencia="tasistencia.estatu_asistencia='".$_POST["array_estatu_asistencia"][$contador]."'";
            $trososConsultaEstadoAsistencia[]=$consultaEstadoAsistencia;
            $contador++;
        }
        $joinEstadoAsistencia="";
        if(count($trososConsultaEstadoAsistencia)>1){
            $joinEstadoAsistencia="(".join(" OR ",$trososConsultaEstadoAsistencia).")";
            
        }
        else{
            $joinEstadoAsistencia="(".$trososConsultaEstadoAsistencia[0].")";
        }
        $trosos[]=$joinEstadoAsistencia;
    }
    if(array_key_exists("array_estatu_cumplimiento_horario",$_POST)){
        $contador=0;
        $trososConsultaCumplimientoH=[];
        while($contador<count($_POST["array_estatu_cumplimiento_horario"])){
            if($_POST["array_estatu_cumplimiento_horario"][$contador]==="N"){
                $consultacumplimientoHorario="tasistencia.estatu_cumplimiento_horario='N'";
            }
            else{
                $consultacumplimientoHorario="tasistencia.estatu_cumplimiento_horario='C'";
            }
            $trososConsultaCumplimientoH[]=$consultacumplimientoHorario;
            $contador++;
        }
        $joinEstadoCumplimientoH="";
        if(count($trososConsultaCumplimientoH)>1){
            $joinEstadoCumplimientoH="(".join(" OR ",$trososConsultaCumplimientoH).")";
            
        }
        else{
            $joinEstadoCumplimientoH="(".$trososConsultaCumplimientoH[0].")";
        }
        $trosos[]=$joinEstadoCumplimientoH;
    }
    if(array_key_exists("array_id_permiso_trabajador",$_POST)){
        $contador=0;
        $trososEstadoPermiso=[];
        while($contador<count($_POST["array_id_permiso_trabajador"])){
            if($_POST["array_id_permiso_trabajador"][$contador]==="0"){
                $EstadoPermisoorario="tasistencia.id_permiso_trabajador is not null";
            }
            else{
                $EstadoPermisoorario="tasistencia.id_permiso_trabajador is null";
            }
            $trososEstadoPermiso[]=$EstadoPermisoorario;
            $contador++;
        }
        $joinEstadoPermiso="";
        if(count($trososEstadoPermiso)>1){
            $joinEstadoPermiso="(".join(" OR ",$trososEstadoPermiso).")";
            
        }
        else{
            $joinEstadoPermiso="(".$trososEstadoPermiso[0].")";
        }
        $trosos[]=$joinEstadoPermiso;
    }



    if(count($trosos)>0){
        $unirTodo=join(" AND ",$trosos);
        $SQL="SELECT * FROM tasistencia,ttrabajador WHERE tasistencia.id_cedula='".$_POST["id_cedula"]."' AND tasistencia.id_cedula=ttrabajador.id_cedula AND ".$unirTodo;
    }
    else{
        $SQL="SELECT * FROM tasistencia,ttrabajador WHERE tasistencia.id_cedula='".$_POST["id_cedula"]."' AND tasistencia.id_cedula=ttrabajador.id_cedula ";
    }

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
    $SQL="";
    $trosos=[];
    if(array_key_exists("array_mes",$_POST)){
        $trososConsultaMes=[];
        $contador=0;
        $estado=false;
        while($contador<count($_POST["array_mes"])){
            $mes=$_POST["array_mes"][$contador];
            if($mes==="null"){
                $estado=true;
                break;
            }
            else{
                $ano=date("Y");
                $consultaMes="tasistencia.id_asistencia LIKE '%".$ano."-".$_POST["array_mes"][$contador]."%'";
                $trososConsultaMes[]=$consultaMes;
            }
            $contador++;
        }
        if($estado){
            $piesaRangoFecha="(tasistencia.fecha_asistencia  BETWEEN '".$_POST["desde"]."' AND '".$_POST["hasta"]."' )";
            // print("$piesaRangoFecha");
            $trosos[]=$piesaRangoFecha;
        }
        else{
            $join_meses="";
            if(count($trososConsultaMes)>1){
                $join_meses="(".join(" OR ",$trososConsultaMes).")";
                
            }
            else{
                $join_meses="(".$trososConsultaMes[0].")";
            }
            // print("$join_meses");
            $trosos[]=$join_meses;
        }
        
    }
    if(array_key_exists("array_estatu_asistencia",$_POST)){
        $contador=0;
        $trososConsultaEstadoAsistencia=[];
        while($contador<count($_POST["array_estatu_asistencia"])){
            $consultaEstadoAsistencia="tasistencia.estatu_asistencia='".$_POST["array_estatu_asistencia"][$contador]."'";
            $trososConsultaEstadoAsistencia[]=$consultaEstadoAsistencia;
            $contador++;
        }
        $joinEstadoAsistencia="";
        if(count($trososConsultaEstadoAsistencia)>1){
            $joinEstadoAsistencia="(".join(" OR ",$trososConsultaEstadoAsistencia).")";
            
        }
        else{
            $joinEstadoAsistencia="(".$trososConsultaEstadoAsistencia[0].")";
        }
        $trosos[]=$joinEstadoAsistencia;
    }
    if(array_key_exists("array_estatu_cumplimiento_horario",$_POST)){
        $contador=0;
        $trososConsultaCumplimientoH=[];
        while($contador<count($_POST["array_estatu_cumplimiento_horario"])){
            if($_POST["array_estatu_cumplimiento_horario"][$contador]==="N"){
                $consultacumplimientoHorario="tasistencia.estatu_cumplimiento_horario='N'";
            }
            else{
                $consultacumplimientoHorario="tasistencia.estatu_cumplimiento_horario='C'";
            }
            $trososConsultaCumplimientoH[]=$consultacumplimientoHorario;
            $contador++;
        }
        $joinEstadoCumplimientoH="";
        if(count($trososConsultaCumplimientoH)>1){
            $joinEstadoCumplimientoH="(".join(" OR ",$trososConsultaCumplimientoH).")";
            
        }
        else{
            $joinEstadoCumplimientoH="(".$trososConsultaCumplimientoH[0].")";
        }
        $trosos[]=$joinEstadoCumplimientoH;
    }
    if(array_key_exists("array_id_permiso_trabajador",$_POST)){
        $contador=0;
        $trososEstadoPermiso=[];
        while($contador<count($_POST["array_id_permiso_trabajador"])){
            if($_POST["array_id_permiso_trabajador"][$contador]==="0"){
                $EstadoPermisoorario="tasistencia.id_permiso_trabajador is not null";
            }
            else{
                $EstadoPermisoorario="tasistencia.id_permiso_trabajador is null";
            }
            $trososEstadoPermiso[]=$EstadoPermisoorario;
            $contador++;
        }
        $joinEstadoPermiso="";
        if(count($trososEstadoPermiso)>1){
            $joinEstadoPermiso="(".join(" OR ",$trososEstadoPermiso).")";
            
        }
        else{
            $joinEstadoPermiso="(".$trososEstadoPermiso[0].")";
        }
        $trosos[]=$joinEstadoPermiso;
    }



    if(count($trosos)>0){
        $unirTodo=join(" AND ",$trosos);
        $SQL="SELECT * FROM tasistencia,ttrabajador  WHERE tasistencia.id_cedula=ttrabajador.id_cedula AND ".$unirTodo;
    }
    else{
        $SQL="SELECT * FROM tasistencia,ttrabajador WHERE tasistencia.id_cedula=ttrabajador.id_cedula ";
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