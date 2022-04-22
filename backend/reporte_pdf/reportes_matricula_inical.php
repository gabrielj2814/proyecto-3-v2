<?php


include_once("../librerias_php/fpdf/fpdf.php");
$pdf = new FPDF("L","mm","letter");
$pdf->Addpage();
$pdf->Image("imagenes/encabezado1.jpg",24,10,190,12);$pdf->Image("imagenes/carabobo.jpg",213,2,50,30);

$pdf->ln(22);

//TITULO
$pdf->SetFont("Arial","B",10);
$pdf->Cell(0,10,"MATRICULA INICIAL 6TO GRADO SECCION A",0,0,"C");

$pdf->ln(12);
//fECHA
$pdf->SetFont("Arial","",10);
$pdf->Cell(187,10,"",0,0,"L");
$pdf->Cell(12,10,"Araure",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(10,6,"",'B',0,"C");$pdf->Cell(1,10,"",0,0,"L");
$pdf->Cell(5,10,"de",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(17,6,"",'B',0,"C");
$pdf->Cell(1,10,"",0,0,"L");
$pdf->Cell(5,10,"de",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(17,6,"",'B',0,"C");

$pdf->ln(15);

//TABLA
$pdf->Cell(15,10,'',0,0,'C');
$pdf->Cell(10,10,'Nro',1,0,'C');
$pdf->Cell(40,10,'Nombre y Apellido',1,0,'C');
$pdf->Cell(30,10,'Cedula',1,0,'C');

$pdf->ln(10);

$pdf->Cell(15,10,'',0,0,'C');
$pdf->Cell(10,10,'1',1,0,'C');
$pdf->Cell(40,10,'pepito paredes',1,0,'C');
$pdf->Cell(30,10,'V-267591371',1,0,'C');

$pdf->ln(10);

$pdf->Cell(15,10,'',0,0,'C');
$pdf->Cell(10,10,'2',1,0,'C');
$pdf->Cell(40,10,'panchita paredes',1,0,'C');
$pdf->Cell(30,10,'V-267591372',1,0,'C');

$pdf->ln(10);

$pdf->Cell(15,10,'',0,0,'C');
$pdf->Cell(10,10,'3',1,0,'C');
$pdf->Cell(40,10,'',1,0,'C');
$pdf->Cell(30,10,'',1,0,'C');


$pdf->ln(20);
$pdf->Cell(17,10,"",0,0,"C");
$pdf->Cell(45,10,"Generado por:",0,0,"R");$pdf->Cell(40,6,"",'B',0,"C");

$pdf->Cell(20,10,"",0,0,"C");
$pdf->Cell(45,10,"Solicitado por:",0,0,"R");$pdf->Cell(40,6,"",'B',0,"C");

$pdf->Output();

?>