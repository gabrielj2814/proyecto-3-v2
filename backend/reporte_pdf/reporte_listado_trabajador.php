<?php


class PdfTrabajador{

    private $datosPdf;
    function __construct($datos)
    {
        $this->datosPdf=$datos;
    }

    function generarPdf(){
        include_once("../librerias_php/fpdf/fpdf.php");
        $nombrePdf="ficha del trabajador [".$this->datosPdf[0]["nombres"]." ".$this->datosPdf[0]["apellidos"]."] .pdf";
        $pdf = new FPDF("L","mm","letter");
        $pdf->Addpage();
        $pdf->Image("http://localhost:80/proyecto/backend/reporte_pdf/imagenes_pdf/encabezado1.jpg",40,5,200,10);

        $pdf->ln(12);

        //TITULO
        $pdf->SetFont("Arial","B",10);
        $pdf->Cell(0,10,"FICHA DEL TRABAJADOR",0,0,"C");

        $pdf->ln(10);

        $pdf->SetFont("Arial","",10);
        $pdf->Cell(185,10,"",0,0,"L");
        $pdf->Cell(12,10,"Araure",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(10,6,"",'B',0,"C");$pdf->Cell(1,10,"",0,0,"L");
        $pdf->Cell(5,10,"de",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(17,6,"",'B',0,"C");
        $pdf->Cell(1,10,"",0,0,"L");
        $pdf->Cell(5,10,"de",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(17,6,"",'B',0,"C");

        $pdf->ln(15);

        $pdf->SetFont("Arial","",10);
        $pdf->Cell(12,10,"",0,0,"C");
        $pdf->Cell(20,10,"Cedula:",0,0,"L");$pdf->Cell(14,10,utf8_decode($this->datosPdf[0]["id_cedula"]),0,0,"C");

        $pdf->ln(10);

        $pdf->SetFont("Arial","",10);
        $pdf->Cell(12,10,"",0,0,"C");
        $pdf->Cell(20,10,"Nombres:",0,0,"L");$pdf->Cell(18,10,utf8_decode($this->datosPdf[0]["nombres"]),0,0,"C");

        $pdf->ln(10);

        $pdf->SetFont("Arial","",10);
        $pdf->Cell(12,10,"",0,0,"C");
        $pdf->Cell(20,10,"Apellidos:",0,0,"L");$pdf->Cell(19,10,utf8_decode($this->datosPdf[0]["apellidos"]),0,0,"C");

        $pdf->ln(10);

        $pdf->SetFont("Arial","",10);
        $pdf->Cell(12,10,"",0,0,"C");
        $pdf->Cell(20,10,"Telefono movil:",0,0,"L");$pdf->Cell(36,10,utf8_decode($this->datosPdf[0]["telefono_movil"]),0,0,"C");

        $pdf->ln(10);

        $pdf->SetFont("Arial","",10);
        $pdf->Cell(12,10,"",0,0,"C");
        $pdf->Cell(20,10,"Telefono local:",0,0,"L");$pdf->Cell(36,10,utf8_decode($this->datosPdf[0]["telefono_local"]),0,0,"C");

        $pdf->ln(10);
        $fecha= date("d-m-Y",strtotime($this->datosPdf[0]["fecha_nacimiento"]));
        $pdf->SetFont("Arial","",10);
        $pdf->Cell(12,10,"",0,0,"C");
        $pdf->Cell(20,10,"Fecha de nacimiento:",0,0,"L");$pdf->Cell(49,10,"24/11/1998",0,0,"C");

        $pdf->ln(10);

        $nacimiento = new DateTime($this->datosPdf[0]["fecha_nacimiento"]);
        $ahora = new DateTime(date("Y-m-d"));
        $diferencia = $ahora->diff($nacimiento);

        $pdf->SetFont("Arial","",10);
        $pdf->Cell(12,10,"",0,0,"C");
        $pdf->Cell(20,10,"Edad:",0,0,"L");$pdf->Cell(-12,10,$diferencia->format("%y"),0,0,"C");

        $pdf->ln(10);

        $pdf->SetFont("Arial","",10);
        $pdf->Cell(12,10,"",0,0,"C");
        $pdf->Cell(20,10,"Grado de instruccion:",0,0,"L");$pdf->Cell(77,10,utf8_decode($this->datosPdf[0]["grado_instruccion"]),0,0,"C");

        $pdf->ln(10);

        $pdf->SetFont("Arial","",10);
        $pdf->Cell(12,10,"",0,0,"C");
        $pdf->Cell(20,10,"Titulo:",0,0,"L");$pdf->Cell(54,10,utf8_decode($this->datosPdf[0]["titulo_grado_instruccion"]),0,0,"C");

        $pdf->ln(10);

        $pdf->SetFont("Arial","",10);
        $pdf->Cell(12,10,"",0,0,"C");
        $pdf->Cell(20,10,"Direccion:",0,0,"L");$pdf->Cell(59,10,utf8_decode($this->datosPdf[0]["direccion"]),0,0,"C");

        $pdf->ln(10);

        $pdf->SetFont("Arial","",10);
        $pdf->Cell(12,10,"",0,0,"C");
        $pdf->Cell(20,10,"Tipo trabajador:",0,0,"L");$pdf->Cell(28,10,utf8_decode($this->datosPdf[0]["descripcion_tipo_trabajador"]),0,0,"C");

        $pdf->ln(10);

        $pdf->SetFont("Arial","",10);
        $pdf->Cell(12,10,"",0,0,"C");
        $pdf->Cell(20,10,"Funcion trabajador:",0,0,"L");$pdf->Cell(52,10,utf8_decode($this->datosPdf[0]["funcion_descripcion"]),0,0,"C");

        $pdf->ln(10);

        $pdf->SetFont("Arial","",10);
        $pdf->Cell(12,10,"",0,0,"C");
        $pdf->Cell(20,10,"Sexo:",0,0,"L");$pdf->Cell(1,10,(($this->datosPdf[0]["sexo_trabajador"]==="1")?"Masculino":"Femenino"),0,0,"C");

        $pdf->ln(10);

        $pdf->SetFont("Arial","",10);
        $pdf->Cell(12,10,"",0,0,"C");
        $pdf->Cell(20,10,"Designacion:",0,0,"L");$pdf->Cell(18,10,(($this->datosPdf[0]["designacion"]==="1")?"Interno":"Externo"),0,0,"C");

        $pdf->ln(10);

        $pdf->SetFont("Arial","",10);
        $pdf->Cell(12,10,"",0,0,"C");
        $pdf->Cell(20,10,"Estatus:",0,0,"L");$pdf->Cell(3,10,(($this->datosPdf[0]["estatu_trabajador"]==="1")?"Activo":"Inactivo"),0,0,"C");




        $pdf->ln(22);

        $pdf->Cell(17,10,"",0,0,"C");
        $pdf->Cell(45,10,"Generado por:",0,0,"R");$pdf->Cell(40,6,"",'B',0,"C");

        $pdf->Cell(20,10,"",0,0,"C");
        $pdf->Cell(45,10,"Solicitado por:",0,0,"R");$pdf->Cell(40,6,"",'B',0,"C");
        
        
        
        
        
        $pdf->Output("F","../upload/reporte/".$nombrePdf);
        return $nombrePdf;


    }


    function generarPdf2(){
        include_once("../librerias_php/fpdf/fpdf.php");
        $nombrePdf="listado de trabajadores.pdf";
        $pdf = new FPDF("L","mm","letter");
        $pdf->Addpage();
        $pdf->Image("http://localhost:80/proyecto/backend/reporte_pdf/imagenes_pdf/encabezado1.jpg",40,5,200,10);

        $pdf->ln(12);

        //TITULO
        $pdf->SetFont("Arial","B",10);
        $pdf->Cell(0,10,"LISTADO DE TRABAJADORES",0,0,"C");

        $pdf->ln(10);

        $pdf->SetFont("Arial","",10);
        $pdf->Cell(187,10,"",0,0,"L");
        $pdf->Cell(12,10,"Araure",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(10,6,"",'B',0,"C");$pdf->Cell(1,10,"",0,0,"L");
        $pdf->Cell(5,10,"de",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(17,6,"",'B',0,"C");
        $pdf->Cell(1,10,"",0,0,"L");
        $pdf->Cell(5,10,"de",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(17,6,"",'B',0,"C");

        $pdf->ln(15);

        $pdf->Cell(37,10,'Cedula',1,0,'C');
        $pdf->Cell(37,10,'Nombre completo',1,0,'C');
        $pdf->Cell(37,10,'Apellido completo',1,0,'C');
        $pdf->Cell(37,10,'Correo',1,0,'C');
        $pdf->Cell(37,10,'Tipo trabajador',1,0,'C');
        $pdf->Cell(37,10,'Funcion trabajador',1,0,'C');
        $pdf->Cell(37,10,'Estado',1,0,'C');

        $contador=0;
        while($contador<count($this->datosPdf)){
            $pdf->ln(10);
            $pdf->Cell(37,10,utf8_decode($this->datosPdf[$contador]["id_cedula"]),1,0,'C');
            $pdf->Cell(37,10,utf8_decode($this->datosPdf[$contador]["nombres"]),1,0,'C');
            $pdf->Cell(37,10,utf8_decode($this->datosPdf[$contador]["apellidos"]),1,0,'C');
            $pdf->Cell(37,10,utf8_decode($this->datosPdf[$contador]["correo"]),1,0,'C');
            $pdf->Cell(37,10,utf8_decode($this->datosPdf[$contador]["descripcion_tipo_trabajador"]),1,0,'C');
            $pdf->Cell(37,10,utf8_decode($this->datosPdf[$contador]["funcion_descripcion"]),1,0,'C');
            $pdf->Cell(37,10,(($this->datosPdf[0]["estatu_trabajador"]==="1")?"Activo":"Inactivo"),1,0,'C');
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