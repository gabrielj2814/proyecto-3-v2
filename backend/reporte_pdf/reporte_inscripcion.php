<?php
include_once("../librerias_php/fpdf/fpdf.php");
class PdfInscripcion extends FPDF{

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


    function buscarRepresentante($listaRepresentante,$tipoRepresentante){
        $representanteEncontrado=null;
        foreach($listaRepresentante AS $representante){
            if($representante["tipo_representante"]===$tipoRepresentante){
                $representanteEncontrado=$representante;
                break;
            }
        }
        return $representanteEncontrado;
    }

    function retornarFechaFormatoLATAM($fecha){
        $fecha=explode("-",$fecha);
        return $fecha[1]."/".$fecha[2]."/".$fecha[0];
    }

    function calculaedad($fechanacimiento){
        list($ano,$mes,$dia) = explode("-",$fechanacimiento);
        $ano_diferencia  = date("Y") - $ano;
        $mes_diferencia = date("m") - $mes;
        $dia_diferencia   = date("d") - $dia;
        if ($dia_diferencia < 0 || $mes_diferencia < 0)
          $ano_diferencia--;
        return $ano_diferencia;
      }

    function generarPdf(){
        
        $nombrePdf="Reporte de Inscripcion.pdf";
        $this->AliasNbPages();
        $this->Addpage();

        $sexo=null;
        if($this->datosPdf[0]["procedencia_estudiante"]==="1"){
            $sexo="Masculino";
        }
        else{
            $sexo="Femenino";
        }
        

        $this->ln(22);

        //TITULO
        $this->SetFont("Arial","B",10);
        $this->Cell(0,10,"FICHA DE INSCRIPCION",0,0,"C");
        $this->Cell(-259,10,"_______________________",0,0,"C");

        $this->ln(8);

        //SUBTITULO
        $this->SetFont("Arial","B",10);
        $this->Cell(-2.5,10,"",0,0,"C");
        $this->Cell(0,10,"DATOS DEL ALUMNO",0,0,"L");
        $this->Cell(-485,10,"___________________",0,0,"C");

        $this->ln(8);
        // ========
        // ========
        // ========

        $this->SetFont("Arial","",10);
        $this->Cell(10.5,10,"",0,0,"C");
        $this->Cell(4,10,"Apellidos:",0,0,"R");$this->Cell(90,6,$this->datosPdf[0]["apellidos_estudiante"],'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(6,10,"Nombres:",0,0,"R");$this->Cell(90,6,$this->datosPdf[0]["nombres_estudiante"],'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(5,10,"",0,0,"C");
        $this->Cell(40,50,"",1,0,"R");
        $this->Cell(-40,40,"Foto",0,0,"C");

        $this->ln(8);

        $fecha=explode("-",$this->datosPdf[0]["fecha_nacimiento_estudiante"]);
        $fecha=$fecha[1]."/".$fecha[2]."/".$fecha[0];

        $this->SetFont("Arial","",10);
        $this->Cell(11,10,"",0,0,"C");
        $this->Cell(11,10,"Fecha de Nac:",0,0,"R");$this->Cell(30,6,$fecha,'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(13,10,"Lugar de Nac:",0,0,"R");$this->Cell(59,6,$this->datosPdf[0]["direccion_nacimiento_estudiante"],'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(-2,10,"Edo:",0,0,"R");$this->Cell(67,6,$this->datosPdf[0]["id_parroquia_nacimiento"],'B',0,"C");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(11,10,"",0,0,"C");
        $this->Cell(-3,10,"Edad:",0,0,"R");$this->Cell(20,6,$this->calculaedad($this->datosPdf[0]["fecha_nacimiento_estudiante"]).utf8_decode(" Años"),'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(-2,10,"",0,0,"C");
        $this->Cell(13,10,"Sexo:",0,0,"R");$this->Cell(30,6,$sexo,'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(12,10,"Procedencia:",0,0,"R");$this->Cell(120,6,$this->datosPdf[0]["procedencia_estudiante"],'B',0,"C");

        $this->ln(8);
        
        $this->SetFont("Arial","",10);
        $this->Cell(11.5,10,"",0,0,"C");
        $this->Cell(20,10,"Escolaridad Regular:",0,0,"R");$this->Cell(10,8,"",1,0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(14,10,"",0,0,"C");
        $this->Cell(5,10,"Repitiente:",0,0,"R");$this->Cell(10,8,"",1,0,"C");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(10.8,10,"",0,0,"C");
        $this->Cell(12,10,"Enfermedades:",0,0,"R");$this->Cell(120,6,$this->datosPdf[0]["enfermedades_estudiante"],'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(4,10,"",0,0,"C");
        $this->Cell(13,10,"Vive con :",0,0,"R");$this->Cell(53,6,$this->datosPdf[0]["vive_con_estudiante"],'B',0,"C");


        // =========
        // =========
        // =========
        // =========


        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(11.5,10,"",0,0,"C");
        $this->Cell(17.5,10,"Vacunas recibidas:",0,0,"R");

        $this->SetFont("Arial","",10);
        $this->Cell(8,10,"",0,0,"C");
        $this->Cell(13,10,"Antiraviolica:",0,0,"R");$this->Cell(21.5,6,"",'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(-2,10,"",0,0,"C");
        $this->Cell(13,10,"BCG:",0,0,"R");$this->Cell(21.5,6,"",'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(8,10,"",0,0,"C");
        $this->Cell(13,10,"Sarampion:",0,0,"R");$this->Cell(21.5,6,"",'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(-1.5,10,"",0,0,"C");
        $this->Cell(13,10,"Triple:",0,0,"R");$this->Cell(21.5,6,"",'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(-1,10,"",0,0,"C");
        $this->Cell(13,10,"Pollo:",0,0,"R");$this->Cell(21.5,6,"",'B',0,"C");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(5.8,10,"",0,0,"C");
        $this->Cell(13,10,"Antitetanica:",0,0,"R");$this->Cell(22.7,6,"",'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(14,10,"",0,0,"C");
        $this->Cell(13,10,"Fiebre amarilla:",0,0,"R");$this->Cell(22.7,6,"",'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(5,10,"",0,0,"C");
        $this->Cell(13,10,"Trivalente:",0,0,"R");$this->Cell(22.7,6,"",'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(6,10,"",0,0,"C");
        $this->Cell(13,10,"Meningitis:",0,0,"R");$this->Cell(22.7,6,"",'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(4,10,"",0,0,"C");
        $this->Cell(13,10,"Hepatitis:",0,0,"R");$this->Cell(22.7,6,"",'B',0,"C");

        $this->ln(8);

        // =========
        // =========
        // =========
        // =========
        //  ME QUEDE AQUI
        //SUBTITULO
        $this->SetFont("Arial","B",10);
        $this->Cell(-2.5,10,"",0,0,"C");
        $this->Cell(0,10,"DATOS DEL RESPRESENTANTE Y ASPECTOS FAMILIARES",0,0,"L");
        $this->Cell(-420,10,"____________________________________________________",0,0,"C");

        $this->ln(8);
        
        // $tipoRepresentante="O";
        // $datosOtro=$this->buscarRepresentante($this->datosPdf[0]["representante"],$tipoRepresentante);
        // $nombreOtro=$datosOtro["nombres_representante"]." ".$datosOtro["apellidos_representante"];

        $this->SetFont("Arial","",10);
        $this->Cell(10.5,10,"",0,0,"C");
        $this->Cell(4,10,"Apellidos:",0,0,"R");$this->Cell(90,6,"",'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(6,10,"Nombres:",0,0,"R");$this->Cell(90,6,"",'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(5,10,"",0,0,"C");
        $this->Cell(40,50,"",1,0,"R");
        $this->Cell(-40,50,"Foto",0,0,"C");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(0.4,10,"",0,0,"C");
        $this->Cell(11,10,"C.I. No:",0,0,"R");$this->Cell(30,6,"",'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(13,10,"Fecha de Nac:",0,0,"R");$this->Cell(59,6,"",'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(9,10,"Parentesco:",0,0,"R");$this->Cell(66,6,"",'B',0,"C");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(27,10,"",0,0,"C");
        $this->Cell(4,10,"Nivel de instruccion:",0,0,"R");$this->Cell(80,6,"",'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(14,10,"",0,0,"C");
        $this->Cell(6,10,"Ocupacion:",0,0,"R");$this->Cell(81.5,6,"",'B',0,"C");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(3,10,"",0,0,"C");
        $this->Cell(12,10,"Direccion:",0,0,"R");$this->Cell(198,6,"",'B',0,"C");
        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(-1.6,10,"",0,0,"C");
        $this->Cell(100,6,"",'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(13,10,"",0,0,"C");
        $this->Cell(5.8,10,"Telefonos:",0,0,"R");$this->Cell(95.5,6,"",'B',0,"C");

        $this->ln(8);
        $tipoRepresentante="M";
        $datosMadre=$this->buscarRepresentante($this->datosPdf[0]["representante"],$tipoRepresentante);
        $nombreMadre=$datosMadre["nombres_representante"]." ".$datosMadre["apellidos_representante"];
        $this->SetFont("Arial","B",10);
        $this->Cell(44,10,"",0,0,"C");
        $this->Cell(12,10,"Apellidos y Nombres de la madre:",0,0,"R");$this->Cell(156.5,6,$nombreMadre,'B',0,"C");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(0.4,10,"",0,0,"C");
        $this->Cell(11,10,"C.I. No:",0,0,"R");$this->Cell(50,6,$datosMadre["id_cedula_representante"],'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(13,10,"Fecha de Nac:",0,0,"R");$this->Cell(70,6,$this->retornarFechaFormatoLATAM($datosMadre["fecha_nacimiento_representante"]),'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(15,10,"",0,0,"C");
        $this->Cell(-3,10,"Edad:",0,0,"R");$this->Cell(44,6,$this->calculaedad($datosMadre["fecha_nacimiento_representante"]).utf8_decode(" Años"),'B',0,"C");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(27,10,"",0,0,"C");
        $this->Cell(4,10,"Nivel de instruccion:",0,0,"R");$this->Cell(80,6,$datosMadre["nivel_instruccion_representante"],'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(14,10,"",0,0,"C");
        $this->Cell(6,10,"Ocupacion:",0,0,"R");$this->Cell(81.5,6,$datosMadre["ocupacion_representante"],'B',0,"C");

        $this->ln(8);

        $tipoRepresentante="P";
        $datosPadre=$this->buscarRepresentante($this->datosPdf[0]["representante"],$tipoRepresentante);
        $nombrePadre=$datosPadre["nombres_representante"]." ".$datosPadre["apellidos_representante"];

        $this->SetFont("Arial","B",10);
        $this->Cell(40,10,"",0,0,"C");
        $this->Cell(12,10,"Apellidos y Nombres del padre:",0,0,"R");$this->Cell(160,6,$nombrePadre,'B',0,"C");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(0.4,10,"",0,0,"C");
        $this->Cell(11,10,"C.I. No:",0,0,"R");$this->Cell(50,6,$datosPadre["id_cedula_representante"],'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(13,10,"Fecha de Nac:",0,0,"R");$this->Cell(70,6,$this->retornarFechaFormatoLATAM($datosPadre["fecha_nacimiento_representante"]),'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(15,10,"",0,0,"C");
        $this->Cell(-3,10,"Edad:",0,0,"R");$this->Cell(44,6,$this->calculaedad($datosPadre["fecha_nacimiento_representante"]).utf8_decode(" Años"),'B',0,"C");

        $this->ln(8);
        $this->SetFont("Arial","",10);
        $this->Cell(27,10,"",0,0,"C");
        $this->Cell(4,10,"",0,0,"R");
        $this->ln(40);

        $this->SetFont("Arial","",10);
        $this->Cell(27,10,"",0,0,"C");
        $this->Cell(4,10,"Nivel de instruccion:",0,0,"R");$this->Cell(80,6,$datosPadre["nivel_instruccion_representante"],'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(14,10,"",0,0,"C");
        $this->Cell(6,10,"Ocupacion:",0,0,"R");$this->Cell(81.5,6,$datosPadre["ocupacion_representante"],'B',0,"C");
        // ======
        // ======
        // ======
        // ======
        $this->ln(8);

        $this->SetFont("Arial","B",10);
        $this->Cell(55.5,10,"",0,0,"C");
        $this->Cell(12,10,"Documentos consignados al inscribirse:",0,0,"R");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(41,10,"",0,0,"C");
        $this->Cell(17.5,10,"Fotocopia de la C.I del representante:",0,0,"R");;$this->Cell(10,6,"",'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(20,10,"",0,0,"C");
        $this->Cell(13,10,"Informe descriptivo:",0,0,"R");$this->Cell(10,6,"",'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(30,10,"",0,0,"C");
        $this->Cell(13,10,"Constancia de promocion:",0,0,"R");$this->Cell(10,6,"",'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(38,10,"",0,0,"C");
        $this->Cell(13,10,"Fotocopia de la C.I del alumno:",0,0,"R");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(-1,10,"",0,0,"C");
        $this->Cell(10,6,"",'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(63,10,"",0,0,"C");
        $this->Cell(17.5,10,"Fotocopia de la partida de nacimiento del alumno:",0,0,"R");$this->Cell(10,6,"",'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(20,10,"",0,0,"C");
        $this->Cell(13,10,"Control de vacunas:",0,0,"R");$this->Cell(10,6,"",'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(15,10,"",0,0,"C");
        $this->Cell(13,10,"Foto del alumno:",0,0,"R");$this->Cell(10,6,"",'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(22,10,"",0,0,"C");
        $this->Cell(13,10,"Foto del representan",0,0,"R");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(-8,10,"",0,0,"C");
        $this->Cell(12,10,"te:",0,0,"R");$this->Cell(10,6,"",'B',0,"C");

        $this->SetFont("Arial","",10);
        $this->Cell(-1,10,"",0,0,"C");
        $this->Cell(12,10,"otros:",0,0,"R");$this->Cell(190,6,"",'B',0,"C");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(12.5,10,"",0,0,"C");
        $this->Cell(12,10,"Observaciones:",0,0,"R");$this->Cell(190,6,"",'B',0,"C");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(-1,10,"",0,0,"C");
        $this->Cell(215.5,6,"",'B',0,"C");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(-1,10,"",0,0,"C");
        $this->Cell(215.5,6,"",'B',0,"C");

        

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
// $pdf->Cell(0,10,"FICHA DE INSCRIPCION",0,0,"C");
// $pdf->Cell(-259,10,"_______________________",0,0,"C");

// $pdf->ln(8);

// //SUBTITULO
// $pdf->SetFont("Arial","B",10);
// $pdf->Cell(-2.5,10,"",0,0,"C");
// $pdf->Cell(0,10,"DATOS DEL ALUMNO",0,0,"L");
// $pdf->Cell(-485,10,"___________________",0,0,"C");

// $pdf->ln(8);

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(10.5,10,"",0,0,"C");
// $pdf->Cell(4,10,"Apellidos:",0,0,"R");$pdf->Cell(90,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(12,10,"",0,0,"C");
// $pdf->Cell(6,10,"Nombres:",0,0,"R");$pdf->Cell(90,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(5,10,"",0,0,"C");
// $pdf->Cell(40,50,"",1,0,"R");
// $pdf->Cell(-40,40,"Foto",0,0,"C");

// $pdf->ln(8);

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(11,10,"",0,0,"C");
// $pdf->Cell(11,10,"Fecha de Nac:",0,0,"R");$pdf->Cell(30,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(12,10,"",0,0,"C");
// $pdf->Cell(13,10,"Lugar de Nac:",0,0,"R");$pdf->Cell(59,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(12,10,"",0,0,"C");
// $pdf->Cell(-2,10,"Edo:",0,0,"R");$pdf->Cell(67,6,"",'B',0,"C");

// $pdf->ln(8);

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(11,10,"",0,0,"C");
// $pdf->Cell(-3,10,"Edad:",0,0,"R");$pdf->Cell(20,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(-2,10,"",0,0,"C");
// $pdf->Cell(13,10,"Sexo:",0,0,"R");$pdf->Cell(30,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(12,10,"",0,0,"C");
// $pdf->Cell(12,10,"Procedencia:",0,0,"R");$pdf->Cell(120,6,"",'B',0,"C");

// $pdf->ln(8);

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(11.5,10,"",0,0,"C");
// $pdf->Cell(20,10,"Escolaridad Regular:",0,0,"R");$pdf->Cell(10,8,"",1,0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(14,10,"",0,0,"C");
// $pdf->Cell(5,10,"Repitiente:",0,0,"R");$pdf->Cell(10,8,"",1,0,"C");

// $pdf->ln(8);

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(10.8,10,"",0,0,"C");
// $pdf->Cell(12,10,"Enfermedades:",0,0,"R");$pdf->Cell(120,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(4,10,"",0,0,"C");
// $pdf->Cell(13,10,"Vive con :",0,0,"R");$pdf->Cell(53,6,"",'B',0,"C");





// $pdf->ln(8);

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(11.5,10,"",0,0,"C");
// $pdf->Cell(17.5,10,"Vacunas recibidas:",0,0,"R");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(8,10,"",0,0,"C");
// $pdf->Cell(13,10,"Antiraviolica:",0,0,"R");$pdf->Cell(21.5,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(-2,10,"",0,0,"C");
// $pdf->Cell(13,10,"BCG:",0,0,"R");$pdf->Cell(21.5,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(8,10,"",0,0,"C");
// $pdf->Cell(13,10,"Sarampion:",0,0,"R");$pdf->Cell(21.5,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(-1.5,10,"",0,0,"C");
// $pdf->Cell(13,10,"Triple:",0,0,"R");$pdf->Cell(21.5,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(-1,10,"",0,0,"C");
// $pdf->Cell(13,10,"Pollo:",0,0,"R");$pdf->Cell(21.5,6,"",'B',0,"C");

// $pdf->ln(8);

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(5.8,10,"",0,0,"C");
// $pdf->Cell(13,10,"Antitetanica:",0,0,"R");$pdf->Cell(22.7,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(14,10,"",0,0,"C");
// $pdf->Cell(13,10,"Fiebre amarilla:",0,0,"R");$pdf->Cell(22.7,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(5,10,"",0,0,"C");
// $pdf->Cell(13,10,"Trivalente:",0,0,"R");$pdf->Cell(22.7,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(6,10,"",0,0,"C");
// $pdf->Cell(13,10,"Meningitis:",0,0,"R");$pdf->Cell(22.7,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(4,10,"",0,0,"C");
// $pdf->Cell(13,10,"Hepatitis:",0,0,"R");$pdf->Cell(22.7,6,"",'B',0,"C");






// $pdf->ln(8);

// //SUBTITULO
// $pdf->SetFont("Arial","B",10);
// $pdf->Cell(-2.5,10,"",0,0,"C");
// $pdf->Cell(0,10,"DATOS DEL RESPRESENTANTE Y ASPECTOS FAMILIARES",0,0,"L");
// $pdf->Cell(-420,10,"____________________________________________________",0,0,"C");

// $pdf->ln(8);

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(10.5,10,"",0,0,"C");
// $pdf->Cell(4,10,"Apellidos:",0,0,"R");$pdf->Cell(90,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(12,10,"",0,0,"C");
// $pdf->Cell(6,10,"Nombres:",0,0,"R");$pdf->Cell(90,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(5,10,"",0,0,"C");
// $pdf->Cell(40,50,"",1,0,"R");
// $pdf->Cell(-40,50,"Foto",0,0,"C");

// $pdf->ln(8);

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(0.4,10,"",0,0,"C");
// $pdf->Cell(11,10,"C.I. No:",0,0,"R");$pdf->Cell(30,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(12,10,"",0,0,"C");
// $pdf->Cell(13,10,"Fecha de Nac:",0,0,"R");$pdf->Cell(59,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(12,10,"",0,0,"C");
// $pdf->Cell(9,10,"Parentesco:",0,0,"R");$pdf->Cell(66,6,"",'B',0,"C");

// $pdf->ln(8);

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(27,10,"",0,0,"C");
// $pdf->Cell(4,10,"Nivel de instruccion:",0,0,"R");$pdf->Cell(80,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(14,10,"",0,0,"C");
// $pdf->Cell(6,10,"Ocupacion:",0,0,"R");$pdf->Cell(81.5,6,"",'B',0,"C");

// $pdf->ln(8);

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(3,10,"",0,0,"C");
// $pdf->Cell(12,10,"Direccion:",0,0,"R");$pdf->Cell(198,6,"",'B',0,"C");
// $pdf->ln(8);

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(-1.6,10,"",0,0,"C");
// $pdf->Cell(100,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(13,10,"",0,0,"C");
// $pdf->Cell(5.8,10,"Telefonos:",0,0,"R");$pdf->Cell(95.5,6,"",'B',0,"C");

// $pdf->ln(8);

// $pdf->SetFont("Arial","B",10);
// $pdf->Cell(44,10,"",0,0,"C");
// $pdf->Cell(12,10,"Apellidos y Nombres de la madre:",0,0,"R");$pdf->Cell(156.5,6,"",'B',0,"C");

// $pdf->ln(8);

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(0.4,10,"",0,0,"C");
// $pdf->Cell(11,10,"C.I. No:",0,0,"R");$pdf->Cell(50,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(12,10,"",0,0,"C");
// $pdf->Cell(13,10,"Fecha de Nac:",0,0,"R");$pdf->Cell(70,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(15,10,"",0,0,"C");
// $pdf->Cell(-3,10,"Edad:",0,0,"R");$pdf->Cell(44,6,"",'B',0,"C");

// $pdf->ln(8);

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(27,10,"",0,0,"C");
// $pdf->Cell(4,10,"Nivel de instruccion:",0,0,"R");$pdf->Cell(80,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(14,10,"",0,0,"C");
// $pdf->Cell(6,10,"Ocupacion:",0,0,"R");$pdf->Cell(81.5,6,"",'B',0,"C");

// $pdf->ln(8);



























// $pdf->SetFont("Arial","B",10);
// $pdf->Cell(40,10,"",0,0,"C");
// $pdf->Cell(12,10,"Apellidos y Nombres del padre:",0,0,"R");$pdf->Cell(160,6,"",'B',0,"C");

// $pdf->ln(8);

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(0.4,10,"",0,0,"C");
// $pdf->Cell(11,10,"C.I. No:",0,0,"R");$pdf->Cell(50,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(12,10,"",0,0,"C");
// $pdf->Cell(13,10,"Fecha de Nac:",0,0,"R");$pdf->Cell(70,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(15,10,"",0,0,"C");
// $pdf->Cell(-3,10,"Edad:",0,0,"R");$pdf->Cell(44,6,"",'B',0,"C");

// $pdf->ln(8);

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(27,10,"",0,0,"C");
// $pdf->Cell(4,10,"Nivel de instruccion:",0,0,"R");$pdf->Cell(80,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(14,10,"",0,0,"C");
// $pdf->Cell(6,10,"Ocupacion:",0,0,"R");$pdf->Cell(81.5,6,"",'B',0,"C");

// $pdf->ln(8);

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(8,10,"",0,0,"C");
// $pdf->Cell(11,10,"No. de hijos:",0,0,"R");$pdf->Cell(35,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(22,10,"",0,0,"C");
// $pdf->Cell(13,10,"Constitucion familiar:",0,0,"R");$pdf->Cell(60,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(20,10,"",0,0,"C");
// $pdf->Cell(-3,10,"Ingresos:",0,0,"R");$pdf->Cell(46.5,6,"",'B',0,"C");

// $pdf->ln(8);

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(8.5,10,"",0,0,"C");
// $pdf->Cell(17.5,10,"Tipo de vivienda:",0,0,"R");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(1,10,"",0,0,"C");
// $pdf->Cell(13,10,"Rancho:",0,0,"R");$pdf->Cell(21.5,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(-2,10,"",0,0,"C");
// $pdf->Cell(13,10,"Casa:",0,0,"R");$pdf->Cell(21.5,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(1,10,"",0,0,"C");
// $pdf->Cell(13,10,"Quinta:",0,0,"R");$pdf->Cell(21.5,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(11,10,"",0,0,"C");
// $pdf->Cell(13,10,"Apartamento:",0,0,"R");$pdf->Cell(21.5,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(5,10,"",0,0,"C");
// $pdf->Cell(13,10,"Alquilada:",0,0,"R");$pdf->Cell(20,6,"",'B',0,"C");

// $pdf->ln(8);

// $pdf->SetFont("Arial","B",10);
// $pdf->Cell(95,10,"",0,0,"C");
// $pdf->Cell(12,10,"No. Alumnos inscritos en el plantel por el mismo representante:",0,0,"R");

// $pdf->ln(8);

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(2,10,"",0,0,"C");
// $pdf->Cell(17.5,10,"Educ. Inicial:",0,0,"R");$pdf->Cell(19,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(-2,10,"",0,0,"C");
// $pdf->Cell(13,10,"1ero:",0,0,"R");$pdf->Cell(19,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(-2,10,"",0,0,"C");
// $pdf->Cell(13,10,"2do:",0,0,"R");$pdf->Cell(19,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(-2,10,"",0,0,"C");
// $pdf->Cell(13,10,"3ero:",0,0,"R");$pdf->Cell(19,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(-4,10,"",0,0,"C");
// $pdf->Cell(13,10,"4to:",0,0,"R");$pdf->Cell(19,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(-4,10,"",0,0,"C");
// $pdf->Cell(13,10,"5to:",0,0,"R");$pdf->Cell(19,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(-4,10,"",0,0,"C");
// $pdf->Cell(13,10,"6to:",0,0,"R");$pdf->Cell(19,6,"",'B',0,"C");

// $pdf->ln(8);

// $pdf->SetFont("Arial","B",10);
// $pdf->Cell(55.5,10,"",0,0,"C");
// $pdf->Cell(12,10,"Documentos consignados al inscribirse:",0,0,"R");

// $pdf->ln(8);

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(41,10,"",0,0,"C");
// $pdf->Cell(17.5,10,"Fotocopia de la C.I del representante:",0,0,"R");;$pdf->Cell(10,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(20,10,"",0,0,"C");
// $pdf->Cell(13,10,"Informe descriptivo:",0,0,"R");$pdf->Cell(10,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(30,10,"",0,0,"C");
// $pdf->Cell(13,10,"Constancia de promocion:",0,0,"R");$pdf->Cell(10,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(38,10,"",0,0,"C");
// $pdf->Cell(13,10,"Fotocopia de la C.I del alumno:",0,0,"R");

// $pdf->ln(8);

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(-1,10,"",0,0,"C");
// $pdf->Cell(10,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(63,10,"",0,0,"C");
// $pdf->Cell(17.5,10,"Fotocopia de la partida de nacimiento del alumno:",0,0,"R");$pdf->Cell(10,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(20,10,"",0,0,"C");
// $pdf->Cell(13,10,"Control de vacunas:",0,0,"R");$pdf->Cell(10,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(15,10,"",0,0,"C");
// $pdf->Cell(13,10,"Foto del alumno:",0,0,"R");$pdf->Cell(10,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(22,10,"",0,0,"C");
// $pdf->Cell(13,10,"Foto del representan",0,0,"R");

// $pdf->ln(8);

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(-8,10,"",0,0,"C");
// $pdf->Cell(12,10,"te:",0,0,"R");$pdf->Cell(10,6,"",'B',0,"C");

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(-1,10,"",0,0,"C");
// $pdf->Cell(12,10,"otros:",0,0,"R");$pdf->Cell(190,6,"",'B',0,"C");

// $pdf->ln(8);

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(12.5,10,"",0,0,"C");
// $pdf->Cell(12,10,"Observaciones:",0,0,"R");$pdf->Cell(190,6,"",'B',0,"C");

// $pdf->ln(8);

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(-1,10,"",0,0,"C");
// $pdf->Cell(215.5,6,"",'B',0,"C");

// $pdf->ln(8);

// $pdf->SetFont("Arial","",10);
// $pdf->Cell(-1,10,"",0,0,"C");
// $pdf->Cell(215.5,6,"",'B',0,"C");



// $pdf->Output();

?>