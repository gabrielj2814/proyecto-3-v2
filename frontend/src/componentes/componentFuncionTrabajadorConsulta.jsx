import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentFuncionTrabajadorConsulta.css'
//JS
import axios from 'axios'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button' 

class ComponentFuncionTrabajadorConsulta extends React.Component{

    constructor(){
        super();
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.actualizar=this.actualizar.bind(this);
        this.regresar=this.regresar.bind(this);
        this.state={
            modulo:"",
            estado_menu:false,
            //////
            id_funcion_trabajador:"" ,
            funcion_descripcion:"" ,
            descripcion_tipo_trabajador:"" ,
            estatu_funcion_trabajador:"1",
        }
    }

    async UNSAFE_componentWillMount(){
        const id=this.props.match.params.id
        this.consultarFuncionTrabajador(id)
    }

    async consultarFuncionTrabajador(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        const token=localStorage.getItem('usuario')
        await axios.get(`http://localhost:8080/configuracion/funcion-trabajador/consultar/${id}/${token}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            if(respuesta_servidor.estado_peticion==="200"){
                this.setState({
                    id_funcion_trabajador:respuesta_servidor.funciones.id_funcion_trabajador,
                    funcion_descripcion:respuesta_servidor.funciones.funcion_descripcion,
                    descripcion_tipo_trabajador:respuesta_servidor.funciones.descripcion_tipo_trabajador,
                    estatu_funcion_trabajador:(respuesta_servidor.funciones.estatu_funcion_trabajador==="1")?"Activo":"Incativo",
                })
            }
            else if(respuesta_servidor.estado_peticion==="404"){
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                this.props.history.push(`/dashboard/configuracion/funcion-trabajador${JSON.stringify(mensaje)}`)
            }

        })
        .catch(error=>{
            console.log(error)
            mensaje.texto="No se puedo conectar con el servidor"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/funcion-trabajador${JSON.stringify(mensaje)}`)
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
        this.props.history.push(`/dashboard/configuracion/funcion-trabajador/actualizar/${this.props.match.params.id}`)
    }

    regresar(){
        this.props.history.push("/dashboard/configuracion/funcion-trabajador");
    }

    render(){
        const jsx_funcion_trabajador_consulta=(
            <div className="row justify-content-center">
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_funcion_trabajador_consulta">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-funcion-trabajador-consulta">
                            <span className="titulo-funcion-trabajador-consulta">Funcion Trabajador : {this.state.id_funcion_trabajador} </span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Codigo funcion: </span>
                            <span className="valor">{this.state.id_funcion_trabajador}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Nombre: </span>
                            <span className="valor">{this.state.funcion_descripcion}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Tipo de Trabajador: </span>
                            <span className="valor">{this.state.descripcion_tipo_trabajador}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Estatus Funcion: </span>
                            <span className="valor">{this.state.estatu_funcion_trabajador}</span>
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

        return (
            <div className="component_funcion_trabajador_consulta">
                <ComponentDashboard
                eventoPadreMenu={this.mostrarModulo}
                modulo={this.state.modulo}
                estado_menu={this.state.estado_menu}
                componente={jsx_funcion_trabajador_consulta}
                />
            </div>
        )
    }

}

export default withRouter(ComponentFuncionTrabajadorConsulta)