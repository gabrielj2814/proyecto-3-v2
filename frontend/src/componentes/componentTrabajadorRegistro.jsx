import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentTrabajadorRegistro.css'
//JS
import axios from 'axios'
//componentes
//sub componentes
import InputButton from '../subComponentes/input_button'
import ComponentFormCampo from '../subComponentes/componentFormCampo';
import ComponentFormSelect from '../subComponentes/componentFormSelect';

class ComponentTrabajadorRegistro extends React.Component{

    constructor(){
        super();
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.validarNumero=this.validarNumero.bind(this);
        this.registrar=this.registrar.bind(this);
        this.state={
            id_cedula:"",
            clave_trabajador:"",
            clave_confirmar:"",
            pregunta_1:"",
            pregunta_2:"",
            respuesta_1:"",
            respuesta_2:"",
            lista_preguntas:[
                {id:"color favorito",descripcion:"color favorito"},
                {id:"comida favorita",descripcion:"comida favorita"},
                {id:"personaje de la infancia favorito",descripcion:"personaje de la infancia favorito"},
                {id:"serie favorita",descripcion:"serie favorita"},
                {id:"youtuber favorito",descripcion:"youtuber favorito"},
                {id:"red social favorita",descripcion:"red social favorita"},
                {id:"nombre de tu primera mascota",descripcion:"nombre de tu primera mascota"},
            ],
            msj_id_cedula:{
                mensaje:"",
                color_texto:""
            },
            msj_clave_trabajador:{
                mensaje:"",
                color_texto:""
            },
            msj_clave_confirmar:{
                mensaje:"",
                color_texto:""
            },
            msj_pregunta_1:{
                mensaje:"",
                color_texto:""
            },
            msj_pregunta_2:{
                mensaje:"",
                color_texto:""
            },
            msj_respuesta_1:{
                mensaje:"",
                color_texto:""
            },
            msj_respuesta_2:{
                mensaje:"",
                color_texto:""
            },
            mensaje:{
                texto:"",
                estado:""
              },
        }
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
                mensaje_campo.mensaje="* este campo solo permite letras"
                mensaje_campo.color_texto="blanco"
                this.setState({["msj_"+nombre_campo]:mensaje_campo})
            } 
        }
        else{
            mensaje_campo.mensaje="* este campo no puede estar vacio"
            mensaje_campo.color_texto="blanco"
            this.setState({["msj_"+nombre_campo]:mensaje_campo})
        }
        return estado
    }

    validarCampoNumero(nombre_campo){
        var estado=false
        const campo=this.state[nombre_campo],
        exprecion=/\d$/,
        exprecion_2=/\s/
        var mensaje_campo=this.state["msj_"+nombre_campo]
        if(campo!==""){
            if(!exprecion_2.test(campo)){
                if(exprecion.test(campo)){
                    estado=true
                    console.log("campo nombre "+nombre_campo+" OK")
                    mensaje_campo.mensaje=""
                    mensaje_campo.color_texto="blanco"
                    this.setState({["msj_"+nombre_campo]:mensaje_campo})
                }
                else{
                    mensaje_campo.mensaje="* este campo solo permiste numeros"
                    mensaje_campo.color_texto="blanco"
                    this.setState({["msj_"+nombre_campo]:mensaje_campo})
                }
            }
            else{
                mensaje_campo.mensaje="* este campo no puede estar vacio"
                mensaje_campo.color_texto="blanco"
                this.setState({["msj_"+nombre_campo]:mensaje_campo})
            } 
        }
        else{
            mensaje_campo.mensaje="* este campo no puede estar vacio"
            mensaje_campo.color_texto="blanco"
            this.setState({["msj_"+nombre_campo]:mensaje_campo})
        }
        return estado
    }


    validarClave(){
        var estado=false
        var mensaje_clave=this.state["msj_clave_confirmar"]
        const validar_clave=this.validarCampoTexto("clave_trabajador")
        if(this.validarMinimoClave(validar_clave,"clave_trabajador")){
            const validar_clave_confirmar=this.validarCampoTexto("clave_confirmar")
            if(this.validarMinimoClave(validar_clave_confirmar,"clave_confirmar")){
                if(this.state.clave_trabajador===this.state.clave_confirmar){
                    estado=true
                    mensaje_clave.mensaje=""
                    mensaje_clave.color_texto="blanco"
                    this.setState({msj_clave_confirmar:mensaje_clave})
                }
                else{
                    mensaje_clave.mensaje="* las claves no coinciden"
                    mensaje_clave.color_texto="blanco"
                    this.setState({msj_clave_confirmar:mensaje_clave})
                }
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
                mensaje_clave.mensaje="* la clave tiene que tener como minimo 6 caracteres"
                mensaje_clave.color_texto="blanco"
                this.setState({["msj_"+propiedad]:mensaje_clave})
            }
        }
        return estado
    }

    verificarSelect(nombre_campo,valor,lista){
        var respuesta=false,
        contador=0
        var mensaje_select=this.state["msj_"+nombre_campo]
        if(valor!==""){
            while(contador<lista.length){
                var {id} = lista[contador];
                if(valor===id){
                    respuesta=true;
                }
                contador+=1
            }
            if(respuesta){
                console.log("NL-> 236: OK COMBO");
                mensaje_select.mensaje=""
                mensaje_select.color_texto="blanco"
                this.setState({["msj_"+nombre_campo]:mensaje_select})
            }
            else{
                mensaje_select.mensaje="* Error no puedes modificar los valores del Combo"
                mensaje_select.color_texto="blanco"
                this.setState({["msj_"+nombre_campo]:mensaje_select})
            }
        }
        else{
            mensaje_select.mensaje="* Por favor seleciona un elemento del combo"
            mensaje_select.color_texto="blanco"
            this.setState({["msj_"+nombre_campo]:mensaje_select})
        }
        return respuesta;
    }

    validarFormularioRegistrar(){
        var estado=false
        const validar_respusta_1=this.validarCampoTexto("respuesta_1"),
        validar_respusta_2=this.validarCampoTexto("respuesta_2"),
        validar_cedula=this.validarCampoNumero("id_cedula"),
        validar_clave=this.validarClave()
        if(validar_respusta_1 && validar_respusta_2 && validar_cedula && validar_clave){
            estado=true
        }
        return estado
    }

    componentDidMount(){
        // alert(document.getElementById("pregunta_1").value)
        // alert(document.getElementById("pregunta_2").value)
        this.setState({
            pregunta_1:document.getElementById("pregunta_1").value,
            pregunta_2:document.getElementById("pregunta_2").value
        })
    }

    registrar(){
        if(this.validarFormularioRegistrar()){
            var respuesta_servidor=""
            var mensaje=this.state.mensaje
            const objeto={
                trabajador:{
                    id_cedula:this.state.id_cedula,
                    pregunta_1:this.state.pregunta_1,
                    pregunta_2:this.state.pregunta_2,
                    respuesta_1:this.state.respuesta_1,
                    respuesta_2:this.state.respuesta_2,
                    clave_trabajador:this.state.clave_trabajador
                } 
            }
            axios.patch(`http://localhost:8080/configuracion/trabajador/activar-cuenta/${this.state.id_cedula}`,objeto)
            .then(respuesta=>{
                respuesta_servidor=respuesta.data
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
                console.log(error)
            })  
        }
        else{
            alert("error al validar el formulario")
        }
    }

    render(){

        return(
            <div className="containter-fluid component_registro_trabajador">
                <div className="row align-items-center justify-content-center fila_registro_trabajador">
                    <div className="col-10 col-sm-10 col-md-10 col-lg-10 col-xl-10 contenedor_registro_trabajador">
                        <form id="form_registro_trabajador">
                            <div className="row">
                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 titulo_formulario">
                                    Formulario de registro
                                </div>
                            </div>
                            
                            <div className="row margen_bottom_10">
                                <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 ">
                                    <div className="row">
                                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 sub_titulo_formulario">
                                            Usuario
                                        </div>
                                    </div>
                                    <div className="row">
                                        <ComponentFormCampo
                                        clasesColumna="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
                                        nombreCampo="Cedula"
                                        activo="si"
                                        mensaje={this.state.msj_id_cedula}
                                        clasesCampo="form-control"
                                        type="text"
                                        value={this.state.id_cedula}
                                        name="id_cedula"
                                        id="id_cedula"
                                        placeholder="CEDULA TRABAJADOR"
                                        eventoPadre={this.validarNumero}
                                        />
                                    </div>
                                    <div className="row">
                                        {this.state.mensaje.texto!=="" && (this.state.mensaje.estado==="200" || this.state.mensaje.estado==="404") &&
                                            <div className="row">
                                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                                    <div className={"alert alert-"+((this.state.mensaje.estado==="200")?"success":"danger")+" alert-dismissible "}>
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
                                </div>
                                <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 ">
                                    <div className="row">
                                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 sub_titulo_formulario">
                                            preguntas de seguridad
                                        </div>
                                    </div>
                                    <div className="row">
                                        <ComponentFormSelect
                                        clasesColumna="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12"
                                        //obligatorio="si"
                                        mensaje={this.state.msj_pregunta_1}
                                        nombreCampoSelect="Pregunta 1:"
                                        clasesSelect="custom-select"
                                        name="pregunta_1"
                                        id="pregunta_1"
                                        eventoPadre={this.cambiarEstado}
                                        defaultValue={this.state.pregunta_1}
                                        option={this.state.lista_preguntas}
                                        />
                                    </div>
                                    <div className="row">
                                        <ComponentFormCampo
                                        clasesColumna="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
                                        nombreCampo="Respuesta 1:"
                                        activo="si"
                                        mensaje={this.state.msj_respuesta_1}
                                        clasesCampo="form-control"
                                        type="text"
                                        value={this.state.respuesta_1}
                                        name="respuesta_1"
                                        id="respuesta_1"
                                        placeholder="REPUESTA"
                                        eventoPadre={this.cambiarEstado}
                                        />
                                    </div>
                                    <div className="row">
                                        <ComponentFormSelect
                                        clasesColumna="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12"
                                        //obligatorio="si"
                                        mensaje={this.state.msj_pregunta_2}
                                        nombreCampoSelect="Pregunta 2:"
                                        clasesSelect="custom-select"
                                        name="pregunta_2"
                                        id="pregunta_2"
                                        eventoPadre={this.cambiarEstado}
                                        defaultValue={this.state.pregunta_2}
                                        option={this.state.lista_preguntas}
                                        />
                                    </div>
                                    <div className="row">
                                        <ComponentFormCampo
                                        clasesColumna="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
                                        nombreCampo="Respuesta 2:"
                                        activo="si"
                                        mensaje={this.state.msj_respuesta_2}
                                        clasesCampo="form-control"
                                        type="text"
                                        value={this.state.respuesta_2}
                                        name="respuesta_2"
                                        id="respuesta_2"
                                        placeholder="REPUESTA"
                                        eventoPadre={this.cambiarEstado}
                                        />
                                    </div>
                                </div>
                                <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 ">
                                    <div className="row">
                                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 sub_titulo_formulario">
                                            Clave del usuario
                                        </div>
                                    </div>
                                    <div className="row">
                                        <ComponentFormCampo
                                        clasesColumna="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
                                        nombreCampo={`Clave ${this.state.clave_trabajador.length}/6`}
                                        activo="si"
                                        mensaje={this.state.msj_clave_trabajador}
                                        clasesCampo="form-control"
                                        type="password"
                                        value={this.state.clave_trabajador}
                                        name="clave_trabajador"
                                        id="clave_trabajador"
                                        placeholder="CLAVE"
                                        eventoPadre={this.cambiarEstado}
                                        />
                                    </div>
                                    <div className="row">
                                        <ComponentFormCampo
                                        clasesColumna="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
                                        nombreCampo={`Confirmar Clave ${this.state.clave_confirmar.length}/6`}
                                        mensaje={this.state.msj_clave_confirmar}
                                        activo="si"
                                        clasesCampo="form-control"
                                        type="password"
                                        value={this.state.clave_confirmar}
                                        name="clave_confirmar"
                                        id="clave_confirmar"
                                        placeholder="CLAVE"
                                        eventoPadre={this.cambiarEstado}
                                        />
                                    </div>
                                    <div className="row ">    
                                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                            <InputButton 
                                            clasesBoton="btn btn-block btn-success"
                                            id="boton-registrar"
                                            value="registrar"
                                            eventoPadre={this.registrar}
                                            />   
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )

    }

}

export default withRouter(ComponentTrabajadorRegistro)