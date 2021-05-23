<?php
include_once("../librerias_php/fpdf/fpdf.php");


class PdfPermisoEspecifico extends FPDF{

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
        
        $nombrePdf="permiso del trabajador [".$this->datosPdf[0]["nombres"]." ".$this->datosPdf[0]["apellidos"]."] .pdf";
        $this->AliasNbPages();
        $this->Addpage();
        // $this->Image("http://localhost:80/proyecto/backend/reporte_pdf/imagenes_pdf/encabezado1.jpg",40,5,200,10);

        $this->ln(25);
        //TITULO
        $this->SetFont("Arial","B",10);
        $this->Cell(0,10,"PERMISO ESPECIFICO",0,0,"C");
        
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

        $this->SetX(50); 
        $this->Cell(18,10,'Tipo de permiso:',0,0,'C');$this->Cell(38,10,utf8_decode($this->datosPdf[0]["nombre_permiso"]),0,0,'C');

        $this->SetX(110); 
        $this->Cell(25,10,'Dias:',0,0,'C');$this->Cell(5,10,utf8_decode($this->datosPdf[0]["dias_permiso"]),0,0,'C');

        $this->SetX(170); 
        $this->Cell(28,10,'Remunerado:',0,0,'C');$this->Cell(5,10,(($this->datosPdf[0]["estatu_remunerado"]==="1")?"Si":"No"),0,0,'C');

        $this->ln(15);

        $this->SetX(44); 
        $this->Cell(18,10,'Habiles:',0,0,'C');$this->Cell(5,10,(($this->datosPdf[0]["estatu_dias_aviles"]==="1")?"Si":"No"),0,0,'C');
        $fechaDesde= date("d-m-Y",strtotime($this->datosPdf[0]["fecha_desde_permiso_trabajador"]));
        $this->SetX(94); 
        $this->Cell(50,10,'Fecha de inicio:',0,0,'C');$this->Cell(7,10,$fechaDesde,0,0,'C');

        $fechaHasta= date("d-m-Y",strtotime($this->datosPdf[0]["fecha_hasta_permiso_trabajador"]));
        $this->SetX(158); 
        $this->Cell(50,10,'Fecha final:',0,0,'C');$this->Cell(7,10,$fechaHasta,0,0,'C');
        
        
        
        
        
        
        
        $this->Output("F","../upload/reporte/".$nombrePdf);
        return $nombrePdf;


    }


    


}



?>