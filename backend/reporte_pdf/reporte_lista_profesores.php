<?php
include_once("../librerias_php/fpdf/fpdf.php");
class PdfListaProfesores extends FPDF{

    private $datosPdf;
    private $generado;
    private $datosCintillo;
    private $nombreCintillo;
    function __construct($datos,$generado,$datosCintillo){
        $this->datosPdf=$datos;
        $this->generado=$generado;
        $this->datosCintillo=$datosCintillo;
        $this->nombreCintillo="cintillo-".$this->datosCintillo["fecha_subida_foto"]."_".$this->datosCintillo["hora_subida_foto"].".".$this->datosCintillo["extension_foto_cintillo"];
        parent::__construct("L","mm","letter");
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
        
        $nombrePdf="Matricula Inicial.pdf";
        $this->AliasNbPages();
        $this->Addpage();
        $this->ln(20);
        //TITULO
        $this->SetFont("Arial","B",10);
        $this->Cell(0,10,"LISTADO DE DOCENTES",0,0,"C");
        
        $this->ln(12);
        //fECHA
        $this->SetFont("Arial","",10);
        $this->Cell(187,10,"",0,0,"L");
        $this->Cell(12,10,"Araure",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(10,6,date("d"),'B',0,"C");$this->Cell(1,10,"",0,0,"L");
        $this->Cell(5,10,"de",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(17,6,date("m"),'B',0,"C");
        $this->Cell(1,10,"",0,0,"L");
        $this->Cell(5,10,"de",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(17,6,date("Y"),'B',0,"C");
        
        $this->ln(15);
        
        //TABLA
        $this->Cell(60,10,'',0,0,'C');
        $this->Cell(10,10,'Nro',1,0,'C');
        $this->Cell(40,10,'Nombre y Apellido',1,0,'C');
        $this->Cell(30,10,'Grado',1,0,'C');
        $this->Cell(30,10,'Seccion',1,0,'C');
        $this->Cell(30,10,'Ano Escolar',1,0,'C');

        $this->ln(10);

        $this->Cell(60,10,'',0,0,'C');
        $this->Cell(10,10,'1',1,0,'C');
        $this->Cell(40,10,'Juan Arraiz',1,0,'C');
        $this->Cell(30,10,'6to',1,0,'C');
        $this->Cell(30,10,'A',1,0,'C');
        $this->Cell(30,10,'2022-2023',1,0,'C');
        
        // $contador=0;
        // foreach($this->datosPdf as $inscripto){
        //     $contador++;
        //     $this->ln(10);
        //     $cedula="no tiene";
        //     if($inscripto["cedula_estudiante"]===null){
        //         $cedula=$inscripto["cedula_escolar"];
        //     }
        //     else{
        //         $cedula=$inscripto["cedula_estudiante"];
        //     }

        //     $this->Cell(15,10,'',0,0,'C');
        //     $this->Cell(10,10,$contador,1,0,'C');
        //     $this->Cell(40,10,$inscripto["nombres_estudiante"],1,0,'C');
        //     $this->Cell(30,10,$cedula,1,0,'C');
        // }

        
        $this->ln(20);
        $this->Cell(17,10,"",0,0,"C");
        $this->Cell(45,10,"Generado por:",0,0,"R");$this->Cell(40,6,$this->generado,'B',0,"C");
        
        $this->Cell(20,10,"",0,0,"C");
        $this->Cell(45,10,"Solicitado por:",0,0,"R");$this->Cell(40,6,"",'B',0,"C");

        $this->Output("F","../upload/reporte/".$nombrePdf);
        return $nombrePdf;
    }

}

?>