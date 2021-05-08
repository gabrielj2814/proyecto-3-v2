<?php


class PdfListadoPermiso{

    private $datosPdf;
    function __construct($datos)
    {
        $this->datosPdf=$datos;
    }

    function generarPdf(){
        include_once("../librerias_php/fpdf/fpdf.php");
        $nombrePdf="listado de permiso de [".$this->datosPdf[0]["nombres"]." ".$this->datosPdf[0]["apellidos"]."].pdf";
        $pdf = new FPDF("L","mm","letter");
        $pdf->Addpage();
        $pdf->Image("http://localhost:80/proyecto/backend/reporte_pdf/imagenes_pdf/encabezado1.jpg",40,5,200,10);

        $pdf->SetFont("Arial","B",10);
        $pdf->ln(15);

        $pdf->Cell(0,10,"PERMISO DEL TRABAJADOR",0,0,"C");

        $pdf->ln(12);

        
        $pdf->SetFont("Arial","",10);
        $pdf->Cell(12,10,"",0,0,"C");
        $pdf->Cell(20,10,"Nombre trabajador:",0,0,"R");$pdf->Cell(30,6,($this->datosPdf[0]["nombres"]." ".$this->datosPdf[0]["apellidos"]),'B',0,"C");
        $pdf->SetFont("Arial","",10);
        $pdf->Cell(124,10,"",0,0,"L");
        $pdf->Cell(12,10,"Araure",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(10,6,"",'B',0,"C");$pdf->Cell(1,10,"",0,0,"L");
        $pdf->Cell(5,10,"de",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(17,6,"",'B',0,"C");
        $pdf->Cell(1,10,"",0,0,"L");
        $pdf->Cell(5,10,"de",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(17,6,"",'B',0,"C");

        // $pdf->ln(15);
        // $pdf->Cell(21,10,"Cedula",1,0,"C");
        // $pdf->Cell(40,10,"Nombres",1,0,"C");
        // $pdf->Cell(40,10,"Apellidos",1,0,"C");
        // $pdf->Cell(31,10,"Nombre reposo",1,0,"C");
        // $pdf->Cell(20,10,"Desde",1,0,"C");
        // $pdf->Cell(20,10,"Hasta",1,0,"C");
        // $pdf->Cell(22,10,"Estado de entrega",1,0,"C");
        // $pdf->Cell(22,10,"Estatus",1,0,"C");

        // $pdf->ln(10);
        // $pdf->Cell(21,10,"27419898",1,0,"C");
        // $pdf->Cell(40,10,"jorge yermain",1,0,"C");
        // $pdf->Cell(40,10,"barboza londoño",1,0,"C");
        // $pdf->Cell(31,10,"por cuido",1,0,"C");
        // $pdf->Cell(20,10,"21/11/2021",1,0,"C");
        // $pdf->Cell(20,10,"28/11/2021",1,0,"C");
        // $pdf->Cell(22,10,"Entrega",1,0,"C");
        // $pdf->Cell(22,10,"inactivo",1,0,"C");
        if($this->datosPdf[0]["permiso_trabajador_tipo"]==="PN"){
            $pdf->ln(15);
            $pdf->SetX(40);
            $pdf->Cell(21,10,"Cedula",1,0,"C");
            $pdf->Cell(31,10,"Nombre permiso",1,0,"C");
            $pdf->Cell(20,10,"Desde",1,0,"C");
            $pdf->Cell(20,10,"Hasta",1,0,"C");
            $pdf->Cell(30,10,"Remunerado",1,0,"C");
            $pdf->Cell(30,10,"Havil",1,0,"C");
            $pdf->Cell(22,10,"Estatus",1,0,"C");
            $pdf->Cell(30,10,"Tipo de permiso",1,0,"C");
        }
        else{
            $pdf->ln(15);
            $pdf->SetX(70);
            $pdf->Cell(21,10,"Cedula",1,0,"C");
            $pdf->Cell(31,10,"Nombre permiso",1,0,"C");
            $pdf->Cell(35,10,"Fecha de solicitud",1,0,"C");
            $pdf->Cell(22,10,"Estatus",1,0,"C");
            $pdf->Cell(30,10,"Tipo de permiso",1,0,"C");
        }
        $contador=0;
        while($contador<count($this->datosPdf)){
            $pdf->ln(10);
            
           if($this->datosPdf[$contador]["permiso_trabajador_tipo"]==="PN"){
                $pdf->SetX(40);
                $fechaDesde= date("d-m-Y",strtotime($this->datosPdf[$contador]["fecha_desde_permiso_trabajador"]));
                $fechaHasta= date("d-m-Y",strtotime($this->datosPdf[$contador]["fecha_hasta_permiso_trabajador"]));
                // nombre_reposo
                $estadoPermiso=null;
                if($this->datosPdf[$contador]["estatu_permiso_trabajador"]==="E"){
                    $estadoPermiso="En Espera";
                }
                if($this->datosPdf[$contador]["estatu_permiso_trabajador"]==="A"){
                    $estadoPermiso="Aprovado";
                }
                if($this->datosPdf[$contador]["estatu_permiso_trabajador"]==="C"){
                    $estadoPermiso="Culminado";
                }
                if($this->datosPdf[$contador]["estatu_permiso_trabajador"]==="D"){
                    $estadoPermiso="Denegado";
                }
                $pdf->Cell(21,10,$this->datosPdf[$contador]["id_cedula"],1,0,"C");
                $pdf->Cell(31,10,utf8_decode($this->datosPdf[$contador]["nombre_permiso"]),1,0,"C");
                $pdf->Cell(20,10,$fechaDesde,1,0,"C");
                $pdf->Cell(20,10,$fechaHasta,1,0,"C");
                $pdf->Cell(30,10,(($this->datosPdf[$contador]["estatu_remunerado"]==="1")?"SI":"NO"),1,0,"C");
                $pdf->Cell(30,10,(($this->datosPdf[$contador]["estatu_dias_aviles"]==="1")?"SI":"NO"),1,0,"C");
                $pdf->Cell(22,10,$estadoPermiso,1,0,"C");
                $pdf->Cell(30,10,"Permiso normal",1,0,"C");
           }
           else{
            $pdf->SetX(70);
            $fecha= date("d-m-Y",strtotime($this->datosPdf[$contador]["fecha_asistencia"]));
            // nombre_reposo
            $estadoPermiso=null;
            if($this->datosPdf[$contador]["estatu_permiso_trabajador"]==="E"){
                $estadoPermiso="En Espera";
            }
            if($this->datosPdf[$contador]["estatu_permiso_trabajador"]==="A"){
                $estadoPermiso="Aprovado";
            }
            if($this->datosPdf[$contador]["estatu_permiso_trabajador"]==="C"){
                $estadoPermiso="Culminado";
            }
            if($this->datosPdf[$contador]["estatu_permiso_trabajador"]==="D"){
                $estadoPermiso="Denegado";
            }
            $pdf->Cell(21,10,$this->datosPdf[$contador]["id_cedula"],1,0,"C");
            $pdf->Cell(31,10,utf8_decode($this->datosPdf[$contador]["nombre_permiso"]),1,0,"C");
            $pdf->Cell(35,10,$fecha,1,0,"C");
            $pdf->Cell(22,10,$estadoPermiso,1,0,"C");
            $pdf->Cell(30,10,"Permiso normal",1,0,"C");
           }
            $contador++;
        }
        
        
        $pdf->ln(20);
        $pdf->Cell(17,10,"",0,0,"C");
        $pdf->Cell(45,10,"Generado por:",0,0,"R");$pdf->Cell(40,6,"",'B',0,"C");
        
        $pdf->Cell(20,10,"",0,0,"C");
        $pdf->Cell(45,10,"Solicitado por:",0,0,"R");$pdf->Cell(40,6,"",'B',0,"C");
        
        
        
        
        
        $pdf->Output("F","../upload/reporte/".$nombrePdf);
        return $nombrePdf;


    }


    function generarPdf2(){
        include_once("../librerias_php/fpdf/fpdf.php");
        $nombrePdf="listado de permiso trabajadores.pdf";
        $pdf = new FPDF("L","mm","letter");
        $pdf->Addpage();
        $pdf->Image("http://localhost:80/proyecto/backend/reporte_pdf/imagenes_pdf/encabezado1.jpg",40,5,200,10);

        $pdf->SetFont("Arial","B",10);
        $pdf->ln(15);

        $pdf->Cell(0,10,"PERMISO DEL TRABAJADOR",0,0,"C");

        $pdf->ln(12);

        
        // $pdf->SetFont("Arial","",10);
        // $pdf->Cell(12,10,"",0,0,"C");
        // $pdf->Cell(20,10,"Nombre trabajador:",0,0,"R");$pdf->Cell(30,6,($this->datosPdf[0]["nombres"]." ".$this->datosPdf[0]["apellidos"]),'B',0,"C");
        // $pdf->SetFont("Arial","",10);
        $pdf->Cell(124,10,"",0,0,"L");
        $pdf->Cell(12,10,"Araure",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(10,6,"",'B',0,"C");$pdf->Cell(1,10,"",0,0,"L");
        $pdf->Cell(5,10,"de",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(17,6,"",'B',0,"C");
        $pdf->Cell(1,10,"",0,0,"L");
        $pdf->Cell(5,10,"de",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(17,6,"",'B',0,"C");

        // $pdf->ln(15);
        // $pdf->Cell(21,10,"Cedula",1,0,"C");
        // $pdf->Cell(40,10,"Nombres",1,0,"C");
        // $pdf->Cell(40,10,"Apellidos",1,0,"C");
        // $pdf->Cell(31,10,"Nombre reposo",1,0,"C");
        // $pdf->Cell(20,10,"Desde",1,0,"C");
        // $pdf->Cell(20,10,"Hasta",1,0,"C");
        // $pdf->Cell(22,10,"Estado de entrega",1,0,"C");
        // $pdf->Cell(22,10,"Estatus",1,0,"C");

        // $pdf->ln(10);
        // $pdf->Cell(21,10,"27419898",1,0,"C");
        // $pdf->Cell(40,10,"jorge yermain",1,0,"C");
        // $pdf->Cell(40,10,"barboza londoño",1,0,"C");
        // $pdf->Cell(31,10,"por cuido",1,0,"C");
        // $pdf->Cell(20,10,"21/11/2021",1,0,"C");
        // $pdf->Cell(20,10,"28/11/2021",1,0,"C");
        // $pdf->Cell(22,10,"Entrega",1,0,"C");
        // $pdf->Cell(22,10,"inactivo",1,0,"C");
        if($this->datosPdf[0]["permiso_trabajador_tipo"]==="PN"){
            $pdf->ln(15);
            $pdf->SetX(10);
            $pdf->Cell(21,10,"Cedula",1,0,"C");
            $pdf->Cell(31,10,"Nombre",1,0,"C");
            $pdf->Cell(31,10,"Apellido",1,0,"C");
            $pdf->Cell(31,10,"Nombre permiso",1,0,"C");
            $pdf->Cell(20,10,"Desde",1,0,"C");
            $pdf->Cell(20,10,"Hasta",1,0,"C");
            $pdf->Cell(30,10,"Remunerado",1,0,"C");
            $pdf->Cell(30,10,"Havil",1,0,"C");
            $pdf->Cell(22,10,"Estatus",1,0,"C");
            $pdf->Cell(30,10,"Tipo de permiso",1,0,"C");
        }
        else{
            $pdf->ln(15);
            $pdf->SetX(40);
            $pdf->Cell(21,10,"Cedula",1,0,"C");
            $pdf->Cell(31,10,"Nombre",1,0,"C");
            $pdf->Cell(31,10,"Apellido",1,0,"C");
            $pdf->Cell(31,10,"Nombre permiso",1,0,"C");
            $pdf->Cell(35,10,"Fecha de solicitud",1,0,"C");
            $pdf->Cell(22,10,"Estatus",1,0,"C");
            $pdf->Cell(30,10,"Tipo de permiso",1,0,"C");
        }
        $contador=0;
        while($contador<count($this->datosPdf)){
            $pdf->ln(10);
            
           if($this->datosPdf[$contador]["permiso_trabajador_tipo"]==="PN"){
                $pdf->SetX(10);
                $fechaDesde= date("d-m-Y",strtotime($this->datosPdf[$contador]["fecha_desde_permiso_trabajador"]));
                $fechaHasta= date("d-m-Y",strtotime($this->datosPdf[$contador]["fecha_hasta_permiso_trabajador"]));
                // nombre_reposo
                $estadoPermiso=null;
                if($this->datosPdf[$contador]["estatu_permiso_trabajador"]==="E"){
                    $estadoPermiso="En Espera";
                }
                if($this->datosPdf[$contador]["estatu_permiso_trabajador"]==="A"){
                    $estadoPermiso="Aprovado";
                }
                if($this->datosPdf[$contador]["estatu_permiso_trabajador"]==="C"){
                    $estadoPermiso="Culminado";
                }
                if($this->datosPdf[$contador]["estatu_permiso_trabajador"]==="D"){
                    $estadoPermiso="Denegado";
                }
                $pdf->Cell(21,10,$this->datosPdf[$contador]["id_cedula"],1,0,"C");
                $pdf->Cell(31,10,utf8_decode($this->datosPdf[$contador]["nombres"]),1,0,"C");
                $pdf->Cell(31,10,utf8_decode($this->datosPdf[$contador]["apellidos"]),1,0,"C");
                $pdf->Cell(31,10,utf8_decode($this->datosPdf[$contador]["nombre_permiso"]),1,0,"C");
                $pdf->Cell(20,10,$fechaDesde,1,0,"C");
                $pdf->Cell(20,10,$fechaHasta,1,0,"C");
                $pdf->Cell(30,10,(($this->datosPdf[$contador]["estatu_remunerado"]==="1")?"SI":"NO"),1,0,"C");
                $pdf->Cell(30,10,(($this->datosPdf[$contador]["estatu_dias_aviles"]==="1")?"SI":"NO"),1,0,"C");
                $pdf->Cell(22,10,$estadoPermiso,1,0,"C");
                $pdf->Cell(30,10,"Permiso normal",1,0,"C");
           }
           else{
            $pdf->SetX(40);
            $fecha= date("d-m-Y",strtotime($this->datosPdf[$contador]["fecha_asistencia"]));
            // nombre_reposo
            $estadoPermiso=null;
            if($this->datosPdf[$contador]["estatu_permiso_trabajador"]==="E"){
                $estadoPermiso="En Espera";
            }
            if($this->datosPdf[$contador]["estatu_permiso_trabajador"]==="A"){
                $estadoPermiso="Aprovado";
            }
            if($this->datosPdf[$contador]["estatu_permiso_trabajador"]==="C"){
                $estadoPermiso="Culminado";
            }
            if($this->datosPdf[$contador]["estatu_permiso_trabajador"]==="D"){
                $estadoPermiso="Denegado";
            }
            $pdf->Cell(21,10,$this->datosPdf[$contador]["id_cedula"],1,0,"C");
            $pdf->Cell(31,10,utf8_decode($this->datosPdf[$contador]["nombres"]),1,0,"C");
            $pdf->Cell(31,10,utf8_decode($this->datosPdf[$contador]["apellidos"]),1,0,"C");
            $pdf->Cell(31,10,utf8_decode($this->datosPdf[$contador]["nombre_permiso"]),1,0,"C");
            $pdf->Cell(35,10,$fecha,1,0,"C");
            $pdf->Cell(22,10,$estadoPermiso,1,0,"C");
            $pdf->Cell(30,10,"Permiso retiro",1,0,"C");
           }
            $contador++;
        }
        
        
        $pdf->ln(20);
        $pdf->Cell(17,10,"",0,0,"C");
        $pdf->Cell(45,10,"Generado por:",0,0,"R");$pdf->Cell(40,6,"",'B',0,"C");
        
        $pdf->Cell(20,10,"",0,0,"C");
        $pdf->Cell(45,10,"Solicitado por:",0,0,"R");$pdf->Cell(40,6,"",'B',0,"C");
        
        
        
        
        
        $pdf->Output("F","../upload/reporte/".$nombrePdf);
        return $nombrePdf;


    }


}



?>