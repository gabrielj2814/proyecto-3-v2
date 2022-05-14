import React from 'react'
import {withRouter} from 'react-router-dom'
//JS
import axios from 'axios'
import Moment from "moment"
// IP servidor
import servidor from '../ipServer.js'
//css
import '../css/dashboard.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
//componentes
import BarraEstado from './componentBarraEstado'
import MenuDashboard from '../subComponentes/componentMenuDashboard'
import ComponentModulo from '../subComponentes/componentModulo'
// import { Alert } from 'bootstrap'
import InputButton from '../subComponentes/input_button'
import AlertBootstrap from "../subComponentes/alertBootstrap"

class ComponentDashboard extends React.Component{

        constructor(props){
            super()
            this.extenderSesion=this.extenderSesion.bind(this)
            this.state={
                id_cedula:"",
                usuario:"",
                id_perfil:"",
                fecha:"",
                fechaRelog:"",
                referenciaRelog:"",
                referenciaTemporzadorSesion:"",
                
                timpoTerminarSesion:160,
                timpoPreguntarExtenderSesion:150,
                mensaje:{
                    texto:"",
                    estado:""
                },
                estadoAlerta:false
            }
        }

        async UNSAFE_componentWillMount(){
            this.caducarReposos()
            this.caducarPermisos()
            this.chequearAnoEscolar()

            var mensaje={texto:"",estado:""}
            if(localStorage.getItem("usuario")){
                let mensaje=JSON.parse(JSON.stringify(this.state.mensaje))
                var respuesta_servior=""
                const token=localStorage.getItem("usuario")
                await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/login/verificar-sesion${token}`)
                .then(respuesta=>{
                    respuesta_servior=respuesta.data
                    if(respuesta_servior.usuario){
                        // alert(respuesta_servior.usuario.fecha)
                        this.setState({
                            usuario:respuesta_servior.usuario.nombre_usuario,
                            id_perfil:respuesta_servior.usuario.id_perfil,
                            id_cedula:respuesta_servior.usuario.id_cedula,
                            fecha:respuesta_servior.usuario.fecha
                        })
                        if(localStorage.getItem("fechaSesion")===""){
                            // alert("no tiene tiempo de sesion")
                            localStorage.fechaSesion=Moment(respuesta_servior.usuario.fecha).format("YYYY-MM-DD")
                            localStorage.tiempoSesion=Moment(respuesta_servior.usuario.fecha).format("hh:mm:ssA")
                        }
                        else{
                            let fechaSecion=Moment(respuesta_servior.usuario.fecha)
                            let tiempoExtender=Moment(localStorage.getItem("tiempoSesion"),"hh:mm:ssA")
                            let tiempoFinal=Moment(localStorage.getItem("tiempoSesion"),"hh:mm:ssA")

                            tiempoExtender.add(this.state.timpoPreguntarExtenderSesion,"minutes")
                            tiempoFinal.add(this.state.timpoTerminarSesion,"minutes")
                            // console.log(fechaSecion.format("hh:mm:ssA"))
                            // console.log(tiempoExtender.format("hh:mm:ssA"))
                            // console.log(tiempoFinal.format("hh:mm:ssA"))
                            if(fechaSecion.isSameOrAfter(tiempoFinal)){
                                console.log("Sacar del sistema por que se vencio la sesion")
                                mensaje.texto="Lo sentimos, pero su sesión ha caducado"
                                mensaje.estado="500"
                                this.destruirSesion()
                                this.props.history.push(`/login${JSON.stringify(mensaje)}`)
                            }
                            else{
                                if(fechaSecion.isSameOrAfter(tiempoExtender)){
                                    console.log("Mostrar alerta para preguntar si quiere extender la sesion")
                                }
                            }
                        }
                        this.actualizarRelog()
                        this.temporizadorSesion()
                    }
                    else{
                        mensaje.texto="No se puedo conectar con el servidor"
                        mensaje.estado="401"
                        this.props.history.push(`/login${JSON.stringify(mensaje)}`)
                    }
                })
                .catch(error=>{
                    console.log(error)
                    mensaje.texto="hubo un error inseperado en el servidor al momento de procesar su petición"
                    mensaje.estado="500"
                    this.props.history.push(`/login${JSON.stringify(mensaje)}`)

                })
            }
            else{
                mensaje.texto="No tienes la autorización para entrar al sistema"
                mensaje.estado="500"
                this.props.history.push(`/login${JSON.stringify(mensaje)}`)
            }
            
        }

        actualizarRelog(){
            let fecha=Moment(this.state.fecha)
            let relog=setInterval(() => {
                // console.log(fecha.format("DD/MM/YYYY-hh:mm:ssA"))
                this.setState({
                    fechaRelog:fecha.format("DD/MM/YYYY-hh:mm:ssA")
                })
                fecha.add(1,"second") 
                this.setState({fecha:fecha})
            }, 1000);
            this.setState({referenciaRelog:relog})

        }

        temporizadorSesion(){
            let fechaSecion=Moment(this.state.fecha)
            let mensaje=JSON.parse(JSON.stringify(this.state.mensaje))
            let temporzadorSesion=setInterval(() => {
                // let tiempoInicio=Moment(localStorage.getItem("tiempoSesion"),"hh:mm:ssA")
                let tiempoExtender=Moment(localStorage.getItem("tiempoSesion"),"hh:mm:ssA")
                let tiempoFinal=Moment(localStorage.getItem("tiempoSesion"),"hh:mm:ssA")
                
                tiempoExtender.add(this.state.timpoPreguntarExtenderSesion,"minutes")
                tiempoFinal.add(this.state.timpoTerminarSesion,"minutes")
                // console.log(tiempoExtender.format("hh:mm:ssA"))
                // console.log(tiempoFinal.format("hh:mm:ssA"))
                if(fechaSecion.isSameOrAfter(tiempoFinal)){
                    // console.log("sacar del sistema por que se vencio la sesion")
                    const $alertaExtenderSesion=document.getElementById("alerta_extender_sesion")
                    $alertaExtenderSesion.classList.remove("mostart_alerta_extender_sesion")
                    mensaje.texto="Lo sentimos, pero su sesión ha caducado"
                    mensaje.estado="500"
                    this.destruirSesion()
                    this.props.history.push(`/login${JSON.stringify(mensaje)}`)
                    
                }
                else{
                    if(fechaSecion.isSameOrAfter(tiempoExtender)){
                        // console.log("mostrar alerta para preguntar si quiere extender la sesion")
                        if(!this.state.estadoAlerta){
                            const $alertaExtenderSesion=document.getElementById("alerta_extender_sesion")
                            if(!$alertaExtenderSesion.classList.contains("mostart_alerta_extender_sesion")){
                                $alertaExtenderSesion.classList.add("mostart_alerta_extender_sesion")
                            }
                            this.setState({
                                estadoAlerta:true
                            })
                        }
                    }
                }
                fechaSecion.add(1,"second") 
            }, 1000);
            this.setState({
                referenciaTemporzadorSesion:temporzadorSesion
            })
        }

        destruirSesion(){
            localStorage.removeItem("usuario")
            localStorage.removeItem("tiempoSesion")
            localStorage.removeItem("fechaSesion")
            clearInterval(this.state.referenciaRelog)
            clearInterval(this.state.referenciaTemporzadorSesion)
        }

        chequearAnoEscolar(){
            axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/ano-escolar/chequear-ano-escolar`)
            .then(repuesta => {
                console.log(repuesta.data)
            })
            .catch(error=> {
                console.log(error)
            })
        }


        caducarReposos(){
            axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/transaccion/reposo-trabajador/verifircar-vencimiento`)
            .then(repuesta => {
                console.log(repuesta.data)
            })
            .catch(error=> {
                console.log(error)
            })
        }

        caducarPermisos(){
            axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/transaccion/permiso-trabajador/verifircar-vencimiento`)
            .then(repuesta => {
                console.log(repuesta.data)
            })
            .catch(error=> {
                console.log(error)
            })
        }

        extenderSesion(){
            clearInterval(this.state.referenciaTemporzadorSesion)
            const $alertaExtenderSesion=document.getElementById("alerta_extender_sesion")
            $alertaExtenderSesion.classList.remove("mostart_alerta_extender_sesion")
            let tiempoInicio=Moment(this.state.fecha)
            console.log("hora =>>> ",tiempoInicio.format("hh:mm:ssA"))
            localStorage.tiempoSesion=tiempoInicio.format("hh:mm:ssA")
            this.setState({
                estadoAlerta:false
            })
            this.temporizadorSesion()
        }


        render(){
            const mesajeAlertaExtenderSesion=(
                <div>
                    <span className="mensaje_alerta_estender_sesion font-weight-bold">Estimado usuario la sesion esta a punto de caducar desea exterderla </span>
                    <InputButton 
                    clasesBoton="btn btn-warning"
                    id="boton-extender-sesion"
                    value="Extender"
                    eventoPadre={this.extenderSesion}
                    /> 
                </div>
            )


            return(
                <div className="container-fluid component_dashboard">
                    <div id="alerta_extender_sesion" className="contenedor_alerta_extender_sesion">
                        <AlertBootstrap colorAlert={"warning"} mensaje={mesajeAlertaExtenderSesion}/>
                    </div>
                    <BarraEstado nombre_usuario={this.state.usuario} fechaRelog={this.state.fechaRelog} referenciaRelog={this.state.referenciaRelog} referenciaTemporzadorSesion={this.state.referenciaTemporzadorSesion}/>
                    <div className="row contenedor_app">
                    
                        <MenuDashboard
                        idPerfil={this.state.id_perfil}
                        modulo={this.props.modulo}
                        eventoPadreMenu={this.props.eventoPadreMenu}
                        estado_menu={this.props.estado_menu}
                        />
                        <ComponentModulo componente={this.props.componente} estado_menu={this.props.estado_menu}/>
                    </div>
                </div>
            )
        }




}

export default withRouter(ComponentDashboard)