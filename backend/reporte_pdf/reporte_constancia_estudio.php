<?php

include_once("../librerias_php/fpdf/fpdf.php");
class PdfConstanciaEstudio extends FPDF{

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

    function retornarFechaFormatoLATAM($fecha){
        $fecha=explode("-",$fecha);
        return $fecha[2]."/".$fecha[1]."/".$fecha[0];
    }

    function obtenerElMes($numeroMes){
        $mes=[
            "01" => "Enero",
            "02" => "Febrero",
            "03" => "Marzo",
            "04" => "Abril",
            "05" => "Mayo",
            "06" => "Junio",
            "07" => "Julio",
            "08" => "Agosto",
            "09" => "Septiembre",
            "10" => "Octubre",
            "11" => "Nombienbre",
            "12" => "Diciembre"
        ];
        return $mes[$numeroMes];
    }

    function calculaEdad($fechanacimiento){
        list($ano,$mes,$dia) = explode("-",$fechanacimiento);
        $ano_diferencia  = date("Y") - $ano;
        $mes_diferencia = date("m") - $mes;
        $dia_diferencia   = date("d") - $dia;
        if ($dia_diferencia < 0 || $mes_diferencia < 0)
        $ano_diferencia--;
        return $ano_diferencia;
    }

    function generarPdf($fecha){
        
        $nombrePdf="Contancia De Estudio.pdf";
        $this->AliasNbPages();
        $this->Addpage();
        $this->ln(22);
        // TITULO
        $this->SetFont("Arial","B",10);
        $this->Cell(0,10,"CONSTANCIA DE ESTUDIOS",0,0,"C");
        $this->Cell(-259,10,"________________________",0,0,"C");

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
        $this->Cell(-12,10,"",0,0,"R");	
        $this->Cell(82,10,",Nacido (a) en:",0,0,"R");$this->Cell(40,6,"",'B',0,"C");$this->Cell(-40,9,$this->datosPdf[0]["ubicacion"]["nombre_ciudad"],0,0,"C");
        $fechaNacimiento=explode("-",$this->datosPdf[0]["fecha_nacimiento_estudiante"]);
        $this->SetFont("Arial","",12);
        $this->Cell(-34,10,"",0,0,"R");	
        $this->Cell(82,10,",el:",0,0,"R");$this->Cell(61,6,"",'B',0,"C");$this->Cell(-61,9,$fechaNacimiento[2]." de ".$this->obtenerElMes($fechaNacimiento[1]),0,0,"C");


        $this->ln(10);

        $this->SetFont("Arial","",12);
        $this->Cell(-78,10,"",0,0,"R");	
        $this->Cell(82,10,",de:",0,0,"R");$this->Cell(37,6,"",'B',0,"C");$this->Cell(-37,9,$this->calculaEdad($this->datosPdf[0]["fecha_nacimiento_estudiante"]),0,0,"C");

        $this->SetFont("Arial","",12);
        $this->Cell(-16,10,"",0,0,"R");	
        $this->Cell(82,9,",anos de edad",0,0,"R");
        $grado=NULL;
        switch($this->datosPdf[0]["numero_grado"]){
            case '1': $grado="1 RO"; break;
            case '2': $grado="2 DO"; break;
            case '3': $grado="3 RO"; break;
            case '4': $grado="4 TO"; break;
            case '5': $grado="5 TO"; break;
            case '6': $grado="6 TO"; break;
        }
        $this->SetFont("Arial","",12);
        $this->Cell(-13,10,"",0,0,"R");	
        $this->Cell(82,9,",inscrito en la institucion en el grado:",0,0,"R");$this->Cell(46,6,"",'B',0,"C");$this->Cell(-46,9,$grado,0,0,"C");

        $this->SetFont("Arial","",12);
        $this->Cell(39,10,"",0,0,"R");	
        $this->Cell(82,9,",del subsistema de educacion primaria",0,0,"R");


        $this->ln(10);

        $this->SetFont("Arial","",12);
        $this->Cell(-18,10,"",0,0,"R");	
        $this->Cell(82,9,"Bolivariana, durante el ano escolar:",0,0,"R");$this->Cell(40,6,"",'B',0,"C");$this->Cell(-40,9,$this->datosPdf[0]["ano_desde"]." - ".$this->datosPdf[0]["ano_hasta"],0,0,"C");
        $fecha=explode("-",$fecha);
        $this->SetFont("Arial","",12);
        $this->Cell(185,10,",constancia que se expide a peticion de la parte interesada en Araure a los: ",0,0,"R");

        $this->Cell(11,6,"",'B',0,"C");$this->Cell(-11,9,$fecha[2],0,0,"C");

        $this->ln(10);
        
        $this->SetFont("Arial","",12);
        $this->Cell(-58,10,"",0,0,"R");	
        $this->Cell(82,10,",dias del mes:",0,0,"R");$this->Cell(40,6,"",'B',0,"C");$this->Cell(-40,9,$this->obtenerElMes($fecha[1]),0,0,"C");
        
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


// include_once("fpdf/fpdf.php");
// $pdf = new FPDF("L","mm","letter");
// $pdf->Addpage();
// $pdf->Image("imagenes/encabezado1.jpg",24,10,190,12);$pdf->Image("imagenes/carabobo.jpg",213,2,50,30);

// $pdf->ln(22);

// //TITULO
// $pdf->SetFont("Arial","B",10);
// $pdf->Cell(0,10,"CONSTANCIA DE ESTUDIOS",0,0,"C");
// $pdf->Cell(-259,10,"________________________",0,0,"C");

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
// $pdf->Cell(-12,10,"",0,0,"R");	
// $pdf->Cell(82,10,",Nacido (a) en:",0,0,"R");$pdf->Cell(40,6,"",'B',0,"C");$pdf->Cell(-40,9,"Araure",0,0,"C");

// $pdf->SetFont("Arial","",12);
// $pdf->Cell(-34,10,"",0,0,"R");	
// $pdf->Cell(82,10,",el:",0,0,"R");$pdf->Cell(61,6,"",'B',0,"C");$pdf->Cell(-61,9,"24 de noviembre",0,0,"C");


// $pdf->ln(10);

// $pdf->SetFont("Arial","",12);
// $pdf->Cell(-78,10,"",0,0,"R");	
// $pdf->Cell(82,10,",de:",0,0,"R");$pdf->Cell(37,6,"",'B',0,"C");$pdf->Cell(-37,9,"5",0,0,"C");

// $pdf->SetFont("Arial","",12);
// $pdf->Cell(-16,10,"",0,0,"R");	
// $pdf->Cell(82,9,",anos de edad",0,0,"R");

// $pdf->SetFont("Arial","",12);
// $pdf->Cell(-13,10,"",0,0,"R");	
// $pdf->Cell(82,9,",inscrito en la institucion en el grado:",0,0,"R");$pdf->Cell(46,6,"",'B',0,"C");$pdf->Cell(-46,9,"5to",0,0,"C");

// $pdf->SetFont("Arial","",12);
// $pdf->Cell(39,10,"",0,0,"R");	
// $pdf->Cell(82,9,",del subsistema de educacion primaria",0,0,"R");


// $pdf->ln(10);

// $pdf->SetFont("Arial","",12);
// $pdf->Cell(-18,10,"",0,0,"R");	
// $pdf->Cell(82,9,"Bolivariana, durante el ano escolar:",0,0,"R");$pdf->Cell(40,6,"",'B',0,"C");$pdf->Cell(-40,9,"2022-2023",0,0,"C");

// $pdf->SetFont("Arial","",12);
// $pdf->Cell(185,10,",constancia que se expide a peticion de la parte interesada en Araure a los: ",0,0,"R");

// $pdf->Cell(11,6,"",'B',0,"C");$pdf->Cell(-11,9,"20",0,0,"C");

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