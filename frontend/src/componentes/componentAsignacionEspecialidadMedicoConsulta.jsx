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
        let acessoModulo=await this.validarAccesoDelModulo("/dashboard/configuracion","/asignacion-especialidad-medico")
        if(acessoModulo){
            const {id} =this.props.match.params
            let datosAsignacion=await this.consultarAsignacion(id)
            console.log("datos consultados ->>>> ",datosAsignacion)
            this.setState(datosAsignacion)
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
            await axios.get(`http://localhost:8080/login/verificar-sesion${token}`)
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
        await axios.get(`http://localhost:8080/configuracion/acceso/consultar/${idPerfil}`)
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