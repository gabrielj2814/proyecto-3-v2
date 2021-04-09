import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentSolicitarPermisoForm.css'
//JS
import axios from 'axios'
import Moment from 'moment'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'
//import ButtonIcon from '../subComponentes/buttonIcon'
import ComponentFormCampo from '../subComponentes/componentFormCampo';
//import ComponentFormRadioState from '../subComponentes/componentFormRadioState';
import ComponentFormDate from '../subComponentes/componentFormDate'
import ComponentFormSelect from '../subComponentes/componentFormSelect';
import { Alert } from 'bootstrap';

class ComponentSolicitarPermisoTrabajadorForm extends React.Component{

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.solicitarNuvoPermiso=this.solicitarNuvoPermiso.bind(this);
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.buscarPermiso=this.buscarPermiso.bind(this);
        this.calcularFechaHasta=this.calcularFechaHasta.bind(this);
        this.solicitarNuvoPermiso=this.solicitarNuvoPermiso.bind(this);
        this.nuevoPermiso=this.nuevoPermiso.bind(this)
        this.buscarTrabajador=this.buscarTrabajador.bind(this)
        this.state={
            modulo:"",// modulo menu
            estado_menu:false,
            //
            id_permiso_trabajador:"",
            id_cedula:"",
            fecha_desde_permiso_trabajador:null,
            fecha_hasta_permiso_trabajador:"",
            estatu_permiso_trabajador:"",
            permiso_trabajador_dias_aviles:"",
            permiso_trabajador_tipo:"",
            //propiedades extras
            //permiso
            id_permiso:"",
            nombre_permiso:"",
            dias_permiso:"",
            estatu_permiso:"",
            estatu_remunerado:"",
            estatu_dias_aviles:"",
            estatu_tipo_permiso:"",
            estatu_formulario:"",
            //fomrulario
            lista_permisos:[],
            /// meensajes formularios
            msj_fecha_desde_permiso_trabajador:"",
            msj_id_cedula:"",
            hashTrabajadores:{},
            estadoBusquedaTrabajador:false,
            fechaServidor:null,
            ///
            mensaje:{
                texto:"",
                estado:""
            },
        }
    }

    async consultarSesion(){
        var id_cedula=""
        var mensaje=this.state.mensaje
        if(localStorage.getItem("usuario")){
            var respuesta_servidor=""
            const token=localStorage.getItem("usuario")
            await axios.get(`http://localhost:8080/login/verificar-sesion${token}`)
            .then(respuesta=>{
                respuesta_servidor=respuesta.data
                if(respuesta_servidor.usuario){
                    id_cedula=respuesta_servidor.usuario.id_cedula
                }
                else{
                    mensaje.texto="No se puedo conectar con el servidor"
                    mensaje.estado="401"
                    this.props.history.push(`/login${JSON.stringify(mensaje)}`)
                }
            })
            .catch(error=>{
                console.log(error)
                mensaje.texto="hubo un error inseperado en el servidor al momento de procesar su peticion"
                mensaje.estado="500"
                this.props.history.push(`/login${JSON.stringify(mensaje)}`)
            })
            return id_cedula
        }
        else{
            mensaje.texto="Notienes la autorización para entrar al sistema"
            mensaje.estado="500"
            this.props.history.push(`/login${JSON.stringify(mensaje)}`)
        }
        return id_cedula
    }

    /*
    async buscarUltimoPermiso(cedula){
        var respuesta_servidor=""
        await axios.get(`http://localhost:8080/transaccion/permiso-trabajador/consultar-ultimo/${cedula}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
        })
        .catch(error=>{
            console.log(error)
        })
        return respuesta_servidor
    }
    */

    async consultarAlServidor(ruta){
        var respuesta_servidor=""
        await axios.get(ruta)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
        })
        .catch(error=>{
            console.log(error)
        })

        return respuesta_servidor
    }

    formatoOptionSelect(lista,lista_vacia,propiedades){
        var veces=0
        while(veces<lista.length){
            lista_vacia.push({id:lista[veces][propiedades.id],descripcion:lista[veces][propiedades.descripcion]})
            veces+=1
        }
        return lista_vacia
    }

    async componentDidMount(){
        // const id_cedula=await this.consultarSesion()
        await this.consultarFechaServidor()
        await this.consultarTodosLosTrabajadores()
        const ruta_generar_id="http://localhost:8080/transaccion/permiso-trabajador/generar-id"
        const id_fomrulario=await this.consultarAlServidor(ruta_generar_id)
        const ruta_permisos="http://localhost:8080/configuracion/permiso/consultar-permisos"
        const lista_permisos=await this.consultarAlServidor(ruta_permisos)
        const propiedades={
            id:"id_permiso",
            descripcion:"nombre_permiso"
        }
        var lista_vacia=[]
        lista_permisos.permisos=this.eliminarPermisoInactivos(lista_permisos.permisos);
        const lista=this.formatoOptionSelect(lista_permisos.permisos,lista_vacia,propiedades)
        // console.log("->>>",lista_permisos.permisos);
        this.setState({
            id_cedula:"",
            estatu_formulario:"nuevo",
            id_permiso_trabajador:id_fomrulario.id,
            lista_permisos:lista,
            id_permiso:lista_permisos.permisos[0].id_permiso
        })
        let objeto={
            target:{
                value:lista_permisos.permisos[0].id_permiso
            }
        }
        this.buscarPermiso(objeto)
        if(this.state.estadoBusquedaTrabajador===false){
            document.getElementById("botonEnviarSolicitud").setAttribute("disabled","true")
        }
    }
    
    async consultarFechaServidor(){
        await axios.get("http://localhost:8080/transaccion/permiso-trabajador/fecha-servidor")
        .then(respuesta => {
            let fechaServidor=respuesta.data.fechaServidor
            // alert(fechaServidor)
            this.setState({fechaServidor})
        })
        .catch(error => {
            console.log("error al conectar con el servidor")
        })
    }

    eliminarPermisoInactivos(permiso){
        for(let contador=0;contador<permiso.length;contador++){
            if(permiso[contador].estatu_permiso==="0"){
                permiso.splice(contador,1);
            }
        }
        return permiso;
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

    cambiarEstado(a){
        var input=a.target;
        this.setState({[input.name]:input.value})
    }

    async buscarPermiso(a){
        let input=a.target;
        const token=localStorage.getItem('usuario')
        const ruta_permiso=`http://localhost:8080/configuracion/permiso/consultar/${input.value}/${token}`
        const permiso=await this.consultarAlServidor(ruta_permiso)
        console.log(permiso)
        this.setState(permiso.permiso)
        const $fechaDesde=document.getElementById("fecha_desde_permiso_trabajador")
        if(permiso.permiso.estatu_tipo_permiso==="0"){
            this.setState({fecha_hasta_permiso_trabajador:null})
            $fechaDesde.setAttribute("disabled",true)
        }
        else if(permiso.permiso.estatu_tipo_permiso==="1"){
            $fechaDesde.removeAttribute("disabled")
            if(document.getElementById("fecha_desde_permiso_trabajador").value!==""){
                let input={
                    target:document.getElementById("fecha_desde_permiso_trabajador")
                }
                this.calcularFechaHasta(input)
            }
            
        }
    }

    calcularFechaHasta(a){
        var input=a.target;
        const dias_permiso=parseInt(this.state.dias_permiso)
        //fecha_desde=Moment(input.value)
        // permiso_trabajador_dias_aviles
        if(this.state.estatu_dias_aviles==="0"){
            var fecha_hasta=Moment(input.value)
            fecha_hasta.add(dias_permiso,"days")
            this.setState({
                fecha_desde_permiso_trabajador:input.value,
                fecha_hasta_permiso_trabajador:fecha_hasta.format("YYYY-MM-DD"),
                permiso_trabajador_dias_aviles:""
            })
        }
        else{
            let fecha_desde=Moment(input.value)
            let fecha_hasta=Moment(input.value)
            while(fecha_desde.format("dd")==="Su" || fecha_desde.format("dd")==="Sa"){
                fecha_desde.add(1,"days")
            }

            let cont=0
            let diasNoAviles=0
            while(cont<dias_permiso || (fecha_hasta.format("dd")==="Su" || fecha_hasta.format("dd")==="Sa")){
                if(fecha_hasta.format("dd")==="Su" || fecha_hasta.format("dd")==="Sa"){
                    fecha_hasta.add(1,"days");
                    diasNoAviles++
                }
                else{
                    // totalDias--
                    cont++
                    fecha_hasta.add(1,"days");
                }
            }

            this.setState({
                fecha_desde_permiso_trabajador:fecha_desde.format("YYYY-MM-DD"),
                fecha_hasta_permiso_trabajador:fecha_hasta.format("YYYY-MM-DD"),
                permiso_trabajador_dias_aviles:diasNoAviles
            })
        }
    }

    validarFechaDesde(){
        var estado=false
        if(this.state.estatu_tipo_permiso==="1"){
            var fecha_desde=Moment(this.state.fecha_desde_permiso_trabajador).format("YYYY-MM-DD")
            var hoy=Moment(this.state.fechaServidor).format("YYYY-MM-DD")
            if(this.state.fecha_desde_permiso_trabajador!==""){
                if(Moment(fecha_desde).isAfter(hoy)){
                    estado=true
                }
                else{
                    this.setState({msj_fecha_desde_permiso_trabajador:"la fecha desde del permiso no puede ser antes que la de hoy"})
                }
            }
            else{
                this.setState({msj_fecha_desde_permiso_trabajador:"no puede enviar una solicitud si no agrega una fecha"})
            }
        }
        else if(this.state.estatu_tipo_permiso==="0"){
            estado=true
        }
        return estado
    }

    async solicitarNuvoPermiso(){
        if(this.validarFechaDesde()){
            var respuesta_servidor=""
            var mensaje=this.state.mensaje
            const token=localStorage.getItem('usuario')
            // fecha_desde_permiso_trabajador:Moment(this.state.fecha_desde_permiso_trabajador).format("YYYY-MM-DD"),
                    // fecha_hasta_permiso_trabajador:Moment(this.state.fecha_hasta_permiso_trabajador).format("YYYY-MM-DD"),
            const objeto={
                permiso_trabajador:{
                    id_permiso_trabajador:this.state.id_permiso_trabajador,
                    id_cedula:this.state.id_cedula,
                    id_permiso:this.state.id_permiso,
                    fecha_desde_permiso_trabajador:(this.state.estatu_tipo_permiso==="0")?"":Moment(this.state.fecha_desde_permiso_trabajador).format("YYYY-MM-DD"),
                    fecha_hasta_permiso_trabajador:(this.state.estatu_tipo_permiso==="0")?"":Moment(this.state.fecha_hasta_permiso_trabajador).format("YYYY-MM-DD"),
                    estatu_permiso_trabajador:"E",
                    permiso_trabajador_dias_aviles:this.state.permiso_trabajador_dias_aviles,
                    permiso_trabajador_tipo:(this.state.estatu_tipo_permiso==="0")?"PR":"PN"
                },
                token
            }
            console.log("datos =>>> ",objeto)
            await axios.post("http://localhost:8080/transaccion/permiso-trabajador/registrar",objeto)
            .then(respuesta=>{
                respuesta_servidor=respuesta.data
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                console.log(mensaje);
                this.setState({mensaje:mensaje})
            })
            .catch(error=>{
                console.log(error)
                mensaje.texto="al conectar con el servidor"
                mensaje.estado="500"
                this.setState({mensaje:mensaje})
            })
        }
        else{
            alert("Error al enviar la solicitud por que el permiso no puede comenzar hoy")
        }
    }

    async nuevoPermiso(){
        const ruta_generar_id="http://localhost:8080/transaccion/permiso-trabajador/generar-id"
        const id_fomrulario=await this.consultarAlServidor(ruta_generar_id)
        const ruta_permisos="http://localhost:8080/configuracion/permiso/consultar-permisos"
        const lista_permisos=await this.consultarAlServidor(ruta_permisos)
        const propiedades={
            id:"id_permiso",
            descripcion:"nombre_permiso"
        }
        var lista_vacia=[]
        lista_permisos.permisos=this.eliminarPermisoInactivos(lista_permisos.permisos);
        const lista=this.formatoOptionSelect(lista_permisos.permisos,lista_vacia,propiedades)
        this.setState({
            id_cedula:this.state.id_cedula,
            estatu_formulario:"nuevo",
            id_permiso_trabajador:id_fomrulario.id,
            lista_permisos:lista,

            fecha_desde_permiso_trabajador:"",
            fecha_hasta_permiso_trabajador:null,
            estatu_permiso_trabajador:"",
            permiso_trabajador_dias_aviles:"",

            id_permiso:lista_permisos.permisos[0].id_permiso,
            nombre_permiso:"",
            dias_permiso:"",
            estatu_permiso:"",
            estatu_remunerado:"",
            estatu_dias_aviles:"",
            estatu_tipo_permiso:""
        })
        let objeto={
            target:{
                value:lista_permisos.permisos[0].id_permiso
            }
        }
        this.buscarPermiso(objeto)
    }

    async buscarTrabajador(a){
        let input = a.target
        this.cambiarEstado(a)
        // console.log(input.value)
        let hashTrabajadores=JSON.parse(JSON.stringify(this.state.hashTrabajadores))
        if(hashTrabajadores[input.value]){
            this.setState({
                estadoBusquedaTrabajador:true
            })
            const ruta_ultimo_permiso=`http://localhost:8080/transaccion/permiso-trabajador/consultar-ultimo/${input.value}`
            const ultimo_permiso=await this.consultarAlServidor(ruta_ultimo_permiso)
            console.log("datos ultimo permiso =>>> ",ultimo_permiso)
            if(ultimo_permiso.permiso_trabajador.length>0){
                if(ultimo_permiso.permiso_trabajador[0].estatu_permiso_trabajador==="E" || ultimo_permiso.permiso_trabajador[0].estatu_permiso_trabajador==="A"){
                    document.getElementById("botonEnviarSolicitud").setAttribute("disabled","true")
                    alert(`este trabajador tiene un permiso ${(ultimo_permiso.permiso_trabajador[0].estatu_permiso_trabajador==="E")?"en Espera":"Aprovado"}`)
                }
                else{
                    document.getElementById("botonEnviarSolicitud").removeAttribute("disabled")
                }
            }
            else{
                document.getElementById("botonEnviarSolicitud").removeAttribute("disabled")
            }
        }
        else{
            this.setState({
                estadoBusquedaTrabajador:false
            })
            document.getElementById("botonEnviarSolicitud").setAttribute("disabled","true")
        }
    }

    render(){
        const nueva_solicitud=(
            <div>
                <div className="row justify-content-center">
                    <div className="col-4 col-ms-4 col-md-4 col-lg-4 col-xl-4 ">
                        <span>Codigo del permiso: {this.state.id_permiso_trabajador}</span>
                    </div>
                    <div className="col-6 col-ms-6 col-md-6 col-lg-6 col-xl-6"></div>
                </div>
                <div className="row mt-3">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-solicitud-permiso">
                        <span className="sub-titulo-form-solicitud-permiso">Trabajador</span>
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
                    {this.state.estadoBusquedaTrabajador===true &&
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            Nombre completo:
                            <div className="mt-3 text-capitalize">{this.state.hashTrabajadores[this.state.id_cedula].nombres} {this.state.hashTrabajadores[this.state.id_cedula].apellidos}</div>
                        </div>
                    }
                    {this.state.estadoBusquedaTrabajador===false &&
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
                    }
                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
                </div>
                <div className="row mt-3">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-solicitud-permiso">
                        <span className="sub-titulo-form-solicitud-permiso">Permiso</span>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <ComponentFormSelect
                    clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                    obligatorio="si"
                    //mensaje={this.state.msj_id_funcion_trabajador}
                    nombreCampoSelect="permiso:"
                    clasesSelect="custom-select"
                    name="id_permiso"
                    id="id_permiso"
                    eventoPadre={this.buscarPermiso}
                    defaultValue={this.state.id_permiso}
                    option={this.state.lista_permisos}
                    />
                    <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3 offset-3"></div>
                </div>
                {this.state.id_permiso!=="" &&
                    (
                        <div>
                            <div className="row justify-content-center">
                                <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3">
                                    <span className="">dias: {this.state.dias_permiso}</span>
                                </div>
                                <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3 ">
                                    <span className="">remunerado: {(this.state.estatu_remunerado==="1")?"Si":"No"}</span>
                                </div>
                                <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3 ">
                                    <span className="">aviles: {(this.state.estatu_dias_aviles==="1")?"Si":"No"}</span>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-solicitud-permiso">
                                    <span className="sub-titulo-form-solicitud-permiso">Fecha del permiso</span>
                                </div>
                            </div>
                            <div className="row justify-content-center">
                                <ComponentFormDate
                                clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                                obligatorio="si"
                                mensaje={this.state.msj_fecha_desde_permiso_trabajador}
                                nombreCampoDate="desde:"
                                clasesCampo="form-control"
                                value={this.state.fecha_desde_permiso_trabajador}
                                name="fecha_desde_permiso_trabajador"
                                id="fecha_desde_permiso_trabajador"
                                eventoPadre={this.calcularFechaHasta}
                                />
                                <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 aliniar-fecha-hasta">
                                    {(this.state.fecha_hasta_permiso_trabajador!==null)?Moment(this.state.fecha_hasta_permiso_trabajador).format("DD-MM-YYYY"):""}
                                </div>
                                <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
                            </div>
                        </div>
                    )
                }
                <div className="row justify-content-center mt-2">
                    <div className="col-auto">
                        <InputButton 
                        clasesBoton="btn btn-success"
                        id="botonEnviarSolicitud"
                        value="Enviar solicitud"
                        eventoPadre={this.solicitarNuvoPermiso}
                        />
                    </div>  
                </div>
            </div>
        )
        const jsx_solicitud_permiso=(
            <div className="row justify-content-center">
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                    {this.state.mensaje.texto!=="" && (this.state.mensaje.estado==="200" || this.state.mensaje.estado==="404" || this.state.mensaje.estado==="500") &&
                        <div className="row">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                <div className={`alert alert-${(this.state.mensaje.estado==="200")?"success":"danger"} alert-dismissible`}>
                                    <p>Mensaje: {this.state.mensaje.texto}</p>
                                    <button className="close" data-dismiss="alert">
                                        <span>X</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_formulario_solicitud_permiso">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-solicitud-permiso">
                            <span className="titulo-form-solicitud-permiso">Formulario de solicitud permiso</span>
                        </div>
                    </div>
                    
                    <form id="form-solicitud-permiso">
                        {nueva_solicitud}
                    </form>
                </div>
            </div>
        )

        return (
            <div className="component_solicitud_permiso_form">
                <ComponentDashboard
                componente={jsx_solicitud_permiso}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />
            </div>
        )
    }

}

export default withRouter(ComponentSolicitarPermisoTrabajadorForm)