import React from 'react'
import {withRouter} from 'react-router-dom'
import axios from 'axios'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentAccesoConsulta.css'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes 
import InputButton from '../subComponentes/input_button'

class ComponentAccesoConsulta extends React.Component {

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.obtenerRutaModulo=this.obtenerRutaModulo.bind(this);
        this.regresar=this.regresar.bind(this);
        this.actualizar=this.actualizar.bind(this)
        this.state={
            modulo:"",
            estado_menu:false,
            //////
            id_perfil:"",
            nombre_perfil:"",
            estatu_perfil:"",
            lista_modulos:[],
            // modulos del sistema
            modulos_principales:[
                {descripcion:"configuracion",id:"/dashboard/configuracion"}, 
                {descripcion:"reporte",id:"/dashboard/reporte"},
                {descripcion:"transaccion",id:"/dashboard/transaccion"},
                {descripcion:"seguridad",id:"/dashboard/seguridad"}
            ],
            sub_modulos:{
                configuracion:[
                    {descripcion:"acceso",id:"/acceso"},
                    {descripcion:"trabajador",id:"/trabajador"}, 
                    {descripcion:"medico",id:"/medico"}, 
                    {descripcion:"cam",id:"/cam"}, 
                    {descripcion:"tipo cam",id:"/tipo-cam"}, 
                ],
                reporte:[
                    {descripcion:"reporte trabajador",id:"/reporte-trabajador"}
                ],
                transaccion:[
                    {descripcion:"reposo trabajador",id:"/reposo"},
                    {descripcion:"permiso trabajador",id:"/permiso"}
                ],
                seguridad:[
                    {descripcion:"vitacora",id:"/vitacora"},
                ]
            }
        }
    }

    async consultarPerfil(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        await axios.get(`http://localhost:8080/configuracion/acceso/consultar/${id}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
           if(respuesta_servidor.estado_peticion==="200"){
                var id_perfil=respuesta_servidor.perfil.id_perfil,
                nombre_perfil=respuesta_servidor.perfil.nombre_perfil,
                estatu_perfil=(respuesta_servidor.perfil.estatu_perfil==="1")?"activo":"inactivo",
                lista_modulos=respuesta_servidor.modulos
                this.setState({
                    id_perfil:id_perfil,
                    nombre_perfil:nombre_perfil,
                    estatu_perfil:estatu_perfil,
                    lista_modulos:lista_modulos})
           }
           else if(respuesta_servidor.estado_peticion==="404"){
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                this.props.history.push(`/dashboard/configuracion/acceso${JSON.stringify(mensaje)}`)
           }

        })
        .catch(error=>{
            console.log(error)
            mensaje.texto="No se puedo conectar con el servidor"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/acceso${JSON.stringify(mensaje)}`)
        })
    }

    obtenerRutaModulo(ruta){
        const ruta_cortada=ruta.split("/")
        return ruta_cortada[ruta_cortada.length-1]
    }

    async UNSAFE_componentWillMount(){
        const id=this.props.match.params.id;
        await this.consultarPerfil(id)
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

    regresar(){
        this.props.history.push("/dashboard/configuracion/acceso");
    }

    actualizar(){
        this.props.history.push("/dashboard/configuracion/acceso/actualizar/"+this.state.id_perfil)
    }

    render(){
        const jsx_acceso_consulta=(
            <div className="row justify-content-center">
               <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_acceso_consulta">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-acceso-consulta">
                            <span className="titulo-acceso-consulta">Perfil consultado: {this.state.nombre_perfil}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3">
                            <span className="propiedad">Codigo Perfil: </span>
                            <span className="valor">{this.state.id_perfil}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3">
                            <span className="propiedad">Nombre Perfil: </span>
                            <span className="valor">{this.state.nombre_perfil}</span>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3">
                            <span className="propiedad">Estatus Perfil: </span>
                            <span className="valor">{this.state.estatu_perfil}</span>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-acceso-consulta">
                            <span className="sub-titulo-acceso-consulta">Modulos</span>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3 ">
                            Modulo Principal
                        </div>
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3 ">
                            Sub Modulo
                        </div>
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3 ">
                            Estatus Modulo
                        </div>
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"></div>
                    </div>
                    <div className="contenedor-lista-modulos-consulta">
                        {this.state.lista_modulos.map((modulos)=>{
                            return(
                                <div className="row justify-content-center mb-4" key={modulos.modulo_principal}>
                                    <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3">
                                        {this.obtenerRutaModulo(modulos.modulo_principal)}
                                    </div>
                                    <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3">
                                        {this.obtenerRutaModulo(modulos.sub_modulo)}
                                    </div>
                                    <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3">
                                        {(modulos.estatu_modulo==="1")?"activo":"inactivo"}
                                    </div>
                                    <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"></div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="row justify-content-center mb-4">
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3 ">
                            Modulos en total: {this.state.lista_modulos.length}
                        </div>
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"></div>
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3 offset-3 offset-ms-3 offset-md-3 offset-lg-3 offset-xl-3"></div>
                    </div>
                    
                    <div className="row justify-content-center ">
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
            <div className="component_accceso_consulta">
                <ComponentDashboard
                eventoPadreMenu={this.mostrarModulo}
                modulo={this.state.modulo}
                estado_menu={this.state.estado_menu}
                componente={jsx_acceso_consulta}
                />
            </div>
        )
    }

}

export default withRouter(ComponentAccesoConsulta)