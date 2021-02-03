import React from 'react'
import {withRouter} from 'react-router-dom'
//JS
import axios from 'axios'
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
                id_perfil:""
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
                        this.setState({
                            usuario:respuesta_servior.usuario.nombre_usuario,
                            id_perfil:respuesta_servior.usuario.id_perfil,
                            id_cedula:respuesta_servior.usuario.id_cedula
                        })
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
                    <BarraEstado nombre_usuario={this.state.usuario}/>
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