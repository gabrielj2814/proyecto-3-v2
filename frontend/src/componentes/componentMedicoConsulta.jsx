import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentMedicoConsulta.css'
//JS
import axios from 'axios'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'

class ComponentMedicoConsulta extends React.Component{
	constructor(){
		super();
		this.mostrarModulo=this.mostrarModulo.bind(this);
        this.regresar=this.regresar.bind(this);
        this.actualizar=this.actualizar.bind(this)
        this.state={
            modulo:"",
            estado_menu:false,
            //////
            id_medico:"" ,
            nombre_medico:"" ,
            apellido_medico:"" ,
            estatu_medico:"1",
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
        await this.consultarMedico(id)
    }

    async consultarMedico(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        await axios.get(`http://localhost:8080/configuracion/medico/consultar/${id}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
           if(respuesta_servidor.estado_peticion==="200"){
                const id_medico=respuesta_servidor.medico.id_medico,
                nombre_medico=respuesta_servidor.medico.nombre_medico,
                apellido_medico=respuesta_servidor.medico.apellido_medico,
                estatu_medico=(respuesta_servidor.medico.estatu_medico==="1")?"Activo":"Inactivo"

                this.setState({
                    id_medico:id_medico,
                    nombre_medico:nombre_medico,
                    apellido_medico:apellido_medico,
                    estatu_medico:estatu_medico
                })
                
           }
           else if(respuesta_servidor.estado_peticion==="404"){
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                this.props.history.push(`/dashboard/configuracion/medico${JSON.stringify(mensaje)}`)
           }

        })
        .catch(error=>{
            console.log(error)
            mensaje.texto="No se puedo conectar con el servidor"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/medico${JSON.stringify(mensaje)}`)
        })
    }

    regresar(){
        this.props.history.push("/dashboard/configuracion/medico");
    }

    actualizar(){
        this.props.history.push("/dashboard/configuracion/medico/actualizar/"+this.state.id_medico)
    }

	render(){

		const jsx_medico_consulta=(
            <div className="row justify-content-center">
               <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_medico_consulta">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-medico-consulta">
                            <span className="titulo-medico-consulta">Medico Consultado: {this.state.nombre_medico}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3">
                            <span className="propiedad">Codigo del Medico: </span>
                            <span className="valor">{this.state.id_medico}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4 col-ms-4 col-md-4 col-lg-4 col-xl-4">
                            <span className="propiedad">Nombre del Medico: </span>
                            <span className="valor">{this.state.nombre_medico}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4 col-ms-4 col-md-4 col-lg-4 col-xl-4">
                            <span className="propiedad">Apellido del Medico: </span>
                            <span className="valor">{this.state.apellido_medico}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3">
                            <span className="propiedad">Estatus del Medico: </span>
                            <span className="valor">{this.state.estatu_medico}</span>
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
			<div className="component_medico_consulta">
                <ComponentDashboard
                eventoPadreMenu={this.mostrarModulo}
                modulo={this.state.modulo}
                estado_menu={this.state.estado_menu}
                componente={jsx_medico_consulta}
                />
            </div>
		)
	}
}

export default withRouter(ComponentMedicoConsulta)