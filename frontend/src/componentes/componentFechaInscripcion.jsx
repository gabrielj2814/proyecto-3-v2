import React from 'react';
import {withRouter} from 'react-router-dom'
import axios from 'axios'
// IP servidor
import servidor from '../ipServer.js'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentFechaInscripcion.css'
//componentes
import ComponentDashboard from './componentDashboard'
// subComponent
import AlertBootstrap from "../subComponentes/alertBootstrap"
import InputButton from '../subComponentes/input_button'
import TituloModulo from '../subComponentes/tituloModulo'
import Tabla from '../subComponentes/componentTabla'
import ButtonIcon from '../subComponentes/buttonIcon'
import moment from 'moment';

const axiosCustom=axios.create({
    baseURL:`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/`
})

class ComponentFechaInscripcion extends React.Component{

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this)
        this.cambiarEstado=this.cambiarEstado.bind(this)
        this.actualizarElementoTabla=this.actualizarElementoTabla.bind(this)
        this.abrirElementoTabla=this.abrirElementoTabla.bind(this)
        this.cerrarElementoTabla=this.cerrarElementoTabla.bind(this)
        this.redirigirFormulario=this.redirigirFormulario.bind(this)
        this.state={
            //////
            modulo:"",
            estado_menu:false,
			/////------------
            fechaServidor:null,
			///-----
            registros:[],
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
        const token=localStorage.getItem('usuario')
        await this.consultarFechaServidor()
        await this.consultarTodo2()
    }

    async consultarTodo2(){
        let datos=[]
        await axiosCustom.get(`configuracion/fecha-inscripcion/consultar-todo-2`)
        .then(respuesta => {
            let respuestaServidor=JSON.parse(JSON.stringify(respuesta.data))
            console.log(respuestaServidor)
            this.setState({registros:respuestaServidor.datos})
        })
        .catch(error => {
            console.error(`error de la peticion axios =>>> ${error}`)
        })
        return datos
    }
    
    async consultarFechaServidor(){
        let datos=[]
        await axiosCustom.get(`configuracion/fecha-inscripcion/consultar-fecha-servidor`)
        .then(respuesta => {
            let fechaServidor=JSON.parse(JSON.stringify(respuesta.data))
            console.log(fechaServidor)
            this.setState({fechaServidor})
        })
        .catch(error => {
            console.error(`error de la peticion axios =>>> ${error}`)
        })
        return datos
    }

    cambiarEstado(a){
        var input=a.target;
        this.setState({[input.name]:input.value})
    }

    actualizarElementoTabla(a) {
        let boton=a.target
        this.props.history.push("/dashboard/configuracion/fecha-inscripcion/actualizar/"+boton.id)
    }

    async abrirElementoTabla(a) {
        let boton=a.target
        // alert(boton.id)
        await axiosCustom.put(`configuracion/fecha-inscripcion/abrir-inscripcion/${boton.id}`)
        .then(async respuesta => {
            let respuestaServidor=JSON.parse(JSON.stringify(respuesta.data))
            console.log(respuestaServidor)
            await this.consultarTodo2()
        })
        .catch(error => {
            console.error(`error de la peticion axios =>>> ${error}`)
        })
    }
    
    async cerrarElementoTabla(a) {
        let boton=a.target
        // alert(boton.id)
        await axiosCustom.put(`configuracion/fecha-inscripcion/cerrar-inscripcion/${boton.id}`)
        .then(async respuesta => {
            let respuestaServidor=JSON.parse(JSON.stringify(respuesta.data))
            console.log(respuestaServidor)
            await this.consultarTodo2()
        })
        .catch(error => {
            console.error(`error de la peticion axios =>>> ${error}`)
        })
    }

    redirigirFormulario(a){
        this.props.history.push("/dashboard/configuracion/fecha-inscripcion/registrar")
    }

    render(){
            const jsx_tabla_encabezado=(
                <thead> 
                    <tr> 
                        <th>Código</th> 
                        <th>Fecha De Inicio</th>
                        <th>Fecha De Cierre</th>
                        <th>Fecha Tope</th>
                        <th>Estatus</th>
                    </tr> 
                </thead>
            )
    
            const jsx_tabla_body=(
                <tbody>
                    {this.state.registros.map((fechaInscripcion,index)=>{
                        return(
                            <tr key={index}>
                                <td>{fechaInscripcion.id_fecha_incripcion}</td>
                                <td>{moment(fechaInscripcion.fecha_incripcion_desde).format("DD-MM-YYYY")}</td>
                                <td>{moment(fechaInscripcion.fecha_incripcion_hasta).format("DD-MM-YYYY")}</td>
                                <td>{moment(fechaInscripcion.fecha_tope_inscripcion).format("DD-MM-YYYY")}</td>
                                <td>
                                    <ButtonIcon 
                                    clasesBoton="btn btn-warning btn-block" 
                                    value={fechaInscripcion.id_fecha_incripcion} 
                                    id={fechaInscripcion.id_fecha_incripcion}
                                    eventoPadre={this.actualizarElementoTabla} 
                                    icon="icon-pencil"
                                    />
                                </td>


                                {(fechaInscripcion.estado_reapertura_inscripcion==="0" && moment(this.state.fechaServidor).isAfter(moment(fechaInscripcion.fecha_incripcion_hasta).format("YYYY-MM-DD")) && moment(this.state.fechaServidor).isBefore(moment(fechaInscripcion.fecha_tope_inscripcion).format("YYYY-MM-DD"))) &&
                                    <td>
                                        <button 
                                        value={fechaInscripcion.id_fecha_incripcion} 
                                        id={fechaInscripcion.id_fecha_incripcion} 
                                        onClick={this.abrirElementoTabla} 
                                        className='btn btn-success btn-block'>
                                            <svg id={fechaInscripcion.id_fecha_incripcion} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-door-open" viewBox="0 0 16 16">
                                                <path id={fechaInscripcion.id_fecha_incripcion} d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z"/>
                                                <path id={fechaInscripcion.id_fecha_incripcion} d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117zM11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5zM4 1.934V15h6V1.077l-6 .857z"/>
                                            </svg>
                                        </button>
                                    </td>
                                }
                                {(fechaInscripcion.estado_reapertura_inscripcion==="1"  && moment(this.state.fechaServidor).isAfter(moment(fechaInscripcion.fecha_tope_inscripcion).format("YYYY-MM-DD"))) &&
                                    <td>
                                        <button 
                                        value={fechaInscripcion.id_fecha_incripcion} 
                                        id={fechaInscripcion.id_fecha_incripcion} 
                                        onClick={this.cerrarElementoTabla} 
                                        className='btn btn-danger btn-block'>
                                            <svg id={fechaInscripcion.id_fecha_incripcion} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-door-closed" viewBox="0 0 16 16">
                                                <path id={fechaInscripcion.id_fecha_incripcion} d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V2zm1 13h8V2H4v13z"/>
                                                <path id={fechaInscripcion.id_fecha_incripcion} d="M9 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"/>
                                            </svg>
                                        </button>
                                    </td>
                                }
                                {fechaInscripcion.estado_reapertura_inscripcion==="2" &&
                                    <td>
                                       ya no se puede usar
                                    </td>
                                }
                        </tr>
                        )
                    })}
                </tbody>
            )
        const jsx=( <div>
             {this.state.alerta.estado===true &&
                    (<div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">

                        <AlertBootstrap colorAlert={this.state.alerta.color} mensaje={this.state.alerta.mensaje}/>
                        
                    </div>)
                }
                <TituloModulo clasesRow="row mb-5" clasesColumna="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center " tituloModulo="Módulo de Grado"/>
                
  
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_tabla_grado">
                        <Tabla tabla_encabezado={jsx_tabla_encabezado} tabla_body={jsx_tabla_body} numeros_registros={this.state.registros.length}/>
                    </div>
                </div>
                <div className="row">
                
                  <div className="col-3 col-ms-3 col-md-3 columna-boton">
                      <div className="row justify-content-center align-items-center contenedor-boton">
                        <div className="col-auto">
                          <InputButton clasesBoton="btn btn-primary" eventoPadre={this.redirigirFormulario} value="Registrar"/>
                        </div>
                      </div>
                    </div>
                </div>
        </div>)
        return(
            <div className="component_fecha_inscripcion">
                    
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

export default withRouter(ComponentFechaInscripcion)
