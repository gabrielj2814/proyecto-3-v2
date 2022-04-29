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
import ComponentFormRadioMultiState from '../subComponentes/componentFormRadioMultiState';
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
    this.RemCedulas = this.RemCedulas.bind(this)
    this.consultarCiudadesXEstado = this.consultarCiudadesXEstado.bind(this)
    this.consultarParroquiasXCiudad = this.consultarParroquiasXCiudad.bind(this)
    this.CapturaTipoRepresentante = this.CapturaTipoRepresentante.bind(this)
    this.fechaNacimiento = this.fechaNacimiento.bind(this)
    this.BusquedaRepresentante = this.BusquedaRepresentante.bind(this);
    this.validarFechaNacimineto = this.validarFechaNacimineto.bind(this);
    this.RellenarCamposHijos = this.RellenarCamposHijos.bind(this);
    this.consultarTodoXParroquia = this.consultarTodoXParroquia.bind(this);
    this.cambiarEstatusCampos = this.cambiarEstatusCampos.bind(this);
    this.state={
        // ------------------
        modulo:"",// modulo menu
        estado_menu:false,
        //formulario
        id_asignacion_representante_estudiante: null,
        id_estudiante: "",
        cedula_mama: "",
        nombres_mama: "",
        apellidos_mama: "",

        cedula_papa: "",
        nombres_papa: "",
        apellidos_papa: "",

        cedula_representante: "",
        cedula_escolar: "",
        cedulas_representante: [],
        id_cedula_representante: "",
        tipo_representante: "",
        parentesco_representante: "",
        estatus_asignacion_representante_estudiante:"1",
        // Datos extras para el formulario
        nombre_representante: "",
        nombre_estudiante: "",
        apellido_estudiante: "",
        apellido_representante: "",

        status_form_representante: false,
        nuevo_representante: true,
        campos_activos: "si",

        // Datos representante
        id_cedula_representante: "",
        nombres_representante: "",
        apellidos_representante: "",
        fecha_nacimiento_representante: "",
        nivel_instruccion_representante: "",
        ocupacion_representante: "",
        telefono_movil_representante: "",
        telefono_local_representante: "",
        ingresos_representante: "",
        tipo_vivienda_representante: "",
        constitucion_familiar_representante: "",
        estatus_representante:"1",
        direccion_representante: "",
        id_estado_representante: "",
        id_ciudad_representante: "",
        id_parroquia_representante: "",
        numero_hijos_representante: "",
        numero_estudiante_inicial_representante: "0",
        numero_estudiante_grado_1_representante: "0",
        numero_estudiante_grado_2_representante: "0",
        numero_estudiante_grado_3_representante: "0",
        numero_estudiante_grado_4_representante: "0",
        numero_estudiante_grado_5_representante: "0",
        numero_estudiante_grado_6_representante: "0",
        //MSJ
        msj_id:[{mensaje:"",color_texto:""}],
        msj_cedula_escolar:[{mensaje:"",color_texto:""}],

        msj_tipo_representante:[{mensaje:"",color_texto:""}],
        msj_parentesco_representante:[{mensaje:"",color_texto:""}],
        msj_numero_representante:[{mensaje:"",color_texto:""}],
        msj_estatus_asignacion_representante_estudiante:[{mensaje:"",color_texto:""}],

        msj_id_cedula_representante:[{mensaje:"",color_texto:""}],
        msj_nombres_representante:[{mensaje:"",color_texto:""}],
        msj_apellidos_representante:[{mensaje:"",color_texto:""}],
        msj_fecha_nacimiento_representante:[{mensaje:"",color_texto:""}],
        msj_estatus_representante:[{mensaje:"",color_texto:""}],
        msj_id_estado_representante:[{ mensaje:"", color_texto:""}],
        msj_id_ciudad_representante:[{ mensaje:"", color_texto:""}],
        msj_id_parroquia_representante:[{ mensaje:"", color_texto:""}],
        msj_nivel_instruccion_representante:[{ mensaje:"", color_texto:""}],
        msj_ocupacion_representante:[{ mensaje:"", color_texto:""}],
        msj_direccion_representante: [{ mensaje:"", color_texto:""}],
        msj_telefono_movil_representante: [{ mensaje:"", color_texto:""}],
        msj_telefono_local_representante: [{ mensaje:"", color_texto:""}],
        msj_numero_hijos_representante: [{ mensaje:"", color_texto:""}],
        msj_constitucion_familiar_representante: [{ mensaje:"", color_texto:""}],
        msj_ingresos_representante: [{ mensaje:"", color_texto:""}],
        msj_tipo_vivienda_representante: [{ mensaje:"", color_texto:""}],
        msj_numero_estudiante_inicial_representante:[{ mensaje:"", color_texto:""}],
        msj_numero_estudiante_grado_1_representante:[{ mensaje:"", color_texto:""}],
        msj_numero_estudiante_grado_2_representante:[{ mensaje:"", color_texto:""}],
        msj_numero_estudiante_grado_3_representante:[{ mensaje:"", color_texto:""}],
        msj_numero_estudiante_grado_4_representante:[{ mensaje:"", color_texto:""}],
        msj_numero_estudiante_grado_5_representante:[{ mensaje:"", color_texto:""}],
        msj_numero_estudiante_grado_6_representante:[{ mensaje:"", color_texto:""}],
        //// combo box
        tipos_representantes:[
          {id: "", descripcion: "Seleccione una opcion"},
          {id: "M", descripcion: "Mama"},
          {id: "P", descripcion: "Papa"},
          {id: "O", descripcion: "Otro representante"}
        ],
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
        estados:[],
        ciudades:[],
        parroquias:[],
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
        edadRepresentante:null,
        fechaServidor:null,
        StringExprecion: /[A-Za-z]|[0-9]/
    }
  }

  async UNSAFE_componentWillMount(){
    await this.consultarFechaServidor()
    await this.GetTodosRepresentantesEstudiantes()

    const ruta_api=`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/estado/consultar-todos`,
    nombre_propiedad_lista="estados",
    propiedad_id="id_estado",
    propiedad_descripcion="nombre_estado",
    propiedad_estado="estatu_estado";
    const estados=await this.consultarServidor(ruta_api,nombre_propiedad_lista,propiedad_id,propiedad_descripcion,propiedad_estado)

    const ruta_api_2=`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/ciudad/consultar-x-estado/${estados[0].id}`,
    nombre_propiedad_lista_2="ciudades",
    propiedad_id_2="id_ciudad",
    propiedad_descripcion_2="nombre_ciudad",
    propiedad_estado_2="estatu_ciudad";
    const ciudades=await this.consultarServidor(ruta_api_2,nombre_propiedad_lista_2,propiedad_id_2,propiedad_descripcion_2,propiedad_estado_2)

    const ruta_api_3=`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/parroquia/consultar-ciudad/${ciudades[0].id}`,
    nombre_propiedad_lista_3="datos",
    propiedad_id_3="id_parroquia",
    propiedad_descripcion_3="nombre_parroquia",
    propiedad_estado_3="estatu_parroquia";
    const parroquias=await this.consultarServidor(ruta_api_3,nombre_propiedad_lista_3,propiedad_id_3,propiedad_descripcion_3,propiedad_estado_3)

    this.setState({
        estados,
        ciudades,
        parroquias,
        id_estudiante: this.props.idEstudiante,
        cedula_mama: this.props.cedulaMama,
        cedula_papa: this.props.cedulaPapa,
        cedulas_representante: [this.props.cedulaMama,this.props.cedulaPapa,"O"],
        id_estado_representante:(estados.length===0)?null:estados[0].id,
        id_ciudad_representante:(ciudades.length===0)?null:ciudades[0].id,
        id_parroquia_representante:(parroquias.length===0)?null:parroquias[0].id,
    })

    await this.BuscarEstudiante()
    this.buscarRepresentante()
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

  fechaNacimiento(a){
    let input=a.target
    this.cambiarEstado(a)
    // console.log(input.value)
    let fechaServidor=Moment(this.state.fechaServidor,"YYYY-MM-DD")
    let edadRepresentante=(parseInt(fechaServidor.diff(input.value,"years"))>=18)?fechaServidor.diff(input.value,"years"):null
    this.setState({edadRepresentante})
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

  async consultarCiudadesXEstado(a){
    let input=a.target
    const ruta_api_2=`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/ciudad/consultar-x-estado/${input.value}`,
    nombre_propiedad_lista_2="ciudades",
    propiedad_id_2="id_ciudad",
    propiedad_descripcion_2="nombre_ciudad",
    propiedad_estado_2="estatu_ciudad"
    const ciudades=await this.consultarServidor(ruta_api_2,nombre_propiedad_lista_2,propiedad_id_2,propiedad_descripcion_2,propiedad_estado_2)

    this.setState({
        id_estado:input.value,
        ciudades,
        id_ciudad_representante:(ciudades.length===0)?null:ciudades[0].id
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

      this.setState({
          id_ciudad:input.value,
          parroquias,
          id_parroquia_representante:(parroquias.length===0)?null:parroquias[0].id,
      })
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
              this.props.history.push(`/dashboard/configuracion/asignacion-representante-estudiante${JSON.stringify(mensaje)}`)
          }
      })
      .catch(error=>{
          console.error(error)
      })
      return lista
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
    if(input.name==="id_estudiante" || input.name === "id_cedula_representante" || input.name === "cedula_papa" || input.name === "cedula_mama"){
      if(input.value.length <= 8) this.cambiarEstadoDos(input)
    }else if(input.name==="telefono_movil_representante" || input.name==="telefono_local_representante"){
      if(input.value.length <= 11) this.cambiarEstadoDos(input)
    }else if(input.name === "ingresos_representante"){
      if(input.value.length <= 10) this.cambiarEstadoDos(input)
    }else if(input.name==="cedula_escolar"){
      if(input.value.length <= 12) this.cambiarEstadoDos(input)
    }else{
      if(input.value.length < 10) this.cambiarEstadoDos(input)
    }
  }

  cambiarEstadoDos(input){ this.setState({[input.name]:input.value}) }

  cambiarEstatusCampos(status){
    let array = [
      "id_cedula_representante",
      "nombres_representante",
      "apellidos_representante",
      "fecha_nacimiento_representante",
      "nivel_instruccion_representante",
      "ocupacion_representante",
      "telefono_movil_representante",
      "telefono_local_representante",
      "ingresos_representante",
      "tipo_vivienda_representante",
      "constitucion_familiar_representante",
      "id_estado_representante",
      "id_ciudad_representante",
      "id_parroquia_representante",
    ]
    setTimeout( () => {
      array.map( item => {
        document.getElementById(item).disabled = status
      })
    },100)
  }

  CapturaTipoRepresentante(a){
    var input = (a.target != undefined) ? a.target : a;
    this.setState({[input.name]:input.value})

    if(input.value === "O"){

      this.setState({
        status_form_representante: true,
        campos_activos: "si",
        nuevo_representante: true,
        id_cedula_representante: "",
        nombres_representante: "",
        apellidos_representante: "",
        fecha_nacimiento_representante: "",
        nivel_instruccion_representante: "ingeniero",
        ocupacion_representante: "",
        telefono_movil_representante: "",
        telefono_local_representante: "",
        ingresos_representante: "",
        tipo_vivienda_representante: "",
        constitucion_familiar_representante: "",
        estatus_representante:"1",
        direccion_representante: "",
        id_estado_representante:(this.state.estados.length===0)?null:this.state.estados[0].id,
        id_ciudad_representante:(this.state.ciudades.length===0)?null:this.state.ciudades[0].id,
        id_parroquia_representante:(this.state.parroquias.length===0)?null:this.state.parroquias[0].id,
        numero_hijos_representante: "",
        tipo_representante: "O",
        cedula_representante: "O",
        parentesco_representante: "",
        numero_estudiante_inicial_representante: "0",
        numero_estudiante_grado_1_representante: "0",
        numero_estudiante_grado_2_representante: "0",
        numero_estudiante_grado_3_representante: "0",
        numero_estudiante_grado_4_representante: "0",
        numero_estudiante_grado_5_representante: "0",
        numero_estudiante_grado_6_representante: "0",
      })

      this.cambiarEstatusCampos(false)
    }else{

      let hashRepresentante = JSON.parse(JSON.stringify(this.state.hashRepresentante));

      if(hashRepresentante[input.value]){
        let tipo_representante, cedula_representante, parentesco;
        if(this.state.cedula_mama == input.value){
          tipo_representante = "M";
          parentesco = "MAMA"
        }else{
           tipo_representante = "P"
           parentesco = "PAPA"
        }

        if(this.state.cedula_papa == input.value || this.state.cedula_mama == input.value){
          cedula_representante = input.value;
        }else cedula_representante = "O";

        this.setState({
          status_form_representante: true,
          campos_activos: "no",
          nuevo_representante: false,
          id_cedula_representante: hashRepresentante[input.value].id_cedula_representante,
          nombres_representante: hashRepresentante[input.value].nombres_representante,
          apellidos_representante: hashRepresentante[input.value].apellidos_representante,
          fecha_nacimiento_representante: Moment(hashRepresentante[input.value].fecha_nacimiento_representante).format("YYYY-MM-DD"),
          nivel_instruccion_representante: hashRepresentante[input.value].nivel_instruccion_representante,
          ocupacion_representante: hashRepresentante[input.value].ocupacion_representante,
          telefono_movil_representante: hashRepresentante[input.value].telefono_movil_representante,
          telefono_local_representante: hashRepresentante[input.value].telefono_local_representante,
          ingresos_representante: hashRepresentante[input.value].ingresos_representante,
          tipo_vivienda_representante: hashRepresentante[input.value].tipo_vivienda_representante,
          constitucion_familiar_representante: hashRepresentante[input.value].constitucion_familiar_representante,
          estatus_representante: hashRepresentante[input.value].estatus_representante,
          direccion_representante: hashRepresentante[input.value].direccion_representante,
          tipo_representante: tipo_representante,
          cedula_representante: cedula_representante,
          parentesco_representante: (tipo_representante == "O") ? "" : parentesco,
          id_estado_representante: hashRepresentante[input.value].id_estado,
          id_ciudad_representante: hashRepresentante[input.value].id_ciudad,
          id_parroquia_representante: hashRepresentante[input.value].id_parroquia,
          numero_hijos_representante: hashRepresentante[input.value].numero_hijos_representante,
          numero_estudiante_inicial_representante: hashRepresentante[input.value].numero_estudiante_inicial_representante,
          numero_estudiante_grado_1_representante: hashRepresentante[input.value].numero_estudiante_grado_1_representante,
          numero_estudiante_grado_2_representante: hashRepresentante[input.value].numero_estudiante_grado_2_representante,
          numero_estudiante_grado_3_representante: hashRepresentante[input.value].numero_estudiante_grado_3_representante,
          numero_estudiante_grado_4_representante: hashRepresentante[input.value].numero_estudiante_grado_4_representante,
          numero_estudiante_grado_5_representante: hashRepresentante[input.value].numero_estudiante_grado_5_representante,
          numero_estudiante_grado_6_representante: hashRepresentante[input.value].numero_estudiante_grado_6_representante,
        })

        this.cambiarEstatusCampos(true)
      }
    }
  }

  cambiarEstado(a){
    var input=a.target;
    this.setState({[input.name]:input.value})
  }

  validarCampo(nombre_campo){
      var estado=false

      const valor=this.state[nombre_campo]
      let msj = this.state["msj_"+nombre_campo]

      if(valor !== "" || valor == null){
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

  RellenarCamposHijos(){
    let lista = [
      'numero_estudiante_inicial_representante',
      'numero_estudiante_grado_1_representante',
      'numero_estudiante_grado_2_representante',
      'numero_estudiante_grado_3_representante',
      'numero_estudiante_grado_4_representante',
      'numero_estudiante_grado_5_representante',
      'numero_estudiante_grado_6_representante'
    ];

    lista.forEach( item => {
      let value = this.state[item];
      if(value == "" || value == null) this.setState({[item]: "0"})
    })
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
                  this.RellenarCamposHijos();
                  setTimeout( () => {
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

                    if(!isNaN(total_estudiante_representante)){
                      if(numero_hijos != total_estudiante_representante){
                        estado = false
                        mensaje_campo[0]={mensaje:"El numero de hijos no concuerda con la cantidad estudiantes registrados",color_texto:"rojo"}
                        this.setState({["msj_numero_hijos_representante"]:mensaje_campo})
                        return false;
                      }
                    }else{
                      estado = false
                      mensaje_campo[0]={mensaje:"Los campos no pueden estar vacios",color_texto:"rojo"}
                      this.setState({["msj_numero_hijos_representante"]:mensaje_campo})
                      return false;
                    }
                  }, 100)
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
    let msj_estatus_asignacion_representante_estudiante = this.state["msj_"+name]

    if(valor !== "") msj_estatus_asignacion_representante_estudiante[0] = {mensaje: "", color_texto:"rojo"}
    else msj_estatus_asignacion_representante_estudiante[0] = {mensaje: "Debe de seleccionar el estado de esta asignacion", color_texto:"rojo"}

    this.setState(msj_estatus_asignacion_representante_estudiante)
    if(msj_estatus_asignacion_representante_estudiante[0].mensaje === "") return true; else return false;
  }

  validarFechaNacimineto(){
      var estado=false
      var fecha_representante_nacimiento=Moment(new Date(this.state.fecha_nacimiento_representante))
      fecha_representante_nacimiento.add(1,"d")
      var fecha_minima=Moment();
      var fecha_maxima=Moment();
      fecha_minima.subtract(18,"y")
      fecha_maxima.subtract(99,"y")
      var msj_fecha_nacimiento_representante = this.state.msj_fecha_nacimiento_representante
      if(this.state.fecha_nacimiento_representante!==""){
          if(!fecha_representante_nacimiento.isAfter(fecha_minima)){
              if(fecha_representante_nacimiento.isAfter(fecha_maxima)){
                  estado=true
                  msj_fecha_nacimiento_representante[0]={mensaje:"",color_texto:"rojo"}
                  this.setState(msj_fecha_nacimiento_representante)
              }
              else{
                  msj_fecha_nacimiento_representante[0]={mensaje:"El representante solo puede tener hasta 99 años ",color_texto:"rojo"}
                  this.setState(msj_fecha_nacimiento_representante)
              }
          }
          else{
              msj_fecha_nacimiento_representante[0]={mensaje:"es demadiaso joven",color_texto:"rojo"}
              this.setState(msj_fecha_nacimiento_representante)
          }
      }
      else{
          msj_fecha_nacimiento_representante[0]={mensaje:"la fecha de nacimiento no puede estar vacia",color_texto:"rojo"}
          this.setState(msj_fecha_nacimiento_representante)
      }
      return estado
  }

  validarFormularioRegistrar(){
    // Validaciones de representante
    const validarCedula = this.validarCampoNumero('id_cedula_representante'), validarNombre = this.validarCampo('nombres_representante'), validarApellido = this.validarCampo('apellidos_representante'),
    validarTelefonoMovil = this.validarCampoNumero('telefono_movil_representante'), validarTelefonoLocal = this.validarCampoNumero('telefono_local_representante'),
    validarFechaNacimineto = this.validarFechaNacimineto(), validarOcupacion = this.validarCampo('ocupacion_representante'), validarIngresos = this.validarCampoNumero('ingresos_representante'),
    validarGradoIntruccion = this.validarSelect('nivel_instruccion_representante'), validarNumeroHijos = this.validarCampoNumero('numero_hijos_representante'),
    validarNumEstInicial = this.validarCampoNumero('numero_estudiante_inicial_representante'), ValidarNumEstGrado1 = this.validarCampoNumero('numero_estudiante_grado_1_representante'),
    ValidarNumEstGrado2 = this.validarCampoNumero('numero_estudiante_grado_2_representante'), ValidarNumEstGrado3 = this.validarCampoNumero('numero_estudiante_grado_3_representante'),
    ValidarNumEstGrado4 = this.validarCampoNumero('numero_estudiante_grado_4_representante'), ValidarNumEstGrado5 = this.validarCampoNumero('numero_estudiante_grado_5_representante'),
    ValidarNumEstGrado6 = this.validarCampoNumero('numero_estudiante_grado_6_representante'), ValidarConstFamiliar = this.validarCampo('constitucion_familiar_representante'),
    validarDireccion = this.validarCampo('direccion_representante'), validarTipVivienda = this.validarSelect('tipo_vivienda_representante'), ValidarEstado = this.validarSelect('id_estado_representante'),
    ValidarCiudad = this.validarSelect('id_ciudad_representante'),ValidarParroquia = this.validarSelect('id_parroquia_representante'),ValidarStatus = this.validarRadio('estatus_representante')

    const validar_cedula_escolar = this.validarCampoNumero('cedula_escolar'),
    validar_id_representante = this.validarCampoNumero('id_cedula_representante'),
    validarstatus_asignacion = this.validarRadio('estatus_asignacion_representante_estudiante'),
    validar_parentesco = this.validarCampo('parentesco_representante');

    if(this.state.cedula_representante == ""){
      alert("Debe de seleccionar al representante")
      return {estado: false};
    }

    if(
      validarCedula && validarNombre && validarApellido && validarTelefonoMovil && validarTelefonoLocal && validarFechaNacimineto && validarOcupacion && validarIngresos && validarGradoIntruccion &&
      validarNumeroHijos && ValidarNumEstGrado1 && ValidarNumEstGrado1 && ValidarNumEstGrado2 && ValidarNumEstGrado3 && ValidarNumEstGrado4 && ValidarNumEstGrado5 && ValidarNumEstGrado6 &&
      ValidarConstFamiliar && validarDireccion && validarTipVivienda && ValidarEstado && ValidarCiudad && ValidarParroquia && ValidarStatus &&
      validar_cedula_escolar && validar_id_representante && validarstatus_asignacion && validar_parentesco
    ){

      return {estado: true}
    }else return {estado: false}
  }

  async operacion(){
      $(".columna-modulo").animate({scrollTop: 0}, 1000)
      const mensaje_formulario={
          mensaje:"",
          msj_id:[{mensaje:"",color_texto:""}],
          msj_cedula_escolar:[{mensaje:"",color_texto:""}],

          msj_tipo_representante:[{mensaje:"",color_texto:""}],
          msj_parentesco_representante:[{mensaje:"",color_texto:""}],
          msj_numero_representante:[{mensaje:"",color_texto:""}],
          msj_estatus_asignacion_representante_estudiante:[{mensaje:"",color_texto:""}],

          msj_id_cedula_representante:[{mensaje:"",color_texto:""}],
          msj_nombres_representante:[{mensaje:"",color_texto:""}],
          msj_apellidos_representante:[{mensaje:"",color_texto:""}],
          msj_fecha_nacimiento_representante:[{mensaje:"",color_texto:""}],
          msj_estatus_representante:[{mensaje:"",color_texto:""}],
          msj_id_estado_representante:[{ mensaje:"", color_texto:""}],
          msj_id_ciudad_representante:[{ mensaje:"", color_texto:""}],
          msj_id_parroquia_representante: [{ mensaje:"", color_texto:""}],
          msj_nivel_instruccion_representante:[{ mensaje:"", color_texto:""}],
          msj_ocupacion_representante:[{ mensaje:"", color_texto:""}],
          msj_direccion_representante: [{ mensaje:"", color_texto:""}],
          msj_telefono_movil_representante: [{ mensaje:"", color_texto:""}],
          msj_telefono_local_representante: [{ mensaje:"", color_texto:""}],
          msj_numero_hijos_representante: [{ mensaje:"", color_texto:""}],
          msj_constitucion_familiar_representante: [{ mensaje:"", color_texto:""}],
          msj_ingresos_representante: [{ mensaje:"", color_texto:""}],
          msj_tipo_vivienda_representante: [{ mensaje:"", color_texto:""}],
          msj_numero_estudiante_inicial_representante:[{ mensaje:"", color_texto:""}],
          msj_numero_estudiante_grado_1_representante:[{ mensaje:"", color_texto:""}],
          msj_numero_estudiante_grado_2_representante:[{ mensaje:"", color_texto:""}],
          msj_numero_estudiante_grado_3_representante:[{ mensaje:"", color_texto:""}],
          msj_numero_estudiante_grado_4_representante:[{ mensaje:"", color_texto:""}],
          msj_numero_estudiante_grado_5_representante:[{ mensaje:"", color_texto:""}],
          msj_numero_estudiante_grado_6_representante:[{ mensaje:"", color_texto:""}],
      }
      const estado_validar_formulario=this.validarFormularioRegistrar()
      if(estado_validar_formulario.estado){
        await this.enviarDatos(estado_validar_formulario,(objeto)=>{
          const mensaje =this.state.mensaje
          var respuesta_servidor=""
          // MAMA
          axios.post(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/asignacion-representante-estudiante/registrar`,objeto.mama)
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
          });
          // PAPA
          axios.post(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/asignacion-representante-estudiante/registrar`,objeto.papa)
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
          });
          // Registro Representante
          if(this.state.nuevo_representante){
            axios.post(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/representante/registrar`,objeto.representanteRegistro)
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
          }else{
            axios.put(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/representante/actualizar/${this.state.id_cedula_representante}`,objeto.representanteRegistro)
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
          }
          // Representante
          setTimeout( () => {
            axios.post(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/asignacion-representante-estudiante/registrar`,objeto.representante)
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
          }, 100);
        });

        alert("Registro completado");
        this.props.returnDashoard();
      }
  }

  enviarDatos(estado_validar_formulario,petion){
      const token=localStorage.getItem('usuario')
      const objeto={
        mama:{
          asigRepresenteEstudiante:{
            id_asignacion_representante_estudiante: this.state.id_asignacion_representante_estudiante,
            id_estudiante:this.state.id_estudiante,
            id_cedula_representante:this.state.cedula_mama,
            tipo_representante:"M",
            parentesco:"MAMA",
            estatus_asignacion_representante_estudiante: this.state.estatus_asignacion_representante_estudiante,
          },
          token:token
        },
        papa:{
          asigRepresenteEstudiante:{
            id_asignacion_representante_estudiante:this.state.id_asignacion_representante_estudiante,
            id_estudiante:this.state.id_estudiante,
            id_cedula_representante:this.state.cedula_papa,
            tipo_representante:"P",
            parentesco:"PAPA",
            estatus_asignacion_representante_estudiante: this.state.estatus_asignacion_representante_estudiante,
          },
          token:token
        },
        representanteRegistro:{
          representante:{
            id_cedula_representante:this.state.id_cedula_representante,
            nombres_representante:this.state.nombres_representante,
            apellidos_representante:this.state.apellidos_representante,
            fecha_nacimiento_representante:Moment(this.state.fecha_nacimiento_representante).format("YYYY-MM-DD"),
            nivel_instruccion_representante:this.state.nivel_instruccion_representante,
            ocupacion_representante:this.state.ocupacion_representante,
            telefono_movil_representante:this.state.telefono_movil_representante,
            telefono_local_representante:this.state.telefono_local_representante,
            ingresos_representante:this.state.ingresos_representante,
            tipo_vivienda_representante:this.state.tipo_vivienda_representante,
            constitucion_familiar_representante:this.state.constitucion_familiar_representante,
            estatus_representante:this.state.estatus_representante,
            direccion_representante:this.state.direccion_representante,
            id_parroquia:this.state.id_parroquia_representante,
            numero_hijos_representante:this.state.numero_hijos_representante,
            numero_estudiante_inicial_representante:this.state.numero_estudiante_inicial_representante,
            numero_estudiante_grado_1_representante:this.state.numero_estudiante_grado_1_representante,
            numero_estudiante_grado_2_representante:this.state.numero_estudiante_grado_2_representante,
            numero_estudiante_grado_3_representante:this.state.numero_estudiante_grado_3_representante,
            numero_estudiante_grado_4_representante:this.state.numero_estudiante_grado_4_representante,
            numero_estudiante_grado_5_representante:this.state.numero_estudiante_grado_5_representante,
            numero_estudiante_grado_6_representante:this.state.numero_estudiante_grado_6_representante,
          },
          token:token
        },
        representante:{
          asigRepresenteEstudiante:{
            id_asignacion_representante_estudiante:this.state.id_asignacion_representante_estudiante,
            id_estudiante:this.state.id_estudiante,
            id_cedula_representante:this.state.id_cedula_representante,
            tipo_representante:this.state.tipo_representante,
            parentesco:this.state.parentesco_representante,
            estatus_asignacion_representante_estudiante: this.state.estatus_asignacion_representante_estudiante,
          },
          token:token
        }
      }
      petion(objeto)
  }

  regresar(){ this.props.history.push("/dashboard/configuracion/estudiante"); }

  BuscarEstudiante(){

    let hashEstudiante = JSON.parse(JSON.stringify(this.state.hashEstudiante));
    console.log(hashEstudiante)

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

  async BusquedaRepresentante(a){
    let input = a.target
    this.validarNumero(a)
    let hashRepresentante=JSON.parse(JSON.stringify(this.state.hashRepresentante))
    if(hashRepresentante[input.value]){

      let datos = await this.consultarTodoXParroquia(hashRepresentante[input.value].id_parroquia)
      this.cambiarEstatusCampos(true)

      this.setState({
        estadoBusquedaRepresentante:true,
        nuevo_representante: false,
        id_cedula_representante: hashRepresentante[input.value].id_cedula_representante,
        nombres_representante: hashRepresentante[input.value].nombres_representante,
        apellidos_representante: hashRepresentante[input.value].apellidos_representante,
        fecha_nacimiento_representante:Moment( hashRepresentante[input.value].fecha_nacimiento_representante).format("YYYY-MM-DD"),
        nivel_instruccion_representante: hashRepresentante[input.value].nivel_instruccion_representante,
        ocupacion_representante: hashRepresentante[input.value].ocupacion_representante,
        telefono_movil_representante: hashRepresentante[input.value].telefono_movil_representante,
        telefono_local_representante: hashRepresentante[input.value].telefono_local_representante,
        ingresos_representante: hashRepresentante[input.value].ingresos_representante,
        tipo_vivienda_representante: hashRepresentante[input.value].tipo_vivienda_representante,
        constitucion_familiar_representante: hashRepresentante[input.value].constitucion_familiar_representante,
        estatus_representante: hashRepresentante[input.value].estatus_representante,
        id_estado_representante: datos.id_estado,
        id_ciudad_representante: datos.id_ciudad,
        id_parroquia_representante: datos.id_parroquia,
        direccion_representante: hashRepresentante[input.value].direccion_representante,
        numero_hijos_representante: hashRepresentante[input.value].numero_hijos_representante,
        numero_estudiante_inicial_representante: hashRepresentante[input.value].numero_estudiante_inicial_representante,
        numero_estudiante_grado_1_representante: hashRepresentante[input.value].numero_estudiante_grado_1_representante,
        numero_estudiante_grado_2_representante: hashRepresentante[input.value].numero_estudiante_grado_2_representante,
        numero_estudiante_grado_3_representante: hashRepresentante[input.value].numero_estudiante_grado_3_representante,
        numero_estudiante_grado_4_representante: hashRepresentante[input.value].numero_estudiante_grado_4_representante,
        numero_estudiante_grado_5_representante: hashRepresentante[input.value].numero_estudiante_grado_5_representante,
        numero_estudiante_grado_6_representante: hashRepresentante[input.value].numero_estudiante_grado_6_representante,
      })
      alert("este representante ya esta resgistrado")
      this.CapturaTipoRepresentante({name:"cedula_representante",value: input.value})
    }
    else{
      // console.log("NO OK")
      this.setState({
        estadoBusquedaRepresentante:false,
        nuevo_representante: true
      })
    }
  }

  buscarRepresentante(){
    let hashRepresentante = JSON.parse(JSON.stringify(this.state.hashRepresentante));

    if(hashRepresentante[this.state.cedula_mama]){
      this.setState({
        estadoBusquedaRepresentante: true,
        nombre_mama: hashRepresentante[this.state.cedula_mama].nombres_representante,
        apellido_mama: hashRepresentante[this.state.cedula_mama].apellidos_representante
      });
    }

    if(hashRepresentante[this.state.cedula_papa]){
      this.setState({
        estadoBusquedaRepresentante: true,
        nombre_papa: hashRepresentante[this.state.cedula_papa].nombres_representante,
        apellido_papa: hashRepresentante[this.state.cedula_papa].apellidos_representante
      });
    }

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
                  <div className="row mt-3">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                          <span className="sub-titulo-form-reposo-trabajador">Datos del estudiante</span>
                      </div>
                  </div>
                  <div className="row justify-content-center align-items-center">
                    <ComponentFormCampo clasesColumna="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4"
                        clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_cedula_escolar[0]}
                        nombreCampo="Cedula del estudiante:" activo="si" type="text" value={this.state.cedula_escolar}
                        name="cedula_escolar" id="cedula_escolar" placeholder="Cédula escolar del estudiante" eventoPadre={this.BuscarEstudiante}
                      />
                      <div className='col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5'>
                        <label>Nombre del estudiante: {this.state.nombre_estudiante}</label><br></br>
                        <label>Apellido del estudiante: {this.state.apellido_estudiante}</label>
                      </div>
                  </div>
                  <div className="row mt-3">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                          <span className="sub-titulo-form-reposo-trabajador">Datos de la Mama</span>
                      </div>
                  </div>
                  <div className="row justify-content-center align-items-center">
                    <ComponentFormCampo clasesColumna="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4"
                        clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_cedula_escolar[0]}
                        nombreCampo="Cedula de la Mama:" activo="si" type="text" value={this.state.cedula_mama}
                        name="cedula_mama" id="cedula_mama" placeholder="Cedula de la mama"
                      />

                    <div className='col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5'>
                        <label>Nombre de la Mama: {this.state.nombre_mama}</label><br></br>
                        <label>Apellido de la Mama: {this.state.apellido_mama}</label>
                    </div>
                  </div>

                  <div className="row mt-3">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                          <span className="sub-titulo-form-reposo-trabajador">Datos del Papa</span>
                      </div>
                  </div>
                  <div className="row justify-content-center align-items-center">
                    <ComponentFormCampo clasesColumna="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4"
                        clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_cedula_escolar[0]}
                        nombreCampo="Cedula del Papa:" activo="si" type="text" value={this.state.cedula_papa}
                        name="cedula_papa" id="cedula_papa" placeholder="Cedula del Papa"
                      />

                    <div className='col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5'>
                        <label>Nombre de la Papa: {this.state.nombre_papa}</label><br></br>
                        <label>Apellido de la Papa: {this.state.apellido_papa}</label>
                    </div>
                  </div>
                  <div className="row mt-3">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                          <span className="sub-titulo-form-reposo-trabajador">Datos del representante</span>
                      </div>
                  </div>
                  <div className="row justify-content-center align-items-center">
                    <ComponentFormRadioMultiState
                      clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                      extra="custom-control-inline"
                      nombreCampoRadio="Seleccione el representante :"
                      name="cedula_representante"
                      nombreLabelRadio={["Mama","Papa","Otro"]}
                      checkedRadio={this.state.cedula_representante}

                      idRadio={["mama","papa","otro"]}

                      estates={this.state.cedulas_representante}
                      eventoPadre={this.CapturaTipoRepresentante}
                    />
                  </div>
                  {this.state.status_form_representante == true &&

                    <div>
                      <div className="row justify-content-center">
                        <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_id_cedula_representante[0]}
                            nombreCampo="Cédula:" activo={this.state.campos_activos} type="text" value={this.state.id_cedula_representante}
                            name="id_cedula_representante" id="id_cedula_representante" placeholder="Cédula" eventoPadre={this.BusquedaRepresentante}
                          />
                        <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_nombres_representante[0]}
                            nombreCampo="Nombres:" activo={this.state.campos_activos} type="text" value={this.state.nombres_representante}
                            name="nombres_representante" id="nombres_representante" placeholder="Nombre" eventoPadre={this.validarTexto}
                          />
                          <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                          clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_apellidos_representante[0]}
                          nombreCampo="Apellidos:" activo={this.state.campos_activos} type="text" value={this.state.apellidos_representante}
                          name="apellidos_representante" id="apellidos_representante" placeholder="Apellido" eventoPadre={this.validarTexto}
                        />
                      </div>
                      <div className="row justify-content-center">
                          <ComponentFormCampo clasesColumna="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4"
                            clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_telefono_movil_representante[0]}
                            nombreCampo="Telefono movil:" activo={this.state.campos_activos} type="text" value={this.state.telefono_movil_representante}
                            name="telefono_movil_representante" id="telefono_movil_representante" placeholder="Telefono movil" eventoPadre={this.validarNumero}
                          />
                        <ComponentFormCampo clasesColumna="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4"
                            clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_telefono_local_representante[0]}
                            nombreCampo="Telefono local:" activo={this.state.campos_activos} type="text" value={this.state.telefono_local_representante}
                            name="telefono_local_representante" id="telefono_local_representante" placeholder="Telefono local" eventoPadre={this.validarNumero}
                          />
                      </div>
                      <div className="row justify-content-center mx-auto my-2">
                        <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                          clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_ocupacion_representante[0]}
                          nombreCampo="Ocupacion:" activo={this.state.campos_activos} type="text" value={this.state.ocupacion_representante}
                          name="ocupacion_representante" id="ocupacion_representante" placeholder="Ocupacion" eventoPadre={this.validarTexto}
                        />
                        <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                          clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_ingresos_representante[0]}
                          nombreCampo="Ingresos:" activo={this.state.campos_activos} type="text" value={this.state.ingresos_representante}
                          name="ingresos_representante" id="ingresos_representante" placeholder="Ingresos del representante" eventoPadre={this.validarNumero}
                        />
                        <ComponentFormSelect
                          clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                          obligatorio="si"
                          mensaje={this.state.msj_nivel_instruccion_representante[0]}
                          nombreCampoSelect="Nivel Instrucción:"
                          clasesSelect="custom-select"
                          name="nivel_instruccion_representante"
                          id="nivel_instruccion_representante"
                          eventoPadre={this.cambiarEstado}
                          defaultValue={this.state.nivel_instruccion_representante}
                          option={this.state.grados_instruccion}
                        />
                      </div>
                      <div className="row justify-content-center">
                        <ComponentFormDate clasesColumna="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4"
                            obligatorio="si" mensaje={this.state.msj_fecha_nacimiento_representante[0]} nombreCampoDate="Fecha de Nacimiento:"
                            clasesCampo="form-control" value={this.state.fecha_nacimiento_representante} name="fecha_nacimiento_representante"
                            id="fecha_nacimiento_representante" eventoPadre={this.fechaNacimiento}
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
                          clasesColumna="col-4 col-ms-4 col-md-4 col-lg-4 col-xl-4"
                          obligatorio="si"
                          mensaje={this.state.msj_tipo_vivienda_representante[0]}
                          nombreCampoSelect="Tipo de vivienda:"
                          clasesSelect="custom-select"
                          name="tipo_vivienda_representante"
                          id="tipo_vivienda_representante"
                          eventoPadre={this.cambiarEstado}
                          defaultValue={this.state.tipo_vivienda_representante}
                          option={this.state.tipo_viviendas}
                        />
                      </div>
                      <div className="row justify-content-center">
                          <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-trabajador">
                              <span className="h4">Numero de alumnos inscritos en el plantel por el mismo representante</span>
                          </div>
                      </div>
                      <div className="row justify-content-center mt-1">
                        <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                          clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_numero_hijos_representante[0]}
                          nombreCampo="Numero de hijos:" activo="si" type="text" value={this.state.numero_hijos_representante}
                          name="numero_hijos_representante" id="numer_hijos_representante" placeholder="Numero de hijos" eventoPadre={this.validarNumero}
                        />

                        <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                          clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_numero_estudiante_inicial_representante[0]}
                          nombreCampo="En inicial:" activo="si" type="text" value={this.state.numero_estudiante_inicial_representante}
                          name="numero_estudiante_inicial_representante" id="numero_estudiante_inicial" placeholder="Numero estudiantes en inicial" eventoPadre={this.validarNumero}
                        />
                        <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                          clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_numero_estudiante_grado_1_representante[0]}
                          nombreCampo="En Primer Grado:" activo="si" type="text" value={this.state.numero_estudiante_grado_1_representante}
                          name="numero_estudiante_grado_1_representante" id="numero_estudiante_grado_1_representante" placeholder="Numero estudiantes en grado (1) " eventoPadre={this.validarNumero}
                        />
                      </div>

                      <div className="row justify-content-center mt-1">
                        <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                          clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_numero_estudiante_grado_2_representante[0]}
                          nombreCampo="En Segundo Grado:" activo="si" type="text" value={this.state.numero_estudiante_grado_2_representante}
                          name="numero_estudiante_grado_2_representante" id="numero_estudiante_grado_2_representante" placeholder="Numero estudiantes en grado (2) " eventoPadre={this.validarNumero}
                        />
                        <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                          clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_numero_estudiante_grado_3_representante[0]}
                          nombreCampo="En Tercer Grado:" activo="si" type="text" value={this.state.numero_estudiante_grado_3_representante}
                          name="numero_estudiante_grado_3_representante" id="numero_estudiante_grado_3_representante" placeholder="Numero estudiantes en grado (3) " eventoPadre={this.validarNumero}
                        />
                        <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                          clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_numero_estudiante_grado_4_representante[0]}
                          nombreCampo="En Cuarto Grado:" activo="si" type="text" value={this.state.numero_estudiante_grado_4_representante}
                          name="numero_estudiante_grado_4_representante" id="numero_estudiante_grado_4_representante" placeholder="Numero estudiantes en grado (4) " eventoPadre={this.validarNumero}
                        />
                      </div>

                      <div className="row justify-content-center mt-1">
                        <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                          clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_numero_estudiante_grado_5_representante[0]}
                          nombreCampo="En Quinto Grado:" activo="si" type="text" value={this.state.numero_estudiante_grado_5_representante}
                          name="numero_estudiante_grado_5_representante" id="numero_estudiante_grado_5_representante" placeholder="Numero estudiantes en grado (5) " eventoPadre={this.validarNumero}
                        />
                        <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                          clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_numero_estudiante_grado_6_representante[0]}
                          nombreCampo="En Sexto Grado:" activo="si" type="text" value={this.state.numero_estudiante_grado_6_representante}
                          name="numero_estudiante_grado_6_representante" id="numero_estudiante_grado_6_representante" placeholder="Numero estudiantes en grado (6) " eventoPadre={this.validarNumero}
                        />
                        <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                          clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_constitucion_familiar_representante[0]}
                          nombreCampo="Constitucion familiar:" activo="si" type="text" value={this.state.constitucion_familiar_representante}
                          name="constitucion_familiar_representante" id="constitucion_familiar_representante" placeholder="Constitucion familiar" eventoPadre={this.validarTexto}
                        />
                      </div>
                      <div className="row justify-content-center mx-auto">
                        <ComponentFormTextArea clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                          obligatorio="si" mensaje={this.state.msj_direccion_representante[0]} nombreCampoTextArea="Dirección:"
                          clasesTextArear="form-control" name="direccion_representante" id="direccion_representante" value={this.state.direccion_representante}
                          eventoPadre={this.cambiarEstado}
                        />
                      </div>
                      <div className="row justify-content-center mt-1">
                        <ComponentFormSelect
                          clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                          obligatorio="si"
                          mensaje={this.state.msj_id_estado_representante}
                          nombreCampoSelect="Estado:"
                          clasesSelect="custom-select"
                          name="id_estado_representante"
                          id="id_estado_representante"
                          eventoPadre={this.consultarCiudadesXEstado}
                          defaultValue={this.state.id_estado_representante}
                          option={this.state.estados}
                        />
                        <ComponentFormSelect
                          clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                          obligatorio="si"
                          mensaje={this.state.msj_id_ciudad_representante}
                          nombreCampoSelect="Ciudad:"
                          clasesSelect="custom-select"
                          name="id_ciudad_representante"
                          id="id_ciudad_representante"
                          eventoPadre={this.consultarParroquiasXCiudad}
                          defaultValue={this.state.id_ciudad_representante}
                          option={this.state.ciudades}
                        />
                        <ComponentFormSelect
                          clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                          obligatorio="si"
                          mensaje={this.state.msj_id_parroquia_representante}
                          nombreCampoSelect="Parroquia:"
                          clasesSelect="custom-select"
                          name="id_parroquia_representante"
                          id="id_parroquia_representante"
                          eventoPadre={this.cambiarEstado}
                          defaultValue={this.state.id_parroquia_representante}
                          option={this.state.parroquias}
                        />
                      </div>
                    </div>
                  }

                  {this.state.cedula_representante === "O" &&
                    <div className="row justify-content-center">
                      <ComponentFormTextArea clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                        obligatorio="si" mensaje={this.state.msj_parentesco_representante[0]} nombreCampoTextArea="Parentesco:"
                        clasesTextArear="form-control" name="parentesco_representante" id="parentesco_representante" value={this.state.parentesco_representante}
                        eventoPadre={this.cambiarEstado}
                      />
                    </div>
                  }

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
