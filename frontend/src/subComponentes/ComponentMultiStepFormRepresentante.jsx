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

class ComponentMultiStepFormRepresentante extends React.Component{
  constructor(props){
    super(props);
    this.consultarCiudadesXEstado = this.consultarCiudadesXEstado.bind(this);
    this.regresar=this.regresar.bind(this);
    this.operacion=this.operacion.bind(this);
    this.cambiarEstado=this.cambiarEstado.bind(this);
    this.validarNumero=this.validarNumero.bind(this);
    this.validarTexto=this.validarTexto.bind(this);
    this.fechaNacimiento=this.fechaNacimiento.bind(this);
    this.buscarRepresentante=this.buscarRepresentante.bind(this);
    this.validarSelect=this.validarSelect.bind(this);
    this.validarDireccion=this.validarDireccion.bind(this)
    this.validarFormularioRegistrar=this.validarFormularioRegistrar.bind(this);
    this.validarCampo=this.validarCampo.bind(this)
    this.enviarDatos=this.enviarDatos.bind(this)
    this.consultarRepresentante=this.consultarRepresentante.bind(this)
    this.consultarCiudad = this.consultarCiudad.bind(this)
    this.consultarParroquiasXCiudad = this.consultarParroquiasXCiudad.bind(this)
    this.consultarTodoXParroquia = this.consultarTodoXParroquia.bind(this)
    this.state={
        // ------------------
        modulo:"",// modulo menu
        estado_menu:false,
        //formulario
        // Datos MAMA
        id_cedula_mama: "",
        nombres_mama: "",
        apellidos_mama: "",
        fecha_nacimiento_mama: "",
        nivel_instruccion_mama: "ingeniero",
        ocupacion_mama: "",
        telefono_movil_mama: "",
        telefono_local_mama: "",
        ingresos_mama: "",
        tipo_vivienda_mama: "",
        constitucion_familiar_mama: "",
        numero_hijos_mama: "1",
        id_estado_mama: "",
        id_ciudad_mama: "",
        id_parroquia_mama: "",
        estatus_mama:"1",
        // MSJ MAMA
        msj_id_cedula_mama:[{mensaje:"",color_texto:""}],
        msj_nombres_mama:[{mensaje:"",color_texto:""}],
        msj_apellidos_mama:[{mensaje:"",color_texto:""}],
        msj_fecha_nacimiento_mama:[{mensaje:"",color_texto:""}],
        msj_estatus_mama:[{mensaje:"",color_texto:""}],
        msj_nivel_instruccion_mama:[{ mensaje:"", color_texto:""}],
        msj_ocupacion_mama:[{ mensaje:"", color_texto:""}],
        msj_constitucion_familiar_mama: [{ mensaje:"", color_texto:""}],
        msj_ingresos_mama: [{ mensaje:"", color_texto:""}],
        msj_tipo_vivienda_mama: [{ mensaje:"", color_texto:""}],
        msj_telefono_movil_mama: [{ mensaje:"", color_texto:""}],
        msj_telefono_local_mama: [{ mensaje:"", color_texto:""}],
        msj_id_estado_mama:[{ mensaje:"", color_texto:""}],
        msj_id_ciudad_mama:[{ mensaje:"", color_texto:""}],
        msj_id_parroquia_mama: [{ mensaje:"", color_texto:""}],
        // Datos PAPA
        id_cedula_papa: "",
        nombres_papa: "",
        apellidos_papa: "",
        fecha_nacimiento_papa: "",
        nivel_instruccion_papa: "ingeniero",
        ocupacion_papa: "",
        telefono_movil_papa: "",
        telefono_local_papa: "",
        ingresos_papa: "",
        tipo_vivienda_papa: "",
        constitucion_familiar_papa: "",
        numero_hijos_papa: "1",
        id_estado_papa: "",
        id_ciudad_papa: "",
        id_parroquia_papa: "",
        estatus_papa:"1",
        // MSJ PAPA
        msj_id_cedula_papa:[{mensaje:"",color_texto:""}],
        msj_nombres_papa:[{mensaje:"",color_texto:""}],
        msj_apellidos_papa:[{mensaje:"",color_texto:""}],
        msj_fecha_nacimiento_papa:[{mensaje:"",color_texto:""}],
        msj_estatus_papa:[{mensaje:"",color_texto:""}],
        msj_nivel_instruccion_papa:[{ mensaje:"", color_texto:""}],
        msj_ocupacion_papa:[{ mensaje:"", color_texto:""}],
        msj_constitucion_familiar_papa: [{ mensaje:"", color_texto:""}],
        msj_ingresos_papa: [{ mensaje:"", color_texto:""}],
        msj_tipo_vivienda_papa: [{ mensaje:"", color_texto:""}],
        msj_telefono_movil_papa: [{ mensaje:"", color_texto:""}],
        msj_telefono_local_papa: [{ mensaje:"", color_texto:""}],
        msj_id_estado_papa:[{ mensaje:"", color_texto:""}],
        msj_id_ciudad_papa:[{ mensaje:"", color_texto:""}],
        msj_id_parroquia_papa: [{ mensaje:"", color_texto:""}],
        //// combo box
        papa_existe: false,
        mama_existe: false,

        estados_m:[],
        ciudades_m:[],
        parroquias_m:[],

        estados_p:[],
        ciudades_p:[],
        parroquias_p:[],

        fecha_minimo:"",
        hashEstudiante:{},
        estadoBusquedaRepresentante:false,
        grados_instruccion:[
            {id:"ingeniero",descripcion:"ingeniero"},
            {id:"licenciado",descripcion:"licenciado"},
            {id:"tsu",descripcion:"tsu"},
            {id:"bachiller",descripcion:"bachiller"},
            {id:"educacion basica",descripcion:"educación basica"}
        ],
        tipo_viviendas:[
          {id:"",descripcion:"Selecciona una opcion"},
          {id:"1",descripcion:"Rancho"},
          {id:"2",descripcion:"Casa"},
          {id:"3",descripcion:"Quinta"},
          {id:"4",descripcion:"Apartamento"},
          {id:"5",descripcion:"Alquilada"}
        ],
        ///
        mensaje:{
            texto:"",
            estado:""
        },
        //
        fechaServidor:null,
        edadRepresentante:null,
        edadMama: null,
        edadPapa: null,
        StringExprecion: /[A-Za-z]|[0-9]/
    }
  }

  async UNSAFE_componentWillMount(){
    if(true){
      await this.consultarFechaServidor()
      await this.consultarTodosLosRepresentantes()

      const ruta_api=`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/estado/consultar-todos`,
      nombre_propiedad_lista="estados",
      propiedad_id="id_estado",
      propiedad_descripcion="nombre_estado",
      propiedad_estado="estatu_estado"
      const estados=await this.consultarServidor(ruta_api,nombre_propiedad_lista,propiedad_id,propiedad_descripcion,propiedad_estado)

      const ruta_api_2=`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/ciudad/consultar-x-estado/${estados[0].id}`,
      nombre_propiedad_lista_2="ciudades",
      propiedad_id_2="id_ciudad",
      propiedad_descripcion_2="nombre_ciudad",
      propiedad_estado_2="estatu_ciudad"
      const ciudades=await this.consultarServidor(ruta_api_2,nombre_propiedad_lista_2,propiedad_id_2,propiedad_descripcion_2,propiedad_estado_2)

      const ruta_api_3=`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/parroquia/consultar-ciudad/${ciudades[0].id}`,
      nombre_propiedad_lista_3="datos",
      propiedad_id_3="id_parroquia",
      propiedad_descripcion_3="nombre_parroquia",
      propiedad_estado_3="estatu_parroquia"
      const parroquias=await this.consultarServidor(ruta_api_3,nombre_propiedad_lista_3,propiedad_id_3,propiedad_descripcion_3,propiedad_estado_3)

      this.setState({
        estados_p: estados,
        estados_m: estados,
        ciudades_p: ciudades,
        ciudades_m: ciudades,
        parroquias_p: parroquias,
        parroquias_m: parroquias,
        id_estado_papa:(estados.length===0)?null:estados[0].id,
        id_estado_mama:(estados.length===0)?null:estados[0].id,
        id_ciudad_papa:(ciudades.length===0)?null:ciudades[0].id,
        id_ciudad_mama:(ciudades.length===0)?null:ciudades[0].id,
        id_parroquia_papa:(parroquias.length===0)?null:parroquias[0].id,
        id_parroquia_mama:(parroquias.length===0)?null:parroquias[0].id,
      })
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

  async consultarCiudad(id){
    var mensaje={texto:"",estado:""},
    respuesta_servidor=""
    var ciudad={}
    const token=localStorage.getItem('usuario')
    await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/ciudad/consultar/${id}/${token}`)
    .then(respuesta=>{
        respuesta_servidor=respuesta.data
        if(respuesta_servidor.estado_peticion==="200"){
            ciudad=respuesta_servidor.ciudad
        }
        else if(respuesta_servidor.estado_peticion==="404"){
            mensaje.texto=respuesta_servidor.mensaje
            mensaje.estado=respuesta_servidor.estado_peticion
            this.props.history.push(`/dashboard/configuracion/cam${JSON.stringify(mensaje)}`)
        }

    })
    .catch(error=>{
        console.error(error)
        mensaje.texto="No se puedo conectar con el servidor"
        mensaje.estado="500"
        this.props.history.push(`/dashboard/configuracion/cam${JSON.stringify(mensaje)}`)
    })
    return ciudad
  }

  async consultarFechaServidor(){
    await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/trabajador/fecha-servidor`)
    .then(respuesta => {
        let fechaServidor=respuesta.data.fechaServidor
        // alert(fechaServidor)
        this.setState({fechaServidor})
    })
    .catch(error => {
        console.error("error al conectar con el servidor")
    })
  }

  async consultarTodosLosRepresentantes(){
    await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/representante/consultar-todos`)
    .then(repuesta => {
        let json=JSON.parse(JSON.stringify(repuesta.data))
        // console.log("datos =>>> ",json)
        let hash={}
        for(let representante of json.datos){
            hash[representante.id_cedula_representante]=representante
        }
        this.setState({hashRepresentante:hash})
    })
    .catch(error => {
        console.error(error)
    })
  }

  async consultarRepresentante(id){
    let mensaje =""
    const token=localStorage.getItem('usuario')
    let fechaServidor=Moment(this.state.fechaServidor,"YYYY-MM-DD")
    // /${token}
    return await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/representante/consultar/${id}`)
    .then(respuesta=>{
        let respuesta_servidor=respuesta.data
        if(respuesta_servidor.estado_respuesta=== true){
          return respuesta_servidor.datos[0]
        }
        else if(respuesta_servidor.estado_respuesta===false){
            mensaje.texto=respuesta_servidor.mensaje
            mensaje.estado=respuesta_servidor.estado_peticion
            this.props.history.push(`/dashboard/configuracion/representante${JSON.stringify(mensaje)}`)
        }
    })
    .catch(error=>{
        console.error(error)
        mensaje.texto="No se puedo conectar con el servidor"
        mensaje.estado="500"
        this.props.history.push(`/dashboard/configuracion/representante${JSON.stringify(mensaje)}`)
    })
      // let edadTrabajador=(parseInt(fechaServidor.diff(Moment(this.state.fecha_nacimiento).format("YYYY-MM-DD"),"years"))>=18)?fechaServidor.diff(Moment(this.state.fecha_nacimiento).format("YYYY-MM-DD"),"years"):null
  }

  async consultarServidor(ruta_api,nombre_propiedad_lista,propiedad_id,propiedad_descripcion,propiedad_estado){
    var respuesta_servidor=[]
    var lista=[]
    var mensaje={texto:"",estado:""}
    await axios.get(ruta_api)
    .then(respuesta=>{
        respuesta_servidor=respuesta.data
        if(respuesta_servidor.estado_peticion==="200" || respuesta_servidor.color_alerta == "success"){
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
            this.props.history.push(`/dashboard/configuracion/representante${JSON.stringify(mensaje)}`)
        }
    })
    .catch(error=>{
        console.error(error)
    })
    return lista
  }

  async consultarCiudadesXEstado(a){
    let input=a.target
    const ruta_api_2=`http://localhost:8080/configuracion/ciudad/consultar-x-estado/${input.value}`,
    nombre_propiedad_lista_2="ciudades",
    propiedad_id_2="id_ciudad",
    propiedad_descripcion_2="nombre_ciudad",
    propiedad_estado_2="estatu_ciudad"
    const ciudades=await this.consultarServidor(ruta_api_2,nombre_propiedad_lista_2,propiedad_id_2,propiedad_descripcion_2,propiedad_estado_2)

    let ciudad, ciudades_lista;
    if(input.name == "id_estado_mama"){
      ciudad = "id_ciudad_mama";
      ciudades_lista = "ciudades_m";
    }else{
      ciudad = "id_ciudad_papa";
      ciudades_lista = "ciudades_p";
    }

    this.setState({
        [input.name]:input.value,
        [ciudades_lista]: ciudades,
        [ciudad]:(ciudades.length===0)?null:ciudades[0].id
    })
  }

  async consultarParroquiasXCiudad(a){
      let input=a.target
      const ruta_api_3=`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/parroquia/consultar-ciudad/${input.value}`,
      nombre_propiedad_lista_3="datos",
      propiedad_id_3="id_parroquia",
      propiedad_descripcion_3="nombre_parroquia",
      propiedad_estado_3="estatu_parroquia"
      const parroquias=await this.consultarServidor(ruta_api_3,nombre_propiedad_lista_3,propiedad_id_3,propiedad_descripcion_3,propiedad_estado_3)

      let parroquia, parroquias_lista;
      if(input.name == "id_ciudad_mama"){
        parroquia = "id_parroquia_mama";
        parroquias_lista = "parroquias_m";
      }else{
         parroquia = "id_parroquia_papa";
         parroquias_lista = "parroquias_p";
      }

      this.setState({
          [input.name]:input.value,
          [parroquias_lista]: parroquias,
          [parroquia]:(parroquias.length===0)?null:parroquias[0].id
      })
  }

  async consultarTodoXParroquia(id){
    const ruta_api_3=`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/parroquia/consultar/${id}`

    let datos = await axios.get(ruta_api_3)
    .then( ({data}) => {
      return {
        id_estado: data.datos[0].id_estado,
        id_ciudad: data.datos[0].id_ciudad,
        id_parroquia: data.datos[0].id_parroquia,
      }
    })
    .catch( error => console.error(error))

    return datos;
  }

  formatoOptionSelect(lista,lista_vacia,propiedades){
      var veces=0
      while(veces < lista.length){
          if(lista[veces][propiedades.estado]==="1"){
              lista_vacia.push({id:lista[veces][propiedades.id],descripcion:lista[veces][propiedades.descripcion]})
          }
          veces+=1
      }
      return lista_vacia
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

  validarTexto(a){
      const input=a.target,
      exprecion=/[A-Za-z\s]$/
      if(input.value!==""){
          if(exprecion.test(input.value)){
              this.cambiarEstadoDos(input)
          }
      }
      else{
          this.cambiarEstadoDos(input)
      }
  }

  longitudCampo(input){
    if(input.name==="id_cedula_mama" || input.name==="id_cedula_papa"){ if(input.value.length <= 8) this.cambiarEstadoDos(input) }
    else if(input.name==="telefono_movil_papa" || input.name==="telefono_local_papa" || input.name==="telefono_movil_mama" || input.name==="telefono_local_mama"){
        if(input.value.length <= 11) this.cambiarEstadoDos(input)
    }
    else if(input.name === "ingresos_mama" || input.name === "ingresos_papa"){ if(input.value.length <= 10) this.cambiarEstadoDos(input) }
    else{ if(input.value.length < 10) this.cambiarEstadoDos(input) }
  }

  cambiarEstadoDos(input){
    this.setState({[input.name]:input.value})
  }

  cambiarEstado(a){
    var input=a.target;
    this.setState({[input.name]:input.value})
  }

  fechaNacimiento(a){
    let input=a.target
    this.cambiarEstado(a)
    let fechaServidor=Moment(this.state.fechaServidor,"YYYY-MM-DD")
    let edad = (parseInt(fechaServidor.diff(input.value,"years")))
    if(input.name == "fecha_nacimiento_mama") this.setState({edadMama: edad})
    else this.setState({edadPapa: edad})
  }

  validarCampo(nombre_campo){
    var estado=false

    const valor = this.state[nombre_campo]
    let msj = this.state["msj_"+nombre_campo];

    if(valor!==""){
      if(this.state.StringExprecion.test(valor)){
        estado=true
        msj[0] = {mensaje: "",color_texto:"rojo"}
      }else{
        msj[0] = {mensaje: "este campo solo permite letras",color_texto:"rojo"}
      }
    }else{
      msj[0] = {mensaje: "Este campo no puede estar vacio",color_texto:"rojo"}
    }

    this.setState({["msj_"+nombre_campo]: msj})
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

                if(nombre_campo == "numero_hijos_representante"){
                  let numero_hijos = parseInt(this.state.numero_hijos_representante)
                  const sumatoria = (a, b) => a + b;
                  let numeros = [
                    parseInt(this.state.numero_estudiante_inicial_representante),
                    parseInt(this.state.numero_estudiante_grado_1_representante),
                    parseInt(this.state.numero_estudiante_grado_2_representante),
                    parseInt(this.state.numero_estudiante_grado_3_representante),
                    parseInt(this.state.numero_estudiante_grado_4_representante),
                    parseInt(this.state.numero_estudiante_grado_5_representante),
                    parseInt(this.state.numero_estudiante_grado_6_representante),
                  ]
                  let total_estudiante_representante = numeros.reduce(sumatoria)

                  if(numero_hijos != total_estudiante_representante){
                    estado = false
                    mensaje_campo[0]={mensaje:"El numero de hijos no concuerda con la cantidad estudiantes registrados",color_texto:"rojo"}
                    this.setState({["msj_numero_hijos_representante"]:mensaje_campo})
                    return false;
                  }
                }
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

  validarFechaNacimineto(name_campo){
      var estado=false
      var fecha_representante_nacimiento=Moment(new Date(this.state[name_campo]))
      fecha_representante_nacimiento.add(1,"d")
      var fecha_minima=Moment();
      var fecha_maxima=Moment();
      fecha_minima.subtract(18,"y")
      fecha_maxima.subtract(99,"y")
      var msj_fecha_nacimiento=this.state['msj_'+name_campo]
      if(this.state.fecha_nacimiento!==""){
          if(!fecha_representante_nacimiento.isAfter(fecha_minima)){
              if(fecha_representante_nacimiento.isAfter(fecha_maxima)){
                  estado=true
                  msj_fecha_nacimiento[0]={mensaje:"",color_texto:"rojo"}
                  if(name_campo == "fecha_nacimiento_mama") this.setState({msj_fecha_nacimiento_mama: msj_fecha_nacimiento})
                  if(name_campo == "fecha_nacimiento_papa") this.setState({msj_fecha_nacimiento_papa: msj_fecha_nacimiento})
              }
              else{
                  msj_fecha_nacimiento[0]={mensaje:"tener hasta 99 años ",color_texto:"rojo"}
                  if(name_campo == "fecha_nacimiento_mama") this.setState({msj_fecha_nacimiento_mama: msj_fecha_nacimiento})
                  if(name_campo == "fecha_nacimiento_papa") this.setState({msj_fecha_nacimiento_papa: msj_fecha_nacimiento})
              }
          }
          else{
              msj_fecha_nacimiento[0]={mensaje:"es demadiaso joven",color_texto:"rojo"}
              if(name_campo == "fecha_nacimiento_mama") this.setState({msj_fecha_nacimiento_mama: msj_fecha_nacimiento})
              if(name_campo == "fecha_nacimiento_papa") this.setState({msj_fecha_nacimiento_papa: msj_fecha_nacimiento})
          }
      }
      else{
          msj_fecha_nacimiento[0]={mensaje:"la fecha de nacimiento no puede estar vacia",color_texto:"rojo"}
          if(name_campo == "fecha_nacimiento_mama") this.setState({msj_fecha_nacimiento_mama: msj_fecha_nacimiento})
          if(name_campo == "fecha_nacimiento_papa") this.setState({msj_fecha_nacimiento_papa: msj_fecha_nacimiento})
      }
      return estado
  }

  validarDireccion(name){
      var estado = false
      const valor = this.state[name]
      var msj_direccion  = this.state["msj_"+name]

      if(valor !== ""){
          if(this.state.StringExprecion.test(valor)){
              estado = true
              msj_direccion[0]={mensaje:"",color_texto:"rojo"}
          }
          else{
              estado = false
              msj_direccion[0]={mensaje:"Este campo no puede tener solo espacios en blanco",color_texto:"rojo"}
          }
      }
      else{
          estado = false
          msj_direccion[0]={mensaje:"Este campo no puede estar vacio",color_texto:"rojo"}
      }

      if(name === 'direccion') this.setState(msj_direccion)
      return estado
  }

  validarSelect(name){
    let estado = false
    const valor = this.state[name]
    let msj = this.state["msj_"+name];

    if(valor != ""){
      estado = true
      msj[0] = {mensaje: "", color_texto:"rojo"}
    }else{
      msj[0] = {mensaje: "Debe seleccionar una opcion", color_texto:"rojo"}
    }
    this.setState({[name]: msj})
    return estado
  }

  validarRadio(name){
    let estado = false
    const valor = this.state[name]
    let msj = this.state["msj_"+name]
    if(valor !== ""){
      estado = true
      msj[0] = {mensaje: "", color_texto:"rojo"}
    }else{
      msj[0] = {mensaje: "Debe de seleccionar el estado del representante", color_texto:"rojo"}
    }
    if(name === "estatus_mama") this.setState({msj_estatus_mama: msj})
    if(name === "estatus_papa") this.setState({msj_estatus_papa: msj})
    return estado
  }

  validarFormularioRegistrar(){
    const validarCedulaMama = this.validarCampoNumero('id_cedula_mama'), validarNombreMama = this.validarCampo('nombres_mama'), validarApellidoMama = this.validarCampo('apellidos_mama'),
    validarTelefonoMovilMama = this.validarCampoNumero('telefono_movil_mama'), validarTelefonoLocalMama = this.validarCampoNumero('telefono_local_mama'),
    validarFechaNaciminetoMama = this.validarFechaNacimineto("fecha_nacimiento_mama"), validarOcupacionMama = this.validarCampo('ocupacion_mama'), validarIngresosMama = this.validarCampoNumero('ingresos_mama'),
    validarGradoIntruccionMama = this.validarSelect('nivel_instruccion_mama'),validarTipViviendaMama = this.validarSelect('tipo_vivienda_mama'),ValidarStatusMama = this.validarRadio('estatus_mama'),
    ValidarConstFamiliarMama = this.validarCampo('constitucion_familiar_mama'), validarCiudadMama = this.validarSelect('id_ciudad_mama'),
    validaEstadoMama = this.validarSelect('id_estado_mama'), ValidarParroquiaMama = this.validarSelect('id_parroquia_mama')

    const validarCedulaPapa = this.validarCampoNumero('id_cedula_papa'), validarNombrePapa = this.validarCampo('nombres_papa'), validarApellidoPapa = this.validarCampo('apellidos_papa'),
    validarTelefonoMovilPapa = this.validarCampoNumero('telefono_movil_papa'), validarTelefonoLocalPapa = this.validarCampoNumero('telefono_local_papa'),
    validarFechaNaciminetoPapa = this.validarFechaNacimineto("fecha_nacimiento_papa"), validarOcupacionPapa = this.validarCampo('ocupacion_papa'),
    validarIngresosPapa = this.validarCampoNumero('ingresos_papa'),
    validarGradoIntruccionPapa = this.validarSelect('nivel_instruccion_papa'),validarTipViviendaPapa = this.validarSelect('tipo_vivienda_papa'),ValidarStatusPapa = this.validarRadio('estatus_papa'),
    ValidarConstFamiliarPapa = this.validarCampo('constitucion_familiar_papa'), validarCiudadPapa = this.validarSelect('id_ciudad_mama'),
    validaEstadoPapa = this.validarSelect('id_estado_papa'), ValidarParroquiaPapa = this.validarSelect('id_parroquia_papa')

    if(
      validarCedulaMama && validarNombreMama && validarApellidoMama && validarTelefonoMovilMama && validarTelefonoLocalMama && validarFechaNaciminetoMama && validarOcupacionMama && validarIngresosMama
      && validarGradoIntruccionMama && validarTipViviendaMama && ValidarStatusMama && ValidarParroquiaMama && validaEstadoMama && validarCiudadMama &&

      validarCedulaPapa && validarNombrePapa && validarApellidoPapa && validarTelefonoMovilPapa && validarTelefonoLocalPapa && validarFechaNaciminetoPapa && validarOcupacionPapa && validarIngresosPapa
      && validarGradoIntruccionPapa && validarTipViviendaPapa && ValidarStatusPapa && ValidarParroquiaPapa && validaEstadoPapa && validarCiudadPapa
    ){
      return { estado: true, fecha: validarFechaNaciminetoMama.fecha }
    }else{
      return {estado: false}
    }
  }

  operacion(){
      $(".columna-modulo").animate({scrollTop: 0}, 1000)

      const mensaje_formulario={
          mensaje:"",
          msj_id_cedula_mama:[{mensaje:"",color_texto:""}],
          msj_nombres_mama:[{mensaje:"",color_texto:""}],
          msj_apellidos_mama:[{mensaje:"",color_texto:""}],
          msj_fecha_nacimiento_mama:[{mensaje:"",color_texto:""}],
          msj_estatus_mama:[{mensaje:"",color_texto:""}],
          msj_nivel_instruccion_mama:[{ mensaje:"", color_texto:""}],
          msj_ocupacion_mama:[{ mensaje:"", color_texto:""}],
          msj_constitucion_familiar_mama: [{ mensaje:"", color_texto:""}],
          msj_ingresos_mama: [{ mensaje:"", color_texto:""}],
          msj_tipo_vivienda_mama: [{ mensaje:"", color_texto:""}],
          msj_telefono_movil_mama: [{ mensaje:"", color_texto:""}],
          msj_telefono_local_mama: [{ mensaje:"", color_texto:""}],

          msj_id_cedula_papa:[{mensaje:"",color_texto:""}],
          msj_nombres_papa:[{mensaje:"",color_texto:""}],
          msj_apellidos_papa:[{mensaje:"",color_texto:""}],
          msj_fecha_nacimiento_papa:[{mensaje:"",color_texto:""}],
          msj_estatus_papa:[{mensaje:"",color_texto:""}],
          msj_nivel_instruccion_papa:[{ mensaje:"", color_texto:""}],
          msj_ocupacion_papa:[{ mensaje:"", color_texto:""}],
          msj_constitucion_familiar_papa: [{ mensaje:"", color_texto:""}],
          msj_ingresos_papa: [{ mensaje:"", color_texto:""}],
          msj_tipo_vivienda_papa: [{ mensaje:"", color_texto:""}],
          msj_telefono_movil_papa: [{ mensaje:"", color_texto:""}],
          msj_telefono_local_papa: [{ mensaje:"", color_texto:""}],
      }

      const estado_validar_formulario=this.validarFormularioRegistrar()
      if(estado_validar_formulario.estado){
          this.enviarDatos(estado_validar_formulario,(objeto)=>{
              const mensaje =this.state.mensaje
              var respuesta_servidor=""
              if(!this.state.mama_existe){
                axios.post(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/representante/registrar-padres`,objeto.mama)
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
                    console.error(error)
                    mensaje_formulario.mensaje=mensaje
                    this.setState(mensaje_formulario)
                })
              }

              if(!this.state.papa_existe){
                axios.post(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/representante/registrar-padres`,objeto.papa)
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
                  console.error(error)
                  mensaje_formulario.mensaje=mensaje
                  this.setState(mensaje_formulario)
                })
              }

              this.props.addCedulas({tipo: "papa", cedula: this.state.id_cedula_papa})
              this.props.addCedulas({tipo: "mama", cedula: this.state.id_cedula_mama})
              setTimeout( () => {
                this.props.next();
              }, 100);

          })
      }
  }

  enviarDatos(estado_validar_formulario,petion){
      const token=localStorage.getItem('usuario')
      const objeto = {
        mama:{
          representante:{
            id_cedula_representante: this.state.id_cedula_mama,
            nueva_cedula: "",
            nombres_representante: this.state.nombres_mama,
            apellidos_representante: this.state.apellidos_mama,
            fecha_nacimiento_representante: this.state.fecha_nacimiento_mama,
            nivel_instruccion_representante: this.state.nivel_instruccion_mama,
            ocupacion_representante: this.state.ocupacion_mama,
            telefono_movil_representante: this.state.telefono_movil_mama,
            telefono_local_representante: this.state.telefono_local_mama,
            ingresos_representante: this.state.ingresos_mama,
            tipo_vivienda_representante: this.state.tipo_vivienda_mama,
            constitucion_familiar_representante: this.state.constitucion_familiar_mama,
            estatus_representante: this.state.estatus_mama,
            id_parroquia: this.state.id_parroquia_mama,

            direccion_representante: "",
            numero_hijos_representante: this.state.numero_hijos_mama,
            numero_estudiante_inicial_representante: "",
            numero_estudiante_grado_1_representante: "",
            numero_estudiante_grado_2_representante: "",
            numero_estudiante_grado_3_representante: "",
            numero_estudiante_grado_4_representante: "",
            numero_estudiante_grado_5_representante: "",
            numero_estudiante_grado_6_representante: "",
          },
          token:token
        },
        papa:{
          representante:{
            id_cedula_representante: this.state.id_cedula_papa,
            nueva_cedula: "",
            nombres_representante: this.state.nombres_papa,
            apellidos_representante: this.state.apellidos_papa,
            fecha_nacimiento_representante: this.state.fecha_nacimiento_papa,
            nivel_instruccion_representante: this.state.nivel_instruccion_papa,
            ocupacion_representante: this.state.ocupacion_papa,
            telefono_movil_representante: this.state.telefono_movil_papa,
            telefono_local_representante: this.state.telefono_local_papa,
            ingresos_representante: this.state.ingresos_papa,
            tipo_vivienda_representante: this.state.tipo_vivienda_papa,
            constitucion_familiar_representante: this.state.constitucion_familiar_papa,
            estatus_representante: this.state.estatus_papa,
            id_parroquia: this.state.id_parroquia_papa,

            direccion_representante: "",
            numero_hijos_representante: this.state.numero_hijos_papa,
            numero_estudiante_inicial_representante: "",
            numero_estudiante_grado_1_representante: "",
            numero_estudiante_grado_2_representante: "",
            numero_estudiante_grado_3_representante: "",
            numero_estudiante_grado_4_representante: "",
            numero_estudiante_grado_5_representante: "",
            numero_estudiante_grado_6_representante: "",
          },
          token:token
        },
      }

      petion(objeto)
  }

  regresar(){
      this.props.history.push("/dashboard/configuracion/representante");
  }

  async buscarRepresentante(a){
    let input = a.target
    this.validarNumero(a)
    let hashRepresentante=JSON.parse(JSON.stringify(this.state.hashRepresentante))
    let index, name;
    if(hashRepresentante[input.value]){
      if(input.name == "id_cedula_mama"){
        index = "mama_existe";
        name = "mama";

        if(input.value == this.state.id_cedula_papa){
          alert("No puedes duplicar cedulas")
          return false;
        }
      }else{
        index = "papa_existe";
        name = "papa"
        if(input.value == this.state.id_cedula_mama){
          alert("No puedes duplicar cedulas")
          return false;
        }
      }


      let datos = await this.consultarTodoXParroquia(hashRepresentante[input.value].id_parroquia)
      let indexes = [
        `id_cedula_${name}`,`nombres_${name}`,`apellidos_${name}`,`fecha_nacimiento_${name}`,`nivel_instruccion_${name}`,
        `ocupacion_${name}`,`telefono_movil_${name}`,`telefono_local_${name}`,`ingresos_${name}`,
        `tipo_vivienda_${name}`,`constitucion_familiar_${name}`,`estatus_${name}2`,`estatus_${name}2`,
        `id_estado_${name}`,`id_ciudad_${name}`,`id_parroquia_${name}`,
      ];

      indexes.map( item => { document.getElementById(item).disabled = true; })

      this.setState({
        estadoBusquedaRepresentante:true,
        ["id_cedula_"+name]: hashRepresentante[input.value].id_cedula_representante,
        ["nombres_"+name]: hashRepresentante[input.value].nombres_representante,
        ["apellidos_"+name]: hashRepresentante[input.value].apellidos_representante,
        ["fecha_nacimiento_"+name]: Moment(hashRepresentante[input.value].fecha_nacimiento_representante).format("YYYY-MM-DD"),
        ["nivel_instruccion_"+name]: hashRepresentante[input.value].nivel_instruccion_representante,
        ["ocupacion_"+name]: hashRepresentante[input.value].ocupacion_representante,
        ["telefono_movil_"+name]: hashRepresentante[input.value].telefono_movil_representante,
        ["telefono_local_"+name]: hashRepresentante[input.value].telefono_local_representante,
        ["ingresos_"+name]: hashRepresentante[input.value].ingresos_representante,
        ["tipo_vivienda_"+name]: hashRepresentante[input.value].tipo_vivienda_representante,
        ["constitucion_familiar_"+name]: hashRepresentante[input.value].constitucion_familiar_representante,
        ["estatus_"+name]: hashRepresentante[input.value].estatus_representante,
        ["id_estado_"+name]: datos.id_estado,
        ["id_ciudad_"+name]: datos.id_ciudad,
        ["id_parroquia_"+name]: datos.id_parroquia,
        [index]: true,
      })
      alert("este representante ya esta resgistrado")
    }
    else{
      if(input.name == "id_cedula_mama") index = "mama_existe"; else index = "papa_existe";
      this.setState({
        estadoBusquedaRepresentante:false,
        [index]: false,
      })
    }
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
                        <span className="titulo-form-trabajador">Registro de Padre y Madre</span>
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
                  <div className="row justify-content-center">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-trabajador">
                          <span className="titulo-form-trabajador">Datos de la Madre</span>
                      </div>
                  </div>
                  <div class="row justify-content-center">
                    <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                      clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_id_cedula_mama[0]}
                      nombreCampo="Cédula:" activo="si" type="text" value={this.state.id_cedula_mama}
                      name="id_cedula_mama" id="id_cedula_mama" placeholder="Cédula" eventoPadre={this.buscarRepresentante}
                    />
                    <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                      clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_nombres_mama[0]}
                      nombreCampo="Nombres:" activo="si" type="text" value={this.state.nombres_mama}
                      name="nombres_mama" id="nombres_mama" placeholder="Nombre" eventoPadre={this.validarTexto}
                    />
                    <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                      clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_apellidos_mama[0]}
                      nombreCampo="Apellidos:" activo="si" type="text" value={this.state.apellidos_mama}
                      name="apellidos_mama" id="apellidos_mama" placeholder="Apellido" eventoPadre={this.validarTexto}
                    />
                  </div>
                  <div className="row justify-content-center">
                    <ComponentFormDate clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                          obligatorio="si" mensaje={this.state.msj_fecha_nacimiento_mama[0]} nombreCampoDate="Fecha de Nacimiento:"
                          clasesCampo="form-control" value={this.state.fecha_nacimiento_mama} name="fecha_nacimiento_mama"
                          id="fecha_nacimiento_mama" eventoPadre={this.fechaNacimiento}
                        />
                      {this.state.edadRepresentante!==null &&
                            (
                            <div className="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                                    <div className="form-ground">
                                        <label className="mb-3">Edad:</label>
                                        <div >{this.state.edadRepresentante} Años</div>
                                    </div>
                            </div>
                            )
                        }
                    <ComponentFormSelect
                      clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                      obligatorio="si"
                      mensaje={this.state.msj_nivel_instruccion_mama[0]}
                      nombreCampoSelect="Nivel Instrucción:"
                      clasesSelect="custom-select"
                      name="nivel_instruccion_mama"
                      id="nivel_instruccion_mama"
                      eventoPadre={this.cambiarEstado}
                      defaultValue={this.state.nivel_instruccion_mama}
                      option={this.state.grados_instruccion}
                    />
                    <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                      clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_ocupacion_mama[0]}
                      nombreCampo="Ocupación:" activo="si" type="text" value={this.state.ocupacion_mama}
                      name="ocupacion_mama" id="ocupacion_mama" placeholder="Ocupacion" eventoPadre={this.validarTexto}
                    />
                  </div>
                  <div className="row justify-content-center">
                    <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                      clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_telefono_movil_mama[0]}
                      nombreCampo="Teléfono móvil:" activo="si" type="text" value={this.state.telefono_movil_mama}
                      name="telefono_movil_mama" id="telefono_movil_mama" placeholder="Telefono movil" eventoPadre={this.validarNumero}
                    />
                    <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                      clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_telefono_local_mama[0]}
                      nombreCampo="Teléfono local:" activo="si" type="text" value={this.state.telefono_local_mama}
                      name="telefono_local_mama" id="telefono_local_mama" placeholder="Telefono local" eventoPadre={this.validarNumero}
                    />
                    <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                      clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_ingresos_mama[0]}
                      nombreCampo="Ingresos:" activo="si" type="text" value={this.state.ingresos_mama}
                      name="ingresos_mama" id="ingresos_mama" placeholder="Ingresos del representante" eventoPadre={this.validarNumero}
                    />
                  </div>
                  <div className="row justify-content-center">
                    <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                      clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_constitucion_familiar_mama[0]}
                      nombreCampo="Constitución familiar:" activo="si" type="text" value={this.state.constitucion_familiar_mama}
                      name="constitucion_familiar_mama" id="constitucion_familiar_mama" placeholder="Constitucion familiar" eventoPadre={this.validarTexto}
                    />
                    <ComponentFormSelect
                      clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                      obligatorio="si"
                      mensaje={this.state.msj_tipo_vivienda_mama[0]}
                      nombreCampoSelect="Tipo de vivienda:"
                      clasesSelect="custom-select"
                      name="tipo_vivienda_mama"
                      id="tipo_vivienda_mama"
                      eventoPadre={this.cambiarEstado}
                      defaultValue={this.state.tipo_vivienda_mama}
                      option={this.state.tipo_viviendas}
                    />
                    <ComponentFormRadioState
                      clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                      extra="custom-control-inline"
                      nombreCampoRadio="Estatus:"
                      name="estatus_mama"
                      nombreLabelRadioA="Activo"
                      idRadioA="estatus_mama1"
                      checkedRadioA={this.state.estatus_mama}
                      valueRadioA="1"
                      nombreLabelRadioB="Inactivo"
                      idRadioB="estatus_mama2"
                      valueRadioB="0"
                      eventoPadre={this.cambiarEstado}
                      checkedRadioB={this.state.estatus_papa}
                    />
                  </div>
                  <div className="row justify-content-center mt-1">
                    <ComponentFormSelect
                      clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                      obligatorio="si"
                      mensaje={this.state.msj_id_estado_mama}
                      nombreCampoSelect="Estado:"
                      clasesSelect="custom-select"
                      name="id_estado_mama"
                      id="id_estado_mama"
                      eventoPadre={this.consultarCiudadesXEstado}
                      defaultValue={this.state.id_estado_mama}
                      option={this.state.estados_m}
                    />
                    <ComponentFormSelect
                      clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                      obligatorio="si"
                      mensaje={this.state.msj_id_ciudad_mama}
                      nombreCampoSelect="Ciudad:"
                      clasesSelect="custom-select"
                      name="id_ciudad_mama"
                      id="id_ciudad_mama"
                      eventoPadre={this.consultarParroquiasXCiudad}
                      defaultValue={this.state.id_ciudad_mama}
                      option={this.state.ciudades_m}
                    />
                    <ComponentFormSelect
                      clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                      obligatorio="si"
                      mensaje={this.state.msj_id_parroquia_mama}
                      nombreCampoSelect="Parroquia:"
                      clasesSelect="custom-select"
                      name="id_parroquia_mama"
                      id="id_parroquia_mama"
                      eventoPadre={this.cambiarEstado}
                      defaultValue={this.state.id_parroquia_mama}
                      option={this.state.parroquias_m}
                    />
                  </div>
                  <div className="row justify-content-center">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-trabajador">
                          <span className="titulo-form-trabajador">Datos del Padre</span>
                      </div>
                  </div>
                  <div class="row justify-content-center">
                    <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                      clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_id_cedula_papa[0]}
                      nombreCampo="Cédula:" activo="si" type="text" value={this.state.id_cedula_papa}
                      name="id_cedula_papa" id="id_cedula_papa" placeholder="Cédula" eventoPadre={this.buscarRepresentante}
                    />
                    <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                      clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_nombres_papa[0]}
                      nombreCampo="Nombres:" activo="si" type="text" value={this.state.nombres_papa}
                      name="nombres_papa" id="nombres_papa" placeholder="Nombre" eventoPadre={this.validarTexto}
                    />
                    <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                      clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_apellidos_papa[0]}
                      nombreCampo="Apellidos:" activo="si" type="text" value={this.state.apellidos_papa}
                      name="apellidos_papa" id="apellidos_papa" placeholder="Apellido" eventoPadre={this.validarTexto}
                    />
                  </div>
                  <div className="row justify-content-center">
                    <ComponentFormDate clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                          obligatorio="si" mensaje={this.state.msj_fecha_nacimiento_papa[0]} nombreCampoDate="Fecha de Nacimiento:"
                          clasesCampo="form-control" value={this.state.fecha_nacimiento_papa} name="fecha_nacimiento_papa"
                          id="fecha_nacimiento_papa" eventoPadre={this.fechaNacimiento}
                        />
                      {this.state.edadRepresentante!==null &&
                            (
                            <div className="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                                    <div className="form-ground">
                                        <label className="mb-3">Edad:</label>
                                        <div >{this.state.edadRepresentante} Años</div>
                                    </div>
                            </div>
                            )
                        }
                    <ComponentFormSelect
                      clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                      obligatorio="si"
                      mensaje={this.state.msj_nivel_instruccion_papa[0]}
                      nombreCampoSelect="Nivel Instrucción:"
                      clasesSelect="custom-select"
                      name="nivel_instruccion_papa"
                      id="nivel_instruccion_papa"
                      eventoPadre={this.cambiarEstado}
                      defaultValue={this.state.nivel_instruccion_papa}
                      option={this.state.grados_instruccion}
                    />
                    <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                      clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_ocupacion_papa[0]}
                      nombreCampo="Ocupación:" activo="si" type="text" value={this.state.ocupacion_papa}
                      name="ocupacion_papa" id="ocupacion_papa" placeholder="Ocupacion" eventoPadre={this.validarTexto}
                    />
                  </div>
                  <div className="row justify-content-center">
                    <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                      clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_telefono_movil_papa[0]}
                      nombreCampo="Télefono móvil:" activo="si" type="text" value={this.state.telefono_movil_papa}
                      name="telefono_movil_papa" id="telefono_movil_papa" placeholder="Telefono movil" eventoPadre={this.validarNumero}
                    />
                    <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                      clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_telefono_local_papa[0]}
                      nombreCampo="Télefono local:" activo="si" type="text" value={this.state.telefono_local_papa}
                      name="telefono_local_papa" id="telefono_local_papa" placeholder="Telefono local" eventoPadre={this.validarNumero}
                    />
                    <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                      clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_ingresos_papa[0]}
                      nombreCampo="Ingresos:" activo="si" type="text" value={this.state.ingresos_papa}
                      name="ingresos_papa" id="ingresos_papa" placeholder="Ingresos del representante" eventoPadre={this.validarNumero}
                    />
                  </div>
                  <div className="row justify-content-center mt-1">
                    <ComponentFormSelect
                      clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                      obligatorio="si"
                      mensaje={this.state.msj_id_estado_papa}
                      nombreCampoSelect="Estado:"
                      clasesSelect="custom-select"
                      name="id_estado_papa"
                      id="id_estado_papa"
                      eventoPadre={this.consultarCiudadesXEstado}
                      defaultValue={this.state.id_estado_papa}
                      option={this.state.estados_p}
                    />
                    <ComponentFormSelect
                      clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                      obligatorio="si"
                      mensaje={this.state.msj_id_ciudad_papa}
                      nombreCampoSelect="Ciudad:"
                      clasesSelect="custom-select"
                      name="id_ciudad_papa"
                      id="id_ciudad_papa"
                      eventoPadre={this.consultarParroquiasXCiudad}
                      defaultValue={this.state.id_ciudad_papa}
                      option={this.state.ciudades_p}
                    />
                    <ComponentFormSelect
                      clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                      obligatorio="si"
                      mensaje={this.state.msj_id_parroquia_papa}
                      nombreCampoSelect="Parroquia:"
                      clasesSelect="custom-select"
                      name="id_parroquia_papa"
                      id="id_parroquia_papa"
                      eventoPadre={this.cambiarEstado}
                      defaultValue={this.state.id_parroquia_representante}
                      option={this.state.parroquias_p}
                    />
                  </div>
                  <div className="row justify-content-center">
                    <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                      clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_constitucion_familiar_papa[0]}
                      nombreCampo="Constitución familiar:" activo="si" type="text" value={this.state.constitucion_familiar_papa}
                      name="constitucion_familiar_papa" id="constitucion_familiar_papa" placeholder="Constitucion familiar" eventoPadre={this.validarTexto}
                    />
                    <ComponentFormSelect
                      clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                      obligatorio="si"
                      mensaje={this.state.msj_tipo_vivienda_papa[0]}
                      nombreCampoSelect="Tipo de vivienda:"
                      clasesSelect="custom-select"
                      name="tipo_vivienda_papa"
                      id="tipo_vivienda_papa"
                      eventoPadre={this.cambiarEstado}
                      defaultValue={this.state.tipo_vivienda_papa}
                      option={this.state.tipo_viviendas}
                    />
                    <ComponentFormRadioState
                      clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                      extra="custom-control-inline"
                      nombreCampoRadio="Estatus:"
                      name="estatus_papa"
                      nombreLabelRadioA="Activo"
                      idRadioA="estatus_papa1"
                      checkedRadioA={this.state.estatus_papa}
                      valueRadioA="1"
                      nombreLabelRadioB="Inactivo"
                      idRadioB="estatus_papa2"
                      valueRadioB="0"
                      eventoPadre={this.cambiarEstado}
                      checkedRadioB={this.state.estatus_papa}
                    />
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
                        {/* <div className="col-auto">
                            <InputButton
                            clasesBoton="btn btn-danger"
                            id="boton-cancelar"
                            value="Cancelar"
                            eventoPadre={this.regresar}
                            />
                        </div> */}
                        {this.props.obligatorio == false && <InputButton
                          clasesBoton="btn btn-secondary"
                          id="boton-cancelar"
                          value="Omitir"
                          eventoPadre={this.props.next()}
                        />
                        }
                    </div>
                </form>
            </div>
        </div>
    )
  }
}

export default ComponentMultiStepFormRepresentante
