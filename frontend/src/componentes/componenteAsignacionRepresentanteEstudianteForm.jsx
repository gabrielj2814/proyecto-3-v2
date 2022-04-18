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

class ComponentAsignacionRepresentanteEstudianteForm extends React.Component{
  constructor(){
    super();
    this.GetTodosRepresentantesEstudiantes = this.GetTodosRepresentantesEstudiantes.bind(this);
    this.consultarPerfilTrabajador=this.consultarPerfilTrabajador.bind(this)
    this.buscarRepresentante = this.buscarRepresentante.bind(this)
    this.BuscarEstudiante = this.BuscarEstudiante.bind(this);
    this.mostrarModulo = this.mostrarModulo.bind(this);
    this.regresar=this.regresar.bind(this);
    this.operacion=this.operacion.bind(this);
    this.cambiarEstado=this.cambiarEstado.bind(this);
    this.agregar=this.agregar.bind(this);
    this.validarNumero=this.validarNumero.bind(this);
    this.validarTexto=this.validarTexto.bind(this);
    this.validarSelect=this.validarSelect.bind(this);
    this.cambiarEstadoDos = this.cambiarEstadoDos.bind(this);
    this.validarFormularioRegistrar=this.validarFormularioRegistrar.bind(this);
    this.validarCampo=this.validarCampo.bind(this)
    this.enviarDatos=this.enviarDatos.bind(this)

    // this.consultarRepresentante=this.consultarRepresentante.bind(this)

    this.state={
        // ------------------
        modulo:"",// modulo menu
        estado_menu:false,
        //formulario
        id_asignacion_representante_estudiante: null,
        id_estudiante: "",
        cedula_escolar: "",
        id_cedula_representante: "",
        tipo_representante: "",
        parentesco: "",
        numero_representante: 0,
        estatus_asignacion_representante_estudiante:"1",
        // Datos extras para el formulario
        nombre_representante: "",
        nombre_estudiante: "",
        apellido_estudiante: "",
        apellido_representante: "",
        //MSJ
        msj_id:[{mensaje:"",color_texto:""}],
        msj_cedula_escolar:[{mensaje:"",color_texto:""}],
        msj_id_cedula_representante:[{mensaje:"",color_texto:""}],
        msj_tipo_representante:[{mensaje:"",color_texto:""}],
        msj_parentesco:[{mensaje:"",color_texto:""}],
        msj_numero_representante:[{mensaje:"",color_texto:""}],
        msj_estatus_asignacion_representante_estudiante:[{mensaje:"",color_texto:""}],
        //// combo box
        tipos_representantes:[
          {id: "", descripcion: "Seleccione una opcion"},
          {id: "M", descripcion: "Mama"},
          {id: "P", descripcion: "Papa"},
          {id: "O", descripcion: "Otro representante"}
        ],
        hashRepresentante:{},
        hashEstudiante:{},
        estadoBusquedaEstudiante: false,
        estadoBusquedaRepresentante: false,
        ///
        mensaje:{
            texto:"",
            estado:""
        },
        //
        fechaServidor:null,
        StringExprecion: /[A-Za-z]|[0-9]/
    }
  }

  async UNSAFE_componentWillMount(){
    let acessoModulo=await this.validarAccesoDelModulo("/dashboard/transaccion","/asignacion-representante-estudiante")
    if(acessoModulo){
      await this.consultarFechaServidor()
      await this.GetTodosRepresentantesEstudiantes()
      const operacion=this.props.match.params.operacion

      if(operacion === "actualizar"){
        const {id} = this.props.match.params;
        const datos = await this.consultarRegistros(id);

        this.setState({
          id_estudiante: datos.id_estudiante,
          cedula_escolar: datos.cedula_escolar+datos.codigo_cedula_escolar,
          id_cedula_representante: datos.id_cedula_representante,
          tipo_representante: datos.tipo_representante,
          parentesco: datos.parentesco,
          numero_representante: datos.numero_representante,
          estatus_asignacion_representante_estudiante: datos.estatus_asignacion_representante_estudiante,
          nombre_representante: datos.nombres_representante,
          nombre_estudiante: datos.nombres_estudiante,
          apellido_estudiante: datos.apellidos_estudiante,
          apellido_representante: datos.apellidos_representante,
        })

        document.getElementById('tipo_representante').value = datos.tipo_representante
      }
    }
  }

  async validarAccesoDelModulo(modulo,subModulo){
    let estado = false
    if(localStorage.getItem("usuario")){

      const token=localStorage.getItem("usuario")
      await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/login/verificar-sesion${token}`)
      .then(async respuesta=>{
          let respuesta_servior = respuesta.data
          if(respuesta_servior.usuario){
            estado = await this.consultarPerfilTrabajador(modulo,subModulo,respuesta_servior.usuario.id_perfil)
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

  async consultarRegistros(id){
    let mensaje =""
    const token=localStorage.getItem('usuario')
    let fechaServidor=Moment(this.state.fechaServidor,"YYYY-MM-DD")
    return await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/asignacion-representante-estudiante/consultar/${id}`)
    .then( respuesta => {
      let respuesta_servidor=respuesta.data
      if(respuesta_servidor.estado_respuesta=== true){
        return respuesta_servidor.datos[0]
      }
      else if(respuesta_servidor.estado_respuesta===false){
          mensaje.texto=respuesta_servidor.mensaje
          mensaje.estado=respuesta_servidor.estado_peticion
          this.props.history.push(`/dashboard/configuracion/asignacion-representante-estudiante${JSON.stringify(mensaje)}`)
      }
    })
    .catch(error=>{
        console.log(error)
        mensaje.texto="No se puedo conectar con el servidor"
        mensaje.estado="500"
        this.props.history.push(`/dashboard/configuracion/asignacion-representante-estudiante${JSON.stringify(mensaje)}`)
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
              this.props.history.push(`/dashboard/configuracion/asignacion-representante-estudiante${JSON.stringify(mensaje)}`)
          }
      })
      .catch(error=>{
          console.log(error)
      })
      return lista
  }

  validarNumero(a){
    const input = a.target,
    exprecion= new RegExp("^[0-9-]+$")
    if(input.value!==""){
      if(exprecion.test(input.value)) this.longitudCampo(input)

    }else this.cambiarEstadoDos(input)
  }

  validarTexto(a){
    const input = a.target,
    exprecion=/[A-Za-z\s]$/
    if(input.value!==""){
      if(exprecion.test(input.value)) this.cambiarEstadoDos(input)
      else console.log("NO se acepta valores numericos")
    }else this.cambiarEstadoDos(input)
  }

  longitudCampo(input){
    if(input.name==="id_estudiante" || input.name === "id_cedula_representante"){
      if(input.value.length <= 8) this.cambiarEstadoDos(input)
    }
    else if(input.name==="numero_representante"){
      if(input.value.length <= 9) this.cambiarEstadoDos(input)
    }
    else if(input.name==="cedula_escolar"){
      if(input.value.length <= 16) this.cambiarEstadoDos(input)
    }
  }

  cambiarEstadoDos(input){ this.setState({[input.name]:input.value}) }

  cambiarEstado(a){
      var input=a.target;
      this.setState({[input.name]:input.value})
  }

  validarCampo(nombre_campo){
      var estado=false
      const valor=this.state[nombre_campo]
      let msj_nombres = this.state["msj_"+nombre_campo]
      let msj_apellidos = this.state["msj_"+nombre_campo]
      let msj_parentesco = this.state["msj_"+nombre_campo];

      if(valor!==""){
          if(this.state.StringExprecion.test(valor)){
              estado=true
              console.log("campo nombre "+nombre_campo+" OK")
              msj_nombres[0] = {mensaje: "",color_texto:"rojo"}
              msj_apellidos[0] = {mensaje: "",color_texto:"rojo"}
              msj_parentesco[0] = {mensaje: "",color_texto:"rojo"}
          }
          else{
            msj_nombres[0] = {mensaje: "este campo solo permite letras",color_texto:"rojo"}
            msj_apellidos[0] = {mensaje: "este campo solo permite letras",color_texto:"rojo"}
            msj_parentesco[0] = {mensaje: "este campo solo permite letras",color_texto:"rojo"}
          }
      }
      else{
        msj_nombres[0] = {mensaje: "Este campo no puede estar vacio",color_texto:"rojo"}
        msj_apellidos[0] = {mensaje: "Este campo no puede estar vacio",color_texto:"rojo"}
        msj_parentesco[0] = {mensaje: "Este campo no puede estar vacio",color_texto:"rojo"}
      }

      if(nombre_campo == "nombres") this.setState(msj_nombres)
      else if(nombre_campo === "parentesco") this.setState(msj_parentesco)
      else this.setState(msj_apellidos)
      return estado
  }

  async agregar(){
    var mensaje=this.state.mensaje
    mensaje.estado=""
    var mensaje_campo=[{mensaje:"",color_texto:""}]
    this.setState({
      //formulario
      id:"",
      id_estudiante: "",
      cedula_escolar: "",
      id_cedula_representante: "",
      tipo_representante: "",
      parentesco: "",
      numero_representante: "",
      estatus_asignacion_representante_estudiante:"1",
      //MSJ
      msj_id:[{mensaje:"",color_texto:""}],
      msj_cedula_escolar:[{mensaje:"",color_texto:""}],
      msj_id_cedula_representante:[{mensaje:"",color_texto:""}],
      msj_tipo_representante:[{mensaje:"",color_texto:""}],
      msj_parentesco:[{mensaje:"",color_texto:""}],
      msj_numero_representante:[{mensaje:"",color_texto:""}],
      msj_estatus_asignacion_representante_estudiante:[{mensaje:"",color_texto:""}],
    })
    this.props.history.push("/dashboard/transaccion/asignacion-representante-estudiante/registrar")
  }

  validarCampoNumero(nombre_campo){
      var estado=false
      const campo=this.state[nombre_campo],
      exprecion=/\d$/,
      exprecion_2=/\s/
      var mensaje_campo=this.state["msj_"+nombre_campo]
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

  validarSelect(name){

    const valor = this.state[name]
    let mensaje_campo = this.state["msj_"+name];

    if(valor !== "") mensaje_campo[0] = {mensaje: "", color_texto:"rojo"}
    else mensaje_campo[0] = {mensaje: "Debe de seleccionar el tipo de representante", color_texto:"rojo"}

    this.setState({["msj_"+name]:mensaje_campo})
    if(mensaje_campo[0].mensaje === "") return true; else return false;
  }

  validarRadio(name){
    const valor = this.state[name]
    let msj_estatus_asignacion_representante_estudiante = this.state["msj_"+name]

    if(valor !== "") msj_estatus_asignacion_representante_estudiante[0] = {mensaje: "", color_texto:"rojo"}
    else msj_estatus_asignacion_representante_estudiante[0] = {mensaje: "Debe de seleccionar el estado de esta asignacion", color_texto:"rojo"}

    this.setState(msj_estatus_asignacion_representante_estudiante)
    if(msj_estatus_asignacion_representante_estudiante[0].mensaje === "") return true; else return false;
  }

  validarFormularioRegistrar(){
      const validar_cedula_escolar = this.validarCampoNumero('cedula_escolar'),
      validar_id_representante = this.validarCampoNumero('id_cedula_representante'), validarSelect = this.validarSelect('tipo_representante'),
      validar_numero_representante = this.validarCampoNumero('numero_representante'), validarstatus_asignacion = this.validarRadio('estatus_asignacion_representante_estudiante'),
      validar_parentesco = this.validarCampo('parentesco');

      if( validar_cedula_escolar && validar_id_representante && validarSelect && validar_numero_representante && validarstatus_asignacion && validar_parentesco){
        return {estado: true}
      }else return {estado: false}
  }

  validarFormularioActuazliar(){
    const validar_cedula_escolar = this.validarCampoNumero('cedula_escolar'),
    validar_id_representante = this.validarCampoNumero('id_cedula_representante'), validarSelect = this.validarSelect('tipo_representante'),
    validar_numero_representante = this.validarCampoNumero('numero_representante'), validarstatus_asignacion = this.validarRadio('estatus_asignacion_representante_estudiante'),
    validar_parentesco = this.validarCampo('parentesco');

    if( validar_cedula_escolar && validar_id_representante && validarSelect && validar_numero_representante && validarstatus_asignacion && validar_parentesco){
      return {estado: true}
    }else return {estado: false}
  }

  operacion(){
      $(".columna-modulo").animate({
          scrollTop: 0
          }, 1000)
      const operacion=this.props.match.params.operacion

      const mensaje_formulario={
          mensaje:"",
          msj_id:[{mensaje:"",color_texto:""}],
          msj_cedula_escolar:[{mensaje:"",color_texto:""}],
          msj_id_cedula_representante:[{mensaje:"",color_texto:""}],
          msj_tipo_representante:[{mensaje:"",color_texto:""}],
          msj_parentesco:[{mensaje:"",color_texto:""}],
          msj_numero_representante:[{mensaje:"",color_texto:""}],
          msj_estatus_asignacion_representante_estudiante:[{mensaje:"",color_texto:""}],
      }
      if(operacion==="registrar"){

          const estado_validar_formulario=this.validarFormularioRegistrar()
          if(estado_validar_formulario.estado){
              this.enviarDatos(estado_validar_formulario,(objeto)=>{
                  const mensaje =this.state.mensaje
                  var respuesta_servidor=""
                  axios.post(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/asignacion-representante-estudiante/registrar`,objeto)
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
                  axios.put(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/asignacion-representante-estudiante/actualizar/${id}`,objeto)
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
          asigRepresenteEstudiante:{
            id_asignacion_representante_estudiante: this.state.id_asignacion_representante_estudiante,
            id_estudiante:  this.state.id_estudiante,
            id_cedula_representante:  this.state.id_cedula_representante,
            tipo_representante:  this.state.tipo_representante,
            parentesco:  this.state.parentesco,
            numero_representante:  this.state.numero_representante,
            estatus_asignacion_representante_estudiante: this.state.estatus_asignacion_representante_estudiante,
          },
          token:token
      }
      petion(objeto)
  }

  regresar(){ this.props.history.push("/dashboard/transaccion/asignacion-representante-estudiante"); }

  BuscarEstudiante(a){

    this.validarNumero(a)
    let hashEstudiante = JSON.parse(JSON.stringify(this.state.hashEstudiante));

    if(hashEstudiante[a.target.value]){
      this.setState({
        estadoBusquedaEstudiante: true,
        id_estudiante: hashEstudiante[a.target.value].id_estudiante,
        nombre_estudiante: hashEstudiante[a.target.value].nombres_estudiante,
        apellido_estudiante: hashEstudiante[a.target.value].apellidos_estudiante,
      });
      return;
    }
    this.setState({
      estadoBusquedaEstudiante: false
    });
  }

  buscarRepresentante(a){
    this.validarNumero(a);
    let hashRepresentante = JSON.parse(JSON.stringify(this.state.hashRepresentante));

    if(hashRepresentante[a.target.value]){
      this.setState({
        estadoBusquedaRepresentante: true,
        nombre_representante: hashRepresentante[a.target.value].nombres_representante,
        apellido_representante: hashRepresentante[a.target.value].apellidos_representante
      });
      return;
    }
    this.setState({
      estadoBusquedaRepresentante: false
    });
  }

  async GetTodosRepresentantesEstudiantes(){
    await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/estudiante/consultar-todos`)
    .then( res => {
      let json = JSON.parse(JSON.stringify(res.data));
      let hash = {};
      for(let estudiante of json.datos){
        if(estudiante.cedula_estudiante != null) hash[estudiante.cedula_estudiante] = estudiante;
        if(estudiante.cedula_escolar != null) hash[estudiante.codigo_cedula_escolar+'-'+estudiante.cedula_escolar] = estudiante;
      }

      this.setState({hashEstudiante:hash})

    })
    .catch( err => console.error(err));

    await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/representante/consultar-todos`)
    .then( res => {
      let json = JSON.parse(JSON.stringify(res.data));
      let hash = {};
      for(let representante of json.datos){
        hash[representante.id_cedula_representante] = representante;
      }
      this.setState({hashRepresentante: hash});
    })
    .catch( err => console.error(err));
  }

  render(){
    var jsx_representante_estudiante=(
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
                        <span className="titulo-form-trabajador">Formulario de asignación representante-estudiante</span>
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
                  <div className="row justify-content-center align-items-center">
                      <ComponentFormCampo clasesColumna="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4"
                        clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_id_cedula_representante[0]}
                        nombreCampo="Cédula del representante:" activo="si" type="text" value={this.state.id_cedula_representante}
                        name="id_cedula_representante" id="id_cedula_representante" placeholder="Cédula del representante" eventoPadre={this.buscarRepresentante}
                      />
                      <div className='col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5'>
                          <label>Nombre del representante: {this.state.nombre_representante}</label>
                          <label>Apellido del representante: {this.state.apellido_representante}</label>
                      </div>
                  </div>
                  <div className="row mt-3">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                          <span className="sub-titulo-form-reposo-trabajador">Representante</span>
                      </div>
                  </div>
                  <div className="row justify-content-center align-items-center">
                    <ComponentFormCampo clasesColumna="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4"
                        clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_cedula_escolar[0]}
                        nombreCampo="Cédula del estudiante:" activo="si" type="text" value={this.state.cedula_escolar}
                        name="cedula_escolar" id="cedula_escolar" placeholder="Cédula escolar del estudiante" eventoPadre={this.BuscarEstudiante}
                      />
                      <div className='col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5'>
                        <label>Nombre del estudiante: {this.state.nombre_estudiante}</label>
                        <label>Apellido del estudiante: {this.state.apellido_estudiante}</label>
                      </div>
                  </div>
                  <div className="row mt-3">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                          <span className="sub-titulo-form-reposo-trabajador">Estudiante</span>
                      </div>
                  </div>
                  <div className="row justify-content-center">
                      <ComponentFormCampo clasesColumna="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4"
                        clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_numero_representante[0]}
                        nombreCampo="Numero del representante:" activo="si" type="number" value={this.state.numero_representante}
                        name="numero_representante" id="numero_representante" placeholder="numero del representante" eventoPadre={this.validarNumero}
                      />
                      <div className="col-1 col-ms-1 col-md-1 col-lg-1 col-xl-1"></div>
                      <ComponentFormSelect
                        clasesColumna="col-4 col-ms-4 col-md-4 col-lg-4 col-xl-4"
                        obligatorio="si"
                        mensaje={this.state.msj_tipo_representante[0]}
                        nombreCampoSelect="Tipo de representante:"
                        clasesSelect="custom-select"
                        name="tipo_representante"
                        id="tipo_representante"
                        eventoPadre={this.cambiarEstado}
                        defaultValue={this.state.tipo_representante}
                        option={this.state.tipos_representantes}
                      />
                  </div>
                  <div className="row justify-content-center">
                    <ComponentFormTextArea clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                      obligatorio="si" mensaje={this.state.msj_parentesco[0]} nombreCampoTextArea="Parentesco:"
                      clasesTextArear="form-control" name="parentesco" id="parentesco" value={this.state.parentesco}
                      eventoPadre={this.cambiarEstado}
                    />
                  </div>
                  <div className="row justify-content-center mt-1">
                    <ComponentFormRadioState
                      clasesColumna="col-7 col-ms-7 col-md-7 col-lg-7 col-xl-7"
                      extra="custom-control-inline"
                      nombreCampoRadio="Estatus de la asignacion:"
                      name="estatus_asignacion_representante_estudiante"
                      nombreLabelRadioA="Activó"
                      idRadioA="activoestudianterA"
                      checkedRadioA={this.state.estatus_asignacion_representante_estudiante}
                      valueRadioA="1"
                      nombreLabelRadioB="Inactivo"
                      idRadioB="activoestudianterB"
                      valueRadioB="0"
                      eventoPadre={this.cambiarEstado}
                      checkedRadioB={this.state.estatus_asignacion_representante_estudiante}
                    />
                  </div>
                  <div className="row mt-3">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                          <span className="sub-titulo-form-reposo-trabajador">Datos extras</span>
                      </div>
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
    )

    return(
        <div className="component_trabajador_form">
          <ComponentDashboard
          componente={jsx_representante_estudiante}
          modulo={this.state.modulo}
          eventoPadreMenu={this.mostrarModulo}
          estado_menu={this.state.estado_menu}
          />
        </div>
    )
  }
}

export default withRouter(ComponentAsignacionRepresentanteEstudianteForm)
