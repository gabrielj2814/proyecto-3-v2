import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentEspecialidadConsulta.css'
//JS
import axios from 'axios'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'


class ComponentEspecialidadConsulta extends React.Component{
    constructor(){
        super();
		this.mostrarModulo=this.mostrarModulo.bind(this);
        this.regresar=this.regresar.bind(this);
        this.actualizar=this.actualizar.bind(this)
        this.state={
            modulo:"",
            estado_menu:false,
            //////
            id_especialidad:"" ,
            nombre_especialidad:"" ,
            estatu_especialidad:"1",
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
        await this.consultarEspecialidad(id)
    }

    async consultarEspecialidad(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        const token=localStorage.getItem('usuario')
        await axios.get(`http://localhost:8080/configuracion/especialidad/consultar/${id}/${token}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
           if(respuesta_servidor.estado_peticion==="200"){
                const id_especialidad=respuesta_servidor.especialidad.id_especialidad,
                nombre_especialidad=respuesta_servidor.especialidad.nombre_especialidad,
                estatu_especialidad=(respuesta_servidor.especialidad.estatu_especialidad==="1")?"Activo":"Inactivo"

                this.setState({
                    id_especialidad:id_especialidad,
                    nombre_especialidad:nombre_especialidad,
                    estatu_especialidad:estatu_especialidad
                })
                
           }
           else if(respuesta_servidor.estado_peticion==="404"){
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                this.props.history.push(`/dashboard/configuracion/estado${JSON.stringify(mensaje)}`)
           }

        })
        .catch(error=>{
            console.log(error)
            mensaje.texto="No se puedo conectar con el servidor"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/estado${JSON.stringify(mensaje)}`)
        })
    }

    regresar(){
        this.props.history.push("/dashboard/configuracion/especialidad");
    }

    actualizar(){
        this.props.history.push("/dashboard/configuracion/especialidad/actualizar/"+this.state.id_especialidad)
    }

    render(){
        const jsx_especialidad_consulta=(
            <div className="row justify-content-center">
               <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_especialidad_consulta">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-especialidad-consulta">
                            <span className="titulo-especialidad-consulta">Especialidad consultado: {this.state.nombre_especialidad}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Código del Especialidad: </span>
                            <span className="valor">{this.state.id_especialidad}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Descripción del Especialidad: </span>
                            <span className="valor">{this.state.nombre_especialidad}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Estatus del Especialidad: </span>
                            <span className="valor">{this.state.estatu_especialidad}</span>
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
            <div className="component_especialidad_consulta">
                <ComponentDashboard
                eventoPadreMenu={this.mostrarModulo}
                modulo={this.state.modulo}
                estado_menu={this.state.estado_menu}
                componente={jsx_especialidad_consulta}
                />
            </div>

        )
    }

}

export default withRouter(ComponentEspecialidadConsulta)