import React from 'react'
import {withRouter} from 'react-router-dom'
//JS
import $ from'jquery';
import popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle';
// css
import '../css/menu_dashboard.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../Icon-Simple/style.css'
import LinkButtom from '../subComponentes/link_button'
//Componentes configuracion estado_menu
/*
------ seguridad
<span className="item-sub-menu">Bitacora</span>
------ transaccion
<span className="item-sub-menu">Asistencia</span>
<span className="item-sub-menu">Gestionar Permiso</span> <- ADMIN O SECRETARIA
<span className="item-sub-menu">Solicitar Permiso</span> 
<span className="item-sub-menu">Gestionar Reposo</span>
------ Reportes
<span className="item-sub-menu">Trabajador</span>
*/

const MenuDashboard = (props) =>{

    /*
    function salirDelSistema(){
        if(localStorage.getItem("usuario")){
            localStorage.removeItem("usuario")
            props.history.push("/login")
        }
    }
    JSX -> <span className="col-12 nvl_1 item_menu_nvl_1 icon-exit" onClick={salirDelSistema} id="salir"></span>
    */

    function irASolicitudPermiso(){
        props.history.push("/dashboard/transaccion/permiso-trabajador/solicitar")
    }

    var modulo=props.modulo.split("-");
    return(
        <>
            <div className="col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 columna-menu">
                <div className="row text-center align-items-center justify-content-center contendor-menu">
                    <span className="col-12 nvl_1 item_menu_nvl_1 encabezado_menu icon-home"></span>
                    <span className={(modulo[1]==="reporte" ? props.modulo : "false-reporte")+" col-12 nvl_1 item_menu_nvl_1 icon-file-text2"} onClick={props.eventoPadreMenu} id="reporte"></span>
                    <span className={(modulo[1]==="transaccion" ? props.modulo : "false-transaccion")+" col-12 nvl_1 item_menu_nvl_1 icon-rocket"} onClick={props.eventoPadreMenu} id="transaccion"></span>
                    <span className={(modulo[1]==="configuracion" ? props.modulo : "false-configuracion")+" col-12 nvl_1 item_menu_nvl_1 icon-cog"} onClick={props.eventoPadreMenu} id="configuracion"></span>
                    <span className={(modulo[1]==="seguridad" ? props.modulo : "false-seguridad")+" col-12 nvl_1 item_menu_nvl_1 icon-key"} onClick={props.eventoPadreMenu} id="seguridad"></span>
                    <span className="col-12 nvl_1 item_menu_nvl_1 icon-credit-card" onClick={irASolicitudPermiso} id="solicitar-pemriso"></span>
                </div>
            </div>
            {props.estado_menu&&
                <div className="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 columna-sub-menu">
                    {modulo[1]==="reporte"&&
                        <div id="reporte">
                            <span className="item-sub-menu">Trabajador</span>
                            <span className="item-sub-menu">asistensia</span>
                        </div>
                    }
                    {modulo[1]==="transaccion"&&
                        <div id="trasaccion">
                            <span className="item-sub-menu">Asistencia</span>
                            <LinkButtom clases="item-sub-menu" ruta="/dashboard/transaccion/permiso-trabajador" texto="Gestionar Permiso"/>
                            <span className="item-sub-menu">Gestionar Reposo</span>
                        </div>
                    }
                    {modulo[1]==="configuracion"&&
                        <div id="configuracion">
                            <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/acceso" texto="Acceso"/>
                            <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/tipo-trabajador" texto="Tipo de Trabajador"/>
                            <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/funcion-trabajador" texto="Función del trabajado"/>
                            <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/trabajador" texto="Trabajador"/>
                            <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/permiso" texto="Permiso"/>

                            <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/horario" texto="Horario"/>

                            <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/medico" texto="Medico"/>
                            <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/especialidad" texto="Especialidad"/>

                            <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/estado" texto="Estado"/>
                            <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/ciudad" texto="Ciudad"/>
                            <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/tipo-cam" texto="Tipo de Asistencia Medica"/>
                            <span className="item-sub-menu">Centro de Asistencia Medica</span>
                            
                            <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/reposo" texto="Reposo"/>
                        </div>
                    }
                    {modulo[1]==="seguridad"&&
                        <div id="seguridad">
                            <span className="item-sub-menu">Bitacora</span>
                        </div>
                    }
                </div>
            }
        </>  
    )
        

}

export default withRouter(MenuDashboard);
