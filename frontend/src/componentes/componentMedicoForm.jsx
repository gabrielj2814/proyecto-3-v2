import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentMedicoForm.css'
//JS
import axios from 'axios'
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

	// async generarIdMedico(){
    //     var respuesta_servidor="",
    //     mensaje={texto:"",estado:""}
    //     await axios.get("http://localhost:8080/configuracion/medico/generar-id")
    //     .then(respuesta=>{
    //         respuesta_servidor=respuesta.data
    //         //console.log(respuesta_servidor)
    //     })
    //     .catch(error=>{
    //         mensaje.texto="no hay conxion con el servido"
    //         mensaje.estado="500"
    //         this.props.history.push(`/dashboard/configuracion/medico${JSON.stringify(mensaje)}`)
    //     })
    //     return respuesta_servidor
    // }

    cambiarEstado(a){
        var input=a.target;
        this.setState({[input.name]:input.value})
    }

    async UNSAFE_componentWillMount(){
        const formulario=this.props.match.params.operacion
        if(formulario==="actualizar"){
            const id=this.props.match.params.id
            this.consultarIdMedico(id)
        }
    }

    async consultarIdMedico(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        await axios.get(`http://localhost:8080/configuracion/medico/consultar/${id}`)
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
        respuesta_validar_apellido = this.validarApellido(),
        respuestaIdMedico=this.validarIdMedico()
        if(respuesta_validar_nombre && respuesta_validar_apellido && respuestaIdMedico){
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
                    axios.post("http://localhost:8080/configuracion/medico/registrar",objeto)
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
                    axios.put(`http://localhost:8080/configuracion/medico/actualizar/${this.state.id_medico}`,objeto)
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
        const objeto={
            medico:{
            id_medico:this.state.id_medico,
            nombre_medico:this.state.nombre_medico,
            apellido_medico:this.state.apellido_medico
            }
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
                        <span className="titulo-form-medico">Formulario de Medico</span>
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
                            nombreCampo="Codigo del Medico:"
                            obligatorio="si"
                            mensaje={this.state.msj_id_medico}
                            activo="si"
                            type="text"
                            value={this.state.id_medico}
                            name="id_medico"
                            id="id_medico"
                            placeholder="Codigo Medico"
                            eventoPadre={this.cambiarEstado}
                            />
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            obligatorio="si"
                            mensaje={this.state.msj_nombre_medico}
                            nombreCampo="Nombre del Medico:"
                            activo="si"
                            type="text"
                            value={this.state.nombre_medico}
                            name="nombre_medico"
                            id="nombre_medico"
                            placeholder="Nombre Medico"
                            eventoPadre={this.validarTexto}
                            />
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            obligatorio="si"
                            mensaje={this.state.msj_apellido_medico}
                            nombreCampo="Apellido del Medico:"
                            activo="si"
                            type="text"
                            value={this.state.apellido_medico}
                            name="apellido_medico"
                            id="apellido_medico"
                            placeholder="Apellido Medico"
                            eventoPadre={this.validarTexto}
                            />
                        </div>
                        
                        <div className="row justify-content-center">
                            <div className="col-auto">
                                {this.props.match.params.operacion==="registrar" &&
                                    
                                    <InputButton 
                                    clasesBoton="btn btn-primary"
                                    id="boton-registrar"
                                    value="registrar"
                                    eventoPadre={this.operacion}
                                    />
                                }
                                {this.props.match.params.operacion==="actualizar" &&
                                    <InputButton 
                                    clasesBoton="btn btn-warning"
                                    id="boton-actualizar"
                                    value="actualizar"
                                    eventoPadre={this.operacion}
                                    />   
                                }
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