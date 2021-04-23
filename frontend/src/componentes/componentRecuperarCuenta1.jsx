import React from 'react';
import {withRouter} from 'react-router-dom'
//JS
import axios from 'axios'
// css
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
import '../css/componentRecuperarCuenta.css';
//SubComponent
import CintilloComponent from '../subComponentes/cintilloComponent';
import ComponentFormCampo from '../subComponentes/componentFormCampo';
import LinkButton from '../subComponentes/link_button';
import InputButton from '../subComponentes/input_button'

class ComponentRecuperarCuenta extends React.Component{

    constructor(){
        super();
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.irAlHomePage=this.irAlHomePage.bind(this)
        this.irAlHomePage2=this.irAlHomePage2.bind(this)
        this.state={
            id_cedula:"",
            clave_trabajador:"",
            mensaje:{
                texto:"",
                estado:""
              },
        }
    }

    async UNSAFE_componentWillMount(){
        var servidor={}
        if(this.props.match.params.mensaje){
          const msj=JSON.parse(this.props.match.params.mensaje)
          var mensaje=this.state.mensaje
          mensaje.texto=msj.texto
          mensaje.estado=msj.estado
          servidor.mensaje=mensaje
          this.setState(servidor)
        }
      }

    cambiarEstadoInput(input){
        this.setState({[input.name]:input.value});
    }

    cambiarEstado(a){
        const input=a.target;
        this.setState({[input.name]:input.value})
    }

    validarCedulaUsuario(){
        var estado=false
        if(this.state.id_cedula!==""){
            if(this.state.id_cedula.length===8){
                estado=true
            }
            else{
                alert("el codigo del usuario no cumple con los caracteres minimos "+this.state.id_cedula.length+"/8")
            }
        }
        else{
            alert("el codigo del usuario no puede estar vacio")
        }
        return estado
    }


    irAlHomePage(){
        this.props.history.push("/login")
    }

    irAlHomePage2(){
        this.props.history.push("/recuperar-cuenta1")
    }

    render(){
        return(
            <div className="containter-fluid component_recuperar">
            <CintilloComponent/>
                <div className="contenedor-icon-row-left-login" onClick={this.irAlHomePage}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-circle icon-row-left-login" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                    </svg>
                </div>
                <div className="row align-items-center justify-content-center fila_recuperar">
                    <div className="col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5 contenedor_recuperar">
                        <form id="form_recuperar">
                            <div className="row">
                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 titulo_formulario">
                                    Recuperar Cuenta
                                </div>
                            </div>
                            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                                {this.state.mensaje.texto!=="" && (this.state.mensaje.estado==="200" || this.state.mensaje.estado==="404" || this.state.mensaje.estado==="401" || this.state.mensaje.estado==="500") &&
                                    <div className="row">
                                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                            <div className={`alert alert-${(this.state.mensaje.estado==="200" || this.state.mensaje.estado==="401")?"success":"danger"} alert-dismissible`} >
                                                <p>Mensaje: {this.state.mensaje.texto}</p>
                                                <button className="close" data-dismiss="alert">
                                                    <span>X</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="row justify-content-center margen_bottom_10 ">
                                <ComponentFormCampo
                                clasesColumna="col-7 col-sm-7 col-md-7 col-lg-7 col-xl-7 text-center"
                                nombreCampo="Usuario"
                                activo="si"
                                clasesCampo="form-control"
                                type="text"
                                value={this.state.id_cedula}
                                name="id_cedula"
                                id="id_cedula"
                                placeholder="Cédula Trabajador"
                                eventoPadre={this.validarCedulaUsuario}
                                />
                            </div>
                            
                            <div className="row row justify-content-center margen_bottom_10">    
                                <div className="col-auto">
                                    <InputButton 
                                    clasesBoton="btn btn-success"
                                    id="boton-recuperar"
                                    value="Recuperar"
                                    eventoPadre={this.irAlHomePage2}
                                    />   
                                </div>
                            </div>
                            
                        </form>
                    </div>
                </div>
            </div>
        )
    }

}

export default withRouter(ComponentRecuperarCuenta);