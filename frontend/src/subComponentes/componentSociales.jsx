import React from 'react';
//css
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
import '../css/componentSociales.css'
// imagenes
import Twitter from '../galeria/imagenes/twitter.png'
import Whatsapp3 from '../galeria/imagenes/whatsapp3.png'
import Facebook from '../galeria/imagenes/facebook.png'
import Instagram5 from '../galeria/imagenes/instagram5.png'
import Gmail from '../galeria/imagenes/gmail.png'
//JS
import $ from'jquery';
import popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle';
//SubComponentes
import LinkButton from '../subComponentes/link_button';

const ComponentSociales= () => {

    return(
        <div className="contenedor_tarjetas">
            <h2 className="sub_titulo">Medios Sociales</h2>
            <nav className="fila_targetas">
                <div className="tarjetas margen_bottom_15px">
                    <img className="logo_social" src={Twitter} alt="imagen_logo_twitter"/>

                    <button className="boton boton_grande boton_color_azulito boton_center boton_block">
                        <svg width="1em" height="1em" viewBox="0 5 15 15" className="bi bi-link" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                            <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"/>
                        </svg>
                    </button>
                </div>
                <div className="tarjetas">
                    <img className="logo_social" src={Whatsapp3} alt="imagen_logo_twitter"/>

                    <button className="boton boton_grande boton_color_azulito boton_center boton_block">
                        <svg width="1em" height="1em" viewBox="0 5 15 15" className="bi bi-link" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                            <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"/>
                        </svg>
                    </button>
                </div>
                <div className="tarjetas">
                    <img className="logo_social" src={Facebook} alt="imagen_logo_twitter"/>

                    <button className="boton boton_grande boton_color_azulito boton_center boton_block">
                        <svg width="1em" height="1em" viewBox="0 5 15 15" className="bi bi-link" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                            <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"/>
                        </svg>
                    </button>
                </div>
                <div className="tarjetas">
                    <img className="logo_social" src={Instagram5} alt="imagen_logo_twitter"/>

                    <button className="boton boton_grande boton_color_azulito boton_center boton_block">
                        <svg width="1em" height="1em" viewBox="0 5 15 15" className="bi bi-link" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                            <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"/>
                        </svg>
                    </button>
                </div>
                <div className="tarjetas">
                    <img className="logo_social" src={Gmail} alt="imagen_logo_twitter"/>

                    <button className="boton boton_grande boton_color_azulito boton_center boton_block">
                        <svg width="1em" height="1em" viewBox="0 5 15 15" className="bi bi-link" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                            <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"/>
                        </svg>
                    </button>
                </div>
            </nav>
        </div>

    )
}

export default ComponentSociales;