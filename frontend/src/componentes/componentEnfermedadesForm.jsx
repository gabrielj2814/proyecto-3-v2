import React from 'react';
import {withRouter} from 'react-router-dom'
import $ from "jquery"
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentTrabajadorForm.css'
//JS
import axios from 'axios'
import Moment from 'moment'
// IP servidor
import servidor from '../ipServer.js'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'
import ButtonIcon from '../subComponentes/buttonIcon'
import ComponentFormCampo from '../subComponentes/componentFormCampo';
import ComponentFormRadioState from '../subComponentes/componentFormRadioState';
import ComponentFormSelect from '../subComponentes/componentFormSelect';
import ComponentFormDate from '../subComponentes/componentFormDate'
import ComponentFormTextArea from '../subComponentes/componentFormTextArea'
import { Alert } from 'bootstrap';
import AlertBootstrap from "../subComponentes/alertBootstrap"

class ComponentEnfermedadesForm extends React.Component{
  constructor(){
    super();
    this.mostrarModulo = this.mostrarModulo.bind(this);
    this.regresar=this.regresar.bind(this);
    this.operacion=this.operacion.bind(this);
    this.agregar=this.agregar.bind(this);
    this.validarFormularioRegistrar=this.validarFormularioRegistrar.bind(this);
    this.enviarDatos=this.enviarDatos.bind(this);
    this.consultarPerfilTrabajador=this.consultarPerfilTrabajador.bind(this);
    this.ConsultarRegistro = this.ConsultarRegistro.bind(this);
    this.validarcampo = this.validarcampo.bind(this);
    this.validarTexto = this.validarTexto.bind(this);
    this.cambiarEstado = this.cambiarEstado.bind(this);
    this.state = {
      // ------------------
      modulo:"",// modulo menu
      estado_menu:false,
      //formulario
      id_enfermedad: "",
      nom_enfermedad: "",
      estatus_enfermedad: "1",
      //MSJ
      msj_nom_enfermedad: [{mensaje:"",color_texto:""}],
      msj_estatus_enfermedad: [{mensaje:"",color_texto:""}],
      //// combo box
      fecha_actual: "",
      ///
      mensaje:{
          texto:"",
          estado:""
      },
      mensaje_formulario: "",
      //
      fechaServidor:null,
      StringExprecion: /[A-Za-z]|[0-9]/
    }
  }
  // logica menu
  mostrarModulo(a){
      // esta funcion tiene la logica del menu no tocar si no quieres que el menu no te responda como es devido
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

  async UNSAFE_componentWillMount(){

    let acessoModulo=await this.validarAccesoDelModulo("/dashboard/configuracion","/enfermedad")
    const operacion=this.props.match.params.operacion
    if(acessoModulo){
      if(operacion==="actualizar"){
        let responseServidor = await this.ConsultarRegistro(this.props.match.params.id)
        let array = responseServidor.datos[0];
                
        this.setState({
          id_enfermedad: array.id_enfermedad,
          nom_enfermedad: array.nombre_enfermedad,
          status_enfermedad: array.staus_enfermedad,
        });

      }
    }else{
        alert("no tienes acesso a este modulo(sera redirigido a la vista anterior)")
        this.props.history.goBack()
    }
  }
  
  async ConsultarRegistro(id){
      const token = localStorage.getItem("usuario")
      return await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/enfermedad/consultar/${id}/${token}`)
    .then(async response => response.data)
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
          console.log(modulosSistema)
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

  async consultarFechaServidor(){
      await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/trabajador/fecha-servidor`)
      .then(respuesta => {
          let fechaServidor=respuesta.data.fechaServidor
          // alert(fechaServidor)
          this.setState({fechaServidor})
      })
      .catch(error => {
          console.log("error al conectar con el servidor")
      })
  }

  async consultarServidor(ruta_api,nombre_propiedad_lista,propiedad_id,propiedad_descripcion,propiedad_estado){
      var respuesta_servidor=[]
      var lista=[]
      var mensaje={texto:"",estado:""}
      await axios.get(ruta_api)
      .then(respuesta=>{
          respuesta_servidor=respuesta.data
          if(respuesta_servidor.estado_peticion==="200"){
              var lista_vacia=[]
              const propiedades={
                  id:propiedad_id,
                  descripcion:propiedad_descripcion,
                  estado:propiedad_estado
              }
              lista=this.formatoOptionSelect(respuesta_servidor[nombre_propiedad_lista],lista_vacia,propiedades)
          }
          else if(respuesta_servidor.estado_peticion==="404"){
              mensaje.texto=respuesta_servidor.mensaje
              mensaje.estado=respuesta_servidor.estado_peticion
              this.props.history.push(`/dashboard/configuracion/enfermedad{JSON.stringify(mensaje)}`)
          }
      })
      .catch(error=>{
          console.log(error)
      })
      return lista
  }

  cambiarEstadoDos(input){
    this.setState({[input.name]:input.value})
  }

  cambiarEstado(a){
    var input=a.target;
    this.setState({[input.name]:input.value})
}

  async agregar(){
    var mensaje=this.state.mensaje
    mensaje.estado=""
    var mensaje_campo=[{mensaje:"",color_texto:""}]
    this.setState({
      //formulario
      id_ano_escolar: "",
      ano_desde: "",
      ano_hasta: "",
      fecha_inicio_ano_escolar: "",
      fecha_cierre_ano_escolar: "",
      estatus_ano_escolar: "",
      //MSJ
      msj_nom_enfermedad: mensaje_campo,
      msj_estatus_enfermedad: mensaje_campo,
      msj_fecha_inicio_ano_escolar: mensaje_campo,
      msj_fecha_cierre_ano_escolar: mensaje_campo,
      msj_estatus_ano_escolar: mensaje_campo,
    })
    this.props.history.push("/dashboard/configuracion/enfermedad/registrar")
  }

  validarTexto(a){
    const input=a.target,
    exprecion=/[A-Za-z\s]$/
    if(input.value!==""){
        if(exprecion.test(input.value)){
            this.cambiarEstadoDos(input)
        }
        else{
            console.log("NO se acepta valores numericos")
        }
    }
    else{
        this.cambiarEstadoDos(input)
    }
}

  validarRadio(){
    let estado = false
    const valor = this.state.status_enfermedad
    let msj_estatus_enfermedad = this.state.msj_estatus_enfermedad
    if(valor != ""){
      estado = true
      msj_estatus_enfermedad[0] = {mensaje: "", color_texto:"rojo"}
    }else{
      msj_estatus_enfermedad[0] = {mensaje: "Debe de seleccionar el estado del De la enfermedad", color_texto:"rojo"}
    }
    this.setState(msj_estatus_enfermedad)
    return estado
  }
  
  validarcampo(){
    let estado = false;
    const valor = this.state.nom_enfermedad;
    let msj_nom_enfermedad = this.state.msj_nom_enfermedad;
    if(valor != ""){
      estado = true;
      msj_nom_enfermedad[0] = {mensaje: "", color_texto:"rojo"}
    }else msj_nom_enfermedad[0] = {mensaje: "Debe de ingresar el nombre de la enfermedad", color_texto: "rojo"}

    this.setState(msj_nom_enfermedad);
    return estado;    
  }

  validarFormularioRegistrar(){
    const validarNom = this.validarcampo(), validarStatus = this.validarRadio();

    if(validarNom && validarStatus) return {estado: true};
    else return {estado: false};
  }

  validarFormularioActuazliar(){
    const validarNom = this.validarcampo(), validarStatus = this.validarRadio();

    if(validarNom && validarStatus) return {estado: true};
    else return {estado: false};
  }

  operacion(){
      $(".columna-modulo").animate({
          scrollTop: 0
          }, 1000)
      const operacion=this.props.match.params.operacion

      const mensaje_formulario={
          mensaje:"",
          msj_nom_enfermedad: [{mensaje:"",color_texto:""}],
          msj_estatus_enfermedad: [{mensaje:"",color_texto:""}],
      }
      if(operacion==="registrar"){

          let estado_validar_formulario = this.validarFormularioRegistrar()
          if(estado_validar_formulario.estado){
              this.enviarDatos(estado_validar_formulario,(objeto)=>{
                  const mensaje =this.state.mensaje
                  var respuesta_servidor=""
                  axios.post(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/enfermedad/registrar`,objeto)
                  .then(respuesta=>{
                      respuesta_servidor=respuesta.data
                      mensaje.texto=respuesta_servidor.mensaje
                      mensaje.estado=respuesta_servidor.estado_respuesta
                      mensaje_formulario.mensaje=mensaje
                      this.setState(mensaje_formulario)
                  })
                  .catch(error=>{
                      mensaje.texto="No se puedo conectar con el servidor"
                      mensaje.estado=false
                      console.log(error)
                      mensaje_formulario.mensaje=mensaje
                      this.setState(mensaje_formulario)
                  })
              })
          }
      }
      else if(operacion==="actualizar"){
          const estado_validar_formulario=this.validarFormularioActuazliar()
          const {id}=this.props.match.params
          if(estado_validar_formulario.estado){
              this.enviarDatos(estado_validar_formulario,(objeto)=>{
                  const mensaje =this.state.mensaje
                  var respuesta_servidor=""
                  axios.put(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/enfermedad/actualizar/${id}`,objeto)
                  .then(respuesta=>{
                      respuesta_servidor=respuesta.data
                      mensaje.texto=respuesta_servidor.mensaje
                      mensaje.estado=respuesta_servidor.estado_respuesta
                      mensaje_formulario.mensaje=mensaje
                      this.setState(mensaje_formulario)
                  })
                  .catch(error=>{
                      mensaje.texto="No se puedo conectar con el servidor"
                      mensaje.estado=false
                      mensaje_formulario.mensaje=mensaje
                      this.setState(mensaje_formulario)
                  })
              })
          }
      }
  }

  enviarDatos(estado_validar_formulario,petion){
      const token=localStorage.getItem('usuario')
      const objeto={
        enfermedad:{
          id_enfermedad: this.state.id_enfermedad,
          nombre_enfermedad: this.state.nom_enfermedad,
          estaus_enfermedad: this.state.estatus_enfermedad,
        },
        token:token
      }
      petion(objeto)
  }

  regresar(){
      this.props.history.push("/dashboard/configuracion/enfermedad");
  }

    render(){
        var jsx_Enfermedad_form = (
          <>
            <div className="row justify-content-center">
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                    {this.state.mensaje.texto!=="" && (this.state.mensaje.estado===true || this.state.mensaje.estado===false) &&
                        <div className="row">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                <div className={`alert alert-${(this.state.mensaje.estado===true)?"success":"danger"} alert-dismissible`}>
                                    <p>Mensaje: {this.state.mensaje.texto}</p>
                                    <button className="close" data-dismiss="alert">
                                        <span>X</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_formulario_trabajador">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-trabajador">
                            <span className="titulo-form-trabajador">Formulario Enfermedades</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-auto">
                            <ButtonIcon
                            clasesBoton="btn btn-outline-success"
                            icon="icon-plus"
                            id="icon-plus"
                            eventoPadre={this.agregar}
                            />
                        </div>
                    </div>
                    <form id="form_trabajador">
                        <div className="row justify-content-center">
                          <ComponentFormCampo clasesColumna="col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9"
                              clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_nom_enfermedad[0]}
                              nombreCampo="Nombre de la enfermedad:" activo="si" type="text" value={this.state.nom_enfermedad}
                              name="nom_enfermedad" id="nom_enfermedad" placeholder="Nombre de la enfermedad" eventoPadre={this.validarTexto}
                            />
                        </div>
                        <div className="row justify-content-center mt-1">
                            <ComponentFormRadioState clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                              extra="custom-control-inline" nombreCampoRadio="Estatus de la enfermedad:" name="estatus_enfermedad"
                              nombreLabelRadioA="Activo" idRadioA="activo" checkedRadioA={this.state.estatus_enfermedad}
                              valueRadioA="1" nombreLabelRadioB="Innactivo" idRadioB="innactivo"
                              valueRadioB="0" eventoPadre={this.cambiarEstado} checkedRadioB={this.state.estatus_enfermedad}
                            />
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-auto">
                                {this.props.match.params.operacion==="registrar" &&
                                    <InputButton
                                    clasesBoton="btn btn-primary"
                                    id="boton-registrar"
                                    value="Registrar"
                                    eventoPadre={this.operacion}
                                    />
                                }
                                {this.props.match.params.operacion==="actualizar" &&
                                    <InputButton
                                    clasesBoton="btn btn-warning"
                                    id="boton-actualizar"
                                    value="Actualizar"
                                    eventoPadre={this.operacion}
                                    />
                                }
                            </div>
                            <div className="col-auto">
                                <InputButton
                                clasesBoton="btn btn-danger"
                                id="boton-cancelar"
                                value="Cancelar"
                                eventoPadre={this.regresar}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
          </>
        );

        return(
            <div className="component_trabajador_form">
              <ComponentDashboard
              componente={jsx_Enfermedad_form}
              modulo={this.state.modulo}
              eventoPadreMenu={this.mostrarModulo}
              estado_menu={this.state.estado_menu}
              />
            </div>
        )
    }
}

export default withRouter(ComponentEnfermedadesForm);
