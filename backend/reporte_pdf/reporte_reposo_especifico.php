<?php
include_once("../librerias_php/fpdf/fpdf.php");


class PdfReposoEspecifico extends FPDF{

    private $datosPdf;
    private $generado;
    private $datosCintillo;
    private $nombreCintillo;
    function __construct($datos,$datosCintillo){
        parent::__construct("L","mm","letter");
        $this->datosPdf=$datos;
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
        
        $nombrePdf="reposo del trabajador [".$this->datosPdf[0]["nombres"]." ".$this->datosPdf[0]["apellidos"]."] .pdf";
        $this->AliasNbPages();
        $this->Addpage();
        // $this->Image("http://localhost:80/proyecto/backend/reporte_pdf/imagenes_pdf/encabezado1.jpg",40,5,200,10);

        $this->ln(25);
        //TITULO
        $this->SetFont("Arial","B",10);
        $this->Cell(0,10,"REPOSO ESPECIFICO",0,0,"C");
        
        $this->ln(12);
        
        $this->SetFont("Arial","",10);
        $this->Cell(185,10,"",0,0,"L");
        $this->Cell(12,10,"Araure",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(10,6,date("d"),'B',0,"C");$this->Cell(1,10,"",0,0,"L");
        $this->Cell(5,10,"de",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(17,6,date("m"),'B',0,"C");
        $this->Cell(1,10,"",0,0,"L");
        $this->Cell(5,10,"de",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(17,6,date("Y"),'B',0,"C");
        
        $this->ln(15);
        
        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(23,10,"Nombre trabajador:",0,0,"R");$this->Cell(50,6,utf8_decode($this->datosPdf[0]["nombres"]." ".$this->datosPdf[0]["apellidos"]),'B',0,"C");
        
        $this->ln(15);
        
        $this->SetX(40); 
        $this->Cell(20,10,'Tipo de reposo:',0,0,'C');$this->Cell(30,10,utf8_decode($this->datosPdf[0]["nombre_reposo"]),0,0,'C');
        
        $this->SetX(110); 
        $this->Cell(20,10,'Dias:',0,0,'C');$this->Cell(21,10,utf8_decode($this->datosPdf[0]["total_dias_reposo_trabajador"]),0,0,'C');
        $fechaDesde= date("d-m-Y",strtotime($this->datosPdf[0]["fecha_desde_reposo_trabajador"]));
        $this->SetX(170); 
        $this->Cell(50,10,'Fecha de inicio:',0,0,'C');$this->Cell(7,10,$fechaDesde,0,0,'C');
        
        $this->ln(15);
        $fechaHasta= date("d-m-Y",strtotime($this->datosPdf[0]["fecha_hasta_reposo_trabajador"]));
        $this->SetX(22); 
        $this->Cell(50,10,'Fecha final:',0,0,'C');$this->Cell(7,10,$fechaHasta,0,0,'C');
        
        $this->SetX(107); 
        $this->Cell(25,10,'Nombre del centro de asistencia:',0,0,'C');$this->Cell(55,10,utf8_decode($this->datosPdf[0]["nombre_cam"]),0,0,'C');
        
        $this->SetX(175); 
        $this->Cell(28,10,'Telefono:',0,0,'C');$this->Cell(30,10,utf8_decode($this->datosPdf[0]["telefono_cam"]),0,0,'C');
        
        $this->ln(15);
        
        $this->SetX(45); 
        $this->Cell(18,10,'Medico de la consulta:',0,0,'C');$this->Cell(48,10,utf8_decode($this->datosPdf[0]["nombre_medico"]." ".$this->datosPdf[0]["apellido_medico"]),0,0,'C');
        
        $this->SetX(104); 
        $this->Cell(35,10,'Especialidad:',0,0,'C');$this->Cell(20,10,utf8_decode($this->datosPdf[0]["nombre_especialidad"]),0,0,'C');
        $fechaEntrega= date("d-m-Y",strtotime($this->datosPdf[0]["fecha_hasta_entrega_reposo_trabajador"]));
        $this->SetX(169); 
        $this->Cell(50,10,'Fecha Entrega:',0,0,'C');$this->Cell(7,10,$fechaEntrega,0,0,'C');
        
        $this->ln(15);
        
        $this->SetX(41); 
        $this->Cell(10,10,'Descripcion:',0,0,'C');$this->Cell(120,10,utf8_decode($this->datosPdf[0]["direccion_cam"]),0,0,'C');
        
        
        
        
        
        
        $this->Output("F","../upload/reporte/".$nombrePdf);
        return $nombrePdf;


    }


    


}



?>