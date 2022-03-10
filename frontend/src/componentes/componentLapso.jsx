import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentLapso.css'
//JS
import axios from 'axios'
// IP servidor
import servidor from '../ipServer.js'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import AlertBootstrap from "../subComponentes/alertBootstrap"
import InputButton from '../subComponentes/input_button'
import TituloModulo from '../subComponentes/tituloModulo'
import Tabla from '../subComponentes/componentTabla'
import ButtonIcon from '../subComponentes/buttonIcon'
import moment from 'moment';

const axiosCustom=axios.create({
    baseURL:`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/`
})

class ComponentLapso extends React.Component{

    constructor(){
        super();
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.regresarHaLapsosPlanificacion=this.regresarHaLapsosPlanificacion.bind(this);
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.guardarObjetivo=this.guardarObjetivo.bind(this);
        this.eliminarObjetivo=this.eliminarObjetivo.bind(this);
        this.guardarEstadoPlanificaion=this.guardarEstadoPlanificaion.bind(this);
        this.state={
            modulo:"",
            estado_menu:false,
            // ------
            id_lapso:null,
            id_lapso_academico:"",
            id_fecha_lapso:"",
            nombre_lapso:"",
            descripcion_objetivo_academico:"",
            estatu_objetivo_lapso_academico:"",
            listaObjetivos:[],
            id_fecha_lapso:null,
            lista_fecha_lapso_escolar:[],

            //
            alerta:{
                color:null,
                mensaje:null,
                estado:false
            }
        }
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

    async componentWillMount(){

        let acessoModulo=await this.validarAccesoDelModulo("/dashboard/transaccion","/planificaion")
        if(acessoModulo){
            this.setState({id_lapso:this.props.match.params.id_lapso})
            await this.consultarFechasLapso(this.props.match.params.id_ano)
            await this.consultarObjetivos()
            await this.consultarLapso()
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
            console.log(error)
        })
        return estado
    }

    async consultarFechasLapso(id){
        await axiosCustom.get(
            `configuracion/fecha-lapso-academico/consultar-por-ano-escolar/${id}`
        )
        .then(respuesta=>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
            console.log("datos fecha lapso =>>>>",json)
            if(json.datos.length>0){
                this.setState({lista_fecha_lapso_escolar:json.datos})
            }
        })
        .catch(error => {
            let alerta=JSON.parse(JSON.stringify(this.state.alerta))
            alerta.color="danger"
            alerta.mensaje="error al conectarse con el servidor"
            alerta.estado=true
            this.setState({alerta})
        })
    }

    async consultarLapso(){
        await axiosCustom.get(
            `transaccion/planificacion-lapso-escolar/consultar-lapso/lapso/${this.props.match.params.id_lapso}`
        )
        .then(respuesta=>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
            // console.log("datos lapos =>>>>",json)
            if(json.datos.length>0){
                let nombreLapso=document.getElementById("nombreLapso")
                nombreLapso.textContent=json.datos[0].nombre_lapso_academico;
                let estadoLapso=document.getElementById("estadoLapso")
                estadoLapso.value=json.datos[0].estatu_lapso_academico
            }
        })
        .catch(error => {
            let alerta=JSON.parse(JSON.stringify(this.state.alerta))
            alerta.color="danger"
            alerta.mensaje="error al conectarse con el servidor"
            alerta.estado=true
            this.setState({alerta})
        })
    }

    async consultarObjetivos(){
        await axiosCustom.get(
            `transaccion/planificacion-lapso-escolar/consultar-todos-objetivo/${this.props.match.params.id_lapso}`
        )
        .then(respuesta=>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
            this.setState({listaObjetivos:json.datos})
        })
        .catch(error => {
            let alerta=JSON.parse(JSON.stringify(this.state.alerta))
            alerta.color="danger"
            alerta.mensaje="error al conectarse con el servidor"
            alerta.estado=true
            this.setState({alerta})
        })
    }

    regresarHaLapsosPlanificacion(){
        const {id_planificacion} =this.props.match.params
        this.props.history.push(`/dashboard/transaccion/planificacion/${id_planificacion}/lapso`)
    }
    
    cambiarEstado(a){
        var input=a.target;
        this.setState({[input.name]:input.value})
    }

    async guardarEstadoPlanificaion(){
        let contenedorAlertasLapsoObjetivo=document.getElementById("contenedorAlertasLapsoObjetivo")
        let estadoLapso=document.getElementById("estadoLapso")
        let datos={
            lapso:{
                id_lapso_academico:this.state.id_lapso,
                estatu_lapso_academico:estadoLapso.value
            }
        }
        await axiosCustom.put(
            `transaccion/planificacion-lapso-escolar/actualizar-estado-lapso`,
            datos
        )
        .then(async respuesta=>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
            await this.consultarObjetivos()
            
            if(json.color_alerta=="success"){
                let alertaHtml=`
                    <div class="alert alert-success alert-dismissible fade show" role="alert">${json.mensaje}<button class="close" data-dismiss="alert"><span>X</span></button></div>
                `
                contenedorAlertasLapsoObjetivo.innerHTML+=alertaHtml
            }
            else{
                let alertaHtml=`
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">${json.mensaje}<button class="close" data-dismiss="alert"><span>X</span></button></div>
                `
                contenedorAlertasLapsoObjetivo.innerHTML+=alertaHtml
            }

        })
        .catch(error => {
            let alertaHtml=`
                <div class="alert alert-danger alert-dismissible fade show" role="alert">error al conectarse con el servidor"<button class="close" data-dismiss="alert"><span>X</span></button></div>
            `
            contenedorAlertasLapsoObjetivo.innerHTML+=alertaHtml
        })

    }

    async guardarObjetivo(){
        let contenedorAlertasLapsoObjetivo=document.getElementById("contenedorAlertasLapsoObjetivo")
        let descripcionObjetivo=document.getElementById("descripcion_objetivo_academico")
        let exprecion=/[A-Za-z]/g
        let exprecion2=/[0-9]/g
        if(descripcionObjetivo.value!==""){
            if(exprecion.test(descripcionObjetivo.value) || exprecion2.test(descripcionObjetivo.value)){
                let datos={
                    objetivo:{
                        id_objetivo_lapso_academico:"",
                        id_lapso_academico:this.props.match.params.id_lapso,
                        descripcion_objetivo_academico:descripcionObjetivo.value,
                        estatu_objetivo_lapso_academico:1
                    }
                }
                await axiosCustom.post(
                    `transaccion/planificacion-lapso-escolar/crear-objetivo`,
                    datos
                    )
                    .then(async respuesta=>{
                        let json=JSON.parse(JSON.stringify(respuesta.data))
                        // console.log(json)
                        await this.consultarObjetivos()

                        let descripcionObjetivo=document.getElementById("descripcion_objetivo_academico")
                        if(json.color_alerta=="success"){
                            let alertaHtml=`
                                <div class="alert alert-success alert-dismissible fade show" role="alert">${json.mensaje}<button class="close" data-dismiss="alert"><span>X</span></button></div>
                            `
                            contenedorAlertasLapsoObjetivo.innerHTML+=alertaHtml
                        }
                        else{
                            let alertaHtml=`
                                <div class="alert alert-danger alert-dismissible fade show" role="alert">${json.mensaje}<button class="close" data-dismiss="alert"><span>X</span></button></div>
                            `
                            contenedorAlertasLapsoObjetivo.innerHTML+=alertaHtml
                        }

                })
                .catch(error => {
                    let alertaHtml=`
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">error al conectarse con el servidor"<button class="close" data-dismiss="alert"><span>X</span></button></div>
                    `
                    contenedorAlertasLapsoObjetivo.innerHTML+=alertaHtml
                })
            }
            else{
                alert("no tiene caracteres validos")
            }
        }
        else{
            alert("no puede estar vacion")
        }

    }

    async eliminarObjetivo(a){
        let boton=a.target
        let idObjetivo=boton.getAttribute("data-id-objetivo")
        await axiosCustom.delete(
            `transaccion/planificacion-lapso-escolar/eliminar-objetivo/${idObjetivo}`
        )
        .then(async respuesta=>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
            // console.log(json)
            let contenedorAlertasLapsoObjetivo=document.getElementById("contenedorAlertasLapsoObjetivo")
            let alertaHtml=`
                <div class="alert alert-success alert-dismissible fade show" role="alert">Objetivo Eliminado exitosamente<button class="close" data-dismiss="alert"><span>X</span></button></div>
            `
            contenedorAlertasLapsoObjetivo.innerHTML+=alertaHtml
            await this.consultarObjetivos()
        })
        .catch(error => {
            let alerta=JSON.parse(JSON.stringify(this.state.alerta))
            alerta.color="danger"
            alerta.mensaje="error al conectarse con el servidor"
            alerta.estado=true
            this.setState({alerta})
        })
    }
    

    render(){
        const jsx=(
            <div>
                {this.state.alerta.estado===true &&
                    (<div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">

                        <AlertBootstrap colorAlert={this.state.alerta.color} mensaje={this.state.alerta.mensaje}/>
                        
                    </div>)
                }
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12" id="contenedorAlertasLapsoObjetivo">

                </div>
                <button className='btn btn-primary' onClick={this.regresarHaLapsosPlanificacion}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                    </svg>
                </button>
                <h2 className='titulo-modulo-lapso'>lapso <span id="nombreLapso"></span></h2>
                <div className='contenido-lapso pt-5 pb-5'>
                    <form id="formularioLapso" className='mb-5'>
                        <div class="form-group row justify-content-center">
                            <label className="col-3 col-form-label text-right">Descripción del objetivo:</label>
                            <div className="col-3">
                                <input type="text" className="form-control" onChange={this.cambiarEstado} placeholder='Descripción del objetivo' id="descripcion_objetivo_academico" name="descripcion_objetivo_academico"/>
                            </div>
                            <div className='col-3'>
                                <input type="button" className='btn btn-primary' value="guardar" onClick={this.guardarObjetivo}/>
                            </div>
                        </div>
                        <input type="hidden" id="estatu_objetivo_lapso_academico" name="estatu_objetivo_lapso_academico" value="1"/>
                        <input type="hidden" id="id_planificacion" name="id_planificacion" value={this.props.match.params.id_planificacion}/>
                    </form>
                    <form id="formularioPlanificaionLapso" className='mb-5'>
                        <div class="form-group row justify-content-center mb-5">
                            <label className="col-3 col-form-label text-right">Estado de la planificaión:</label>
                            <div className='col-3'>
                                <select id="estadoLapso" className='form-control'>
                                    <option value="1">En desarrollo</option>
                                    <option value="2">Listo para usarse</option>
                                </select>
                            </div>
                            <div className='col-3'>
                                <input type="button" className='btn btn-primary' value="guardar" onClick={this.guardarEstadoPlanificaion}/>
                            </div>
                        </div>
                        <div class="form-group row justify-content-center ">
                            <label className="col-3 col-form-label text-right">Fecha de lapso:</label>
                            <div className='col-3'>
                                <select id="id_fecha_lapso" className='form-control' >
                                    {this.state.lista_fecha_lapso_escolar.map((fechaLapso,index) => {
                                        return (
                                            <option key={index} value={fechaLapso.id_fecha_lapso_academico} >lapso {fechaLapso.numero_lapos} - ({moment(fechaLapso.fecha_lapso_inicio,"YYYY-MM-DD").format("DD-MM-YYYY")} - {moment(fechaLapso.fecha_lapso_cierre,"YYYY-MM-DD").format("DD-MM-YYYY")})</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className='col-3'>
                                <input type="button" className='btn btn-primary' value="guardar" />
                            </div>
                        </div>
                    </form>
                    <h2 className='titulo-modulo-lapso-negro mb-3'>Lista de objetivos</h2>
                    <div className='row justify-content-center'>
                        <div className='col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9'>
                            <table className="table table-hover table-dark ">
                                <thead>
                                    <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Nombre del objetivo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {this.state.listaObjetivos.map((objetivo, index) => {
                                    return (
                                        <tr key={index}>
                                            <th scope="row">{index+1}</th>
                                            <td>{objetivo.descripcion_objetivo_academico}</td>
                                            <td>
                                                <button className='btn btn-danger' data-id-objetivo={objetivo.id_objetivo_lapso_academico} onClick={this.eliminarObjetivo}>Eliminar</button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                {this.state.listaObjetivos.length===0 && 
                                    (
                                        <tr >
                                            <td colspan="3"><center>Sin Objetivos Registrados</center></td>
                                        </tr>
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
        return (
            <div className="component_lapso_planificaion">
                    
                <ComponentDashboard
                componente={jsx}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />
            
            
            </div>
        )
    }


}

export default withRouter(ComponentLapso);