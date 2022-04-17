<?php

class DriverPostgreSql {
    
    private $host,$usuario,$clave,$db,$conexion;
    
    function __construct(){
        $this->host="localhost";
        $this->usuario="gabriel";
        $this->clave="stark";
        $this->db="proyecto_4_test";
    }

    protected function conectar(){
        $this->conexion=pg_connect("host=". $this->host." dbname=".$this->db." user=".$this->usuario." password=".$this->clave)or die('Could not connect: ' . pg_last_error());
    }

    function query($SQL){
        $this->conectar();
        return pg_query($this->conexion,$SQL);
    }

    function resultDatos($result){
        return pg_fetch_array($result);
    }

}

?>