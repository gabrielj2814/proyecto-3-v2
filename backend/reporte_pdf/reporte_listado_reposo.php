<?php


class PdfListadoReposo{

    private $datosPdf;
    function __construct($datos)
    {
        $this->datosPdf=$datos;
    }

    function generarPdf(){
        include_once("../librerias_php/fpdf/fpdf.php");
        $nombrePdf="listado de reposo de [".$this->datosPdf[0]["nombres"]." ".$this->datosPdf[0]["apellidos"]."] .pdf";
        $pdf = new FPDF("L","mm","letter");
        $pdf->Addpage();
        $pdf->Image("http://localhost:80/proyecto/backend/reporte_pdf/imagenes_pdf/encabezado1.jpg",40,5,200,10);

        $pdf->SetFont("Arial","B",10);
        $pdf->ln(15);

        $pdf->Cell(0,10,"REPOSO DEL TRABAJADOR",0,0,"C");

        $pdf->ln(12);

        
        $pdf->SetFont("Arial","",10);
        $pdf->Cell(12,10,"",0,0,"C");
        $pdf->Cell(20,10,"Nombre trabajador:",0,0,"R");$pdf->Cell(30,6,($this->datosPdf[0]["nombres"]." ".$this->datosPdf[0]["apellidos"]),'B',0,"C");
        $pdf->SetFont("Arial","",10);
        $pdf->Cell(124,10,"",0,0,"L");
        $pdf->Cell(12,10,"Araure",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(10,6,"",'B',0,"C");$pdf->Cell(1,10,"",0,0,"L");
        $pdf->Cell(5,10,"de",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(17,6,"",'B',0,"C");
        $pdf->Cell(1,10,"",0,0,"L");
        $pdf->Cell(5,10,"de",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(17,6,"",'B',0,"C");

        // $pdf->ln(15);
        // $pdf->Cell(21,10,"Cedula",1,0,"C");
        // $pdf->Cell(40,10,"Nombres",1,0,"C");
        // $pdf->Cell(40,10,"Apellidos",1,0,"C");
        // $pdf->Cell(31,10,"Nombre reposo",1,0,"C");
        // $pdf->Cell(20,10,"Desde",1,0,"C");
        // $pdf->Cell(20,10,"Hasta",1,0,"C");
        // $pdf->Cell(22,10,"Estado de entrega",1,0,"C");
        // $pdf->Cell(22,10,"Estatus",1,0,"C");

        // $pdf->ln(10);
        // $pdf->Cell(21,10,"27419898",1,0,"C");
        // $pdf->Cell(40,10,"jorge yermain",1,0,"C");
        // $pdf->Cell(40,10,"barboza londoño",1,0,"C");
        // $pdf->Cell(31,10,"por cuido",1,0,"C");
        // $pdf->Cell(20,10,"21/11/2021",1,0,"C");
        // $pdf->Cell(20,10,"28/11/2021",1,0,"C");
        // $pdf->Cell(22,10,"Entrega",1,0,"C");
        // $pdf->Cell(22,10,"inactivo",1,0,"C");
        $pdf->ln(15);
        $pdf->SetX(39);
        $pdf->Cell(21,10,"Cedula",1,0,"C");
        $pdf->Cell(31,10,"Nombre reposo",1,0,"C");
        $pdf->Cell(20,10,"Desde",1,0,"C");
        $pdf->Cell(20,10,"Hasta",1,0,"C");
        $pdf->Cell(40,10,"Fecha limite entrega",1,0,"C");
        $pdf->Cell(40,10,"Estado de entrega",1,0,"C");
        $pdf->Cell(22,10,"Estatus",1,0,"C");
        $contador=0;
        while($contador<count($this->datosPdf)){
            $pdf->ln(10);
            $pdf->SetX(39);
            $fechaDesde= date("d-m-Y",strtotime($this->datosPdf[$contador]["fecha_desde_reposo_trabajador"]));
            $fechaHasta= date("d-m-Y",strtotime($this->datosPdf[$contador]["fecha_hasta_reposo_trabajador"]));
            $fechEntrega= date("d-m-Y",strtotime($this->datosPdf[$contador]["fecha_hasta_entrega_reposo_trabajador"]));
            // nombre_reposo
            $estadoEntrega=null;
            if($this->datosPdf[$contador]["estatu_entrega_reposo"]==="E"){
                $estadoEntrega="Entregado";
            }
            if($this->datosPdf[$contador]["estatu_entrega_reposo"]==="P"){
                $estadoEntrega="En Espera";
            }
            if($this->datosPdf[$contador]["estatu_entrega_reposo"]==="N"){
                $estadoEntrega="No Entregado";
            }
            $pdf->Cell(21,10,$this->datosPdf[$contador]["id_cedula"],1,0,"C");
            $pdf->Cell(31,10,utf8_decode($this->datosPdf[$contador]["nombre_reposo"]),1,0,"C");
            $pdf->Cell(20,10,$fechaDesde,1,0,"C");
            $pdf->Cell(20,10,$fechaHasta,1,0,"C");
            $pdf->Cell(40,10,$fechEntrega,1,0,"C");
            $pdf->Cell(40,10,"$estadoEntrega",1,0,"C");
            $pdf->Cell(22,10,(($this->datosPdf[$contador]["estatu_entrega_reposo"]==="1")?"Activo":"Inactivo"),1,0,"C");
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


    function generarPdf2(){
        include_once("../librerias_php/fpdf/fpdf.php");
        $nombrePdf="listado de reposo general.pdf";
        $pdf = new FPDF("L","mm","letter");
        $pdf->Addpage();
        $pdf->Image("http://localhost:80/proyecto/backend/reporte_pdf/imagenes_pdf/encabezado1.jpg",40,5,200,10);

        $pdf->SetFont("Arial","B",10);
        $pdf->ln(15);

        $pdf->Cell(0,10,"REPOSOS DE LOS TRABAJADORES",0,0,"C");

        $pdf->ln(12);

        
       
        $pdf->SetFont("Arial","",10);
        $pdf->Cell(120,10,"",0,0,"L");
        $pdf->Cell(12,10,"Araure",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(10,6,"",'B',0,"C");$pdf->Cell(1,10,"",0,0,"L");
        $pdf->Cell(5,10,"de",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(17,6,"",'B',0,"C");
        $pdf->Cell(1,10,"",0,0,"L");
        $pdf->Cell(5,10,"de",0,0,"C");$pdf->Cell(1,10,"",0,0,"L");$pdf->Cell(17,6,"",'B',0,"C");

        // $pdf->ln(15);
        // $pdf->Cell(21,10,"Cedula",1,0,"C");
        // $pdf->Cell(40,10,"Nombres",1,0,"C");
        // $pdf->Cell(40,10,"Apellidos",1,0,"C");
        // $pdf->Cell(31,10,"Nombre reposo",1,0,"C");
        // $pdf->Cell(20,10,"Desde",1,0,"C");
        // $pdf->Cell(20,10,"Hasta",1,0,"C");
        // $pdf->Cell(22,10,"Estado de entrega",1,0,"C");
        // $pdf->Cell(22,10,"Estatus",1,0,"C");

        // $pdf->ln(10);
        // $pdf->Cell(21,10,"27419898",1,0,"C");
        // $pdf->Cell(40,10,"jorge yermain",1,0,"C");
        // $pdf->Cell(40,10,"barboza londoño",1,0,"C");
        // $pdf->Cell(31,10,"por cuido",1,0,"C");
        // $pdf->Cell(20,10,"21/11/2021",1,0,"C");
        // $pdf->Cell(20,10,"28/11/2021",1,0,"C");
        // $pdf->Cell(22,10,"Entrega",1,0,"C");
        // $pdf->Cell(22,10,"inactivo",1,0,"C");
        $pdf->ln(15);
        $pdf->Cell(21,10,"Cedula",1,0,"C");
        $pdf->Cell(35,10,"Nombres",1,0,"C");
        $pdf->Cell(35,10,"Apellidos",1,0,"C");
        $pdf->Cell(31,10,"Nombre reposo",1,0,"C");
        $pdf->Cell(20,10,"Desde",1,0,"C");
        $pdf->Cell(20,10,"Hasta",1,0,"C");
        $pdf->Cell(40,10,"Fecha limite entrega",1,0,"C");
        $pdf->Cell(40,10,"Estado de entrega",1,0,"C");
        $pdf->Cell(22,10,"Estatus",1,0,"C");
        $contador=0;
        while($contador<count($this->datosPdf)){
            $pdf->ln(10);
            $fechaDesde= date("d-m-Y",strtotime($this->datosPdf[$contador]["fecha_desde_reposo_trabajador"]));
            $fechaHasta= date("d-m-Y",strtotime($this->datosPdf[$contador]["fecha_hasta_reposo_trabajador"]));
            $fechEntrega= date("d-m-Y",strtotime($this->datosPdf[$contador]["fecha_hasta_entrega_reposo_trabajador"]));
            // nombre_reposo
            $estadoEntrega=null;
            if($this->datosPdf[$contador]["estatu_entrega_reposo"]==="E"){
                $estadoEntrega="Entregado";
            }
            if($this->datosPdf[$contador]["estatu_entrega_reposo"]==="P"){
                $estadoEntrega="En Espera";
            }
            if($this->datosPdf[$contador]["estatu_entrega_reposo"]==="N"){
                $estadoEntrega="No Entregado";
            }
            $pdf->Cell(21,10,$this->datosPdf[$contador]["id_cedula"],1,0,"C");
            $pdf->Cell(35,10,utf8_decode($this->datosPdf[$contador]["nombres"]),1,0,"C");
            $pdf->Cell(35,10,utf8_decode($this->datosPdf[$contador]["apellidos"]),1,0,"C");
            $pdf->Cell(31,10,utf8_decode($this->datosPdf[$contador]["nombre_reposo"]),1,0,"C");
            $pdf->Cell(20,10,$fechaDesde,1,0,"C");
            $pdf->Cell(20,10,$fechaHasta,1,0,"C");
            $pdf->Cell(40,10,$fechEntrega,1,0,"C");
            $pdf->Cell(40,10,"$estadoEntrega",1,0,"C");
            $pdf->Cell(22,10,(($this->datosPdf[$contador]["estatu_entrega_reposo"]==="1")?"Activo":"Inactivo"),1,0,"C");
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