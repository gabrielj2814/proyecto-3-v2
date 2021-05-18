<?php
include_once("../librerias_php/fpdf/fpdf.php");

class PdfTrabajador extends FPDF{

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
        
        $nombrePdf="ficha del trabajador [".$this->datosPdf[0]["nombres"]." ".$this->datosPdf[0]["apellidos"]."] .pdf";
        $this->AliasNbPages();
        $this->Addpage();

        $this->ln(15);

        //TITULO
        $this->SetFont("Arial","B",10);
        $this->Cell(0,10,"FICHA DEL TRABAJADOR",0,0,"C");

        $this->ln(10);
        $this->SetX(50);
        $this->SetFont("Arial","",10);
        $this->Cell(127,10,"",0,0,"L");
        $this->Cell(12,10,"Araure",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(10,6,date("d"),'B',0,"C");$this->Cell(1,10,"",0,0,"L");
        $this->Cell(5,10,"de",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(17,6,date("m"),'B',0,"C");
        $this->Cell(1,10,"",0,0,"L");
        $this->Cell(5,10,"de",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(17,6,date("Y"),'B',0,"C");

        $this->ln(15);

        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(20,10,"Cedula:",0,0,"L");$this->Cell(14,10,utf8_decode($this->datosPdf[0]["id_cedula"]),0,0,"C");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(20,10,"Nombres:",0,0,"L");$this->Cell(18,10,utf8_decode($this->datosPdf[0]["nombres"]),0,0,"C");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(20,10,"Apellidos:",0,0,"L");$this->Cell(19,10,utf8_decode($this->datosPdf[0]["apellidos"]),0,0,"C");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(20,10,"Telefono movil:",0,0,"L");$this->Cell(36,10,utf8_decode($this->datosPdf[0]["telefono_movil"]),0,0,"C");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(20,10,"Telefono local:",0,0,"L");$this->Cell(36,10,utf8_decode($this->datosPdf[0]["telefono_local"]),0,0,"C");

        $this->ln(8);
        $fecha= date("d-m-Y",strtotime($this->datosPdf[0]["fecha_nacimiento"]));
        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(20,10,"Fecha de nacimiento:",0,0,"L");$this->Cell(49,10,"24/11/1998",0,0,"C");

        $this->ln(8);

        $nacimiento = new DateTime($this->datosPdf[0]["fecha_nacimiento"]);
        $ahora = new DateTime(date("Y-m-d"));
        $diferencia = $ahora->diff($nacimiento);

        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(20,10,"Edad:",0,0,"L");$this->Cell(-12,10,$diferencia->format("%y"),0,0,"C");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(20,10,"Grado de instruccion:",0,0,"L");$this->Cell(77,10,utf8_decode($this->datosPdf[0]["grado_instruccion"]),0,0,"C");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(20,10,"Titulo:",0,0,"L");$this->Cell(54,10,utf8_decode($this->datosPdf[0]["titulo_grado_instruccion"]),0,0,"C");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(20,10,"Direccion:",0,0,"L");$this->Cell(59,10,utf8_decode($this->datosPdf[0]["direccion"]),0,0,"C");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(20,10,"Tipo trabajador:",0,0,"L");$this->Cell(28,10,utf8_decode($this->datosPdf[0]["descripcion_tipo_trabajador"]),0,0,"C");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(20,10,"Funcion trabajador:",0,0,"L");$this->Cell(52,10,utf8_decode($this->datosPdf[0]["funcion_descripcion"]),0,0,"C");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(20,10,"Sexo:",0,0,"L");$this->Cell(1,10,(($this->datosPdf[0]["sexo_trabajador"]==="1")?"Masculino":"Femenino"),0,0,"C");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(20,10,"Designacion:",0,0,"L");$this->Cell(18,10,(($this->datosPdf[0]["designacion"]==="1")?"Interno":"Externo"),0,0,"C");

        $this->ln(8);

        $this->SetFont("Arial","",10);
        $this->Cell(12,10,"",0,0,"C");
        $this->Cell(20,10,"Estatus:",0,0,"L");$this->Cell(3,10,(($this->datosPdf[0]["estatu_trabajador"]==="1")?"Activo":"Inactivo"),0,0,"C");




        $this->ln(22);

        $this->Cell(17,10,"",0,0,"C");
        $this->Cell(45,10,"Generado por:",0,0,"R");$this->Cell(40,6,utf8_decode($this->generado),'B',0,"C");

        $this->Cell(20,10,"",0,0,"C");
        $this->Cell(45,10,"Solicitado por:",0,0,"R");$this->Cell(40,6,"",'B',0,"C");
        
        
        
        
        
        $this->Output("F","../upload/reporte/".$nombrePdf);
        return $nombrePdf;


    }


    function generarPdf2(){
        $nombrePdf="listado de trabajadores.pdf";
        $this->AliasNbPages();
        $this->Addpage();

        $this->ln(20);

        //TITULO
        $this->SetFont("Arial","B",10);
        $this->Cell(0,10,"LISTADO DE TRABAJADORES",0,0,"C");

        $this->ln(10);
        $this->SetX(60);
        $this->SetFont("Arial","",10);
        $this->Cell(127,10,"",0,0,"L");
        $this->Cell(12,10,"Araure",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(10,6,date("d"),'B',0,"C");$this->Cell(1,10,"",0,0,"L");
        $this->Cell(5,10,"de",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(17,6,date("m"),'B',0,"C");
        $this->Cell(1,10,"",0,0,"L");
        $this->Cell(5,10,"de",0,0,"C");$this->Cell(1,10,"",0,0,"L");$this->Cell(17,6,date("Y"),'B',0,"C");

        $this->ln(15);

        $this->Cell(37,10,'Cedula',1,0,'C');
        $this->Cell(37,10,'Nombre completo',1,0,'C');
        $this->Cell(37,10,'Apellido completo',1,0,'C');
        $this->Cell(37,10,'Correo',1,0,'C');
        $this->Cell(37,10,'Tipo trabajador',1,0,'C');
        $this->Cell(37,10,'Funcion trabajador',1,0,'C');
        $this->Cell(37,10,'Estado',1,0,'C');

        $contador=0;
        while($contador<count($this->datosPdf)){
            $this->ln(10);
            $this->Cell(37,10,utf8_decode($this->datosPdf[$contador]["id_cedula"]),1,0,'C');
            $this->Cell(37,10,utf8_decode($this->datosPdf[$contador]["nombres"]),1,0,'C');
            $this->Cell(37,10,utf8_decode($this->datosPdf[$contador]["apellidos"]),1,0,'C');
            $this->Cell(37,10,utf8_decode($this->datosPdf[$contador]["correo"]),1,0,'C');
            $this->Cell(37,10,utf8_decode($this->datosPdf[$contador]["descripcion_tipo_trabajador"]),1,0,'C');
            $this->Cell(37,10,utf8_decode($this->datosPdf[$contador]["funcion_descripcion"]),1,0,'C');
            $this->Cell(37,10,(($this->datosPdf[0]["estatu_trabajador"]==="1")?"Activo":"Inactivo"),1,0,'C');
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