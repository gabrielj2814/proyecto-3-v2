import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentTrabajadorConsulta.css'
//JS
import axios from 'axios'
import Moment from 'moment'
// IP servidor
import servidor from '../ipServer.js'
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
        let acessoModulo=await this.validarAccesoDelModulo("/dashboard/configuracion","/trabajador")
        if(acessoModulo){
            const id=this.props.match.params.id
            await this.consultarTrabajador(id)
        }
        else{
            alert("no tienes acesso a este modulo(sera redirigido a la vista anterior)")
            this.props.history.goBack()
        }
        
    }

    async validarAccesoDelModulo(modulo,subModulo){
        // /dashboard/configuracion/acceso
        let estado = false
          if(localStorage.getItem("usuario")){
            var respuesta_servior=""
            const token=localStorage.getItem("usuario")
            await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/login/verificar-sesion${token}`)
            .then(async respuesta=>{
                respuesta_servior=respuesta.data
                if(respuesta_servior.usuario){
                  estado=await this.consultarPerfilTrabajador(modulo,subModulo,respuesta_servior.usuario.id_perfil)
                }  
            })
        }
        return estado
      }
  
      async consultarPerfilTrabajador(modulo,subModulo,idPerfil){
        let estado=false
        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/acceso/consultar/${idPerfil}`)
        .then(repuesta => {
            let json=JSON.parse(JSON.stringify(repuesta.data))
            // console.log("datos modulos =>>>",json)
            let modulosSistema={}
            let modulosActivos=json.modulos.filter( modulo => {
                if(modulo.estatu_modulo==="1"){
                    return modulo
                }
            })
            // console.log("datos modulos =>>>",modulosActivos);
            for(let medulo of modulosActivos){
                if(modulosSistema[medulo.modulo_principal]){
                    modulosSistema[medulo.modulo_principal][medulo.sub_modulo]=true
                }
                else{
                    modulosSistema[medulo.modulo_principal]={}
                    modulosSistema[medulo.modulo_principal][medulo.sub_modulo]=true
                }
            }
            console.log(modulosSistema)
            if(modulosSistema[modulo][subModulo]){
              estado=true
            }
            // this.setState({modulosSistema})
            
            
        })
        .catch(error =>  {
            console.log(error)
        })
        return estado
    }

    async consultarTrabajador(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        const token=localStorage.getItem('usuario')
        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/trabajador/consultar/${id}/${token}`)
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
                            <span className="titulo-trabajador-consulta">Trabajador Consultado: {this.state.nombres+" "+this.state.apellidos}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Cédula: </span>
                            <span className="valor">{this.state.id_cedula}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Nombre: </span>
                            <span className="valor">{this.state.nombres}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Apellido: </span>
                            <span className="valor">{this.state.apellidos}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Teléfono Movil: </span>
                            <span className="valor">{this.state.telefono_movil}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Teléfono Local: </span>
                            <span className="valor">{this.state.telefono_local}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Correo: </span>
                            <span className="valor">{this.state.correo}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Sexo: </span>
                            <span className="valor">{this.state.sexo_trabajador}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Fecha de Nacimiento: </span>
                            <span className="valor">{this.state.fecha_nacimiento}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Fecha de Ingresó: </span>
                            <span className="valor">{this.state.fecha_ingreso}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Estatus Trabajador: </span>
                            <span className="valor">{this.state.estatu_trabajador}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Estatus Cuenta: </span>
                            <span className="valor">{this.state.estatu_cuenta}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Estatu Designación: </span>
                            <span className="valor">{this.state.designacion}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Perfil de Usuario: </span>
                            <span className="valor">{this.state.nombre_perfil}</span>
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
                            <span className="propiedad">Función del Trabajador: </span>
                            <span className="valor">{this.state.funcion_descripcion}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Grado de Instrucción: </span>
                            <span className="valor">{this.state.grado_instruccion}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Dirección: </span>
                            <span className="valor">{this.state.direccion}</span>
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
