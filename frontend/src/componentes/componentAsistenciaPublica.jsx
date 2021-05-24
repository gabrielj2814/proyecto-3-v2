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
import AlertBootstrap from '../subComponentes/alertBootstrap'

class ComponentAsistenciaPublica extends React.Component{

    constructor(){
        super()
        this.enviarDatos=this.enviarDatos.bind(this)
        this.state={
            alerta:{
                color:null,
                mensaje:null,
                estado:false
            }
        }
    }

    async enviarDatos(){
        let alerta=JSON.parse(JSON.stringify(this.state.alerta))
        let $cedula=document.getElementById("id_cedula")
        // alert($cedula.value)
        let json={
            asistencia:{
                cedula:$cedula.value
            }
        }
        console.log(json);
        await axios.post("http://localhost:8080/transaccion/asistencia/presente-2",json)
        .then(respuesta => {
            let json=JSON.parse(JSON.stringify(respuesta.data.respuesta_api))
            console.log("datos asistencia =>>>>",json)
            if(json.estado_peticion==="200"){
                alerta.color="success"
                alerta.mensaje=json.mensaje
                alerta.estado=true
            }
            else{
                alerta.color="danger"
                alerta.mensaje=json.mensaje
                alerta.estado=true
            }
            this.setState({alerta})
        })
        .catch(error => {
            
            console.log(error)
        })

    }

    render(){
        return(
            <div>
                <ComponentMenuHomePage/>
                {this.state.alerta.estado===true &&
                        (
                            <div class="container-fluid mt-5">
                                <div className="row justify-content-center">
                                    <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                        <AlertBootstrap colorAlert={this.state.alerta.color} mensaje={this.state.alerta.mensaje}></AlertBootstrap>
                                    </div>
                                </div>


                            </div>
                        )
                    }
                <div class="container-fluid">
                    
                <div class="row justify-content-center">
                    
                    <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 contendor-form-asistencia mt-5">
                        <div className="row justify-content-center align-items-center height-100x100">
                            <div className="col-auto">
                                <h1 className="text-center titulo-asistencia-publica mb-3">Asistencia</h1>
                                <div className="row justify-content-center mb-4">
                                    <div className="col-auto">
                                        <div className="form-groud">
                                            <div className="text-center color-blanco">Cédula</div>
                                            <input type="text" className="form-control" id="id_cedula" name="id_cedula" placeholder="Cédula de identidad"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col10 col-sm10 col-md-10 col-lg-10 col-xl-10">
                                        <button className="btn btn-success btn-block btn-lg" onClick={this.enviarDatos}>Enviar</button>
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

export default withRouter(ComponentAsistenciaPublica)