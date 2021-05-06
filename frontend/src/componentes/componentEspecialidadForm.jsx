import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentEspecialidadForm.css'
//JS
import axios from 'axios'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'
import ButtonIcon from '../subComponentes/buttonIcon'
import ComponentFormCampo from '../subComponentes/componentFormCampo';
import ComponentFormRadioState from '../subComponentes/componentFormRadioState';

class ComponentEspecialidadForm extends React.Component{
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
            id_especialidad:"" ,
            nombre_especialidad:"" ,
            estatu_especialidad:"1",
            modulo:"",// modulo menu
            estado_menu:false,
            //
            msj_nombre_especialidad:{
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
    
    async generarIdEspecialidad(){
        var respuesta_servidor="",
        mensaje={texto:"",estado:""}
        await axios.get("http://localhost:8080/configuracion/especialidad/generar-id")
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            //console.log(respuesta_servidor)
        })
        .catch(error=>{
            mensaje.texto="no hay conxion con el servido"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/especialidad${JSON.stringify(mensaje)}`)
        })
        return respuesta_servidor
    }

    async UNSAFE_componentWillMount(){
        let acessoModulo=await this.validarAccesoDelModulo("/dashboard/configuracion","/especialidad")
        if(acessoModulo){
            const formulario=this.props.match.params.operacion
            if(formulario==="actualizar"){
                const id=this.props.match.params.id
                this.consultar_id_especialidad(id)
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

    async consultar_id_especialidad(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        const token=localStorage.getItem('usuario')
        await axios.get(`http://localhost:8080/configuracion/especialidad/consultar/${id}/${token}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            if(respuesta_servidor.estado_peticion==="200"){
                const id_especialidad=respuesta_servidor.especialidad.id_especialidad,
                nombre_especialidad=respuesta_servidor.especialidad.nombre_especialidad,
                estatu_especialidad=respuesta_servidor.especialidad.estatu_especialidad
                this.setState({
                    id_especialidad:id_especialidad,
                    nombre_especialidad:nombre_especialidad,
                    estatu_especialidad:estatu_especialidad
                })
            }
            else if(respuesta_servidor.estado_peticion==="404"){
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                this.props.history.push(`/dashboard/configuracion/especialidad${JSON.stringify(mensaje)}`)
            }
        })
        .catch(error=>{
            console.log(error)
            mensaje.texto="No se puedo conectar con el servidor"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/especialidad${JSON.stringify(mensaje)}`)
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
        const id=await this.generarIdEspecialidad()
        var mensaje_campo={
            mensaje:"",
            color_texto:""
        }
        this.setState({
            id_especialidad:id,
            nombre_especialidad:"" ,
            estatu_especialidad:"1",
            msj_nombre_especialidad:mensaje_campo
        })
        this.props.history.push("/dashboard/configuracion/especialidad/registrar")
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
        const descripcion=this.state.nombre_especialidad,
        exprecion=/[A-Za-z]/
        var msj_nombre_especialidad=this.state.msj_nombre_especialidad
        if(descripcion!==""){
            if(exprecion.test(descripcion)){
                estado=true
                console.log("campo descripcion OK")
                msj_nombre_especialidad.mensaje=""
                msj_nombre_especialidad.color_texto="rojo"
                this.setState(msj_nombre_especialidad)
            }
            else{
                msj_nombre_especialidad.mensaje="este campo solo permite letras"
                msj_nombre_especialidad.color_texto="rojo"
                this.setState(msj_nombre_especialidad)
            } 
        }
        else{
            msj_nombre_especialidad.mensaje="este campo no puede estar vacio"
            msj_nombre_especialidad.color_texto="rojo"
            this.setState(msj_nombre_especialidad)
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
                    axios.post("http://localhost:8080/configuracion/especialidad/registrar",objeto)
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
                    axios.put(`http://localhost:8080/configuracion/especialidad/actualizar/${this.state.id_especialidad}`,objeto)
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
            especialidad:{
            id_especialidad:this.state.id_especialidad,
            nombre_especialidad:this.state.nombre_especialidad,
            estatu_especialidad:this.state.estatu_especialidad
            },
            token
        }
        petion(objeto)
    }

    regresar(){
        this.props.history.push("/dashboard/configuracion/especialidad");
    }

    render(){

        const jsx_especialidad=(
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

                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_formulario_especialidad">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-especialidad">
                            <span className="titulo-form-especialidad">Formulario de Especialidad</span>
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
    
                    <form  >
                        <div className="row justify-content-center">
                                <ComponentFormCampo
                                clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                                clasesCampo="form-control"
                                nombreCampo="Código Especialidad:"
                                activo="no"
                                type="text"
                                value={this.state.id_especialidad}
                                name="id_especialidad"
                                id="id_especialidad"
                                placeholder="Código Especialidad"
                                />
                                <ComponentFormCampo
                                clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                                clasesCampo="form-control"
                                obligatorio="si"
                                mensaje={this.state.msj_nombre_especialidad}
                                nombreCampo="Descripción Especialidad:"
                                activo="si"
                                type="text"
                                value={this.state.nombre_especialidad}
                                name="nombre_especialidad"
                                id="nombre_especialidad"
                                placeholder="Descripción Especialidad"
                                eventoPadre={this.validarTexto}
                                />
                                <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
                            </div>
                            <div className="row justify-content-center">
                                <ComponentFormRadioState
                                clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                                extra="custom-control-inline"
                                nombreCampoRadio="Estatus:"
                                name="estatu_especialidad"
                                nombreLabelRadioA="Activo"
                                idRadioA="activoA"
                                checkedRadioA={this.state.estatu_especialidad}
                                valueRadioA="1"
                                nombreLabelRadioB="Inactivo"
                                idRadioB="activoB"
                                valueRadioB="0"
                                eventoPadre={this.cambiarEstado}
                                checkedRadioB={this.state.estatu_especialidad}
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
            <div className="component_especialidad_formulario">
				<ComponentDashboard
                componente={jsx_especialidad}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />
			</div>

        )
    }
}

export default withRouter(ComponentEspecialidadForm)
