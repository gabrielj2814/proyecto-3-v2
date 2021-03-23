import React from "react"
import {withRouter} from "react-router-dom"

//JS
import axios from 'axios'
import Moment from 'moment'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import "../css/componentReposoTrabajadorForm.css"
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'
import ButtonIcon from '../subComponentes/buttonIcon'
import ComponentFormCampo from '../subComponentes/componentFormCampo';
import ComponentFormTextArea from "../subComponentes/componentFormTextArea"
import ComponentFormSelect from "../subComponentes/componentFormSelect"
import ComponentFormRadioState from "../subComponentes/componentFormRadioState"
import AlertBootstrap from "../subComponentes/alertBootstrap"
import ComponentFormDate from '../subComponentes/componentFormDate'

class ComponetReposoTrabajadorForm extends React.Component{

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.operacion=this.operacion.bind(this)
        this.regresar=this.regresar.bind(this);
        this.mostarDias=this.mostarDias.bind(this)
        this.mostrarDatosCam=this.mostrarDatosCam.bind(this)
        this.agregar=this.agregar.bind(this)
        this.mostrarAsignacionMedico=this.mostrarAsignacionMedico.bind(this)
        this.mostrarFechaHasta=this.mostrarFechaHasta.bind(this)
        this.buscarTrabajador=this.buscarTrabajador.bind(this)
        this.campoDiasReposo=this.campoDiasReposo.bind(this)
        this.campoDiasNoAvilesReposo=this.campoDiasNoAvilesReposo.bind(this)
        this.calcularDiasNoAviles=this.calcularDiasNoAviles.bind(this)
        this.state={
            modulo:"",// modulo menu
            estado_menu:false,
            //---------- 
            id_reposo_trabajador:"",
            id_cedula:null,
            id_reposo:null,
            fecha_desde_reposo_trabajador:"",
            fecha_hasta_reposo_trabajador:"",
            estatu_reposo_trabajador:"1",
            descripcion_reposo_trabajador:"",
            id_cam:null,
            id_asignacion_medico_especialidad:null,

            total_dias_reposo_trabajador:0,
            total_dias_no_aviles_reposo_trabajador:0,
            cantidad_dias_entrega_reposo_trabajador:15,
            fecha_desde_entrega_reposo_trabajador:"",
            fecha_hasta_entrega_reposo_trabajador:"",
            estatu_entrega_reposo:"P",
            //  P -> en espera
            //  E -> en espera
            //  N -> en espera
            // --------
            diasParaEntregarReposo:15,
            diasNoAviles:0,
            // ---------
            hashTrabajador:[],
            listaDeRepososActivos:[],
            listaDeCamsActivos:[],
            listaDeEspecialidadActivos:[],
            listaDeMedico:[],
            listaDeReposos:{},
            listaDeCams:{},
            listaDeAsignaciones:{},
            // -----
            dias_reposo:null,
            infoCam:{},
            id_especialidad:"",
            // ----
            msj_cedula:{
                mensaje:"",
                color_texto:""
            },
            msj_reposo:{
                mensaje:"",
                color_texto:""
            },
            msj_cam:{
                mensaje:"",
                color_texto:""
            },
            msj_especialidad:{
                mensaje:"",
                color_texto:""
            },
            msj_asignacion_medico_especialidad:{
                mensaje:"",
                color_texto:""
            },
            msj_descripcion_reposo_trabajador:{
                mensaje:"",
                color_texto:""
            },
            msj_fecha_desde_reposo_trabajador:{
                mensaje:"",
                color_texto:""
            },
            msj_total_dias_reposo_trabajador:{
                mensaje:"",
                color_texto:""
            },
            msj_total_dias_no_aviles_reposo_trabajador:{
                mensaje:"",
                color_texto:""
            },
            msj_fecha_desde_entrega_reposo_trabajador:{
                mensaje:"",
                color_texto:""
            },
            estadoBusquedaTrabajador:false,
            alerta:{
                color:null,
                mensaje:null,
                estado:false
            }
        }
    }


    mostrarModulo(a){// esta funcion tiene la logica del menu no tocar si no quieres que el menu no te responda como es devido
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
        let idRegistro=await this.generarId()
        let {operacion} = this.props.match.params
        if(operacion==="registrar"){
            if(idRegistro!==null){
                await this.consultarTodosTrabajadores();
                // ----- reposo
                await this.consultarTodosReposo();
                // -------- cam
                await this.consultarTodosLosCam();
                // ------ asignaciones medico
                await this.consultarTodasEspecialidad();
                this.setState({
                    id_reposo_trabajador:idRegistro,
                })
            }
            if(this.state.estadoBusquedaTrabajador===true){
                document.getElementById("boton-registrar").removeAttribute("disabled")
            }
            else{
                document.getElementById("boton-registrar").setAttribute("disabled",true)
            }
        }
        else if(operacion==="actualizar"){
            alert("actualizando")
            // let {id}=this.props.match.params
            // let datosReposotTrabajador=await this.consultarReposoTrabajador(id)
            // if(datosReposotTrabajador!==null){
            //     // console.log("datos del reposo trabajador =>>>> ",datosReposotTrabajador)
            //     // ------ trabajadores
            //     let listaDeTrabajadores=await this.consultarTodosTrabajadores();
            //     let listaDetrabajadoresActivos=listaDeTrabajadores.filter( trabajador =>  trabajador.estatu_trabajador==="1" && trabajador.estatu_cuenta==="1")
            //     let listaDeTrabajadoresSelect=[]
            //     for(let trabajador of listaDetrabajadoresActivos){
            //         listaDeTrabajadoresSelect.push({
            //             id:trabajador.id_cedula,
            //             descripcion:trabajador.id_cedula+" - "+trabajador.nombres+" "+trabajador.apellidos
            //         })
            //     }
            //     // ----- reposo
            //     let listaDeTodosLosReposos=await this.consultarTodosReposo()
            //     let listaDeRepososActivos= listaDeTodosLosReposos.filter(reposo => reposo.estatu_reposo==="1")
            //     let listaDeReposoSelect=[];
            //     let reposoTablaHash={}
            //     for(let reposo of listaDeRepososActivos){
            //         listaDeReposoSelect.push({
            //             id:reposo.id_reposo,
            //             descripcion:reposo.nombre_reposo
            //         })
            //         reposoTablaHash[reposo.id_reposo]={dias:reposo.dias_reposo}
            //     }
            //     // -------- cam
            //     let listaDeTodosLosCam=await this.consultarTodosLosCam()
            //     let listaDeCamActivos=listaDeTodosLosCam.filter( cam => cam.estatu_cam==="1")
            //     let listaDeCamSelect=[]
            //     let camTablaHash={}
            //     for(let cam of listaDeCamActivos){
            //         listaDeCamSelect.push({
            //             id:cam.id_cam,
            //             descripcion:cam.nombre_cam
            //         })
            //         camTablaHash[cam.id_cam]=cam
            //     }
            //     if(listaDeCamSelect.length!==0){
            //         camTablaHash[datosReposotTrabajador.id_cam]["ciudad"]=await this.consultarCiudad(camTablaHash[datosReposotTrabajador.id_cam].id_ciudad)
            //         camTablaHash[datosReposotTrabajador.id_cam]["estado"]=await this.consultarEstado(camTablaHash[datosReposotTrabajador.id_cam].ciudad.id_estado)
            //         camTablaHash[datosReposotTrabajador.id_cam]["tipoCam"]=await this.consultarTipoCam(camTablaHash[datosReposotTrabajador.id_cam].id_tipo_cam)
            //     }
            //     // ------ asignaciones medico
            //     let listaDeEspecialidades= await this.consultarTodasEspecialidad()
            //     // console.log("listas de especialidades =>>> ",listaDeEspecialidades)
            //     let listaDeEspecialidadesActivas=listaDeEspecialidades.filter(especialidad => especialidad.estatu_especialidad==="1")
            //     console.log("listas de especialidades activas =>>> ",listaDeEspecialidadesActivas)
            //     let listaDeEspecialidadesSelect=[]
            //     let asigancionTablaHash={}
            //     for(let especialidad of listaDeEspecialidadesActivas){
            //         listaDeEspecialidadesSelect.push({
            //             id:especialidad.id_especialidad,
            //             descripcion:especialidad.nombre_especialidad
            //         })
            //         asigancionTablaHash[especialidad.id_especialidad]=especialidad
            //     }
            //     if(listaDeEspecialidadesActivas.length!==0){
            //         asigancionTablaHash[datosReposotTrabajador.id_especialidad]["asignacion"]=await this.consultarSignacionesPorEspecialidad(datosReposotTrabajador.id_especialidad)
            //     }
            //     let listasDeMedicosSelect=[]
            //     if(asigancionTablaHash[datosReposotTrabajador.id_especialidad]){
            //         for(let asignacion of asigancionTablaHash[datosReposotTrabajador.id_especialidad]["asignacion"]){
            //             listasDeMedicosSelect.push({
            //                 id:asignacion.id_asignacion_medico_especialidad,
            //                 descripcion:asignacion.nombre_medico+" "+asignacion.apellido_medico
            //             })
            //         }
            //     }
            //     this.setState({
            //         id_reposo_trabajador:datosReposotTrabajador.id_reposo_trabajador,
            //         listaDeTrabajadoresActivos:listaDeTrabajadoresSelect,
            //         id_cedula:datosReposotTrabajador.id_cedula,
            //         listaDeRepososActivos:listaDeReposoSelect,
            //         id_reposo:datosReposotTrabajador.id_reposo,
            //         listaDeReposos:reposoTablaHash,
            //         dias_reposo:(listaDeReposoSelect.length===0)?null:reposoTablaHash[datosReposotTrabajador.id_reposo].dias,
            //         listaDeCams:camTablaHash,
            //         listaDeCamsActivos:listaDeCamSelect,
            //         id_cam:datosReposotTrabajador.id_cam,
            //         infoCam:(listaDeCamSelect.length===0)?null:camTablaHash[datosReposotTrabajador.id_cam],
            //         listaDeEspecialidadActivos:listaDeEspecialidadesSelect,
            //         id_especialidad:(listaDeEspecialidadesSelect.length===0)?null:datosReposotTrabajador.id_especialidad,
            //         listaDeAsignaciones:asigancionTablaHash,
            //         id_asignacion_medico_especialidad:(listaDeEspecialidadesSelect.length===0)?null:datosReposotTrabajador.id_asignacion_medico_especialidad,
            //         listaDeMedico:listasDeMedicosSelect,
            //         fecha_desde_reposo_trabajador:Moment(datosReposotTrabajador.fecha_desde_reposo_trabajador).format("YYYY-MM-DD"),
            //         fecha_hasta_reposo_trabajador:datosReposotTrabajador.fecha_hasta_reposo_trabajador,
            //         descripcion_reposo_trabajador:datosReposotTrabajador.descripcion_reposo_trabajador,
            //         estatu_reposo_trabajador:datosReposotTrabajador.estatu_reposo_trabajador
            //     })
            //     // document.getElementById("fecha_desde_reposo_trabajador").value=Moment(datosReposotTrabajador.fecha_desde_reposo_trabajador).format("DD-MM-YYYY")

            // }
        }

    }

    async buscarTrabajador(a){
        const input=a.target,
        exprecion=/[0-9]$/
        if(exprecion.test(input.value)){
            // console.log("OK")
            if(input.value.length<=8){
                this.cambiarEstado(a)
                let hashTrabajador=JSON.parse(JSON.stringify(this.state.hashTrabajador))
                if(hashTrabajador[input.value]){
                    this.setState({
                        estadoBusquedaTrabajador:true
                    })
                    await this.consultarReposoActivoTrabajador(input.value)
                }
                else{
                    // console.log("NO OK")
                    this.setState({
                        estadoBusquedaTrabajador:false
                    })
                }
            }
            else{
                document.getElementById("boton-registrar").setAttribute("disabled",true)
            }
        }
        else if(input.value===""){
            this.cambiarEstado(a)
        }
    }

    async consultarReposoActivoTrabajador(id_cedula){
        await axios.get(`http://localhost:8080/transaccion/reposo-trabajador/consultar-reposo-activos/${id_cedula}`)
        .then(respuesta => {
            let json=JSON.parse(JSON.stringify(respuesta.data))
            if(json.estado===true){
                alert(`èste trabajador =>>> ${id_cedula} tiene un reposo activo`)
                document.getElementById("boton-registrar").setAttribute("disabled",true)
            }
            else{
                document.getElementById("boton-registrar").removeAttribute("disabled")
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
    

    async consultarReposoTrabajador(id){
        let mensaje={texto:"",estado:""}
        let datos=null
        const token=localStorage.getItem('usuario')
        await axios.get(`http://localhost:8080/transaccion/reposo-trabajador/consultar/${id}/${token}`)
        .then(respuesta => {
            let json=JSON.parse(JSON.stringify(respuesta.data))
            if(json.estado_peticion==="200"){
                datos=json.reposo_trabajador
            }
            else if(json.estado_peticion==="404"){
                mensaje.texto=json.mensaje
                mensaje.estado=json.estado_peticion
                this.props.history.push(`/dashboard/transaccion/reposo-trabajador${JSON.stringify(mensaje)}`)
            }

        })
        .catch(error => {
            // console.log(error)
            mensaje.texto="error al conectar con el servidor"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/transaccion/reposo-trabajador${JSON.stringify(mensaje)}`)
        })
        return datos
    }

    async generarId(){
        let id=null
        await axios.get("http://localhost:8080/transaccion/reposo-trabajador/generar-id")
        .then(respuesta => {
            id=respuesta.data.id
        })
        .catch(error => {
            console.error(error)
        })
        return id
    }

    async consultarTodosTrabajadores(){
        let respuesta_servidor=null
        await axios.get("http://localhost:8080/configuracion/trabajador/consultar-todos")
        .then(respuesta=>{
            respuesta_servidor=respuesta.data.trabajadores
            let trabajadoresActivos=respuesta_servidor.filter(trabajador => trabajador.estatu_trabajador==="1")
            let hashTrabajador={}
            for(let trabajador of trabajadoresActivos){
                hashTrabajador[trabajador.id_cedula]=trabajador
            }
            this.setState({hashTrabajador})
            // console.log(respuesta.data)
        })
        .catch(error=>{
            alert("No se pudo conectar con el servidor")
            console.log(error)
        })
        return respuesta_servidor;
    }

    async consultarTodosReposo(){
        let respuesta_servidor=null
        await axios.get("http://localhost:8080/configuracion/reposo/consultar-todos")
        .then(respuesta=>{
            respuesta_servidor=respuesta.data.reposos
            let listaDeRepososActivos= respuesta_servidor.filter(reposo => reposo.estatu_reposo==="1")
            let listaDeReposoSelect=[];
            for(let reposo of listaDeRepososActivos){
                    listaDeReposoSelect.push({
                        id:reposo.id_reposo,
                        descripcion:reposo.nombre_reposo
                    })
            }
            this.setState({
                listaDeRepososActivos:listaDeReposoSelect,
                id_reposo:(listaDeReposoSelect.length===0)?null:listaDeReposoSelect[0].id
            })
        })
        .catch(error=>{
            alert("No se pudo conectar con el servidor")
            console.log(error)
        })
        return respuesta_servidor;
    }

    async consultarTodosLosCam(){
        let datos=null
        await axios.get("http://localhost:8080/configuracion/cam/consultar-todos")
        .then(async respuesta => {
            datos=respuesta.data.cams
            let listaDeCamActivos=datos.filter( cam => cam.estatu_cam==="1")
            let listaDeCamSelect=[]
            let camTablaHash={}
            for(let cam of listaDeCamActivos){
                    listaDeCamSelect.push({
                    id:cam.id_cam,
                    descripcion:cam.nombre_cam
                })
                camTablaHash[cam.id_cam]=cam
                camTablaHash[cam.id_cam]["ciudad"]=await this.consultarCiudad(camTablaHash[cam.id_cam].id_ciudad)
                camTablaHash[cam.id_cam]["estado"]=await this.consultarEstado(camTablaHash[cam.id_cam].ciudad.id_estado)
                camTablaHash[cam.id_cam]["tipoCam"]=await this.consultarTipoCam(camTablaHash[cam.id_cam].id_tipo_cam)
            }
            this.setState({
                listaDeCamsActivos:listaDeCamSelect,
                listaDeCams:camTablaHash,
                id_cam:(listaDeCamSelect.length===0)?null:listaDeCamSelect[0].id,
                infoCam:(listaDeCamSelect.length===0)?null:camTablaHash[listaDeCamSelect[0].id],
            })
        })
        .catch(error => {
            alert("No se pudo conectar con el servidor")
            console.log(error)
        })

        return datos
    }

    async consultarCiudad(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        var ciudad={}
        const token=localStorage.getItem('usuario')
        await axios.get(`http://localhost:8080/configuracion/ciudad/consultar/${id}/${token}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            ciudad=respuesta_servidor.ciudad

        })
        .catch(error=>{
            console.log(error)
            // mensaje.texto="No se puedo conectar con el servidor"
            // mensaje.estado="500"
            // this.props.history.push(`/dashboard/configuracion/cam${JSON.stringify(mensaje)}`)
        })
        return ciudad
    }

    async consultarEstado(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        let estado=null
        const token=localStorage.getItem('usuario')
        await axios.get(`http://localhost:8080/configuracion/estado/consultar/${id}/${token}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            estado=respuesta_servidor.estado

        })
        .catch(error=>{
            console.log(error)
            // mensaje.texto="No se puedo conectar con el servidor"
            // mensaje.estado="500"
            // this.props.history.push(`/dashboard/configuracion/cam${JSON.stringify(mensaje)}`)
        })
        return estado
    }

    async consultarTipoCam(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        let tipoCam=null
        const token=localStorage.getItem('usuario')
        await axios.get(`http://localhost:8080/configuracion/tipo-cam/consultar/${id}/${token}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            tipoCam=respuesta_servidor.tipo_cam

        })
        .catch(error=>{
            console.log(error)
            // mensaje.texto="No se puedo conectar con el servidor"
            // mensaje.estado="500"
            // this.props.history.push(`/dashboard/configuracion/cam${JSON.stringify(mensaje)}`)
        })
        return tipoCam
    }

    async consultarTodasEspecialidad(){
        var respuesta_servidor=null
        await axios.get("http://localhost:8080/configuracion/especialidad/consultar-todos")
        .then(async respuesta=>{
            respuesta_servidor=respuesta.data.especialidades
            // console.log(respuesta.data)
            // console.log("listas de especialidades =>>> ",listaDeEspecialidades)
            let listaDeEspecialidadesActivas=respuesta_servidor.filter(especialidad => especialidad.estatu_especialidad==="1")
            console.log("listas de especialidades activas =>>> ",listaDeEspecialidadesActivas)
            let listaDeEspecialidadesSelect=[]
            let asigancionTablaHash={}
            for(let especialidad of listaDeEspecialidadesActivas){
                listaDeEspecialidadesSelect.push({
                    id:especialidad.id_especialidad,
                    descripcion:especialidad.nombre_especialidad
                })
                asigancionTablaHash[especialidad.id_especialidad]=especialidad
            }
            if(listaDeEspecialidadesActivas.length!==0){
                asigancionTablaHash[listaDeEspecialidadesSelect[0].id]["asignacion"]=await this.consultarSignacionesPorEspecialidad(listaDeEspecialidadesSelect[0].id)
            }
            let listasDeMedicosSelect=[]
            if(asigancionTablaHash[listaDeEspecialidadesSelect[0].id]){
                for(let asignacion of asigancionTablaHash[listaDeEspecialidadesSelect[0].id]["asignacion"]){
                    listasDeMedicosSelect.push({
                        id:asignacion.id_asignacion_medico_especialidad,
                        descripcion:asignacion.nombre_medico+" "+asignacion.apellido_medico
                    })
                }
            }
            this.setState({
                listaDeEspecialidadActivos:listaDeEspecialidadesSelect,
                id_especialidad:(listaDeEspecialidadesSelect.length===0)?null:listaDeEspecialidadesSelect[0].id,
                listaDeAsignaciones:asigancionTablaHash,
                id_asignacion_medico_especialidad:(listaDeEspecialidadesSelect.length===0)?null:asigancionTablaHash[listaDeEspecialidadesSelect[0].id]["asignacion"][0].id_asignacion_medico_especialidad,
                listaDeMedico:listasDeMedicosSelect
            })
        })
        .catch(error=>{
            alert("No se pudo conectar con el servidor")
            console.log(error)
        })
        return respuesta_servidor;
    }

    cambiarEstado(a){
        var input=a.target;
        this.setState({[input.name]:input.value})
    }

    async mostrarAsignacionMedico(a){
        let input = a.target 
        this.cambiarEstado(a)
        let asiganciones=await this.consultarSignacionesPorEspecialidad(input.value)
        console.log("lista de asignaciones por especialidad =>>> ",asiganciones)
        let listaDeAsignaciones=JSON.parse(JSON.stringify(this.state.listaDeAsignaciones))
        // let especialidad=JSON.parse(JSON.stringify(listaDeAsignaciones[this.state.id_especialidad]))
        listaDeAsignaciones[input.value]["asignacion"]=asiganciones
        let listasDeMedicosSelect=[]
        if (listaDeAsignaciones[input.value]){
            for(let asignacion of listaDeAsignaciones[input.value]["asignacion"]){
                listasDeMedicosSelect.push({
                id:asignacion.id_asignacion_medico_especialidad,
                descripcion:asignacion.nombre_medico+" "+asignacion.apellido_medico
                })
            }
        }
        
        this.setState({
            listaDeAsignaciones,
            id_asignacion_medico_especialidad:listaDeAsignaciones[input.value]["asignacion"].id_asignacion_medico_especialidad,
            listaDeMedico:listasDeMedicosSelect
        })
        
    }

    async consultarSignacionesPorEspecialidad(id){
        let datos=null
        await axios.get(`http://localhost:8080/configuracion/asignacion-medico-especialidad/consultar-asignacion-por-especialidad/${id}`)
        .then(repuesta => {
            datos=repuesta.data.medico_especialidad
        })
        .catch(error => {
            alert("No se pudo conectar con el servidor")
            console.log(error)
        })
        return datos
    }

    async agregar(){
        // let idRegistro=await this.generarId()
        // let listaDeTrabajadores=await this.consultarTodosTrabajadores();
        // let listaDetrabajadoresActivos=listaDeTrabajadores.filter( trabajador =>  trabajador.estatu_trabajador==="1" && trabajador.estatu_cuenta==="1")
        // let listaDeTrabajadoresSelect=[]
        // for(let trabajador of listaDetrabajadoresActivos){
        //     listaDeTrabajadoresSelect.push({
        //         id:trabajador.id_cedula,
        //         descripcion:trabajador.id_cedula+" - "+trabajador.nombres+" "+trabajador.apellidos
        //     })
        // }
        // // ----- reposo
        // let listaDeTodosLosReposos=await this.consultarTodosReposo()
        // let listaDeRepososActivos= listaDeTodosLosReposos.filter(reposo => reposo.estatu_reposo==="1")
        // let listaDeReposoSelect=[];
        // let reposoTablaHash={}
        // for(let reposo of listaDeRepososActivos){
        //     listaDeReposoSelect.push({
        //         id:reposo.id_reposo,
        //         descripcion:reposo.nombre_reposo
        //     })
        //     reposoTablaHash[reposo.id_reposo]={dias:reposo.dias_reposo}
        // }
        // // -------- cam
        // let listaDeTodosLosCam=await this.consultarTodosLosCam()
        // let listaDeCamActivos=listaDeTodosLosCam.filter( cam => cam.estatu_cam==="1")
        // let listaDeCamSelect=[]
        // let camTablaHash={}
        // for(let cam of listaDeCamActivos){
        //     listaDeCamSelect.push({
        //         id:cam.id_cam,
        //         descripcion:cam.nombre_cam
        //     })
        //     camTablaHash[cam.id_cam]=cam
        // }
        // if(listaDeCamSelect.length!==0){
        //     camTablaHash[listaDeCamSelect[0].id]["ciudad"]=await this.consultarCiudad(camTablaHash[listaDeCamSelect[0].id].id_ciudad)
        //     camTablaHash[listaDeCamSelect[0].id]["estado"]=await this.consultarEstado(camTablaHash[listaDeCamSelect[0].id].ciudad.id_estado)
        //     camTablaHash[listaDeCamSelect[0].id]["tipoCam"]=await this.consultarTipoCam(camTablaHash[listaDeCamSelect[0].id].id_tipo_cam)
        // }
        // // ------ asignaciones medico
        // let listaDeEspecialidades= await this.consultarTodasEspecialidad()
        // // console.log("listas de especialidades =>>> ",listaDeEspecialidades)
        // let listaDeEspecialidadesActivas=listaDeEspecialidades.filter(especialidad => especialidad.estatu_especialidad==="1")
        // console.log("listas de especialidades activas =>>> ",listaDeEspecialidadesActivas)
        // let listaDeEspecialidadesSelect=[]
        // let asigancionTablaHash={}
        // for(let especialidad of listaDeEspecialidadesActivas){
        //     listaDeEspecialidadesSelect.push({
        //         id:especialidad.id_especialidad,
        //         descripcion:especialidad.nombre_especialidad
        //     })
        //     asigancionTablaHash[especialidad.id_especialidad]=especialidad
        // }
        // if(listaDeEspecialidadesActivas.length!==0){
        //     asigancionTablaHash[listaDeEspecialidadesSelect[0].id]["asignacion"]=await this.consultarSignacionesPorEspecialidad(listaDeEspecialidadesSelect[0].id)
        // }
        // let listasDeMedicosSelect=[]
        // if(asigancionTablaHash[listaDeEspecialidadesSelect[0].id]){
        //     for(let asignacion of asigancionTablaHash[listaDeEspecialidadesSelect[0].id]["asignacion"]){
        //         listasDeMedicosSelect.push({
        //         id:asignacion.id_asignacion_medico_especialidad,
        //         descripcion:asignacion.nombre_medico+" "+asignacion.apellido_medico
        //         })
        //     }
        // }
        // this.setState({
        //     id_reposo_trabajador:idRegistro,
        //     listaDeTrabajadoresActivos:listaDeTrabajadoresSelect,
        //     id_cedula:(listaDeTrabajadoresSelect.length===0)?null:listaDeTrabajadoresSelect[0].id,
        //     listaDeRepososActivos:listaDeReposoSelect,
        //     id_reposo:(listaDeReposoSelect.length===0)?null:listaDeReposoSelect[0].id,
        //     listaDeReposos:reposoTablaHash,
        //     dias_reposo:(listaDeReposoSelect.length===0)?null:reposoTablaHash[listaDeReposoSelect[0].id].dias,
        //     listaDeCams:camTablaHash,
        //     listaDeCamsActivos:listaDeCamSelect,
        //     id_cam:(listaDeCamSelect.length===0)?null:listaDeCamSelect[0].id,
        //     infoCam:(listaDeCamSelect.length===0)?null:camTablaHash[listaDeCamSelect[0].id],
        //     listaDeEspecialidadActivos:listaDeEspecialidadesSelect,
        //     id_especialidad:(listaDeEspecialidadesSelect.length===0)?null:listaDeEspecialidadesSelect[0].id,
        //     listaDeAsignaciones:asigancionTablaHash,
        //     id_asignacion_medico_especialidad:(listaDeEspecialidadesSelect.length===0)?null:asigancionTablaHash[listaDeEspecialidadesSelect[0].id]["asignacion"][0].id_asignacion_medico_especialidad,
        //     listaDeMedico:listasDeMedicosSelect,
        //     fecha_desde_reposo_trabajador:"",
        //     fecha_hasta_reposo_trabajador:"",
        //     descripcion_reposo_trabajador:"",
        //     estatu_reposo_trabajador:"1"
        // })
        // // console.log(asigancionTablaHash[listaDeEspecialidadesSelect[0].id]["asignacion"][0].id_asignacion_medico_especialidad)
        // document.getElementById("id_cedula").value=(listaDeTrabajadoresSelect.length===0)?null:listaDeTrabajadoresSelect[0].id
        // document.getElementById("id_reposo").value=(listaDeReposoSelect.length===0)?null:listaDeReposoSelect[0].id
        // document.getElementById("id_cam").value=(listaDeCamSelect.length===0)?null:listaDeCamSelect[0].id
        // document.getElementById("id_especialidad").value=(listaDeEspecialidadesSelect.length===0)?null:listaDeEspecialidadesSelect[0].id
        // document.getElementById("id_asignacion_medico_especialidad").value=(listaDeEspecialidadesSelect.length===0)?null:asigancionTablaHash[listaDeEspecialidadesSelect[0].id]["asignacion"][0].id_asignacion_medico_especialidad
        // this.props.history.push("/dashboard/transaccion/reposo-trabajador/registrar")
    }

    mostarDias(a){
        let input=a.target
        this.cambiarEstado(a)
        this.setState({
            dias_reposo:this.state.listaDeReposos[input.value].dias
        })
        if(this.state.fecha_desde_reposo_trabajador!==""){
            // alert("si")
            let dias=parseInt(this.state.listaDeReposos[input.value].dias)
            let fechaHasta=Moment(this.state.fecha_desde_reposo_trabajador)
            fechaHasta.add(dias,"days")
            this.setState({
                fecha_hasta_reposo_trabajador:fechaHasta
            })
        }

    }

    async mostrarDatosCam(a){
        let input=a.target
        this.cambiarEstado(a)
        let cam=this.state.listaDeCams[input.value]
        console.log(cam)
        // cam["ciudad"]=await this.consultarCiudad(cam.id_ciudad)
        // cam["estado"]=await this.consultarEstado(cam.ciudad.id_estado)
        // cam["tipoCam"]=await this.consultarTipoCam(cam.id_tipo_cam)
        this.setState({
            infoCam:cam
        })
    }

    mostrarFechaHasta(a){
        let input=a.target
        this.cambiarEstado(a)
        // alert(this.state.dias_reposo)
        if(this.state.total_dias_reposo_trabajador!==""){
            let sumaDias=(this.state.total_dias_reposo_trabajador==="")?0:parseInt(this.state.total_dias_reposo_trabajador)
            let fecha_hasta=Moment(input.value)
            let fecha_inicio_entrega=Moment(input.value)
            fecha_hasta.add(sumaDias,"days")
            fecha_inicio_entrega.add(1,"days")
            while(fecha_inicio_entrega.format("dd")==="Su" || fecha_inicio_entrega.format("dd")==="Sa"){
                fecha_inicio_entrega.add(1,"days")
            }
            let fecha_fin_entrega=Moment(fecha_inicio_entrega.format("YYYY-MM-DD"),"YYYY-MM-DD")
            let totalDias=this.state.diasParaEntregarReposo
            let diasNoAviles=0
            let cont=0
            
            while(cont<totalDias || (fecha_fin_entrega.format("dd")==="Su" || fecha_fin_entrega.format("dd")==="Sa")){
                if(fecha_fin_entrega.format("dd")==="Su" || fecha_fin_entrega.format("dd")==="Sa"){
                    fecha_fin_entrega.add(1,"days");
                    diasNoAviles++
                }
                else{
                    // totalDias--
                    cont++
                    fecha_fin_entrega.add(1,"days");
                }
            }
            // fecha_fin_entrega.add((this.state.diasParaEntregarReposo+((this.state.total_dias_no_aviles_reposo_trabajador==="")?0:parseInt(this.state.total_dias_no_aviles_reposo_trabajador))),"days")
            // alert(fecha_hasta)
            this.setState({
                fecha_hasta_reposo_trabajador:fecha_hasta,
                fecha_desde_entrega_reposo_trabajador:fecha_inicio_entrega,
                fecha_hasta_entrega_reposo_trabajador:fecha_fin_entrega,
                total_dias_no_aviles_reposo_trabajador:diasNoAviles,
                diasNoAviles
            })
        }
        else{
            alert("por favor selecione un reposo")
        }
    }

    validarSelectNull(valorSelect){
        let estado=false;
        let msj=JSON.parse(JSON.stringify(this.state["msj_"+valorSelect]));
        if(this.state["id_"+valorSelect]!==null){
            estado = true
            msj.mensaje="";
            msj.color_texto="";
            this.setState({["msj_"+valorSelect]:msj})
        }
        else{
            msj.mensaje="este combo esta vacio por favor inserte datos primero en el modulo de "+valorSelect+" para poder continuar";
            msj.color_texto="rojo";
            this.setState({["msj_"+valorSelect]:msj})
        }
        return estado;

    }

    validarFechaDesde(){
        let estado=false
        let fechaDesde=document.getElementById("fecha_desde_reposo_trabajador").value
        let msj=JSON.parse(JSON.stringify(this.state["msj_fecha_desde_reposo_trabajador"]));
        if(fechaDesde!=="" && this.state.total_dias_reposo_trabajador!==null){
            estado=true
            msj.mensaje="";
            msj.color_texto="";
            this.setState({["msj_fecha_desde_reposo_trabajador"]:msj})
        }
        else{
            msj.mensaje="este campo no puede estar vacio";
            msj.color_texto="rojo";
            this.setState({["msj_fecha_desde_reposo_trabajador"]:msj})
        }
        return estado
    }

    validarDetalleDelReposo(){
        let estado=false;
        let $inputDireccion=document.getElementById("descripcion_reposo_trabajador");
        let msj_descripcion_reposo_trabajador=JSON.parse(JSON.stringify(this.state.msj_descripcion_reposo_trabajador));
        const exprecion1=/[a-zA-Z]|[0-9]/g;
        if($inputDireccion.value!==""){

            if(exprecion1.test($inputDireccion.value)){
                estado = true;
                msj_descripcion_reposo_trabajador.mensaje="";
                msj_descripcion_reposo_trabajador.color_texto="";
                this.setState({msj_descripcion_reposo_trabajador});

            }
            else{
                msj_descripcion_reposo_trabajador.mensaje="este campo no permite espacios en blanco";
                msj_descripcion_reposo_trabajador.color_texto="rojo";
                this.setState({msj_descripcion_reposo_trabajador});
            }
        }
        else{
            msj_descripcion_reposo_trabajador.mensaje="esta campo no puede estar vacio";
            msj_descripcion_reposo_trabajador.color_texto="rojo";
            this.setState({msj_descripcion_reposo_trabajador});
        }

        return estado
    }

    validarFormulario(){
        let estado=false
        let validacionCedulaTrabajador=this.validarSelectNull("cedula")
        let validacionReposo=this.validarSelectNull("reposo")
        let validacionCam=this.validarSelectNull("cam")
        let validacionAsignacion=this.validarSelectNull("asignacion_medico_especialidad")
        let validacionFechaDesde=this.validarFechaDesde()
        let validacionDetalle=this.validarDetalleDelReposo()
        if(validacionCedulaTrabajador && validacionReposo && validacionCam && validacionAsignacion && validacionFechaDesde && validacionDetalle){
            estado =true
        }
        return estado

    }

    operacion(){
        // alert("operacion")
        let alerta=JSON.parse(JSON.stringify(this.state.alerta))
        const token=localStorage.getItem('usuario')
        const {operacion}=this.props.match.params
        if(this.validarFormulario()){
            // alert("ok al validar el formulario")
            let datosFormulario=new FormData(document.getElementById("formulario_reposo_trabajador"))
            let datos={
                reposo_trabajador:this.extrarDatosDelFormData(datosFormulario),
                token
            }
            
            datos.reposo_trabajador["fecha_hasta_reposo_trabajador"]=Moment(this.state.fecha_hasta_reposo_trabajador).format("YYYY-MM-DD")
            console.log("datos que se enviaran al servidor =>>> ",datos)

            // if(operacion==="registrar"){
            //     // alert("registrando")
            //     axios.post("http://localhost:8080/transaccion/reposo-trabajador/registrar",datos)
            //     .then(respuesta => {
            //         let json=JSON.parse(JSON.stringify(respuesta.data))
            //         console.log("repuesta =>>> ",json)
            //         if(json.estado_peticion==="200"){
            //             alerta.estado=true
            //             alerta.color="success"
            //             alerta.mensaje=json.mensaje
            //             this.setState({alerta})
            //         }
            //         else{
            //             alerta.estado=true
            //             alerta.color="danger"
            //             alerta.mensaje=json.mensaje
            //             this.setState({alerta})
            //         }
            //     })
            //     .catch(error => {
            //         console.log(error)
            //         alerta.estado=true
            //         alerta.color="danger"
            //         alerta.mensaje="error al conectar con el servidor"
            //         this.setState({alerta})
            //     })
            // }
            // else if(operacion==="actualizar"){
            //     // alert("actualizando")
            //     let {id} = this.props.match.params
            //     axios.put(`http://localhost:8080/transaccion/reposo-trabajador/actualizar/${id}`,datos)
            //     .then(respuesta => {
            //         let json=JSON.parse(JSON.stringify(respuesta.data))
            //         console.log("repuesta =>>> ",json)
            //         if(json.estado_peticion==="200"){
            //             alerta.estado=true
            //             alerta.color="success"
            //             alerta.mensaje=json.mensaje
            //             this.setState({alerta})
            //         }
            //         else{
            //             alerta.estado=true
            //             alerta.color="danger"
            //             alerta.mensaje=json.mensaje
            //             this.setState({alerta})
            //         }
            //     })
            //     .catch(error => {
            //         console.log(error)
            //         alerta.estado=true
            //         alerta.color="danger"
            //         alerta.mensaje="error al conectar con el servidor"
            //         this.setState({alerta})
            //     })
            // }

        }
    }

    extrarDatosDelFormData(formData){
        let json={}
        let iterador = formData.entries()
        let next= iterador.next();
        while(!next.done){
            json[next.value[0]]=next.value[1]
            next=iterador.next()
        }
        return json   
    }

    

    regresar(){
        this.props.history.push("/dashboard/transaccion/reposo-trabajador")
    }

    campoDiasReposo(a){
        let input=a.target
        if(/[0-9]$/.test(input.value)){
            if(input.value.length<=3){
                this.cambiarEstado(a)
            }
        }
        else{
            if(input.value===""){
                this.cambiarEstado(a)
            }
        }
    }

    campoDiasNoAvilesReposo(a){
        let input=a.target
        if(/[0-9]$/.test(input.value)){
            if(input.value.length<=3){
                this.cambiarEstado(a)
            }
        }
        else{
            if(input.value===""){
                this.cambiarEstado(a)
            }
        }
        // if(input.value!==""){
        //     if(this.state.fecha_desde_reposo_trabajador!==""){
        //         let fecha=Moment(this.state.fecha_desde_entrega_reposo_trabajador.format("YYYY-MM-DD"),"YYYY-MM-DD")
        //         let suma=this.state.diasParaEntregarReposo
        //         let diasNoAvilesUsuario=((parseInt(input.value)-this.state.diasNoAviles>0)?parseInt(input.value)-this.state.diasNoAviles:0)
        //         console.clear()
        //         let diasNoAviles=0
        //         let cont=0
        //         let n=0
        //         while(cont<suma || (fecha.format("dd")==="Su" || fecha.format("dd")==="Sa")){
        //             if(fecha.format("dd")==="Su" || fecha.format("dd")==="Sa"){
        //                 fecha.add(1,"days");
        //                 diasNoAviles++
        //             }
        //             else{
        //                 if(diasNoAvilesUsuario>0){
        //                     diasNoAvilesUsuario--
        //                     diasNoAviles++
        //                     fecha.add(1,"days");
        //                 }
        //                 else{
        //                     cont++
        //                     fecha.add(1,"days");
        //                 }
        //             }
        //             n++
        //         }
        //         console.log(n)
        //         console.log(cont)
        //         console.log(diasNoAviles)
        //         document.getElementById("total_dias_no_aviles_reposo_trabajador").removeAttribute("disabled")
        //         this.setState({
        //             total_dias_no_aviles_reposo_trabajador:diasNoAviles,
        //         })
        //         this.setState({
        //             fecha_hasta_entrega_reposo_trabajador:fecha,
        //             // total_dias_no_aviles_reposo_trabajador:diasNoAviles,
        //         })
        //     }
        // }
        
    }

    calcularDiasNoAviles(){
        // let numeroDiasNoAviles=this.state.total_dias_no_aviles_reposo_trabajador
        for(let contador=0;contador<2;contador++){
            // this.setState({total_dias_no_aviles_reposo_trabajador:numeroDiasNoAviles})
            if(this.state.total_dias_no_aviles_reposo_trabajador!==""){
                if(this.state.fecha_desde_reposo_trabajador!==""){
                    let fecha=Moment(this.state.fecha_desde_entrega_reposo_trabajador.format("YYYY-MM-DD"),"YYYY-MM-DD")
                    let suma=this.state.diasParaEntregarReposo
                    let diasNoAvilesUsuario=((parseInt(this.state.total_dias_no_aviles_reposo_trabajador)-this.state.diasNoAviles>0)?parseInt(this.state.total_dias_no_aviles_reposo_trabajador)-this.state.diasNoAviles:0)
                    console.clear()
                    let diasNoAviles=0
                    let diasNoAvilesAgregados=0
                    let cont=0
                    // let n=0
                    while(cont<suma || (fecha.format("dd")==="Su" || fecha.format("dd")==="Sa")){
                        if(fecha.format("dd")==="Su" || fecha.format("dd")==="Sa"){
                            fecha.add(1,"days");
                            diasNoAviles++
                        }
                        else{
                            if(diasNoAvilesUsuario>0){
                                diasNoAvilesUsuario--
                                // diasNoAviles++
                                diasNoAvilesAgregados++
                                fecha.add(1,"days");
                            }
                            else{
                                cont++
                                fecha.add(1,"days");
                            }
                        }
                        // n++
                    }
                    // console.log(n)
                    console.log(cont)
                    console.log(diasNoAviles)
                    console.log(diasNoAvilesAgregados)
                    console.log(diasNoAviles+diasNoAvilesAgregados)
                    let sumaDiasNoAviles=diasNoAviles+diasNoAvilesAgregados
                    this.setState({
                        total_dias_no_aviles_reposo_trabajador:sumaDiasNoAviles,
                        diasNoAviles
                    })
                    this.setState({
                        fecha_hasta_entrega_reposo_trabajador:fecha,
                        // total_dias_no_aviles_reposo_trabajador:diasNoAviles,
                    })
                }
            }
        }
    }

    render(){

        const component=(
            <div className="row justify-content-center">
                {this.state.alerta.estado===true &&
                    (<div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">

                        <AlertBootstrap colorAlert={this.state.alerta.color} mensaje={this.state.alerta.mensaje}/>
                        
                    </div>)
                }
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_formulario_reposo_trabajador">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-reposo-trabajador">
                            <span className="titulo-form-reposo-trabajador">Formulario reposo trabajador</span>
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
                    <form  id="formulario_reposo_trabajador" >
                        <div className="row justify-content-center">
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            nombreCampo="Codigo transacción:"
                            activo="no"
                            type="text"
                            value={this.state.id_reposo_trabajador}
                            name="id_reposo_trabajador"
                            id="id_reposo_trabajador"
                            placeholder="Codigo reposo"
                            />
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 offset-3 offset-sm-3 offset-md-3 offset-lg-3 offset-xl-3"></div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-reposo-trabajador">
                                <span className="sub-titulo-form-reposo-trabajador">Trabajador</span>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            obligatorio="si"
                            mensaje={this.state.msj_id_cedula}
                            nombreCampo="Cedula:"
                            activo="si"
                            type="text"
                            value={this.state.id_cedula}
                            name="id_cedula"
                            id="id_cedula"
                            placeholder="CEDULA"
                            eventoPadre={this.buscarTrabajador}
                            />
                            <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6"></div>
                        </div>



                        <div className="row mt-3">
                            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-reposo-trabajador">
                                <span className="sub-titulo-form-reposo-trabajador">Reposo</span>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                                <ComponentFormSelect
                                clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                                obligatorio="si"
                                mensaje={this.state.msj_reposo}
                                nombreCampoSelect="Lista de reposos:"
                                clasesSelect="custom-select"
                                name="id_reposo"
                                id="id_reposo"
                                eventoPadre={this.cambiarEstado}
                                defaultValue={this.state.id_reposo}
                                option={this.state.listaDeRepososActivos}
                                />

                                <ComponentFormCampo
                                clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 offset-3 offset-sm-3 offset-md-3 offset-lg-3 offset-xl-3"
                                clasesCampo="form-control"
                                obligatorio="si"
                                mensaje={this.state.msj_total_dias_reposo_trabajador}
                                nombreCampo="Dias de Reposo:"
                                activo="si"
                                type="text"
                                value={this.state.total_dias_reposo_trabajador}
                                name="total_dias_reposo_trabajador"
                                id="total_dias_reposo_trabajador"
                                placeholder="Dias"
                                eventoPadre={this.campoDiasReposo}
                                />
                        </div>

                        <div className="row mt-3">
                            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-reposo-trabajador">
                                <span className="sub-titulo-form-reposo-trabajador">Cam</span>
                            </div>                            
                        </div>
                        <div className="row justify-content-center">
                                <ComponentFormSelect
                                clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                                obligatorio="si"
                                mensaje={this.state.msj_cam}
                                nombreCampoSelect="Lista de CAM:"
                                clasesSelect="custom-select"
                                name="id_cam"
                                id="id_cam"
                                eventoPadre={this.mostrarDatosCam}
                                defaultValue={this.state.id_cam}
                                option={this.state.listaDeCamsActivos}
                                />
                            
                                <div className="diasReposo col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 offset-3 offset-sm-3 offset-md-3 offset-lg-3 offset-xl-3"></div>
                        </div>
                        {this.state.id_cam!==null &&
                            (
                                <div>
                                    <div className="row justify-content-center">
                                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">Telefono: {this.state.infoCam.telefono_cam}</div>
                                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 offset-3 offset-sm-3 offset-md-3 offset-lg-3 offset-xl-3">Tipo de centro: {this.state.infoCam.tipoCam.nombre_tipo_cam}</div>
                                    </div>
                                    <div className="row mt-3 justify-content-center">
                                        <div className="col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9">Ubicación: Esta ubicado en el estado {this.state.infoCam.estado.nombre_estado}, en la ciudad de {this.state.infoCam.ciudad.nombre_ciudad}</div>
                                    </div>
                                    <div className="row mt-3 justify-content-center">
                                        <div className="col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9">Dirección: {this.state.infoCam.direccion_cam}</div>
                                    </div>
                                    
                                </div>
                            )
                        }
                        




                        <div className="row mt-3">
                            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-reposo-trabajador">
                                <span className="sub-titulo-form-reposo-trabajador">Medico</span>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormSelect
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            obligatorio="si"
                            mensaje={this.state.msj_especialidad}
                            nombreCampoSelect="Lista de especialidades:"
                            clasesSelect="custom-select"
                            name="id_especialidad"
                            id="id_especialidad"
                            eventoPadre={this.mostrarAsignacionMedico}
                            defaultValue={this.state.id_especialidad}
                            option={this.state.listaDeEspecialidadActivos}
                            />
                            <ComponentFormSelect
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xl-3 offset-3 offset-sm-3 offset-md-3 offset-lg-3 offset-xl-3"
                            obligatorio="si"
                            mensaje={this.state.msj_asignacion_medico_especialidad}
                            nombreCampoSelect="Lista de medicos:"
                            clasesSelect="custom-select"
                            name="id_asignacion_medico_especialidad"
                            id="id_asignacion_medico_especialidad"
                            eventoPadre={this.cambiarEstado}
                            defaultValue={this.state.id_asignacion_medico_especialidad}
                            option={this.state.listaDeMedico}
                            />
                        </div>

                        <div className="row mt-3">
                            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-reposo-trabajador">
                                <span className="sub-titulo-form-reposo-trabajador">Detalles</span>
                            </div>
                        </div>
                        
                        <div className="row justify-content-center">
                            <ComponentFormDate
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            obligatorio="si"
                            mensaje={this.state.msj_fecha_desde_reposo_trabajador}
                            nombreCampoDate="Fecha Inicio Reposo:"
                            clasesCampo="form-control"
                            value={this.state.fecha_desde_reposo_trabajador}
                            name="fecha_desde_reposo_trabajador"
                            id="fecha_desde_reposo_trabajador"
                            eventoPadre={this.mostrarFechaHasta}
                            />
                            <div className="diasReposo col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 offset-3 offset-sm-3 offset-md-3 offset-lg-3 offset-xl-3">
                                Fecha Fin Reposo: {(this.state.fecha_hasta_reposo_trabajador==="")?"":Moment(this.state.fecha_hasta_reposo_trabajador).format("DD-MM-YYYY")}
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            obligatorio="si"
                            mensaje={this.state.msj_total_dias_reposo_trabajador}
                            nombreCampo="Dias no aviles:"
                            activo="si"
                            type="text"
                            value={this.state.total_dias_no_aviles_reposo_trabajador}
                            name="total_dias_no_aviles_reposo_trabajador"
                            id="total_dias_no_aviles_reposo_trabajador"
                            placeholder="Dias"
                            eventoPadre={this.campoDiasNoAvilesReposo}
                            />
                            <div className=" col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 offset-3 offset-sm-3 offset-md-3 offset-lg-3 offset-xl-3">
                                <buttom className="boton-calcular-dias-aviles btn btn-success" onClick={this.calcularDiasNoAviles}>
                                    calcular dias
                                </buttom>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="diasReposo col-3 col-sm-3 col-md-3 col-lg-3">
                                Fecha Inicio Entrega: {(this.state.fecha_desde_entrega_reposo_trabajador==="")?"":Moment(this.state.fecha_desde_entrega_reposo_trabajador).format("DD-MM-YYYY")}
                            </div>
                            <div className="diasReposo col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 offset-3 offset-sm-3 offset-md-3 offset-lg-3 offset-xl-3">
                                Fecha Fin Entrega: {(this.state.fecha_hasta_entrega_reposo_trabajador==="")?"":Moment(this.state.fecha_hasta_entrega_reposo_trabajador).format("DD-MM-YYYY")}
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormTextArea
                            clasesColumna="col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9"
                            nombreCampoTextArea="Detalle del reposo:"
                            clasesTextArear="form-control"
                            obligatorio="si"
                            value={this.state.descripcion_reposo_trabajador}
                            name="descripcion_reposo_trabajador"
                            id="descripcion_reposo_trabajador"
                            mensaje={this.state.msj_descripcion_reposo_trabajador}
                            eventoPadre={this.cambiarEstado}
                            />
                        </div>
                        <input type="hidden" id="cantidad_dias_entrega_reposo_trabajador" name="cantidad_dias_entrega_reposo_trabajador" value={this.state.cantidad_dias_entrega_reposo_trabajador}/>
                        <input type="hidden" id="estatu_entrega_reposo" name="estatu_entrega_reposo" value={this.state.estatu_entrega_reposo}/>
                        <input type="hidden" id="estatu_reposo_trabajador" name="estatu_reposo_trabajador" value={this.state.estatu_reposo_trabajador}/>
                        <input type="hidden" id="fecha_desde_entrega_reposo_trabajador" name="fecha_desde_entrega_reposo_trabajador" value={(this.state.fecha_desde_entrega_reposo_trabajador==="")?"":Moment(this.state.fecha_desde_entrega_reposo_trabajador).format("YYYY-MM-DD")}/>
                        <input type="hidden" id="fecha_hasta_entrega_reposo_trabajador" name="fecha_hasta_entrega_reposo_trabajador" value={(this.state.fecha_hasta_entrega_reposo_trabajador==="")?"":Moment(this.state.fecha_hasta_entrega_reposo_trabajador).format("YYYY-MM-DD")}/>



                        <div className="row mt-3 justify-content-center">
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
            <div className="component_reposo_trabajador_formulario">
				<ComponentDashboard
                componente={component}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />
			</div>
        )
    }

}

export default withRouter(ComponetReposoTrabajadorForm)