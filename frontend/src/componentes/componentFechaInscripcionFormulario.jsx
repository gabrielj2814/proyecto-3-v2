import React from 'react';
import {withRouter} from 'react-router-dom'
import axios from 'axios'
// IP servidor
import servidor from '../ipServer.js'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentFechaInscripcionFormulario.css'
//componentes
import ComponentDashboard from './componentDashboard'
// subComponent
import AlertBootstrap from "../subComponentes/alertBootstrap"
import InputButton from '../subComponentes/input_button'
import ComponentFormCampo from '../subComponentes/componentFormCampo';
import ComponentFormRadioState from "../subComponentes/componentFormRadioState"

const axiosCustom=axios.create({
    baseURL:`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/`
})

class ComponentFechaInscripcionFormulario extends React.Component{

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this)
        // this.cambiarEstado=this.cambiarEstado.bind(this)
        // this.regresar=this.regresar.bind(this)
        // this.operacion=this.operacion.bind(this)
        // this.validarNumero=this.validarNumero.bind(this)
        this.state={
            //////
            modulo:"",
            estado_menu:false,
            //
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
                <h1>hola mundo</h1>
            </div>
        )
        return(
            <div className="component_fecha_inscripcion_formulario">
                    
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

export default withRouter(ComponentFechaInscripcionFormulario)