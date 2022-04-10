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

class ComponentEstudianteForm extends React.Component{

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
        this.buscarEstudiante=this.buscarEstudiante.bind(this);
        this.validarSelect=this.validarSelect.bind(this);
        this.validarDireccion=this.validarDireccion.bind(this)
        this.validarFormularioRegistrar=this.validarFormularioRegistrar.bind(this);
        this.validarCampo=this.validarCampo.bind(this)
        this.enviarDatos=this.enviarDatos.bind(this)
        this.consultarEstudiante=this.consultarEstudiante.bind(this)
        this.consultarPerfilTrabajador=this.consultarPerfilTrabajador.bind(this)
        this.consultarCiudad = this.consultarCiudad.bind(this)
        this.ConsultarVacunas = this.ConsultarVacunas.bind(this);
        this.capturaCheck = this.capturaCheck.bind(this);
        this.registroVacunaEstudiante = this.registroVacunaEstudiante.bind(this);
        this.ConsultarVacunas = this.ConsultarVacunas.bind(this);
        this.consultarParroquiasXCiudad = this.consultarParroquiasXCiudad.bind(this)
        this.state={
            // ------------------
            modulo:"",// modulo menu
            estado_menu:false,
            //formulario
            id_estudiante:"",
            codigo_cedula_escolar: "",
            id_cedula_escolar:"",
            id_cedula:"",
            nombres:"",
            apellidos:"",
            fecha_nacimiento:"",
            direccion_nacimiento:"",
            vive_con:"",
            procedencia:"",
            id_estado_nacimiento:"",
            id_ciudad_nacimiento:"",
            id_parroquia_nacimiento:"",
            id_estado:"",
            id_ciudad:"",
            id_parroquia_vive:"",
            enfermedades_estudiante:"",
            id_vacuna: [],
            sexo_estudiante:"1",
            estatu_estudiante:"1",
            //MSJ
            msj_codigo_cedula_escolar:[{mensaje:"",color_texto:""}],
            msj_id_cedula_escolar:[{mensaje:"",color_texto:""}],
            msj_id_cedula:[{mensaje:"",color_texto:""}],
            msj_nombres:[{mensaje:"",color_texto:""}],
            msj_apellidos:[{mensaje:"",color_texto:""}],
            msj_fecha_nacimiento:[{mensaje:"",color_texto:""}],
            msj_direccion_nacimiento:[{mensaje:"",color_texto:""}],
            msj_vive_con:[{ mensaje:"", color_texto:""}],
            msj_enfermedades:[{mensaje:"",color_texto:""}],
            msj_procedencia:[{ mensaje:"", color_texto:""}],
            msj_sexo_estudiante:[{mensaje:"",color_texto:""}],
            msj_estatu_estudiante:[{mensaje:"",color_texto:""}],
            msj_id_estado:[{ mensaje:"", color_texto:""}],
            msj_id_estado_nacimiento:[{ mensaje:"", color_texto:""}],
            msj_id_ciudad:[{ mensaje:"", color_texto:""}],
            msj_id_ciudad_nacimiento:[{ mensaje:"", color_texto:""}],
            msj_id_parroquia_vive:[{ mensaje:"", color_texto:""}],
            msj_id_parroquia_nacimiento:[{ mensaje:"", color_texto:""}],
            //// combo box
            estados:[],
            ciudades:[],
            parroquias:[],
            vacunas:[],
            operacion: "",
            fecha_minimo:"",
            hashEstudiante:{},
            estadoBusquedaEstudiante:false,
            ///
            mensaje:{
                texto:"",
                estado:""
            },
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
        let acessoModulo=await this.validarAccesoDelModulo("/dashboard/configuracion","/estudiante")
        if(acessoModulo){
            await this.consultarFechaServidor()
            await this.consultarTodosLosEstudiantes()
            await this.ConsultarVacunas();
            let operacion=this.props.match
            operacion = operacion.url.split("/")[4];

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
                id_estado_nacimiento:(estados.length===0)?null:estados[0].id,
                id_ciudad:(ciudades.length===0)?null:ciudades[0].id,
                id_ciudad_nacimiento:(ciudades.length===0)?null:ciudades[0].id,
                id_parroquia_vive:(parroquias.length===0)?null:parroquias[0].id,
                id_parroquia_nacimiento:(parroquias.length===0)?null:parroquias[0].id,
                operacion: operacion
              })
        }
        else if(operacion==="actualizar"){
            const {id}=this.props.match.params
            let datos = await this.consultarEstudiante(id)
            await this.ConsultarVacunas(datos.id_estudiante);

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
              id_estudiante: datos.id_estudiante,
              codigo_cedula_escolar: datos.codigo_cedula_escolar,
              id_cedula_escolar:datos.cedula_escolar,
              id_cedula:(datos.cedula_estudiante != "" && datos.cedula_estudiante != undefined) ? datos.cedula_estudiante : "No tiene",
              nombres:datos.nombres_estudiante,
              apellidos:datos.apellidos_estudiante,
              fecha_nacimiento:Moment(datos.fecha_nacimiento_estudiante).format("YYYY-MM-DD"),
              direccion_nacimiento:datos.direccion_nacimiento_estudiante,
              enfermedades_estudiante:datos.enfermedades_estudiante,
              vive_con:datos.vive_con_estudiante,
              procedencia:datos.procedencia_estudiante,
              sexo_estudiante:datos.sexo_estudiante,
              enfermedades: datos.enfermedades_estudiante,
              estatu_estudiante:datos.estatus_estudiante,
              estados: estados,
              ciudades: ciudades,
              parroquias: parroquias,
              id_parroquia_vive: datos.id_parroquia_vive,
              id_parroquia_nacimiento: datos.id_parroquia_nacimiento,
              operacion: operacion
            })

            document.getElementById("id_estado").value = datosCiudad.id_estado
            document.getElementById("id_ciudad").value = datos.id_ciudad
            document.getElementById("codigo_cedula_escolar").readOnly = true;
            }
        }
        else{
            alert("no tienes acesso a este modulo(sera redirigido a la vista anterior)")
            this.props.history.goBack()
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

    async consultarTodosLosEstudiantes(){
        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/estudiante/consultar-todos`)
        .then(repuesta => {
            let json=JSON.parse(JSON.stringify(repuesta.data))
            // console.log("datos =>>> ",json)
            let hash={}
            for(let estudiante of json.datos){
                if(estudiante.cedula_escolar != "" && estudiante.cedula_estudiante == "" ||
                estudiante.cedula_escolar != "" && estudiante.cedula_estudiante == "No tiene" ||
                estudiante.cedula_escolar != "" && estudiante.cedula_estudiante == "null" ||
                estudiante.cedula_escolar != "" && estudiante.cedula_estudiante == null){
                    hash[estudiante.cedula_escolar]=estudiante
                }else hash[estudiante.cedula_estudiante]=estudiante;

            }
            console.log("hash estudiante =>>> ",hash)
            this.setState({hashEstudiante:hash})
        })
        .catch(error => {
            console.error(error)
        })
    }

    async ConsultarVacunas(id_estudiante){

        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/vacuna_estudiante/consultar/${id_estudiante}`)
        .then( ({data}) => {

            if(data.datos != undefined){
                let array = data.datos.map( item => item.id_vacuna);
                this.setState({id_vacuna: array})
            }
        }).catch(error => {
            console.error(error);
        })
    }

    async ConsultarVacunas(){

        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/vacuna/consultar-todos`)
        .then(respuesta => {
            let lista_vacunas = respuesta.data.datos;
            let vacunas = this.state.vacunas;
            vacunas = lista_vacunas.filter( datos => datos.estaus_vacuna === "1")
            vacunas = vacunas.map( datos => {
                return { id: datos.id_vacuna, descripcion: datos.nombre_vacuna}
            } )
            this.setState({vacunas});
        })
        .catch(error => {
            console.error("error al conectar con el servidor")
        })
    }

    capturaCheck(names){
        let checks = document.querySelectorAll(`.${names}-check`);
        let values = [];
        checks.forEach( item =>{
            if(item.checked == true) values.push(item.value);
        });
        if(names == 'enfermedad') this.setState({id_enfermedad: values});
        if(names == 'vacuna') this.setState({id_vacuna: values});
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

    async consultarEstudiante(id){
      let mensaje =""
      const token=localStorage.getItem('usuario')
      let fechaServidor=Moment(this.state.fechaServidor,"YYYY-MM-DD")
      // /${token}
      return await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/estudiante/consultar/${id}`)
      .then(respuesta=>{
          let respuesta_servidor=respuesta.data
          console.log(respuesta_servidor)
          if(respuesta_servidor.estado_respuesta=== true){
            return respuesta_servidor.datos[0]
          }
          else if(respuesta_servidor.estado_respuesta===false){
              mensaje.texto=respuesta_servidor.mensaje
              mensaje.estado=respuesta_servidor.estado_peticion
              this.props.history.push(`/dashboard/configuracion/estudiante${JSON.stringify(mensaje)}`)
          }
      })
      .catch(error=>{
          console.error(error)
          mensaje.texto="No se puedo conectar con el servidor"
          mensaje.estado="500"
          this.props.history.push(`/dashboard/configuracion/estudiante${JSON.stringify(mensaje)}`)
      })
        // let edadEstudiante=(parseInt(fechaServidor.diff(Moment(this.state.fecha_nacimiento).format("YYYY-MM-DD"),"years"))>=18)?fechaServidor.diff(Moment(this.state.fecha_nacimiento).format("YYYY-MM-DD"),"years"):null
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
                this.props.history.push(`/dashboard/configuracion/estudiante${JSON.stringify(mensaje)}`)
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
    async consultarCiudadesXEstado(a){
        let input=a.target
        const ruta_api_2=`http://localhost:8080/configuracion/ciudad/consultar-x-estado/${input.value}`,
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

    validarNumero(a){
        const input=a.target,
        exprecion=/\d$/
        if(input.value!==""){
            if(exprecion.test(input.value)) this.longitudCampo(input)
        }
        else{
            this.cambiarEstadoDos(input)
        }
    }

    validarTexto(a){
        const input=a.target,
        exprecion=/[A-Za-z\s]$/
        if(input.value!==""){
            if(exprecion.test(input.value)) this.cambiarEstadoDos(input)
        }
        else{
            this.cambiarEstadoDos(input)
        }
    }

    longitudCampo(input){
        if(input.name == "id_cedula_escolar"){
          if(input.value.length <= 11) this.cambiarEstadoDos(input)
        }else if(input.name==="id_cedula"){
          if(input.value.length <= 8) this.cambiarEstadoDos(input)
        }else if(input.name === "codigo_cedula_escolar"){
          if(input.value.length <= 8) this.cambiarEstadoDos(input)
        }else if(input.name==="telefono_movil" || input.name==="telefono_local"){
          if(input.value.length <= 11) this.cambiarEstadoDos(input)
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
        let edadEstudiante=(parseInt(fechaServidor.diff(input.value,"years"))>=18)?fechaServidor.diff(input.value,"years"):null
        this.setState({edadEstudiante})
    }

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
            }
            else{
              msj_nombres[0] = {mensaje: "este campo solo permite letras",color_texto:"rojo"}
              msj_apellidos[0] = {mensaje: "este campo solo permite letras",color_texto:"rojo"}
            }
        }
        else{
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
        id_estudiante:"",
        codigo_cedula_escolar: "",
        id_cedula_escolar:"",
        id_cedula:"",
        nombres:"",
        apellidos:"",
        fecha_nacimiento:"",
        direccion_nacimiento:"",
        vive_con:"",
        procedencia:"",
        id_estado_nacimiento:"",
        id_ciudad_nacimiento:"",
        id_parroquia_nacimiento:"",
        id_estado:"",
        id_ciudad:"",
        id_parroquia_vive:"",
        enfermedades_estudiante:"",
        id_vacuna: [],
        sexo_estudiante:"1",
        estatu_estudiante:"1",
        //MSJ
        msj_codigo_cedula_escolar:mensaje_campo,
        msj_id_cedula_escolar:mensaje_campo,
        msj_id_cedula:mensaje_campo,
        msj_nombres:mensaje_campo,
        msj_apellidos:mensaje_campo,
        msj_fecha_nacimiento:mensaje_campo,
        msj_direccion_nacimiento:mensaje_campo,
        msj_vive_con:mensaje_campo,
        msj_procedencia:mensaje_campo,
        msj_sexo_estudiante:mensaje_campo,
        msj_estatu_estudiante:mensaje_campo,
        msj_id_estado:mensaje_campo,
        msj_id_estado_nacimiento:mensaje_campo,
        msj_id_ciudad:mensaje_campo,
        msj_id_ciudad_nacimiento:mensaje_campo,
        msj_id_parroquia_vive:mensaje_campo,
        msj_id_parroquia_nacimiento:mensaje_campo,
        msj_enfermedades:mensaje_campo,
        edadEstudiante:null,
      })
      this.props.history.push("/dashboard/configuracion/estudiante/registrar")
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
        var fecha_estudiante_nacimiento=Moment(new Date(this.state.fecha_nacimiento))
        fecha_estudiante_nacimiento.add(1,"d")
        var fecha_minima=Moment();
        var fecha_maxima=Moment();
        fecha_minima.subtract(4,"y")
        fecha_maxima.subtract(11,"y")
        var msj_fecha_nacimiento=this.state.msj_fecha_nacimiento
        if(this.state.fecha_nacimiento!==""){
            if(!fecha_estudiante_nacimiento.isAfter(fecha_minima)){
                if(fecha_estudiante_nacimiento.isAfter(fecha_maxima)){
                    estado=true
                    msj_fecha_nacimiento[0]={mensaje:"",color_texto:"rojo"}
                    this.setState(msj_fecha_nacimiento)
                }
                else{
                    msj_fecha_nacimiento[0]={mensaje:"El estudiante solo puede tener hasta 11 años",color_texto:"rojo"}
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
        var msj_procedencia = this.state["msj_"+name],
        msj_vive_con = this.state["msj_"+name],
        msj_direccion_nacimiento  = this.state["msj_"+name]

        if(valor !== ""){
            if(this.state.StringExprecion.test(valor)){
                estado = true
                console.log(`campo ${name} OK`)
                msj_procedencia[0]={mensaje:"",color_texto:"rojo"}
                msj_vive_con[0]={mensaje:"",color_texto:"rojo"}
                msj_direccion_nacimiento[0]={mensaje:"",color_texto:"rojo"}
            }
            else{
                estado = false
                msj_procedencia[0]={mensaje:"la procedencia no puede tener solo espacios en blanco",color_texto:"rojo"}
                msj_vive_con[0]={mensaje:"Este campo no puede tener solo espacios en blanco",color_texto:"rojo"}
                msj_direccion_nacimiento[0]={mensaje:"Este campo no puede tener solo espacios en blanco",color_texto:"rojo"}
            }
        }
        else{
            estado = false
            msj_procedencia[0]={mensaje:"la procedencia no puede estar vacia",color_texto:"rojo"}
            msj_vive_con[0]={mensaje:"Este campo no puede estar vacio",color_texto:"rojo"}
            msj_direccion_nacimiento[0]={mensaje:"Este campo no puede estar vacio",color_texto:"rojo"}
        }

        if(name == 'procedencia') this.setState(msj_procedencia)
        else if(name == 'direccion_nacimiento') this.setState(msj_direccion_nacimiento)
        else this.setState(msj_vive_con)

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
      let msj_sexo_estudiante = this.state["msj_"+name],
      msj_estatu_estudiante = this.state["msj_"+name]
      if(valor != ""){
        estado = true
        msj_sexo_estudiante[0] = {mensaje: "", color_texto:"rojo"}
        msj_estatu_estudiante[0] = {mensaje: "", color_texto:"rojo"}
      }else{
        msj_sexo_estudiante[0] = {mensaje: "Debe de seleccionar sexo", color_texto:"rojo"}
        msj_estatu_estudiante[0] = {mensaje: "Debe de seleccionar el estado del estudiante", color_texto:"rojo"}
      }
      if(name == "sexo_estudiante") this.setState(msj_sexo_estudiante)
      else if(name == "estatu_estudiante") this.setState(msj_estatu_estudiante)
      return estado
    }

    validarFormularioRegistrar(){

      const validar_codigo_cedula_escolar = this.validarCampoNumero("codigo_cedula_escolar"),validar_cedula_escolar = this.validarCampoNumero("id_cedula_escolar")
      ,validar_nombres=this.validarCampo("nombres"),validar_apellidos=this.validarCampo("apellidos"),validar_fecha_nacimiento=this.validarFechaNacimineto(),
      validar_procedencia=this.validarDireccion("procedencia"),
      validar_vive_con=this.validarDireccion("vive_con"),validar_direccion_nacimiento=this.validarDireccion("direccion_nacimiento"),
      validar_estado=this.validarSelect('id_estado'),validar_ciudad=this.validarSelect('id_ciudad'),validar_sexo_estudiante=this.validarRadio('sexo_estudiante'),
      validar_estatu_estudiante=this.validarRadio('estatu_estudiante')

      if(
        validar_codigo_cedula_escolar && validar_cedula_escolar && validar_nombres && validar_apellidos && validar_fecha_nacimiento &&
        validar_procedencia && validar_vive_con && validar_direccion_nacimiento && validar_estado && validar_ciudad &&
        validar_sexo_estudiante && validar_estatu_estudiante
      ){
          return {estado: true, fecha:validar_fecha_nacimiento.fecha}
        }else{
          return {estado: false}
        }
    }

    validarFormularioActuazliar(){
      const validar_codigo_cedula_escolar = this.validarCampoNumero("codigo_cedula_escolar"),validar_cedula_escolar = this.validarCampoNumero("id_cedula_escolar")
      ,validar_nombres=this.validarCampo("nombres"),validar_apellidos=this.validarCampo("apellidos"),validar_fecha_nacimiento=this.validarFechaNacimineto(),
      validar_procedencia=this.validarDireccion("procedencia"),valida_parroquia_nacimiento=this.validarSelect('id_parroquia_nacimiento'),
      validar_vive_con=this.validarDireccion("vive_con"),validar_direccion_nacimiento=this.validarDireccion("direccion_nacimiento"),
      valida_parroquia_vive=this.validarSelect('id_parroquia_vive'),validar_sexo_estudiante=this.validarRadio('sexo_estudiante'),
      validar_estatu_estudiante=this.validarRadio('estatu_estudiante')

      if(
        validar_codigo_cedula_escolar && validar_cedula_escolar && validar_nombres && validar_apellidos && validar_fecha_nacimiento &&
        validar_procedencia && validar_vive_con && validar_direccion_nacimiento && valida_parroquia_vive && valida_parroquia_nacimiento &&
        validar_sexo_estudiante && validar_estatu_estudiante
      ){
        return {estado: true, fecha:validar_fecha_nacimiento.fecha}
      }else{
        return {estado: false}
      }
    }

    registroVacunaEstudiante(){
        if(this.state.id_estudiante != ""){
            const token = localStorage.getItem('usuario')

            let objetoVacuna = {
                vacunas: {
                    id_estudiante: this.state.id_estudiante,
                    id_vacuna: this.state.id_vacuna
                },
                token: token
            };

            axios.post(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/vacuna_estudiante/registrar`,objetoVacuna)
            .then( ({data}) => {
                if(!data.estado_respuesta) console.log("VACUNA NO REGISTRADA")
                else{
                    console.log(data.mensaje)
                }
            })
        }
    }

    operacion(){
        $(".columna-modulo").animate({
            scrollTop: 0
            }, 1000)
        const operacion=this.state.operacion

        const mensaje_formulario={
            mensaje:"",
            msj_codigo_cedula_escolar:[{mensaje:"",color_texto:""}],
            msj_id_cedula_escolar:[{mensaje:"",color_texto:""}],
            msj_id_cedula:[{mensaje:"",color_texto:""}],
            msj_nombres:[{mensaje:"",color_texto:""}],
            msj_apellidos:[{mensaje:"",color_texto:""}],
            msj_fecha_nacimiento:[{mensaje:"",color_texto:""}],
            msj_direccion_nacimiento:[{mensaje:"",color_texto:""}],
            msj_vive_con:[{ mensaje:"", color_texto:""}],
            msj_procedencia:[{ mensaje:"", color_texto:""}],
            msj_sexo_estudiante:[{mensaje:"",color_texto:""}],
            msj_estatu_estudiante:[{mensaje:"",color_texto:""}],
            msj_id_estado:[{ mensaje:"", color_texto:""}],
            msj_id_estado_nacimiento:[{ mensaje:"", color_texto:""}],
            msj_id_ciudad:[{ mensaje:"", color_texto:""}],
            msj_id_ciudad_nacimiento:[{ mensaje:"", color_texto:""}],
            msj_enfermedades:[{ mensaje:"", color_texto:""}],
            msj_id_parroquia_vive:[{ mensaje:"", color_texto:""}],
            msj_id_parroquia_nacimiento:[{ mensaje:"", color_texto:""}],
        }
        if(operacion==="registrar"){

            const estado_validar_formulario=this.validarFormularioRegistrar()
            if(estado_validar_formulario.estado){
                this.enviarDatos(estado_validar_formulario,(objeto)=>{
                    const mensaje =this.state.mensaje
                    var respuesta_servidor=""
                    axios.post(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/estudiante/registrar`,objeto)
                    .then(respuesta=>{
                        respuesta_servidor=respuesta.data
                        let id_estu = respuesta_servidor.datos[0].id_estudiante;

                        mensaje.texto=respuesta_servidor.mensaje
                        mensaje.estado=respuesta_servidor.estado_respuesta
                        mensaje_formulario.mensaje=mensaje
                        this.setState(mensaje_formulario)
                        this.setState({id_estudiante: id_estu})
                        this.registroVacunaEstudiante()
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
            console.log(estado_validar_formulario)
            const {id}=this.props.match.params
            if(estado_validar_formulario.estado){
                this.enviarDatos(estado_validar_formulario,(objeto)=>{
                    const mensaje =this.state.mensaje
                    var respuesta_servidor=""
                    axios.put(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/estudiante/actualizar/${id}`,objeto)
                    .then(respuesta=>{
                        respuesta_servidor=respuesta.data

                        mensaje.texto=respuesta_servidor.mensaje
                        mensaje.estado=respuesta_servidor.estado_respuesta
                        mensaje_formulario.mensaje=mensaje
                        this.setState(mensaje_formulario)
                        this.registroVacunaEstudiante()
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
            estudiante:{
              id_estudiante: this.state.id_estudiante,
              codigo_cedula_escolar: this.state.codigo_cedula_escolar,
              cedula_escolar: (this.state.id_cedula_escolar != '') ? this.state.id_cedula_escolar : 'No tiene',
              cedula_estudiante: (this.state.id_cedula != '') ? this.state.id_cedula : 'No tiene',
              nombres_estudiante: this.state.nombres,
              apellidos_estudiante: this.state.apellidos,
              fecha_nacimiento_estudiante: this.state.fecha_nacimiento,
              direccion_nacimiento_estudiante: this.state.direccion_nacimiento,
              id_parroquia_nacimiento: this.state.id_parroquia_nacimiento,
              id_parroquia_vive: this.state.id_parroquia_vive,
              sexo_estudiante: this.state.sexo_estudiante,
              procedencia_estudiante: this.state.procedencia,
              vive_con_estudiante: this.state.vive_con,
              estatus_estudiante: this.state.estatu_estudiante,
              enfermedades_estudiante: this.state.enfermedades_estudiante,
            },
            token:token
        }
        petion(objeto)
    }

    regresar(){
        this.props.history.push("/dashboard/configuracion/estudiante");
    }

    buscarEstudiante(a){
        let input = a.target
        this.validarNumero(a)
        // console.log(input.value)
        let hashEstudiante=JSON.parse(JSON.stringify(this.state.hashEstudiante))
        if(hashEstudiante[input.value]){
            this.setState({
                estadoBusquedaEstudiante:true
            })
            alert("este estudiante ya esta resgistrado")
        }
        else{
            // console.log("NO OK")
            this.setState({
                estadoBusquedaEstudiante:false
            })
        }
    }

    CodeSearch(id, name){
        let status_checked = "";
        let lista = this.state['id_'+name];
        if(lista.length > 0){
            lista.forEach( item => {
                if(id == item){
                    status_checked = "checked";
                }
            })
        }
        return status_checked;
    }

    render(){
        var jsx_estudiante_form = (
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
                            <span className="titulo-form-trabajador">Formulario estudiante</span>
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
                              clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_codigo_cedula_escolar[0]}
                              nombreCampo="Codigo de la Cédula escolar:" activo="si" type="text" value={this.state.codigo_cedula_escolar}
                              name="codigo_cedula_escolar" id="codigo_cedula_escolar" placeholder="Codigo de la Cédula escolar" eventoPadre={this.validarNumero}
                            />
                            <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                              clasesCampo="form-control" obligatorio="no" mensaje={this.state.msj_id_cedula_escolar[0]}
                              nombreCampo="Cédula escolar:" activo="si" type="text" value={this.state.id_cedula_escolar}
                              name="id_cedula_escolar" id="id_cedula_escolcar" placeholder="Cédula escolar" eventoPadre={this.buscarEstudiante}
                            />
                          <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                              clasesCampo="form-control" obligatorio="no" mensaje={this.state.msj_id_cedula[0]}
                              nombreCampo="Cédula:" activo="si" type="text" value={this.state.id_cedula}
                              name="id_cedula" id="id_cedula" placeholder="Cédula" eventoPadre={this.buscarEstudiante}
                            />
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormCampo clasesColumna="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4"
                              clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_nombres[0]}
                              nombreCampo="Nombres:" activo="si" type="text" value={this.state.nombres}
                              name="nombres" id="nombres" placeholder="Nombre" eventoPadre={this.validarTexto}
                            />
                            <ComponentFormCampo clasesColumna="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4"
                              clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_apellidos[0]}
                              nombreCampo="Apellidos:" activo="si" type="text" value={this.state.apellidos}
                              name="apellidos" id="apellidos" placeholder="Apellido" eventoPadre={this.validarTexto}
                            />
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormDate clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                              obligatorio="si" mensaje={this.state.msj_fecha_nacimiento[0]} nombreCampoDate="Fecha de Nacimiento:"
                              clasesCampo="form-control" value={this.state.fecha_nacimiento} name="fecha_nacimiento"
                              id="fecha_nacimiento" eventoPadre={this.fechaNacimiento}
                            />
                          {this.state.edadEstudiante!==null &&
                                (
                                <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                        <div className="form-ground">
                                            <label className="mb-3">Edad:</label>
                                            <div >{this.state.edadEstudiante} Años</div>
                                        </div>
                                </div>
                                )
                            }
                        </div>
                        <div className="row justify-content-center mx-auto">
                          <ComponentFormTextArea clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            obligatorio="si" mensaje={this.state.msj_procedencia[0]} nombreCampoTextArea="procedencia del estudiante:"
                            clasesTextArear="form-control" name="procedencia" id="procedencia" value={this.state.procedencia}
                            eventoPadre={this.cambiarEstado}
                          />
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-trabajador">
                                <span className="titulo-form-trabajador">Donde vive el estudiante</span>
                            </div>
                        </div>
                        <div className="row justify-content-center mx-auto my-2">
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
                          eventoPadre={this.consultarParroquiasXCiudad}
                          defaultValue={this.state.id_ciudad}
                          option={this.state.ciudades}
                          />
                          <ComponentFormSelect
                          clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                          obligatorio="si"
                          mensaje={this.state.msj_id_parroquia_vive}
                          nombreCampoSelect="Parroquia donde vive:"
                          clasesSelect="custom-select"
                          name="id_parroquia_vive"
                          id="id_parroquia_vive"
                          eventoPadre={this.cambiarEstado}
                          defaultValue={this.state.id_parroquia_vive}
                          option={this.state.parroquias}
                          />
                        </div>
                        <div className="row justify-content-center mx-auto">
                          <ComponentFormTextArea clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            obligatorio="si" mensaje={this.state.msj_vive_con[0]} nombreCampoTextArea="Vive con?:"
                            clasesTextArear="form-control" name="vive_con" id="vive_con" value={this.state.vive_con}
                            eventoPadre={this.cambiarEstado}
                          />
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-trabajador">
                                <span className="titulo-form-trabajador">Donde nació el estudiante</span>
                            </div>
                        </div>
                        <div className="row justify-content-center mx-auto my-2">
                          <ComponentFormSelect
                          clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                          obligatorio="si"
                          mensaje={this.state.msj_id_estado_nacimiento}
                          nombreCampoSelect="Estado:"
                          clasesSelect="custom-select"
                          name="id_estado_nacimiento"
                          id="id_estado_nacimiento"
                          eventoPadre={this.consultarCiudadesXEstado}
                          defaultValue={this.state.id_estado_nacimiento}
                          option={this.state.estados}
                          />
                          <ComponentFormSelect
                          clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                          obligatorio="si"
                          mensaje={this.state.msj_id_ciudad_nacimiento}
                          nombreCampoSelect="Ciudad:"
                          clasesSelect="custom-select"
                          name="id_ciudad_nacimiento"
                          id="id_ciudad_nacimiento"
                          eventoPadre={this.consultarParroquiasXCiudad}
                          defaultValue={this.state.id_ciudad_nacimiento}
                          option={this.state.ciudades}
                          />
                          <ComponentFormSelect
                          clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                          obligatorio="si"
                          mensaje={this.state.msj_id_parroquia_nacimiento}
                          nombreCampoSelect="Parroquia donde nació:"
                          clasesSelect="custom-select"
                          name="id_parroquia_nacimiento"
                          id="id_parroquia_nacimiento"
                          eventoPadre={this.cambiarEstado}
                          defaultValue={this.state.id_parroquia_nacimiento}
                          option={this.state.parroquias}
                          />
                        </div>
                        <div className="row justify-content-center mx-auto">
                          <ComponentFormTextArea clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            obligatorio="si" mensaje={this.state.msj_direccion_nacimiento[0]} nombreCampoTextArea="Dirección de nacimiento:"
                            clasesTextArear="form-control" name="direccion_nacimiento" id="direccion_nacimiento" value={this.state.direccion_nacimiento}
                            eventoPadre={this.cambiarEstado}
                          />
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-trabajador">
                                <span className="titulo-form-trabajador">Otros datos</span>
                            </div>
                        </div>
                        <div className="row justify-content-center mx-auto">
                          <ComponentFormTextArea clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            obligatorio="si" mensaje={this.state.msj_enfermedades[0]} nombreCampoTextArea="Enfermedades del estudiante:"
                            clasesTextArear="form-control" name="enfermedades_estudiante" id="enfermedades_estudiante" value={this.state.enfermedades_estudiante}
                            eventoPadre={this.cambiarEstado}
                          />
                        </div>
                        <div className="row justify-content-center mt-1">
                            <ComponentFormRadioState clasesColumna="col-5 col-ms-5 col-md-5 col-lg-5 col-xl-5"
                              extra="custom-control-inline" nombreCampoRadio="Sexo:" name="sexo_estudiante"
                              nombreLabelRadioA="Masculino" idRadioA="masculino" checkedRadioA={this.state.sexo_estudiante}
                              valueRadioA="1" nombreLabelRadioB="Femenino" idRadioB="femenino"
                              valueRadioB="0" eventoPadre={this.cambiarEstado} checkedRadioB={this.state.sexo_estudiante}
                            />
                        </div>
                        <div className="row justify-content-center mt-1">
                          <ComponentFormRadioState
                            clasesColumna="col-5 col-ms-5 col-md-5 col-lg-5 col-xl-5"
                            extra="custom-control-inline"
                            nombreCampoRadio="Estatus:"
                            name="estatu_estudiante"
                            nombreLabelRadioA="Activó"
                            idRadioA="activoestudianterA"
                            checkedRadioA={this.state.estatu_estudiante}
                            valueRadioA="1"
                            nombreLabelRadioB="Inactivo"
                            idRadioB="activoestudianterB"
                            valueRadioB="0"
                            eventoPadre={this.cambiarEstado}
                            checkedRadioB={this.state.estatu_estudiante}
                          />
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-trabajador">
                                <span className="titulo-form-trabajador">Vacunas</span>
                            </div>
                        </div>
                        <div className="row justify-content-center mt-1 mb-2">
                            {this.state.vacunas.map( (item,index) => {
                                return (
                                    <div key={index} className='col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3'>
                                        <input type="checkbox" class="form-check-input vacuna-check" checked={this.CodeSearch(item.id,"vacuna")}
                                        name="vacuna[]" onChange={() => this.capturaCheck('vacuna')} id="vacuna" value={item.id} />
                                        <label class="form-check-label">{item.descripcion}</label>
                                    </div>
                                );
                            })}

                            {this.state.vacunas.length == 0 &&
                                <h3>Sin vacunas registradas</h3>
                            }
                        </div>

                        <div className="row justify-content-center">
                            <div className="col-auto">
                                {this.state.operacion==="registrar" &&
                                    <InputButton
                                    clasesBoton="btn btn-primary"
                                    id="boton-registrar"
                                    value="Registrar"
                                    eventoPadre={this.operacion}
                                    />
                                }
                                {this.state.operacion==="actualizar" &&
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
        );

        return(
            <div className="component_trabajador_form">
              <ComponentDashboard
              componente={jsx_estudiante_form}
              modulo={this.state.modulo}
              eventoPadreMenu={this.mostrarModulo}
              estado_menu={this.state.estado_menu}
              />
            </div>
        )
    }
}

export default withRouter(ComponentEstudianteForm)
