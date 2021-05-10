import React from 'react'
import {withRouter} from 'react-router-dom'

import axios from  'axios'

// css
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
import '../css/componentAsistenciaPublica.css'
//JS
import $ from 'jquery';
import popper from 'popper.js';
// import 'bootstrap/dist/js/bootstrap';
//sub componentes
import ComponentMenuHomePage from '../subComponentes/componentMenuHomePage';

class ComponentAsistenciaPublica extends React.Component{

    constructor(){
        super()
        this.state={

        }
    }

    render(){
        return(
            <div className="containter-fluid">
                <ComponentMenuHomePage/>
                <h1>vista sistencia publica</h1>
            </div>
        )
    }


}

export default withRouter(ComponentAsistenciaPublica)