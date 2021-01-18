import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentTrabajadorConsulta.css'
//JS
import axios from 'axios'
import Moment from 'moment'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'

class ComponentTrabajadorConsulta extends React.Component{

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.regresar=this.regresar.bind(this);
        this.actualizar=this.actualizar.bind(this)
        this.state={
            modulo:"",// modulo menu
            estado_menu:false,
            //formulario
            id_cedula:"",
            nombres:"",
            apellidos:"",
            telefono_movil:"",
            telefono_local:"",
            correo:"",
            grado_instruccion:"",
            fecha_nacimiento:"",
            fecha_ingreso:"",
            direccion:"",
            id_perfil:"",
            id_tipo_trabajador:"",
            id_funcion_trabajador:"",
            estatu_trabajador:"",
            sexo_trabajador:"",
            designacion:"",
            ////parametros de modulos relacionados
            descripcion_tipo_trabajador:"",
            nombre_perfil:"",
            funcion_descripcion:"",
            estatu_cuenta:"",

            mensaje:{
                texto:"",
                estado:""
              }
        }
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

    async UNSAFE_componentWillMount(){
        const id=this.props.match.params.id
        await this.consultarTrabajador(id)
    }

    async consultarTrabajador(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        const token=localStorage.getItem('usuario')
        await axios.get(`http://localhost:8080/configuracion/trabajador/consultar/${id}/${token}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            console.log(respuesta_servidor)
            if(respuesta_servidor.estado_peticion==="200"){
                const id_cedula=respuesta_servidor.trabajador.id_cedula,
                nombres=respuesta_servidor.trabajador.nombres,
                apellidos=respuesta_servidor.trabajador.apellidos,
                sexo_trabajador=(respuesta_servidor.trabajador.sexo_trabajador==="1")?"Masculino":"Femenino",
                telefono_movil=(respuesta_servidor.trabajador.telefono_movil==="N-O")?"No Tiene":respuesta_servidor.trabajador.telefono_movil,
                telefono_local=(respuesta_servidor.trabajador.telefono_local==="N-O")?"No Tiene":respuesta_servidor.trabajador.telefono_local,
                correo=(respuesta_servidor.trabajador.correo==="N-O")?"No Tiene":respuesta_servidor.trabajador.correo,
                direccion=respuesta_servidor.trabajador.direccion,
                grado_instruccion=respuesta_servidor.trabajador.grado_instruccion,
                designacion=(respuesta_servidor.trabajador.designacion==="1")?"Activo":"Inactivo",
                fecha_nacimiento=Moment(respuesta_servidor.trabajador.fecha_nacimiento).format("DD-MM-YYYY"),
                fecha_ingreso=Moment(respuesta_servidor.trabajador.fecha_ingreso).format("DD-MM-YYYY"),
                estatu_trabajador=(respuesta_servidor.trabajador.estatu_trabajador==="1")?"Activo":"Inactivo",
                estatu_cuenta=(respuesta_servidor.trabajador.estatu_cuenta==="1")?"Activo":"Inactivo",
                descripcion_tipo_trabajador=respuesta_servidor.trabajador.descripcion_tipo_trabajador,
                nombre_perfil=respuesta_servidor.trabajador.nombre_perfil,
                funcion_descripcion=respuesta_servidor.trabajador.funcion_descripcion
                this.setState({
                    id_cedula:id_cedula,
                    nombres:nombres,
                    apellidos:apellidos,
                    telefono_movil:telefono_movil,
                    telefono_local:telefono_local,
                    correo:correo,
                    grado_instruccion:grado_instruccion,
                    fecha_nacimiento:fecha_nacimiento,
                    fecha_ingreso:fecha_ingreso,
                    direccion:direccion,
                    estatu_trabajador:estatu_trabajador,
                    sexo_trabajador:sexo_trabajador,
                    designacion:designacion,
                    descripcion_tipo_trabajador:descripcion_tipo_trabajador,
                    nombre_perfil:nombre_perfil,
                    funcion_descripcion:funcion_descripcion,
                    estatu_cuenta:estatu_cuenta,
                })
            }
           else if(respuesta_servidor.estado_peticion==="404"){
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                this.props.history.push(`/dashboard/configuracion/trabajador${JSON.stringify(mensaje)}`)
           }
        })
        .catch(error=>{
            console.log(error)
            mensaje.texto="No se puedo conectar con el servidor"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/trabajador${JSON.stringify(mensaje)}`)
        })
    }

    actualizar(){
        this.props.history.push("/dashboard/configuracion/trabajador/actualizar/"+this.props.match.params.id);
    }

    regresar(){
        this.props.history.push("/dashboard/configuracion/trabajador");
    }

    render(){
        var jsx_trabajador_consulta=(
            <div className="row justify-content-center">
               <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_trabajador_consulta">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-trabajador-consulta">
                            <span className="titulo-trabajador-consulta">Trabajador consultado: {this.state.nombres+" "+this.state.apellidos}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Cedula: </span>
                            <span className="valor">{this.state.id_cedula}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">nombre: </span>
                            <span className="valor">{this.state.nombres}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">apellido: </span>
                            <span className="valor">{this.state.apellidos}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">telefono movil: </span>
                            <span className="valor">{this.state.telefono_movil}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">telefono local: </span>
                            <span className="valor">{this.state.telefono_local}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">correo: </span>
                            <span className="valor">{this.state.correo}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">sexo: </span>
                            <span className="valor">{this.state.sexo_trabajador}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">fecha de nacimiento: </span>
                            <span className="valor">{this.state.fecha_nacimiento}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">fecha de ingreso: </span>
                            <span className="valor">{this.state.fecha_ingreso}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">estatu trabajador: </span>
                            <span className="valor">{this.state.estatu_trabajador}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">estatu cuenta: </span>
                            <span className="valor">{this.state.estatu_cuenta}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">estatu designacion: </span>
                            <span className="valor">{this.state.designacion}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">perfil de usuario: </span>
                            <span className="valor">{this.state.nombre_perfil}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">tipo de trabajador: </span>
                            <span className="valor">{this.state.descripcion_tipo_trabajador}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">funcion del trabajador: </span>
                            <span className="valor">{this.state.funcion_descripcion}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">grado de instrucción: </span>
                            <span className="valor">{this.state.grado_instruccion}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">dirección: </span>
                            <span className="valor">{this.state.direccion}</span>
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
            <div className="component_trabajador_consulta">
                <ComponentDashboard
                componente={jsx_trabajador_consulta}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />
            </div>
        )
    }

}

export default  withRouter(ComponentTrabajadorConsulta)
