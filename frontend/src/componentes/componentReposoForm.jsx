import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentReposoForm.css'
//JS
import axios from 'axios'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'
import ButtonIcon from '../subComponentes/buttonIcon'
import ComponentFormCampo from '../subComponentes/componentFormCampo';
import ComponentFormRadioState from '../subComponentes/componentFormRadioState';

class ComponentReposoForm extends React.Component{

    constructor(){
        super();
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.regresar=this.regresar.bind(this);
        this.operacion=this.operacion.bind(this);
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.agregar=this.agregar.bind(this);
        this.validarTexto=this.validarTexto.bind(this);
        this.validarNumeroDias=this.validarNumeroDias.bind(this);
        this.state={
            modulo:"",// modulo menu
            estado_menu:false,
            //formulario
            id_reposo:"",
            nombre_reposo:"",
            dias_reposo:"",
            estatu_reposo:"1",
            //
            msj_nombre_reposo:{
                mensaje:"",
                color_texto:""
            },
            msj_dias_reposo:{
                mensaje:"",
                color_texto:""
            },
            //
            mensaje:{
                texto:"",
                estado:""
            },
        }
    }

    async generarIdReposo(){
        var respuesta_servidor="",
        mensaje={texto:"",estado:""}
        await axios.get("http://localhost:8080/configuracion/reposo/generar-id")
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            //console.log(respuesta_servidor)
        })
        .catch(error=>{
            mensaje.texto="no hay conxion con el servido"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/reposo${JSON.stringify(mensaje)}`)
        })
        return respuesta_servidor
    }

    async UNSAFE_componentWillMount(){
        const formulario=this.props.match.params.operacion
        if(formulario==="registrar"){
            const id=await this.generarIdReposo()
            this.setState({id_reposo:id.id})
        }
        else if(formulario==="actualizar"){
            const id=this.props.match.params.id
            this.consultarReposo(id)
        }
    }

    async consultarReposo(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        const token=localStorage.getItem('usuario')
        await axios.get(`http://localhost:8080/configuracion/reposo/consultar/${id}/${token}`)
        .then(respuesta=>{
        respuesta_servidor=respuesta.data
            if(respuesta_servidor.estado_peticion==="200"){
                const id_reposo=respuesta_servidor.reposo.id_reposo,
                nombre_reposo=respuesta_servidor.reposo.nombre_reposo,
                dias_reposo=respuesta_servidor.reposo.dias_reposo,
                estatu_reposo=respuesta_servidor.reposo.estatu_reposo
                this.setState({
                    id_reposo:id_reposo,
                    nombre_reposo:nombre_reposo,
                    dias_reposo:dias_reposo,
                    estatu_reposo:estatu_reposo
                })
                    
            }
            else if(respuesta_servidor.estado_peticion==="404"){
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                this.props.history.push(`/dashboard/configuracion/reposo${JSON.stringify(mensaje)}`)
            }

        })
        .catch(error=>{
            console.log(error)
            mensaje.texto="No se puedo conectar con el servidor"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/reposo${JSON.stringify(mensaje)}`)
        })
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

    async agregar(){
        const id =await this.generarIdReposo()
        var mensaje_campo={
            mensaje:"",
            color_texto:""
        }
        this.setState({
            id_reposo:id.id,
            nombre_reposo:"",
            dias_reposo:"",
            estatu_reposo:"1",
            msj_dias_reposo:mensaje_campo,
            msj_nombre_reposo:mensaje_campo

        })
        this.props.history.push("/dashboard/configuracion/reposo/registrar")
    }

    cambiarEstado(a){
        var input=a.target;
        this.setState({[input.name]:input.value})
    }

    cambiarEstadoDos(input){
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

    validarNumeroDias(a){
        const input=a.target,
        exprecion=/\d$/
        if(input.value!==""){
            if(exprecion.test(input.value)){
                console.log("OK")
                this.cambiarEstadoDos(input)
            }
            else{
                console.log("NO")
            }
        }
        else{
            this.cambiarEstadoDos(input)
        }
    }

    validarCampoNombreReposo(){
        var estado=false
        const nombre_reposo=this.state.nombre_reposo,
        exprecion=/[A-Za-z]/
        var msj_nombre_reposo=this.state.msj_nombre_reposo
        if(nombre_reposo!==""){
            if(exprecion.test(nombre_reposo)){
                estado=true
                console.log("campo nombre reposo OK")
                msj_nombre_reposo.mensaje=""
                msj_nombre_reposo.color_texto="rojo"
                this.setState(msj_nombre_reposo)
            }
            else{                
                msj_nombre_reposo.mensaje="este campo solo permite letras"
                msj_nombre_reposo.color_texto="rojo"
                this.setState(msj_nombre_reposo)
            }
        }
        else{
            msj_nombre_reposo.mensaje="este campo no puede estar vacio"
            msj_nombre_reposo.color_texto="rojo"
            this.setState(msj_nombre_reposo)
        }
        return estado
    }

    validarCampoDiasAviles(){
        var estado=false
        var msj_dias_reposo=this.state.msj_dias_reposo
        const dias_reposo=this.state.dias_reposo
        if(dias_reposo!=="" && dias_reposo!=="0"){
            estado=true
            console.log("campo dias reposo OK")
            msj_dias_reposo.mensaje=""
            msj_dias_reposo.color_texto="rojo"
            this.setState(msj_dias_reposo)
        }
        else{
            msj_dias_reposo.mensaje="este campo no puede estar vacio"
            msj_dias_reposo.color_texto="rojo"
            this.setState(msj_dias_reposo)
        }
        return estado
    }

    validarFomrulario(){
        var estado=false
        const respuesta_validar_campo_nombre=this.validarCampoNombreReposo(),
        respuesta_validar_campo_dias_aviles=this.validarCampoDiasAviles()
        if(respuesta_validar_campo_nombre && respuesta_validar_campo_dias_aviles){
            estado=true
        }
        return estado
    }

    operacion(){
        const operacion=this.props.match.params.operacion
        if(operacion==="registrar"){
            const estado_validar_fomrulario=this.validarFomrulario()
            if(estado_validar_fomrulario){
                this.enviarDatos((objeto)=>{
                    const mensaje =this.state.mensaje
                    var respuesta_servidor=""
                    axios.post("http://localhost:8080/configuracion/reposo/registrar",objeto)
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
            const estado_validar_fomrulario=this.validarFomrulario()
            if(estado_validar_fomrulario){
                this.enviarDatos((objeto)=>{
                    const mensaje =this.state.mensaje
                    var respuesta_servidor=""
                    axios.put(`http://localhost:8080/configuracion/reposo/actualizar/${this.state.id_reposo}`,objeto)
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
            reposo:{
                id_reposo:this.state.id_reposo,
                nombre_reposo:this.state.nombre_reposo,
                dias_reposo:this.state.dias_reposo,
                estatu_reposo:this.state.estatu_reposo
            },
            token
        }
        petion(objeto)
    }

    regresar(){
        this.props.history.push("/dashboard/configuracion/reposo");
    }

    render(){
        var jsx_reposo_form=(
            <div className="row justify-content-center">
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                    {this.state.mensaje.texto!=="" && (this.state.mensaje.estado==="200" || this.state.mensaje.estado==="404" || this.state.mensaje.estado==="500") &&
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
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_formulario_reposo">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-reposo">
                            <span className="titulo-form-reposo">Formulario de Reposo</span>
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
                    <form id="form_reposo">
                        <div className="row justify-content-center">
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            nombreCampo="Codigo Reposo:"
                            activo="no"
                            type="text"
                            value={this.state.id_reposo}
                            name="id_reposo"
                            id="id_reposo"
                            placeholder="Codigo Reposo"
                            />
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            obligatorio="si"
                            mensaje={this.state.msj_nombre_reposo}
                            nombreCampo="Nombre Reposo:"
                            activo="si"
                            type="text"
                            value={this.state.nombre_reposo}
                            name="nombre_reposo"
                            id="nombre_reposo"
                            placeholder="Nombre Reposo"
                            eventoPadre={this.validarTexto}
                            />
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            obligatorio="si"
                            mensaje={this.state.msj_dias_reposo}
                            nombreCampo="Dias Reposo:"
                            activo="si"
                            type="text"
                            value={this.state.dias_reposo}
                            name="dias_reposo"
                            id="dias_reposo"
                            placeholder="Dias Reposo"
                            eventoPadre={this.validarNumeroDias}
                            />
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormRadioState
                            clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            extra="custom-control-inline"
                            nombreCampoRadio="Estatu Reposo:"
                            name="estatu_reposo"
                            nombreLabelRadioA="Activo"
                            idRadioA="activoreposoA"
                            checkedRadioA={this.state.estatu_reposo}
                            valueRadioA="1"
                            nombreLabelRadioB="Inactivo"
                            idRadioB="activoreposoB"
                            valueRadioB="0"
                            eventoPadre={this.cambiarEstado}
                            checkedRadioB={this.state.estatu_reposo}
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
            <div className="component_reposo_form">
                <ComponentDashboard
                componente={jsx_reposo_form}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />
            </div>
        )
    }
}

export default withRouter(ComponentReposoForm)