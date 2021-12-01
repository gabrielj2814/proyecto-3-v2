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

class ComponentAnoEscolarForm extends React.Component{
  constructor(){
    super();
    this.mostrarModulo = this.mostrarModulo.bind(this);
    this.regresar=this.regresar.bind(this);
    this.operacion=this.operacion.bind(this);
    this.cambiarEstado=this.cambiarEstado.bind(this);
    this.agregar=this.agregar.bind(this);
    this.validarNumero=this.validarNumero.bind(this);
    this.fechaNacimiento=this.fechaNacimiento.bind(this);
    this.validarFecha = this.validarFecha.bind(this);
    this.validarFormularioRegistrar=this.validarFormularioRegistrar.bind(this);
    this.enviarDatos=this.enviarDatos.bind(this);
    this.consultarPerfilTrabajador=this.consultarPerfilTrabajador.bind(this);
    this.ConsultarFechaActual = this.ConsultarFechaActual.bind(this);
    this.ConsultarAnoActivo = this.ConsultarAnoActivo.bind(this);
    this.ConsultarRegistro = this.ConsultarRegistro.bind(this);
    this.validainicioFinal = this.validainicioFinal.bind(this);
    this.confirmar = this.confirmar.bind(this);
    this.state = {
      // ------------------
      modulo:"",// modulo menu
      estado_menu:false,
      //formulario
      id_ano_escolar: "",
      ano_desde: "",
      ano_hasta: "",
      fecha_inicio_ano_escolar: "",
      fecha_cierre_ano_escolar: "",
      estatus_ano_escolar: "1",
      //MSJ
      msj_id_ano_escolar: [{mensaje:"",color_texto:""}],
      msj_ano_desde: [{mensaje:"",color_texto:""}],
      msj_ano_hasta: [{mensaje:"",color_texto:""}],
      msj_fecha_inicio_ano_escolar: [{mensaje:"",color_texto:""}],
      msj_fecha_cierre_ano_escolar: [{mensaje:"",color_texto:""}],
      msj_estatus_ano_escolar: [{mensaje:"",color_texto:""}],
      //// combo box
      fecha_actual: "",
      confirmar_operacion: false,
      ///
      mensaje:{
          texto:"",
          estado:""
      },
      mensaje_formulario: "",
      //
      fechaServidor:null,
      edadEstudiante:null,
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

    let acessoModulo=await this.validarAccesoDelModulo("/dashboard/configuracion","/ano-escolar")
    const operacion=this.props.match.params.operacion
    if(acessoModulo){

      if(operacion === "registrar"){
        let AnoActivo = await this.ConsultarAnoActivo();
        var mensaje={texto:"Ya existe un año escolar activo",estado: "404"}
        if(AnoActivo.estado_respuesta) this.props.history.push(`/dashboard/configuracion/ano-escolar${JSON.stringify(mensaje)}`)
        // SI EXISTE UN ANO ESCOLAR ACTIVO, RETORNAR A LA VISTA ANTERIOR
        let fecha_actual_servidor = await this.ConsultarFechaActual();
        this.setState({
          ano_desde: Moment(fecha_actual_servidor.datos).format("YYYY"),
          ano_hasta: Moment(fecha_actual_servidor.datos).add(1,'y').format("YYYY"),
          fecha_inicio_ano_escolar: Moment(fecha_actual_servidor.datos).format("YYYY-MM-DD"),
          fecha_cierre_ano_escolar: Moment(fecha_actual_servidor.datos).add(1,'y').format("YYYY-MM-DD"),
          fecha_actual: fecha_actual_servidor.datos,
        });

        document.getElementById("ano_desde").readonly = true;
        document.getElementById("ano_hasta").readonly = true;
      }
      else if(operacion==="actualizar"){
        let responseServidor = await this.ConsultarRegistro(this.props.match.params.id)
        let array = responseServidor.datos[0];
        let fecha_actual_servidor = await this.ConsultarFechaActual();

        this.setState({
          ano_desde: array.ano_desde,
          ano_hasta: array.ano_hasta,
          fecha_inicio_ano_escolar: Moment(array.fecha_inicio_ano_escolar).format("YYYY-MM-DD"),
          fecha_cierre_ano_escolar: Moment(array.fecha_cierre_ano_escolar).format("YYYY-MM-DD"),
          fecha_actual: fecha_actual_servidor.datos,
        });

        document.getElementById("ano_desde").readonly = true;
        document.getElementById("ano_hasta").readonly = true;
        document.getElementById("fecha_inicio_ano_escolar").readonly = true;
        document.getElementById("activo").disabled = true;
        document.getElementById("innactivo").disabled = true;
      }
    }else{
        alert("no tienes acesso a este modulo(sera redirigido a la vista anterior)")
        this.props.history.goBack()
    }
  }
  async ConsultarAnoActivo(){
    return await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/ano-escolar/consultar-ano-escolar-activo`)
    .then(async response => response.data)
  }
  async ConsultarFechaActual(){
      return await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/ano-escolar/fecha-actual`)
      .then(async response => response.data)
  }

  async ConsultarRegistro(id){
    return await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/ano-escolar/consultar/${id}`)
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
              this.props.history.push(`/dashboard/configuracion/ano-escolar{JSON.stringify(mensaje)}`)
          }
      })
      .catch(error=>{
          console.log(error)
      })
      return lista
  }

  validarNumero(a){
      const input=a.target,
      exprecion=/\d$/
      if(input.value!==""){
          if(exprecion.test(input.value)){
              // console.log("OK")
              this.longitudCampo(input)
          }
      }
      else{
          this.cambiarEstadoDos(input)
      }
  }

  longitudCampo(input){
      if(input.name==="ano_desde" || input.name === "ano_hasta"){
          if(input.value.length <= 4){
              this.cambiarEstadoDos(input)
          }
      }
  }

  cambiarEstadoDos(input){
    this.setState({[input.name]:input.value})
  }

  cambiarEstado(a){
      var input=a.target;
      this.setState({[input.name]:input.value})
      if(input.name == "fecha_inicio_ano_escolar") this.setState({ano_desde: Moment(input.value).format("YYYY")})
      else this.setState({ano_hasta: Moment(input.value).format("YYYY")})
  }

  fechaNacimiento(a){
      let input=a.target
      this.cambiarEstado(a)
      let fechaServidor=Moment(this.state.fechaServidor,"YYYY-MM-DD")
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
      msj_id_ano_escolar: mensaje_campo,
      msj_ano_desde: mensaje_campo,
      msj_ano_hasta: mensaje_campo,
      msj_fecha_inicio_ano_escolar: mensaje_campo,
      msj_fecha_cierre_ano_escolar: mensaje_campo,
      msj_estatus_ano_escolar: mensaje_campo,
    })
    this.props.history.push("/dashboard/configuracion/ano-escolar/registrar")
  }

  validarCampoNumero(nombre_campo){
      var estado = false
      const campo = this.state[nombre_campo],
      exprecion = /\d$/,
      exprecion_2 = /\s/
      var mensaje_campo = this.state["msj_"+nombre_campo]
      if(campo!==""){
          if(!exprecion_2.test(campo)){
              if(exprecion.test(campo)){
                  estado=true

                  mensaje_campo[0]={mensaje:"",color_texto:"rojo"}
                  this.setState({["msj_"+nombre_campo]:mensaje_campo})
              }
          }
          else{
              mensaje_campo[0]={mensaje:"este campo solo permite numeros",color_texto:"rojo"}
              this.setState({["msj_"+nombre_campo]:mensaje_campo})
          }
      }
      else{
          mensaje_campo[0]={mensaje:"este campo no puede estar vacio",color_texto:"rojo"}
          this.setState({["msj_"+nombre_campo]:mensaje_campo})
      }
      return estado
  }

  validainicioFinal(){
    let estado = true;
    const inicio_ano = parseInt(this.state.ano_desde);
    const final_ano = parseInt(this.state.ano_hasta);
    let msj_ano_desde = this.state.msj_ano_desde;
    let msj_ano_hasta = this.state.msj_ano_hasta;
    let fecha_minima = parseInt(Moment(this.state.fecha_actual).format("YYYY"));
    let fecha_maxima = parseInt(Moment(this.state.fecha_actual).add(1,'y').format("YYYY"));

    if(inicio_ano < fecha_minima){
      msj_ano_desde[0] = {mensaje:"El año de inicio no puede ser menor al año en curso", color_texto:"rojo"};
      this.setState(msj_ano_desde);
      estado = false;
    }

    if(inicio_ano > final_ano){
      msj_ano_desde[0] = {mensaje:"El año de inicio no puede ser mayor al año escolar de cierre", color_texto:"rojo"};
      this.setState(msj_ano_desde);
      estado = false;
    }

    if(final_ano < inicio_ano){
      msj_ano_hasta[0] = {mensaje:"El año de cierre no puede ser menor al año escolar de inicio", color_texto:"rojo"};
      this.setState(msj_ano_hasta);
      estado = false;
    }

    if(final_ano > fecha_maxima){
      msj_ano_hasta[0] = {mensaje:"El año de cierre no puede ser mayor a un año, del año en curso", color_texto:"rojo"};
      this.setState(msj_ano_hasta);
      estado = false;
    }

    return estado;
  }

  validarFecha(){
    const fecha_inicio = Moment(this.state.fecha_inicio_ano_escolar);
    const fecha_cierre = Moment(this.state.fecha_cierre_ano_escolar);
    let fecha_minima = Moment(this.state.fecha_actual);
    let fecha_maxima = Moment(Moment(this.state.fecha_actual).add(1,'y').format("YYYY-MM-DD"));
    let estado = true
    let operacion = this.props.match.params.operacion;

    if(operacion === "actualizar"){
      fecha_maxima.add(4,'M');
      this.setState({ano_hasta: Moment(fecha_cierre).format("YYYY")});
    }

    if(operacion === "registrar"){
      if(fecha_inicio.isBefore(fecha_minima)){
        let msj_fecha_inicio_ano_escolar = this.state.msj_fecha_inicio_ano_escolar
        msj_fecha_inicio_ano_escolar[0] = {mensaje: "La fecha de inicio es menor a la fecha minima", color_texto:"rojo"}
        this.setState(msj_fecha_inicio_ano_escolar)
        estado = false;
      }
    }

    if(fecha_cierre.isAfter(fecha_maxima)){
      console.log(fecha_cierre, fecha_maxima)
      let msj_fecha_cierre_ano_escolar = this.state.msj_fecha_cierre_ano_escolar
      msj_fecha_cierre_ano_escolar[0] = {mensaje: "La fecha de cierre es mayor a la fecha maxima", color_texto:"rojo"}
      this.setState(msj_fecha_cierre_ano_escolar)
      estado = false;
    }

    if(fecha_inicio.isSame(fecha_cierre)){
      let msj_fecha_inicio_ano_escolar = this.state.msj_fecha_inicio_ano_escolar
      msj_fecha_inicio_ano_escolar[0] = {mensaje: "Las fechas de inicio y cierre no pueden ser exactamente la misma fecha", color_texto:"rojo"}
      this.setState(msj_fecha_inicio_ano_escolar)
      estado = false;
    }

    return estado
  }

  validarRadio(name){
    let estado = false
    const valor = this.state[name]
    let msj_estatus_ano_escolar = this.state["msj_"+name]
    if(valor != ""){
      estado = true
      msj_estatus_ano_escolar[0] = {mensaje: "", color_texto:"rojo"}
    }else{
      msj_estatus_ano_escolar[0] = {mensaje: "Debe de seleccionar el estado del año escolar", color_texto:"rojo"}
    }
    this.setState(msj_estatus_ano_escolar)
    return estado
  }

  validarFormularioRegistrar(){
    const validaInicio = this.validarCampoNumero('ano_desde'), validaHasta = this.validarCampoNumero('ano_hasta'),
    ValidaFechas = this.validarFecha(), validarInicioFinal = this.validainicioFinal();

    if(validaInicio && validaHasta && ValidaFechas && validarInicioFinal){
      if(!this.state.confirmar_operacion) $("#modalConfirmar").modal("show")
      return {estado: true};
    }else{
      return {estado: false};
    }
  }

  confirmar(){
    $("#modalConfirmar").modal("hide")
    this.setState({confirmar_operacion: true});
    this.operacion();
  };

  validarFormularioActuazliar(){
    const ValidaFechas = this.validarFecha()
    if(ValidaFechas) return {estado: true}; else return {estado: false};
  }

  operacion(){
      $(".columna-modulo").animate({
          scrollTop: 0
          }, 1000)
      const operacion=this.props.match.params.operacion

      const mensaje_formulario={
          mensaje:"",
          msj_id_ano_escolar: [{mensaje:"",color_texto:""}],
          msj_ano_desde: [{mensaje:"",color_texto:""}],
          msj_ano_hasta: [{mensaje:"",color_texto:""}],
          msj_fecha_inicio_ano_escolar: [{mensaje:"",color_texto:""}],
          msj_fecha_cierre_ano_escolar: [{mensaje:"",color_texto:""}],
          msj_estatus_ano_escolar: [{mensaje:"",color_texto:""}],
      }
      if(operacion==="registrar"){

          let estado_validar_formulario = this.validarFormularioRegistrar()
          if(this.state.confirmar_operacion){
              this.enviarDatos(estado_validar_formulario,(objeto)=>{
                  const mensaje =this.state.mensaje
                  var respuesta_servidor=""
                  axios.post(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/ano-escolar/registrar`,objeto)
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
                  axios.put(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/ano-escolar/actualizar/${id}`,objeto)
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
        anoescolar:{
          id_ano_escolar: this.state.id_ano_escolar,
          ano_desde: this.state.ano_desde,
          ano_hasta: this.state.ano_hasta,
          fecha_inicio_ano_escolar: this.state.fecha_inicio_ano_escolar,
          fecha_cierre_ano_escolar: this.state.fecha_cierre_ano_escolar,
          estatus_ano_escolar: this.state.estatus_ano_escolar,
        },
        token:token
      }
      petion(objeto)
  }

  regresar(){
      this.props.history.push("/dashboard/configuracion/ano-escolar");
  }

    render(){
        var jsx_anoEscolar_form = (
          <>
          <div class="modal fade" id="modalConfirmar" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">Estas segur@?</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div className="row d-flex justify-content-center text-justify mx-2">
                    <h5>
                      <span className="text-danger font-bold">!!</span>
                      Todos los datos ingresado excepto la fecha de cierre, seran datos que no se podran modificar luego
                      <b> debes de estar seguro de los datos ingresados</b>. de ser asi, por favor confirma la operacion,
                        de no ser asi, por favor cancela la operacion y asegurate de que todo este bien
                        <span className="text-danger font-bold">!!</span>
                    </h5>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-success" onClick={ () => this.confirmar() } >Acepto</button>
                  <button type="button" class="btn btn-warning" data-dismiss="modal">Cancelar</button>
                </div>
              </div>
            </div>
          </div>
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
                            <span className="titulo-form-trabajador">Formulario Año escolar</span>
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
                          <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                              clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_ano_desde[0]}
                              nombreCampo="Inicio año:" activo="si" type="text" value={this.state.ano_desde}
                              name="ano_desde" id="ano_desde" placeholder="Desde" eventoPadre={this.validarNumero}
                            />
                          <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                              clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_ano_hasta[0]}
                              nombreCampo="Final año:" activo="si" type="text" value={this.state.ano_hasta}
                              name="ano_hasta" id="ano_hasta" placeholder="Hasta" eventoPadre={this.validarNumero}
                            />
                        </div>
                        <div className="row justify-content-center">
                          <ComponentFormDate clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                              obligatorio="si" mensaje={this.state.msj_fecha_inicio_ano_escolar[0]} nombreCampoDate="Fecha de inicio del año escolar:"
                              clasesCampo="form-control" value={this.state.fecha_inicio_ano_escolar} name="fecha_inicio_ano_escolar"
                              id="fecha_inicio_ano_escolar" eventoPadre={this.fechaNacimiento} minio={Moment(new Date).format("YYYY-MM-DD")} maxim={Moment(new Date(this.state.fecha_maxima)).format("YYYY-MM-DD")}
                            />
                          <ComponentFormDate clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                              obligatorio="si" mensaje={this.state.msj_fecha_cierre_ano_escolar[0]} nombreCampoDate="Fecha de fin del año escolar:"
                              clasesCampo="form-control" value={this.state.fecha_cierre_ano_escolar} name="fecha_cierre_ano_escolar"
                              id="fecha_cierre_ano_escolar" eventoPadre={this.fechaNacimiento} minio={Moment(new Date).format("YYYY-MM-DD")} maxim={Moment(new Date(this.state.fecha_maxima)).format("YYYY-MM-DD")}
                            />
                        </div>
                        <div className="row justify-content-center mt-1">
                            <ComponentFormRadioState clasesColumna="col-5 col-ms-5 col-md-5 col-lg-5 col-xl-5"
                              extra="custom-control-inline" nombreCampoRadio="Estatus del año escolar:" name="estatus_ano_escolar"
                              nombreLabelRadioA="Activo" idRadioA="activo" checkedRadioA={this.state.estatus_ano_escolar}
                              valueRadioA="1" nombreLabelRadioB="Innactivo" idRadioB="innactivo"
                              valueRadioB="0" eventoPadre={this.cambiarEstado} checkedRadioB={this.state.estatus_ano_escolar}
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
              componente={jsx_anoEscolar_form}
              modulo={this.state.modulo}
              eventoPadreMenu={this.mostrarModulo}
              estado_menu={this.state.estado_menu}
              />
            </div>
        )
    }
}

export default withRouter(ComponentAnoEscolarForm);
