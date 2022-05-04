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
    this.RellenarCamposHijos = this.RellenarCamposHijos.bind(this)
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
        estatus_representante:"1",
        id_parroquia: "",
        numero_estudiante_inicial_representante: "0",
        numero_estudiante_grado_1_representante: "0",
        numero_estudiante_grado_2_representante: "0",
        numero_estudiante_grado_3_representante: "0",
        numero_estudiante_grado_4_representante: "0",
        numero_estudiante_grado_5_representante: "0",
        numero_estudiante_grado_6_representante: "0",
        //MSJ
        msj_id_cedula:[{mensaje:"",color_texto:""}],
        msj_nombres:[{mensaje:"",color_texto:""}],
        msj_apellidos:[{mensaje:"",color_texto:""}],
        msj_fecha_nacimiento:[{mensaje:"",color_texto:""}],
        msj_estatus_representante:[{mensaje:"",color_texto:""}],
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
        msj_id_parroquia: [{ mensaje:"", color_texto:""}],
        msj_numero_estudiante_inicial_representante:[{ mensaje:"", color_texto:""}],
        msj_numero_estudiante_grado_1_representante:[{ mensaje:"", color_texto:""}],
        msj_numero_estudiante_grado_2_representante:[{ mensaje:"", color_texto:""}],
        msj_numero_estudiante_grado_3_representante:[{ mensaje:"", color_texto:""}],
        msj_numero_estudiante_grado_4_representante:[{ mensaje:"", color_texto:""}],
        msj_numero_estudiante_grado_5_representante:[{ mensaje:"", color_texto:""}],
        msj_numero_estudiante_grado_6_representante:[{ mensaje:"", color_texto:""}],
        //// combo box
        estados:[],
        ciudades:[],
        parroquias:[],
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
            estados,
            ciudades,
            parroquias,
            id_estado:(estados.length===0)?null:estados[0].id,
            id_ciudad:(ciudades.length===0)?null:ciudades[0].id,
            id_parroquia:(parroquias.length===0)?null:parroquias[0].id,
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

            const ruta_api_3=`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/parroquia/consultar-ciudad/${ciudades[0].id}`,
            nombre_propiedad_lista_3="datos",
            propiedad_id_3="id_parroquia",
            propiedad_descripcion_3="nombre_parroquia",
            propiedad_estado_3="estatu_parroquia"
            const parroquias=await this.consultarServidor(ruta_api_3,nombre_propiedad_lista_3,propiedad_id_3,propiedad_descripcion_3,propiedad_estado_3)

            this.setState({
              id_cedula: datos.id_cedula_representante,
              nombres: datos.nombres_representante,
              apellidos: datos.apellidos_representante,
              fecha_nacimiento: Moment(datos.fecha_nacimiento_representante).format("YYYY-MM-DD"),
              nivel_instruccion: datos.nivel_instruccion_representante,
              ocupacion: datos.ocupacion_representante,
              direccion: datos.direccion_representante,
              id_ciudad: datos.id_ciudad,
              telefono_movil_representante: datos.telefono_movil_representante,
              telefono_local_representante: datos.telefono_local_representante,
              numero_hijos_representante: datos.numero_hijos_representante,
              numero_estudiante_inicial_representante: datos.numero_estudiante_inicial_representante,
              numero_estudiante_grado_1_representante: datos.numero_estudiante_grado_1_representante,
              numero_estudiante_grado_2_representante: datos.numero_estudiante_grado_2_representante,
              numero_estudiante_grado_3_representante: datos.numero_estudiante_grado_3_representante,
              numero_estudiante_grado_4_representante: datos.numero_estudiante_grado_4_representante,
              numero_estudiante_grado_5_representante: datos.numero_estudiante_grado_5_representante,
              numero_estudiante_grado_6_representante: datos.numero_estudiante_grado_6_representante,
              constitucion_familiar_representante: datos.constitucion_familiar_representante,
              ingresos_representante: datos.ingresos_representante,
              tipo_vivienda_representante: datos.tipo_vivienda_representante,
              estatus_representante: datos.estatus_representante,
              estados: estados,
              ciudades: ciudades,
              parroquias: parroquias,
              id_parroquia: datos.id_parroquia,
              id_estado:datos.id_estado,
            })

            document.getElementById("tipo_vivienda_representante").value=this.state.tipo_vivienda_representante
            document.getElementById("id_estado").value=datosCiudad.id_estado
            document.getElementById("id_ciudad").value=datos.id_ciudad
          }else{
            alert("no tienes acesso a este modulo(sera redirigido a la vista anterior)")
            this.props.history.goBack()
          }
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
        console.log("error al conectar con el servidor")
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
    return await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/representante/consultar/${id}/${token}`)
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
    const ruta_api_2=`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/ciudad/consultar-x-estado/${input.value}`,
    nombre_propiedad_lista_2="ciudades",
    propiedad_id_2="id_ciudad",
    propiedad_descripcion_2="nombre_ciudad",
    propiedad_estado_2="estatu_ciudad"
    const ciudades=await this.consultarServidor(ruta_api_2,nombre_propiedad_lista_2,propiedad_id_2,propiedad_descripcion_2,propiedad_estado_2)

    this.setState({
        id_estado:input.value,
        ciudades,
        id_ciudad:(ciudades.length===0)?null:ciudades[0].id
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
          id_parroquia_nacimiento:(parroquias.length===0)?null:parroquias[0].id,
          id_parroquia_vive:(parroquias.length===0)?null:parroquias[0].id
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
    else if(input.name==="telefono_movil_representante" || input.name==="telefono_local_representante"){
        if(input.value.length<=11){
            this.cambiarEstadoDos(input)
        }
    }else if(input.name === "ingresos_representante"){
      if(input.value.length<=10){
        this.cambiarEstadoDos(input)
      }
    }else{
      if(input.value.length < 10){
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
    let fechaServidor=Moment(this.state.fechaServidor,"YYYY-MM-DD")
    let edadRepresentante=(parseInt(fechaServidor.diff(input.value,"years")))
    this.setState({edadRepresentante})
  }

  validarCampo(nombre_campo){
    var estado=false
    const valor=this.state[nombre_campo]
    let msj_nombres=this.state["msj_"+nombre_campo]
    let msj_apellidos=this.state["msj_"+nombre_campo]
    let msj_ocupacion = this.state["msj_"+nombre_campo]
    let msj_constitucion_familiar_representante = this.state["msj_"+nombre_campo]

    if(valor!==""){
      if(this.state.StringExprecion.test(valor)){
        estado=true
        msj_nombres[0] = {mensaje: "",color_texto:"rojo"}
        msj_apellidos[0] = {mensaje: "",color_texto:"rojo"}
        msj_ocupacion[0] = {mensaje: "",color_texto:"rojo"}
        msj_constitucion_familiar_representante[0] = {mensaje: "",color_texto:"rojo"}
      }else{
        msj_nombres[0] = {mensaje: "este campo solo permite letras",color_texto:"rojo"}
        msj_apellidos[0] = {mensaje: "este campo solo permite letras",color_texto:"rojo"}
        msj_ocupacion[0] = {mensaje: "este campo solo permite letras",color_texto:"rojo"}
        msj_constitucion_familiar_representante[0] = {mensaje: "este campo solo permite letras",color_texto:"rojo"}
      }
    }else{
      msj_nombres[0] = {mensaje: "Este campo no puede estar vacio",color_texto:"rojo"}
      msj_apellidos[0] = {mensaje: "Este campo no puede estar vacio",color_texto:"rojo"}
      msj_ocupacion[0] = {mensaje: "Este campo no puede estar vacio",color_texto:"rojo"}
      msj_constitucion_familiar_representante[0] = {mensaje: "Este campo no puede estar vacio",color_texto:"rojo"}
    }

    if(nombre_campo === "nombres") this.setState(msj_nombres)
    else if(nombre_campo === "constitucion_familiar_representante") this.setState(msj_constitucion_familiar_representante)
    else if(nombre_campo === "ocupacion") this.setState(msj_ocupacion)
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
      estatus_representante:"1",
      id_parroquia:"",
      numero_estudiante_inicial_representante: "",
      numero_estudiante_grado_1_representante: "",
      numero_estudiante_grado_2_representante: "",
      numero_estudiante_grado_3_representante: "",
      numero_estudiante_grado_4_representante: "",
      numero_estudiante_grado_5_representante: "",
      numero_estudiante_grado_6_representante: "",
      //MSJ
      msj_id_cedula:mensaje_campo,
      msj_nombres:mensaje_campo,
      msj_apellidos:mensaje_campo,
      msj_fecha_nacimiento:mensaje_campo,
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
      msj_id_parroquia:mensaje_campo,
      numero_estudiante_inicial_representante:mensaje_campo,
      numero_estudiante_grado_1_representante:mensaje_campo,
      numero_estudiante_grado_2_representante:mensaje_campo,
      numero_estudiante_grado_3_representante:mensaje_campo,
      numero_estudiante_grado_4_representante:mensaje_campo,
      numero_estudiante_grado_5_representante:mensaje_campo,
      numero_estudiante_grado_6_representante:mensaje_campo,
      edadRepresentante:null,
    })
    this.props.history.push("/dashboard/configuracion/representante/registrar")
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
    let msj_id_ciudad = this.state["msj_"+name], msj_id_estado = this.state["msj_"+name], msj_nivel_instruccion = this.state["msj_"+name],
    msj_tipo_vivienda_representante = this.state["msj_"+name],msj_id_parroquia = this.state["msj_"+name];

    if(valor != ""){
      estado = true
      msj_id_ciudad[0] = {mensaje: "", color_texto:"rojo"}
      msj_id_estado[0] = {mensaje: "", color_texto:"rojo"}
      msj_id_parroquia[0] = {mensaje: "", color_texto:"rojo"}
      msj_nivel_instruccion[0] = {mensaje: "", color_texto:"rojo"}
      msj_tipo_vivienda_representante[0] = {mensaje:"", color_texto:"rojo"}
    }else{
      msj_id_ciudad[0] = {mensaje: "Debe de seleccionar una ciudad", color_texto:"rojo"}
      msj_id_estado[0] = {mensaje: "Debe de seleccionar un estado", color_texto:"rojo"}
      msj_id_parroquia[0] = {mensaje: "Debe de seleccionar un estado", color_texto:"rojo"}
      msj_nivel_instruccion[0] = {mensaje: "Debe de seleccionar un grado de intrucccion", color_texto:"rojo"}
      msj_tipo_vivienda_representante[0] = {mensaje:"Debe de seleccionar una opcion", color_texto:"rojo"}
    }
    if(name === "id_ciudad") this.setState(msj_id_ciudad)
    else if(name === "id_estado") this.setState(msj_id_estado)
    else if(name === "id_parroquia") this.setState(msj_id_parroquia)
    else if(name === "nivel_instruccion") this.setState(msj_nivel_instruccion)
    else if(name === "tipo_vivienda_representante") this.setState(msj_tipo_vivienda_representante)
    return estado
  }

  validarRadio(name){
    let estado = false
    const valor = this.state[name]
    let msj_estatus_representante = this.state["msj_"+name]
    if(valor !== ""){
      estado = true
      msj_estatus_representante[0] = {mensaje: "", color_texto:"rojo"}
    }else{
      msj_estatus_representante[0] = {mensaje: "Debe de seleccionar el estado del representante", color_texto:"rojo"}
    }
    if(name === "estatus_representante") this.setState(msj_estatus_representante)
    return estado
  }

  validarFormularioRegistrar(){
    const validarCedula = this.validarCampoNumero('id_cedula'), validarNombre = this.validarCampo('nombres'), validarApellido = this.validarCampo('apellidos'),
    validarTelefonoMovil = this.validarCampoNumero('telefono_movil_representante'), validarTelefonoLocal = this.validarCampoNumero('telefono_local_representante'),
    validarFechaNacimineto = this.validarFechaNacimineto(), validarOcupacion = this.validarCampo('ocupacion'), validarIngresos = this.validarCampoNumero('ingresos_representante'),
    validarGradoIntruccion = this.validarSelect('nivel_instruccion'), validarNumeroHijos = this.validarCampoNumero('numero_hijos_representante'),
    validarNumEstInicial = this.validarCampoNumero('numero_estudiante_inicial_representante'), ValidarNumEstGrado1 = this.validarCampoNumero('numero_estudiante_grado_1_representante'),
    ValidarNumEstGrado2 = this.validarCampoNumero('numero_estudiante_grado_2_representante'), ValidarNumEstGrado3 = this.validarCampoNumero('numero_estudiante_grado_3_representante'),
    ValidarNumEstGrado4 = this.validarCampoNumero('numero_estudiante_grado_4_representante'), ValidarNumEstGrado5 = this.validarCampoNumero('numero_estudiante_grado_5_representante'),
    ValidarNumEstGrado6 = this.validarCampoNumero('numero_estudiante_grado_6_representante'), ValidarConstFamiliar = this.validarCampo('constitucion_familiar_representante'),
    validarDireccion = this.validarDireccion('direccion'), validarTipVivienda = this.validarSelect('tipo_vivienda_representante'), ValidarEstado = this.validarSelect('id_estado'),
    ValidarCiudad = this.validarSelect('id_ciudad'),ValidarParroquia = this.validarSelect('id_parroquia'),ValidarStatus = this.validarRadio('estatus_representante')

    if(
      validarCedula && validarNombre && validarApellido && validarTelefonoMovil && validarTelefonoLocal && validarFechaNacimineto && validarOcupacion && validarIngresos && validarGradoIntruccion &&
      validarNumeroHijos && ValidarNumEstGrado1 && ValidarNumEstGrado1 && ValidarNumEstGrado2 && ValidarNumEstGrado3 && ValidarNumEstGrado4 && ValidarNumEstGrado5 && ValidarNumEstGrado6 &&
      ValidarConstFamiliar && validarDireccion && validarTipVivienda && ValidarEstado && ValidarCiudad && ValidarParroquia && ValidarStatus
    ){
      return { estado: true, fecha: validarFechaNacimineto.fecha }
    }else{
      return {estado: false}
    }
  }

  validarFormularioActuazliar(){

    const validarCedula = this.validarCampoNumero('id_cedula'), validarNombre = this.validarCampo('nombres'), validarApellido = this.validarCampo('apellidos'),
    validarTelefonoMovil = this.validarCampoNumero('telefono_movil_representante'), validarTelefonoLocal = this.validarCampoNumero('telefono_local_representante'),
    validarFechaNacimineto = this.validarFechaNacimineto(), validarOcupacion = this.validarCampo('ocupacion'), validarIngresos = this.validarCampoNumero('ingresos_representante'),
    validarGradoIntruccion = this.validarSelect('nivel_instruccion'), validarNumeroHijos = this.validarCampoNumero('numero_hijos_representante'),
    validarNumEstInicial = this.validarCampoNumero('numero_estudiante_inicial_representante'), ValidarNumEstGrado1 = this.validarCampoNumero('numero_estudiante_grado_1_representante'),
    ValidarNumEstGrado2 = this.validarCampoNumero('numero_estudiante_grado_2_representante'), ValidarNumEstGrado3 = this.validarCampoNumero('numero_estudiante_grado_3_representante'),
    ValidarNumEstGrado4 = this.validarCampoNumero('numero_estudiante_grado_4_representante'), ValidarNumEstGrado5 = this.validarCampoNumero('numero_estudiante_grado_5_representante'),
    ValidarNumEstGrado6 = this.validarCampoNumero('numero_estudiante_grado_6_representante'), ValidarConstFamiliar = this.validarCampo('constitucion_familiar_representante'),
    validarDireccion = this.validarDireccion('direccion'), validarTipVivienda = this.validarSelect('tipo_vivienda_representante'), ValidarEstado = this.validarSelect('id_estado'),
    ValidarCiudad = this.validarSelect('id_ciudad'),ValidarParroquia = this.validarSelect('id_parroquia'), ValidarStatus = this.validarRadio('estatus_representante')

    if(
      validarCedula && validarNombre && validarApellido && validarTelefonoMovil && validarTelefonoLocal && validarFechaNacimineto && validarOcupacion && validarIngresos && validarGradoIntruccion &&
      validarNumeroHijos && ValidarNumEstGrado1 && ValidarNumEstGrado1 && ValidarNumEstGrado2 && ValidarNumEstGrado3 && ValidarNumEstGrado4 && ValidarNumEstGrado5 && ValidarNumEstGrado6 &&
      ValidarConstFamiliar && validarDireccion && validarTipVivienda && ValidarEstado && ValidarCiudad && ValidarParroquia && ValidarStatus
    ){
      return { estado: true, fecha: validarFechaNacimineto.fecha }
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
          msj_estatus_representante:[{mensaje:"",color_texto:""}],
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
          msj_id_parroquia: [{ mensaje:"", color_texto:""}],
          msj_tipo_vivienda_representante: [{ mensaje:"", color_texto:""}],
          msj_numero_estudiante_inicial_representante:[{ mensaje:"", color_texto:""}],
          msj_numero_estudiante_grado_1_representante:[{ mensaje:"", color_texto:""}],
          msj_numero_estudiante_grado_2_representante:[{ mensaje:"", color_texto:""}],
          msj_numero_estudiante_grado_3_representante:[{ mensaje:"", color_texto:""}],
          msj_numero_estudiante_grado_4_representante:[{ mensaje:"", color_texto:""}],
          msj_numero_estudiante_grado_5_representante:[{ mensaje:"", color_texto:""}],
          msj_numero_estudiante_grado_6_representante:[{ mensaje:"", color_texto:""}],
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
                      console.error(error)
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
                  const mensaje = this.state.mensaje
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

  enviarDatos(estado_validar_formulario,petion){
      const token=localStorage.getItem('usuario')
      const objeto={
          representante:{
            id_cedula_representante: this.state.id_cedula,
            nueva_cedula: "",
            nombres_representante: this.state.nombres,
            apellidos_representante: this.state.apellidos,
            fecha_nacimiento_representante: this.state.fecha_nacimiento,
            nivel_instruccion_representante: this.state.nivel_instruccion,
            ocupacion_representante: this.state.ocupacion,
            direccion_representante: this.state.direccion,
            id_ciudad: this.state.id_ciudad,
            telefono_movil_representante: this.state.telefono_movil_representante,
            telefono_local_representante: this.state.telefono_local_representante,
            numero_hijos_representante: this.state.numero_hijos_representante,
            constitucion_familiar_representante: this.state.constitucion_familiar_representante,
            ingresos_representante: this.state.ingresos_representante,
            tipo_vivienda_representante: this.state.tipo_vivienda_representante,
            numero_estudiante_inicial_representante: this.state.numero_estudiante_inicial_representante,
            numero_estudiante_grado_1_representante: this.state.numero_estudiante_grado_1_representante,
            numero_estudiante_grado_2_representante: this.state.numero_estudiante_grado_2_representante,
            numero_estudiante_grado_3_representante: this.state.numero_estudiante_grado_3_representante,
            numero_estudiante_grado_4_representante: this.state.numero_estudiante_grado_4_representante,
            numero_estudiante_grado_5_representante: this.state.numero_estudiante_grado_5_representante,
            numero_estudiante_grado_6_representante: this.state.numero_estudiante_grado_6_representante,
            id_parroquia: this.state.id_parroquia,
            estatus_representante: this.state.estatus_representante,
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

  render(){
    var jsx_representante_form1=(
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
                        <span className="titulo-form-trabajador">Formulario Representante</span>
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
                          clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_id_cedula[0]}
                          nombreCampo="Cédula:" activo="si" type="text" value={this.state.id_cedula}
                          name="id_cedula" id="id_cedula" placeholder="Cédula" eventoPadre={this.buscarRepresentante}
                        />
                      <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                          clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_nombres[0]}
                          nombreCampo="Nombres:" activo="si" type="text" value={this.state.nombres}
                          name="nombres" id="nombres" placeholder="Nombre" eventoPadre={this.validarTexto}
                        />
                        <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                        clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_apellidos[0]}
                        nombreCampo="Apellidos:" activo="si" type="text" value={this.state.apellidos}
                        name="apellidos" id="apellidos" placeholder="Apellido" eventoPadre={this.validarTexto}
                      />
                    </div>
                    <div className="row justify-content-center">
                        <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                          clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_telefono_movil_representante[0]}
                          nombreCampo="Telefono movil:" activo="si" type="text" value={this.state.telefono_movil_representante}
                          name="telefono_movil_representante" id="telefono_movil" placeholder="Telefono movil" eventoPadre={this.validarNumero}
                        />
                      <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                          clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_telefono_local_representante[0]}
                          nombreCampo="Telefono local:" activo="si" type="text" value={this.state.telefono_local_representante}
                          name="telefono_local_representante" id="telefono_movil" placeholder="Telefono local" eventoPadre={this.validarNumero}
                        />
                      <ComponentFormDate clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                          obligatorio="si" mensaje={this.state.msj_fecha_nacimiento[0]} nombreCampoDate="Fecha de Nacimiento:"
                          clasesCampo="form-control" value={this.state.fecha_nacimiento} name="fecha_nacimiento"
                          id="fecha_nacimiento" eventoPadre={this.fechaNacimiento}
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
                    </div>
                    <div className="row justify-content-center mx-auto my-2">
                      <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                        clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_ocupacion[0]}
                        nombreCampo="Ocupación:" activo="si" type="text" value={this.state.ocupacion}
                        name="ocupacion" id="ocupacion" placeholder="Ocupacion" eventoPadre={this.validarTexto}
                      />
                      <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                        clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_ingresos_representante[0]}
                        nombreCampo="Ingresos:" activo="si" type="text" value={this.state.ingresos_representante}
                        name="ingresos_representante" id="ingresos_representante" placeholder="Ingresos del representante" eventoPadre={this.validarNumero}
                      />
                      <ComponentFormSelect
                        clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                        obligatorio="si"
                        mensaje={this.state.msj_nivel_instruccion[0]}
                        nombreCampoSelect="Nivel Instrucción:"
                        clasesSelect="custom-select"
                        name="nivel_instruccion"
                        id="nivel_instruccion"
                        eventoPadre={this.cambiarEstado}
                        defaultValue={this.state.nivel_instruccion}
                        option={this.state.grados_instruccion}
                      />
                    </div>
                    <div className="row justify-content-center mt-1">
                      <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                        clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_numero_hijos_representante[0]}
                        nombreCampo="Numero de hijos:" activo="si" type="text" value={this.state.numero_hijos_representante}
                        name="numero_hijos_representante" id="numer_hijos_representante" placeholder="Numero de hijos" eventoPadre={this.validarNumero}
                      />

                      <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                        clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_numero_estudiante_inicial_representante[0]}
                        nombreCampo="Numero estudiantes en inicial:" activo="si" type="text" value={this.state.numero_estudiante_inicial_representante}
                        name="numero_estudiante_inicial_representante" id="numer_estudiante_inicial" placeholder="Numero estudiantes en inicial" eventoPadre={this.validarNumero}
                      />
                      <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                        clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_numero_estudiante_grado_1_representante[0]}
                        nombreCampo="Numero estudiantes en grado (1) :" activo="si" type="text" value={this.state.numero_estudiante_grado_1_representante}
                        name="numero_estudiante_grado_1_representante" id="numero_estudiante_grado_1_representante" placeholder="Numero estudiantes en grado (1) " eventoPadre={this.validarNumero}
                      />
                    </div>

                    <div className="row justify-content-center mt-1">
                      <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                        clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_numero_estudiante_grado_2_representante[0]}
                        nombreCampo="Numero estudiantes en grado (2) :" activo="si" type="text" value={this.state.numero_estudiante_grado_2_representante}
                        name="numero_estudiante_grado_2_representante" id="numero_estudiante_grado_2_representante" placeholder="Numero estudiantes en grado (2) " eventoPadre={this.validarNumero}
                      />
                      <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                        clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_numero_estudiante_grado_3_representante[0]}
                        nombreCampo="Numero estudiantes en grado (3) :" activo="si" type="text" value={this.state.numero_estudiante_grado_3_representante}
                        name="numero_estudiante_grado_3_representante" id="numero_estudiante_grado_3_representante" placeholder="Numero estudiantes en grado (3) " eventoPadre={this.validarNumero}
                      />
                      <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                        clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_numero_estudiante_grado_4_representante[0]}
                        nombreCampo="Numero estudiantes en grado (4) :" activo="si" type="text" value={this.state.numero_estudiante_grado_4_representante}
                        name="numero_estudiante_grado_4_representante" id="numero_estudiante_grado_4_representante" placeholder="Numero estudiantes en grado (4) " eventoPadre={this.validarNumero}
                      />
                    </div>

                    <div className="row justify-content-center mt-1">
                      <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                        clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_numero_estudiante_grado_5_representante[0]}
                        nombreCampo="Numero estudiantes en grado (5) :" activo="si" type="text" value={this.state.numero_estudiante_grado_5_representante}
                        name="numero_estudiante_grado_5_representante" id="numero_estudiante_grado_5_representante" placeholder="Numero estudiantes en grado (5) " eventoPadre={this.validarNumero}
                      />
                      <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                        clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_numero_estudiante_grado_6_representante[0]}
                        nombreCampo="Numero estudiantes en grado (6) :" activo="si" type="text" value={this.state.numero_estudiante_grado_6_representante}
                        name="numero_estudiante_grado_6_representante" id="numero_estudiante_grado_6_representante" placeholder="Numero estudiantes en grado (6) " eventoPadre={this.validarNumero}
                      />
                      <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                        clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_constitucion_familiar_representante[0]}
                        nombreCampo="Constitución familiar:" activo="si" type="text" value={this.state.constitucion_familiar_representante}
                        name="constitucion_familiar_representante" id="constitucion_familiar_representante" placeholder="Constitucion familiar" eventoPadre={this.validarTexto}
                      />
                    </div>
                    <div className="row justify-content-center mx-auto">
                      <ComponentFormTextArea clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                        obligatorio="si" mensaje={this.state.msj_direccion[0]} nombreCampoTextArea="Dirección:"
                        clasesTextArear="form-control" name="direccion" id="direccion" value={this.state.direccion}
                        eventoPadre={this.cambiarEstado}
                      />
                    </div>
                    <div className="row justify-content-center mt-1">
                      <ComponentFormSelect
                        clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                        obligatorio="si"
                        mensaje={this.state.msj_id_estado}
                        nombreCampoSelect="Estado:"
                        clasesSelect="custom-select"
                        name="id_estado"
                        id="id_estado"
                        eventoPadre={this.consultarCiudadesXEstado}
                        defaultValue={this.state.id_estado}
                        option={this.state.estados}
                      />
                      <ComponentFormSelect
                        clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                        obligatorio="si"
                        mensaje={this.state.msj_id_ciudad}
                        nombreCampoSelect="Ciudad:"
                        clasesSelect="custom-select"
                        name="id_ciudad"
                        id="id_ciudad"
                        eventoPadre={this.cambiarEstado}
                        defaultValue={this.state.id_ciudad}
                        option={this.state.ciudades}
                      />
                      <ComponentFormSelect
                      clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                      obligatorio="si"
                      mensaje={this.state.msj_id_parroquia}
                      nombreCampoSelect="Parroquia:"
                      clasesSelect="custom-select"
                      name="id_parroquia"
                      id="id_parroquia"
                      eventoPadre={this.cambiarEstado}
                      defaultValue={this.state.id_parroquia}
                      option={this.state.parroquias}
                      />
                    </div>

                    <div className="row justify-content-center mt-1">
                      <ComponentFormSelect
                        clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
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
                      <ComponentFormRadioState
                        clasesColumna="col-5 col-ms-5 col-md-5 col-lg-5 col-xl-5"
                        extra="custom-control-inline"
                        nombreCampoRadio="Estatus:"
                        name="estatu_representante"
                        nombreLabelRadioA="Activó"
                        idRadioA="activoestudianterA"
                        checkedRadioA={this.state.estatus_representante}
                        valueRadioA="1"
                        nombreLabelRadioB="Inactivo"
                        idRadioB="activoestudianterB"
                        valueRadioB="0"
                        eventoPadre={this.cambiarEstado}
                        checkedRadioB={this.state.estatus_representante}
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
          componente={jsx_representante_form1}
          modulo={this.state.modulo}
          eventoPadreMenu={this.mostrarModulo}
          estado_menu={this.state.estado_menu}
          />
        </div>
    )
  }
}

export default withRouter(ComponentRepresentanteForm)
