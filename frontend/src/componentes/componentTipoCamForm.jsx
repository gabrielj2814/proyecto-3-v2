import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentTipoCamForm.css'
//JS
import axios from 'axios'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'
import ButtonIcon from '../subComponentes/buttonIcon'
import ComponentFormCampo from '../subComponentes/componentFormCampo';
import ComponentFormRadioState from '../subComponentes/componentFormRadioState';

class ComponentTipoCamForm extends React.Component{
	constructor(){
		super();
		this.mostrarModulo=this.mostrarModulo.bind(this);
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.regresar=this.regresar.bind(this);
        this.operacion=this.operacion.bind(this);
        this.agregar= this.agregar.bind(this);
        this.validarDescripcion= this.validarDescripcion.bind(this)
        this.validarTexto=this.validarTexto.bind(this)
        this.state={
            id_tipo_cam:"" ,
            nombre_tipo_cam:"" ,
            estatu_tipo_cam:"1",
            modulo:"",// modulo menu
            estado_menu:false,
            //
            msj_nombre_tipo_cam:{
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

	async generarIdTipoCam(){
        var respuesta_servidor="",
        mensaje={texto:"",estado:""}
        await axios.get("http://localhost:8080/configuracion/tipo-cam/generar-id")
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            //console.log(respuesta_servidor)
        })
        .catch(error=>{
            mensaje.texto="no hay conxion con el servido"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/tipo-cam${JSON.stringify(mensaje)}`)
        })
        return respuesta_servidor
    }

    async UNSAFE_componentWillMount(){
        const formulario=this.props.match.params.operacion
        if(formulario==="registrar"){
            const id=await this.generarIdTipoCam()
            this.setState({id_tipo_cam:id.id})
        }
        else if(formulario==="actualizar"){
            const id=this.props.match.params.id
            this.consultarIdTipoCam(id)
        }
    }

    async consultarIdTipoCam(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        const token=localStorage.getItem('usuario')
        await axios.get(`http://localhost:8080/configuracion/tipo-cam/consultar/${id}/${token}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            if(respuesta_servidor.estado_peticion==="200"){
                const id_tipo_cam=respuesta_servidor.tipo_cam.id_tipo_cam,
                nombre_tipo_cam=respuesta_servidor.tipo_cam.nombre_tipo_cam,
                estatu_tipo_cam=respuesta_servidor.tipo_cam.estatu_tipo_cam
                this.setState({
                    id_tipo_cam:id_tipo_cam,
                    nombre_tipo_cam:nombre_tipo_cam,
                    estatu_tipo_cam:estatu_tipo_cam
                })
            }
            else if(respuesta_servidor.estado_peticion==="404"){
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                this.props.history.push(`/dashboard/configuracion/tipo-cam${JSON.stringify(mensaje)}`)
            }
        })
        .catch(error=>{
            console.log(error)
            mensaje.texto="No se puedo conectar con el servidor"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/tipo-cam${JSON.stringify(mensaje)}`)
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
        const id=await this.generarIdTipoCam()
        var mensaje_campo={
            mensaje:"",
            color_texto:""
        }
        this.setState({
            id_tipo_cam:id,
            nombre_tipo_cam:"" ,
            estatu_tipo_cam:"1",
            msj_nombre_tipo_cam:mensaje_campo
        })
        this.props.history.push("/dashboard/configuracion/tipo-cam/registrar")
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
    validarDescripcion(){
        var estado=false
        const descripcion=this.state.nombre_tipo_cam,
        exprecion=/[A-Za-z]/
        var msj_nombre_tipo_cam=this.state.msj_nombre_tipo_cam
        if(descripcion!==""){
            if(exprecion.test(descripcion)){
                estado=true
                console.log("campo descripcion OK")
                msj_nombre_tipo_cam.mensaje=""
                msj_nombre_tipo_cam.color_texto="rojo"
                this.setState(msj_nombre_tipo_cam)
            }
            else{
                msj_nombre_tipo_cam.mensaje="este campo solo permite letras"
                msj_nombre_tipo_cam.color_texto="rojo"
                this.setState(msj_nombre_tipo_cam)
            } 
        }
        else{
            msj_nombre_tipo_cam.mensaje="este campo no puede estar vacio"
            msj_nombre_tipo_cam.color_texto="rojo"
            this.setState(msj_nombre_tipo_cam)
        }
        return estado
    }

    validar(){
        const respuesta_validar_nombre =this.validarDescripcion()
        if(respuesta_validar_nombre){
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
                    const mensaje =this.state.mensaje
                    var respuesta_servidor=""
                    axios.post("http://localhost:8080/configuracion/tipo-cam/registrar",objeto)
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
                    const mensaje =this.state.mensaje
                    var respuesta_servidor=""
                    axios.put(`http://localhost:8080/configuracion/tipo-cam/actualizar/${this.state.id_tipo_cam}`,objeto)
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
            tipo_cam:{
            id_tipo_cam:this.state.id_tipo_cam,
            nombre_tipo_cam:this.state.nombre_tipo_cam,
            estatu_tipo_cam:this.state.estatu_tipo_cam
            },
            token
        }
        petion(objeto)
    }

    regresar(){
        this.props.history.push("/dashboard/configuracion/tipo-cam");
    }

	render(){

		const jsx_tipo_cam=(
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
            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_formulario_tipo_cam">
                <div className="row justify-content-center">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-tipo-cam">
                        <span className="titulo-form-tipo-cam">Formulario de Tipo CAM</span>
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

                <form id="form_tipo_traba" onClick="" >
                    <div className="row justify-content-center">
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            nombreCampo="Código Tipo CAM:"
                            activo="no"
                            type="text"
                            value={this.state.id_tipo_cam}
                            name="id_tipo_cam"
                            id="id_tipo_cam"
                            placeholder="Código Tipo CAM"
                            />
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            obligatorio="si"
                            mensaje={this.state.msj_nombre_tipo_cam}
                            nombreCampo="Nombre Tipo CAM:"
                            activo="si"
                            type="text"
                            value={this.state.nombre_tipo_cam}
                            name="nombre_tipo_cam"
                            id="nombre_tipo_cam"
                            placeholder="Descripción Tipo CAM"
                            eventoPadre={this.validarTexto}
                            />
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormRadioState
                            clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            extra="custom-control-inline"
                            nombreCampoRadio="Estatus:"
                            name="estatu_tipo_cam"
                            nombreLabelRadioA="Activo"
                            idRadioA="activoA"
                            checkedRadioA={this.state.estatu_tipo_cam}
                            valueRadioA="1"
                            nombreLabelRadioB="Inactivo"
                            idRadioB="activoB"
                            valueRadioB="0"
                            eventoPadre={this.cambiarEstado}
                            checkedRadioB={this.state.estatu_tipo_cam}
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
			<div className="component_tipo_cam_formulario">
				<ComponentDashboard
                componente={jsx_tipo_cam}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />
			</div>
		)
	}

}

export default withRouter(ComponentTipoCamForm);