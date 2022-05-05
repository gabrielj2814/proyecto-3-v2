<?php


// include_once("fpdf/fpdf.php");
include_once("../librerias_php/fpdf/fpdf.php");
class PdfAsistenciaSemanal extends FPDF{

    private $datosPdf;
    private $generado;
    private $datosCintillo;
    private $nombreCintillo;
    function __construct($datos,$semana,$generado,$datosCintillo){
        $this->datosPdf=$datos;
        $this->semana=$semana;
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
        
        $nombrePdf="Asistencia Semanal.pdf";
        $this->AliasNbPages();
        $this->Addpage();
        $this->ln(22);
        //TITULO
        $this->SetFont("Arial","B",10);
        $this->Cell(0,10,"LISTADO DE ASISTENCIAS",0,0,"L");

        $grado=NULL;
        switch($this->datosPdf[0]["datosExtra"]["numero_grado"]){
            case '1': $grado="1 RO"; break;
            case '2': $grado="2 DO"; break;
            case '3': $grado="3 RO"; break;
            case '4': $grado="4 TO"; break;
            case '5': $grado="5 TO"; break;
            case '6': $grado="6 TO"; break;
        }

        $this->Cell(-208,10,'',0,0,'C');
        $this->Cell(1,10, $grado.":",0,0,"C");$this->Cell(3,10,'',0,0,'C');$this->Cell(1,10,$this->datosPdf[0]["datosExtra"]["nombre_aula"],0,"L");

        $this->ln(12);

        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(20,10,"Nombre del docente:",0,0,"R");$this->Cell(60,6,$this->generado,'B',0,"C");
        //fECHA
        $this->SetFont("Arial","",10);
        $this->Cell(90,10,"",0,0,"L");
        $this->Cell(12,10,"Araure",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(10,6,date("d"),'B',0,"C");$this->Cell(1,10,"",0,0,"L");
        $this->Cell(5,10,"de",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(17,6,date("m"),'B',0,"C");
        $this->Cell(1,10,"",0,0,"L");
        $this->Cell(5,10,"de",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(17,6,date("Y"),'B',0,"C");

        $this->ln(15);

        //TABLA
        $this->SetX(34);
        $this->Cell(60,10,'Nombres y apellidos',1,0,'C');
        $this->Cell(30,10,'Lunes',1,0,'C');
        $this->Cell(30,10,'Martes',1,0,'C');
        $this->Cell(30,10,'Miercoles',1,0,'C');
        $this->Cell(30,10,'Jueves',1,0,'C');
        $this->Cell(30,10,'Viernes',1,0,'C');

        foreach($this->datosPdf AS $estudiante){
            $nombre=$estudiante["nombres_estudiante"]." ".$estudiante["apellidos_estudiante"];
            $this->ln(10);

            $this->SetX(34);
            $this->Cell(60,10,$nombre,1,0,'C');
            foreach($this->semana AS $fechaSemana){
                if(count($estudiante["asistencias"][$fechaSemana])>0){
                    if($estudiante["asistencias"][$fechaSemana]["estatus_asistencia_estudiante"]==="1"){
                        $this->Cell(30,10,'O',1,0,'C');
                    }
                    else if($estudiante["asistencias"][$fechaSemana]["estatus_asistencia_estudiante"]==="0"){
                        $this->Cell(30,10,'X',1,0,'C');
                    }
                    else{
                        $this->Cell(30,10,'N',1,0,'C');
                    }
                }
                else{
                    $this->Cell(30,10,' ',1,0,'C');
                }
            }
    
        }
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