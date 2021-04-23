import React from "react"
import {withRouter} from "react-router-dom"
import axios from "axios"

// css
import "../css/componentAsignacionEspecialidadMedicoConsulta.css"
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'

class ComponentAsignacionEspecialidadMedicoConsulta extends React.Component{

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.regresar=this.regresar.bind(this);
        this.actualizar=this.actualizar.bind(this)
        this.state={
            modulo:"",
            estado_menu:false,
            //////
            id_asignacion_medico_especialidad:"",
            nombre_medico:"",
            apellido_medico:"",
            nombre_especialidad:"",
            estatu_asignacion:"0"

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
        const {id} =this.props.match.params
        let datosAsignacion=await this.consultarAsignacion(id)
        console.log("datos consultados ->>>> ",datosAsignacion)
        this.setState(datosAsignacion)

    }

    async consultarAsignacion(id){
        var respuesta_servidor=null
        var mensaje={texto:"",estado:""}
        const token=localStorage.getItem('usuario')
        await axios.get(`http://localhost:8080/configuracion/asignacion-medico-especialidad/consultar/${id}/${token}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data.medico_especialidad
            console.log(respuesta.data)
        })
        .catch(error=>{
            console.log(error)
            mensaje.texto="No se puedo conectar con el servidor"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/asignacion-especialidad-medico${JSON.stringify(mensaje)}`)
        })
        return respuesta_servidor;
    }

    regresar(){
        this.props.history.push("/dashboard/configuracion/asignacion-especialidad-medico");
    }

    actualizar(){
        this.props.history.push("/dashboard/configuracion/asignacion-especialidad-medico/actualizar/"+this.state.id_asignacion_medico_especialidad)
    }

    render(){
        const component=(
            <div className="row justify-content-center">
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_asignacion_consulta">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-asignacion-consulta">
                            <span className="titulo-cam-consulta">Asignación del Médico Consultado: {this.state.nombre_medico} {this.state.apellido_medico}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Código de Asignación: </span>
                            <span className="valor">{this.state.id_asignacion_medico_especialidad}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Nombre Médico: </span>
                            <span className="valor">{this.state.nombre_medico} {this.state.apellido_medico}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Especialidad Médico: </span>
                            <span className="valor">{this.state.nombre_especialidad}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Estatus: </span>
                            <span className="valor">{(this.state.estatu_asignacion==="1")?"Activo":"Inactivo"}</span>
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
            <div className="component_asignacion_consulta">
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

export default withRouter(ComponentAsignacionEspecialidadMedicoConsulta)