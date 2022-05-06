<?php


include_once("../librerias_php/fpdf/fpdf.php");
class PdfPromocion extends FPDF{

    private $datosPdf;
    private $generado;
    private $datosCintillo;
    private $nombreCintillo;
    function __construct($datos,$generado,$director,$datosCintillo){
        $this->datosPdf=$datos;
        $this->generado=$generado;
        $this->director=$director;
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

    function generarPdf(){
        
        $nombrePdf="Reporte de Promoción.pdf";
        $this->AliasNbPages();
        $this->Addpage();
        $this->ln(22);
        //TITULO
        $this->SetFont("Arial","B",10);
        $this->Cell(42,10,'',0,0,'C');
        $this->Cell(0,10,"CERTIFICADO DE APRENDIZAJE",0,0,"L");

        $this->ln(5);

        $this->Cell(0,10,"INFORME DESCRIPTIVO",0,0,"C");

        $this->ln(5);

        $this->Cell(120,10,'',0,0,'C');
        $this->Cell(1,10,"ANO ESCOLAR:",0,0,"C");$this->Cell(12,10,'',0,0,'C');$this->Cell(1,10,$this->datosPdf[0]["ano_desde"]." - ".$this->datosPdf[0]["ano_hasta"],0,"L");

        $this->ln(12);
        //fECHA
        $this->SetFont("Arial","",10);
        $this->Cell(187,10,"",0,0,"L");
        $this->Cell(25,5,'Codigo postal:',1,0,'l');
        $this->Cell(25,5,'0000000000',1,0,'l');

        $this->ln(5);

        $this->Cell(187,10,"",0,0,"L");
        $this->Cell(25,5,'Codigo D.E.A:',1,0,'l');
        $this->Cell(25,5,'0000000000',1,0,'l');


        $this->ln(15);

        $this->SetFont("Arial","B",10);
        $this->Cell(42,10,'',0,0,'C');
        $this->Cell(0,10,"DATOS DE IDENTIFICACION",0,0,"L");

        $this->ln(8);
        $nombreEstudiante=$this->datosPdf[0]["nombres_estudiante"]." ".$this->datosPdf[0]["apellidos_estudiante"];
        $fechaPromocion=explode("-",$this->datosPdf[0]["fecha_promocion"]);
        $cedula="no tiene";
        if($this->datosPdf[0]["cedula_estudiante"]===null){
            $cedula=$this->datosPdf[0]["cedula_escolar"];
        }
        else{
            $cedula=$this->datosPdf[0]["cedula_estudiante"];
        }
        //TABLA
        $this->SetFont("Arial","",10);
        $this->Cell(42,10,'',0,0,'C');
        $this->Cell(120,5,'Nombres y apellidos:',1,0,'l');$this->Cell(-87,10,'',0,0,'C');$this->Cell(1,5,$nombreEstudiante,0,"L");
        $this->Cell(86,10,'',0,0,'C');
        $this->Cell(60,5,'Cedula:',1,0,'l');$this->Cell(-48,10,'',0,0,'C');$this->Cell(1,5,$cedula,0,"L");


        $this->ln(5);

        $this->Cell(42,10,'',0,0,'C');
        $this->Cell(60,5,'Fecha de nacimiento:',1,0,'l');$this->Cell(-25,10,'',0,0,'C');$this->Cell(1,5,$this->retornarFechaFormatoLATAM($this->datosPdf[0]["fecha_nacimiento_estudiante"]),0,"L");
        $this->Cell(24,10,'',0,0,'C');
        $this->Cell(60,5,'Lugar de nacimiento:',1,0,'l');$this->Cell(-26,10,'',0,0,'C');$this->Cell(1,5,$this->datosPdf[0]["ubicacion"]["nombre_ciudad"],0,"L");
        $this->Cell(25,10,'',0,0,'C');
        $this->Cell(60,5,'Estado:',1,0,'l');$this->Cell(-47,10,'',0,0,'C');$this->Cell(1,5,$this->datosPdf[0]["ubicacion"]["nombre_estado"],0,"L");

        $this->ln(5);
        $grado=NULL;
        $aula=$this->datosPdf[0]["nombre_aula"];
        switch($this->datosPdf[0]["numero_grado"]){
            case '1': $grado="1RO"; break;
            case '2': $grado="2DO"; break;
            case '3': $grado="3RO"; break;
            case '4': $grado="4TO"; break;
            case '5': $grado="5TO"; break;
            case '6': $grado="6TO"; break;
        }
        $this->Cell(42,10,'',0,0,'C');
        $this->Cell(120,5,'Institucion:',1,0,'l');$this->Cell(-102,10,'',0,0,'C');$this->Cell(1,5,"Escuela Bolivariana Villas del pilar",0,"L");
        $this->Cell(101,10,'',0,0,'C');
        $this->Cell(60,5,'Grado:',1,0,'l');$this->Cell(-47,10,'',0,0,'C');$this->Cell(1,5,$grado." ".$aula,0,"L");

        $this->ln(5);
        $nombreProfesor=$this->datosPdf[0]["nombres"]." ".$this->datosPdf[0]["apellidos"];
        $this->Cell(42,10,'',0,0,'C');
        $this->Cell(180,5,'Docente:',1,0,'l');$this->Cell(-165,10,'',0,0,'C');$this->Cell(1,5,$nombreProfesor,0,"L");

        $this->ln(10);

        $this->SetFont("Arial","B",10);
        $this->Cell(0,10,"Descripcion de los logros alcanzados durante el ano escolar",0,0,"C");

        $this->ln(10);
        //aca van los texto
        $this->SetFont("Arial","",10);
        $this->Cell(167,10,$this->datosPdf[0]["descripcion_nota_promocion"],0,0,"R");

        $this->ln(10);

        $this->SetFont("Arial","B",10);
        $this->Cell(0,10,"RECOMENDACIONES A LA MADRE, PADRE O REPRESENTANTE",0,0,"C");

        $this->ln(10);
        //aca van los texto
        $this->SetFont("Arial","",10);
        $this->Cell(167,10,$this->datosPdf[0]["recomendacion_pariente"],0,0,"R");

        $this->ln(10);

        $this->SetFont("Arial","",10);
        $this->Cell(-14,10,"",0,0,"R");	
        $this->Cell(82,10,"En Araure a los:",0,0,"R");$this->Cell(10,6,"",'B',0,"C");$this->Cell(-11,9,$fechaPromocion[2],0,0,"C");
        $this->Cell(59,10,"dias del mes de ".$this->obtenerElMes($fechaPromocion[1])." de ".$fechaPromocion[0],0,0,"R");

        $this->ln(20);

        $this->Cell(60,10,"",0,0,"C");
        $this->Cell(40,7,"",'B',0,"C");

        $this->ln(5);

        $this->Cell(95,10,"Prof ".$nombreProfesor,0,0,"R");

        $this->ln(3);

        $this->Cell(93,10,"Docente de aula",0,0,"R");



        $this->Cell(60,10,"",0,0,"C");
        $this->Cell(40,-1,"",'B',0,"C");
        $nombreDirector=$this->director[0]["nombres"]." ".$this->director[0]["apellidos"];
        $this->Cell(-5,6,"Lcd. ".$nombreDirector,0,0,"R");


        $this->Cell(-5,12,"Director(E)",0,0,"R");


        $this->Output("F","../upload/reporte/".$nombrePdf);
        return $nombrePdf;
    }

}


?>