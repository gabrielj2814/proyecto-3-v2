import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentCiudadConsulta.css'
//JS
import axios from 'axios'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button' 


class ComponentCiudadConsulta extends React.Component{
	constructor(){
		super();
		this.mostrarModulo=this.mostrarModulo.bind(this);
        this.actualizar=this.actualizar.bind(this);
        this.regresar=this.regresar.bind(this);
        this.state={
            modulo:"",
            estado_menu:false,
            //////
            id_ciudad:"" ,
            nombre_ciudad:"" ,
            nombre_estado:"" ,
            estatu_ciudad:"1",
        }
	}

	async UNSAFE_componentWillMount(){
        const id=this.props.match.params.id
        this.consultarCiudad(id)
    }

    async consultarCiudad(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        const token=localStorage.getItem('usuario')
        await axios.get(`http://localhost:8080/configuracion/ciudad/consultar/${id}/${token}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            if(respuesta_servidor.estado_peticion==="200"){
                this.setState({
                    id_ciudad:respuesta_servidor.ciudad.id_ciudad,
                    nombre_ciudad:respuesta_servidor.ciudad.nombre_ciudad,
                    estatu_ciudad:(respuesta_servidor.ciudad.estatu_ciudad==="1")?"Activo":"Incativo",
                })
                this.consultarEstadoCiudad(respuesta_servidor.ciudad.id_estado)
            }
            else if(respuesta_servidor.estado_peticion==="404"){
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                this.props.history.push(`/dashboard/configuracion/ciudad${JSON.stringify(mensaje)}`)
            }

        })
        .catch(error=>{
            console.log(error)
            mensaje.texto="No se puedo conectar con el servidor"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/ciudad${JSON.stringify(mensaje)}`)
        })
    }



    async consultarEstadoCiudad(id){
        let respuesta_servidor=null
        const token=localStorage.getItem('usuario')
        await axios.get(`http://localhost:8080/configuracion/estado/consultar/${id}/${token}`)
        .then(respuesta => {
            respuesta_servidor=respuesta.data
            let nombre_estado=respuesta_servidor.estado.nombre_estado
            console.log("estado --->>>> ",nombre_estado)
            this.setState({nombre_estado})
        })

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

    actualizar(){
        this.props.history.push(`/dashboard/configuracion/ciudad/actualizar/${this.props.match.params.id}`)
    }

    regresar(){
        this.props.history.push("/dashboard/configuracion/ciudad");
    }

    render(){

    	const jsx_ciudad_consulta=(
            <div className="row justify-content-center">
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_ciudad_consulta">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-ciudad-consulta">
                            <span className="titulo-ciudad-consulta">Ciudad : {this.state.nombre_ciudad} </span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Código Ciudad: </span>
                            <span className="valor">{this.state.id_ciudad}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Nombre: </span>
                            <span className="valor">{this.state.nombre_ciudad}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Estado: </span>
                            <span className="valor">{this.state.nombre_estado}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Estatus Ciudad: </span>
                            <span className="valor">{this.state.estatu_ciudad}</span>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-auto">
                            <InputButton 
                            clasesBoton="btn btn-warning"
                            id="boton-actualizar"
                            value="Actualizar"
                            eventoPadre={this.actualizar}
                            />
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
                </div>
            </div>
        )

    	return(
    		<div className="component_ciudad_consulta">
                <ComponentDashboard
                eventoPadreMenu={this.mostrarModulo}
                modulo={this.state.modulo}
                estado_menu={this.state.estado_menu}
                componente={jsx_ciudad_consulta}
                />
            </div>
    	)

    }


}

export default withRouter(ComponentCiudadConsulta)