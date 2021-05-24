import React from 'react';
//css
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
import '../css/componentCarusel.css'
//imagenes
//import GameOfThrones from '../galeria/imagenes/carusel/191-116-103-52-b899bc2c.jpg';
//import BlackHoru from '../galeria/imagenes/carusel/agujero-negro-interestelar.png';
//import Prisma from '../galeria/imagenes/carusel/9CE.jpg';
//import ComunidadUno from '../galeria/imagenes/carusel/img1.jpg'
import ComunidadDos from '../galeria/imagenes/carusel/img2.jpg'
import ComunidadTres from '../galeria/imagenes/carusel/img3.jpg'
import ComunidadCuatro from '../galeria/imagenes/carusel/img4.jpg'
//JS
import $ from'jquery';
import popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle';


const ComponentCarusel= () => {

    return (
        <div className="row justify-content-center row-conenedor-carusel">
            <div className="col-10 col-sm-10 col-md-10 col-lg-10 columna_carusel">
                <div id="carousel1" className="carousel slide contenedor_imagen" data-ride="carousel">
                    <ol className="carousel-indicators">
                        <li data-target="#carousel1" data-slide-to="0" className="active"></li>
                        <li data-target="#carousel1" data-slide-to="1"></li>
                        <li data-target="#carousel1" data-slide-to="2"></li>
                    </ol>
                    <div className="carousel-inner contenedor_imagen">
                        <div className="carousel-item active contenedor_imagen">
                            <img className="d-block w-100 img" src={ComunidadCuatro} alt="img"/>
                            <div className="carousel-caption">
                            <h3>Bienvenidos</h3>
                            </div>
                        </div>
                        <div className="carousel-item contenedor_imagen">
                            <img className="d-block w-100 img" src={ComunidadDos} alt="img"/>
                            <div className="carousel-caption">
                            </div>
                        </div>
                        <div className="carousel-item contenedor_imagen">
                            <img className="d-block w-100 img" src={ComunidadTres} alt="img"/>
                            <div className="carousel-caption">
                            </div>
                        </div>
                    </div>   
                    <a className="carousel-control-prev" href="#carousel1" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="carousel-control-next" href="#carousel1" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </div>
            </div>
        </div>
    )

}

export default ComponentCarusel;