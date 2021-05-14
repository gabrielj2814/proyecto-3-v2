<?php


class PdfListadoAsistencia{

    private $datosPdf;
    function __construct($datos)
    {
        $this->datosPdf=$datos;
    }

    function generarPdf(){
        include_once("../librerias_php/fpdf/fpdf.php");
        $nombrePdf="listado de asistencia de [".$this->datosPdf[0]["nombres"]." ".$this->datosPdf[0]["apellidos"]."] .pdf";
        $pdf = new FPDF("P","mm",array(325,325));
        $pdf->Addpage();
        $pdf->Image("http://localhost:80/proyecto/backend/reporte_pdf/imagenes_pdf/encabezado1.jpg",40,5,200,10);

        $pdf->ln(12);

        //TITULO
        $pdf->SetFont("Arial","B",10);
        $pdf->Cell(0,10,"LISTADO DE ASISTENCIAS",0,0,"C");

        $pdf->ln(10);

        $pdf->SetFont("Arial","",10);
        $pdf->Cell(12,10,"",0,0,"C");
        $pdf->Cell(20,10,"Nombre trabajador:",0,0,"R");$pdf->Cell(30,6,utf8_decode($this->datosPdf[0]["nombres"]),'B',0,"C");
        //fECHA
        $pdf->SetFont("Arial","",10);
        $pdf->Cell(120,10,"",0,0,"L");
        $pdf->Cell(12,10,"Araure",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(10,6,"",'B',0,"C");$pdf->Cell(1,10,"",0,0,"L");
        $pdf->Cell(5,10,"de",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(17,6,"",'B',0,"C");
        $pdf->Cell(1,10,"",0,0,"L");
        $pdf->Cell(5,10,"de",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(17,6,"",'B',0,"C");
        
        $pdf->ln(15);
        
        //TABLA
        $pdf->SetX(20);
        $pdf->Cell(60,10,"Tipo de trabajador",1,0,'C');
        $pdf->Cell(30,10,'Fecha',1,0,'C');
        $pdf->Cell(30,10,'Hora de entrada',1,0,'C');
        $pdf->Cell(30,10,'Hora de Salida',1,0,'C');
        $pdf->Cell(40,10,'Estado',1,0,'C');
        $pdf->Cell(45,10,utf8_decode('Estado asistencia'),1,0,'C');
        $pdf->Cell(60,10,utf8_decode('observación'),1,0,'C');
        
        // $pdf->ln(10);
        
        // $pdf->SetX(39);
        // $pdf->Cell(30,10,'26/04/2021',1,0,'C');
        // $pdf->Cell(30,10,'7:00 AM',1,0,'C');
        // $pdf->Cell(30,10,'4:00 PM',1,0,'C');
        // $pdf->Cell(60,10,'Retiro antes de la hora',1,0,'C');
        
        $contador=0;
        while($contador<count($this->datosPdf)){
            $fecha= date("d-m-Y",strtotime($this->datosPdf[$contador]["fecha_asistencia"]));
            $estadoAsistencia="";
            if($this->datosPdf[$contador]["estatu_asistencia"]==="P"){
                $estadoAsistencia="Presente";
            }
            if($this->datosPdf[$contador]["estatu_asistencia"]==="II"){
                $estadoAsistencia="Insasistencia Inj.";
            }
            if($this->datosPdf[$contador]["estatu_asistencia"]==="IJP"){
                $estadoAsistencia="Insasistencia jus. P.";
            }
            if($this->datosPdf[$contador]["estatu_asistencia"]==="IJR"){
                $estadoAsistencia="Insasistencia jus. R.";
            }
            $pdf->ln(10);
            $pdf->SetX(20);
            $pdf->Cell(60,10,utf8_decode($this->datosPdf[$contador]["descripcion_tipo_trabajador"]),1,0,'C');
            $pdf->Cell(30,10,$fecha,1,0,'C');
            $pdf->Cell(30,10,(($this->datosPdf[$contador]["horario_entrada_asistencia"]!=="--:--AM")?$this->datosPdf[$contador]["horario_entrada_asistencia"]:"--:--"),1,0,'C');
            $pdf->Cell(30,10,(($this->datosPdf[$contador]["horario_salida_asistencia"]!=="--:--AM")?$this->datosPdf[$contador]["horario_salida_asistencia"]:"--:--"),1,0,'C');
            $pdf->Cell(40,10,(($this->datosPdf[$contador]["horario_entrada_asistencia"]!=="--:--AM" && $this->datosPdf[$contador]["id_permiso_trabajador"]===null)?"Laboro":(($this->datosPdf[$contador]["horario_entrada_asistencia"]!=="--:--AM" && $this->datosPdf[$contador]["id_permiso_trabajador"]!==null)?"Vino pero se retiro":"-")),1,0,'C');
            $pdf->Cell(45,10,utf8_decode($estadoAsistencia),1,0,'C');
            $pdf->Cell(60,10,utf8_decode($this->datosPdf[$contador]["observacion_asistencia"]),1,0,'C');
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
        $nombrePdf="listado de asistencia general de trabajadores.pdf";
        $pdf = new FPDF("P","mm",array(400,400));
        $pdf->Addpage();
        $pdf->Image("http://localhost:80/proyecto/backend/reporte_pdf/imagenes_pdf/encabezado1.jpg",40,5,200,10);

        $pdf->ln(12);

        //TITULO
        $pdf->SetFont("Arial","B",10);
        $pdf->Cell(0,10,"LISTADO DE ASISTENCIAS",0,0,"C");

        $pdf->ln(10);

        // $pdf->SetFont("Arial","",10);
        // $pdf->Cell(12,10,"",0,0,"C");
        // $pdf->Cell(20,10,"Nombre trabajador:",0,0,"R");$pdf->Cell(30,6,utf8_decode($this->datosPdf[0]["nombres"]),'B',0,"C");
        //fECHA
        $pdf->SetFont("Arial","",10);
        $pdf->Cell(120,10,"",0,0,"L");
        $pdf->Cell(12,10,"Araure",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(10,6,"",'B',0,"C");$pdf->Cell(1,10,"",0,0,"L");
        $pdf->Cell(5,10,"de",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(17,6,"",'B',0,"C");
        $pdf->Cell(1,10,"",0,0,"L");
        $pdf->Cell(5,10,"de",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(17,6,"",'B',0,"C");
        
        $pdf->ln(15);
        
        //TABLA
        $pdf->SetX(20);
        $pdf->Cell(60,10,"Nombre del trabajador",1,0,'C');
        $pdf->Cell(60,10,"Tipo de trabajador",1,0,'C');
        $pdf->Cell(30,10,'Fecha',1,0,'C');
        $pdf->Cell(30,10,'Hora de entrada',1,0,'C');
        $pdf->Cell(30,10,'Hora de Salida',1,0,'C');
        $pdf->Cell(35,10,'Estado',1,0,'C');
        $pdf->Cell(60,10,utf8_decode('Estado asistencia'),1,0,'C');
        $pdf->Cell(60,10,utf8_decode('Observación'),1,0,'C');
        
        // $pdf->ln(10);
        
        // $pdf->SetX(39);
        // $pdf->Cell(30,10,'26/04/2021',1,0,'C');
        // $pdf->Cell(30,10,'7:00 AM',1,0,'C');
        // $pdf->Cell(30,10,'4:00 PM',1,0,'C');
        // $pdf->Cell(35,10,'Retiro antes de la hora',1,0,'C');
        
        $contador=0;
        while($contador<count($this->datosPdf)){
            $estadoAsistencia="";
            if($this->datosPdf[$contador]["estatu_asistencia"]==="P"){
                $estadoAsistencia="Presente";
            }
            if($this->datosPdf[$contador]["estatu_asistencia"]==="II"){
                $estadoAsistencia="Insasistencia Inj.";
            }
            if($this->datosPdf[$contador]["estatu_asistencia"]==="IJP"){
                $estadoAsistencia="Insasistencia jus. P.";
            }
            if($this->datosPdf[$contador]["estatu_asistencia"]==="IJR"){
                $estadoAsistencia="Insasistencia jus. R.";
            }
            
            $fecha= date("d-m-Y",strtotime($this->datosPdf[$contador]["fecha_asistencia"]));
            $pdf->ln(10);
            $pdf->SetX(20);
            $pdf->Cell(60,10,utf8_decode($this->datosPdf[$contador]["nombres"]." ".$this->datosPdf[$contador]["apellidos"]),1,0,'C');
            $pdf->Cell(60,10,utf8_decode($this->datosPdf[$contador]["descripcion_tipo_trabajador"]),1,0,'C');
            $pdf->Cell(30,10,$fecha,1,0,'C');
            $pdf->Cell(30,10,(($this->datosPdf[$contador]["horario_entrada_asistencia"]!=="--:--AM")?$this->datosPdf[$contador]["horario_entrada_asistencia"]:"--:--"),1,0,'C');
            $pdf->Cell(30,10,(($this->datosPdf[$contador]["horario_salida_asistencia"]!=="--:--AM")?$this->datosPdf[$contador]["horario_salida_asistencia"]:"--:--"),1,0,'C');
            $pdf->Cell(35,10,(($this->datosPdf[$contador]["horario_entrada_asistencia"]!=="--:--AM" && $this->datosPdf[$contador]["id_permiso_trabajador"]===null)?"Laboro":(($this->datosPdf[$contador]["horario_entrada_asistencia"]!=="--:--AM" && $this->datosPdf[$contador]["id_permiso_trabajador"]!==null)?"Vino pero se retiro":"-")),1,0,'C');
            $pdf->Cell(60,10,utf8_decode($estadoAsistencia),1,0,'C');
            $pdf->Cell(60,10,utf8_decode($this->datosPdf[$contador]["observacion_asistencia"]),1,0,'C');
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