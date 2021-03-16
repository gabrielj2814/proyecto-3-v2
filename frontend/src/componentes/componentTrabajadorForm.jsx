import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentTrabajadorForm.css'
//JS
import axios from 'axios'
import Moment from 'moment'
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

class ComponentTrabajadorForm extends React.Component{

    constructor(){
        super();
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.regresar=this.regresar.bind(this);
        this.operacion=this.operacion.bind(this);
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.agregar=this.agregar.bind(this);
        this.validarTexto=this.validarTexto.bind(this);
        this.validarNumero=this.validarNumero.bind(this);
        this.consultarFuncionesTrabajador=this.consultarFuncionesTrabajador.bind(this);
        this.fechaNacimiento=this.fechaNacimiento.bind(this);
        this.buscarTrabajador=this.buscarTrabajador.bind(this);
        this.state={
            modulo:"",// modulo menu
            estado_menu:false,
            //formulario
            id_cedula:"",
            nombres:"",
            apellidos:"",
            telefono_movil:"",
            telefono_local:"",
            correo:"",
            grado_instruccion:"",
            titulo_grado_instruccion:"",
            fecha_nacimiento:"",
            fecha_ingreso:"",
            direccion:"",
            id_perfil:"",
            id_tipo_trabajador:"",
            id_funcion_trabajador:"",
            estatu_trabajador:"1",
            sexo_trabajador:"1",
            designacion:"1",
            //MSJ
            msj_id_cedula:[{mensaje:"",color_texto:""}],
            msj_nombres:[{mensaje:"",color_texto:""}],
            msj_apellidos:[{mensaje:"",color_texto:""}],
            msj_fecha_nacimiento:[{mensaje:"",color_texto:""}],
            msj_fecha_ingreso:[{mensaje:"",color_texto:""}],
            msj_direccion:[{mensaje:"",color_texto:""}],
            msj_grado_instruccion:[{mensaje:"",color_texto:""}],
            msj_id_perfil:[{mensaje:"",color_texto:""}],
            msj_id_tipo_trabajador:[{mensaje:"",color_texto:""}],
            msj_id_funcion_trabajador:[{mensaje:"",color_texto:""}],
            msj_telefono_movil:[{mensaje:"",color_texto:""}],
            msj_telefono_local:[{mensaje:"",color_texto:""}],
            msj_correo:[{mensaje:"",color_texto:""}],
            msj_titulo_grado_instruccion:[{mensaje:"",color_texto:""}],
            //// combo box
            perfiles:[],
            tipos_trabajador:[],
            funcion_trabajador:[],
            grados_instruccion:[
                {id:"ingeniero",descripcion:"ingeniero"},
                {id:"licenciado",descripcion:"licenciado"},
                {id:"tsu",descripcion:"tsu"},
                {id:"bachiller",descripcion:"bachiller"},
                {id:"educacion basica",descripcion:"educación basica"}
            ],
            fecha_minimo:"",
            hashTrabajadores:{},
            estadoBusquedaTrabajador:false,
            ///
            mensaje:{
                texto:"",
                estado:""
            },
            //
            fechaServidor:null,
            edadTrabajador:null
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
        await this.consultarFechaServidor()
        await this.consultarTodosLosTrabajadores()

        const operacion=this.props.match.params.operacion
        if(operacion==="registrar"){
            const ruta_api_1="http://localhost:8080/configuracion/acceso/consultar-perfiles",
            nombre_propiedad_lista_1="perfiles",
            propiedad_id_1="id_perfil",
            propiedad_descripcion_1="nombre_perfil",
            propiedad_estado_1="estatu_perfil"
            const lista_perfiles=await this.consultarServidor(ruta_api_1,nombre_propiedad_lista_1,propiedad_id_1,propiedad_descripcion_1,propiedad_estado_1)
            //
            const ruta_api="http://localhost:8080/configuracion/tipo-trabajador/consultar-tipos-trabajador",
            nombre_propiedad_lista="tipos_trabajador",
            propiedad_id="id_tipo_trabajador",
            propiedad_descripcion="descripcion_tipo_trabajador",
            propiedad_estado="estatu_tipo_trabajador"
            const tipo_trabajador=await this.consultarServidor(ruta_api,nombre_propiedad_lista,propiedad_id,propiedad_descripcion,propiedad_estado)
            //
            // alert(tipo_trabajador[0].id)
            let listaFuncionTrabajador={
                funcion_trabajador:[]
            }
            if(tipo_trabajador.length!==0){
                listaFuncionTrabajador=await this.buscarFuncionTrabajador(tipo_trabajador[0].id)
            }
            this.setState({
                perfiles:lista_perfiles,
                tipos_trabajador:tipo_trabajador,
                id_perfil:(lista_perfiles.length===0)?null:lista_perfiles[0].id,
                id_tipo_trabajador:(tipo_trabajador.length===0)?null:tipo_trabajador[0].id,
                id_funcion_trabajador:(listaFuncionTrabajador.funcion_trabajador.length===0)?null:listaFuncionTrabajador.funcion_trabajador[0].id,
                funcion_trabajador:listaFuncionTrabajador.funcion_trabajador
            })
    }
    else if(operacion==="actualizar"){
            const ruta_api_1="http://localhost:8080/configuracion/acceso/consultar-perfiles",
            nombre_propiedad_lista_1="perfiles",
            propiedad_id_1="id_perfil",
            propiedad_descripcion_1="nombre_perfil",
            propiedad_estado_1="estatu_perfil"
            const lista_perfiles=await this.consultarServidor(ruta_api_1,nombre_propiedad_lista_1,propiedad_id_1,propiedad_descripcion_1,propiedad_estado_1)
            const ruta_api="http://localhost:8080/configuracion/tipo-trabajador/consultar-tipos-trabajador",
            nombre_propiedad_lista="tipos_trabajador",
            propiedad_id="id_tipo_trabajador",
            propiedad_descripcion="descripcion_tipo_trabajador",
            propiedad_estado="estatu_tipo_trabajador"
            const tipo_trabajador=await this.consultarServidor(ruta_api,nombre_propiedad_lista,propiedad_id,propiedad_descripcion,propiedad_estado)

            const id=this.props.match.params.id
            await this.consultarTrabajador(tipo_trabajador,lista_perfiles,id)
        }
    }

    async consultarTodosLosTrabajadores(){
        await axios.get("http://localhost:8080/configuracion/trabajador/consultar-todos")
        .then(repuesta => {
            let json=JSON.parse(JSON.stringify(repuesta.data))
            // console.log("datos =>>> ",json)
            let hash={}
            for(let trabajador of json.trabajadores){
                hash[trabajador.id_cedula]=trabajador
            }
            console.log("hash trabajador =>>> ",hash)
            this.setState({hashTrabajadores:hash})
        })
        .catch(error => {
            console.log(error)
        })
    }

    async consultarFechaServidor(){
        await axios.get("http://localhost:8080/configuracion/trabajador/fecha-servidor")
        .then(respuesta => {
            let fechaServidor=respuesta.data.fechaServidor
            // alert(fechaServidor)
            this.setState({fechaServidor})
        })
        .catch(error => {
            console.log("error al conectar con el servidor")
        })
    }

    async consultarTrabajador(tipo_trabajador,lista_perfiles,id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        var id_cedula="",
        nombres="",
        apellidos="",
        sexo_trabajador="",
        telefono_movil="",
        telefono_local="",
        correo="",
        direccion="",
        grado_instruccion="",
        titulo_grado_instruccion="",
        designacion="",
        fecha_nacimiento="",
        fecha_ingreso="",
        estatu_trabajador="",
        id_perfil="",
        id_tipo_trabajador="",
        id_funcion_trabajador=""
        const token=localStorage.getItem('usuario')
        await axios.get(`http://localhost:8080/configuracion/trabajador/consultar/${id}/${token}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            console.log(respuesta_servidor)
            if(respuesta_servidor.estado_peticion==="200"){
                id_cedula=respuesta_servidor.trabajador.id_cedula
                nombres=respuesta_servidor.trabajador.nombres
                apellidos=respuesta_servidor.trabajador.apellidos
                sexo_trabajador=respuesta_servidor.trabajador.sexo_trabajador
                telefono_movil=(respuesta_servidor.trabajador.telefono_movil==="N-O")?"":respuesta_servidor.trabajador.telefono_movil
                telefono_local=(respuesta_servidor.trabajador.telefono_local==="N-O")?"":respuesta_servidor.trabajador.telefono_local
                correo=(respuesta_servidor.trabajador.correo==="N-O")?"":respuesta_servidor.trabajador.correo
                direccion=respuesta_servidor.trabajador.direccion
                grado_instruccion=respuesta_servidor.trabajador.grado_instruccion
                titulo_grado_instruccion=respuesta_servidor.trabajador.titulo_grado_instruccion
                designacion=respuesta_servidor.trabajador.designacion
                fecha_nacimiento=Moment(respuesta_servidor.trabajador.fecha_nacimiento).format("YYYY-MM-DD")
                fecha_ingreso=Moment(respuesta_servidor.trabajador.fecha_ingreso).format("YYYY-MM-DD")
                estatu_trabajador=respuesta_servidor.trabajador.estatu_trabajador
                id_perfil=respuesta_servidor.trabajador.id_perfil
                id_tipo_trabajador=respuesta_servidor.trabajador.id_tipo_trabajador
                id_funcion_trabajador=respuesta_servidor.trabajador.id_funcion_trabajador
                
            }
            else if(respuesta_servidor.estado_peticion==="404"){
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
        const objeto_estado=await this.buscarFuncionTrabajador(id_tipo_trabajador)
        this.setState({
            id_cedula:id_cedula,
            nombres:nombres,
            apellidos:apellidos,
            telefono_movil:telefono_movil,
            telefono_local:telefono_local,
            correo:correo,
            grado_instruccion:grado_instruccion,
            titulo_grado_instruccion:titulo_grado_instruccion,
            fecha_nacimiento:fecha_nacimiento,
            fecha_ingreso:fecha_ingreso,
            direccion:direccion,
            estatu_trabajador:estatu_trabajador,
            sexo_trabajador:sexo_trabajador,
            designacion:designacion,
            id_perfil:id_perfil,
            id_tipo_trabajador:id_tipo_trabajador,
            id_funcion_trabajador:id_funcion_trabajador,
            perfiles:lista_perfiles,
            tipos_trabajador:tipo_trabajador,
            funcion_trabajador:objeto_estado.funcion_trabajador,
            mensaje:objeto_estado.mensaje
        })
        let fechaServidor=Moment(this.state.fechaServidor,"YYYY-MM-DD")
        let edadTrabajador=(parseInt(fechaServidor.diff(Moment(this.state.fecha_nacimiento).format("YYYY-MM-DD"),"years"))>=18)?fechaServidor.diff(Moment(this.state.fecha_nacimiento).format("YYYY-MM-DD"),"years"):null
        this.setState({edadTrabajador})
        document.getElementById("grado_instruccion").value=grado_instruccion
        document.getElementById("id_perfil").value=id_perfil
        document.getElementById("id_tipo_trabajador").value=id_tipo_trabajador
        document.getElementById("id_funcion_trabajador").value=id_funcion_trabajador
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

    formatoOptionSelect(lista,lista_vacia,propiedades){
        var veces=0
        while(veces<lista.length){
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
        let edadTrabajador=(parseInt(fechaServidor.diff(input.value,"years"))>=18)?fechaServidor.diff(input.value,"years"):null
        this.setState({edadTrabajador})
    }

    async consultarFuncionesTrabajador(a){
        var input=a.target;
        const objeto_estado=await this.buscarFuncionTrabajador(input.value)
        this.setState(objeto_estado)
    }

    async buscarFuncionTrabajador(id){
        var respuesta_servidor=""
        var objeto_estado=""
        var mensaje=this.state.mensaje
        await axios.get(`http://localhost:8080/configuracion/funcion-trabajador/consultar-id-tipo-trabajador/${id}`)
            .then(respuesta=>{
                respuesta_servidor=respuesta.data
                if(respuesta_servidor.estado_peticion==="200"){
                    var lista_vacia=[]
                    const propiedades={
                        id:"id_funcion_trabajador",
                        descripcion:"funcion_descripcion",
                        estado:"estatu_funcion_trabajador"
                    }
                    const lista_funciones_trabajador=this.formatoOptionSelect(respuesta_servidor.funciones,lista_vacia,propiedades)
                    
                    mensaje.estado=respuesta_servidor.estado_peticion
                    
                    objeto_estado={id_tipo_trabajador:id,funcion_trabajador:lista_funciones_trabajador,mensaje:mensaje}

                }
                else if(respuesta_servidor.estado_peticion==="500"){
                    mensaje.texto=respuesta_servidor.mensaje
                    mensaje.estado=respuesta_servidor.estado_peticion
                    this.props.history.push(`/dashboard/configuracion/trabajador${JSON.stringify(mensaje)}`)
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
        return objeto_estado
    }

    validarCampo(nombre_campo){
        var estado=false
        const nombre_permiso=this.state[nombre_campo],
        exprecion=/[A-Za-z]/
        var mensaje_campo=this.state["msj_"+nombre_campo]
        if(nombre_permiso!==""){
            if(exprecion.test(nombre_permiso)){
                estado=true
                console.log("campo nombre "+nombre_campo+" OK")
                mensaje_campo[0]={mensaje:"",color_texto:"rojo"}
                this.setState({["msj_"+nombre_campo]:mensaje_campo})
            }
            else{
                mensaje_campo[0]={mensaje:"este campo solo permite letras",color_texto:"rojo"}
                this.setState({["msj_"+nombre_campo]:mensaje_campo})
            } 
        }
        else{
            mensaje_campo[0]={mensaje:"este campo no puede estar vacio",color_texto:"rojo"}
            this.setState({["msj_"+nombre_campo]:mensaje_campo})
        }
        return estado
    }

    async agregar(){
        const ruta_api_1="http://localhost:8080/configuracion/acceso/consultar-perfiles",
        nombre_propiedad_lista_1="perfiles",
        propiedad_id_1="id_perfil",
        propiedad_descripcion_1="nombre_perfil",
        propiedad_estado_1="estatu_perfil"
        const lista_perfiles=await this.consultarServidor(ruta_api_1,nombre_propiedad_lista_1,propiedad_id_1,propiedad_descripcion_1,propiedad_estado_1)
        const ruta_api="http://localhost:8080/configuracion/tipo-trabajador/consultar-tipos-trabajador",
        nombre_propiedad_lista="tipos_trabajador",
        propiedad_id="id_tipo_trabajador",
        propiedad_descripcion="descripcion_tipo_trabajador",
        propiedad_estado="estatu_tipo_trabajador"
        const tipo_trabajador=await this.consultarServidor(ruta_api,nombre_propiedad_lista,propiedad_id,propiedad_descripcion,propiedad_estado)
        // alert("agregando nuevo formulario")
        let listaFuncionTrabajador={
            funcion_trabajador:[]
        }
        if(tipo_trabajador.length!==0){
            listaFuncionTrabajador=await this.buscarFuncionTrabajador(tipo_trabajador[0].id)
        }
        console.log(listaFuncionTrabajador);
        var mensaje=this.state.mensaje
        mensaje.estado=""
        var mensaje_campo=[{mensaje:"",color_texto:""}]
        this.setState({
            id_cedula:"",
            nombres:"",
            apellidos:"",
            telefono_movil:"",
            telefono_local:"",
            correo:"",
            grado_instruccion:"",
            titulo_grado_instruccion:"",
            fecha_nacimiento:"",
            fecha_ingreso:"",
            direccion:"",
            perfiles:lista_perfiles,
            tipos_trabajador:tipo_trabajador,
            mensaje:mensaje,
            id_perfil:(lista_perfiles.length===0)?null:lista_perfiles[0].id,
            id_tipo_trabajador:(tipo_trabajador.length===0)?null:tipo_trabajador[0].id,
            id_funcion_trabajador:(listaFuncionTrabajador.funcion_trabajador.length===0)?null:listaFuncionTrabajador.funcion_trabajador[0].id,
            funcion_trabajador:listaFuncionTrabajador.funcion_trabajador,
            //
            msj_id_cedula:mensaje_campo,
            msj_nombres:mensaje_campo,
            msj_apellidos:mensaje_campo,
            msj_fecha_nacimiento:mensaje_campo,
            msj_fecha_ingreso:mensaje_campo,
            msj_direccion:mensaje_campo,
            msj_grado_instruccion:mensaje_campo,
            msj_id_perfil:mensaje_campo,
            msj_id_tipo_trabajador:mensaje_campo,
            msj_id_funcion_trabajador:mensaje_campo,
            msj_telefono_movil:mensaje_campo,
            msj_telefono_local:mensaje_campo,
            msj_correo:mensaje_campo,
            msj_titulo_grado_instruccion:mensaje_campo,
            edadTrabajador:null
        })
        this.props.history.push("/dashboard/configuracion/trabajador/registrar")
        document.getElementById("id_funcion_trabajador").value=(listaFuncionTrabajador.funcion_trabajador.length===0)?null:listaFuncionTrabajador.funcion_trabajador[0].id;
        document.getElementById("grado_instruccion").value="ingeniero"
        document.getElementById("id_perfil").value=(lista_perfiles.length===0)?null:lista_perfiles[0].id
        document.getElementById("id_tipo_trabajador").value=(tipo_trabajador.length===0)?null:tipo_trabajador[0].id
    }

    // componentDidUpdate(){
    //     alert("hola")
    // }

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
        var fecha_trabajador_nacimiento=Moment(new Date(this.state.fecha_nacimiento))
        fecha_trabajador_nacimiento.add(1,"d")
        var fecha_minima=Moment();
        fecha_minima.subtract(18,"y")
        var msj_fecha_nacimiento=this.state.msj_fecha_nacimiento
        if(this.state.fecha_nacimiento!==""){
            if(!fecha_trabajador_nacimiento.isAfter(fecha_minima)){
                if(fecha_trabajador_nacimiento.isBefore(fecha_minima)){
                    estado=true
                    msj_fecha_nacimiento[0]={mensaje:"",color_texto:"rojo"}
                    this.setState(msj_fecha_nacimiento)
                }
                else{
                    msj_fecha_nacimiento[0]={mensaje:"enserio acabas de poner esa fecha",color_texto:"rojo"}
                    this.setState(msj_fecha_nacimiento)
                }
            }
            else{
                msj_fecha_nacimiento[0]={mensaje:"es menor de edad",color_texto:"rojo"}
                this.setState(msj_fecha_nacimiento)
            }
        }
        else{
            msj_fecha_nacimiento[0]={mensaje:"la fecha de nacimiento no puede estar vacia",color_texto:"rojo"}
            this.setState(msj_fecha_nacimiento)
        }
        return estado
    }

    validarFechaIngreso(){
        var estado=false
        var fecha_ingreso=Moment(new Date(),"YYYY-MM-DD")
        var hora_ingreso=Moment(new Date(),"HH:mmA")
        var hoy=Moment("07:00AM","HH:mmA");
        var manana=Moment("10:00AM","HH:mmA");
        if(hora_ingreso.isSameOrAfter(hoy)){
            if(hora_ingreso.isBetween(hoy,manana)){
                estado=true
                // alert("como son las "+fecha_ingreso.format("HH:mmA")+", la fecha de ingreso del usuario sera -> "+fecha_ingreso.format("DD-MM-YYYY"))
            }
            else{
                fecha_ingreso.add(1,"d")
                // alert("como ya son mas de las 10:00AM, la fecha de ingreso del usuario sera -> "+fecha_ingreso.format("DD-MM-YYYY"))
                estado=true
            }
        }
        return {estado:estado,fecha:fecha_ingreso.format("YYYY-MM-DD")}
    }

    validarDireccion(){
        var estado=false
        const direccion=this.state.direccion,
        exprecion=/[A-Za-z]|[0-9]/
        var msj_direccion=this.state.msj_direccion
        if(direccion!==""){
            if(exprecion.test(direccion)){
                estado=true
                console.log("campo nombre direccion OK")
                msj_direccion[0]={mensaje:"",color_texto:"rojo"}
                this.setState(msj_direccion)
            }
            else{
                msj_direccion[0]={mensaje:"la direccion no puede tener solo espacios en blanco",color_texto:"rojo"}
                this.setState(msj_direccion)
            }
        }
        else{
            msj_direccion[0]={mensaje:"la direccion no puede estar vacia",color_texto:"rojo"}
            this.setState({msj_direccion:msj_direccion})
        }
        return estado
    }

    verificarSelect(nombre_campo,modulo,modulos){
        var respuesta=false,
        contador=0
        var mensaje_select=this.state["msj_"+nombre_campo]
        if(modulo!==""){
            while(contador<modulos.length){
                var {id} = modulos[contador];
                if(modulo===id){
                    respuesta=true;
                }
                contador+=1
            }
            if(respuesta){
                console.log("NL-> 236: OK COMBO");
                mensaje_select[0]={mensaje:"",color_texto:"rojo"}
                this.setState({["msj_"+nombre_campo]:mensaje_select})
            }
            else{
                mensaje_select[0]={mensaje:"Error no puedes modificar los valores del Combo",color_texto:"rojo"}
                this.setState({["msj_"+nombre_campo]:mensaje_select})
            }
        }
        else{
            mensaje_select[0]={mensaje:"Por favor seleciona un elemento del combo",color_texto:"rojo"}
            this.setState({["msj_"+nombre_campo]:mensaje_select})
        }
        return respuesta;
    }

    validarTelefono(nombre_campo){
        const campo=this.state[nombre_campo],
        exprecion_2=/\s/
        var mensaje_campo=this.state["msj_"+nombre_campo]
        if(campo!==""){
            if(!exprecion_2.test(campo)){
                if(campo.length===11){
                    console.log("campo nombre "+nombre_campo+" OK")
                    mensaje_campo[0]={mensaje:"",color_texto:"rojo"}
                    this.setState({["msj_"+nombre_campo]:mensaje_campo})
                }
                else{
                    mensaje_campo[0]={mensaje:`no cumple con la longitud de un numero telefonico ${campo.length}/11`,color_texto:"rojo"}
                    this.setState({["msj_"+nombre_campo]:mensaje_campo})
                }
            }
            else{
                mensaje_campo[0]={mensaje:"el campo no puede tener solo espacios en blanco",color_texto:"rojo"}
                this.setState({["msj_"+nombre_campo]:mensaje_campo})
            } 
        }
        else{
            mensaje_campo[0]={mensaje:"",color_texto:"rojo"}
            this.setState({["msj_"+nombre_campo]:mensaje_campo})
        }
    }

    validarEmail() {
        let estado=false
        const correo=this.state.correo
        var msj_correo=this.state.msj_correo
        const exprecion=/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/ 
        if(correo!==""){
            if (exprecion.test(correo)){
                estado=true
                msj_correo[0]={mensaje:"",color_texto:""}
                this.setState({msj_correo: msj_correo})
            }
            else {
                msj_correo[0]={mensaje:"La dirección de email es incorrecta",color_texto:"rojo"}
                this.setState({msj_correo: msj_correo})
            }
        }
        else{
            msj_correo[0]={mensaje:"no puede estar vacio",color_texto:"rojo"}
            this.setState({msj_correo: msj_correo})
        }
        return estado
    }

    validarFormularioRegistrar(){
        var estado=false
        const validar_nombres=this.validarCampo("nombres"),
        validar_apellidos=this.validarCampo("apellidos"),
        validar_titulo_grado_instruccion=this.validarCampo("titulo_grado_instruccion"),
        validar_cedula=this.validarCampoNumero("id_cedula"),
        validar_fecha_nacimiento=this.validarFechaNacimineto(),
        validar_fecha_ingreso=this.validarFechaIngreso(),
        validar_email=this.validarEmail(),
        validar_direccion=this.validarDireccion()
        if(validar_email && validar_titulo_grado_instruccion && validar_nombres && validar_apellidos && validar_cedula && validar_fecha_nacimiento && validar_fecha_ingreso.estado && validar_direccion){
            estado=true
            return {estado:estado,fecha:validar_fecha_ingreso.fecha}
        }
        else{
            return {estado:estado}
        }
    }

    validarFormularioActuazliar(){
        var estado=false
        const validar_nombres=this.validarCampo("nombres"),
        validar_apellidos=this.validarCampo("apellidos"),
        validar_cedula=this.validarCampoNumero("id_cedula"),
        validar_titulo_grado_instruccion=this.validarCampo("titulo_grado_instruccion"),
        validar_fecha_nacimiento=this.validarFechaNacimineto(),
        validar_email=this.validarEmail(),
        validar_direccion=this.validarDireccion()
        console.log(validar_email)
        if(validar_email && validar_titulo_grado_instruccion && validar_nombres && validar_apellidos && validar_cedula && validar_fecha_nacimiento && validar_direccion){
            estado=true
            return {estado:estado,fecha:this.state.fecha_ingreso}
        }
        else{
            return {estado:estado}
        }
    }

    componentDidMount(){
        // alert(document.getElementById("grado_instruccion").value)
        this.setState({
            grado_instruccion:document.getElementById("grado_instruccion").value
        })
    }

    operacion(){
        const operacion=this.props.match.params.operacion
        const mensaje_formulario={
            mensaje:"",
            msj_id_cedula:[{mensaje:"",color_texto:""}],
            msj_nombres:[{mensaje:"",color_texto:""}],
            msj_apellidos:[{mensaje:"",color_texto:""}],
            msj_fecha_nacimiento:[{mensaje:"",color_texto:""}],
            msj_fecha_ingreso:[{mensaje:"",color_texto:""}],
            msj_direccion:[{mensaje:"",color_texto:""}],
            msj_grado_instruccion:[{mensaje:"",color_texto:""}],
            msj_id_perfil:[{mensaje:"",color_texto:""}],
            msj_id_tipo_trabajador:[{mensaje:"",color_texto:""}],
            msj_id_funcion_trabajador:[{mensaje:"",color_texto:""}],
            msj_telefono_movil:[{mensaje:"",color_texto:""}],
            msj_telefono_local:[{mensaje:"",color_texto:""}],
            msj_correo:[{mensaje:"",color_texto:""}],
        }
        if(operacion==="registrar"){
            this.validarTelefono("telefono_movil")
            this.validarTelefono("telefono_local")
            
            const estado_validar_formulario=this.validarFormularioRegistrar()
            if(estado_validar_formulario.estado){
                this.enviarDatos(estado_validar_formulario,(objeto)=>{
                    const mensaje =this.state.mensaje
                    var respuesta_servidor=""
                    axios.post("http://localhost:8080/configuracion/trabajador/registrar",objeto)
                    .then(respuesta=>{
                        respuesta_servidor=respuesta.data
                        mensaje.texto=respuesta_servidor.mensaje
                        mensaje.estado=respuesta_servidor.estado_peticion
                        mensaje_formulario.mensaje=mensaje
                        this.setState(mensaje_formulario)
                    })
                    .catch(error=>{
                        mensaje.texto="No se puedo conectar con el servidor"
                        mensaje.estado="500"
                        console.log(error)
                        mensaje_formulario.mensaje=mensaje
                        this.setState(mensaje_formulario)
                    })
                })
            }
        }
        else if(operacion==="actualizar"){
            const estado_validar_formulario=this.validarFormularioActuazliar()
            this.validarTelefono("telefono_movil")
            this.validarTelefono("telefono_local")
            this.validarEmail()
            if(estado_validar_formulario.estado){
                this.enviarDatos(estado_validar_formulario,(objeto)=>{
                    const mensaje =this.state.mensaje
                    var respuesta_servidor=""
                    axios.put(`http://localhost:8080/configuracion/trabajador/actualizar/${this.state.id_cedula}`,objeto)
                    .then(respuesta=>{
                        respuesta_servidor=respuesta.data
                        mensaje.texto=respuesta_servidor.mensaje
                        mensaje.estado=respuesta_servidor.estado_peticion
                        mensaje_formulario.mensaje=mensaje
                        this.setState(mensaje_formulario)
                    })
                    .catch(error=>{
                        mensaje.texto="No se puedo conectar con el servidor"
                        mensaje.estado="500"
                        console.log(error)
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
            trabajador:{
                id_cedula:this.state.id_cedula,
                nombres:this.state.nombres,
                apellidos:this.state.apellidos,
                sexo_trabajador:this.state.sexo_trabajador,
                telefono_movil:(this.state.telefono_movil==="")?"N-O":this.state.telefono_movil,
                telefono_local:(this.state.telefono_local==="")?"N-O":this.state.telefono_local,
                correo:(this.state.correo==="")?"N-O":this.state.correo,
                direccion:this.state.direccion,
                grado_instruccion:this.state.grado_instruccion,
                titulo_grado_instruccion:this.state.titulo_grado_instruccion,
                designacion:this.state.designacion,
                fecha_nacimiento:this.state.fecha_nacimiento,
                fecha_ingreso:estado_validar_formulario.fecha,
                estatu_trabajador:this.state.estatu_trabajador,
                id_perfil:this.state.id_perfil,
                id_funcion_trabajador:this.state.id_funcion_trabajador
            },
            token:token
        }
        petion(objeto)
    }

    regresar(){
        this.props.history.push("/dashboard/configuracion/trabajador");
    }

    async buscarTrabajador(a){
        let input = a.target
        this.validarNumero(a)
        // console.log(input.value)
        let hashTrabajadores=JSON.parse(JSON.stringify(this.state.hashTrabajadores))
        if(hashTrabajadores[input.value]){
            this.setState({
                estadoBusquedaTrabajador:true
            })
            alert("este trabajador ya esta resgistrado")
        }
        else{
            // console.log("NO OK")
            this.setState({
                estadoBusquedaTrabajador:false
            })
        }
    }

    render(){
        var jsx_permiso_form=(
            <div className="row justify-content-center">
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                    {this.state.mensaje.texto!=="" && (this.state.mensaje.estado==="200" || this.state.mensaje.estado==="404" || this.state.mensaje.estado==="500") &&
                        <div className="row">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                <div className={`alert alert-${(this.state.mensaje.estado==="200")?"success":"danger"} alert-dismissible`}>
                                    <p>Mensaje: {this.state.mensaje.texto}</p>
                                    <p>Estado: {this.state.mensaje.estado}</p>
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
                            <span className="titulo-form-trabajador">Formulario trabajador</span>
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
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            obligatorio="si"
                            mensaje={this.state.msj_id_cedula[0]}
                            nombreCampo="Cedula:"
                            activo="si"
                            type="text"
                            value={this.state.id_cedula}
                            name="id_cedula"
                            id="id_cedula"
                            placeholder="CEDULA"
                            eventoPadre={this.buscarTrabajador}
                            />
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            obligatorio="si"
                            mensaje={this.state.msj_nombres[0]}
                            nombreCampo="nombres:"
                            activo="si"
                            type="text"
                            value={this.state.nombres}
                            name="nombres"
                            id="nombres"
                            placeholder="NOMBRE"
                            eventoPadre={this.validarTexto}
                            />
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            obligatorio="si"
                            mensaje={this.state.msj_apellidos[0]}
                            nombreCampo="apellidos:"
                            activo="si"
                            type="text"
                            value={this.state.apellidos}
                            name="apellidos"
                            id="apellidos"
                            placeholder="APELLIDO"
                            eventoPadre={this.validarTexto}
                            />
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            nombreCampo="Telefono Movil:"
                            mensaje={this.state.msj_telefono_movil[0]}
                            activo="si"
                            type="text"
                            value={this.state.telefono_movil}
                            name="telefono_movil"
                            id="telefono_movil"
                            placeholder="TELEFONO MOVIL"
                            eventoPadre={this.validarNumero}
                            />
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            mensaje={this.state.msj_telefono_local[0]}
                            nombreCampo="Telefono Local:"
                            activo="si"
                            type="text"
                            value={this.state.telefono_local}
                            name="telefono_local"
                            id="telefono_local"
                            placeholder="TELEFONO LOCAL"
                            eventoPadre={this.validarNumero}
                            />
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            obligatorio="si"
                            nombreCampo="Correo:"
                            mensaje={this.state.msj_correo[0]}
                            activo="si"
                            type="text"
                            value={this.state.correo}
                            name="correo"
                            id="correo"
                            placeholder="CORREO"
                            eventoPadre={this.cambiarEstado}
                            />
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormDate
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            obligatorio="si"
                            mensaje={this.state.msj_fecha_nacimiento[0]}
                            nombreCampoDate="Fecha de Nacimiento:"
                            clasesCampo="form-control"
                            value={this.state.fecha_nacimiento}
                            name="fecha_nacimiento"
                            id="fecha_nacimiento"
                            eventoPadre={this.fechaNacimiento}
                            />
                            {this.state.edadTrabajador!==null &&
                                (
                                <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                        <div className="form-ground">
                                            <label className="mb-3">Edad:</label>
                                            <div >{this.state.edadTrabajador} Años</div>
                                        </div>
                                </div>
                                )
                            }
                            <ComponentFormSelect
                            clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                            obligatorio="si"
                            mensaje={this.state.msj_grado_instruccion[0]}
                            nombreCampoSelect="Grado Instrucción:"
                            clasesSelect="custom-select"
                            name="grado_instruccion"
                            id="grado_instruccion"
                            eventoPadre={this.cambiarEstado}
                            defaultValue={this.state.grado_instruccion}
                            option={this.state.grados_instruccion}
                            />
                            {this.state.edadTrabajador===null &&
                                (<div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"></div>)
                            }
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            obligatorio="si"
                            mensaje={this.state.msj_titulo_grado_instruccion[0]}
                            nombreCampo="Titulo:"
                            activo="si"
                            type="text"
                            value={this.state.titulo_grado_instruccion}
                            name="titulo_grado_instruccion"
                            id="titulo_grado_instruccion"
                            placeholder="titulo"
                            eventoPadre={this.validarTexto}
                            />
                            <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6"></div>
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormTextArea
                            clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            obligatorio="si"
                            mensaje={this.state.msj_direccion[0]}
                            nombreCampoTextArea="dirección:"
                            clasesTextArear="form-control"
                            name="direccion"
                            id="direccion"
                            value={this.state.direccion}
                            eventoPadre={this.cambiarEstado}
                            />
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormSelect
                            clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                            obligatorio="si"
                            mensaje={this.state.msj_id_perfil[0]}
                            nombreCampoSelect="Perfil:"
                            clasesSelect="custom-select"
                            name="id_perfil"
                            id="id_perfil"
                            eventoPadre={this.cambiarEstado}
                            defaultValue={this.state.id_perfil}
                            option={this.state.perfiles}
                            />
                            <ComponentFormSelect
                            clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                            obligatorio="si"
                            mensaje={this.state.msj_id_tipo_trabajador[0]}
                            nombreCampoSelect="Tipo:"
                            clasesSelect="custom-select"
                            name="id_tipo_trabajador"
                            id="id_tipo_trabajador"
                            eventoPadre={this.consultarFuncionesTrabajador}
                            defaultValue={this.state.id_tipo_trabajador}
                            option={this.state.tipos_trabajador}
                            />
                            {this.state.funcion_trabajador.length>0 &&
                                (
                                    <ComponentFormSelect
                                    clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                                    obligatorio="si"
                                    mensaje={this.state.msj_id_funcion_trabajador[0]}
                                    nombreCampoSelect="función:"
                                    clasesSelect="custom-select"
                                    name="id_funcion_trabajador"
                                    id="id_funcion_trabajador"
                                    eventoPadre={this.cambiarEstado}
                                    defaultValue={this.state.id_funcion_trabajador}
                                    option={this.state.funcion_trabajador}
                                    />
                                )
                            }
                            {this.state.funcion_trabajador.length===0 &&
                                (
                                    <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"></div>
                                )
                            }
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormRadioState
                            clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            extra="custom-control-inline"
                            nombreCampoRadio="Sexo:"
                            name="sexo_trabajador"
                            nombreLabelRadioA="Masculino"
                            idRadioA="masculino"
                            checkedRadioA={this.state.sexo_trabajador}
                            valueRadioA="1"
                            nombreLabelRadioB="Femenino"
                            idRadioB="femenino"
                            valueRadioB="0"
                            eventoPadre={this.cambiarEstado}
                            checkedRadioB={this.state.sexo_trabajador}
                            />
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormRadioState
                            clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            extra="custom-control-inline"
                            nombreCampoRadio="designación:"
                            name="designacion"
                            nombreLabelRadioA="interno"
                            idRadioA="activodesignacionA"
                            checkedRadioA={this.state.designacion}
                            valueRadioA="1"
                            nombreLabelRadioB="externo"
                            idRadioB="activodesignacionB"
                            valueRadioB="0"
                            eventoPadre={this.cambiarEstado}
                            checkedRadioB={this.state.designacion}
                            />
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormRadioState
                            clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            extra="custom-control-inline"
                            nombreCampoRadio="Estatu:"
                            name="estatu_trabajador"
                            nombreLabelRadioA="Activo"
                            idRadioA="activotrabajadorA"
                            checkedRadioA={this.state.estatu_trabajador}
                            valueRadioA="1"
                            nombreLabelRadioB="Inactivo"
                            idRadioB="activotrabajadorB"
                            valueRadioB="0"
                            eventoPadre={this.cambiarEstado}
                            checkedRadioB={this.state.estatu_trabajador}
                            />
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-auto">
                                {this.props.match.params.operacion==="registrar" &&
                                    <InputButton 
                                    clasesBoton="btn btn-primary"
                                    id="boton-registrar"
                                    value="registrar"
                                    eventoPadre={this.operacion}
                                    />
                                }
                                {this.props.match.params.operacion==="actualizar" &&
                                    <InputButton 
                                    clasesBoton="btn btn-warning"
                                    id="boton-actualizar"
                                    value="actualizar"
                                    eventoPadre={this.operacion}
                                    />   
                                }
                            </div>
                            <div className="col-auto">
                                <InputButton 
                                clasesBoton="btn btn-danger"
                                id="boton-cancelar"
                                value="cancelar"
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
                componente={jsx_permiso_form}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />
            </div>
        )
    }
}

export default withRouter(ComponentTrabajadorForm)