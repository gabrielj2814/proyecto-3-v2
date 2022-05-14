import React from "react";
import {withRouter} from "react-router-dom"
import axios from "axios"
// IP servidor
import servidor from '../ipServer.js'
// css
import "../css/componentCamConsulta.css"
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'
class ComponentCamConsultar extends React.Component{

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.regresar=this.regresar.bind(this);
        this.actualizar=this.actualizar.bind(this)
        this.state={
            modulo:"",
            estado_menu:false,
            //////
            id_cam:null,
            nombre_cam:"",
            telefono_cam:"",
            direccion_cam:"",
            id_tipo_cam:"",
            id_estado:"",
            id_ciudad:"",
            estatu_cam:"",
            ubicacion:"",
            nombre_tipo_cam:""
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

    async componentWillMount(){
        let acessoModulo=await this.validarAccesoDelModulo("/dashboard/configuracion","/cam")
        if(acessoModulo){
            const {id}= this.props.match.params
            let datosCam=await this.consultarIdConsultar(id)
            if(this.state.id_cam!==null){
                console.log("datos cam -->>> ,",datosCam)
                let ciudad=await this.consultarCiudad(this.state.id_ciudad);
                console.log("datos ciudad -->>> ,",ciudad)
                let estado=await this.consultarEstado(this.state.id_estado);
                console.log("datos estado -->>> ,",estado)
                let tipoCam=await this.consultarTipoCam(this.state.id_tipo_cam);
                console.log("datos tipo cam -->>> ,",tipoCam)
                let ubicacion=`Está ubicado en el estado ${estado.nombre_estado}, en la ciudad de ${ciudad.nombre_ciudad}`
                let nombre_tipo_cam=tipoCam.nombre_tipo_cam
                this.setState({
                    ubicacion,
                    nombre_tipo_cam
                })
            }
        }
        else{
            alert("No tienes acesso a este modulo(sera redirigido a la vista anterior)")
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

    async consultarIdConsultar(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        let datos=[]
        const token=localStorage.getItem('usuario')
        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/cam/consultar/${id}/${token}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            if(respuesta_servidor.estado_peticion==="200"){
                // console.log(respuesta_servidor.cam)
                this.setState(respuesta_servidor.cam)
                datos=JSON.parse(JSON.stringify(respuesta_servidor.cam))
            }
            else if(respuesta_servidor.estado_peticion==="404"){
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                this.props.history.push(`/dashboard/configuracion/cam${JSON.stringify(mensaje)}`)
            }
        })
        .catch(error=>{
            console.log(error)
            mensaje.texto="No se puedo conectar con el servidor"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/cam${JSON.stringify(mensaje)}`)
        })
        return datos
    }

    async consultarCiudad(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        var ciudad={}
        const token=localStorage.getItem('usuario')
        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/ciudad/consultar/${id}/${token}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            ciudad=respuesta_servidor.ciudad
            this.setState({id_estado:ciudad.id_estado})

        })
        .catch(error=>{
            console.log(error)
            mensaje.texto="No se puedo conectar con el servidor"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/cam${JSON.stringify(mensaje)}`)
        })
        return ciudad
    }

    async consultarEstado(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        let estado=null
        const token=localStorage.getItem('usuario')
        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/estado/consultar/${id}/${token}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            estado=respuesta_servidor.estado

        })
        .catch(error=>{
            console.log(error)
            mensaje.texto="No se puedo conectar con el servidor"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/cam${JSON.stringify(mensaje)}`)
        })
        return estado
    }

    async consultarTipoCam(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        let tipoCam=null
        const token=localStorage.getItem('usuario')
        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/tipo-cam/consultar/${id}/${token}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            tipoCam=respuesta_servidor.tipo_cam

        })
        .catch(error=>{
            console.log(error)
            mensaje.texto="No se puedo conectar con el servidor"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/cam${JSON.stringify(mensaje)}`)
        })
        return tipoCam
    }

    regresar(){
        this.props.history.push("/dashboard/configuracion/cam");
    }

    actualizar(){
        this.props.history.push("/dashboard/configuracion/cam/actualizar/"+this.state.id_cam)
    }

    render(){
        const component=(
            <div className="row justify-content-center">
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_cam_consulta">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-cam-consulta">
                            <span className="titulo-cam-consulta">CAM Consultado: {this.state.nombre_cam}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Código de CAM: </span>
                            <span className="valor font-weight-bold">{this.state.id_cam}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Nombre: </span>
                            <span className="valor font-weight-bold">{this.state.nombre_cam}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Téléfono: </span>
                            <span className="valor font-weight-bold">{this.state.telefono_cam}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Ubicación: </span>
                            <span className="valor font-weight-bold">{this.state.ubicacion}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Dirección: </span>
                            <span className="valor font-weight-bold">{this.state.direccion_cam}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Tipo de Centro: </span>
                            <span className="valor font-weight-bold">{this.state.nombre_tipo_cam}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                            <span className="propiedad">Estatus: </span>
                            <span className="valor font-weight-bold">{(this.state.estatu_cam==="1")?"Activo":"Inactivo"}</span>
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

        return (
            <div className="component_cam_consulta">
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

export default withRouter(ComponentCamConsultar)