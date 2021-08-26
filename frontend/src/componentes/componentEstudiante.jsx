import React from 'react'
import {withRouter} from "react-router-dom"

//JS
import axios from 'axios'
import Moment from 'moment'
import $ from 'jquery'
// IP servidor
import servidor from '../ipServer.js'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import "../css/componentReposoTrabajador.css"
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'
import ButtonIcon from '../subComponentes/buttonIcon'
import ComponentFormSelect from "../subComponentes/componentFormSelect"
import AlertBootstrap from "../subComponentes/alertBootstrap"
import ComponentFormDate from '../subComponentes/componentFormDate'
// --
import TituloModulo from '../subComponentes/tituloModulo'
import Tabla from '../subComponentes/componentTabla'
import ComponentFormCampo from '../subComponentes/componentFormCampo';

import ComponentTablaDatos from '../subComponentes/componentTablaDeDatos'

class ComponenteEstudiante extends React.Component{
    constructor(){
        super();
        this.redirigirFormulario = this.redirigirFormulario.bind(this)
        this.state = {
          modulo:"",
          estado_menu:false,
          //////
          nombre_usuario:null,
          datoDeBusqueda:"",
          registros:[],
          id_cedula:"",
          nombrePdf:null,
          tipoPdf:null,
          numeros_registros:0,
          mensaje:{
            texto:"",
            estado:""
          }
        }
    }
    // async UNSAFE_componentWillMount(){
    //   // let acessoModulo=await this.validarAccesoDelModulo("/dashboard/configuracion","/trabajador")
    //   let acessoModulo = true;
    //   if(acessoModulo){
    //       await this.consultarTodosTiposTrabajador()
    //       var json_server_response=await this.consultarTodosTrabajadores();
    //       var servidor=this.verficarLista(json_server_response);
    //       if(this.props.match.params.mensaje){
    //         const msj=JSON.parse(this.props.match.params.mensaje)
    //         //alert("OK "+msj.texto)
    //         var mensaje=this.state.mensaje
    //         mensaje.texto=msj.texto
    //         mensaje.estado=msj.estado
    //         servidor.mensaje=mensaje
    //       }
    //       this.setState(servidor)
    //    }
    //    else{
    //     alert("no tienes acesso a este modulo(sera redirigido a la vista anterior)")
    //     this.props.history.goBack()
    //    }
    //   }
    redirigirFormulario(a){
      const input = a.target;
      if(input.value==="Registrar"){
        this.props.history.push("/dashboard/configuracion/estudiante/registrar")
      }
    }
    render(){
      const jsx_modales = (
      <>
        <div className="row justify-content-end  mb-3">
            <div className="col-auto">
                <button class="btn btn-info"  data-toggle="modal" onClick={this.mostrarModalAyuda}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                </button>
            </div>
        </div>
      </>
      )
      const jsx_tabla_encabezado = (
            <thead>
                <tr>
                    <th>Cedula</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Fecha de Nacimiento</th>
                    <th>Sexo</th>
                </tr>
            </thead>
        );

        const jsx_tabla_body=(
          <tbody>
                {this.state.registros.map((estudiante)=>{
                    return(
                        <tr key={estudiante.id_cedula}>
                          <td>{estudiante.id_cedula}</td>
                          <td>{estudiante.nombres+" "+estudiante.apellidos}</td>
                         {!estudiante.vacio &&
                            <td>
                                <ButtonIcon
                                clasesBoton="btn btn-warning btn-block"
                                value={estudiante.id_cedula}
                                id={estudiante.id_cedula}
                                eventoPadre={this.actualizarElementoTabla}
                                icon="icon-pencil"
                                />
                            </td>
                         }

                       {!estudiante.vacio &&
                        <td>
                            <ButtonIcon
                            clasesBoton="btn btn-secondary btn-block"
                            value={estudiante.id_cedula}
                            id={estudiante.id_cedula}
                            eventoPadre={this.consultarElementoTabla}
                            icon="icon-search"
                            />
                        </td>
                       }
                    </tr>
                    )
                })}
            </tbody>
        )

      var jsx_estudiante_inicio=(
          <div>
              {this.state.mensaje.texto!=="" && (this.state.mensaje.estado==="500" || this.state.mensaje.estado==="404") &&
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div className="alert alert-danger alert-dismissible ">
                      <p>Mensaje del Error: {this.state.mensaje.texto}</p>
                      <p>Estado del Error: {this.state.mensaje.estado}</p>
                      <button className="close" data-dismiss="alert">
                          <span>X</span>
                      </button>
                    </div>
                </div>
              </div>
              }
              <TituloModulo clasesrow="row" clasesColumna="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center" tituloModulo="Módulo Estudiante"/>
              <ComponentTablaDatos eventoBuscar={this.buscar} eventoEscribirCodigo={this.escribir_codigo}
                  tabla_encabezado={jsx_tabla_encabezado} tabla_body={jsx_tabla_body} numeros_registros={this.state.numeros_registros}
              />
              <div className="row justify-content-between">
                <div className="col-3 col-ms-3 col-md-3 columna-boton">
                    <div className="row justify-content-center align-items-center contenedor-boton">
                      <div className="col-auto">
                        <InputButton clasesBoton="btn btn-primary" eventoPadre={this.redirigirFormulario} value="Registrar"/>
                      </div>
                    </div>
                  </div>
                  <div className="col-3 col-ms-3 col-md-3 columna-boton">
                    <div className="row justify-content-center align-items-center contenedor-boton">
                      <div className="col-auto">
                        <InputButton clasesBoton="btn btn-danger" eventoPadre={this.mostrarModalPdf} value="pdf"/>
                      </div>
                    </div>
                  </div>
              </div>
          </div>
      )

      return(
          <div className="component_trabajador_inicio">
              <ComponentDashboard
              componente={jsx_estudiante_inicio}
              modulo={this.state.modulo}
              eventoPadreMenu={this.mostrarModulo}
              estado_menu={this.state.estado_menu}
              />
          </div>
      )
    }
}

export default withRouter(ComponenteEstudiante)
