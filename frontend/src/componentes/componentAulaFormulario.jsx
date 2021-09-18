import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentAulaFormulario.css'
//JS
import axios from 'axios'
// IP servidor
import servidor from '../ipServer.js'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'
import ComponentFormCampo from '../subComponentes/componentFormCampo';
import ComponentFormSelect from '../subComponentes/componentFormSelect';
import ComponentFormRadioState from '../subComponentes/componentFormRadioState';


const axiosCustom=axios.create({
    baseURL:`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/`
})

class ComponentAulaFormulario extends React.Component{

    constructor(){
        super()
        this.state={

        }
    }

    render(){
        return(
            <div>
                <h1>Hola formulario aula</h1>
            </div>
        )
    }
}

export default withRouter(componentAulaFormulario)