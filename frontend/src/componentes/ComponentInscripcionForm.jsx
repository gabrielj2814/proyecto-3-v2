import React from 'react';
import {withRouter} from 'react-router-dom'
import $ from "jquery"
import moment from "moment"
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

class ComponentInscripcionForm extends React.Component{
  constructor(){
    super();
    this.GetRepresentant_Estudiant = this.GetRepresentant_Estudiant.bind(this);
    this.consultarPerfilTrabajador=this.consultarPerfilTrabajador.bind(this)
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
    this.Consultar_ano_escolar = this.Consultar_ano_escolar.bind(this)
    this.obtenerDatosDeLasesion = this.obtenerDatosDeLasesion.bind(this)
    this.Consultar_asignacion_aula = this.Consultar_asignacion_aula.bind(this)
    // this.consultarRepresentante=this.consultarRepresentante.bind(this)

    this.state={
        // ------------------
        modulo:"",// modulo menu
        estado_menu:false,
        //formulario
        id_inscripcion: "",
        id_estudiante: "",
        cedula_escolar: "",
        id_asignacion_representante_estudiante: "",
        id_asignacion_aula_profesor: "",
        fecha_inscripcion: "",
        estatus_inscripcion: "I",
        inscripcion_regular: "R",
        //
        id_profesor: "",
        id_ano_escolar: "",
        nombre_estudiante: "",
        apellido_estudiante: "",
        cedula_profesor: "",
        nombre_ano_escolar: "",
        nombre_aula: "",
        numero_grado: "",
        cupos_disponibles: "",
        //MSJ
        msj_cedula_escolar:[{mensaje:"",color_texto:""}],
        msj_id_asignacion_representante_estudiante:[{mensaje:"",color_texto:""}],
        msj_fecha_inscripcion:[{mensaje:"",color_texto:""}],
        msj_estatus_inscripcion:[{mensaje:"",color_texto:""}],
        msj_inscripcion_regular: [{ mensaje: "", color_texto: "" }],
        //// combo box
        lista_representantes: [],
        estates_radios: ['I','E','R','T'],
        estates_inscripcion: ["R", "P"],
        hashAsignacionRepresentante:{},
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
        StringExprecion: /[A-Za-z]|[0-9]/,
        mostarFomrulario:true
    }
  }

  async obtenerDatosDeLasesion(){
      const token=localStorage.getItem("usuario")
      await axiosCustom.get(`login/verificar-sesion${token}`)
      .then(respuesta=>{
          let respuesta_servior=respuesta.data
          if(respuesta_servior.usuario){
              this.setState({
                  cedula_profesor:respuesta_servior.usuario.id_cedula
              })
          }
      })
      .catch(error => {
          let mensaje=JSON.parse(JSON.stringify(this.state.mensaje))
          mensaje.estado="danger"
          mensaje.texto="error al conectarse con el servidor"
          this.setState({mensaje})
      })
  }

  async Consultar_asignacion_aula(){
    await axiosCustom.get(`transaccion/asignacion-aula-profesor/consultar-asignacion-actual/${this.state.cedula_profesor}`)
    .then( respuesta => {
      let respuesta_servior = respuesta.data;

      if(respuesta_servior.datos.id_asignacion_aula_profesor){
        let mensaje = {};

        if(respuesta_servior.datos.estatus_aula != "1"){
          mensaje.estado=false
          mensaje.texto="El aula no esta habilitada"
          this.setState({mensaje})
          return ;
        }

        if(respuesta_servior.datos.estatus_grado != "1"){
          mensaje.estado=false
          mensaje.texto="El grado no esta habilitado"
          this.setState({mensaje})
          return ;
        }

        if(respuesta_servior.cuposRestantes <= 0){
          alert("Ya no hay cupos disponibles para seguir inscribiendo");
          this.props.history.push(`/dashboard/configuracion/inscripcion`)
          return false;
        }

        this.setState({
          id_profesor: respuesta_servior.datos.id_profesor,
          id_asignacion_aula_profesor: respuesta_servior.datos.id_asignacion_aula_profesor,
          numero_grado: respuesta_servior.datos.numero_grado,
          nombre_aula: respuesta_servior.datos.nombre_aula,
          nombre_ano_escolar: `${respuesta_servior.datos.ano_desde}-${respuesta_servior.datos.ano_hasta}`,
          cupos_disponibles: respuesta_servior.cuposRestantes
        });

        return true;
      }else{
        alert("Este profesor no tiene Aula asignada(será redirigido a la vista anterior)")
        this.props.history.push(`/dashboard/configuracion/inscripcion`)
        return false;
      }
    })
    .catch(error => {
        let mensaje=JSON.parse(JSON.stringify(this.state.mensaje))
        mensaje.estado=false
        mensaje.text="error al conectarse con el servidor"
        this.setState({mensaje})
    })
  }

  async Consultar_ano_escolar(){
    return await axiosCustom.get(`configuracion/ano-escolar/consultar-ano-escolar-activo/`)
    .then( res => {
      if(res.data.color_alerta == "danger"){
        let mensaje = {};
        mensaje.texto=res.data.mensaje
        mensaje.estado=res.data.color_alerta
        // this.props.history.push(`/dashboard/configuracion/inscripcion${JSON.stringify(mensaje)}`)
        this.setState({mensaje})
        return false;
      }

      this.setState({id_ano_escolar: res.data.datos[0].id_ano_escolar})
      return true;
    })
    .catch( error => {
      console.error(error)
      return false;
    })
  }

  async UNSAFE_componentWillMount(){
    let acessoModulo=await this.validarAccesoDelModulo("/dashboard/configuracion","/inscripcion")
    if(acessoModulo){
      await this.consultarFechaServidor()
      await this.consultarFechaInscripcionActual()
      let apertura=true
      if(this.state.mostarFomrulario===apertura){
        let responseAnoEscolar = await this.Consultar_ano_escolar();
        if(responseAnoEscolar){
          await this.GetRepresentant_Estudiant()
          await this.obtenerDatosDeLasesion();
          let res = await this.Consultar_asignacion_aula();
          if(res){
            const operacion = this.props.match.params.operacion
            document.getElementById("activoestudianter1").disabled = true;
            document.getElementById("activoestudianter2").disabled = true;
            document.getElementById("activoestudianter3").disabled = true;
            document.getElementById("activoestudianter4").disabled = true;
          }


        }else{
          document.getElementById("cedula_escolar").disabled = true;
          document.getElementById("boton-registrar").disabled = true;
        }
      }

    }else{
        alert("No tienes acesso a este modulo(será redirigido a la vista anterior)")
        this.props.history.goBack()
    }
  }

  async consultarFechaInscripcionActual(){
    this.setState({mostarFomrulario:false})
    await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/fecha-inscripcion/consultar-fecha-inscripcion-actual`)
    .then(async respuesta=>{
        let respuesta_servior = respuesta.data

        let fecha_incripcion_desde=respuesta_servior.datos.fecha_incripcion_desde
        let fecha_incripcion_hasta=respuesta_servior.datos.fecha_incripcion_hasta
        let fecha_tope_inscripcion=respuesta_servior.datos.fecha_tope_inscripcion
        let estado_reapertura_inscripcion=respuesta_servior.datos.estado_reapertura_inscripcion
        let apertura="1"
        if(moment(this.state.fechaServidor).isSameOrAfter(fecha_incripcion_desde)){
          if(moment(this.state.fechaServidor).isSameOrBefore(fecha_incripcion_hasta)){
            this.setState({mostarFomrulario:true})
          }
          else{
            if(estado_reapertura_inscripcion===apertura){
              if(moment(this.state.fechaServidor).isSameOrBefore(fecha_tope_inscripcion)){
                alert("OK todavia esta a tiempo")
                this.setState({mostarFomrulario:true})
              }
              else{
                alert("Su pero la Fecha tope de la reapertura de inscripción")
                this.props.history.push(`/dashboard/configuracion/inscripcion`)
              }
            }
            else{
              alert("NO se ha Reaperturado la inscripción")
              this.props.history.push(`/dashboard/configuracion/inscripcion`)
            }
          }
        }
        else{
          alert("No se ha Abierto las Inscripciones")
          this.props.history.push(`/dashboard/configuracion/inscripcion`)
        }
    })
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
        console.error(error)
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
          console.error(error)
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
      id_inscripcion: "",
      id_estudiante: "",
      cedula_escolar: "",
      id_asignacion_representante_estudiante: "",
      id_asignacion_aula_profesor: "",
      fecha_inscripcion: "",
      estatus_inscripcion: "I",
      inscripcio_regular: "",
      //
      id_profesor: "",
      id_ano_escolar: "",
      nombre_estudiante: "",
      apellido_estudiante: "",
      cedula_profesor: "",
      nombre_ano_escolar: "",
      nombre_aula: "",
      numero_grado: "",
      cupos_disponibles: "",
      //MSJ
      msj_cedula_escolar:[{mensaje:"",color_texto:""}],
      msj_id_asignacion_representante_estudiante:[{mensaje:"",color_texto:""}],
      msj_fecha_inscripcion:[{mensaje:"",color_texto:""}],
      msj_estatus_inscripcion:[{mensaje:"",color_texto:""}],
    })
    this.props.history.push("/dashboard/configuracion/inscripcion/registrar")
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
    let msj = this.state["msj_"+name]

    if(valor !== "") msj[0] = {mensaje: "", color_texto:"rojo"}
    else msj[0] = {mensaje: "Debe de seleccionar una opción", color_texto:"rojo"}

    this.setState({ ["msj_" + name]: msj})
    if(msj[0].mensaje === "") return true;
    else{
      alert(msj[0].mensaje)
      document.getElementsByName(name)[0].focus();
      return false
    };
  }

  validarFormularioRegistrar(){
      const validar_cedula_escolar = this.validarCampoNumero('cedula_escolar'),
        validaRepresentante = this.validarRadio('id_asignacion_representante_estudiante'), validaEstadoInscripcion = this.validarRadio("inscripcion_regular");

    if (validar_cedula_escolar && validaRepresentante && validaEstadoInscripcion){
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
          msj_cedula_escolar:[{mensaje:"",color_texto:""}],
          msj_id_asignacion_representante_estudiante:[{mensaje:"",color_texto:""}],
          msj_fecha_inscripcion:[{mensaje:"",color_texto:""}],
          msj_estatus_inscripcion:[{mensaje:"",color_texto:""}],
      }
      if(operacion==="registrar"){

          const estado_validar_formulario=this.validarFormularioRegistrar()
          if(estado_validar_formulario.estado){
              this.enviarDatos(estado_validar_formulario,(objeto)=>{
                  const mensaje =this.state.mensaje
                  var respuesta_servidor=""
                  axios.post(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/inscripcion/registrar`,objeto)
                  .then(respuesta=>{
                      respuesta_servidor=respuesta.data
                      mensaje.texto=respuesta_servidor.mensaje
                      mensaje.estado=respuesta_servidor.estado_respuesta
                      mensaje_formulario.mensaje=mensaje
                      this.Consultar_asignacion_aula();
                      this.setState(mensaje_formulario)
                  })
                  .catch(error=>{
                      mensaje.texto="No se puedo conectar con el servidor"
                      mensaje.estado=false
                      console.error(error)
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
          inscripcion:{
            id_inscripcion: this.state.id_inscripcion,
            id_estudiante: this.state.id_estudiante,
            id_asignacion_representante_estudiante: this.state.id_asignacion_representante_estudiante,
            id_asignacion_aula_profesor: this.state.id_asignacion_aula_profesor,
            fecha_inscripcion: this.state.fecha_inscripcion,
            estatus_inscripcion: this.state.estatus_inscripcion,
            inscripcion_regular: this.state.inscripcion_regular
          },
          token:token
      }
      petion(objeto)
  }

  regresar(){ this.props.history.push("/dashboard/configuracion/inscripcion"); }

  BuscarEstudiante(a){

    this.validarNumero(a)
    let hashEstudiante = JSON.parse(JSON.stringify(this.state.hashEstudiante));

    if(hashEstudiante[a.target.value]){
      let hashAsignacionRepresentante = JSON.parse(JSON.stringify(this.state.hashAsignacionRepresentante));
      let representantes = [];

      for(let id in hashAsignacionRepresentante){
        if(hashAsignacionRepresentante[id].id_estudiante == hashEstudiante[a.target.value].id_estudiante){
          representantes.push(hashAsignacionRepresentante[id])
        }
      }

      if(representantes.length == 0){
        alert("El estudiante no tiene representantes asignados");
        return ;
      }

      this.setState({
        estadoBusquedaEstudiante: true,
        id_estudiante: hashEstudiante[a.target.value].id_estudiante,
        nombre_estudiante: hashEstudiante[a.target.value].nombres_estudiante,
        apellido_estudiante: hashEstudiante[a.target.value].apellidos_estudiante,
        lista_representantes: [representantes]
      });

      return;
    }
    this.setState({ estadoBusquedaEstudiante: false});

  }

  async GetRepresentant_Estudiant(){
    await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/asignacion-representante-estudiante/consultar-todos`)
    .then( res => {
      let json = JSON.parse(JSON.stringify(res.data));
      let hash = {}, ultimoId;

      for(let asignacion of json.datos){

        if (hash[ultimoId] && ultimoId != null){

          if(hash[ultimoId].id_cedula_representante != asignacion.id_cedula_representante){
            hash[asignacion.id_asignacion_representante_estudiante] = asignacion;
          }
        }else{
          hash[asignacion.id_asignacion_representante_estudiante] = asignacion;
        }
        ultimoId = asignacion.id_asignacion_representante_estudiante
      }

      this.setState({hashAsignacionRepresentante:hash})

    })
    .catch( err => console.error(err));

    await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/estudiante/consultar-todos`)
    .then( res => {
      let json = JSON.parse(JSON.stringify(res.data));
      let hash = {};
      for(let estudiante of json.datos){
        hash[estudiante.codigo_cedula_escolar+'-'+estudiante.cedula_escolar] = estudiante;
      }
      this.setState({hashEstudiante: hash});
    })
    .catch( err => console.error(err));
  }

  render(){
    var jsx_inscripcion_form=(
        <div className="row justify-content-center">

            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                {this.state.mensaje.texto!=="" && (this.state.mensaje.estado===true || this.state.mensaje.estado===false || this.state.mensaje.estado==="danger") &&
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
                        <span className="titulo-form-trabajador">Formulario de Inscripción Estudiante</span>
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
                  <div className="row mt-3">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                          <span className="sub-titulo-form-reposo-trabajador">Estudiante</span>
                      </div>
                  </div>
                  <div className="row justify-content-center align-items-center">
                      <ComponentFormCampo clasesColumna="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4"
                        clasesCampo="form-control font-weight-bold" obligatorio="si" mensaje={this.state.msj_cedula_escolar[0]}
                        nombreCampo="Cédula escolar:" activo="si" type="text" value={this.state.cedula_escolar}
                        name="cedula_escolar" id="cedula_escolar" placeholder="Cédula escolar" eventoPadre={this.BuscarEstudiante}
                      />
                      <div className='col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5'>
                  <label>Nombre del estudiante:  <span className="font-weight-bold">{this.state.nombre_estudiante}</span></label><br></br>
                  <label>Apellido del estudiante:  <span className="font-weight-bold">{this.state.apellido_estudiante}</span></label>
                      </div>

                  </div>

                  <div className="row mt-3">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                          <span className="sub-titulo-form-reposo-trabajador">Representantes</span>
                      </div>
                  </div>
                  <div className="row justify-content-center align-items-center">
                    <ComponentFormRadioMultiState
                      clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                      extra="custom-control-inline font-weight-bold"
                      nombreCampoRadio="Representantes :"
                      name="id_asignacion_representante_estudiante"
                      nombreUnico={["V-","id_cedula_representante","nombres_representante","apellidos_representante","tipo_representante"]}
                      checkedRadio={this.state.id_asignacion_representante_estudiante}

                      idRadio={["repre0","repre1","repre2","repre3","repre4"]}

                      estates={this.state.lista_representantes}
                      eventoPadre={this.cambiarEstado}
                    />
                  </div>

                  <div className="row mt-3">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                          <span className="sub-titulo-form-reposo-trabajador">Datos académicos</span>
                      </div>
                  </div>

                  <div className="row justify-content-center mt-1">
                    <ComponentFormCampo clasesColumna="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2"
                    clasesCampo="form-control font-weight-bold" obligatorio="si"
                      nombreCampo="Año Escolar:" activo="no" type="text" value={this.state.nombre_ano_escolar}
                      name="ano_escolar" id="ano_escolar" placeholder="Año escolar"
                    />
                    <ComponentFormCampo clasesColumna="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2"
                      clasesCampo="form-control font-weight-bold" obligatorio="si"
                      nombreCampo="Grado Escolar:" activo="no" type="text" value={this.state.numero_grado}
                      name="grado_escolar" id="grado_escolar" placeholder="Grado escolar"
                    />
                    <ComponentFormCampo clasesColumna="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2"
                      clasesCampo="form-control font-weight-bold" obligatorio="si"
                      nombreCampo="Nombre del aula:" activo="no" type="text" value={this.state.nombre_aula}
                      name="nombre_aula" id="nombre_aula" placeholder="Nombre del aula"
                    />
                    <ComponentFormCampo clasesColumna="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2"
                      clasesCampo="form-control font-weight-bold" obligatorio="si"
                      nombreCampo="Cupos restantes:" activo="no" type="text" value={this.state.cupos_disponibles}
                      name="cupos__disponibles" id="cupos__disponibles" placeholder="Cupos restantes"
                    />


                    <ComponentFormRadioMultiState
                    clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                    extra="custom-control-inline"
                    nombreCampoRadio="Estatus de la asignacion:"
                    name="estatus_inscripcion"
                    nombreLabelRadio={["Inscrito","Espera","Retiro","Terminado"]}
                    checkedRadio={this.state.estatus_inscripcion}

                    idRadio={["activoestudianter0","activoestudianter1","activoestudianter3","activoestudianter4"]}

                    estates={this.state.estates_radios}
                    eventoPadre={this.cambiarEstado}
                  />

              <ComponentFormRadioMultiState
                clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                extra="custom-control-inline"
                nombreCampoRadio="Condición de la inscripción:"
                name="inscripcion_regular"
                nombreLabelRadio={["Regular","Repitiente",]}
                checkedRadio={this.state.inscripcion_regular}

                idRadio={["inscripcion0", "inscripcion1"]}

                estates={this.state.estates_inscripcion}
                eventoPadre={this.cambiarEstado}
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
    )

    return(
        <div className="component_trabajador_form">
          <ComponentDashboard
          componente={jsx_inscripcion_form}
          modulo={this.state.modulo}
          eventoPadreMenu={this.mostrarModulo}
          estado_menu={this.state.estado_menu}
          />
        </div>
    )
  }
}

export default withRouter(ComponentInscripcionForm)
