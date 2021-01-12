import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentTipoTrabForm.css'
//JS
import axios from 'axios'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'
import ButtonIcon from '../subComponentes/buttonIcon'
import ComponentFormCampo from '../subComponentes/componentFormCampo';
import ComponentFormRadioState from '../subComponentes/componentFormRadioState';

class ComponentTipoTrabForm extends React.Component{
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
            id_tipo_trabajador:"" ,
            descripcion_tipo_trabajador:"" ,
            estatu_tipo_trabajador:"1",
            modulo:"",// modulo menu
            estado_menu:false,
            //
            msj_descripcion_tipo_trabajador:{
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

    async generarIdTipoTrabajador(){
        var respuesta_servidor="",
        mensaje={texto:"",estado:""}
        await axios.get("http://localhost:8080/configuracion/tipo-trabajador/generar-id")
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            //console.log(respuesta_servidor)
        })
        .catch(error=>{
            mensaje.texto="no hay conxion con el servido"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/tipo-trabajador${JSON.stringify(mensaje)}`)
        })
        return respuesta_servidor
    }

    async UNSAFE_componentWillMount(){
        const formulario=this.props.match.params.operacion
        if(formulario==="registrar"){
            const id=await this.generarIdTipoTrabajador()
            this.setState({id_tipo_trabajador:id.id})
        }
        else if(formulario==="actualizar"){
            const id=this.props.match.params.id
            this.consultar_id_tipo_traba(id)
        }
    }

    async consultar_id_tipo_traba(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        const token=localStorage.getItem('usuario')
        await axios.get(`http://localhost:8080/configuracion/tipo-trabajador/consultar/${id}/${token}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            if(respuesta_servidor.estado_peticion==="200"){
                const id_tipo_trabajador=respuesta_servidor.tipo_trabajador.id_tipo_trabajador,
                descripcion_tipo_trabajador=respuesta_servidor.tipo_trabajador.descripcion_tipo_trabajador,
                estatu_tipo_trabajador=respuesta_servidor.tipo_trabajador.estatu_tipo_trabajador
                this.setState({
                    id_tipo_trabajador:id_tipo_trabajador,
                    descripcion_tipo_trabajador:descripcion_tipo_trabajador,
                    estatu_tipo_trabajador:estatu_tipo_trabajador
                })
            }
            else if(respuesta_servidor.estado_peticion==="404"){
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                this.props.history.push(`/dashboard/configuracion/tipo-trabajador${JSON.stringify(mensaje)}`)
            }
        })
        .catch(error=>{
            console.log(error)
            mensaje.texto="No se puedo conectar con el servidor"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/tipo-trabajador${JSON.stringify(mensaje)}`)
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
        const id=await this.generarIdTipoTrabajador()
        var mensaje_campo={
            mensaje:"",
            color_texto:""
        }
        this.setState({
            id_tipo_trabajador:id,
            descripcion_tipo_trabajador:"" ,
            estatu_tipo_trabajador:"1",
            msj_descripcion_tipo_trabajador:mensaje_campo
        })
        this.props.history.push("/dashboard/configuracion/tipo-trabajador/registrar")
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
        const descripcion=this.state.descripcion_tipo_trabajador,
        exprecion=/[A-Za-z]/
        var msj_descripcion_tipo_trabajador=this.state.msj_descripcion_tipo_trabajador
        if(descripcion!==""){
            if(exprecion.test(descripcion)){
                estado=true
                console.log("campo descripcion OK")
                msj_descripcion_tipo_trabajador.mensaje=""
                msj_descripcion_tipo_trabajador.color_texto="rojo"
                this.setState(msj_descripcion_tipo_trabajador)
            }
            else{
                msj_descripcion_tipo_trabajador.mensaje="este campo solo permite letras"
                msj_descripcion_tipo_trabajador.color_texto="rojo"
                this.setState(msj_descripcion_tipo_trabajador)
            } 
        }
        else{
            msj_descripcion_tipo_trabajador.mensaje="este campo no puede estar vacio"
            msj_descripcion_tipo_trabajador.color_texto="rojo"
            this.setState(msj_descripcion_tipo_trabajador)
        }
        return estado
    }

    validar(){
        const respuesta_validar_descripcion =this.validarDescripcion()
        if(respuesta_validar_descripcion){
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
                    axios.post("http://localhost:8080/configuracion/tipo-trabajador/registrar",objeto)
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
                    axios.put(`http://localhost:8080/configuracion/tipo-trabajador/actualizar/${this.state.id_tipo_trabajador}`,objeto)
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
            tipo_trabajador:{
            id_tipo_trabajador:this.state.id_tipo_trabajador,
            descripcion_tipo_trabajador:this.state.descripcion_tipo_trabajador,
            estatu_tipo_trabajador:this.state.estatu_tipo_trabajador
            },
            token
        }
        petion(objeto)
    }

    regresar(){
        this.props.history.push("/dashboard/configuracion/tipo-trabajador");
    }

	render(){

    const jsx_tipo_traba=(
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
            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_formulario_tipo_trabajador">
                <div className="row justify-content-center">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-tipo-trabajador">
                        <span className="titulo-form-tipo-trabajador">Formulario de Tipo Trabajador</span>
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
                            nombreCampo="Codigo Tipo Trabajador:"
                            activo="no"
                            type="text"
                            value={this.state.id_tipo_trabajador}
                            name="id_tipo_trabajador"
                            id="id_tipo_trabajador"
                            placeholder="Codigo Tipo Trabajador"
                            />
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            obligatorio="si"
                            mensaje={this.state.msj_descripcion_tipo_trabajador}
                            nombreCampo="Descripcion Tipo Trabajador:"
                            activo="si"
                            type="text"
                            value={this.state.descripcion_tipo_trabajador}
                            name="descripcion_tipo_trabajador"
                            id="descripcion_tipo_trabajador"
                            placeholder="Descripcion Tipo Trabajador"
                            eventoPadre={this.validarTexto}
                            />
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormRadioState
                            clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            extra="custom-control-inline"
                            nombreCampoRadio="Estatus:"
                            name="estatu_tipo_trabajador"
                            nombreLabelRadioA="Activo"
                            idRadioA="activoA"
                            checkedRadioA={this.state.estatu_tipo_trabajador}
                            valueRadioA="1"
                            nombreLabelRadioB="Inactivo"
                            idRadioB="activoB"
                            valueRadioB="0"
                            eventoPadre={this.cambiarEstado}
                            checkedRadioB={this.state.estatu_tipo_trabajador}
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
			<div className="component_tipo_trabajador_formulario">
				<ComponentDashboard
                componente={jsx_tipo_traba}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />
			</div>
		)
	}

}
export default withRouter(ComponentTipoTrabForm);