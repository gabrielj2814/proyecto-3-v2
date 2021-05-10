import React from 'react'
import {withRouter} from "react-router-dom"

//JS
import axios from 'axios'
import $ from 'jquery'
import Moment from 'moment'
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
        this.mostarModalCambiarContraseña=this.mostarModalCambiarContraseña.bind(this)
        this.state={
            modulo:"",// modulo menu
            estado_menu:false,
            // -------------
            id_cedula:null,
            nombres:null,
            apellidos:null,
            telefono_movil:null,
            telefono_local:null,
            correo:null,
            grado_instruccion:null,
            titulo_grado_instruccion:null,
            fecha_nacimiento:null,
            fecha_ingreso:null,
            direccion:null,
            id_perfil:null,
            id_tipo_trabajador:null,
            id_funcion_trabajador:null,
            estatu_trabajador:null,
            sexo_trabajador:null,
            designacion:null,
            id_tipo_trabajador:null ,
            descripcion_tipo_trabajador:null ,
            estatu_tipo_trabajador:null,
            id_funcion_trabajador:null ,
            funcion_descripcion:null ,
            id_tipo_trabajador:null,
            estatu_funcion_trabajador:null,
            id_horario:null,
            id_perfil:null,
            nombre_perfil:null,
            estatu_perfil:null,

        }
    }

    async UNSAFE_componentWillMount(){
        await this.consultarDatosDeLaSesion()
    }

    async consultarDatosDeLaSesion(){
        var respuesta_servior=""
        const token=localStorage.getItem("usuario")
        await axios.get(`http://localhost:8080/login/verificar-sesion${token}`)
        .then(async respuesta=>{
            respuesta_servior=respuesta.data
            if(respuesta_servior.usuario){
                await this.consultarTrabajador(respuesta_servior.usuario.id_cedula)
            }  
        })
    }

    async consultarTrabajador(id){
        var respuesta_servidor=""
        const token=localStorage.getItem('usuario')
        await axios.get(`http://localhost:8080/configuracion/trabajador/consultar/${id}/${token}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            console.log(respuesta_servidor)
            if(respuesta_servidor.estado_peticion==="200"){
                this.setState(respuesta_servidor.trabajador)
            }
           else if(respuesta_servidor.estado_peticion==="404"){
                alert("no se a encontrador a este trabajador")
           }
        })
        .catch(error=>{
            alert("error al conectar con el servidor")
        })
    }


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

    /*
    <div className="col-auto">
                                <button class="btn btn-info">Ver el historial de mis permisos</button>
                            </div>
                            <div className="col-auto">
                                <button class="btn btn-info">Ver el historial de mis reposos</button>
                            </div>




                            plantilla modal
                            <div class="modal fade" id="modalCambiarContaseña" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-lg" role="document">
                                    <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">Cambiar contraseña</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                    
                                    
                                    </div>
                                    <div class="modal-footer ">
                                        <button type="button" id="botonGenerarPdf" class="btn btn-success ocultarFormulario" onClick={this.generarPdf}>Generar pdf</button>
                                    </div>
                                    </div>
                                </div>
                        </div>
    */

    mostarModalCambiarContraseña(){
        $("#modalCambiarContaseña").modal("show")
    }

    render(){
        const vista=(
            <div className="row justify-content-center">

                
                <div class="modal fade" id="modalCambiarContaseña" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg" role="document">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Cambiar contraseña</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                             
                              
                            </div>
                            <div class="modal-footer ">
                                <button type="button" id="botonGenerarPdf" class="btn btn-success ocultarFormulario" onClick={this.generarPdf}>Generar pdf</button>
                            </div>
                            </div>
                        </div>
                  </div>

                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_perfil">
                    <div className="row justify-content-center contenedor-titulo-form-perfil">
                        <div className="col-auto ">
                            <h1 className="titulo-form-perfil">Perfil</h1>
                        </div>
                    </div>
                    <div className="row justify-content-center mb-2">
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Cedula</label>
                                <input type="text" class="form-control" disabled value={this.state.id_cedula}/>
                            </div>
                        </div>
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Nombres</label>
                                <input type="text" class="form-control" disabled value={this.state.nombres}/>
                            </div>
                        </div>
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Apellidos</label>
                                <input type="text" class="form-control" disabled value={this.state.apellidos}/>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center mb-2">
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Fecha de nacimiento</label>
                                <input type="text" class="form-control" disabled value={Moment(this.state.fecha_nacimiento,"YYYY-MM-DD").format("DD-MM-YYYY")}/>
                            </div>
                        </div>
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Edad</label>
                                <input type="text" class="form-control" disabled value={Moment().diff(Moment(this.state.fecha_nacimiento,"YYYY-MM-DD"),"years")}/>
                            </div>
                        </div>
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Telefono movil</label>
                                <input type="text" class="form-control" disabled value={this.state.telefono_movil}/>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center mb-2">
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Telefono local</label>
                                <input type="text" class="form-control" disabled value={this.state.telefono_local}/>
                            </div>
                        </div>
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Correo</label>
                                <input type="text" class="form-control" disabled value={this.state.correo}/>
                            </div>
                        </div>
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Sexo</label>
                                <input type="text" class="form-control" disabled value={(this.state.sexo_trabajador==="1")?"Masculino":"Femenino"}/>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center mb-2">
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Grado instrucción</label>
                                <input type="text" class="form-control" disabled value={this.state.grado_instruccion}/>
                            </div>
                        </div>
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Titulo</label>
                                <input type="text" class="form-control" disabled value={this.state.titulo_grado_instruccion}/>
                            </div>
                        </div>
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
                    </div>
                    <div className="row justify-content-center mb-2">
                        <div className="col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9">
                            <div className="form-groud">
                                <label>Dirección</label>
                                <textarea className="textArea form-control" disabled value={this.state.direccion} rows="5"></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center mb-2">
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Tipo de Perfil</label>
                                <input type="text" class="form-control" disabled value={this.state.nombre_perfil}/>
                            </div>
                        </div>
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Tipo del trabajador</label>
                                <input type="text" class="form-control" disabled value={this.state.descripcion_tipo_trabajador}/>
                            </div>
                        </div>
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Función del trabajador</label>
                                <input type="text" class="form-control" disabled value={this.state.funcion_descripcion}/>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center mb-5">
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Designación</label>
                                <input type="text" class="form-control" disabled value={(this.state.designacion==="1")?"Interno":"Externo"}/>
                            </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6"></div>
                    </div>
                    <div className="row justify-content-center mb-2">
                        
                        <div className="col-auto">
                            <button class="btn btn-warning" onClick={this.mostarModalCambiarContraseña}>Cambiar mi contraseña</button>
                        </div>
                    </div>







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