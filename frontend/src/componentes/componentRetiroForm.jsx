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
import ComponentFormRadioMultiState from '../subComponentes/componentFormRadioMultiState';
import ComponentFormSelect from '../subComponentes/componentFormSelect';
import ComponentFormDate from '../subComponentes/componentFormDate'
import ComponentFormTextArea from '../subComponentes/componentFormTextArea'
import { Alert } from 'bootstrap';
import AlertBootstrap from "../subComponentes/alertBootstrap"

const axiosCustom=axios.create({
    baseURL:`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/`
})

class ComponentRetiroForm extends React.Component{
  constructor(){
    super();
    this.consultarPerfilTrabajador=this.consultarPerfilTrabajador.bind(this)
    this.mostrarModulo = this.mostrarModulo.bind(this);
    this.regresar=this.regresar.bind(this);
    this.operacion=this.operacion.bind(this);
    this.cambiarEstado=this.cambiarEstado.bind(this);
    this.agregar=this.agregar.bind(this);
    this.validarNumero = this.validarNumero.bind(this);
    this.validarTexto=this.validarTexto.bind(this);
    this.validarSelect=this.validarSelect.bind(this);
    this.cambiarEstadoDos = this.cambiarEstadoDos.bind(this);
    this.validarFormularioRegistrar=this.validarFormularioRegistrar.bind(this);
    this.validarCampo=this.validarCampo.bind(this)
    this.enviarDatos=this.enviarDatos.bind(this)
    this.ObtenerEstudiantesRepresentantes = this.ObtenerEstudiantesRepresentantes.bind(this);
    this.longitudCampo = this.longitudCampo.bind(this);
    this.BuscarEstudiante = this.BuscarEstudiante.bind(this);
    this.buscarRepresentante = this.buscarRepresentante.bind(this);

    this.state={
        // ------------------
        modulo:"",// modulo menu
        estado_menu:false,
        //formulario
        id_retiro: "",
        id_inscripcion: "",
        cedula_representante_solicitud: "",
        motivo_retiro: "",
        fecha_retiro: "",
        estado_retiro: "E",
        // Datos alumno
        id_estudiante:"",
        cedula_escolar: "",
        nombre_estudiante: "",
        apellido_estudiante: "",
        // Datos profesor
        datos_docente:"",
        // Datos representante
        nombre_representante: "",
        apellido_representante: "",
        // Datos Aula
        id_aula: "",
        nombre_aula: "",
        id_grado: "",
        listaGrados:[],
        listaAulas:[],
        //MSJ
        msj_id_inscripcion:[{mensaje:"",color_texto:""}],
        msj_cedula_representante_solicitud:[{mensaje:"",color_texto:""}],
        msj_motivo_retiro:[{mensaje:"",color_texto:""}],
        msj_fecha_retiro:[{mensaje:"",color_texto:""}],
        msj_estado_retiro:[{mensaje:"",color_texto:""}],
        msj_id_grado:[{mensaje:"",color_texto:""}],
        msj_cedula_escolar:[{mensaje:"",color_texto:""}],
        //// combo box
        lista_profesores: [],
        estados:['E','R','A'],
        hashAsignacionRepresentante:{},
        hashListaProfesores:{},
        hashListaEstudiantes:{},
        hashListaRepresentantes:{},
        selectRepresentantes: [],
        estadoBusquedaProfesor: false,
        estadoBusquedaEstudiante: false,
        estadoBusquedaRepresentante: false,
        operacion: "Registrar",
        ///
        mensaje:{
            texto:"",
            color_alerta: "",
            estado:""
        },
        //
        fechaServidor:null,
        StringExprecion: /[A-Za-z]|[0-9]/
    }
  }

  async ObtenerEstudiantesRepresentantes(){
    await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/asignacion-representante-estudiante/consultar-todos`)
    .then( res => {
      let json = JSON.parse(JSON.stringify(res.data));
      let hash = {};

      for(let asignacion of json.datos){
        if(asignacion.estatus_asignacion_representante_estudiante == "1"){
          hash[asignacion.id_asignacion_representante_estudiante] = asignacion;
        }
      }
      this.setState({hashAsignacionRepresentante:hash})

    })
    .catch( err => console.error(err));

    await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/inscripcion/consultar-estudiante-inscritos`)
    .then( res => {
      let json = JSON.parse(JSON.stringify(res.data));
      let hash = {};
      for(let estudiante of json.datos){
        if(estudiante.estatus_estudiante == "1"){
          hash[estudiante.codigo_cedula_escolar+'-'+estudiante.cedula_escolar] = estudiante;
        }
      }
      this.setState({hashListaEstudiantes: hash});
    })
    .catch( err => console.error(err));
  }

  async consultarProfesor(idAula){
    await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/inscripcion/consultar-aula-profesor/${idAula}`)
    .then( res => {
      let profesor = res.data.datos[0];
      this.setState({
        datos_docente: `${profesor.id_cedula} ${profesor.nombres} ${profesor.apellidos}`
      });
    })
    .catch( err => console.error(err));

  }

  BuscarEstudiante(a){
    this.validarNumero(a)
    let hashEstudiante = JSON.parse(JSON.stringify(this.state.hashListaEstudiantes));

    if(hashEstudiante[a.target.value]){
      let hashAsignacionRepresentante = JSON.parse(JSON.stringify(this.state.hashAsignacionRepresentante));
      let representantes = [];

      for(let id in hashAsignacionRepresentante){
        if(hashAsignacionRepresentante[id].id_estudiante == hashEstudiante[a.target.value].id_estudiante){
          if(hashAsignacionRepresentante[id].estatus_representante == "1"){
            representantes.push({id: hashAsignacionRepresentante[id].id_cedula_representante, descripcion: hashAsignacionRepresentante[id].id_cedula_representante})
          }
        }
      }

      if(representantes.length == 0){
        alert("El estudiante no tiene representantes asignados");
        this.setState({
          estadoBusquedaEstudiante: false,
          hashListaRepresentantes: []
        });
        return ;
      }

      this.buscarRepresentante({target:{value: representantes[0].id, name: "cedula_representante_solicitud"}})
      this.consultarProfesor(hashEstudiante[a.target.value].id_aula)
      this.setState({
        estadoBusquedaEstudiante: true,
        id_inscripcion: hashEstudiante[a.target.value].id_inscripcion,
        id_estudiante: hashEstudiante[a.target.value].id_estudiante,
        nombre_estudiante: hashEstudiante[a.target.value].nombres_estudiante,
        apellido_estudiante: hashEstudiante[a.target.value].apellidos_estudiante,
        id_aula: hashEstudiante[a.target.value].id_aula,
        id_grado: hashEstudiante[a.target.value].id_grado,
        nombre_aula: hashEstudiante[a.target.value].nombre_aula,
        selectRepresentantes: representantes,
      });

      return;
    }
    this.setState({ estadoBusquedaEstudiante: false});
  }

  buscarRepresentante(a){
    this.validarNumero(a);

    let hashAsignacionRepresentante = JSON.parse(JSON.stringify(this.state.hashAsignacionRepresentante));
    let representantes = [];

    for(let id in hashAsignacionRepresentante){
      if(hashAsignacionRepresentante[id].id_cedula_representante == a.target.value){
          this.setState({
            estadoBusquedaRepresentante: true,
            cedula_representante_solicitud: a.target.value,
            nombre_representante: hashAsignacionRepresentante[id].nombres_representante,
            apellido_representante: hashAsignacionRepresentante[id].apellidos_representante
          });
          break;
          return;
      }
    }

    this.setState({
      estadoBusquedaRepresentante: false
    });
  }

  validarNumero(a){
    const input = a.target,
    exprecion= new RegExp("^[0-9-]+$")
    if(input.value!==""){
      if(exprecion.test(input.value)) this.longitudCampo(input)

    }else this.cambiarEstadoDos(input)
  }

  longitudCampo(input){
    if(input.name==="id_estudiante" || input.name === "id_cedula_representante"){
      if(input.value.length <= 8) this.cambiarEstadoDos(input)
    }
    else if(input.name==="cedula_escolar"){
      if(input.value.length <= 16) this.cambiarEstadoDos(input)
    }
  }

  async consultarRetiro(id){
    await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/transaccion/retiro/consultar/${id}`)
    .then( res => {
      this.setState({
        id_retiro: this.props.match.params.id,
        id_inscripcion: res.data.datos[0].id_inscripcion,
        id_estudiante: res.data.datos[0].id_estudiante,
        cedula_escolar: res.data.datos[0].codigo_cedula_escolar+"-"+res.data.datos[0].cedula_escolar,
        nombre_estudiante: res.data.datos[0].nombres_estudiante,
        apellido_estudiante: res.data.datos[0].apellidos_estudiante,
        id_aula: res.data.datos[0].id_aula,
        id_grado: res.data.datos[0].id_grado,
        nombre_aula: res.data.datos[0].nombre_aula,
        cedula_representante_solicitud: res.data.datos[0].id_cedula_representante,
        nombre_representante: res.data.datos[0].nombres_representante,
        apellido_representante: res.data.datos[0].apellidos_representante,
        datos_docente: `${res.data.datos[0].id_cedula} ${res.data.datos[0].nombres} ${res.data.datos[0].apellidos}`,
        selectRepresentantes: [{id: res.data.datos[0].id_cedula_representante, descripcion: res.data.datos[0].id_cedula_representante}],
        motivo_retiro: res.data.datos[0].motivo_retiro,
        estado_retiro:  res.data.datos[0].estado_retiro,
      })

    })
    .catch( err => console.error(err));
  }

  async UNSAFE_componentWillMount(){
    let acessoModulo=await this.validarAccesoDelModulo("/dashboard/transaccion","/retiro-formulario")
    if(acessoModulo){
      const operacion = this.props.match.params.operacion;
      await this.consultarFechaServidor()
      if(operacion === "registrar"){
        await this.ObtenerEstudiantesRepresentantes()
      }else if(operacion === "actualizar"){

        let {id} = this.props.match.params;
        await this.consultarRetiro(id);

        document.getElementById("motivo_retiro").disabled = true;
        document.getElementById("cedula_representante_solicitud").disabled = true;
        document.getElementById("docente").disabled = true;
        document.getElementById("nombre_aula").disabled = true;
        document.getElementById("id_grado").disabled = true;
        document.getElementById("cedula_escolar").disabled = true;
      }


    }else{
        alert("no tienes acesso a este modulo(sera redirigido a la vista anterior)")
        this.props.history.goBack()
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
        console.error(error)
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
          this.setState({fechaServidor: fechaServidor, fecha_inscripcion: fechaServidor})
      })
      .catch(error => {
          console.error("error al conectar con el servidor")
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
              this.props.history.push(`/dashboard/transaccion/promocion${JSON.stringify(mensaje)}`)
          }
      })
      .catch(error=>{
          console.error(error)
      })
      return lista
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
    if(input.name==="id_cedula_profesor"){
      if(input.value.length <= 8) this.cambiarEstadoDos(input)
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
      let msj = this.state["msj_"+nombre_campo]

      if(valor!==""){
        if(this.state.StringExprecion.test(valor)){
          estado=true
          msj[0] = {mensaje: "",color_texto:"rojo"}
          this.setState({["msj_"+nombre_campo]:msj})
        }else{
          msj[0] = {mensaje: "Este campo solo permite letras",color_texto:"rojo"}
          this.setState({["msj_"+nombre_campo]:msj})
        }
      }else{
        msj[0] = {mensaje: "Este campo no puede estar vacio",color_texto:"rojo"}
        this.setState({["msj_"+nombre_campo]:msj})
      }
      return estado
  }

  async agregar(){
    var mensaje=this.state.mensaje
    mensaje.estado=""
    var mensaje_campo=[{mensaje:"",color_texto:""}]
    this.setState({
      //formulario
      id_retiro: "",
      id_inscripcion: "",
      cedula_representante_solicitud: "",
      motivo_retiro: "",
      fecha_retiro: "",
      estado_retiro: "E",
      // Datos alumno
      id_estudiante:"",
      cedula_escolar: "",
      nombre_estudiante: "",
      apellido_estudiante: "",
      // Datos profesor
      datos_docente:"",
      // Datos representante
      nombre_representante: "",
      apellido_representante: "",
      // Datos Aula
      id_aula: "",
      nombre_aula: "",
      id_grado: "",
      listaGrados:[],
      listaAulas:[],
      //MSJ
      msj_id_inscripcion:[{mensaje:"",color_texto:""}],
      msj_cedula_representante_solicitud:[{mensaje:"",color_texto:""}],
      msj_motivo_retiro:[{mensaje:"",color_texto:""}],
      msj_fecha_retiro:[{mensaje:"",color_texto:""}],
      msj_estado_retiro:[{mensaje:"",color_texto:""}],
      msj_id_grado:[{mensaje:"",color_texto:""}],
      msj_cedula_escolar:[{mensaje:"",color_texto:""}],
      //
      hashListaEstudiantes:{},
      selectEstudiantes:[],
    })
    this.props.history.push("/dashboard/transaccion/retiro/registrar")
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
    else mensaje_campo[0] = {mensaje: "Debe de seleccionar una opción", color_texto:"rojo"}

    this.setState({["msj_"+name]:mensaje_campo})
    if(mensaje_campo[0].mensaje === "") return true; else return false;
  }

  validarRadio(name){

    const valor = this.state[name]
    let msj = this.state["msj_"+name]

    if(valor !== "") msj[0] = {mensaje: "", color_texto:"rojo"}
    else msj[0] = {mensaje: "Debe de seleccionar una opción", color_texto:"rojo"}

    if(valor === "E") msj[0] = {mensaje: "No has cambiado el estado de la solicitud", color_texto:"rojo"}
    else msj[0] = {mensaje: "", color_texto:"rojo"}

    if(msj[0].mensaje === "") return true;
    else{
      alert(msj[0].mensaje)
      return false;
    }
  }

  validarFormularioRegistrar(){

    const validaCedulaEscolar = this.validarCampoNumero("cedula_escolar"), validaMotivoRetiro = this.validarCampo('motivo_retiro'),
    validaRepresentante = this.validarSelect('cedula_representante_solicitud')

    if( validaCedulaEscolar && validaMotivoRetiro && validaRepresentante){
      return {estado: true}
    }else return {estado: false}
  }

  validarFormularioActuazliar(){
    const EstadoRetiro = this.validarRadio("estado_retiro")

    if( EstadoRetiro ) return {estado: true}
    else return {estado: false}
  }

  operacion(){
    $(".columna-modulo").animate({
      scrollTop: 0
    }, 1000)
    const operacion=this.props.match.params.operacion

    const mensaje_formulario={
      mensaje:"",
      msj_id_inscripcion:[{mensaje:"",color_texto:""}],
      msj_cedula_representante_solicitud:[{mensaje:"",color_texto:""}],
      msj_motivo_retiro:[{mensaje:"",color_texto:""}],
      msj_fecha_retiro:[{mensaje:"",color_texto:""}],
      msj_estado_retiro:[{mensaje:"",color_texto:""}],
      msj_id_grado:[{mensaje:"",color_texto:""}],
      msj_cedula_escolar:[{mensaje:"",color_texto:""}],
    }

    if(operacion === "registrar"){
      const estado_validar_formulario=this.validarFormularioRegistrar()
      if(estado_validar_formulario.estado){
        this.enviarDatos(estado_validar_formulario,(objeto)=>{
          const mensaje =this.state.mensaje
          var respuesta_servidor=""
          axios.post(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/transaccion/retiro/registrar`,objeto)
          .then(respuesta=>{
            respuesta_servidor=respuesta.data
            mensaje.texto=respuesta_servidor.mensaje
            mensaje.estado=respuesta_servidor.estado
            mensaje.color_alerta=respuesta_servidor.color_alerta
            mensaje_formulario.mensaje=mensaje
            this.setState(mensaje_formulario)
          })
          .catch(error=>{
            mensaje.texto="No se puedo conectar con el servidor"
            mensaje.color_alerta=respuesta_servidor.color_alerta
            mensaje.estado=false
            console.error(error)
            mensaje_formulario.mensaje=mensaje
            this.setState(mensaje_formulario)
          })
        })
      }
    }else if(operacion === "actualizar"){
      const estado_validar_formulario=this.validarFormularioActuazliar()

      if(estado_validar_formulario.estado){
        this.enviarDatos(estado_validar_formulario,(objeto)=>{
          const mensaje =this.state.mensaje
          var respuesta_servidor=""
          axios.put(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/transaccion/retiro/actualizar`,objeto)
            .then(respuesta=>{
              respuesta_servidor=respuesta.data
              mensaje.texto=respuesta_servidor.mensaje
              mensaje.estado=respuesta_servidor.estado_respuesta
              mensaje.color_alerta = respuesta_servidor.color_alerta
              this.setState(mensaje)
            })
            .catch(error=>{
              mensaje.texto = "No se puedo conectar con el servidor"
              mensaje.estado = false
              mensaje.color_alerta = "danger";
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
          retiro:{
            id_retiro: this.state.id_retiro,
            id_inscripcion: this.state.id_inscripcion,
            cedula_representante_solicitud: this.state.cedula_representante_solicitud,
            motivo_retiro: this.state.motivo_retiro,
            fecha_retiro: this.state.fecha_retiro,
            estado_retiro: this.state.estado_retiro,
          },
          token:token
      }
      petion(objeto)
  }

  regresar(){ this.props.history.push("/dashboard/transaccion/retiro/registrar"); }

  render(){
    var jsx_promocion_form=(
        <div className="row justify-content-center">

            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                {this.state.mensaje.texto!=="" && (this.state.mensaje.estado===true || this.state.mensaje.estado===false || this.state.mensaje.estado==="danger") &&
                    <div className="row">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <div className={`alert alert-${(this.state.mensaje.color_alerta)} alert-dismissible`}>
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
                        <span className="titulo-form-trabajador">Retiro de Estudiantes</span>
                    </div>
                </div>
                <form id="form_trabajador">
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
                  <div className="row mt-3">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                          <span className="sub-titulo-form-reposo-trabajador">Datos del estudiante</span>
                      </div>
                  </div>
                  <div className="row justify-content-center align-items-center">
                      <ComponentFormCampo clasesColumna="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4"
                        clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_cedula_escolar[0]}
                        nombreCampo="Cédula escolar:" activo="si" type="text" value={this.state.cedula_escolar}
                        name="cedula_escolar" id="cedula_escolar" placeholder="Cédula escolar" eventoPadre={this.BuscarEstudiante}
                      />
                      <div className='col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5'>
                          <label>Nombre del estudiante: {this.state.nombre_estudiante}</label><br></br>
                          <label>Apellido del estudiante: {this.state.apellido_estudiante}</label>
                      </div>
                  </div>
                  <div className="row justify-content-center align-items-center">
                    <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                      clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_cedula_escolar[0]}
                      nombreCampo="Grado del estudiante:" activo="no" type="text" value={this.state.id_grado}
                      name="id_grado" id="id_grado" placeholder="Grado del estudiante" eventoPadre={this.cambiarEstado}
                    />
                  <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                      clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_cedula_escolar[0]}
                      nombreCampo="Aula del estudiante:" activo="no" type="text" value={this.state.nombre_aula}
                      name="nombre_aula" id="nombre_aula" placeholder="Aula del estudiante" eventoPadre={this.cambiarEstado}
                    />
                  <ComponentFormCampo clasesColumna="col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5"
                        clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_cedula_escolar[0]}
                        nombreCampo="Datos del docente a cargo:" activo="no" type="text" value={this.state.datos_docente}
                        name="docente" id="docente" placeholder="Datos del docente" eventoPadre={this.cambiarEstado}
                      />
                  </div>
                  <div className="row mt-3">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                          <span className="sub-titulo-form-reposo-trabajador">Datos del representante</span>
                      </div>
                  </div>
                  <div className="row justify-content-center align-items-center">
                    <ComponentFormSelect
                      clasesColumna="col-5 col-ms-5 col-md-5 col-lg-5 col-xl-5"
                      obligatorio="si"
                      mensaje={this.state.msj_cedula_representante_solicitud}
                      nombreCampoSelect="Representante:"
                      clasesSelect="custom-select"
                      name="cedula_representante_solicitud"
                      id="cedula_representante_solicitud"
                      eventoPadre={this.buscarRepresentante}
                      defaultValue={this.state.cedula_representante_solicitud}
                      option={this.state.selectRepresentantes}
                    />
                    <div className='col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5'>
                      <label>Nombre del Representante: {this.state.nombre_representante}</label><br></br>
                      <label>Apellido del Representante: {this.state.apellido_representante}</label>
                    </div>
                  </div>

                  <div className="row justify-content-center align-items-center">
                    <ComponentFormTextArea clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                      obligatorio="si" mensaje={this.state.msj_motivo_retiro[0]} nombreCampoTextArea="Motivo del retiro:"
                      clasesTextArear="form-control" name="motivo_retiro" id="motivo_retiro" value={this.state.motivo_retiro}
                      eventoPadre={this.validarTexto}
                    />
                  {this.props.match.params.operacion === "actualizar" &&
                    <ComponentFormRadioMultiState
                      clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                      extra="custom-control-inline"
                      nombreCampoRadio="Estatus de solicitud:"
                      name="estado_retiro"
                      nombreLabelRadio={["En Espera","Rechazado","Aprobado"]}
                      checkedRadio={this.state.estado_retiro}

                      idRadio={["estatusRetiro0","estatusRetiro1","estatusRetiro2"]}

                      estates={this.state.estados}
                      eventoPadre={this.cambiarEstado}
                    />
                  }
                  </div>
                    <div className="row justify-content-center">
                        <div className="col-auto">
                        {this.props.match.params.operacion === "registrar" &&
                          <InputButton
                            clasesBoton="btn btn-primary"
                            id="boton-registrar"
                            value="Registrar"
                            eventoPadre={this.operacion}
                            />
                        }

                        {this.props.match.params.operacion === "actualizar" &&
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
          componente={jsx_promocion_form}
          modulo={this.state.modulo}
          eventoPadreMenu={this.mostrarModulo}
          estado_menu={this.state.estado_menu}
          />
        </div>
    )
  }
}

export default withRouter(ComponentRetiroForm)
