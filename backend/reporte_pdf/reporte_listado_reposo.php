<?php
include_once("../librerias_php/fpdf/fpdf.php");

class PdfListadoReposo extends FPDF{

    private $datosPdf;
    private $generado;
    private $datosCintillo;
    private $nombreCintillo;
    function __construct($datos,$generado,$datosCintillo){
        parent::__construct("L","mm","letter");
        $this->datosPdf=$datos;
        $this->generado=$generado;
        $this->datosCintillo=$datosCintillo;
        $this->nombreCintillo="cintillo-".$this->datosCintillo["fecha_subida_foto"]."_".$this->datosCintillo["hora_subida_foto"].".".$this->datosCintillo["extension_foto_cintillo"];
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
        
        $nombrePdf="listado de reposo de [".$this->datosPdf[0]["nombres"]." ".$this->datosPdf[0]["apellidos"]."] .pdf";
        $this->AliasNbPages();
        $this->Addpage();

        $this->SetFont("Arial","B",10);
        $this->ln(35);

        $this->Cell(0,10,"REPOSO DEL TRABAJADOR",0,0,"C");
        
        $this->ln(12);
        
        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(20,10,"Nombre trabajador:",0,0,"R");$this->Cell(30,6,($this->datosPdf[0]["nombres"]." ".$this->datosPdf[0]["apellidos"]),'B',0,"C");
        $this->SetFont("Arial","",10);
        $this->Cell(127,10,"",0,0,"L");
        $this->Cell(12,10,"Araure",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(10,6,date("d"),'B',0,"C");$this->Cell(1,10,"",0,0,"L");
        $this->Cell(5,10,"de",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(17,6,date("m"),'B',0,"C");
        $this->Cell(1,10,"",0,0,"L");
        $this->Cell(5,10,"de",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(17,6,date("Y"),'B',0,"C");

        // $this->ln(15);
        // $this->Cell(21,10,"Cedula",1,0,"C");
        // $this->Cell(40,10,"Nombres",1,0,"C");
        // $this->Cell(40,10,"Apellidos",1,0,"C");
        // $this->Cell(31,10,"Nombre reposo",1,0,"C");
        // $this->Cell(20,10,"Desde",1,0,"C");
        // $this->Cell(20,10,"Hasta",1,0,"C");
        // $this->Cell(22,10,"Estado de entrega",1,0,"C");
        // $this->Cell(22,10,"Estatus",1,0,"C");

        // $this->ln(10);
        // $this->Cell(21,10,"27419898",1,0,"C");
        // $this->Cell(40,10,"jorge yermain",1,0,"C");
        // $this->Cell(40,10,"barboza londoño",1,0,"C");
        // $this->Cell(31,10,"por cuido",1,0,"C");
        // $this->Cell(20,10,"21/11/2021",1,0,"C");
        // $this->Cell(20,10,"28/11/2021",1,0,"C");
        // $this->Cell(22,10,"Entrega",1,0,"C");
        // $this->Cell(22,10,"inactivo",1,0,"C");
        $this->ln(15);
        $this->SetX(39);
        $this->Cell(21,10,"Cedula",1,0,"C");
        $this->Cell(31,10,"Nombre reposo",1,0,"C");
        $this->Cell(20,10,"Desde",1,0,"C");
        $this->Cell(20,10,"Hasta",1,0,"C");
        $this->Cell(40,10,"Fecha limite entrega",1,0,"C");
        $this->Cell(40,10,"Estado de entrega",1,0,"C");
        $this->Cell(22,10,"Estatus",1,0,"C");
        $contador=0;
        while($contador<count($this->datosPdf)){
            $this->ln(10);
            $this->SetX(39);
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
            $estadoReposo=null;
            if($this->datosPdf[$contador]["estatu_reposo_trabajador"]==="1"){
                $estadoReposo="Activo";
            }
            if($this->datosPdf[$contador]["estatu_reposo_trabajador"]==="0"){
                $estadoReposo="Inactivo";
            }
            if($this->datosPdf[$contador]["estatu_reposo_trabajador"]==="2"){
                $estadoReposo="Interumpido";
            }

            $this->Cell(21,10,$this->datosPdf[$contador]["id_cedula"],1,0,"C");
            $this->Cell(31,10,utf8_decode($this->datosPdf[$contador]["nombre_reposo"]),1,0,"C");
            $this->Cell(20,10,$fechaDesde,1,0,"C");
            $this->Cell(20,10,$fechaHasta,1,0,"C");
            $this->Cell(40,10,$fechEntrega,1,0,"C");
            $this->Cell(40,10,"$estadoEntrega",1,0,"C");
            $this->Cell(22,10,$estadoReposo,1,0,"C");
            $contador++;
        }
        
        
        $this->ln(20);
        $this->Cell(17,10,"",0,0,"C");
        $this->Cell(45,10,"Generado por:",0,0,"R");$this->Cell(40,6,utf8_decode($this->generado),'B',0,"C");
        
        $this->Cell(20,10,"",0,0,"C");
        $this->Cell(45,10,"Solicitado por:",0,0,"R");$this->Cell(40,6,"",'B',0,"C");
        
        
        
        
        
        $this->Output("F","../upload/reporte/".$nombrePdf);
        return $nombrePdf;


    }


    function generarPdf2(){
        $nombrePdf="listado de reposo general.pdf";
        $this->AliasNbPages();
        $this->Addpage();

        $this->SetFont("Arial","B",10);
        $this->ln(35);

        $this->Cell(0,10,"REPOSOS DE LOS TRABAJADORES",0,0,"C");

        $this->ln(12);

        
       
        $this->SetX(75);
        $this->SetFont("Arial","",10);
        $this->Cell(127,10,"",0,0,"L");
        $this->Cell(12,10,"Araure",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(10,6,date("d"),'B',0,"C");$this->Cell(1,10,"",0,0,"L");
        $this->Cell(5,10,"de",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(17,6,date("m"),'B',0,"C");
        $this->Cell(1,10,"",0,0,"L");
        $this->Cell(5,10,"de",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(17,6,date("Y"),'B',0,"C");

        // $this->ln(15);
        // $this->Cell(21,10,"Cedula",1,0,"C");
        // $this->Cell(40,10,"Nombres",1,0,"C");
        // $this->Cell(40,10,"Apellidos",1,0,"C");
        // $this->Cell(31,10,"Nombre reposo",1,0,"C");
        // $this->Cell(20,10,"Desde",1,0,"C");
        // $this->Cell(20,10,"Hasta",1,0,"C");
        // $this->Cell(22,10,"Estado de entrega",1,0,"C");
        // $this->Cell(22,10,"Estatus",1,0,"C");

        // $this->ln(10);
        // $this->Cell(21,10,"27419898",1,0,"C");
        // $this->Cell(40,10,"jorge yermain",1,0,"C");
        // $this->Cell(40,10,"barboza londoño",1,0,"C");
        // $this->Cell(31,10,"por cuido",1,0,"C");
        // $this->Cell(20,10,"21/11/2021",1,0,"C");
        // $this->Cell(20,10,"28/11/2021",1,0,"C");
        // $this->Cell(22,10,"Entrega",1,0,"C");
        // $this->Cell(22,10,"inactivo",1,0,"C");
        $this->ln(15);
        $this->Cell(21,10,"Cedula",1,0,"C");
        $this->Cell(35,10,"Nombres",1,0,"C");
        $this->Cell(35,10,"Apellidos",1,0,"C");
        $this->Cell(31,10,"Nombre reposo",1,0,"C");
        $this->Cell(20,10,"Desde",1,0,"C");
        $this->Cell(20,10,"Hasta",1,0,"C");
        $this->Cell(40,10,"Fecha limite entrega",1,0,"C");
        $this->Cell(40,10,"Estado de entrega",1,0,"C");
        $this->Cell(22,10,"Estatus",1,0,"C");
        $contador=0;
        while($contador<count($this->datosPdf)){
            $this->ln(10);
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
            $estadoReposo=null;
            if($this->datosPdf[$contador]["estatu_reposo_trabajador"]==="1"){
                $estadoReposo="Activo";
            }
            if($this->datosPdf[$contador]["estatu_reposo_trabajador"]==="0"){
                $estadoReposo="Inactivo";
            }
            if($this->datosPdf[$contador]["estatu_reposo_trabajador"]==="2"){
                $estadoReposo="Interumpido";
            }
            $this->Cell(21,10,$this->datosPdf[$contador]["id_cedula"],1,0,"C");
            $this->Cell(35,10,utf8_decode($this->datosPdf[$contador]["nombres"]),1,0,"C");
            $this->Cell(35,10,utf8_decode($this->datosPdf[$contador]["apellidos"]),1,0,"C");
            $this->Cell(31,10,utf8_decode($this->datosPdf[$contador]["nombre_reposo"]),1,0,"C");
            $this->Cell(20,10,$fechaDesde,1,0,"C");
            $this->Cell(20,10,$fechaHasta,1,0,"C");
            $this->Cell(40,10,$fechEntrega,1,0,"C");
            $this->Cell(40,10,"$estadoEntrega",1,0,"C");
            $this->Cell(22,10,$estadoReposo,1,0,"C");
            $contador++;
        }
        
        
        $this->ln(20);
        $this->Cell(17,10,"",0,0,"C");
        $this->Cell(45,10,"Generado por:",0,0,"R");$this->Cell(40,6,utf8_decode($this->generado),'B',0,"C");
        
        $this->Cell(20,10,"",0,0,"C");
        $this->Cell(45,10,"Solicitado por:",0,0,"R");$this->Cell(40,6,"",'B',0,"C");
        
        
        
        
        
        $this->Output("F","../upload/reporte/".$nombrePdf);
        return $nombrePdf;


    }


}



?>