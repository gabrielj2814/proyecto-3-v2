<?php


class PdfListaEspecialidades {

    private $datosPdf;
    function __construct($datos){
        $this->datosPdf=$datos;
    }



    function generarPdf(){
        include_once("../librerias_php/fpdf/fpdf.php");
        $nombrePdf="listado de especialidad por medico.pdf";
        $pdf = new FPDF("L","mm","letter");
        $pdf->Addpage();
        // $pdf->Image("imagenes/encabezado1.jpg",40,5,200,10);
        $pdf->Image("http://localhost:80/proyecto/backend/reporte_pdf/imagenes_pdf/encabezado1.jpg",40,5,200,10);

        $pdf->ln(12);

        //TITULO
        $pdf->SetFont("Arial","B",10);
        $pdf->Cell(0,10,"REPORTE DEL MEDICO",0,0,"C");

        $pdf->ln(10);

        $pdf->SetFont("Arial","",10);
        $pdf->Cell(12,10,"",0,0,"C");
        $pdf->Cell(15,10,"Nombre Medico:",0,0,"R");$pdf->Cell(30,6,utf8_decode($this->datosPdf[0]["nombre_medico"]." ".$this->datosPdf[0]["apellido_medico"]),'B',0,"C");


        $pdf->SetFont("Arial","",10);
        $pdf->Cell(127,10,"",0,0,"L");
        $pdf->Cell(12,10,"Araure",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(10,6,"",'B',0,"C");$pdf->Cell(1,10,"",0,0,"L");
        $pdf->Cell(5,10,"de",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(17,6,"",'B',0,"C");
        $pdf->Cell(1,10,"",0,0,"L");
        $pdf->Cell(5,10,"de",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(17,6,"",'B',0,"C");

        $pdf->ln(15);

        $pdf->Cell(20,10,'Nro',1,0,'C');
        $pdf->Cell(40,10,'Nombre especialidad',1,0,'C');

        $contador=0;
        while($contador<count($this->datosPdf)){
            $pdf->ln(10);

            $pdf->Cell(20,10,$contador+1,1,0,'C');
            $pdf->Cell(40,10,utf8_decode($this->datosPdf[$contador]["nombre_especialidad"]),1,0,'C');
            $contador++;
        }


        $pdf->ln(20);
        $pdf->Cell(17,10,"",0,0,"C");
        $pdf->Cell(45,10,"Generado por:",0,0,"R");$pdf->Cell(40,6,"",'B',0,"C");

        $pdf->Cell(20,10,"",0,0,"C");
        $pdf->Cell(45,10,"Solicitado por:",0,0,"R");$pdf->Cell(40,6,"",'B',0,"C");




        $pdf->Output("F","../upload/reporte/".$nombrePdf);
        return $nombrePdf;
    }

}

?>