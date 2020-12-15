import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentPermisoConsulta.css'
//JS
import axios from 'axios'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'

class ComponentPermisoConsulta extends React.Component{

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.regresar=this.regresar.bind(this);
        this.actualizar=this.actualizar.bind(this)
        this.state={
            modulo:"",
            estado_menu:false,
            //////
            id_permiso:"",
            nombre_permiso:"",
            dias_permiso:"",
            estatu_permiso:"1",
            estatu_remunerado:"1",
            estatu_dias_aviles:"1",
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
        await this.consultarPermiso(id)
    }

    async consultarPermiso(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        await axios.get(`http://localhost:8080/configuracion/permiso/consultar/${id}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            if(respuesta_servidor.estado_peticion==="200"){
                const id_permiso=respuesta_servidor.permiso.id_permiso,
                nombre_permiso=respuesta_servidor.permiso.nombre_permiso,
                dias_permiso=respuesta_servidor.permiso.dias_permiso,
                estatu_permiso=(respuesta_servidor.permiso.estatu_permiso==="1")?"Activo":"Inactivo",
                estatu_dias_aviles=(respuesta_servidor.permiso.estatu_dias_aviles==="1")?"Activo":"Inactivo",
                estatu_remunerado=(respuesta_servidor.permiso.estatu_remunerado==="1")?"Activo":"Inactivo"
                this.setState({
                    id_permiso:id_permiso,
                    nombre_permiso:nombre_permiso,
                    dias_permiso:dias_permiso,
                    estatu_permiso:estatu_permiso,
                    estatu_dias_aviles:estatu_dias_aviles,
                    estatu_remunerado:estatu_remunerado
                })
                
            }
            else if(respuesta_servidor.estado_peticion==="404"){
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                this.props.history.push(`/dashboard/configuracion/permiso${JSON.stringify(mensaje)}`)
            }

        })
        .catch(error=>{
            console.log(error)
            mensaje.texto="No se puedo conectar con el servidor"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/permiso${JSON.stringify(mensaje)}`)
        })
    }

    regresar(){
        this.props.history.push("/dashboard/configuracion/permiso");
    }

    actualizar(){
        this.props.history.push("/dashboard/configuracion/permiso/actualizar/"+this.state.id_permiso)
    }

    render(){
        const jsx_permiso_consulta=(
            <div className="row justify-content-center">
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_permiso_consulta">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-permiso-consulta">
                            <span className="titulo-permiso-consulta">Permiso consultado: {this.state.nombre_permiso}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3">
                            <span className="propiedad">Codigo Permiso: </span>
                            <span className="valor">{this.state.id_permiso}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3">
                            <span className="propiedad">Nombre Permiso: </span>
                            <span className="valor">{this.state.nombre_permiso}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3">
                            <span className="propiedad">Estatu Permiso: </span>
                            <span className="valor">{this.state.estatu_permiso}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3">
                            <span className="propiedad">Dias Permiso: </span>
                            <span className="valor">{this.state.dias_permiso}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3">
                            <span className="propiedad">Estatu Dias Aviles: </span>
                            <span className="valor">{this.state.estatu_dias_aviles}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3">
                            <span className="propiedad">Estatu Remunerado: </span>
                            <span className="valor">{this.state.estatu_remunerado}</span>
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
            <div className="component_permiso_consulta">
                <ComponentDashboard
                eventoPadreMenu={this.mostrarModulo}
                modulo={this.state.modulo}
                estado_menu={this.state.estado_menu}
                componente={jsx_permiso_consulta}
                />
            </div>
        )
    }

}

export default withRouter(ComponentPermisoConsulta)