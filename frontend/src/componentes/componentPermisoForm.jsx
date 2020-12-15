import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentPermisoForm.css'
//JS
import axios from 'axios'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'
import ButtonIcon from '../subComponentes/buttonIcon'
import ComponentFormCampo from '../subComponentes/componentFormCampo';
import ComponentFormRadioState from '../subComponentes/componentFormRadioState';

class ComponentPermisoForm extends React.Component{

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
            id_permiso:"",
            nombre_permiso:"",
            dias_permiso:"",
            estatu_permiso:"1",
            estatu_remunerado:"1",
            estatu_dias_aviles:"1",
            //
            msj_nombre_permiso:{
                mensaje:"",
                color_texto:""
            },
            msj_dias_permiso:{
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

    async generarIdPerfil(){
        var respuesta_servidor="",
        mensaje={texto:"",estado:""}
        await axios.get("http://localhost:8080/configuracion/permiso/generar-id")
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            //console.log(respuesta_servidor)
        })
        .catch(error=>{
            mensaje.texto="no hay conxion con el servido"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/permiso${JSON.stringify(mensaje)}`)
        })
        return respuesta_servidor
    }

    async UNSAFE_componentWillMount(){
        const formulario=this.props.match.params.operacion
        if(formulario==="registrar"){
            const id=await this.generarIdPerfil()
            this.setState({id_permiso:id.id})
        }
        else if(formulario==="actualizar"){
            const id=this.props.match.params.id
            this.consultarPermiso(id)
        }
    }

    async consultarPermiso(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        await axios.get(`http://localhost:8080/configuracion/permiso/consultar/${id}`)
        .then(respuesta=>{
        respuesta_servidor=respuesta.data
            if(respuesta_servidor.estado_peticion==="200"){
                const id_permiso=respuesta_servidor.permiso.id_permiso,
                nombre_permiso=respuesta_servidor.permiso.nombre_permiso,
                dias_permiso=respuesta_servidor.permiso.dias_permiso,
                estatu_permiso=respuesta_servidor.permiso.estatu_permiso,
                estatu_dias_aviles=respuesta_servidor.permiso.estatu_dias_aviles,
                estatu_remunerado=respuesta_servidor.permiso.estatu_remunerado
                this.setState({
                    id_permiso:id_permiso,
                    nombre_permiso:nombre_permiso,
                    dias_permiso:dias_permiso,
                    estatu_permiso:estatu_permiso,
                    estatu_dias_aviles:estatu_dias_aviles,
                    estatu_remunerado:estatu_remunerado
                })
                    
            }
            else if(respuesta_servidor.estado_peticion==="404"){
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                this.props.history.push(`/dashboard/configuracion/permiso${JSON.stringify(mensaje)}`)
            }

        })
        .catch(error=>{
            console.log(error)
            mensaje.texto="No se puedo conectar con el servidor"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/permiso${JSON.stringify(mensaje)}`)
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
        const id =await this.generarIdPerfil()
        var mensaje_campo={
            mensaje:"",
            color_texto:""
        }
        this.setState({
            id_permiso:id.id,
            nombre_permiso:"",
            dias_permiso:"",
            estatu_permiso:"1",
            estatu_remunerado:"1",
            estatu_dias_aviles:"1",
            msj_dias_permiso:mensaje_campo,
            msj_nombre_permiso:mensaje_campo

        })
        this.props.history.push("/dashboard/configuracion/permiso/registrar")
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

    validarCampoNombrePermiso(){
        var estado=false
        const nombre_permiso=this.state.nombre_permiso,
        exprecion=/[A-Za-z]/
        var msj_nombre_permiso=this.state.msj_nombre_permiso
        if(nombre_permiso!==""){
            if(exprecion.test(nombre_permiso)){
                estado=true
                console.log("campo nombre permiso OK")
                msj_nombre_permiso.mensaje=""
                msj_nombre_permiso.color_texto="rojo"
                this.setState(msj_nombre_permiso)
            }
            else{                
                msj_nombre_permiso.mensaje="este campo solo permite letras"
                msj_nombre_permiso.color_texto="rojo"
                this.setState(msj_nombre_permiso)
            }
        }
        else{
            msj_nombre_permiso.mensaje="este campo no puede estar vacio"
            msj_nombre_permiso.color_texto="rojo"
            this.setState(msj_nombre_permiso)
        }
        return estado
    }

    validarCampoDiasAviles(){
        var estado=false
        var msj_dias_permiso=this.state.msj_dias_permiso
        const dias_permiso=this.state.dias_permiso
        if(dias_permiso!=="" && dias_permiso!=="0"){
            estado=true
            console.log("campo dias permiso OK")
            msj_dias_permiso.mensaje=""
            msj_dias_permiso.color_texto="rojo"
            this.setState(msj_dias_permiso)
        }
        else{
            msj_dias_permiso.mensaje="este campo no puede estar vacio"
            msj_dias_permiso.color_texto="rojo"
            this.setState(msj_dias_permiso)
        }
        return estado
    }

    validarFomrulario(){
        var estado=false
        const respuesta_validar_campo_nombre=this.validarCampoNombrePermiso(),
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
                    axios.post("http://localhost:8080/configuracion/permiso/registrar",objeto)
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
                    axios.put(`http://localhost:8080/configuracion/permiso/actualizar/${this.state.id_permiso}`,objeto)
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
            permiso:{
                id_permiso:this.state.id_permiso,
                nombre_permiso:this.state.nombre_permiso,
                dias_permiso:this.state.dias_permiso,
                estatu_permiso:this.state.estatu_permiso,
                estatu_remunerado:this.state.estatu_remunerado,
                estatu_dias_aviles:this.state.estatu_dias_aviles
            }
        }
        petion(objeto)
    }

    regresar(){
        this.props.history.push("/dashboard/configuracion/permiso");
    }

    render(){
        var jsx_permiso_form=(
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
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_formulario_permiso">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-permiso">
                            <span className="titulo-form-permiso">Formulario de permiso</span>
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
                    <form id="form_permiso">
                        <div className="row justify-content-center">
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            nombreCampo="Codigo Permiso:"
                            activo="no"
                            type="text"
                            value={this.state.id_permiso}
                            name="id_permiso"
                            id="id_permiso"
                            placeholder="Codigo Permiso"
                            />
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            obligatorio="si"
                            mensaje={this.state.msj_nombre_permiso}
                            nombreCampo="Nombre Permiso:"
                            activo="si"
                            type="text"
                            value={this.state.nombre_permiso}
                            name="nombre_permiso"
                            id="nombre_permiso"
                            placeholder="Nombre Permiso"
                            eventoPadre={this.validarTexto}
                            />
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            obligatorio="si"
                            mensaje={this.state.msj_dias_permiso}
                            nombreCampo="Dias Permiso:"
                            activo="si"
                            type="text"
                            value={this.state.dias_permiso}
                            name="dias_permiso"
                            id="dias_permiso"
                            placeholder="Dias Permiso"
                            eventoPadre={this.validarNumeroDias}
                            />
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormRadioState
                            clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            extra="custom-control-inline"
                            nombreCampoRadio="Estatu Permiso:"
                            name="estatu_permiso"
                            nombreLabelRadioA="Activo"
                            idRadioA="activopermisoA"
                            checkedRadioA={this.state.estatu_permiso}
                            valueRadioA="1"
                            nombreLabelRadioB="Inactivo"
                            idRadioB="activopermisoB"
                            valueRadioB="0"
                            eventoPadre={this.cambiarEstado}
                            checkedRadioB={this.state.estatu_permiso}
                            />
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormRadioState
                            clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            extra="custom-control-inline"
                            nombreCampoRadio="Estatu Remunerado:"
                            name="estatu_remunerado"
                            nombreLabelRadioA="Activo"
                            idRadioA="activoremuneradoA"
                            checkedRadioA={this.state.estatu_remunerado}
                            valueRadioA="1"
                            nombreLabelRadioB="Inactivo"
                            idRadioB="activoremuneradoB"
                            valueRadioB="0"
                            eventoPadre={this.cambiarEstado}
                            checkedRadioB={this.state.estatu_remunerado}
                            />
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormRadioState
                            clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            extra="custom-control-inline"
                            nombreCampoRadio="Estatu Dias Aviles:"
                            name="estatu_dias_aviles"
                            nombreLabelRadioA="Activo"
                            idRadioA="activodiasavilesA"
                            checkedRadioA={this.state.estatu_dias_aviles}
                            valueRadioA="1"
                            nombreLabelRadioB="Inactivo"
                            idRadioB="activodiasavilesB"
                            valueRadioB="0"
                            eventoPadre={this.cambiarEstado}
                            checkedRadioB={this.state.estatu_dias_aviles}
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
            <div className="component_permiso_form">
                <ComponentDashboard
                componente={jsx_permiso_form}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />
            </div>
        )
    }
}

export default withRouter(ComponentPermisoForm)