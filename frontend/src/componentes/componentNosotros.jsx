import React from 'react';
// css
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
import '../css/componentNosotros.css'
//imagenes
import UbicacionComunidad from '../galeria/imagenes/ubicacion-comunidad.png';
import OrganigramaComunidad from '../galeria/imagenes/organigrama-comunidad.jpg';
//JS
import $ from 'jquery';
import popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap';
//sub componentes
import ComponentMenuHomePage from '../subComponentes/componentMenuHomePage';

class ComponentNosotros extends React.Component{

    render(){
        return(
            
            <div className="containter-fluid component_nosotros">
                <ComponentMenuHomePage/>
                <div className="row justify-content-center menu_informacion">
                    <div className="col-8 col-sm-8 col-md-8 col-lg-8 columna_nosotros ">
                        <div className="row fila_menu_pills fila_nosotros">
                            <div className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3 fila_menu_pills">
                                <ul className="nav flex-column nav-pills">
                                    <li className="nav-item">
                                        <a className="nav-link active"  data-toggle="tab" href="#mision" >Misión</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link"  data-toggle="tab" href="#vision">Visión</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link"  data-toggle="tab" href="#historia">Reseña Historica</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link"  data-toggle="tab" href="#organigrama">Organigrama</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link"  data-toggle="tab" href="#ubicacion">Ubicación</a>
                                    </li> 
                                </ul>
                            </div>
                            <div className="col-12 col-sm-9 col-md-9 col-lg-9 col-xl-9 columna">
                                <div className="tab-content text-justify contenedor_panel">
                                    <div className="tab-pane fade show active" id="mision">
                                        <p>
                                        La escuela Bolivariana “Villas del Pilar”, se propone para el año escolar 2014-2015, 
                                        promover acciones pedagógicas en un escenario permanente de integración y cohesión de 
                                        los actores autores del hecho pedagógico basado en el respeto, la tolerancia, la paz y
                                        la vida, bajo la orientación pedagógica del currículo de la educación bolivariana, y con 
                                        el ideario de Simón Bolívar, Simón Rodríguez y Ezequiel Zamora. Así como el pensamiento 
                                        de la educadora Belén sanjuán y el maestro Luis Beltrán prieto Figueroa.
                                        </p>
                                    </div>
                                    <div className="tab-pane fade" id="vision" >
                                        <p>
                                            Transformar la escuela Bolivariana “Villas del Pilar” y la comunidad en un espacio para la paz 
                                            y la vida, abierta al dialogo basado en el respeto y la tolerancia, a la renovación pedagógica
                                            y a la integración comunitaria para que el trabajo sea productivo en beneficio de todos y todas 
                                            hacia la formación de un ciudadano digno, critico, capaz de adaptarse a los retos que el país y 
                                            la nueva sociedad lo requiera, para asumir los grandes cambios sociales, mediante la comunicación 
                                            asertiva.
                                        </p>
                                    </div>
                                    <div className="tab-pane fade" id="ubicacion">
                                        <div className="row fila_imagen_ubicacion_comunidad">
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 contenedor_imagen_comunidad">
                                                <img className="imagen_comunidad" src={UbicacionComunidad} alt="ubicacion comunidad"/>
                                            </div>
                                        </div>
                                        <p>Rif:    j407604104</p>
                                        <p>Dirección:    Urb. Villas del Pilar, Av. Sucre con calles 2 y 4. Araure, Estado Portuguesa.</p>
                                        <p>Telefono de contacto:    0255 - 6654230</p>
                                    </div>
                                    <div className="panel_historia tab-pane fade " id="historia" >
                                        <p>
                                            La escuela Bolivariana “Villas del Pilar”, dependencia Nacional 
                                            fue inaugurada formalmente por el Ministerio de Educación, cultura 
                                            y deportes Prof. Aristóbulo Isturiz el 19 de marzo de 2003. Se encuentra 
                                            ubicada en la urbanización “Villas del pilar”, en la Av. Sucre con calles 
                                            2 y 4. Municipio Araure Estado Portuguesa. Esta institución creada como Escuela 
                                            Bolivariana incluye educación Inicial Bolivariana (Maternal y preescolar) y escuela 
                                            primaria Bolivariana (1° a 6° grado).
                                        </p>
                                        <p>
                                            A partir de 31 de marzo del 2003, se incorporan 03 Docentes Nacionales a los 03 docentes
                                            Estadales, así como: 01 Docente especialista: 01 docente de aula integrada, 01 doce de
                                            educación física, para asumir la atención pedagógica.
                                        </p>
                                        <p>
                                            El 23 de junio de 2003 bajo la dirección de la Lic. Angelica Coviello, se inician funciones en la 
                                            institución, en horario completo, como Escuela Bolivariana 8:00 AM a 4:00 PM, con el suministro del 
                                            programa de alimentación Escolar Bolivariana PAEB (desayuno, almuerzo y merienda), actividades pedagógicas
                                            y de formación integral (creatividad, expansión plástica y trabajos manuales, música y Folklore; Educación;
                                            Educación física), módulos de seis aulas cada una, por el organismo FONDUR. Para este entonces la institución
                                            funciona en do edificaciones construidas de formas separadas una para Educación Inicial y otra para la Escuela
                                            Primaria.
                                        </p>
                                        <p>
                                            El subsistema de Educación Inicial Bolivariana “Villas del Pilar”, brinda atención convencional
                                            en los niveles Material y preescolar a niños 2, 3, 4, 5 y 6 años de edad, así como atención no 
                                            convencional de niños y niñas 0 a 11 meses hasta 6 años, a través de la implementación de Simoncito
                                            comunitario, el cual a partir de noviembre del 2009 comienza a funcionar de forma independiente de 
                                            nuestra institución, es decir, como un código de dependencia distinto, sin embargo, continua siendo 
                                            asistido en el programa nacional de alimentación Escolar atendiendo la matricula 172 estudiantes, lo 
                                            que incrementa nuestra matrícula para el suministro de alimentos, para un total de 582 educandos; 
                                            considerando que en educación primaria Bolivariana cuenta con 12 secciones siendo la matrícula de 389 
                                            niños y niñas, bajo la dirección de la Licda. Betty Jerez y la subdirectora Académica Prof. Eglis Pérez
                                            La institución en sus inicios conto con la colaboración de padres, representantes y colaboradoras como 
                                            asistentes de educación inicial en la atención pedagógica; quienes en su oportunidad han construido y 
                                            brindando su apoyo y beneficio del desarrollo integral de los niños y niñas en este nivel.
                                        </p>
                                        <p>
                                            Actualmente existe una corresponsabilidad entre los diferentes actores y autores de beneficio de 
                                            niños y niñas de educación inicial y primaria. Esta institución ha sido Centro de pasantías de estudiantes
                                            del colegio universitario “Fermín toro, de la universidad Simón Rodríguez, colegio universitario “Monseñor
                                            de Talavera” y estudiantes de la Universidad Bolivariana de Venezuela Misión Sucre, instituciones que han
                                            permitido el cambio y aprendizaje de sus estudiantes a través del proceso de prácticas profesionales de 
                                            la carrera en educación Preescolar y Educación Integral, así como brindar el apoyo a las misiones educativas
                                            (Rivas, y de carácter social: Misión José Gregorio Hernández, Hijos de Venezuela, Comité Maizanta,Amor Mayor
                                            , Madres del barrio que contribuye a fortalecer la integración y cohesión de triada: Escuela-familia-comunidad.
                                        </p>
                                    </div>
                                    <div className="tab-pane fade" id="organigrama" >
                                        <div className="row fila_imagen_organigrama_comunidad">
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 contenedor_imagen_comunidad">
                                                <img className="organigrama_comunidad" src={OrganigramaComunidad} alt="organigrama comunidad"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

}
/*

<div className="col-3">
                        <ul className="nav flex-column nav-pills">
                            <li className="nav-item">
                                <a className="nav-link active"  data-toggle="tab" href="#mision" >Mision</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link"  data-toggle="tab" href="#vision">Vision</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link"  data-toggle="tab" href="#organigrama">Organigrama</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link"  data-toggle="tab" href="#historia">Reseña Historica</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-9">
                        <div className="tab-content text-justify">
                            <div className="tab-pane fade show active" id="mision">
                                <p>
                                La escuela Bolivariana “Villas del Pilar”, se propone para el año escolar 2014-2015, 
                                promover acciones pedagógicas en un escenario permanente de integración y cohesión de 
                                los actores autores del hecho pedagógico basado en el respeto, la tolerancia, la paz y
                                la vida, bajo la orientación pedagógica del currículo de la educación bolivariana, y con 
                                el ideario de Simón Bolívar, Simón Rodríguez y Ezequiel Zamora. Así como el pensamiento 
                                de la educadora Belén sanjuán y el maestro Luis Beltrán prieto Figueroa.
                                </p>
                            </div>
                            <div className="tab-pane fade" id="vision" >
                                <p>
                                    Transformar la escuela Bolivariana “Villas del Pilar” y la comunidad en un espacio para la paz 
                                    y la vida, abierta al dialogo basado en el respeto y la tolerancia, a la renovación pedagógica
                                    y a la integración comunitaria para que el trabajo sea productivo en beneficio de todos y todas 
                                    hacia la formación de un ciudadano digno, critico, capaz de adaptarse a los retos que el país y 
                                    la nueva sociedad lo requiera, para asumir los grandes cambios sociales, mediante la comunicación 
                                    asertiva.
                                </p>
                            </div>
                            <div className="tab-pane fade" id="organigrama">
                                <div className="row fila_imagen_ubicacion_comunidad">
                                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 contenedor_imagen_comunidad">
                                        <img className="imagen_comunidad" src={UbicacionComunidad} alt="ubicacion comunidad"/>
                                    </div>
                                </div>
                                <p>Rif:    j407604104</p>
                                <p>Dirección:    Urb. Villas del Pilar, Av. Sucre con calles 2 y 4. Araure, Estado Portuguesa.</p>
                                <p>Telefono de contacto:    0255 - 6654230</p>
                            </div>
                            <div className="tab-pane fade" id="historia" >
                                <p>
                                    La escuela Bolivariana “Villas del Pilar”, dependencia Nacional 
                                    fue inaugurada formalmente por el Ministerio de Educación, cultura 
                                    y deportes Prof. Aristóbulo Isturiz el 19 de marzo de 2003. Se encuentra 
                                    ubicada en la urbanización “Villas del pilar”, en la Av. Sucre con calles 
                                    2 y 4. Municipio Araure Estado Portuguesa. Esta institución creada como Escuela 
                                    Bolivariana incluye educación Inicial Bolivariana (Maternal y preescolar) y escuela 
                                    primaria Bolivariana (1° a 6° grado).
                                </p>
                                <p>
                                    A partir de 31 de marzo del 2003, se incorporan 03 Docentes Nacionales a los 03 docentes
                                    Estadales, así como: 01 Docente especialista: 01 docente de aula integrada, 01 doce de
                                    educación física, para asumir la atención pedagógica.
                                </p>
                                <p>
                                    El 23 de junio de 2003 bajo la dirección de la Lic. Angelica Coviello, se inician funciones en la 
                                    institución, en horario completo, como Escuela Bolivariana 8:00 AM a 4:00 PM, con el suministro del 
                                    programa de alimentación Escolar Bolivariana PAEB (desayuno, almuerzo y merienda), actividades pedagógicas
                                    y de formación integral (creatividad, expansión plástica y trabajos manuales, música y Folklore; Educación;
                                    Educación física), módulos de seis aulas cada una, por el organismo FONDUR. Para este entonces la institución
                                    funciona en do edificaciones construidas de formas separadas una para Educación Inicial y otra para la Escuela
                                    Primaria.
                                </p>
                                <p>
                                    El subsistema de Educación Inicial Bolivariana “Villas del Pilar”, brinda atención convencional
                                    en los niveles Material y preescolar a niños 2, 3, 4, 5 y 6 años de edad, así como atención no 
                                    convencional de niños y niñas 0 a 11 meses hasta 6 años, a través de la implementación de Simoncito
                                    comunitario, el cual a partir de noviembre del 2009 comienza a funcionar de forma independiente de 
                                    nuestra institución, es decir, como un código de dependencia distinto, sin embargo, continua siendo 
                                    asistido en el programa nacional de alimentación Escolar atendiendo la matricula 172 estudiantes, lo 
                                    que incrementa nuestra matrícula para el suministro de alimentos, para un total de 582 educandos; 
                                    considerando que en educación primaria Bolivariana cuenta con 12 secciones siendo la matrícula de 389 
                                    niños y niñas, bajo la dirección de la Licda. Betty Jerez y la subdirectora Académica Prof. Eglis Pérez
                                    La institución en sus inicios conto con la colaboración de padres, representantes y colaboradoras como 
                                    asistentes de educación inicial en la atención pedagógica; quienes en su oportunidad han construido y 
                                    brindando su apoyo y beneficio del desarrollo integral de los niños y niñas en este nivel.
                                </p>
                                <p>
                                    Actualmente existe una corresponsabilidad entre los diferentes actores y autores de beneficio de 
                                    niños y niñas de educación inicial y primaria. Esta institución ha sido Centro de pasantías de estudiantes
                                    del colegio universitario “Fermín toro, de la universidad Simón Rodríguez, colegio universitario “Monseñor
                                    de Talavera” y estudiantes de la Universidad Bolivariana de Venezuela Misión Sucre, instituciones que han
                                    permitido el cambio y aprendizaje de sus estudiantes a través del proceso de prácticas profesionales de 
                                    la carrera en educación Preescolar y Educación Integral, así como brindar el apoyo a las misiones educativas
                                    (Rivas, y de carácter social: Misión José Gregorio Hernández, Hijos de Venezuela, Comité Maizanta,Amor Mayor
                                    , Madres del barrio que contribuye a fortalecer la integración y cohesión de triada: Escuela-familia-comunidad.
                                </p>
                            </div>
                        </div>
                    </div>
*/

export default ComponentNosotros;