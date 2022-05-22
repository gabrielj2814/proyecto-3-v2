import React from 'react';
import {withRouter} from 'react-router-dom'
//JS
import axios from 'axios'
// IP servidor
import servidor from '../ipServer.js'
// css
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
import '../css/componentRecuperarCuenta.css';
//SubComponent
import CintilloComponent from '../subComponentes/cintilloComponent';
import ComponentFormCampo from '../subComponentes/componentFormCampo';
import LinkButton from '../subComponentes/link_button';
import InputButton from '../subComponentes/input_button'
import { Alert } from 'bootstrap';

class ComponentRecuperarCuenta extends React.Component{

    constructor(){
        super();
        this.cambiarEstado=this.cambiarEstado.bind(this)
        this.validarNumero=this.validarNumero.bind(this)
        this.compararRespuesta=this.compararRespuesta.bind(this)
        this.compararClaveTrabajador=this.compararClaveTrabajador.bind(this)
        this.irAlHomePage=this.irAlHomePage.bind(this)
        this.irRecuperar2=this.irRecuperar2.bind(this)
        this.validarCedulaUsuario=this.validarCedulaUsuario.bind(this)
        this.validarClave=this.validarClave.bind(this)
        this.state={
            paso:0,
            id_cedula:"",

            pregunta_1:"",
            pregunta_2:"",
            respuesta_1:"",
            respuesta_2:"",

            respuesta_usuario_1:"",
            respuesta_usuario_2:"",

            clave_trabajador:"",
            confirmar_nueva_clave:"",

            msj_respuesta_usuario_1:{
                mensaje:"",
                color_texto:""
            },
            msj_respuesta_usuario_2:{
                mensaje:"",
                color_texto:""
            },

            msj_clave_trabajador:{
                mensaje:"",
                color_texto:""
            },
            msj_confirmar_nueva_clave:{
                mensaje:"",
                color_texto:""
            },
            mensaje:{
                texto:"",
                estado:""
              }
        }
    }

    async UNSAFE_componentWillMount(){
        var servidor={}
        if(this.props.match.params.mensaje){
          const msj=JSON.parse(this.props.match.params.mensaje)
          var mensaje=this.state.mensaje
          mensaje.texto=msj.texto
          mensaje.estado=msj.estado
          servidor.mensaje=mensaje
          this.setState(servidor)
        }
      }

      async consultarTrabajador(id){
        var respuesta_servidor=""
        var mensaje=this.state.mensaje
        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/trabajador/consultar-trabajador/${id}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            if(respuesta_servidor.estado_peticion==="200"){
                const id_cedula=respuesta_servidor.trabajador.id_cedula,
                pregunta_1=respuesta_servidor.trabajador.pregunta_1,
                respuesta_1=respuesta_servidor.trabajador.respuesta_1,
                pregunta_2=respuesta_servidor.trabajador.pregunta_2,
                respuesta_2=respuesta_servidor.trabajador.respuesta_2
                this.setState({
                    paso:1,
                    id_cedula:id_cedula,
                    pregunta_1:pregunta_1,
                    respuesta_1:respuesta_1,
                    pregunta_2:pregunta_2,
                    respuesta_2:respuesta_2,
                    trabajador:respuesta_servidor.trabajador
                })
            // this.props.history.push("/recuperar-cuenta1")

        }
        else if(respuesta_servidor.estado_peticion==="404"){
            alert("NO SE A ENCONTRADO AL TRABAJADOR")
       }
        })
}


validarNumero(a){
    var input=a.target;
    const expresion=/[0-9]$/;
    if(expresion.test(input.value)){
        console.log("OK NUMEROS VALIDADOS");
        if(input.value.length<=8){
            this.cambiarEstadoInput(input);
        }
    }
    else{
        if(input.value===""){
            console.log("-> ''");
            this.cambiarEstadoInput(input)
        }
        else{
            console.log("EN CAMPO "+input.name+"ACEPTA SOLO NUMEROS");
            input.value=this.state[input.name];
            this.cambiarEstadoInput(input)
        }
    }
}
    cambiarEstadoInput(input){
        this.setState({[input.name]:input.value});
    }

    cambiarEstado(a){
        const input=a.target;
        this.setState({[input.name]:input.value})
    }

    validarCampoTexto(nombre_campo){// validar la clave como texto
        var estado=false
        const campo=this.state[nombre_campo],
        exprecion=/[A-Za-z]|[0-9]/
        var mensaje_campo=this.state["msj_"+nombre_campo]
        if(campo!==""){
            if(exprecion.test(campo)){
                estado=true
                console.log("campo nombre "+nombre_campo+" OK")
                mensaje_campo.mensaje=""
                mensaje_campo.color_texto="blanco"
                this.setState({["msj_"+nombre_campo]:mensaje_campo})
            }
            else{
                mensaje_campo.mensaje="* Este campo solo permite letras"
                mensaje_campo.color_texto="blanco"
                this.setState({["msj_"+nombre_campo]:mensaje_campo})
            } 
        }
        else{
            mensaje_campo.mensaje="* Este campo no puede estar vacio"
            mensaje_campo.color_texto="blanco"
            this.setState({["msj_"+nombre_campo]:mensaje_campo})
        }
        return estado
    }

    validarContraseña(){
        var estado=false
        var mensaje_clave=this.state["msj_confirmar_nueva_clave"]
        const validar_clave=this.validarCampoTexto("confirmar_nueva_clave")
        if(this.validarMinimoClave(validar_clave,"confirmar_nueva_clave")){
            const exprecion=/[A-Z]{2}/g
            const exprecion2=/[a-z]{2}/g
            let clave=document.getElementById("confirmar_nueva_clave").value
            if(exprecion.test(clave) && exprecion2.test(clave)){
                //alert("si")
                const validar_clave_confirmar=this.validarCampoTexto("confirmar_nueva_clave")
                if(this.validarMinimoClave(validar_clave_confirmar,"confirmar_nueva_clave")){
                    if(this.state.clave_trabajador===this.state.confirmar_nueva_clave){
                        estado=true
                        mensaje_clave.mensaje=""
                        mensaje_clave.color_texto="negro"
                        this.setState({msj_clave_confirmar:mensaje_clave})
                    }
                    else{
                        mensaje_clave.mensaje="* Las claves no coinciden"
                        mensaje_clave.color_texto="negro"
                        this.setState({msj_clave_confirmar:mensaje_clave})
                    }
                }

            }
            else{
                mensaje_clave.mensaje="La clave debe tener al menos 2 caracteres en MAYUSCULA y dos en MINUSCULA"
                mensaje_clave.color_texto="blanco"
                this.setState({msj_clave_confirmar:mensaje_clave})
            }
            
        }
        return estado
    }

    validarMinimoClave(validar_clave,propiedad){
        var estado=false
        var mensaje_clave=this.state["msj_"+propiedad]
        if(validar_clave){
            if(this.state[propiedad].length>=6){
                estado=true
                mensaje_clave.mensaje=""
                mensaje_clave.color_texto="blanco"
                this.setState({["msj_"+propiedad]:mensaje_clave})
            }
            else{
                mensaje_clave.mensaje="* La clave tiene que tener como minimo 6 caracteres"
                mensaje_clave.color_texto="blanco"
                this.setState({["msj_"+propiedad]:mensaje_clave})
            }
        }
        return estado
    }

    async validarCedulaUsuario(){
        if(this.state.id_cedula!==""){
            if(this.state.id_cedula.length>=7){
                await this.consultarTrabajador(this.state.id_cedula)
                
            }
            else{
                alert("El codigo del usuario no cumple con los caracteres minimos "+this.state.id_cedula.length+"/8")
            }
        }
        else{
            alert("El codigo del usuario no puede estar vacio")
        }
    }

    validarTexto(a){
        const input=a.target,
        exprecion=/[A-Za-z\s]$/
        if(input.value!==""){
            if(exprecion.test(input.value)){
                console.log("OK")
                this.cambiarEstado(input)
            }
            else{
                console.log("NO se acepta valores numericos")
            }
        }
        else{
            this.cambiarEstado(input)
        }
    }

    compararRespuesta(){
        if(this.state.respuesta_usuario_1=== this.state.respuesta_1 && this.state.respuesta_usuario_2===this.state.respuesta_2){
            //alert("Las respuestas validadas con exito.(ツ)")
            this.setState({
                paso:2
            })
        }
        else{
            alert("Las respuestas no coinciden, por favor verifique sus Respuestas")
        }
    }

    async compararClaveTrabajador(){
        if(this.state.clave_trabajador=== this.state.confirmar_clave_trabajador){
            //alert("La clave fue validada con exito.(ツ)")
            await this.compararClaveTrabajador(this.state.id_cedula)
        }
        else{
            alert("La clave introducida no coincide, Por favor verifique")
        }
    }

    irAlHomePage(){
        this.props.history.push("/login")
    }

    irRecuperar2(){
        this.props.history.push("/recuperar-cuenta1")
    }

    validarFormulario(){
        var estado=false
        const validar_respuesta_1=this.validarCampoTexto("respuesta_usuario_1"),
        validar_respuesta_2=this.validarCampoTexto("respuesta_usuario_2"),
        validar_clave=this.validarContraseña()
        if(validar_respuesta_1 && validar_respuesta_2 && validar_clave){
            estado=true
        }
        return estado
    }

    async validarClave(){
        if(this.validarFormulario()){var respuesta_servidor=""
        var mensaje=this.state.mensaje
        axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/trabajador/cambiar-clave/${this.state.id_cedula}/${this.state.clave_trabajador}/${this.state.respuesta_usuario_1}/${this.state.respuesta_usuario_2}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            console.log(respuesta_servidor)
            if(respuesta_servidor.estado_peticion==="200"){
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                this.props.history.push(`/login${JSON.stringify(mensaje)}`)
            }
            else if(respuesta_servidor.estado_peticion==="404"){
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                this.setState(mensaje)
            }
        })
        .catch(error=>{
            mensaje.texto="No se puedo conectar con el servidor"
            mensaje.estado="500"
            console.log(error)
            this.setState({mensaje:mensaje})
        })
    }
    else{
        alert("Error al validar el formulario")
    }
}

    render(){
        const consultarTrabajador=(
            <div>
                {this.state.paso===0 &&
                    <>    
                        <div className="row">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 titulo_formulario">
                                Recuperar Cuenta
                            </div>
                        </div>
                            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                                {this.state.mensaje.texto!=="" && (this.state.mensaje.estado==="200" || this.state.mensaje.estado==="404" || this.state.mensaje.estado==="401" || this.state.mensaje.estado==="500") &&
                                    <div className="row">
                                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                            <div className={`alert alert-${(this.state.mensaje.estado==="200" || this.state.mensaje.estado==="401")?"success":"danger"} alert-dismissible`} >
                                                <p>Mensaje: {this.state.mensaje.texto}</p>
                                                <button className="close" data-dismiss="alert">
                                                    <span>X</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="row justify-content-center margen_bottom_10 ">
                                <ComponentFormCampo
                                clasesColumna="col-7 col-sm-7 col-md-7 col-lg-7 col-xl-7 text-center"
                                nombreCampo="Usuario"
                                activo="si"
                                clasesCampo="form-control"
                                type="text"
                                value={this.state.id_cedula}
                                name="id_cedula"
                                id="id_cedula"
                                placeholder="Cédula Trabajador"
                                eventoPadre={this.validarNumero}
                                />
                            </div>
                            
                            <div className="row row justify-content-center margen_bottom_10">    
                                <div className="col-auto">
                                    <InputButton 
                                    clasesBoton="btn btn-success"
                                    id="boton-recuperar"
                                    value="Recuperar"
                                    eventoPadre={this.validarCedulaUsuario}
                                    />   
                                </div>
                            </div>
                    
                    
                    
                    </>


                }

                {this.state.paso===1 &&
                    <>
                        <div className="row">
                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 titulo_formulario">
                                    Recuperar Cuenta
                                </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center">
                                <div className="styleFont">
                                    {this.state.pregunta_1}
                                </div> 
                            </div>
                            <div className="row justify-content-center margen_bottom_10 ">
                                <ComponentFormCampo
                                clasesColumna="col-7 col-sm-7 col-md-7 col-lg-7 col-xl-7 text-center"
                                nombreCampo=""
                                activo="si"
                                ensaje={this.state.msj_respuesta_usuario_1}
                                clasesCampo="form-control"
                                type="text"
                                value={this.state.respuesta_usuario_1}
                                name="respuesta_usuario_1"
                                id="respuesta_usuario_1"
                                placeholder="RESPUESTA NRO 1"
                                eventoPadre={this.cambiarEstado}
                                />
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center">
                                <div className="styleFont">
                                    {this.state.pregunta_2}
                                    </div>
                            </div>
                            <div className="row justify-content-center margen_bottom_10 ">
                                <ComponentFormCampo
                                clasesColumna="col-7 col-sm-7 col-md-7 col-lg-7 col-xl-7 text-center"
                                nombreCampo=""
                                activo="si"
                                ensaje={this.state.msj_respuesta_usuario_2}
                                clasesCampo="form-control"
                                type="text"
                                value={this.state.respuesta_usuario_2}
                                name="respuesta_usuario_2"
                                id="respuesta_usuario_2"
                                placeholder="RESPUESTA NRO 2"
                                eventoPadre={this.cambiarEstado}
                                />
                            </div>

                            <div className="row row justify-content-center margen_bottom_10">    
                                <div className="col-auto">
                                    <InputButton 
                                    clasesBoton="btn btn-success"
                                    id="boton-recuperar_siguiente"
                                    value="Siguiente"
                                    eventoPadre={this.compararRespuesta}
                                    />   
                                </div>
                            </div>
                    </>
                }

                {this.state.paso===2 &&
                <>
                    <div className="row">
                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 titulo_formulario">
                                    Recuperar Cuenta
                                </div>
                            </div>
                            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                                {this.state.mensaje.texto!=="" && (this.state.mensaje.estado==="200" || this.state.mensaje.estado==="404" || this.state.mensaje.estado==="401" || this.state.mensaje.estado==="500") &&
                                    <div className="row">
                                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                            <div className={`alert alert-${(this.state.mensaje.estado==="200" || this.state.mensaje.estado==="401")?"success":"danger"} alert-dismissible`} >
                                                <p className='font-weight-bold'>Mensaje: {this.state.mensaje.texto}</p>
                                                <button className="close" data-dismiss="alert">
                                                    <span>X</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="row justify-content-center margen_bottom_10 ">
                                <ComponentFormCampo
                                clasesColumna="col-7 col-sm-7 col-md-7 col-lg-7 col-xl-7 text-center"
                                nombreCampo={`Nueva Contraseña ${this.state.clave_trabajador.length}/6`}
                                activo="si"
                                mensaje={this.state.msj_clave_trabajador}
                                clasesCampo="form-control"
                                type="text"
                                value={this.state.clave_trabajador}
                                name="clave_trabajador"
                                id="clave_trabajador"
                                placeholder="INGRESE NUEVA CONTRASEÑA"
                                eventoPadre={this.cambiarEstado}
                                />
                            </div>
                            <div className="row justify-content-center margen_bottom_10 ">
                                <ComponentFormCampo
                                clasesColumna="col-7 col-sm-7 col-md-7 col-lg-7 col-xl-7 text-center"
                                nombreCampo={`Confirmar Contraseña ${this.state.confirmar_nueva_clave.length}/6`}
                                activo="si"
                                clasesCampo="form-control"
                                type="password"
                                value={this.state.confirmar_nueva_clave}
                                name="confirmar_nueva_clave"
                                id="confirmar_nueva_clave"
                                placeholder="CONFIRME NUEVA CONTRASEÑA"
                                eventoPadre={this.cambiarEstado}
                                />
                            </div>
                            
                            <div className="row row justify-content-center margen_bottom_10">    
                                <div className="col-auto">
                                    <InputButton 
                                    clasesBoton="btn btn-success"
                                    id="boton-recuperar_aceptar"
                                    value="Aceptar"
                                    eventoPadre={this.validarClave}
                                    />   
                                </div>
                            </div>

                </>
                
                }
                    
            </div>
        )
        return(
            <div className="containter-fluid component_recuperar">
            <CintilloComponent/>
                <div className="contenedor-icon-row-left-login" onClick={this.irAlHomePage}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-circle icon-row-left-login" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                    </svg>
                </div>
                <div className="row align-items-center justify-content-center fila_recuperar">
                    <div className="col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5 contenedor_recuperar">
                        <form id="form_recuperar">
                            {consultarTrabajador}
                        </form>
                    </div>
                </div>
            </div>
        )
    }

}


export default withRouter(ComponentRecuperarCuenta);