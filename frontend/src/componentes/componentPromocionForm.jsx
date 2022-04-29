import React from 'react';
import {withRouter} from 'react-router-dom'
import $ from "jquery"
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentPromocionForm.css'
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

class ComponentPromocionForm extends React.Component{
  constructor(){
    super();
    this.consultarPerfilTrabajador=this.consultarPerfilTrabajador.bind(this)
    this.BuscarProfesor = this.BuscarProfesor.bind(this);
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
    this.busquedaEstudiante = this.busquedaEstudiante.bind(this)
    this.ConsultarEstudiantesProfesor = this.ConsultarEstudiantesProfesor.bind(this);
    this.consultarProfesores = this.consultarProfesores.bind(this);
    this.consultarPromocion = this.consultarPromocion.bind(this);
    this.consultarPromocionPorId = this.consultarPromocionPorId.bind(this)
    this.state={
        // ------------------
        modulo:"",// modulo menu
        estado_menu:false,
        //formulario
        id_promocion:"",
        id_inscripcion:"",
        descripcion_logro:"",
        recomendacion_pariente:"",
        nota_promocion:"",
        descripcion_nota_promocion:"",
        dias_promocion:"",
        estatus_promocion: "E",
        nota_rezacho_promocion: "",
        // Datos alumno
        cedula_escolar: "",
        nombre_estudiante: "",
        apellido_estudiante: "",
        // Datos profesor
        id_cedula_profesor: "",
        nombre_profesor: "",
        apellido_profesor: "",
        //MSJ
        msj_id_inscripcion:[{mensaje:"",color_texto:""}],
        msj_descripcion_logro:[{mensaje:"",color_texto:""}],
        msj_recomendacion_pariente:[{mensaje:"",color_texto:""}],
        msj_nota_promocion:[{mensaje:"",color_texto:""}],
        msj_descripcion_nota_promocion:[{mensaje:"",color_texto:""}],
        msj_dias_promocion:[{mensaje:"",color_texto:""}],
        msj_id_cedula_profesor:[{mensaje:"",color_texto:""}],
        msj_estatus_promocion:[{mensaje:"",color_texto:""}],
        msj_nota_rezacho_promocion:[{mensaje:"",color_texto:""}],
        //// combo box
        lista_profesores: [],
        notas:['A','B','C','D','E','F'],
        estados_promocion: ['A','R','E'],
        hashListaProfesores:{},
        hashListaEstudiantes:{},
        selectEstudiantes:[],
        estadoBusquedaProfesor: false,
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

  async busquedaEstudiante(id){
    let hashListaEstudiantes = JSON.parse(JSON.stringify(this.state.hashListaEstudiantes));
    if(hashListaEstudiantes[id]){
      let busqueda = await this.consultarPromocion(id);

      if(busqueda){
        this.setState({
          nombre_estudiante: hashListaEstudiantes[id].nombres_estudiante,
          apellido_estudiante: hashListaEstudiantes[id].apellidos_estudiante
        });
      }else{
        this.setState({
          nombre_estudiante: hashListaEstudiantes[id].nombres_estudiante,
          apellido_estudiante: hashListaEstudiantes[id].apellidos_estudiante,
          operacion: "Registrar"
        });
      }
    }
  }

  async consultarPromocion(id){
      return await axiosCustom.get(`transaccion/promocion/consultar-promocion-por-inscripcion/${id}`)
      .then(respuesta =>{
          if(respuesta.data.datos.length > 0){
            let datos = respuesta.data.datos[0]

            this.setState({
              id_promocion: datos.id_promocion,
              id_inscripcion: datos.id_inscripcion,
              descripcion_logro: datos.descripcion_logro,
              recomendacion_pariente: datos.recomendacion_pariente,
              nota_promocion: datos.nota_promocion,
              descripcion_nota_promocion: datos.descripcion_nota_promocion,
              dias_promocion: datos.dias_promocion,
              estatus_promocion: datos.estatus_promocion,
              nota_rezacho_promocion: datos.nota_rezacho_promocion,
              operacion: "Actualizar",
            });

            if(datos.estatus_promocion === "R") document.getElementById("nota_rezacho_promocion").disabled = true;

            return true;
          }else{
            this.setState({
              id_promocion: "",
              id_inscripcion: id,
              descripcion_logro: "",
              recomendacion_pariente: "",
              nota_promocion: "",
              descripcion_nota_promocion: "",
              dias_promocion: "",
              estatus_promocion: "E",
              nota_rezacho_promocion: "",
              operacion: "Registrar",
            });
            return false;
          }
      })
      .catch(error => {
          console.error(error)
      })
  }

  async consultarPromocionPorId(id_promocion){
      return await axiosCustom.get(`transaccion/promocion/consultar-promocion/${id_promocion}`)
      .then(respuesta =>{
          if(respuesta.data.datos.length > 0){
            let datos = respuesta.data.datos[0]

            this.setState({
              id_promocion: datos.id_promocion,
              id_inscripcion: datos.id_inscripcion,
              descripcion_logro: datos.descripcion_logro,
              recomendacion_pariente: datos.recomendacion_pariente,
              nota_promocion: datos.nota_promocion,
              descripcion_nota_promocion: datos.descripcion_nota_promocion,
              dias_promocion: datos.dias_promocion,
              estatus_promocion: datos.estatus_promocion,
              nota_rezacho_promocion: datos.nota_rezacho_promocion,
              // Datos alumno
              cedula_escolar: datos.codigo_cedula_escolar+'-'+datos.cedula_escolar,
              nombre_estudiante: datos.nombres_estudiante,
              apellido_estudiante: datos.apellidos_estudiante,
              // Datos profesor
              id_cedula_profesor: datos.id_cedula,
              nombre_profesor: datos.nombres,
              apellido_profesor: datos.apellidos,
              operacion: "Actualizar"
            })
          }
      })
      .catch(error => {
          console.error(error)
      })
  }

  BuscarProfesor(a){
    this.validarNumero(a)
    let hashProfesores = JSON.parse(JSON.stringify(this.state.hashListaProfesores));

    if(hashProfesores[a.target.value]){
      this.setState({
        id_cedula_profesor: hashProfesores[a.target.value].id_cedula,
        nombre_profesor: hashProfesores[a.target.value].nombres,
        apellido_profesor: hashProfesores[a.target.value].apellidos,
        estadoBusquedaProfesor: true,
      })
      this.ConsultarEstudiantesProfesor(a.target.value)

    }else this.setState({ estadoBusquedaProfesor: false});
  }

  async ConsultarEstudiantesProfesor(value){
    return await axiosCustom.get(`transaccion/promocion/consultar-estudiantes/${value}`)
    .then( res => {
      if(res.data.color_alerta == "danger"){
        let mensaje = {};
        mensaje.texto = res.data.mensaje
        mensaje.estado = true;
        mensaje.color_alerta = res.data.color_alerta
        this.setState({mensaje})
        return false;
      }

      let lista = res.data.datos.map( item => {
        return {'id':item.id_inscripcion,'descripcion': `${item.codigo_cedula_escolar}-${item.cedula_escolar}`};
      })

      let json=JSON.parse(JSON.stringify(res.data))
      let hash={}
      for(let estudiante of json.datos){
          hash[estudiante.id_inscripcion] = estudiante
      }

      this.setState({
        hashListaEstudiantes: hash,
        selectEstudiantes: lista,
        id_inscripcion: lista[0].id,
      });

      this.busquedaEstudiante(lista[0].id)
      return true;
    })
    .catch( error => {
      console.error(error)
      return false;
    })
  }

  async consultarProfesores(){
      await axiosCustom.get(`configuracion/profesor/consultar-todos`)
      .then(respuesta =>{
          let json=JSON.parse(JSON.stringify(respuesta.data))
          let hash={}
          for(let profesor of json.datos){
              hash[profesor.id_cedula]=profesor
          }
          this.setState({hashListaProfesores:hash})
      })
      .catch(error => {
          console.error(error)
      })
  }

  async UNSAFE_componentWillMount(){
    let acessoModulo=await this.validarAccesoDelModulo("/dashboard/transaccion","/promocion")
    if(acessoModulo){
      await this.consultarFechaServidor()
      await this.consultarProfesores();
      const operacion = this.props.match.params.operacion;

      if(operacion === "actualizar"){
        await this.consultarPromocionPorId(this.props.match.params.id)
        document.getElementById("nota_rezacho_promocion").disabled = true;
      }

      if(operacion === "evaluacion"){

        let accesoModuloGestion = await this.validarAccesoDelModulo("/dashboard/transaccion","/promocion-gestion")
        if(accesoModuloGestion){
          await this.consultarPromocionPorId(this.props.match.params.id)
          for(let i = 0; i < 5; i++){
            document.getElementById(`nota${i}`).disabled = true;
          }
          document.getElementById("descripcion_nota_promocion").disabled = true;
        }else{
          alert("no tienes acesso a este modulo(sera redirigido a la vista anterior)")
          this.props.history.goBack()
        }
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
              this.props.history.push(`/dashboard/transaccion/promocion${JSON.stringify(mensaje)}`)
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
    if(input.name==="id_cedula_profesor"){
      if(input.value.length <= 8) this.cambiarEstadoDos(input)
    }
    else if(input.name==="cedula_escolar"){
      if(input.value.length <= 16) this.cambiarEstadoDos(input)
    }
    else if(input.name === "dias_promocion"){
      if(input.value.length <= 2) this.cambiarEstadoDos(input)
    }
  }

  cambiarEstadoDos(input){ this.setState({[input.name]:input.value}) }

  cambiarEstado(a){
    var input=a.target;
    if(input.name == "id_inscripcion") this.busquedaEstudiante(input.value)
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
          msj[0] = {mensaje: "este campo solo permite letras",color_texto:"rojo"}
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
      id_promocion:"",
      id_inscripcion:"",
      descripcion_logro:"",
      recomendacion_pariente:"",
      nota_promocion:"",
      descripcion_nota_promocion:"",
      dias_promocion:"",
      // Datos alumno
      cedula_escolar: "",
      nombre_estudiante: "",
      apellido_estudiante: "",
      // Datos profesor
      id_cedula_profesor: "",
      nombre_profesor: "",
      apellido_profesor: "",
      //MSJ
      msj_id_inscripcion:[{mensaje:"",color_texto:""}],
      msj_descripcion_logro:[{mensaje:"",color_texto:""}],
      msj_recomendacion_pariente:[{mensaje:"",color_texto:""}],
      msj_nota_promocion:[{mensaje:"",color_texto:""}],
      msj_descripcion_nota_promocion:[{mensaje:"",color_texto:""}],
      msj_dias_promocion:[{mensaje:"",color_texto:""}],
      msj_id_cedula_profesor:[{mensaje:"",color_texto:""}],
      //
      hashListaEstudiantes:{},
      selectEstudiantes:[],
    })
    this.props.history.push("/dashboard/transaccion/promocion/registrar")
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
    else mensaje_campo[0] = {mensaje: "Debe de seleccionar una opcion", color_texto:"rojo"}

    this.setState({["msj_"+name]:mensaje_campo})
    if(mensaje_campo[0].mensaje === "") return true; else return false;
  }

  validarRadio(name){

    const valor = this.state[name]
    let msj = this.state["msj_"+name]

    if(valor !== "") msj[0] = {mensaje: "", color_texto:"rojo"}
    else msj[0] = {mensaje: "Debe de seleccionar una opción", color_texto:"rojo"}

    this.setState({["msj_"+name]: msj})
    if(msj[0].mensaje === "") return true;
    else{
      alert(msj[0].mensaje)
      document.getElementsByName(name)[0].focus();
      return false
    };
  }

  validarFormularioRegistrar(){

    const validaCedulaProfesor = this.validarCampoNumero("id_cedula_profesor"), validaDescripcionNota = this.validarCampo('descripcion_nota_promocion'), validaInscripcion = this.validarSelect('id_inscripcion'),
    validaRecomendacionPariente = this.validarCampo('recomendacion_pariente'), validarDescripcionLogro = this.validarCampo('descripcion_logro'),
    validarNotaPromocion = this.validarRadio('nota_promocion'),validaDiasPromocion = this.validarCampoNumero('dias_promocion')

    if( validaDescripcionNota && validaInscripcion && validaRecomendacionPariente && validarDescripcionLogro && validarNotaPromocion && validaDiasPromocion){
      return {estado: true}
    }else return {estado: false}
  }

  validarFormularioActualizacion(){
    const validaCedulaProfesor = this.validarCampoNumero("id_cedula_profesor"), validaDescripcionNota = this.validarCampo('descripcion_nota_promocion'), validaInscripcion = this.validarSelect('id_inscripcion'),
    validaRecomendacionPariente = this.validarCampo('recomendacion_pariente'), validarDescripcionLogro = this.validarCampo('descripcion_logro'),
    validarNotaPromocion = this.validarRadio('nota_promocion'),validaDiasPromocion = this.validarCampoNumero('dias_promocion'),
    validarEstadoPromocion = this.validarRadio("estatus_promocion")

    if( validaDescripcionNota && validaInscripcion && validaRecomendacionPariente && validarDescripcionLogro && validarNotaPromocion
      && validaDiasPromocion,validarEstadoPromocion){
        if(this.props.match.params.operacion === "evaluacion"){

          if(this.state.estatus_promocion === "R"){
            let validacionObservacion = this.validarCampo("nota_rezacho_promocion")
            if(validacionObservacion) return {estado: true}
            else return {estado: false}
          }else if(this.state.estatus_promocion === "E"){
            alert("Debes de cambiar el estado de esta promoción")
            return {estado: false}
          }else return {estado: true}
        }else return {estado: true}

    }else return {estado: false}
  }

  operacion(){
    $(".columna-modulo").animate({
      scrollTop: 0
    }, 1000)
    const operacion=this.state.operacion

    const mensaje_formulario={
      mensaje:"",
      //formulario
      id_promocion:"",
      id_inscripcion:"",
      descripcion_logro:"",
      recomendacion_pariente:"",
      nota_promocion:"",
      descripcion_nota_promocion:"",
      dias_promocion:"",
      // Datos alumno
      cedula_escolar: "",
      nombre_estudiante: "",
      apellido_estudiante: "",
      // Datos profesor
      id_cedula_profesor: "",
      nombre_profesor: "",
      apellido_profesor: "",
      //
      msj_id_inscripcion:[{mensaje:"",color_texto:""}],
      msj_descripcion_logro:[{mensaje:"",color_texto:""}],
      msj_recomendacion_pariente:[{mensaje:"",color_texto:""}],
      msj_nota_promocion:[{mensaje:"",color_texto:""}],
      msj_descripcion_nota_promocion:[{mensaje:"",color_texto:""}],
      msj_dias_promocion:[{mensaje:"",color_texto:""}],
      msj_id_cedula_profesor:[{mensaje:"",color_texto:""}],
    }
    if(operacion === "Registrar"){
      const estado_validar_formulario=this.validarFormularioRegistrar()
      if(estado_validar_formulario.estado){
        this.enviarDatos(estado_validar_formulario,(objeto)=>{
          const mensaje =this.state.mensaje
          var respuesta_servidor=""
          axios.post(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/transaccion/promocion/crear-promocion`,objeto)
          .then(respuesta=>{
            respuesta_servidor=respuesta.data
            mensaje.texto=respuesta_servidor.mensaje
            mensaje.estado=respuesta_servidor.estado_respuesta
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
    }else if(operacion === "Actualizar"){
      const estado_validar_formulario=this.validarFormularioActualizacion()

      if(estado_validar_formulario.estado){
        this.enviarDatos(estado_validar_formulario,(objeto)=>{
          const mensaje =this.state.mensaje
          var respuesta_servidor=""
          axios.put(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/transaccion/promocion/actualizar/${this.state.id_inscripcion}`,objeto)
            .then(respuesta=>{
              respuesta_servidor=respuesta.data
              mensaje.texto=respuesta_servidor.mensaje
              mensaje.estado=respuesta_servidor.estado_respuesta
              mensaje.color_alerta = respuesta_servidor.color_alerta
              mensaje_formulario.mensaje=mensaje
              this.setState(mensaje_formulario)
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
          promocion:{
            id_promocion: this.state.id_promocion,
            id_inscripcion: this.state.id_inscripcion,
            descripcion_logro: this.state.descripcion_logro,
            recomendacion_pariente: this.state.recomendacion_pariente,
            nota_promocion: this.state.nota_promocion,
            descripcion_nota_promocion: this.state.descripcion_nota_promocion,
            dias_promocion: this.state.dias_promocion,
            fecha_promocion: "",
            estatus_promocion: (this.props.match.params.operacion === "evaluacion") ? this.state.estatus_promocion : "E",
            nota_rezacho_promocion: this.state.nota_rezacho_promocion,
          },
          token:token
      }
      console.log(objeto)
      petion(objeto)
  }

  regresar(){ this.props.history.push("/dashboard"); }

  render(){
    let operacion_Camp = this.props.match.params.operacion;
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
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-promocion">
                        <span className="titulo-form-promocion">Promoción de Estudiantes</span>
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
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-promocion">
                          <span className="sub-titulo-form-promocion">Profesor</span>
                      </div>
                  </div>
                  <div className="row justify-content-center align-items-center">
                      <ComponentFormCampo clasesColumna="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4"
                        clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_id_cedula_profesor[0]}
                        nombreCampo="Cédula:" activo={(operacion_Camp === "registrar") ? "si" : "no"} type="text" value={this.state.id_cedula_profesor}
                        name="id_cedula_profesor" id="id_cedula_profesor" placeholder="Cédula" eventoPadre={this.BuscarProfesor}
                      />
                      <div className='col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5'>
                          <label>Nombre del Profesor: {this.state.nombre_profesor}</label><br></br>
                          <label>Apellido del Profesor: {this.state.apellido_profesor}</label>
                      </div>
                  </div>
                  <div className="row mt-3">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-promocion">
                          <span className="sub-titulo-form-promocion">Estudiante inscrito</span>
                      </div>
                  </div>
                  <div className="row justify-content-center align-items-center">
                    {this.props.match.params.operacion !== "registrar" &&
                      <ComponentFormCampo clasesColumna="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4"
                        clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_id_inscripcion[0]}
                        nombreCampo="Cédula escolar:" activo="no" type="text" value={this.state.cedula_escolar}
                        name="cedula_escolar" id="cedula_escolar" placeholder="Cédula" eventoPadre={""}
                      />
                    }
                    {this.props.match.params.operacion === "registrar"  &&
                      <ComponentFormSelect
                        clasesColumna="col-5 col-ms-5 col-md-5 col-lg-5 col-xl-5"
                        obligatorio="si"
                        mensaje={this.state.msj_id_inscripcion}
                        nombreCampoSelect="Estudiante:"
                        clasesSelect="custom-select"
                        name="id_inscripcion"
                        id="id_inscripcion"
                        eventoPadre={this.cambiarEstado}
                        defaultValue={this.state.id_inscripcion}
                        option={this.state.selectEstudiantes}
                        />
                    }
                    <div className='col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5'>
                      <label>Nombre del Estudiante: {this.state.nombre_estudiante}</label><br></br>
                      <label>Apellido del Estudiante: {this.state.apellido_estudiante}</label>
                    </div>
                  </div>
                  <div className="row mt-3">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-promocion">
                          <span className="sub-titulo-form-promocion">Nota de promoción</span>
                      </div>
                  </div>

                  <div className="row justify-content-center align-items-center">
                    <ComponentFormTextArea clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                      obligatorio={(operacion_Camp !== "evaluacion") ? "si" : "no"} mensaje={this.state.msj_descripcion_logro[0]} nombreCampoTextArea="Descripción del logro:"
                      clasesTextArear="form-control texarea-alto" name="descripcion_logro" id="descripcion_logro" value={this.state.descripcion_logro}
                      eventoPadre={this.validarTexto}
                    />
                  </div>
                  <div className="row justify-content-center align-items-center">
                      <ComponentFormTextArea clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                        obligatorio={(operacion_Camp !== "evaluacion") ? "si" : "no"} mensaje={this.state.msj_recomendacion_pariente[0]} nombreCampoTextArea="Recomendación al pariente:"
                        clasesTextArear="form-control texarea-alto" name="recomendacion_pariente" id="recomendacion_pariente" value={this.state.recomendacion_pariente}
                        eventoPadre={this.validarTexto}
                      />

                  </div>
                  <div className="row justify-content-center align-items-center">
                  <ComponentFormCampo clasesColumna="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2"
                        clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_dias_promocion[0]}
                        nombreCampo="Dia de promoción:" activo={(operacion_Camp !== "evaluacion") ? "si" : "no"} type="text" value={this.state.dias_promocion}
                        name="dias_promocion" id="dias_promocion" placeholder="Descripción del logro" eventoPadre={this.validarNumero}
                      />
                    <ComponentFormRadioMultiState
                      clasesColumna="col-7 col-ms-7 col-md-7 col-lg-7 col-xl-7"
                      extra="custom-control-inline"
                      nombreCampoRadio="Notas de promoción :"
                      name="nota_promocion"
                      nombreUnico={[""]}
                      checkedRadio={this.state.nota_promocion}

                      idRadio={["nota0","nota1","nota2","nota3","nota4","nota5"]}

                      estates={this.state.notas}
                      eventoPadre={this.cambiarEstado}
                    />
                  </div>
                  <div className="row justify-content-center align-items-center">
                    <ComponentFormTextArea clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                      obligatorio="si" mensaje={this.state.msj_descripcion_nota_promocion[0]} nombreCampoTextArea="Descripción de la nota promocional:"
                      clasesTextArear="form-control texarea-alto" name="descripcion_nota_promocion" id="descripcion_nota_promocion" value={this.state.descripcion_nota_promocion}
                      eventoPadre={this.cambiarEstado}
                    />
                  </div>
                  {this.props.match.params.operacion === "evaluacion" &&
                    <div className="row justify-content-center align-items-center">
                      <ComponentFormRadioMultiState
                        clasesColumna="col-7 col-ms-7 col-md-7 col-lg-7 col-xl-7"
                        extra="custom-control-inline"
                        nombreCampoRadio="Estado de la promoción :"
                        name="estatus_promocion"
                        nombreLabelRadio={["Aplicar","Rechazar","Espera"]}
                        checkedRadio={this.state.estatus_promocion}

                        idRadio={["status0","status1","status2"]}

                        estates={this.state.estados_promocion}
                        eventoPadre={this.cambiarEstado}
                        />
                    </div>
                  }
                  {this.state.estatus_promocion === "R" &&
                    <div className="row justify-content-center align-items-center">
                      <ComponentFormTextArea clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                        obligatorio="si" mensaje={this.state.msj_nota_rezacho_promocion[0]} nombreCampoTextArea="Observación :"
                        clasesTextArear="form-control texarea-alto" name="nota_rezacho_promocion" id="nota_rezacho_promocion" value={this.state.nota_rezacho_promocion}
                        eventoPadre={this.cambiarEstado}
                      />
                    </div>
                  }


                    <div className="row justify-content-center">
                        <div className="col-auto">
                        {this.state.operacion === "Registrar" &&
                          <InputButton
                            clasesBoton="btn btn-primary"
                            id="boton-registrar"
                            value="Registrar"
                            eventoPadre={this.operacion}
                            />
                        }

                        {this.state.operacion === "Actualizar" &&
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
        <div className="component_promocion_form">
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

export default withRouter(ComponentPromocionForm)
