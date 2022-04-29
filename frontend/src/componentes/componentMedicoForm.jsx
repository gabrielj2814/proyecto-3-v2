import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentMedicoForm.css'
//JS
import axios from 'axios'
// IP servidor
import servidor from '../ipServer.js'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'
import ButtonIcon from '../subComponentes/buttonIcon'
import ComponentFormCampo from '../subComponentes/componentFormCampo';
import ComponentFormRadioState from '../subComponentes/componentFormRadioState';

class ComponentMedicoForm extends React.Component{
	constructor(){
		super();
		this.mostrarModulo=this.mostrarModulo.bind(this);
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.regresar=this.regresar.bind(this);
        this.operacion=this.operacion.bind(this);
        this.agregar= this.agregar.bind(this);
        this.validarNombre= this.validarNombre.bind(this);
        this.validarApellido=this.validarApellido.bind(this);
        this.validarTexto=this.validarTexto.bind(this)
        this.state={
            id_medico:"" ,
            nombre_medico:"" ,
            apellido_medico:"" ,
            modulo:"",// modulo menu
            estado_menu:false,
            //
            msj_nombre_medico:{
                mensaje:"",
                color_texto:""
            },
            msj_apellido_medico:{
                mensaje:"",
                color_texto:""
            },
            msj_id_medico:{
                mensaje:"",
                color_texto:""
            },
            //
            mensaje:{
                texto:"",
                estado:""
            }
        }
	}

    cambiarEstado(a){
        var input=a.target;
        this.setState({[input.name]:input.value})
    }

    async UNSAFE_componentWillMount(){
        
        let acessoModulo=await this.validarAccesoDelModulo("/dashboard/configuracion","/medico")
        if(acessoModulo){
            const formulario=this.props.match.params.operacion
            if(formulario==="actualizar"){
                const id=this.props.match.params.id
                this.consultarIdMedico(id)
            }
            else if(formulario==="registrar"){
                await this.generarIdMedico()
            }
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

    async generarIdMedico(){
        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/medico/generar-id`)
        .then(respuesta => {
            let json=JSON.parse(JSON.stringify(respuesta.data))
            this.setState({
                id_medico:json.id
            })
        })
        .catch(error => {
            console.log(error)
        })
    }

    async consultarIdMedico(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        const token=localStorage.getItem('usuario')
        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/medico/consultar/${id}/${token}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            if(respuesta_servidor.estado_peticion==="200"){
                const id_medico=respuesta_servidor.medico.id_medico,
                nombre_medico=respuesta_servidor.medico.nombre_medico,
                apellido_medico=respuesta_servidor.medico.apellido_medico
                this.setState({
                    id_medico:id_medico,
                    nombre_medico:nombre_medico,
                    apellido_medico:apellido_medico
                })
            }
            else if(respuesta_servidor.estado_peticion==="404"){
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                this.props.history.push(`/dashboard/configuracion/medico${JSON.stringify(mensaje)}`)
            }
        })
        .catch(error=>{
            console.log(error)
            mensaje.texto="No se puedo conectar con el servidor"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/medico${JSON.stringify(mensaje)}`)
        })
    }

    // logica menu
    mostrarModulo(a){// esta funcion tiene la logica del menu no tocar si no quieres que el menu no te responda como es devido
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

    async agregar(){
        
        var mensaje_campo={
            mensaje:"",
            color_texto:""
        }
        this.setState({
            id_medico:"",
            nombre_medico:"" ,
            apellido_medico:"",
            msj_nombre_medico:mensaje_campo,
            msj_apellido_medico:mensaje_campo,
            msj_id_medico:mensaje_campo

        })
        this.props.history.push("/dashboard/configuracion/medico/registrar")
    }

    cambiarEstado(a){
        var input=a.target;
        this.setState({[input.name]:input.value})
    }

    validarTexto(a){
        const input=a.target,
        exprecion=/[A-Za-z\s]$/
        if(input.value!==""){
            if(exprecion.test(input.value)){
                console.log("OK")
                this.cambiarEstadoDos(input)
            }
            else{
                console.log("NO se acepta valores numericos")
            }
        }
        else{
            this.cambiarEstadoDos(input)
        }
    }

    cambiarEstadoDos(input){
        this.setState({[input.name]:input.value})
    }

    // validaciones formulario
    validarNombre(){
        var estado=false
        const nombre=this.state.nombre_medico,
        exprecion=/[A-Za-z]/
        var msj_nombre_medico=this.state.msj_nombre_medico
        if(nombre!==""){
            if(exprecion.test(nombre)){
                estado=true
                console.log("campo nombre OK")
                msj_nombre_medico.mensaje=""
                msj_nombre_medico.color_texto="rojo"
                this.setState({msj_nombre_medico})
            }
            else{
                msj_nombre_medico.mensaje="este campo solo permite letras"
                msj_nombre_medico.color_texto="rojo"
                this.setState({msj_nombre_medico})
            } 
        }
        else{
            msj_nombre_medico.mensaje="este campo no puede estar vacio"
            msj_nombre_medico.color_texto="rojo"
            this.setState({msj_nombre_medico})
        }
        return estado
    }
    validarApellido(){
        var estado=false
        const apellido=this.state.apellido_medico,
        exprecion=/[A-Za-z]/
        var msj_apellido_medico=this.state.msj_apellido_medico
        if(apellido!==""){
            if(exprecion.test(apellido)){
                estado=true
                console.log("campo apellido OK")
                msj_apellido_medico.mensaje=""
                msj_apellido_medico.color_texto="rojo"
                this.setState({msj_apellido_medico})
            }
            else{
                msj_apellido_medico.mensaje="este campo solo permite letras"
                msj_apellido_medico.color_texto="rojo"
                this.setState({msj_apellido_medico})
            } 
        }
        else{
            msj_apellido_medico.mensaje="este campo no puede estar vacio"
            msj_apellido_medico.color_texto="rojo"
            this.setState({msj_apellido_medico})
        }
        return estado
    }
    validarIdMedico(){
        var estado=false
        const id=this.state.id_medico,
        exprecion=/[A-Za-z]/
        var msj_id_medico=this.state.msj_id_medico
        if(id!==""){
            if(exprecion.test(id) || /[0-9]/g.test(id)){
                estado=true
                console.log("campo id OK")
                msj_id_medico.mensaje=""
                msj_id_medico.color_texto="rojo"
                this.setState({msj_id_medico})
            }
            else{
                msj_id_medico.mensaje="este campo solo permite letras o numeros"
                msj_id_medico.color_texto="rojo"
                this.setState(msj_id_medico)
            } 
        }
        else{
            msj_id_medico.mensaje="este campo no puede estar vacio"
            msj_id_medico.color_texto="rojo"
            this.setState({msj_id_medico})
        }
        return estado
    }
    validar(){
        const respuesta_validar_nombre =this.validarNombre(),
        respuesta_validar_apellido = this.validarApellido()
        if(respuesta_validar_nombre && respuesta_validar_apellido){
            return true
        }
        else{
            return false
        }
    }

    operacion(){
        const operacion=this.props.match.params.operacion
        if(operacion==="registrar"){
            const estado_validar_formulario=this.validar()
            if(estado_validar_formulario){
                this.enviarDatos((objeto)=>{
                    let mensaje =this.state.mensaje
                    var respuesta_servidor=""
                    axios.post(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/medico/registrar`,objeto)
                    .then(respuesta=>{
                        respuesta_servidor=respuesta.data
                        mensaje.texto=respuesta_servidor.mensaje
                        mensaje.estado=respuesta_servidor.estado_peticion
                        this.setState({mensaje:mensaje})
                    })
                    .catch(error=>{
                        mensaje.texto="No se puedo conectar con el servidor"
                        mensaje.estado="500"
                        console.log(error)
                        this.setState({mensaje:mensaje})
                    })
                })
            }
            else{
                alert("error al validar el formulario")
            }
        }
        else if(operacion==="actualizar"){
            const estado_validar_formulario=this.validar()
            if(estado_validar_formulario){
                this.enviarDatos((objeto)=>{
                    let mensaje =this.state.mensaje
                    var respuesta_servidor=""
                    axios.put(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/medico/actualizar/${this.state.id_medico}`,objeto)
                    .then(respuesta=>{
                        respuesta_servidor=respuesta.data
                        mensaje.texto=respuesta_servidor.mensaje
                        mensaje.estado=respuesta_servidor.estado_peticion
                        this.setState({mensaje:mensaje})
                    })
                    .catch(error=>{
                        mensaje.texto="No se puedo conectar con el servidor"
                        mensaje.estado="500"
                        console.log(error)
                        this.setState({mensaje:mensaje})
                    })
                })
            }
            else{
                alert("error al validar el formulario")
            }
        }
    }

    enviarDatos(petion){
        const token=localStorage.getItem('usuario')
        const objeto={
            medico:{
            id_medico:this.state.id_medico,
            nombre_medico:this.state.nombre_medico,
            apellido_medico:this.state.apellido_medico
            },
            token
        }
        petion(objeto)
    }
    regresar(){
        this.props.history.push("/dashboard/configuracion/medico");
    }

	render(){
		const jsx_medico=(
        <div className="row justify-content-center">
            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                {this.state.mensaje.texto!=="" && (this.state.mensaje.estado==="200" || this.state.mensaje.estado==="404" || this.state.mensaje.estado==="500")  &&
                    <div className="row">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <div className={`alert alert-${(this.state.mensaje.estado==="200")?"success":"danger"} alert-dismissible`}>
                                <p>Mensaje: {this.state.mensaje.texto}</p>
                                <p>Estado: {this.state.mensaje.estado}</p>
                                <button className="close" data-dismiss="alert">
                                    <span>X</span>
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_formulario_medico">
                <div className="row justify-content-center">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-medico">
                        <span className="titulo-form-medico">Formulario de Médico</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-auto">
                        <ButtonIcon 
                        clasesBoton="btn btn-outline-success"
                        icon="icon-plus"
                        id="icon-plus"
                        eventoPadre={this.agregar}
                        />
                    </div>
                </div>

                <form id="form_medico" onClick="" >
                    <div className="row justify-content-center">
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            nombreCampo="Código del Médico:"
                            obligatorio="si"
                            mensaje={this.state.msj_id_medico}
                            activo="no"
                            type="text"
                            value={this.state.id_medico}
                            name="id_medico"
                            id="id_medico"
                            placeholder="Código Médico"
                            eventoPadre={this.cambiarEstado}
                            />
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            obligatorio="si"
                            mensaje={this.state.msj_nombre_medico}
                            nombreCampo="Nombre del Médico:"
                            activo="si"
                            type="text"
                            value={this.state.nombre_medico}
                            name="nombre_medico"
                            id="nombre_medico"
                            placeholder="Nombre Médico"
                            eventoPadre={this.validarTexto}
                            />
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            obligatorio="si"
                            mensaje={this.state.msj_apellido_medico}
                            nombreCampo="Apellido del Médico:"
                            activo="si"
                            type="text"
                            value={this.state.apellido_medico}
                            name="apellido_medico"
                            id="apellido_medico"
                            placeholder="Apellido Médico"
                            eventoPadre={this.validarTexto}
                            />
                        </div>
                        
                        <div className="row justify-content-center">
                            <div className="col-auto">
                                {this.props.match.params.operacion==="registrar" &&
                                    
                                    <InputButton 
                                    clasesBoton="btn btn-primary"
                                    id="boton-registrar"
                                    value="Registrar"
                                    eventoPadre={this.operacion}
                                    />
                                }
                                {this.props.match.params.operacion==="actualizar" &&
                                    <InputButton 
                                    clasesBoton="btn btn-warning"
                                    id="boton-actualizar"
                                    value="Actualizar"
                                    eventoPadre={this.operacion}
                                    />   
                                }
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
                </form>
            </div>
        </div>
    )

		return(
			<div className="component_medico_formulario">
				<ComponentDashboard
                componente={jsx_medico}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />
			</div>
		)
	}
}

export default withRouter(ComponentMedicoForm)