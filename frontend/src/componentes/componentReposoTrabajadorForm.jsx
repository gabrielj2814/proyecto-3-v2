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
        // this.regresar=this.regresar.bind(this);
        this.mostarDias=this.mostarDias.bind(this)
        this.mostrarDatosCam=this.mostrarDatosCam.bind(this)
        this.agregar=this.agregar.bind(this)
        this.mostrarAsignacionMedico=this.mostrarAsignacionMedico.bind(this)
        this.mostrarFechaHasta=this.mostrarFechaHasta.bind(this)
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
            // ---------
            listaDeTrabajadoresActivos:[],
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
            msj_id_cedula:{
                mensaje:"",
                color_texto:""
            },
            msj_id_reposo:{
                mensaje:"",
                color_texto:""
            },
            msj_id_cam:{
                mensaje:"",
                color_texto:""
            },
            msj_id_especialidad:{
                mensaje:"",
                color_texto:""
            },
            msj_id_asignacion_medico_especialidad:{
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
        if(idRegistro!==null){
            let listaDeTrabajadores=await this.consultarTodosTrabajadores();
            let listaDetrabajadoresActivos=listaDeTrabajadores.filter( trabajador =>  trabajador.estatu_trabajador==="1" && trabajador.estatu_cuenta==="1")
            let listaDeTrabajadoresSelect=[]
            for(let trabajador of listaDetrabajadoresActivos){
                listaDeTrabajadoresSelect.push({
                    id:trabajador.id_cedula,
                    descripcion:trabajador.id_cedula+" - "+trabajador.nombres+" "+trabajador.apellidos
                })
            }
            // ----- reposo
            let listaDeTodosLosReposos=await this.consultarTodosReposo()
            let listaDeRepososActivos= listaDeTodosLosReposos.filter(reposo => reposo.estatu_reposo==="1")
            let listaDeReposoSelect=[];
            let reposoTablaHash={}
            for(let reposo of listaDeRepososActivos){
                listaDeReposoSelect.push({
                    id:reposo.id_reposo,
                    descripcion:reposo.nombre_reposo
                })
                reposoTablaHash[reposo.id_reposo]={dias:reposo.dias_reposo}
            }
            // -------- cam
            let listaDeTodosLosCam=await this.consultarTodosLosCam()
            let listaDeCamActivos=listaDeTodosLosCam.filter( cam => cam.estatu_cam==="1")
            let listaDeCamSelect=[]
            let camTablaHash={}
            for(let cam of listaDeCamActivos){
                listaDeCamSelect.push({
                    id:cam.id_cam,
                    descripcion:cam.nombre_cam
                })
                camTablaHash[cam.id_cam]=cam
            }
            if(listaDeCamSelect.length!==0){
                camTablaHash[listaDeCamSelect[0].id]["ciudad"]=await this.consultarCiudad(camTablaHash[listaDeCamSelect[0].id].id_ciudad)
                camTablaHash[listaDeCamSelect[0].id]["estado"]=await this.consultarEstado(camTablaHash[listaDeCamSelect[0].id].ciudad.id_estado)
                camTablaHash[listaDeCamSelect[0].id]["tipoCam"]=await this.consultarTipoCam(camTablaHash[listaDeCamSelect[0].id].id_tipo_cam)
            }
            // ------ asignaciones medico
            let listaDeEspecialidades= await this.consultarTodasEspecialidad()
            // console.log("listas de especialidades =>>> ",listaDeEspecialidades)
            let listaDeEspecialidadesActivas=listaDeEspecialidades.filter(especialidad => especialidad.estatu_especialidad==="1")
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
                id_reposo_trabajador:idRegistro,
                listaDeTrabajadoresActivos:listaDeTrabajadoresSelect,
                id_cedula:(listaDeTrabajadoresSelect.length===0)?null:listaDeTrabajadoresSelect[0].id,
                listaDeRepososActivos:listaDeReposoSelect,
                id_reposo:(listaDeReposoSelect.length===0)?null:listaDeReposoSelect[0].id,
                listaDeReposos:reposoTablaHash,
                dias_reposo:(listaDeReposoSelect.length===0)?null:reposoTablaHash[listaDeReposoSelect[0].id].dias,
                listaDeCams:camTablaHash,
                listaDeCamsActivos:listaDeCamSelect,
                id_cam:(listaDeCamSelect.length===0)?null:listaDeCamSelect[0].id,
                infoCam:(listaDeCamSelect.length===0)?null:camTablaHash[listaDeCamSelect[0].id],
                listaDeEspecialidadActivos:listaDeEspecialidadesSelect,
                id_especialidad:(listaDeEspecialidadesSelect.length===0)?null:listaDeEspecialidadesSelect[0].id,
                listaDeAsignaciones:asigancionTablaHash,
                id_asignacion_medico_especialidad:(listaDeEspecialidadesSelect.length===0)?null:asigancionTablaHash[listaDeEspecialidadesSelect[0].id]["asignacion"].id_asignacion_medico_especialidad,
                listaDeMedico:listasDeMedicosSelect
            })
            // console.log(this.state.listaDeReposos[listaDeReposoSelect[0].id].dias)
        }

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
        .then(respuesta => {
            datos=respuesta.data.cams
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
        .then(respuesta=>{
            respuesta_servidor=respuesta.data.especialidades
            // console.log(respuesta.data)
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

    agregar(){
        alert("agregando nuevo formulario")
    }

    mostarDias(a){
        let input=a.target
        this.cambiarEstado(a)
        this.setState({
            dias_reposo:this.state.listaDeReposos[input.value].dias
        })

    }

    async mostrarDatosCam(a){
        let input=a.target
        this.cambiarEstado(a)
        let cam=this.state.listaDeCams[input.value]
        // console.log(cam)
        cam["ciudad"]=await this.consultarCiudad(cam.id_ciudad)
        cam["estado"]=await this.consultarEstado(cam.ciudad.id_estado)
        cam["tipoCam"]=await this.consultarTipoCam(cam.id_tipo_cam)
        this.setState({
            infoCam:cam
        })
    }

    /**
     * <ComponentFormSelect
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            obligatorio="si"
                            mensaje={this.state.msj_id_asignacion_medico_especialidad}
                            nombreCampoSelect="Lista de especialidades:"
                            clasesSelect="custom-select"
                            name="id_asignacion_medico_especialidad"
                            id="id_asignacion_medico_especialidad"
                            eventoPadre={this.mostrarAsignacionMedico}
                            defaultValue={this.state.listaDeAsignaciones[this.state.id_asignacion_medico_especialidad.asignacion]}
                            option={this.state.listaDeEspecialidadActivos}
                            />
    */

    mostrarFechaHasta(a){
        let input=a.target
        this.cambiarEstado(a)
        // alert(this.state.dias_reposo)
        if(this.state.dias_reposo!==""){
            let dias=parseInt(this.state.dias_reposo)
            let fecha_hasta=Moment(input.value)
            fecha_hasta.add(dias,"days")
            alert(fecha_hasta)
            this.setState({
                fecha_hasta_reposo_trabajador:fecha_hasta
            })
        }
        else{
            alert("por favor selecione un reposo")
        }
    }

    operacion(){
        alert("operacion")
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
                            <ComponentFormSelect
                            clasesColumna="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6"
                            obligatorio="si"
                            mensaje={this.state.msj_id_cedula}
                            nombreCampoSelect="Trabajadores:"
                            clasesSelect="custom-select"
                            name="id_cedula"
                            id="id_cedula"
                            eventoPadre={this.cambiarEstado}
                            defaultValue={this.state.id_cedula}
                            option={this.state.listaDeTrabajadoresActivos}
                            />
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
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
                                mensaje={this.state.msj_id_reposo}
                                nombreCampoSelect="Lista de reposos:"
                                clasesSelect="custom-select"
                                name="id_reposo"
                                id="id_reposo"
                                eventoPadre={this.mostarDias}
                                defaultValue={this.state.id_reposo}
                                option={this.state.listaDeRepososActivos}
                                />
                            
                                <div className="diasReposo col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 offset-3 offset-sm-3 offset-md-3 offset-lg-3 offset-xl-3">
                                    dias del reposo:<span id="diasReposo">{(this.state.dias_reposo===null)?"":this.state.dias_reposo}</span>
                                </div>
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
                                mensaje={this.state.msj_id_cam}
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
                            mensaje={this.state.msj_id_especialidad}
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
                            mensaje={this.state.msj_id_asignacion_medico_especialidad}
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
                            nombreCampoDate="desde:"
                            clasesCampo="form-control"
                            value={this.state.fecha_desde_reposo_trabajador}
                            name="fecha_desde_reposo_trabajador"
                            id="fecha_desde_reposo_trabajador"
                            eventoPadre={this.mostrarFechaHasta}
                            />
                            <div className="diasReposo col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 offset-3 offset-sm-3 offset-md-3 offset-lg-3 offset-xl-3">
                                fecha hasta: {(this.state.fecha_hasta_reposo_trabajador==="")?"":Moment(this.state.fecha_hasta_reposo_trabajador).format("DD-MM-YYYY")}
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
                        <div className="row justify-content-center">
                            <ComponentFormRadioState
                            clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            extra="custom-control-inline"
                            nombreCampoRadio="Estatus:"
                            name="estatu_reposo_trabajador"
                            nombreLabelRadioA="Activo"
                            idRadioA="activoA"
                            checkedRadioA={this.state.estatu_reposo_trabajador}
                            valueRadioA="1"
                            nombreLabelRadioB="Inactivo"
                            idRadioB="activoB"
                            valueRadioB="0"
                            eventoPadre={this.cambiarEstado}
                            checkedRadioB={this.state.estatu_reposo_trabajador}
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
            <div className="component_cam_formulario">
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