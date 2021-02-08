import React from 'react'
import {withRouter} from 'react-router-dom'
//JS
import axios from 'axios'
import Moment from "moment"
//css
import '../css/dashboard.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
//componentes
import BarraEstado from './componentBarraEstado'
import MenuDashboard from '../subComponentes/componentMenuDashboard'
import ComponentModulo from '../subComponentes/componentModulo'

class ComponentDashboard extends React.Component{

        constructor(props){
            super()
            this.state={
                id_cedula:"",
                usuario:"",
                id_perfil:"",
                fecha:"",
                fechaRelog:"",
                referenciaRelog:""
            }
        }

        async UNSAFE_componentWillMount(){
            this.caducarReposos()
            this.caducarPermisos()

            var mensaje={texto:"",estado:""}
            if(localStorage.getItem("usuario")){
                var respuesta_servior=""
                const token=localStorage.getItem("usuario")
                await axios.get(`http://localhost:8080/login/verificar-sesion${token}`)
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
                        this.actualizarRelog()
                    }
                    else{
                        mensaje.texto="No se puedo conectar con el servidor"
                        mensaje.estado="401"
                        this.props.history.push(`/login${JSON.stringify(mensaje)}`)
                    }
                })
                .catch(error=>{
                    console.log(error)
                    mensaje.texto="hubo un error inseperado en el servidor al momento de procesar su peticion"
                    mensaje.estado="500"
                    this.props.history.push(`/login${JSON.stringify(mensaje)}`)
                })
            }
            else{
                mensaje.texto="Notienes la autorización para entrar al sistema"
                mensaje.estado="500"
                this.props.history.push(`/login${JSON.stringify(mensaje)}`)
            }
            
        }

        actualizarRelog(){
            // alert(this.state.fecha)
            
            // alert(Moment.format('HH:mm:ss')) 
            let n=0
            let fecha=Moment(this.state.fecha)
            let relog=setInterval(() => {
                console.log(fecha.format("DD/MM/YYYY-hh:mm:ssA"))
                this.setState({
                    fechaRelog:fecha.format("DD/MM/YYYY-hh:mm:ssA")
                })
                fecha.add(1,"second") 
            }, 1000);
            this.setState({referenciaRelog:relog})

        }


        caducarReposos(){
            axios.get("http://localhost:8080/transaccion/reposo-trabajador/verifircar-vencimiento")
            .then(repuesta => {
                console.log(repuesta.data)
            })
            .catch(error=> {
                console.log(error)
            })
        }

        caducarPermisos(){
            axios.get("http://localhost:8080/transaccion/permiso-trabajador/verifircar-vencimiento")
            .then(repuesta => {
                console.log(repuesta.data)
            })
            .catch(error=> {
                console.log(error)
            })
        }


        render(){
            return(
                <div className="container-fluid component_dashboard">
                    <BarraEstado nombre_usuario={this.state.usuario} fechaRelog={this.state.fechaRelog} referenciaRelog={this.state.referenciaRelog}/>
                    <div className="row contenedor_app">
                        <MenuDashboard
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