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

export default class ComponenteEstudiante extends React.Component{
    constructor(){
        super();
        this.state = {
            modulo:"",
            estado_menu: false,
            nombre_usuario: null,
            id_reposo_trabajador_interumpir:null,
            listaReposos:[],
            tipoPdf:null,
            fecha_desde_reposo_trabajador_filtro_tabla:"",
            fecha_hasta_reposo_trabajador_filtro_tabla:"",
            msj_fecha_desde_reposo_trabajador:{
                mensaje:"",
                color_texto:""
            },msj_fecha_hasta_reposo_trabajador:{
                mensaje:"",
                color_texto:""
            },
            trabajadores:{},
            reposos:{},
            registros:[],
            numeros_registros:0,
            alerta:{
                color:null,
                mensaje:null,
                estado:false
            },
        }
    }
    render(){
      const jsx_modales = (
        <div class="modal fade" id="modalInterumpirReposo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Interumpir el reposo</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                  <p>
                    Esta seguro que deseaa interumpir este reposo
                  </p>
                </div>
                <div class="modal-footer ">
                    <button type="button" class="btn btn-danger mr-3" onClick={this.cerrarModalInterumpirReposo}>No</button>
                    <button type="button" class="btn btn-success" onClick={this.interumpirReposo}>Si</button>
                </div>
                </div>
            </div>
      </div>


      <div class="modal fade" id="modalAyuda" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Info</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                   <div className="row mb-3">
                       <div className="col-auto">
                        <button class="btn btn-danger mr-3">pdf</button>
                        Este boton activa una modal que te permitira generar reportes en formato pdf
                       </div>
                   </div>
                   <div className="row mb-3">
                       <div className="col-auto">
                            <ButtonIcon clasesBoton="btn btn-danger mr-3"
                            value=""
                            id=""
                            eventoPadre=""
                            icon="icon-cross"
                            />
                            Este boton cambia el estado de entrega del reposo a 'no entregado'
                       </div>
                   </div>
                   <div className="row mb-3">
                       <div className="col-auto">
                            <ButtonIcon clasesBoton="btn btn-success mr-3"
                            value=""
                            id=""
                            eventoPadre=""
                            icon="icon-checkmark"
                            />
                            Este boton cambia el estado de entrega del reposo a 'entregado'
                       </div>
                   </div>
                   <div className="row mb-3">
                       <div className="col-auto">
                            <ButtonIcon clasesBoton="btn btn-warning mr-3"
                            value=""
                            id=""
                            eventoPadre=""
                            icon="icon-pencil"
                            />
                            Este boton te permite editar el reposo del trabajador
                       </div>
                   </div>
                   <div className="row mb-3">
                       <div className="col-auto">
                            <button className="btn btn-danger mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-scissors" viewBox="0 0 16 16" >
                                <path  d="M3.5 3.5c-.614-.884-.074-1.962.858-2.5L8 7.226 11.642 1c.932.538 1.472 1.616.858 2.5L8.81 8.61l1.556 2.661a2.5 2.5 0 1 1-.794.637L8 9.73l-1.572 2.177a2.5 2.5 0 1 1-.794-.637L7.19 8.61 3.5 3.5zm2.5 10a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0zm7 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z"/>
                              </svg>
                            </button>
                            Este boton te permite interumpir el reposo del trabajador
                       </div>
                   </div>
                </div>
                {/* <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-dismiss="modal">No</button>
                    <button type="button" class="btn btn-success" onClick={this.pasarAsistencia}>Si</button>
                </div> */}
                </div>
            </div>
        </div>


    <div class="modal fade" id="modalPdf" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Reporte pdf</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                  <div className="row justify-content-center mb-3">
                    <div className="col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5">
                      <div class="form-groud">
                        <label>Tipo de reporte</label>
                        <select class="form-select custom-select" aria-label="Default select example" onChange={this.mostrarFiltros}>
                          <option value="null" >Seleccione un Tipo de Reporte</option>
                          <option value="1" >Generar una Lista</option>
                          <option value="0" >Generar un Específico</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <form id="formListaEspecifico" class="ocultarFormulario mb-3">
                    <div className="row justify-content-center mb-3">
                        <div className="col-auto">Para seleccionar mas de un elemento mantener Ctrl + click izquierdo del ratón</div>
                    </div>
                        <div className="row justify-content-center">
                        <ComponentFormCampo
                        clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                        clasesCampo="form-control"
                        obligatorio="no"
                        nombreCampo="Cédula del trabajador"
                        activo="si"
                        type="text"
                        value={this.state.id_cedula}
                        name="id_cedula"
                        id="id_cedula"
                        placeholder="cedula"
                        />
                      <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                        <div class="form-groud">
                          <label>Estado Reposo</label>
                          <select class="form-select custom-select" multiple id="estatu_reposo_trabajador" name="array_estatu_reposo_trabajador[]" aria-label="Default se0lec0t example">
                            <option value="1" >Activo</option>
                            <option value="0" >Inactivo</option>
                            <option value="2" >Interumpido</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                        <div class="form-groud">
                          <label>Reposo</label>
                          <select class="form-select custom-select" multiple id="id_reposo" name="array_id_reposo[]" aria-label="Default select example" >
                            <option value="null" >Seleccione</option>
                            {this.state.listaReposos.map((reposo,index) => (<option key={index} value={reposo.id_reposo}  >{reposo.nombre_reposo}</option>))}
                          </select>
                        </div>
                      </div>



                    </div>
                    <div className="row justify-content-center">
                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                        <div class="form-groud">
                          <label>Estado de Entrega</label>
                          <select class="form-select custom-select" multiple id="estado_entrega" name="array_estado_entrega[]" aria-label="Default se0lec0t example">
                            <option value="P" >En espera</option>
                            <option value="E" >Entregado</option>
                            <option value="N" >No entregado</option>
                          </select>
                        </div>
                      </div>
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div class="form-groud">
                            <label>Fecha desdé</label>
                            <input type="date" class="form-control" id="fecha_desde_reposo_trabajador" name="fecha_desde_reposo_trabajador"/>
                            </div>
                        </div>
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div class="form-groud">
                            <label>Fecha hasta</label>
                            <input type="date" class="form-control" id="fecha_hasta_reposo_trabajador" name="fecha_hasta_reposo_trabajador"/>
                            </div>
                        </div>

                    </div>
                  </form>


                  <form id="formLista" class="ocultarFormulario mb-3">
                    <div className="row justify-content-center mb-3">
                        <div className="col-auto">Para seleccionar mas de un elemento mantener Ctrl + click izquierdo del ratón</div>
                    </div>
                  <div className="row justify-content-center">
                      <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                        <div class="form-groud">
                          <label>Estado Reposo</label>
                          <select class="form-select custom-select" multiple id="estatu_reposo_trabajador" name="array_estatu_reposo_trabajador[]" aria-label="Default se0lec0t example">
                            <option value="1" >Activo</option>
                            <option value="0" >Inactivo</option>
                            <option value="2" >Interumpido</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                        <div class="form-groud">
                          <label>Reposo</label>
                          <select class="form-select custom-select" multiple id="id_reposo" name="array_id_reposo[]" aria-label="Default select example" >
                            {this.state.listaReposos.map((reposo,index) => (<option key={index} value={reposo.id_reposo}  >{reposo.nombre_reposo}</option>))}
                          </select>
                        </div>
                      </div>
                      <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                        <div class="form-groud">
                          <label>Estado de Entrega</label>
                          <select class="form-select custom-select" multiple id="estado_entrega" name="array_estado_entrega[]" aria-label="Default se0lec0t example">
                            <option value="P" >En espera</option>
                            <option value="E" >Entregado</option>
                            <option value="N" >No entregado</option>
                          </select>
                        </div>
                      </div>



                    </div>
                    <div className="row justify-content-center">
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div class="form-groud">
                            <label>Fecha desdé</label>
                            <input type="date" class="form-control" id="fecha_desde_reposo_trabajador" name="fecha_desde_reposo_trabajador"/>
                            </div>
                        </div>
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div class="form-groud">
                            <label>Fecha hasta</label>
                            <input type="date" class="form-control" id="fecha_hasta_reposo_trabajador" name="fecha_hasta_reposo_trabajador"/>
                            </div>
                        </div>

                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>

                    </div>

                  </form>
                  <div id="filaVerPdf" className="row justify-content-center ocultarFormulario">
                      <div className="col-auto">
                        <a className="btn btn-success" id="linkPdf" target="_blank" href="#">Ver pdf</a>
                      </div>
                  </div>

                </div>
                <div class="modal-footer ">
                    <button type="button" id="botonGenerarPdf" class="btn btn-success ocultarFormulario" onClick={this.generarPdf}>Generar pdf</button>
                </div>
                </div>
            </div>
      </div>

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
      )
        const jsx_tabla_encabezado = (
            <thead>
                <tr>
                    <th>Cedula Estudiante</th>
                    <th>Nombre Estudiante</th>
                    <th>Apellido Estudiante</th>

                </tr>
            </thead>
        );

        const jsx_tabla_body = (
            <tbody>
            </tbody>
        )
        const component=(
            <div>
                {this.state.alerta.estado===true &&
                    (<div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">

                        <AlertBootstrap colorAlert={this.state.alerta.color} mensaje={this.state.alerta.mensaje}/>

                    </div>)
                }
                {jsx_modales}
                <TituloModulo clasesrow="row" clasesColumna="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center" tituloModulo="Módulo del Estudiante"/>

                <div className="row component-tabla-de-datos">
                    <div className="col-12 col-ms-12 col-md-12 contenedor-tabla-de-datos">
                        <div className="row">
                            <ComponentFormDate
                                clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                                obligatorio="no"
                                mensaje={this.state.msj_fecha_desde_reposo_trabajador}
                                nombreCampoDate="Desdé:"
                                clasesCampo="form-control"
                                value={this.state.fecha_desde_reposo_trabajador_filtro_tabla}
                                name="fecha_desde_reposo_trabajador_filtro_tabla"
                                id="fecha_desde_reposo_trabajador_filtro_tabla"
                                eventoPadre={this.buscarReposos}
                            />
                            <ComponentFormDate
                                clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                                obligatorio="no"
                                mensaje={this.state.msj_fecha_hasta_reposo_trabajador}
                                nombreCampoDate="Hasta:"
                                clasesCampo="form-control"
                                value={this.state.fecha_hasta_reposo_trabajador_filtro_tabla}
                                name="fecha_hasta_reposo_trabajador_filtro_tabla"
                                id="fecha_hasta_reposo_trabajador_filtro_tabla"
                                eventoPadre={this.buscarReposos}
                            />

                        </div>
                        <Tabla
                        tabla_encabezado={jsx_tabla_encabezado}
                        tabla_body={jsx_tabla_body}
                        numeros_registros={this.state.numeros_registros}
                        />

                    </div>

                </div>

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
            <div className="component_reposo_trabajador">
				<ComponentDashboard
                componente={component}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />
			</div>
        )
    }
}
