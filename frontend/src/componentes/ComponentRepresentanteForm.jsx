// id_cedula_representante char(8),
// nombre_representante varchar(150),
// apellidos_representante varchar(150),
// fecha_nacimiento_representante date,
// nivel_instruccion_representante varchar(150),
// ocupacion_representante varchar(2000),
// direccion_representante varchar(3000),
// id_ciudad varchar(6),
// telefono_movil_representante varchar(11)
// telefono_local_representante varchar(11)
// numero_hijos_representante varchar(2),
// constitucion_familiar_representante varchar(150),
// ingresos_representante varchar(10),
// tipo_vivienda_representante char(1),
//
// numero_estudiante_inicial_representante varchar(2),
// numero_estudiante_grado_1_representante varchar(2),
// numero_estudiante_grado_2_representante varchar(2),
// numero_estudiante_grado_3_representante varchar(2),
// numero_estudiante_grado_4_representante varchar(2),
// numero_estudiante_grado_5_representante varchar(2),
// numero_estudiante_grado_6_representante varchar(2),
//
// estatus_representante char(1)
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

class ComponentRepresentanteForm extends React.Component{
  constructor(){
    super();
    this.mostrarModulo = this.mostrarModulo.bind(this);
    this.consultarCiudadesXEstado = this.consultarCiudadesXEstado.bind(this);
    this.regresar=this.regresar.bind(this);
    this.operacion=this.operacion.bind(this);
    this.cambiarEstado=this.cambiarEstado.bind(this);
    this.agregar=this.agregar.bind(this);
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
    this.consultarPerfilTrabajador=this.consultarPerfilTrabajador.bind(this)
    this.consultarCiudad = this.consultarCiudad.bind(this)
    this.state={
        // ------------------
        modulo:"",// modulo menu
        estado_menu:false,
        //formulario
        id_cedula: "",
        nombres: "",
        apellidos: "",
        fecha_nacimiento: "",
        nivel_instruccion: "",
        ocupacion: "",
        direccion: "",
        id_estado:"",
        id_ciudad:"",
        telefono_movil_representante: "",
        telefono_local_representante: "",
        numero_hijos_representante: "",
        constitucion_familiar_representante: "",
        ingresos_representante: "",
        tipo_vivienda_representante: "",
        sexo_representante:"1",
        estatus_representante:"1",
        //MSJ
        msj_id_cedula:[{mensaje:"",color_texto:""}],
        msj_nombres:[{mensaje:"",color_texto:""}],
        msj_apellidos:[{mensaje:"",color_texto:""}],
        msj_fecha_nacimiento:[{mensaje:"",color_texto:""}],
        msj_sexo_representate:[{mensaje:"",color_texto:""}],
        msj_estatu_representate:[{mensaje:"",color_texto:""}],
        msj_id_estado:[{ mensaje:"", color_texto:""}],
        msj_id_ciudad:[{ mensaje:"", color_texto:""}],
        msj_nivel_instruccion:[{ mensaje:"", color_texto:""}],
        msj_ocupacion:[{ mensaje:"", color_texto:""}],
        msj_direccion: [{ mensaje:"", color_texto:""}],
        msj_telefono_movil_representante: [{ mensaje:"", color_texto:""}],
        msj_telefono_local_representante: [{ mensaje:"", color_texto:""}],
        msj_numero_hijos_representante: [{ mensaje:"", color_texto:""}],
        msj_constitucion_familiar_representante: [{ mensaje:"", color_texto:""}],
        msj_ingresos_representante: [{ mensaje:"", color_texto:""}],
        msj_tipo_vivienda_representante: [{ mensaje:"", color_texto:""}],
        //// combo box
        estados:[],
        ciudades:[],
        fecha_minimo:"",
        hashEstudiante:{},
        estadoBusquedaRepresentante:false,
        ///
        mensaje:{
            texto:"",
            estado:""
        },
        //
        fechaServidor:null,
        edadRepresentante:null,
        StringExprecion: /[A-Za-z]|[0-9]/
    }
  }

  async UNSAFE_componentWillMount(){
    let acessoModulo=await this.validarAccesoDelModulo("/dashboard/configuracion","/representante")
    if(acessoModulo){
      await this.consultarFechaServidor()
      await this.consultarTodosLosRepresentantes()
      const operacion=this.props.match.params.operacion

      if(operacion==="registrar"){
        const ruta_api=`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/estado/consultar-todos`,
        nombre_propiedad_lista="estados",
        propiedad_id="id_estado",
        propiedad_descripcion="nombre_estado",
        propiedad_estado="estatu_estado"
        const estados=await this.consultarServidor(ruta_api,nombre_propiedad_lista,propiedad_id,propiedad_descripcion,propiedad_estado)
        console.log("lista de estados ->>>",estados)
        const ruta_api_2=`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/ciudad/consultar-x-estado/${estados[0].id}`,
        nombre_propiedad_lista_2="ciudades",
        propiedad_id_2="id_ciudad",
        propiedad_descripcion_2="nombre_ciudad",
        propiedad_estado_2="estatu_ciudad"
        const ciudades=await this.consultarServidor(ruta_api_2,nombre_propiedad_lista_2,propiedad_id_2,propiedad_descripcion_2,propiedad_estado_2)
        console.log("lista de de ciudades por estado ->>>",ciudades)
        this.setState({
            estados,
            ciudades,
            id_estado:(estados.length===0)?null:estados[0].id,
            id_ciudad:(ciudades.length===0)?null:ciudades[0].id,
        })
      }
      else if(operacion==="actualizar"){
            const {id}=this.props.match.params
            let datos = await this.consultarRepresentante(id)

            let datosCiudad=await this.consultarCiudad(datos.id_ciudad)
            const ruta_api=`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/estado/consultar-todos`,
            nombre_propiedad_lista="estados",
            propiedad_id="id_estado",
            propiedad_descripcion="nombre_estado",
            propiedad_estado="estatu_estado"
            const estados=await this.consultarServidor(ruta_api,nombre_propiedad_lista,propiedad_id,propiedad_descripcion,propiedad_estado)

            const ruta_api_2=`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/ciudad/consultar-x-estado/${datosCiudad.id_estado}`,
            nombre_propiedad_lista_2="ciudades",
            propiedad_id_2="id_ciudad",
            propiedad_descripcion_2="nombre_ciudad",
            propiedad_estado_2="estatu_ciudad"
            const ciudades=await this.consultarServidor(ruta_api_2,nombre_propiedad_lista_2,propiedad_id_2,propiedad_descripcion_2,propiedad_estado_2)

            this.setState({
              id_cedula: datos.id_cedula_representante,
              nombres: datos.nombre_representante,
              apellidos: datos.apellidos_representante,
              fecha_nacimiento: Moment(datos.fecha_nacimiento_representante).format("YYYY-MM-DD"),
              nivel_instruccion: datos.nivel_instruccion_representante,
              ocupacion: datos.ocupacion_representante,
              direccion: datos.direccion_representante,
              id_ciudad: datos.id_ciudad,
              telefono_movil_representante: datos.telefono_movil_representante,
              telefono_local_representante: datos.telefono_local_representante,
              numero_hijos_representante: datos.numero_hijos_representante,
              constitucion_familiar_representante: datos.constitucion_familiar_representante,
              ingresos_representante: datos.ingresos_representante,
              tipo_vivienda_representante: datos.tipo_vivienda_representante,
              sexo_representante: datos.sexo_representante,
              estatus_representante: datos.estatus_representante,
              estados: estados,
              ciudades: ciudades
            })
            document.getElementById("id_estado").value=datosCiudad.id_estado
            document.getElementById("id_ciudad").value=datos.id_ciudad
          }else{
            alert("no tienes acesso a este modulo(sera redirigido a la vista anterior)")
            this.props.history.goBack()
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
        console.log(error)
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
        console.log("error al conectar con el servidor")
    })
  }

  async consultarTodosLosRepresentantes(){
    await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/representante/consultar-todos`)
    .then(repuesta => {
        let json=JSON.parse(JSON.stringify(repuesta.data))
        // console.log("datos =>>> ",json)
        let hash={}
        for(let estudiante of json.datos){
            hash[estudiante.cedula_escolar]=estudiante
        }
        console.log("hash representante =>>> ",hash)
        this.setState({hashRepresentante:hash})
    })
    .catch(error => {
        console.log(error)
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
            this.props.history.push(`/dashboard/configuracion/trabajador${JSON.stringify(mensaje)}`)
        }
    })
    .catch(error=>{
        console.log(error)
        mensaje.texto="No se puedo conectar con el servidor"
        mensaje.estado="500"
        this.props.history.push(`/dashboard/configuracion/trabajador${JSON.stringify(mensaje)}`)
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
            this.props.history.push(`/dashboard/configuracion/trabajador${JSON.stringify(mensaje)}`)
        }
    })
    .catch(error=>{
        console.log(error)
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
    console.log("lista de de ciudades por estado ->>>",ciudades)
    this.setState({
        id_estado:input.value,
        ciudades,
        id_ciudad:(ciudades.length===0)?null:ciudades[0].id
    })
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
          else{
              console.log("NO se acepta valores numericos")
          }
      }
      else{
          this.cambiarEstadoDos(input)
      }
  }

  longitudCampo(input){
    if(input.name==="id_cedula"){
        if(input.value.length<=8){
            this.cambiarEstadoDos(input)
        }
    }
    else if(input.name==="telefono_movil" || input.name==="telefono_local"){
        if(input.value.length<=11){
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
  }

  fechaNacimiento(a){
    let input=a.target
    this.cambiarEstado(a)
    // console.log(input.value)
    let fechaServidor=Moment(this.state.fechaServidor,"YYYY-MM-DD")
    let edadRepresentante=(parseInt(fechaServidor.diff(input.value,"years"))>=18)?fechaServidor.diff(input.value,"years"):null
    this.setState({edadRepresentante})
  }
  // TODO: Adaptar esta funcion
  validarCampo(nombre_campo){
    var estado=false
    const valor=this.state[nombre_campo]
    var msj_nombres=this.state["msj_"+nombre_campo]
    var msj_apellidos=this.state["msj_"+nombre_campo]

    if(valor!==""){
      if(this.state.StringExprecion.test(valor)){
        estado=true
        console.log("campo nombre "+nombre_campo+" OK")
        msj_nombres[0] = {mensaje: "",color_texto:"rojo"}
        msj_apellidos[0] = {mensaje: "",color_texto:"rojo"}
      }else{
        msj_nombres[0] = {mensaje: "este campo solo permite letras",color_texto:"rojo"}
        msj_apellidos[0] = {mensaje: "este campo solo permite letras",color_texto:"rojo"}
      }
    }else{
      msj_nombres[0] = {mensaje: "Este campo no puede estar vacio",color_texto:"rojo"}
      msj_apellidos[0] = {mensaje: "Este campo no puede estar vacio",color_texto:"rojo"}
    }

    if(nombre_campo == "nombres") this.setState(msj_nombres)
    else this.setState(msj_apellidos)
    return estado
  }

  async agregar(){
    var mensaje=this.state.mensaje
    mensaje.estado=""
    var mensaje_campo=[{mensaje:"",color_texto:""}]
    this.setState({
      id_cedula: "",
      nombres: "",
      apellidos: "",
      fecha_nacimiento: "",
      nivel_instruccion: "",
      ocupacion: "",
      direccion: "",
      id_estado:"",
      id_ciudad:"",
      telefono_movil_representante: "",
      telefono_local_representante: "",
      numero_hijos_representante: "",
      constitucion_familiar_representante: "",
      ingresos_representante: "",
      tipo_vivienda_representante: "",
      sexo_representante:"1",
      estatus_representante:"1",
      //MSJ
      msj_id_cedula:mensaje_campo,
      msj_nombres:mensaje_campo,
      msj_apellidos:mensaje_campo,
      msj_fecha_nacimiento:mensaje_campo,
      msj_sexo_representate:mensaje_campo,
      msj_estatu_representate:mensaje_campo,
      msj_id_estado:mensaje_campo,
      msj_id_ciudad:mensaje_campo,
      msj_nivel_instruccion:mensaje_campo,
      msj_ocupacion:mensaje_campo,
      msj_direccion:mensaje_campo,
      msj_telefono_movil_representante:mensaje_campo,
      msj_telefono_local_representante:mensaje_campo,
      msj_numero_hijos_representante:mensaje_campo,
      msj_constitucion_familiar_representante:mensaje_campo,
      msj_ingresos_representante:mensaje_campo,
      msj_tipo_vivienda_representante:mensaje_campo,
      edadRepresentante:null,
    })
    this.props.history.push("/dashboard/configuracion/representante/registrar")
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
                  console.log("campo nombre "+nombre_campo+" OK")
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

  validarFechaNacimineto(){
      var estado=false
      var fecha_representante_nacimiento=Moment(new Date(this.state.fecha_nacimiento))
      fecha_representante_nacimiento.add(1,"d")
      var fecha_minima=Moment();
      var fecha_maxima=Moment();
      fecha_minima.subtract(18,"y")
      fecha_maxima.subtract(99,"y")
      var msj_fecha_nacimiento=this.state.msj_fecha_nacimiento
      if(this.state.fecha_nacimiento!==""){
          if(!fecha_representante_nacimiento.isAfter(fecha_minima)){
              if(fecha_representante_nacimiento.isAfter(fecha_maxima)){
                  estado=true
                  msj_fecha_nacimiento[0]={mensaje:"",color_texto:"rojo"}
                  this.setState(msj_fecha_nacimiento)
              }
              else{
                  msj_fecha_nacimiento[0]={mensaje:"El representante solo puede tener hasta 99 años ",color_texto:"rojo"}
                  this.setState(msj_fecha_nacimiento)
              }
          }
          else{
              msj_fecha_nacimiento[0]={mensaje:"es demadiaso joven",color_texto:"rojo"}
              this.setState(msj_fecha_nacimiento)
          }
      }
      else{
          msj_fecha_nacimiento[0]={mensaje:"la fecha de nacimiento no puede estar vacia",color_texto:"rojo"}
          this.setState(msj_fecha_nacimiento)
      }
      return estado
  }
  // TODO: Adaptar esta funcion
  validarDireccion(name){
      var estado = false
      const valor = this.state[name]
      var msj_direccion  = this.state["msj_"+name]

      if(valor !== ""){
          if(this.state.StringExprecion.test(valor)){
              estado = true
              console.log(`campo ${name} OK`)
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

      if(name == 'direccion') this.setState(msj_direccion)
      // else if(name == 'direccion_nacimiento') this.setState(msj_direccion_nacimiento)
      // else this.setState(msj_vive_con)

      return estado
  }

  validarSelect(name){
    let estado = false
    const valor = this.state[name]
    let msj_id_ciudad = this.state["msj_"+name], msj_id_estado = this.state["msj_"+name];
    if(valor != ""){
      estado = true
      msj_id_ciudad[0] = {mensaje: "", color_texto:"rojo"}
      msj_id_estado[0] = {mensaje: "", color_texto:"rojo"}
    }else{
      msj_id_ciudad[0] = {mensaje: "Debe de seleccionar una ciudad", color_texto:"rojo"}
      msj_id_estado[0] = {mensaje: "Debe de seleccionar un estado", color_texto:"rojo"}
    }
    if(name == "id_ciudad") this.setState(msj_id_ciudad)
    else if(name == "id_estado") this.setState(msj_id_estado)
    return estado
  }

  validarRadio(name){
    let estado = false
    const valor = this.state[name]
    let msj_sexo_repre = this.state["msj_"+name],
    msj_estatu_representate = this.state["msj_"+name]
    if(valor != ""){
      estado = true
      msj_sexo_repre[0] = {mensaje: "", color_texto:"rojo"}
      msj_estatu_representate[0] = {mensaje: "", color_texto:"rojo"}
    }else{
      msj_sexo_repre[0] = {mensaje: "Debe de seleccionar sexo", color_texto:"rojo"}
      msj_estatu_representate[0] = {mensaje: "Debe de seleccionar el estado del representante", color_texto:"rojo"}
    }
    if(name == "sexo_representante") this.setState(msj_sexo_representante)
    else if(name == "estato_representante") this.setState(msj_estato_representante)
    return estado
  }
  // TODO: Adaptar luego
  validarFormularioRegistrar(){
      const validarCedulaEscolar = this.validarCampoNumero('id_cedula_escolar'),
      validar_nombres=this.validarCampo("nombres"),validar_apellidos=this.validarCampo("apellidos"),validar_fecha_nacimiento=this.validarFechaNacimineto(),
      validar_escolaridad=this.validarCampo("escolaridad"),validar_procedencia=this.validarDireccion("procedencia"),
      validar_vive_con=this.validarDireccion("vive_con"),validar_direccion_nacimiento=this.validarDireccion("direccion_nacimiento"),
      validar_estado=this.validarSelect('id_estado'),validar_ciudad=this.validarSelect('id_ciudad'),validar_sexo_estudiante=this.validarRadio('sexo_estudiante'),
      validar_estatu_estudiante=this.validarRadio('estatu_estudiante')

      if(
        validarCedulaEscolar && validar_nombres && validar_apellidos && validar_fecha_nacimiento &&
        validar_escolaridad && validar_procedencia && validar_vive_con && validar_direccion_nacimiento && validar_estado && validar_ciudad &&
        validar_sexo_estudiante && validar_estatu_estudiante
      ){
        return {estado: true, fecha:validar_fecha_nacimiento.fecha}
      }else{
        return {estado: false}
      }
  }
  // Adaptar luego
  validarFormularioActuazliar(){
    const validarCedulaEscolar = this.validarCampoNumero('id_cedula_escolar'),
    validar_nombres=this.validarCampo("nombres"),validar_apellidos=this.validarCampo("apellidos"),validar_fecha_nacimiento=this.validarFechaNacimineto(),
    validar_escolaridad=this.validarCampo("escolaridad"),validar_procedencia=this.validarDireccion("procedencia"),
    validar_vive_con=this.validarDireccion("vive_con"),validar_direccion_nacimiento=this.validarDireccion("direccion_nacimiento"),
    validar_ciudad=this.validarSelect('id_ciudad'),validar_sexo_estudiante=this.validarRadio('sexo_estudiante'),
    validar_estatu_estudiante=this.validarRadio('estatu_estudiante')

    if(
      validarCedulaEscolar && validar_nombres && validar_apellidos && validar_fecha_nacimiento &&
      validar_escolaridad && validar_procedencia && validar_vive_con && validar_direccion_nacimiento && validar_ciudad &&
      validar_sexo_estudiante && validar_estatu_estudiante
    ){
      return {estado: true, fecha:validar_fecha_nacimiento.fecha}
    }else{
      return {estado: false}
    }
  }

  operacion(){
      $(".columna-modulo").animate({
          scrollTop: 0
          }, 1000)
      const operacion=this.props.match.params.operacion

      const mensaje_formulario={
          mensaje:"",
          msj_id_cedula:[{mensaje:"",color_texto:""}],
          msj_nombres:[{mensaje:"",color_texto:""}],
          msj_apellidos:[{mensaje:"",color_texto:""}],
          msj_fecha_nacimiento:[{mensaje:"",color_texto:""}],
          msj_sexo_representate:[{mensaje:"",color_texto:""}],
          msj_estatu_representate:[{mensaje:"",color_texto:""}],
          msj_id_estado:[{ mensaje:"", color_texto:""}],
          msj_id_ciudad:[{ mensaje:"", color_texto:""}],
          msj_nivel_instruccion:[{ mensaje:"", color_texto:""}],
          msj_ocupacion:[{ mensaje:"", color_texto:""}],
          msj_direccion: [{ mensaje:"", color_texto:""}],
          msj_telefono_movil_representante: [{ mensaje:"", color_texto:""}],
          msj_telefono_local_representante: [{ mensaje:"", color_texto:""}],
          msj_numero_hijos_representante: [{ mensaje:"", color_texto:""}],
          msj_constitucion_familiar_representante: [{ mensaje:"", color_texto:""}],
          msj_ingresos_representante: [{ mensaje:"", color_texto:""}],
          msj_tipo_vivienda_representante: [{ mensaje:"", color_texto:""}],
      }
      if(operacion==="registrar"){

          const estado_validar_formulario=this.validarFormularioRegistrar()
          if(estado_validar_formulario.estado){
              this.enviarDatos(estado_validar_formulario,(objeto)=>{
                  const mensaje =this.state.mensaje
                  var respuesta_servidor=""
                  axios.post(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/representante/registrar`,objeto)
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
                  axios.put(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/representante/actualizar/${id}`,objeto)
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
  // TODO: Adaptar luego
  enviarDatos(estado_validar_formulario,petion){
      const token=localStorage.getItem('usuario')
      const objeto={
          estudiante:{
            id_estudiante: null,
            cedula_escolar: this.state.id_cedula_escolar,
            cedula_estudiante: this.state.id_cedula,
            nombres_estudiante: this.state.nombres,
            apellidos_estudiante: this.state.apellidos,
            fecha_nacimiento_estudiante: this.state.fecha_nacimiento,
            direccion_nacimiento_estudiante: this.state.direccion_nacimiento,
            id_ciudad: this.state.id_ciudad,
            sexo_estudiante: this.state.sexo_estudiante,
            procedencia_estudiante: this.state.procedencia,
            escolaridad_estudiante: this.state.escolaridad,
            vive_con_estudiante: this.state.vive_con,
            estatus_estudiante: this.state.estatu_estudiante,
          },
          token:token
      }
      petion(objeto)
  }

  regresar(){
      this.props.history.push("/dashboard/configuracion/representante");
  }

  buscarRepresentante(a){
      let input = a.target
      this.validarNumero(a)
      // console.log(input.value)
      let hashRepresentante=JSON.parse(JSON.stringify(this.state.hashRepresentante))
      if(hashRepresentante[input.value]){
          this.setState({
              estadoBusquedaRepresentante:true
          })
          alert("este representante ya esta resgistrado")
      }
      else{
          // console.log("NO OK")
          this.setState({
              estadoBusquedaRepresentante:false
          })
      }
  }

}
