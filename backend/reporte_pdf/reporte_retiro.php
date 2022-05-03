<?php


include_once("../librerias_php/fpdf/fpdf.php");
class PdfRetiro extends FPDF{

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
        
        $nombrePdf="Reporte de Retiro.pdf";
        $this->AliasNbPages();
        $this->Addpage();
        $this->ln(22);
        //TITULO
        $this->SetFont("Arial","B",10);
        $this->Cell(0,10,"CONSTANCIA DE RETIRO",0,0,"C");
        $this->Cell(-259,10,"______________________",0,0,"C");

        $this->ln(12);

        $this->SetFont("Arial","",12);
        $this->Cell(125,10,"Quien suscribe lcda, Elaine Raquel Yanez, cedula de identidad",0,0,"R");

        $this->SetFont("Arial","",12);
        $this->Cell(135,10,"V-10.541.398, directora encargada de la Escuela Bolivariana Villas del ",0,0,"R");

        $this->ln(10);

        $this->SetFont("Arial","",12);
        $this->Cell(176,10,"del Pilar ubicada en municipio Araure Edo. Portuguesa, por medio de la presente hace constar",0,0,"R");
        $this->SetFont("Arial","",12);
        $this->Cell(-40,10,"",0,0,"R");	
        $this->Cell(82,10,"que el (la) Estudiante:",0,0,"R");$this->Cell(40,6,"",'B',0,"C");$this->Cell(-40,8,$this->datosPdf[0]["nombres_estudiante"],0,0,"C");

        $this->ln(10);

        $this->Cell(-2,10,"",0,0,"R");
        $this->Cell(40,6,"",'B',0,"C");
        $this->Cell(-66,8,$this->datosPdf[0]["apellidos_estudiante"],0,0,"C");

        $this->SetFont("Arial","",12);
        $this->Cell(25,10,"",0,0,"R");	
        $this->Cell(82,10,",Cedula Escolar Nro:",0,0,"R");$this->Cell(40,6,"",'B',0,"C");$this->Cell(-40,9,$this->datosPdf[0]["codigo_cedula_escolar"]."-".$this->datosPdf[0]["cedula_escolar"],0,0,"C");

        $this->SetFont("Arial","",12);
        $this->Cell(-22,10,"",0,0,"R");	
        $grado=NULL;
        switch($this->datosPdf[0]["numero_grado"]){
            case '1': $grado="1 RO"; break;
            case '2': $grado="2 DO"; break;
            case '3': $grado="3 RO"; break;
            case '4': $grado="4 TO"; break;
            case '5': $grado="5 TO"; break;
            case '6': $grado="6 TO"; break;
        }
        $this->Cell(82,10,",Curso el:",0,0,"R");$this->Cell(40,6,"",'B',0,"C");$this->Cell(-40,9,$grado,0,0,"C");

        $this->SetFont("Arial","",12);
        $this->Cell(115,10,"Grado en el subsistema de educacion-",0,0,"R");

        $this->ln(10);
        $annoEscolar=$this->datosPdf[0]["ano_desde"]." - ".$this->datosPdf[0]["ano_hasta"];
        $this->SetFont("Arial","",12);
        $this->Cell(93,10,utf8_decode("primaria de esta institucion, durante el año escolar"),0,0,"R");$this->Cell(40,6,"",'B',0,"C");$this->Cell(-40,9,$annoEscolar,0,0,"C");


        $this->SetFont("Arial","",12);
        $this->Cell(20,10,"",0,0,"R");	
        $this->Cell(82,10,",se retira del plante por motivo:",0,0,"R");$this->Cell(63,6,"",'B',0,"C");$this->Cell(-75,8,$this->datosPdf[0]["motivo_retiro"],0,0,"C");

        $this->ln(10);

        $this->Cell(-2,10,"",0,0,"R");
        $this->Cell(40,6,"",'B',0,"C");$this->Cell(-40,9,"",0,0,"C");

        $this->SetFont("Arial","",12);
        $this->Cell(184,10,",constancia que se expide a peticion de la parte interesada en Araure a los: ",0,0,"R");
        // fecha_retiro
        $fecha=explode("-",$this->datosPdf[0]["fecha_retiro"]);
        $this->Cell(76,6,"",'B',0,"C");$this->Cell(-80,9,$fecha[2],0,0,"C");

        $this->ln(10);

        $this->SetFont("Arial","",12);
        $this->Cell(-58,10,"",0,0,"R");	
        $this->Cell(82,10,",dias del mes:",0,0,"R");$this->Cell(40,6,"",'B',0,"C");$this->Cell(-40,9,$fecha[1],0,0,"C");

        $this->SetFont("Arial","",12);
        $this->Cell(-24,10,"",0,0,"R");	
        $this->Cell(82,10,",del ano:",0,0,"R");$this->Cell(40,6,"",'B',0,"C");$this->Cell(-40,9,$fecha[0],0,0,"C");

        $this->ln(20);

        $this->Cell(200,10,"",0,0,"C");
        $this->Cell(40,-1,"",'B',0,"C");

        $this->Cell(-1,6,"Lcda. Elaine Yanez",0,0,"R");

        $this->ln(2);

        $this->Cell(232,12,"Director(E)",0,0,"R");

        $this->Output("F","../upload/reporte/".$nombrePdf);
        return $nombrePdf;
    }

}
// $pdf = new FPDF("L","mm","letter");
// $pdf->Addpage();
// $pdf->Image("imagenes/encabezado1.jpg",24,10,190,12);$pdf->Image("imagenes/carabobo.jpg",213,2,50,30);

// $pdf->ln(22);

// //TITULO
// $pdf->SetFont("Arial","B",10);
// $pdf->Cell(0,10,"CONSTANCIA DE RETIRO",0,0,"C");
// $pdf->Cell(-259,10,"______________________",0,0,"C");

// $pdf->ln(12);

// $pdf->SetFont("Arial","",12);
// $pdf->Cell(125,10,"Quien suscribe lcda, Elaine Raquel Yanez, cedula de identidad",0,0,"R");

// $pdf->SetFont("Arial","",12);
// $pdf->Cell(135,10,"V-10.541.398, directora encargada de la Escuela Bolivariana Villas del ",0,0,"R");

// $pdf->ln(10);

// $pdf->SetFont("Arial","",12);
// $pdf->Cell(176,10,"del Pilar ubicada en municipio Araure Edo. Portuguesa, por medio de la presente hace constar",0,0,"R");

// $pdf->SetFont("Arial","",12);
// $pdf->Cell(-40,10,"",0,0,"R");	
// $pdf->Cell(82,10,"que el (la) Estudiante:",0,0,"R");$pdf->Cell(40,6,"",'B',0,"C");$pdf->Cell(-40,8,"Juan de Dios Arraiz",0,0,"C");

// $pdf->ln(10);

// $pdf->Cell(-2,10,"",0,0,"R");
// $pdf->Cell(40,6,"",'B',0,"C");
// $pdf->Cell(-66,8,"Moreno",0,0,"C");

// $pdf->SetFont("Arial","",12);
// $pdf->Cell(25,10,"",0,0,"R");	
// $pdf->Cell(82,10,",Cedula Escolar Nro:",0,0,"R");$pdf->Cell(40,6,"",'B',0,"C");$pdf->Cell(-40,9,"26.759.137",0,0,"C");

// $pdf->SetFont("Arial","",12);
// $pdf->Cell(-22,10,"",0,0,"R");	
// $pdf->Cell(82,10,",Curso el:",0,0,"R");$pdf->Cell(40,6,"",'B',0,"C");$pdf->Cell(-40,9,"5to",0,0,"C");

// $pdf->SetFont("Arial","",12);
// $pdf->Cell(115,10,"Grado en el subsistema de educacion-",0,0,"R");

// $pdf->ln(10);

// $pdf->SetFont("Arial","",12);
// $pdf->Cell(93,10,"primaria de esta institucion, durante el ano escolar",0,0,"R");$pdf->Cell(40,6,"",'B',0,"C");$pdf->Cell(-40,9,"2021-2022",0,0,"C");


// $pdf->SetFont("Arial","",12);
// $pdf->Cell(20,10,"",0,0,"R");	
// $pdf->Cell(82,10,",se retira del plante por motivo:",0,0,"R");$pdf->Cell(63,6,"",'B',0,"C");$pdf->Cell(-75,8,"de cambio de residencia",0,0,"C");

// $pdf->ln(10);

// $pdf->Cell(-2,10,"",0,0,"R");
// $pdf->Cell(40,6,"",'B',0,"C");$pdf->Cell(-40,9,"",0,0,"C");

// $pdf->SetFont("Arial","",12);
// $pdf->Cell(184,10,",constancia que se expide a peticion de la parte interesada en Araure a los: ",0,0,"R");

// $pdf->Cell(76,6,"",'B',0,"C");$pdf->Cell(-80,9,"20",0,0,"C");

// $pdf->ln(10);

// $pdf->SetFont("Arial","",12);
// $pdf->Cell(-58,10,"",0,0,"R");	
// $pdf->Cell(82,10,",dias del mes:",0,0,"R");$pdf->Cell(40,6,"",'B',0,"C");$pdf->Cell(-40,9,"Julio",0,0,"C");

// $pdf->SetFont("Arial","",12);
// $pdf->Cell(-24,10,"",0,0,"R");	
// $pdf->Cell(82,10,",del ano:",0,0,"R");$pdf->Cell(40,6,"",'B',0,"C");$pdf->Cell(-40,9,"2022",0,0,"C");

// $pdf->ln(20);

//  $pdf->Cell(200,10,"",0,0,"C");
// $pdf->Cell(40,-1,"",'B',0,"C");

// $pdf->Cell(-1,6,"Lcda. Elaine Yanez",0,0,"R");

// $pdf->ln(2);

// $pdf->Cell(232,12,"Director(E)",0,0,"R");


// $pdf->Output();

?>