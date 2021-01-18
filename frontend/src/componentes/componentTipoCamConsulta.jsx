import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentTipoCamConsulta.css'
//JS
import axios from 'axios'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'

class ComponentTipoCamConsulta extends React.Component{
	constructor(){
		super();
		this.mostrarModulo=this.mostrarModulo.bind(this);
        this.regresar=this.regresar.bind(this);
        this.actualizar=this.actualizar.bind(this)
        this.state={
            modulo:"",
            estado_menu:false,
            //////
            id_tipo_cam:"" ,
            nombre_tipo_cam:"" ,
            estatu_tipo_cam:"1",
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

    async UNSAFE_componentWillMount(){
        const id=this.props.match.params.id
        await this.consultarTipoCam(id)
    }

    async consultarTipoCam(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        const token=localStorage.getItem('usuario')
        await axios.get(`http://localhost:8080/configuracion/tipo-cam/consultar/${id}/${token}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
           if(respuesta_servidor.estado_peticion==="200"){
                const id_tipo_cam=respuesta_servidor.tipo_cam.id_tipo_cam,
                nombre_tipo_cam=respuesta_servidor.tipo_cam.nombre_tipo_cam,
                estatu_tipo_cam=(respuesta_servidor.tipo_cam.estatu_tipo_cam==="1")?"Activo":"Inactivo"

                this.setState({
                    id_tipo_cam:id_tipo_cam,
                    nombre_tipo_cam:nombre_tipo_cam,
                    estatu_tipo_cam:estatu_tipo_cam
                })
                
           }
           else if(respuesta_servidor.estado_peticion==="404"){
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                this.props.history.push(`/dashboard/configuracion/tipo-cam${JSON.stringify(mensaje)}`)
           }

        })
        .catch(error=>{
            console.log(error)
            mensaje.texto="No se puedo conectar con el servidor"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/tipo-cam${JSON.stringify(mensaje)}`)
        })
    }

    regresar(){
        this.props.history.push("/dashboard/configuracion/tipo-cam");
    }

    actualizar(){
        this.props.history.push("/dashboard/configuracion/tipo-cam/actualizar/"+this.state.id_tipo_cam)
    }

	render(){

		const jsx_tipo_cam_consulta=(
            <div className="row justify-content-center">
               <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_tipo_cam_consulta">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-tipo-cam-consulta">
                            <span className="titulo-tipo-cam-consulta">Tipo CAM consultado: {this.state.nombre_tipo_cam}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Codigo Tipo CAM: </span>
                            <span className="valor">{this.state.id_tipo_cam}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Nombre Tipo CAM: </span>
                            <span className="valor">{this.state.nombre_tipo_cam}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Estatus Tipo CAM: </span>
                            <span className="valor">{this.state.estatu_tipo_cam}</span>
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
			<div className="component_tipo_cam_consulta">
                <ComponentDashboard
                eventoPadreMenu={this.mostrarModulo}
                modulo={this.state.modulo}
                estado_menu={this.state.estado_menu}
                componente={jsx_tipo_cam_consulta}
                />
            </div>

		)
	}
}

export default withRouter(ComponentTipoCamConsulta)