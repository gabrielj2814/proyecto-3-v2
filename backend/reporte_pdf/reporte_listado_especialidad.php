<?php
include_once("../librerias_php/fpdf/fpdf.php");

class PdfListaEspecialidades extends FPDF{

    private $datosPdf;
    private $generado;
    private $datosCintillo;
    private $nombreCintillo;
    function __construct($datos,$generado,$datosCintillo){
        parent::__construct("L","mm","letter");
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
        
        $nombrePdf="listado de especialidad por medico.pdf";
        $this->AliasNbPages();
        $this->Addpage();
        // $this->Image("imagenes/encabezado1.jpg",40,5,200,10);

        $this->ln(30);

        //TITULO
        $this->SetFont("Arial","B",10);
        $this->Cell(0,10,"REPORTE DEL MEDICO",0,0,"C");

        $this->ln(10);

        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(15,10,"Nombre Medico:",0,0,"R");$this->Cell(30,6,utf8_decode($this->datosPdf[0]["nombre_medico"]." ".$this->datosPdf[0]["apellido_medico"]),'B',0,"C");


        $this->SetFont("Arial","",10);
        $this->Cell(127,10,"",0,0,"L");
        $this->Cell(12,10,"Araure",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(10,6,date("d"),'B',0,"C");$this->Cell(1,10,"",0,0,"L");
        $this->Cell(5,10,"de",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(17,6,date("m"),'B',0,"C");
        $this->Cell(1,10,"",0,0,"L");
        $this->Cell(5,10,"de",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(17,6,date("Y"),'B',0,"C");

        $this->ln(15);

        $this->Cell(20,10,'Nro',1,0,'C');
        $this->Cell(40,10,'Nombre especialidad',1,0,'C');

        $contador=0;
        while($contador<count($this->datosPdf)){
            $this->ln(10);

            $this->Cell(20,10,$contador+1,1,0,'C');
            $this->Cell(40,10,utf8_decode($this->datosPdf[$contador]["nombre_especialidad"]),1,0,'C');
            $contador++;
        }


        $this->ln(20);
        $this->Cell(17,10,"",0,0,"C");
        $this->Cell(45,10,"Generado por:",0,0,"R");$this->Cell(40,6,utf8_decode($this->generado),'B',0,"C");

        $this->Cell(20,10,"",0,0,"C");
        $this->Cell(45,10,"Solicitado por:",0,0,"R");$this->Cell(40,6,"",'B',0,"C");




        $this->Output("F","../upload/reporte/".$nombrePdf);
        return $nombrePdf;
    }

}

?>