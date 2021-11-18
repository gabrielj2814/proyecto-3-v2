import React from 'react';
import {withRouter} from 'react-router-dom'
import axios from 'axios'
// IP servidor
import servidor from '../ipServer.js'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import "../css/componentVacuna.css"
//componentes
import ComponentDashboard from './componentDashboard'
// subComponent
import AlertBootstrap from "../subComponentes/alertBootstrap"
import InputButton from '../subComponentes/input_button'
import TituloModulo from '../subComponentes/tituloModulo'
import Tabla from '../subComponentes/componentTabla'
import ButtonIcon from '../subComponentes/buttonIcon'

const axiosCustom=axios.create({
    baseURL:`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/`
})

class ComponentVacuna extends React.Component{


    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this)
        // this.redirigirFormulario=this.redirigirFormulario.bind(this)
        // this.irAlFormularioDeActualizacion=this.irAlFormularioDeActualizacion.bind(this)
        this.state={
            //////
            modulo:"",
            estado_menu:false,
            registros:[],
            // --------
            alerta:{
                color:null,
                mensaje:null,
                estado:false
            }
        }
    }

        // logica menu
        mostrarModulo(a){
            var span=a.target;
            if(this.state.modulo===""){
                const estado="true-"+span.id;
                this.setState({modulo:estado,estado_menu:true});
            }
            else{
                var modulo=this.state.modulo.split("-");
                if(modulo[1]===span.id){
                    if(this.state.estado_menu){
                        const estado="false-"+span.id
                        this.setState({modulo:estado,estado_menu:false})
                    }
                    else{
                        const estado="true-"+span.id
                        this.setState({modulo:estado,estado_menu:true})
                    }
                }
                else{
                    if(this.state.estado_menu){
                        const estado="true-"+span.id
                        this.setState({modulo:estado})
                    }
                    else{
                        const estado="true-"+span.id
                        this.setState({modulo:estado,estado_menu:true})
                    }
                }
            }
        }


    render(){
        const jsx=(
            <div>
                <h1>hola</h1>
            </div>
        )
        return (
            <div className="component_vacuna">

                <ComponentDashboard
                componente={jsx}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />


            </div>
        )
    }

}

export default withRouter(ComponentVacuna)