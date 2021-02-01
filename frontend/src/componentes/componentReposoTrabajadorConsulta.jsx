import React from "react"
import {withRouter} from "react-router-dom"
import axios from "axios"
import Moment from "moment"

// css
import "../css/componentReposoTrabajadorConsulta.css"
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'

class ComponentReposoTrabajadorConsulta extends React.Component{

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.regresar=this.regresar.bind(this);
        this.actualizar=this.actualizar.bind(this)
        this.state={
            modulo:"",
            estado_menu:false,
            //////
            id_reposo_trabajador:"",
            id_cedula:null,
            id_reposo:null,
            fecha_desde_reposo_trabajador:"",
            fecha_hasta_reposo_trabajador:"",
            estatu_reposo_trabajador:"",
            descripcion_reposo_trabajador:"",
            id_cam:null,
            id_asignacion_medico_especialidad:null,
            // 
            nombreCompletoTrabajador:"",
            nombreReposo:"",
            diasReposo:"",
            nombreCam:"",
            telefonoCam:"",
            direccionCam:"",
            nombreEstado:"",
            nombreCiudad:"",
            nombreTipoCam:"",
            nombreMedico:"",
            especialidadMedico:""
        }
    }


    async UNSAFE_componentWillMount(){
        let id=this.props.match.params.id
        let datosReposoTrabajador=await this.consultarReposoTrabajador(id)
        if(datosReposoTrabajador!==null){
            // alert(id)
            console.log("datos reposo trabajador =>>> ",datosReposoTrabajador)
            // datos estado
            let ciudad=await this.consultarCiudad(datosReposoTrabajador.id_ciudad)
            console.log("datos ciudad =>>> ",ciudad)
            let estado=await this.consultarEstado(ciudad.id_estado)
            console.log("datos estado =>>> ",estado)
            let tipoCam=await this.consultarTipoCam(datosReposoTrabajador.id_tipo_cam)
            console.log("datos tipo cam =>>> ",tipoCam)
            let asignacionMedicoEspecialidad=await this.consultarAsignacion(datosReposoTrabajador.id_asignacion_medico_especialidad)
            console.log("datos asignacion medico especialidad =>>> ",asignacionMedicoEspecialidad)
            this.setState({
                id_reposo_trabajador:datosReposoTrabajador.id_reposo_trabajador,
                id_cedula:datosReposoTrabajador.id_cedula,
                id_reposo:datosReposoTrabajador.id_reposo,
                fecha_desde_reposo_trabajador:Moment(datosReposoTrabajador.fecha_desde_reposo_trabajador).format("DD-MM-YYYY"),
                fecha_hasta_reposo_trabajador:Moment(datosReposoTrabajador.fecha_hasta_reposo_trabajador).format("DD-MM-YYYY"),
                estatu_reposo_trabajador:datosReposoTrabajador.estatu_reposo_trabajador,
                descripcion_reposo_trabajador:datosReposoTrabajador.descripcion_reposo_trabajador,
                id_cam:datosReposoTrabajador.id_cam,
                id_asignacion_medico_especialidad:datosReposoTrabajador.id_asignacion_medico_especialidad,
                // 
                nombreCompletoTrabajador:datosReposoTrabajador.nombres+" "+datosReposoTrabajador.apellidos,
                nombreReposo:datosReposoTrabajador.nombre_reposo,
                diasReposo:datosReposoTrabajador.dias_reposo,
                nombreCam:datosReposoTrabajador.nombre_cam,
                direccionCam:datosReposoTrabajador.direccion_cam,
                telefonoCam:datosReposoTrabajador.telefono_cam,
                nombreCiudad:ciudad.nombre_ciudad,
                nombreEstado:estado.nombre_estado,
                nombreTipoCam:tipoCam.nombre_tipo_cam,
                nombreMedico:asignacionMedicoEspecialidad.nombre_medico,
                nombreEspecialidad:asignacionMedicoEspecialidad.nombre_especialidad
            })
            // else{

            // }
        }
    }

    async consultarReposoTrabajador(id){
        let mensaje={texto:"",estado:""}
        let datos=null
        const token=localStorage.getItem('usuario')
        await axios.get(`http://localhost:8080/transaccion/reposo-trabajador/consultar/${id}/${token}`)
        .then(repuesta => {
            
            let json=JSON.parse(JSON.stringify(repuesta.data))
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
            mensaje.texto="error al conectar con el servidor"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/transaccion/reposo-trabajador${JSON.stringify(mensaje)}`)
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

    async consultarAsignacion(id){
        var respuesta_servidor=null
        var mensaje={texto:"",estado:""}
        const token=localStorage.getItem('usuario')
        await axios.get(`http://localhost:8080/configuracion/asignacion-medico-especialidad/consultar/${id}/${token}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data.medico_especialidad
        })
        .catch(error=>{
            console.log(error)
        })
        return respuesta_servidor;
    }

    // logica menu
    mostrarModulo(a){
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

    regresar(){
        this.props.history.push("/dashboard/transaccion/reposo-trabajador");
    }

    actualizar(){
        this.props.history.push("/dashboard/transaccion/reposo-trabajador/actualizar/"+this.state.id_reposo_trabajador)
    }

    render(){
        const component=(
            <div className="row justify-content-center">
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_reposo_trabajador_consulta">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-reposo-trabajador-consulta">
                            <span className="titulo-cam-consulta">Consulta del reposo: {this.state.id_reposo_trabajador}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Codigo del reposo: </span>
                            <span className="valor">{this.state.id_reposo_trabajador}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Cedula del trabajador: </span>
                            <span className="valor">{this.state.id_cedula}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Nombre del trabajador: </span>
                            <span className="valor">{this.state.nombreCompletoTrabajador}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Tipo de reposo: </span>
                            <span className="valor">{this.state.nombreReposo}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Dias del reposo: </span>
                            <span className="valor">{this.state.diasReposo} dias</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Nombre del CAM: </span>
                            <span className="valor">{this.state.nombreCam}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">tipo de centro: </span>
                            <span className="valor">{this.state.nombreTipoCam}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Telefono del centro: </span>
                            <span className="valor">{this.state.telefonoCam}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Ubicacion del centro: </span>
                            <span className="valor">esta ubicado en el estado {this.state.nombreEstado}, en la ciudad de {this.state.nombreCiudad}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Direccion del centro: </span>
                            <span className="valor">{this.state.direccionCam}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Info. del Medico: </span>
                            <span className="valor">atendido por el medico {this.state.nombreMedico}, en su especialidad como {this.state.nombreEspecialidad}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Fecha inicio del reposo: </span>
                            <span className="valor">{this.state.fecha_desde_reposo_trabajador}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Fecha fin del reposo: </span>
                            <span className="valor">{this.state.fecha_hasta_reposo_trabajador}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Detalle del reposo: </span>
                            <span className="valor">{this.state.descripcion_reposo_trabajador}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Estatu del reposo: </span>
                            <span className="valor">{(this.state.estatu_reposo_trabajador==="1")?"Activo":"Inactivo"}</span>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-auto">
                            <InputButton 
                            clasesBoton="btn btn-warning"
                            id="boton-actualizar"
                            value="actualizar"
                            eventoPadre={this.actualizar}
                            />
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
                    
                </div>
            
            </div>
        )

        return(
            <div className="component_reposo_trabajador_consulta">
                <ComponentDashboard
                eventoPadreMenu={this.mostrarModulo}
                modulo={this.state.modulo}
                estado_menu={this.state.estado_menu}
                componente={component}
                />
            </div>

        )
    }


}

export default withRouter(ComponentReposoTrabajadorConsulta)