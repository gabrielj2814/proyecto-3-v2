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

class ComponentDirector extends React.Component{
    constructor(){
        super();
        this.mostrarModulo = this.mostrarModulo.bind(this)
        this.actualizarElementoTabla = this.actualizarElementoTabla.bind(this)
        this.verficarLista = this.verficarLista.bind(this)
        this.consultarTodosLosDirectores = this.consultarTodosLosDirectores.bind(this)
        this.redirigirFormulario = this.redirigirFormulario.bind(this)
        this.validarAccesoDelModulo = this.validarAccesoDelModulo.bind(this)
        this.consultarPerfilTrabajador = this.consultarPerfilTrabajador.bind(this)
        this.buscar = this.buscar.bind(this)
        this.escribir_codigo = this.escribir_codigo.bind(this)
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

    actualizarElementoTabla(a){
        var input=a.target;
        this.props.history.push("/dashboard/configuracion/director/actualizar/"+input.id);
    }

    async consultarTodosLosDirectores(){
      return await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/director/consultar-todos`)
      .then(repuesta =>{
        return repuesta.data.datos
      })
      .catch(error => console.log(error) )
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

    async UNSAFE_componentWillMount(){
      let acessoModulo =await this.validarAccesoDelModulo("/dashboard/configuracion","/director")
      if(acessoModulo){
          var json_server_response=await this.consultarTodosLosDirectores();
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
       else{
        alert("No tienes acesso a este modulo(sera redirigido a la vista anterior)")
        this.props.history.goBack()
       }
      }

      async validarAccesoDelModulo(modulo,subModulo){
          // /dashboard/configuracion/acceso
          let estado = false
            if(localStorage.getItem("usuario")){
              var respuesta_servior=""
              const token=localStorage.getItem("usuario")
              await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/login/verificar-sesion${token}`)
              .then(async respuesta=>{
                  respuesta_servior=respuesta.data
                  if(respuesta_servior.usuario){
                    estado=await this.consultarPerfilTrabajador(modulo,subModulo,respuesta_servior.usuario.id_perfil)
                  }
              })
          }
          return estado
        }

        async buscar(a){
          var respuesta_servidor="",
          valor=this.state.datoDeBusqueda
          if(valor!==""){
            await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/director/consultar-patron/${valor}`)
              .then(respuesta=>{
                respuesta_servidor=respuesta.data
                this.setState({registros:respuesta_servidor.datos})
              })
              .catch(error=>{
                console.log(error)
                alert("Error en el servidor")
              })
          }else{
            alert("Error:la barra de busqueda esta vacia")
          }
        }
        async escribir_codigo(a){
          var input=a.target,
          valor=input.value,
          respuesta_servidor=""
          if(valor!==""){
            await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/director/consultar-patron/${valor}`)
            .then(respuesta=>{
              respuesta_servidor=respuesta.data
              this.setState({datoDeBusqueda:valor,registros:respuesta_servidor.datos,numeros_registros:respuesta_servidor.datos.length})
            })
            .catch(error=>{
              console.log(error)
              alert("Error en el servidor")
            })
          }else{
            // console.log("no se puedo realizar la busqueda por que intento realizarla con el campo vacio")
            var json_server_response=await this.consultarTodosLosDirectores();
            var servidor_res=this.verficarLista(json_server_response);
            this.setState(servidor_res)
          }
        }

        async consultarPerfilTrabajador(modulo,subModulo,idPerfil){
          let estado=false
          await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/acceso/consultar/${idPerfil}`)
          .then(repuesta => {
              let json=JSON.parse(JSON.stringify(repuesta.data))
              // console.log("datos modulos =>>>",json)
              let modulosSistema={}
              let modulosActivos=json.modulos.filter( modulo => {
                  if(modulo.estatu_modulo==="1"){
                      return modulo
                  }
              })
              // console.log("datos modulos =>>>",modulosActivos);
              for(let medulo of modulosActivos){
                  if(modulosSistema[medulo.modulo_principal]){
                      modulosSistema[medulo.modulo_principal][medulo.sub_modulo]=true
                  }
                  else{
                      modulosSistema[medulo.modulo_principal]={}
                      modulosSistema[medulo.modulo_principal][medulo.sub_modulo]=true
                  }
              }
              if(modulosSistema[modulo][subModulo]){
                estado=true
              }
              // this.setState({modulosSistema})
          })
          .catch(error =>  {
              console.log(error)
          })
          return estado
      }

    redirigirFormulario(a){
      const input = a.target;
      if(input.value==="Registrar"){
        this.props.history.push("/dashboard/configuracion/director/registrar")
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
                    <th>Cédula</th>
                    <th>Nombre y Apellido</th>
                    <th>Estado</th>
                </tr>
            </thead>
        );

        const jsx_tabla_body=(
          <tbody>
                {this.state.registros.map((director)=>{

                  if(!director.vacio){
                    return(
                      <tr key={director.id_cedula}>
                        <td>{director.id_cedula}</td>
                        <td>{director.nombres} {director.apellidos}</td>
                        <td>{ (director.estatus_director === "1" ? "Activo" : "Inactivo")}</td>
                        {!director.vacio &&
                          <td>
                            <ButtonIcon
                              clasesBoton="btn btn-warning btn-block"
                              value={director.id_director}
                              id={director.id_director}
                              eventoPadre={this.actualizarElementoTabla}
                              icon="icon-pencil"
                              />
                          </td>
                        }
                      </tr>
                    )
                  }
                })}
            </tbody>
        )

      var jsx_director_inicio=(
          <div>
              {this.state.mensaje.texto!=="" && (this.state.mensaje.estado==="500" || this.state.mensaje.estado==="404") &&
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div className="alert alert-danger alert-dismissible ">
                      <p className='font-weight-bold'>Mensaje del Error: {this.state.mensaje.texto}</p>
                      {/* <p>Estado del Error: {this.state.mensaje.estado}</p> */}
                      <button className="close" data-dismiss="alert">
                          <span>X</span>
                      </button>
                    </div>
                </div>
              </div>
              }
              <TituloModulo clasesrow="row" clasesColumna="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center" tituloModulo="Módulo Director"/>
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
              </div>
          </div>
      )

      return(
          <div className="component_trabajador_inicio">
              <ComponentDashboard
              componente={jsx_director_inicio}
              modulo={this.state.modulo}
              eventoPadreMenu={this.mostrarModulo}
              estado_menu={this.state.estado_menu}
              />
          </div>
      )
    }
}

export default withRouter(ComponentDirector)
