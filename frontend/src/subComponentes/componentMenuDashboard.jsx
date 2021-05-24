import React from 'react'
import {withRouter} from 'react-router-dom'
//JS
import $, { ready } from'jquery';
import popper from 'popper.js';
import axios from 'axios';
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


class MenuDashboard extends React.Component{

    constructor(){
        super()
        this.irASolicitudPermiso=this.irASolicitudPermiso.bind(this)
        this.irASolicitudReposo=this.irASolicitudReposo.bind(this)
        this.irHaBitacora=this.irHaBitacora.bind(this)
        this.irHaHome=this.irHaHome.bind(this)
        this.state={
            modulosSistema:{}
        }
    }

    async UNSAFE_componentWillMount(){
        if(localStorage.getItem("usuario")){
            var respuesta_servior=""
            const token=localStorage.getItem("usuario")
            await axios.get(`http://localhost:8080/login/verificar-sesion${token}`)
            .then(async respuesta=>{
                respuesta_servior=respuesta.data
                if(respuesta_servior.usuario){
                    await this.consultarPerfilTrabajador(respuesta_servior.usuario.id_perfil)
                }  
            })
        }
        
    }

    async consultarPerfilTrabajador(idPerfil){
        
        await axios.get(`http://localhost:8080/configuracion/acceso/consultar/${idPerfil}`)
        .then(repuesta => {
            let json=JSON.parse(JSON.stringify(repuesta.data))
            // console.log("datos modulos =>>>",json)
            let modulosSistema={}
            let modulosActivos=json.modulos.filter( modulo => {
                if(modulo.estatu_modulo==="1"){
                    return modulo
                }
            })
            // console.log("datos modulos =>>>",modulosActivos);
            for(let medulo of modulosActivos){
                if(modulosSistema[medulo.modulo_principal]){
                    modulosSistema[medulo.modulo_principal][medulo.sub_modulo]=true
                }
                else{
                    modulosSistema[medulo.modulo_principal]={}
                    modulosSistema[medulo.modulo_principal][medulo.sub_modulo]=true
                }
            }
            console.log(modulosSistema)
            this.setState({modulosSistema})
            
            
        })
        .catch(error =>  {
            console.log(error)
        })
    }

    irASolicitudPermiso(){
        this.props.history.push("/dashboard/transaccion/permiso-trabajador/solicitar")
    }
    
    irASolicitudReposo(){
        this.props.history.push("/dashboard/transaccion/reposo-trabajador/solicitar")
    }
    
    irHaBitacora(){
        this.props.history.push("/dashboard/seguridad/bitacora")
    }

    irHaHome(){
        this.props.history.push("/dashboard")
    }

    render(){
        // alert()
        // console.log(this.props.idPerfil)
        var modulo=this.props.modulo.split("-");
        // <span className={(modulo[1]==="reporte" ? this.props.modulo : "false-reporte")+" col-12 nvl_1 item_menu_nvl_1 icon-file-text2"} onClick={this.props.eventoPadreMenu} id="reporte"></span>
        // {modulo[1]==="reporte"&&
        //                 <div id="reporte">
        //                     <span className="item-sub-menu">Trabajador</span>
        //                     <span className="item-sub-menu">asistensia</span>
        //                 </div>
        //             }
        return(
<>
            <div className="col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 columna-menu">
                <div className="row text-center align-items-center justify-content-center contendor-menu">
                    <span className="col-12 nvl_1 item_menu_nvl_1 encabezado_menu icon-home" onClick={this.irHaHome}></span>
                    {this.state.modulosSistema["/dashboard/configuracion"]&&
                        <span className={(modulo[1]==="configuracion" ? this.props.modulo : "false-configuracion")+" col-12 nvl_1 item_menu_nvl_1 icon-cog"} onClick={this.props.eventoPadreMenu} id="configuracion"></span>
                    }
                    {this.state.modulosSistema["/dashboard/transaccion"]&&
                        <span className={(modulo[1]==="transaccion" ? this.props.modulo : "false-transaccion")+" col-12 nvl_1 item_menu_nvl_1 icon-rocket"} onClick={this.props.eventoPadreMenu} id="transaccion"></span>
                    }
                    {/* {this.state.modulosSistema["/dashboard/seguridad"]&&
                        <span className={(modulo[1]==="seguridad" ? this.props.modulo : "false-seguridad")+" col-12 nvl_1 item_menu_nvl_1 icon-key"} onClick={this.props.eventoPadreMenu} id="seguridad"></span>
                    } */}
                    <span className="col-12 nvl_1 item_menu_nvl_1 icon-credit-card" onClick={this.irASolicitudPermiso} id="solicitar-pemriso"></span>
                    <div className="col-12 nvl_1 item_menu_nvl_1" onClick={this.irASolicitudReposo} id="solicitar-reposo">
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-thermometer-half" viewBox="0 0 16 16">
                            <path d="M9.5 12.5a1.5 1.5 0 1 1-2-1.415V6.5a.5.5 0 0 1 1 0v4.585a1.5 1.5 0 0 1 1 1.415z"/>
                            <path d="M5.5 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0V2.5zM8 1a1.5 1.5 0 0 0-1.5 1.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0l-.166-.15V2.5A1.5 1.5 0 0 0 8 1z"/>
                        </svg>

                    </div>
                    {this.state.modulosSistema["/dashboard/seguridad"]&&
                        <div className="col-12 nvl_1 item_menu_nvl_1" onClick={this.irHaBitacora} id="solicitar-reposo">
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-journal-bookmark" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M6 8V1h1v6.117L8.743 6.07a.5.5 0 0 1 .514 0L11 7.117V1h1v7a.5.5 0 0 1-.757.429L9 7.083 6.757 8.43A.5.5 0 0 1 6 8z"/>
                                <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
                                <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
                            </svg>

                        </div>
                    }
                    
                </div>
            </div>
            {this.props.estado_menu&&
                <div className="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 columna-sub-menu">
                    
                    {modulo[1]==="transaccion"&&
                        <div id="trasaccion">
                            
                            {this.state.modulosSistema["/dashboard/transaccion"]["/asistencia"]&&
                                <LinkButtom clases="item-sub-menu" ruta="/dashboard/transaccion/asistencia" texto="Asistencia"/>
                            }
                            {this.state.modulosSistema["/dashboard/transaccion"]["/asistencia/lista"]&&
                                <LinkButtom clases="item-sub-menu" ruta="/dashboard/transaccion/asistencia/lista" texto="Lista de Asistencia"/>
                            }
                            {this.state.modulosSistema["/dashboard/transaccion"]["/permiso-trabajador"]&&
                                <LinkButtom clases="item-sub-menu" ruta="/dashboard/transaccion/permiso-trabajador" texto="Gestionar Permiso"/>
                            }
                            {this.state.modulosSistema["/dashboard/transaccion"]["/reposo-trabajador"]&&
                                <LinkButtom clases="item-sub-menu" ruta="/dashboard/transaccion/reposo-trabajador" texto="Gestionar Reposo"/>
                            }
                        </div>
                    }
                    {modulo[1]==="configuracion"&&
                        <div id="configuracion">
                            {this.state.modulosSistema["/dashboard/configuracion"]["/acceso"]&&
                                <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/acceso" texto="Acceso"/>
                            }
                            {this.state.modulosSistema["/dashboard/configuracion"]["/tipo-trabajador"]&&
                                <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/tipo-trabajador" texto="Tipo de Trabajador"/>
                            }
                            {this.state.modulosSistema["/dashboard/configuracion"]["/funcion-trabajador"]&&
                                <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/funcion-trabajador" texto="Función del Trabajador"/>
                            }
                            {this.state.modulosSistema["/dashboard/configuracion"]["/trabajador"]&&
                                <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/trabajador" texto="Trabajador"/>
                            }
                            {this.state.modulosSistema["/dashboard/configuracion"]["/permiso"]&&
                                <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/permiso" texto="Permiso"/>
                            }

                            
                            {this.state.modulosSistema["/dashboard/configuracion"]["/especialidad"]&&
                                <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/especialidad" texto="Especialidad"/>
                            }
                            {this.state.modulosSistema["/dashboard/configuracion"]["/asignacion-especialidad-medico"]&&
                                <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/asignacion-especialidad-medico" texto="Asignación Médico Especialidad"/>
                            }
                            {this.state.modulosSistema["/dashboard/configuracion"]["/medico"]&&
                                <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/medico" texto="Médico"/>
                            }
                            
                            {this.state.modulosSistema["/dashboard/configuracion"]["/estado"]&&
                                <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/estado" texto="Estado"/>
                            }
                            {this.state.modulosSistema["/dashboard/configuracion"]["/ciudad"]&&
                                <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/ciudad" texto="Ciudad"/>
                            }
                            {this.state.modulosSistema["/dashboard/configuracion"]["/tipo-cam"]&&
                                <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/tipo-cam" texto="Tipo de Centro de Asistencia Médica"/>
                            }
                            {this.state.modulosSistema["/dashboard/configuracion"]["/cam"]&&
                                <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/cam" texto="Centro de Asistencia Médica"/>
                            }
                            
                            {this.state.modulosSistema["/dashboard/configuracion"]["/horario"]&&
                                <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/horario" texto="Horario"/>
                            }
                            {this.state.modulosSistema["/dashboard/configuracion"]["/reposo"]&&
                                <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/reposo" texto="Reposo"/>
                            }
                            {this.state.modulosSistema["/dashboard/configuracion"]["/cintillo-home"]&&
                                <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/cintillo-home" texto="Cintillo"/>
                            }
                        </div>
                    }
                    {modulo[1]==="seguridad"&&
                        <div id="seguridad">
                            {this.state.modulosSistema["/dashboard/seguridad"]["/Bitacora"]&&
                                <span className="item-sub-menu">Bitácora</span>
                            }
                        </div>
                    }
                </div>
            }
        </>  
        )
    }

}

// const MenuDashboard = (this.props) =>{

//     /*
//     function salirDelSistema(){
//         if(localStorage.getItem("usuario")){
//             localStorage.removeItem("usuario")
//             this.props.history.push("/login")
//         }
//     }
//     JSX -> <span className="col-12 nvl_1 item_menu_nvl_1 icon-exit" onClick={salirDelSistema} id="salir"></span>
//     */

//     function irASolicitudPermiso(){
//         this.props.history.push("/dashboard/transaccion/permiso-trabajador/solicitar")
//     }

//     var modulo=this.props.modulo.split("-");
//     return(
//         <>
//             <div className="col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 columna-menu">
//                 <div className="row text-center align-items-center justify-content-center contendor-menu">
//                     <span className="col-12 nvl_1 item_menu_nvl_1 encabezado_menu icon-home"></span>
//                     <span className={(modulo[1]==="configuracion" ? this.props.modulo : "false-configuracion")+" col-12 nvl_1 item_menu_nvl_1 icon-cog"} onClick={this.props.eventoPadreMenu} id="configuracion"></span>
//                     <span className={(modulo[1]==="transaccion" ? this.props.modulo : "false-transaccion")+" col-12 nvl_1 item_menu_nvl_1 icon-rocket"} onClick={this.props.eventoPadreMenu} id="transaccion"></span>
//                     <span className={(modulo[1]==="reporte" ? this.props.modulo : "false-reporte")+" col-12 nvl_1 item_menu_nvl_1 icon-file-text2"} onClick={this.props.eventoPadreMenu} id="reporte"></span>
//                     <span className={(modulo[1]==="seguridad" ? this.props.modulo : "false-seguridad")+" col-12 nvl_1 item_menu_nvl_1 icon-key"} onClick={this.props.eventoPadreMenu} id="seguridad"></span>
//                     <span className="col-12 nvl_1 item_menu_nvl_1 icon-credit-card" onClick={irASolicitudPermiso} id="solicitar-pemriso"></span>
//                 </div>
//             </div>
//             {this.props.estado_menu&&
//                 <div className="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 columna-sub-menu">
//                     {modulo[1]==="reporte"&&
//                         <div id="reporte">
//                             <span className="item-sub-menu">Trabajador</span>
//                             <span className="item-sub-menu">asistensia</span>
//                         </div>
//                     }
//                     {modulo[1]==="transaccion"&&
//                         <div id="trasaccion">
//                             <LinkButtom clases="item-sub-menu" ruta="/dashboard/transaccion/asistencia" texto="Asistencia"/>
//                             <LinkButtom clases="item-sub-menu" ruta="/dashboard/transaccion/asistencia/lista" texto="Lista de Asistencia"/>
//                             <LinkButtom clases="item-sub-menu" ruta="/dashboard/transaccion/permiso-trabajador" texto="Gestionar Permiso"/>
//                             <LinkButtom clases="item-sub-menu" ruta="/dashboard/transaccion/reposo-trabajador" texto="Gestionar Reposo"/>
//                         </div>
//                     }
//                     {modulo[1]==="configuracion"&&
//                         <div id="configuracion">
//                             <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/acceso" texto="Acceso"/>
//                             <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/tipo-trabajador" texto="Tipo de Trabajador"/>
//                             <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/funcion-trabajador" texto="Función del Trabajador"/>
//                             <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/trabajador" texto="Trabajador"/>
//                             <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/permiso" texto="Permiso"/>

                            
//                             <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/especialidad" texto="Especialidad"/>
//                             <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/asignacion-especialidad-medico" texto="Asignación Médico Especialidad"/>
//                             <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/medico" texto="Médico"/>
                            
//                             <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/estado" texto="Estado"/>
//                             <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/ciudad" texto="Ciudad"/>
//                             <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/tipo-cam" texto="Tipo de Centro de Asistencia Médica"/>
//                             <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/cam" texto="Centro de Asistencia Médica"/>
                            
//                             <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/horario" texto="Horario"/>
//                             <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/reposo" texto="Reposo"/>
//                             <LinkButtom clases="item-sub-menu" ruta="/dashboard/configuracion/cintillo-home" texto="Cintillo"/>
//                         </div>
//                     }
//                     {modulo[1]==="seguridad"&&
//                         <div id="seguridad">
//                             <span className="item-sub-menu">Bitácora</span>
//                         </div>
//                     }
//                 </div>
//             }
//         </>  
//     )
        

// }

export default withRouter(MenuDashboard);
