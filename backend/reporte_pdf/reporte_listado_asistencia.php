<?php
include_once("../librerias_php/fpdf/fpdf.php");


class PdfListadoAsistencia extends FPDF{

    private $datosPdf;
    private $generado;
    private $datosCintillo;
    private $nombreCintillo;
    function __construct($datos,$tipo,$generado,$datosCintillo){
        if($tipo==="1"){
            parent::__construct("P","mm",array(325,325));
        }
        else{
            parent::__construct("P","mm",array(400,400));
        }
        $this->datosPdf=$datos;
        $this->generado=$generado;
        $this->datosCintillo=$datosCintillo;
        $this->nombreCintillo="cintillo-".$this->datosCintillo["fecha_subida_foto"]."_".$this->datosCintillo["hora_subida_foto"].".".$this->datosCintillo["extension_foto_cintillo"];
    }

    function Header(){
        // $this->Image("http://localhost:80/proyecto/backend/reporte_pdf/imagenes_pdf/encabezado1.jpg",40,5,200,10);
        $this->Image("http://localhost:80/proyecto/backend/reporte_pdf/imagenes_pdf/encabezado1.jpg",24,10,190,12);
        $this->Image("http://localhost:80/proyecto/backend/upload/cintillo/".$this->nombreCintillo,213,2,50,30);
    }

    function Footer(){
        // Posición: a 1,5 cm del final
        $this->SetY(-15);
        // Arial italic 8
        $this->SetFont('Arial','I',8);
        // Número de página
        $this->Cell(0,10,'Page '.$this->PageNo().'/{nb}',0,0,'C');
    }

    function generarPdf(){
        
        $nombrePdf="listado de asistencia de [".$this->datosPdf[0]["nombres"]." ".$this->datosPdf[0]["apellidos"]."] .pdf";
        $this->AliasNbPages();
        $this->Addpage();
        // $this->Image("http://localhost:80/proyecto/backend/reporte_pdf/imagenes_pdf/encabezado1.jpg",40,5,200,10);

        $this->ln(30);

        //TITULO
        $this->SetFont("Arial","B",10);
        $this->Cell(0,10,"LISTADO DE ASISTENCIAS",0,0,"C");

        $this->ln(10);
        $this->SetX(40);
        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(20,10,"Nombre trabajador:",0,0,"R");$this->Cell(30,6,utf8_decode($this->datosPdf[0]["nombres"]),'B',0,"C");
        //fECHA
        
        $this->SetFont("Arial","",10);
        $this->Cell(127,10,"",0,0,"L");
        $this->Cell(12,10,"Araure",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(10,6,date("d"),'B',0,"C");$this->Cell(1,10,"",0,0,"L");
        $this->Cell(5,10,"de",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(17,6,date("m"),'B',0,"C");
        $this->Cell(1,10,"",0,0,"L");
        $this->Cell(5,10,"de",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(17,6,date("Y"),'B',0,"C");
        
        $this->ln(15);
        
        //TABLA
        $this->SetX(20);
        $this->Cell(60,10,"Tipo de trabajador",1,0,'C');
        $this->Cell(30,10,'Fecha',1,0,'C');
        $this->Cell(30,10,'Hora de entrada',1,0,'C');
        $this->Cell(30,10,'Hora de Salida',1,0,'C');
        $this->Cell(40,10,'Estado',1,0,'C');
        $this->Cell(45,10,utf8_decode('Estado asistencia'),1,0,'C');
        $this->Cell(60,10,utf8_decode('observación'),1,0,'C');
        
        // $this->ln(10);
        
        // $this->SetX(39);
        // $this->Cell(30,10,'26/04/2021',1,0,'C');
        // $this->Cell(30,10,'7:00 AM',1,0,'C');
        // $this->Cell(30,10,'4:00 PM',1,0,'C');
        // $this->Cell(60,10,'Retiro antes de la hora',1,0,'C');
        
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
            $this->ln(10);
            $this->SetX(20);
            $this->Cell(60,10,utf8_decode($this->datosPdf[$contador]["descripcion_tipo_trabajador"]),1,0,'C');
            $this->Cell(30,10,$fecha,1,0,'C');
            $this->Cell(30,10,(($this->datosPdf[$contador]["horario_entrada_asistencia"]!=="--:--AM")?$this->datosPdf[$contador]["horario_entrada_asistencia"]:"--:--"),1,0,'C');
            $this->Cell(30,10,(($this->datosPdf[$contador]["horario_salida_asistencia"]!=="--:--AM")?$this->datosPdf[$contador]["horario_salida_asistencia"]:"--:--"),1,0,'C');
            $this->Cell(40,10,(($this->datosPdf[$contador]["horario_entrada_asistencia"]!=="--:--AM" && $this->datosPdf[$contador]["id_permiso_trabajador"]===null)?"Laboro":(($this->datosPdf[$contador]["horario_entrada_asistencia"]!=="--:--AM" && $this->datosPdf[$contador]["id_permiso_trabajador"]!==null)?"Vino pero se retiro":"-")),1,0,'C');
            $this->Cell(45,10,utf8_decode($estadoAsistencia),1,0,'C');
            $this->Cell(60,10,utf8_decode($this->datosPdf[$contador]["observacion_asistencia"]),1,0,'C');
            $contador++;
        }
        
        
        $this->ln(30);
        $this->SetX(30);
        $this->Cell(17,10,"",0,0,"C");
        $this->Cell(45,10,"Generado por:",0,0,"R");$this->Cell(40,6,utf8_decode($this->generado),'B',0,"C");
        
        $this->Cell(20,10,"",0,0,"C");
        $this->Cell(45,10,"Solicitado por:",0,0,"R");$this->Cell(40,6,"",'B',0,"C");
        
        
        
        
        
        $this->Output("F","../upload/reporte/".$nombrePdf);
        return $nombrePdf;


    }


    function generarPdf2(){
        include_once("../librerias_php/fpdf/fpdf.php");
        $nombrePdf="listado de asistencia general de trabajadores.pdf";
        $this->AliasNbPages();
        $this->Addpage();
        // $this->Image("http://localhost:80/proyecto/backend/reporte_pdf/imagenes_pdf/encabezado1.jpg",40,5,200,10);

        $this->ln(30);

        //TITULO
        $this->SetFont("Arial","B",10);
        $this->Cell(0,10,"LISTADO DE ASISTENCIAS",0,0,"C");

        $this->ln(10);

        // $this->SetFont("Arial","",10);
        // $this->Cell(12,10,"",0,0,"C");
        // $this->Cell(20,10,"Nombre trabajador:",0,0,"R");$this->Cell(30,6,utf8_decode($this->datosPdf[0]["nombres"]),'B',0,"C");
        //fECHA
        $this->SetX(150);
        $this->SetFont("Arial","",10);
        $this->Cell(127,10,"",0,0,"L");
        $this->Cell(12,10,"Araure",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(10,6,date("d"),'B',0,"C");$this->Cell(1,10,"",0,0,"L");
        $this->Cell(5,10,"de",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(17,6,date("m"),'B',0,"C");
        $this->Cell(1,10,"",0,0,"L");
        $this->Cell(5,10,"de",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(17,6,date("Y"),'B',0,"C");
        
        $this->ln(15);
        
        //TABLA
        $this->SetX(20);
        $this->Cell(60,10,"Nombre del trabajador",1,0,'C');
        $this->Cell(60,10,"Tipo de trabajador",1,0,'C');
        $this->Cell(30,10,'Fecha',1,0,'C');
        $this->Cell(30,10,'Hora de entrada',1,0,'C');
        $this->Cell(30,10,'Hora de Salida',1,0,'C');
        $this->Cell(35,10,'Estado',1,0,'C');
        $this->Cell(60,10,utf8_decode('Estado asistencia'),1,0,'C');
        $this->Cell(60,10,utf8_decode('Observación'),1,0,'C');
        
        // $this->ln(10);
        
        // $this->SetX(39);
        // $this->Cell(30,10,'26/04/2021',1,0,'C');
        // $this->Cell(30,10,'7:00 AM',1,0,'C');
        // $this->Cell(30,10,'4:00 PM',1,0,'C');
        // $this->Cell(35,10,'Retiro antes de la hora',1,0,'C');
        
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
            $this->ln(10);
            $this->SetX(20);
            $this->Cell(60,10,utf8_decode($this->datosPdf[$contador]["nombres"]." ".$this->datosPdf[$contador]["apellidos"]),1,0,'C');
            $this->Cell(60,10,utf8_decode($this->datosPdf[$contador]["descripcion_tipo_trabajador"]),1,0,'C');
            $this->Cell(30,10,$fecha,1,0,'C');
            $this->Cell(30,10,(($this->datosPdf[$contador]["horario_entrada_asistencia"]!=="--:--AM")?$this->datosPdf[$contador]["horario_entrada_asistencia"]:"--:--"),1,0,'C');
            $this->Cell(30,10,(($this->datosPdf[$contador]["horario_salida_asistencia"]!=="--:--AM")?$this->datosPdf[$contador]["horario_salida_asistencia"]:"--:--"),1,0,'C');
            $this->Cell(35,10,(($this->datosPdf[$contador]["horario_entrada_asistencia"]!=="--:--AM" && $this->datosPdf[$contador]["id_permiso_trabajador"]===null)?"Laboro":(($this->datosPdf[$contador]["horario_entrada_asistencia"]!=="--:--AM" && $this->datosPdf[$contador]["id_permiso_trabajador"]!==null)?"Vino pero se retiro":"-")),1,0,'C');
            $this->Cell(60,10,utf8_decode($estadoAsistencia),1,0,'C');
            $this->Cell(60,10,utf8_decode($this->datosPdf[$contador]["observacion_asistencia"]),1,0,'C');
            $contador++;
        }
        
        
        
        $this->ln(30);
        $this->SetX(80);
        $this->Cell(17,10,"",0,0,"C");
        $this->Cell(45,10,"Generado por:",0,0,"R");$this->Cell(40,6,utf8_decode($this->generado),'B',0,"C");
        
        $this->Cell(20,10,"",0,0,"C");
        $this->Cell(45,10,"Solicitado por:",0,0,"R");$this->Cell(40,6,"",'B',0,"C");
        
        
        
        
        
        $this->Output("F","../upload/reporte/".$nombrePdf);
        return $nombrePdf;


    }


}



?>