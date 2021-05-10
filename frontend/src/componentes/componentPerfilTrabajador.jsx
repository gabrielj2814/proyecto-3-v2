import React from 'react'
import {withRouter} from "react-router-dom"

//JS
import axios from 'axios'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import "../css/componentPerfilTrabajador.css"
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import AlertBootstrap from "../subComponentes/alertBootstrap"

class ComponentPerfilTrabajador extends React.Component{


    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this)
        this.state={
            modulo:"",// modulo menu
            estado_menu:false,
            // -------------

        }
    }

    // async UNSAFE_componentWillMount(){

    // }

    mostrarModulo(a){// esta funcion tiene la logica del menu no tocar si no quieres que el menu no te responda como es devido
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
        const vista=(
            <div className="row justify-content-center">

                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_perfil">
                    <div className="row justify-content-center contenedor-titulo-form-perfil">
                        <div className="col-auto ">
                            <h1 className="titulo-form-perfil">Perfil</h1>
                        </div>
                    </div>
                    <form id="formularioPerfil">
                        <div className="row justify-content-center mb-2">
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="form-groud">
                                    <label>Cedula</label>
                                    <input type="text" id="" name="" class="form-control" disabled value=""/>
                                </div>
                            </div>
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="form-groud">
                                    <label>Nombres</label>
                                    <input type="text" id="" name="" class="form-control" disabled value=""/>
                                </div>
                            </div>
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="form-groud">
                                    <label>Apellidos</label>
                                    <input type="text" id="" name="" class="form-control" disabled value=""/>
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center mb-2">
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="form-groud">
                                    <label>Fecha de nacimiento</label>
                                    <input type="text" id="" name="" class="form-control" disabled value=""/>
                                </div>
                            </div>
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="form-groud">
                                    <label>Edad</label>
                                    <input type="text" id="" name="" class="form-control" disabled value=""/>
                                </div>
                            </div>
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="form-groud">
                                    <label>Telefono movil</label>
                                    <input type="text" id="" name="" class="form-control" disabled value=""/>
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center mb-2">
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="form-groud">
                                    <label>Telefono local</label>
                                    <input type="text" id="" name="" class="form-control" disabled value=""/>
                                </div>
                            </div>
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="form-groud">
                                    <label>Correo</label>
                                    <input type="text" id="" name="" class="form-control" disabled value=""/>
                                </div>
                            </div>
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="form-groud">
                                    <label>Sexo</label>
                                    <input type="text" id="" name="" class="form-control" disabled value=""/>
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center mb-2">
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="form-groud">
                                    <label>Grado instrucción</label>
                                    <input type="text" id="" name="" class="form-control" disabled value=""/>
                                </div>
                            </div>
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="form-groud">
                                    <label>Titulo</label>
                                    <input type="text" id="" name="" class="form-control" disabled value=""/>
                                </div>
                            </div>
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
                        </div>
                        <div className="row justify-content-center mb-2">
                            <div className="col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9">
                                <div className="form-groud">
                                    <label>Dirección</label>
                                    <textarea className="textArea form-control" id="" name="" disabled value="" rows="5"></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center mb-2">
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="form-groud">
                                    <label>Tipo de Perfil</label>
                                    <input type="text" id="" name="" class="form-control" disabled value=""/>
                                </div>
                            </div>
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="form-groud">
                                    <label>Tipo del trabajador</label>
                                    <input type="text" id="" name="" class="form-control" disabled value=""/>
                                </div>
                            </div>
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="form-groud">
                                    <label>Función del trabajador</label>
                                    <input type="text" id="" name="" class="form-control" disabled value=""/>
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center mb-5">
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="form-groud">
                                    <label>Designación</label>
                                    <input type="text" id="" name="" class="form-control" disabled value=""/>
                                </div>
                            </div>
                            <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6"></div>
                        </div>
                        <div className="row justify-content-center mb-2">
                            <div className="col-auto">
                                <button class="btn btn-info">Ver el historial de mis permisos</button>
                            </div>
                            <div className="col-auto">
                                <button class="btn btn-info">Ver el historial de mis reposos</button>
                            </div>
                            <div className="col-auto">
                                <button class="btn btn-warning">Cambiar mi contraseña</button>
                            </div>
                        </div>



                    </form>







                </div>
 

            </div>
        )


        return(
            <div className="component_perfil_formulario ">
				<ComponentDashboard
                componente={vista}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />
			</div>
        )
    }

}

export default withRouter(ComponentPerfilTrabajador)