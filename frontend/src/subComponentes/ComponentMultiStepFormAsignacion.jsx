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
//sub componentes
import InputButton from './input_button'
import ButtonIcon from './buttonIcon'
import ComponentFormCampo from './componentFormCampo';
import ComponentFormRadioState from './componentFormRadioState';
import ComponentFormSelect from './componentFormSelect';
import ComponentFormDate from './componentFormDate'
import ComponentFormTextArea from './componentFormTextArea'
import { Alert } from 'bootstrap';
import AlertBootstrap from "./alertBootstrap"

class ComponentMultiStepFormAsignacion extends React.Component{
  constructor(props){
    super(props);
    this.GetTodosRepresentantesEstudiantes = this.GetTodosRepresentantesEstudiantes.bind(this);
    this.buscarRepresentante = this.buscarRepresentante.bind(this)
    this.BuscarEstudiante = this.BuscarEstudiante.bind(this);
    this.regresar=this.regresar.bind(this);
    this.operacion=this.operacion.bind(this);
    this.cambiarEstado=this.cambiarEstado.bind(this);
    this.validarNumero=this.validarNumero.bind(this);
    this.validarTexto=this.validarTexto.bind(this);
    this.validarSelect=this.validarSelect.bind(this);
    this.cambiarEstadoDos = this.cambiarEstadoDos.bind(this);
    this.validarFormularioRegistrar=this.validarFormularioRegistrar.bind(this);
    this.validarCampo=this.validarCampo.bind(this)
    this.enviarDatos=this.enviarDatos.bind(this)
    this.RemCedulas = this.RemCedulas.bind(this);
    this.state={
        // ------------------
        modulo:"",// modulo menu
        estado_menu:false,
        //formulario
        id_asignacion_representante_estudiante: null,
        id_estudiante: this.props.idEstudiante,
        cedula_escolar: "",
        cedulas_representante: this.props.cedulasRepresentante,
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
        tipos_representantes_usados:[],
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
    await this.consultarFechaServidor()
    await this.GetTodosRepresentantesEstudiantes()
    await this.BuscarEstudiante()
  }

  async consultarFechaServidor(){
      await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/trabajador/fecha-servidor`)
      .then(respuesta => {
          let fechaServidor=respuesta.data.fechaServidor
          // alert(fechaServidor)
          this.setState({fechaServidor})
      })
      .catch(error => console.log("error al conectar con el servidor") )
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
    console.log(input.name)
    if(input.name==="id_estudiante" || input.name === "id_cedula_representante"){
      if(input.value.length <= 8) this.cambiarEstadoDos(input)
    }
    else if(input.name==="numero_representante"){
      if(input.value.length <= 9) this.cambiarEstadoDos(input)
    }
    else if(input.name==="cedula_escolar"){
      if(input.value.length <= 12) this.cambiarEstadoDos(input)
    }
  }

  cambiarEstadoDos(input){ this.setState({[input.name]:input.value}) }

  cambiarEstado(a){
    if(a.target.id == "tipo_representante"){
      if(this.state.tipos_representantes_usados.length > 0 && a.target.value != ""){
        let validacion = true;

        this.state.tipos_representantes_usados.map( item => {
          if(item.id == a.target.value) validacion = false;
        });

        if(!validacion){
          let mensaje_campo = this.state["msj_tipo_representante"];
          mensaje_campo[0] = {mensaje: "Ya esta registrado este tipo de representante, elije otro", color_texto:"rojo"}
          this.setState({["msj_tipo_representante"]:mensaje_campo})
          return false;
        }

      }
    }
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

  operacion(){
      $(".columna-modulo").animate({scrollTop: 0}, 1000)
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
              this.RemCedulas(this.state.id_cedula_representante)
              this.GestionarTiposRepresentante()

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

  GestionarTiposRepresentante(){
    let tipos_usados = this.state.tipos_representantes_usados;
    let value = this.state.tipo_representante

    if(tipos_usados.length > 0){
      let nuevo = true;
      tipos_usados.map( item =>{ if(item.id == value) nuevo = false; })
      if(nuevo) tipos_usados.push({id: value})

    }else tipos_usados = [{id: value}];
    this.setState({tipos_representantes_usados: tipos_usados})
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

  BuscarEstudiante(){

    let hashEstudiante = JSON.parse(JSON.stringify(this.state.hashEstudiante));

    if(hashEstudiante[this.state.id_estudiante]){
      this.setState({
        estadoBusquedaEstudiante: true,
        id_estudiante: hashEstudiante[this.state.id_estudiante].id_estudiante,
        cedula_escolar: hashEstudiante[this.state.id_estudiante].cedula_escolar,
        nombre_estudiante: hashEstudiante[this.state.id_estudiante].nombres_estudiante,
        apellido_estudiante: hashEstudiante[this.state.id_estudiante].apellidos_estudiante,
      });
      return;
    }
    this.setState({
      estadoBusquedaEstudiante: false
    });
  }

  buscarRepresentante(a){
    a.persist();
    setTimeout(() => {
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
    }, 100);
  }

  RemCedulas(value){
    let cedulas_representante = this.state.cedulas_representante;
    let new_array = cedulas_representante.filter( item => item.id != value);
    this.setState({cedulas_representante: new_array});
  }

  async GetTodosRepresentantesEstudiantes(){
    await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/estudiante/consultar-todos`)
    .then( res => {
      let json = JSON.parse(JSON.stringify(res.data));
      let hash = {};
      for(let estudiante of json.datos){
        hash[estudiante.id_estudiante] = estudiante;
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
    return (
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
                        <span className="titulo-form-trabajador">Formulario de asignacion representante-estudiante</span>
                    </div>
                </div>
                {/* <div className="row">
                    <div className="col-auto">
                        <ButtonIcon
                        clasesBoton="btn btn-outline-success"
                        icon="icon-plus"
                        id="icon-plus"
                        eventoPadre={this.agregar}
                        />
                    </div>
                </div> */}
                <form id="form_trabajador">
                  <div className="row justify-content-center align-items-center">
                      <ComponentFormSelect
                        clasesColumna="col-4 col-ms-4 col-md-4 col-lg-4 col-xl-4"
                        obligatorio="si"
                        mensaje={this.state.msj_id_cedula_representante[0]}
                        nombreCampoSelect="Cédula del representante:"
                        clasesSelect="custom-select"
                        name="id_cedula_representante"
                        id="id_cedula_representante"
                        eventoPadre={this.buscarRepresentante}
                        defaultValue={this.state.id_cedula_representante}
                        option={this.state.cedulas_representante}
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
                        nombreCampo="Cedula del estudiante:" activo="si" type="text" value={this.state.cedula_escolar}
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
                            {this.props.operacion==="registrar" &&
                                <InputButton
                                clasesBoton="btn btn-primary"
                                id="boton-registrar"
                                value="Registrar"
                                eventoPadre={this.operacion}
                                />
                            }
                        </div>
                        <div className="col-auto">
                            <InputButton
                              clasesBoton="btn btn-success"
                              id="boton-anadir"
                              value="Nuevo representante"
                              eventoPadre={this.props.reverse}
                            />
                        </div>
                        <div className="col-auto">
                            {this.props.obligatorio == false && <InputButton
                              clasesBoton="btn btn-secondary"
                              id="boton-cancelar"
                              value="Omitir"
                              eventoPadre={this.props.next}
                            />
                            }
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
  }
}

export default ComponentMultiStepFormAsignacion
