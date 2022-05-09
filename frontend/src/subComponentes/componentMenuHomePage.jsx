import React from 'react';
//css
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
// imagenes
import Cintillo from '../galeria/imagenes/encabezadoPrincipal.jpeg'
//JS
import $ from 'jquery';
import popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle';
//SubComponentes
import LinkButton from '../subComponentes/link_button';
import CintilloComponent from "./cintilloComponent"

/*
        Logo
        <a class="navbar-brand" href="#">
        <img src="http://www.tutorialesprogramacionya.com/imagenes/foto1.jpg" width="30" height="30" alt=""/>
        </a>
        ---------------------------------------------------------------
        <a className="nav-link" href="/">Nosotros</a>
*/

const ComponentMenuHomePage = () => {
    return(
        <div className="contenedor_encabezado">
            <CintilloComponent/>
            <nav className="navbar navbar-expand-sm navbar-dark bg-dark contenedor_menu">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#opciones">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="opciones">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <LinkButton clases="nav-link" ruta="/" texto="Inicio"/>
                        </li>
                        <li className="nav-item">
                            <LinkButton clases="nav-link" ruta="/nosotros" texto="Nosotros"/>
                        </li>
                        <li className="nav-item">
                            <LinkButton clases="nav-link" ruta="/asistencia" texto="Asistencia"/>
                        </li>
                        <li className="nav-item">
                            <LinkButton clases="nav-link" ruta="/login" texto="Iniciar Sesión"/>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default ComponentMenuHomePage;
