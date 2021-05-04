import React from 'react';
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import $ from 'jquery'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentTrabajador.css'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes 
import TituloModulo from '../subComponentes/tituloModulo'
import ComponentTablaDatos from '../subComponentes/componentTablaDeDatos'
import ButtonIcon from '../subComponentes/buttonIcon'
import InputButton from '../subComponentes/input_button'
import ComponentFormCampo from '../subComponentes/componentFormCampo';

class ComponentTrabajador extends React.Component{

    constructor(){
        super();
        this.eliminarElementoTabla=this.eliminarElementoTabla.bind(this)
        this.actualizarElementoTabla=this.actualizarElementoTabla.bind(this)
        this.consultarElementoTabla=this.consultarElementoTabla.bind(this)
        this.buscar=this.buscar.bind(this)
        this.escribir_codigo=this.escribir_codigo.bind(this)
        this.redirigirFormulario=this.redirigirFormulario.bind(this)
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.mostrarModalPdf=this.mostrarModalPdf.bind(this);
        this.mostrarFiltros=this.mostrarFiltros.bind(this);
        this.generarPdf=this.generarPdf.bind(this);
        this.state={
            modulo:"",
            estado_menu:false,
            //////
            datoDeBusqueda:"",
            registros:[],

            id_cedula:"",
            nombrePdf:null,
            tipoPdf:null,
            tiposTrabajadores:[],
            funcionesTrabajadores:[],
            numeros_registros:0,
            mensaje:{
              texto:"",
              estado:""
            }
        }
    }

    async UNSAFE_componentWillMount(){
        await this.consultarTodosTiposTrabajador()
        var json_server_response=await this.consultarTodosTrabajadores();
        var servidor=this.verficarLista(json_server_response);
        if(this.props.match.params.mensaje){
          const msj=JSON.parse(this.props.match.params.mensaje)
          //alert("OK "+msj.texto)
          var mensaje=this.state.mensaje
          mensaje.texto=msj.texto
          mensaje.estado=msj.estado
          servidor.mensaje=mensaje
        }
        this.setState(servidor)
      }

      async consultarTodosTrabajadores(){
        var respuesta_servidor=[]
        await axios.get("http://localhost:8080/configuracion/trabajador/consultar-todos")
        .then(respuesta=>{
          respuesta_servidor=respuesta.data.trabajadores
          console.log(respuesta.data)
        })
        .catch(error=>{
          alert("No se pudo conectar con el servidor")
          console.log(error)
        })
        return respuesta_servidor;
    }

    verficarLista(json_server_response){
        if(json_server_response.length===0){
            json_server_response.push({
              id_permiso:"0",
              nombre_permiso:"vacio",
              vacio:"vacio"
            })
            return {registros:json_server_response,numeros_registros:0}
          }
          else{
            return {
              registros:json_server_response,
              numeros_registros:json_server_response.length
            }
          } 
      }
    
    async buscar(a){
        var respuesta_servidor="",
        valor=this.state.datoDeBusqueda
        if(valor!==""){
          await axios.get(`http://localhost:8080/configuracion/trabajador/consultar-patron/${valor}`)
            .then(respuesta=>{
              respuesta_servidor=respuesta.data
              console.log(respuesta_servidor)
              this.setState({registros:respuesta_servidor.trabajadores})
            })
            .catch(error=>{
              console.log(error)
              alert("error en el servidor")
            })
        }
        else{
          alert("Error:la barra de busqueda esta vacia")
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

    redirigirFormulario(a){
        const input = a.target;
        if(input.value==="Registrar"){
          this.props.history.push("/dashboard/configuracion/trabajador/registrar")
        }
    }

    async escribir_codigo(a){
        var input=a.target,
        valor=input.value,
        respuesta_servidor=""
        if(valor!==""){
          await axios.get(`http://localhost:8080/configuracion/trabajador/consultar-patron/${valor}`)
          .then(respuesta=>{
            respuesta_servidor=respuesta.data
            console.log(respuesta_servidor)
            this.setState({datoDeBusqueda:valor,registros:respuesta_servidor.trabajadores,numeros_registros:respuesta_servidor.trabajadores.length})
          })
          .catch(error=>{
            console.log(error)
            alert("error en el servidor")
          })
        }
        else{
          // console.log("no se puedo realizar la busqueda por que intento realizarla con el campo vacio")
          var json_server_response=await this.consultarTodosTrabajadores();
          var servidor=this.verficarLista(json_server_response);
          this.setState(servidor)
        }
    }

    eliminarElementoTabla(a){
        var input=a.target;
        alert("Eliminar -> "+input.id);
    }
    
    actualizarElementoTabla(a){
        var input=a.target;
        this.props.history.push("/dashboard/configuracion/trabajador/actualizar/"+input.id);
    }
    
    consultarElementoTabla(a){
        let input=a.target;
        //alert("Consultar -> "+input.id);
        this.props.history.push("/dashboard/configuracion/trabajador/consultar/"+input.id);
    }

    /**
     * {!trabajador.vacio &&
                            <td>
                              <ButtonIcon clasesBoton="btn btn-danger btn-block" 
                              value={trabajador.id_cedula} 
                              id={trabajador.id_cedula}
                              eventoPadre={this.eliminarElementoTabla} 
                              icon="icon-bin"
                              />
                            </td>
                          }
    */

    async consultarTodosTiposTrabajador(){
      await axios.get("http://localhost:8080/configuracion/tipo-trabajador/consultar-tipos-trabajador")
      .then(respuesta => {
        let json=JSON.parse(JSON.stringify(respuesta.data))
        console.log("datos => ",json)
        this.setState({tiposTrabajadores:json.tipos_trabajador})
      })
      .catch(error => {
        alert("error al conectar con el servidor")
      })
    }

    mostrarModalPdf(){
      // alert("hola")
      $("#exampleModal").modal("show")
    }

    mostrarFiltros(a){
      let $select=a.target
      let $filaVerPdf=document.getElementById("filaVerPdf")
      $filaVerPdf.classList.add("ocultarFormulario")
      // alert($select.value)
      let $botonGenerarPdf=document.getElementById("botonGenerarPdf")
      let $fromFiltroCedula=document.getElementById("fromFiltroCedula")
      let $fromListar=document.getElementById("fromListar")
      if($select.value==="0"){
        $fromListar.classList.add("ocultarFormulario")
        $fromFiltroCedula.classList.remove("ocultarFormulario")
        $botonGenerarPdf.classList.remove("ocultarFormulario")
        this.setState({tipoPdf:"0"})
      }
      else if($select.value==="1"){
        this.setState({tipoPdf:"1"})
        $fromListar.classList.remove("ocultarFormulario")
        $botonGenerarPdf.classList.remove("ocultarFormulario")
        $fromFiltroCedula.classList.add("ocultarFormulario")
      }
      else{
        this.setState({tipoPdf:null})
        $fromListar.classList.add("ocultarFormulario")
        $fromFiltroCedula.classList.add("ocultarFormulario")
        $botonGenerarPdf.classList.add("ocultarFormulario")
      }
    }
    generarPdf(){
      let $filaVerPdf=document.getElementById("filaVerPdf")
      $filaVerPdf.classList.remove("ocultarFormulario") //esta line sirve para mostrar el boton para ver el pdf => usar en success
      // $filaVerPdf.classList.add("ocultarFormulario") //esta line sirve para ocultar el boton para ver el pdf => usar en error
      let datos=null
      if(this.state.tipoPdf==="0"){
        datos=$("#fromFiltroCedula").serializeArray()
      }
      else if(this.state.tipoPdf==="1"){
        datos=$("#fromListar").serializeArray()
      }

      console.log(datos)

      if(datos!==null){
        alert("generar pdf")
        // $.ajax({
        //   url: 'ruta',
        //   type:"post",
        //   data:[],
        //   success: function(respuesta) {
        //     alert("OK")
        //   },
        //   error: function() {
        //     alert("error")
        //   }
        // });
      }
      

    }

    cambiarEstado(a){
      var input=a.target;
      this.setState({[input.name]:input.value})
  }

    render(){
        const jsx_tabla_encabezado=(
            <thead> 
                  <tr> 
                    <th>Cédula</th> 
                    <th>Nombre trabajador</th>
                  </tr> 
              </thead>
          )
          const jsx_tabla_body=(
            <tbody>
                  {this.state.registros.map((trabajador)=>{
                      return(
                          <tr key={trabajador.id_cedula}>
                            <td>{trabajador.id_cedula}</td>
                            <td>{trabajador.nombres+" "+trabajador.apellidos}</td>
                           {!trabajador.vacio &&
                              <td>
                                  <ButtonIcon 
                                  clasesBoton="btn btn-warning btn-block" 
                                  value={trabajador.id_cedula} 
                                  id={trabajador.id_cedula}
                                  eventoPadre={this.actualizarElementoTabla} 
                                  icon="icon-pencil"
                                  />
                              </td>
                           }
                          
                         {!trabajador.vacio &&
                          <td>
                              <ButtonIcon 
                              clasesBoton="btn btn-secondary btn-block" 
                              value={trabajador.id_cedula}
                              id={trabajador.id_cedula} 
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
        
        var jsx_trabajador_inicio=(
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
                <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                      <option value="null" >seleccione un tipo de reporte</option>
                                      <option value="1" >generar una lista</option>
                                      <option value="0" >generar un especifico</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <form id="fromFiltroCedula" class="ocultarFormulario">
                                <div className="row justify-content-center">
                                  <ComponentFormCampo
                                  clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                                  clasesCampo="form-control"
                                  obligatorio="no"
                                  nombreCampo="Cedula del trabajador"
                                  activo="si"
                                  type="text"
                                  value={this.state.id_cedula}
                                  name="id_cedula"
                                  id="id_cedula"
                                  placeholder="cedula"
                                  eventoPadre={this.cambiarEstado}
                                  />
                                </div>
                              </form>
                              <form id="fromListar" class="ocultarFormulario mb-3">
                                <div className="row justify-content-center">
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Tipo de trabajador</label>
                                      <select class="form-select custom-select" id="id_tipo_trabajador" name="id_tipo_trabajador" aria-label="Default select example" onChange={this.mostrarFiltros}>
                                        <option value="null" >seleccione</option>
                                        {this.state.tiposTrabajadores.map((tipoTrabajador,index) => (<option key={"tipo-trabajador"+index} value={tipoTrabajador.id_tipo_trabajador}  >{tipoTrabajador.descripcion_tipo_trabajador}</option>))}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Funcion del trabajador</label>
                                      <select class="form-select custom-select" id="id_funcion_trabajador" name="id_funcion_trabajador" aria-label="Default select example" onChange={this.mostrarFiltros}>
                                        <option value="1" >Masculino</option>
                                        <option value="0" >Femenino</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Sexo</label>
                                      <select class="form-select custom-select" id="sexo" name="sexo" aria-label="Default select example" onChange={this.mostrarFiltros}>
                                        <option value="1" >Masculino</option>
                                        <option value="0" >Femenino</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                <div className="row justify-content-center">
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Designación</label>
                                      <select class="form-select custom-select" id="designacion" name="designacion" aria-label="Default select example" onChange={this.mostrarFiltros}>
                                        <option value="1" >Interno</option>
                                        <option value="0" >Externo</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Estatus</label>
                                      <select class="form-select custom-select" id="estatu_trabajador" name="estatu_trabajador" aria-label="Default select example" onChange={this.mostrarFiltros}>
                                        <option value="1" >Activo</option>
                                        <option value="0" >Inactivo</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>

                                </div>
                              </form>
                              <div id="filaVerPdf" className="row justify-content-center ocultarFormulario">
                                  <div className="col-auto">
                                    <a className="btn btn-success" target="_blank" href="http://localhost:8080/reporte/test.pdf">Ver pdf</a>
                                  </div>
                              </div>
                              
                            </div>
                            <div class="modal-footer ">
                                <button type="button" id="botonGenerarPdf" class="btn btn-success ocultarFormulario" onClick={this.generarPdf}>Generar pdf</button>
                            </div>
                            </div>
                        </div>
                  </div>
                <TituloModulo clasesrow="row" clasesColumna="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center" tituloModulo="Modulo Trabajador"/>
                <ComponentTablaDatos 
                    eventoBuscar={this.buscar}
                    eventoEscribirCodigo={this.escribir_codigo}
                    tabla_encabezado={jsx_tabla_encabezado}
                    tabla_body={jsx_tabla_body}
                    numeros_registros={this.state.numeros_registros}
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
                componente={jsx_trabajador_inicio}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />
            </div>
        )
    }
}

export default withRouter(ComponentTrabajador)