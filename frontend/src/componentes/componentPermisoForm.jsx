import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentPermisoForm.css'
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
        this.desactivarDiasPermiso=this.desactivarDiasPermiso.bind(this);
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
            estatu_tipo_permiso:"1",
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
        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/permiso/generar-id`)
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

    async componentDidMount(){
        let acessoModulo=await this.validarAccesoDelModulo("/dashboard/configuracion","/permiso")
        if(acessoModulo){
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

    async consultarPermiso(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        const token=localStorage.getItem('usuario')
        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/permiso/consultar/${id}/${token}`)
        .then(respuesta=>{
        respuesta_servidor=respuesta.data
            if(respuesta_servidor.estado_peticion==="200"){
                this.setState(respuesta_servidor.permiso)
                const $inputDiasPermiso=document.getElementById("dias_permiso")
                if(this.state.estatu_tipo_permiso==="1"){
                    $inputDiasPermiso.removeAttribute("disabled")
                }
                else if(this.state.estatu_tipo_permiso==="0"){
                    $inputDiasPermiso.setAttribute("disabled",true)
                }
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
            estatu_tipo_permiso:"1",
            msj_dias_permiso:mensaje_campo,
            msj_nombre_permiso:mensaje_campo

        })
        const $inputDiasPermiso=document.getElementById("dias_permiso")
        if(this.state.estatu_tipo_permiso==="1"){
            $inputDiasPermiso.removeAttribute("disabled")
        }
        else if(this.state.estatu_tipo_permiso==="0"){
            $inputDiasPermiso.setAttribute("disabled",true)
        }
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
        if(dias_permiso!==""){
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
                    axios.post(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/permiso/registrar`,objeto)
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
                    let mensaje =this.state.mensaje
                    var respuesta_servidor=""
                    axios.put(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/permiso/actualizar/${this.state.id_permiso}`,objeto)
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
            permiso:{
                id_permiso:this.state.id_permiso,
                nombre_permiso:this.state.nombre_permiso,
                dias_permiso:this.state.dias_permiso,
                estatu_permiso:this.state.estatu_permiso,
                estatu_remunerado:this.state.estatu_remunerado,
                estatu_dias_aviles:this.state.estatu_dias_aviles,
                estatu_tipo_permiso:this.state.estatu_tipo_permiso
            },
            token
        }
        petion(objeto)
    }

    regresar(){
        this.props.history.push("/dashboard/configuracion/permiso");
    }

    desactivarDiasPermiso(a){
        let input=a.target
        this.cambiarEstado(a)
        const $inputDiasPermiso=document.getElementById("dias_permiso")
        if(input.value==="1"){
            // alert("activar campo dias permiso")
            $inputDiasPermiso.removeAttribute("disabled")
            this.setState({
                dias_permiso:""
            })
        }
        else if(input.value==="0"){
            // alert("desactivar campo dias permiso")
            $inputDiasPermiso.setAttribute("disabled",true)
            this.setState({
                dias_permiso:0
            })
        }
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
                            <span className="titulo-form-permiso">Formulario de Permiso</span>
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
                            nombreCampo="Código Permiso:"
                            activo="no"
                            type="text"
                            value={this.state.id_permiso}
                            name="id_permiso"
                            id="id_permiso"
                            placeholder="Código Permiso"
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
                            nombreCampo="Días Permiso:"
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
                            nombreCampoRadio="Estatus Permiso:"
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
                            nombreCampoRadio="Estatus Remunerado:"
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
                            nombreCampoRadio="Estatus Dias Hábiles:"
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
                            <ComponentFormRadioState
                            clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            extra="custom-control-inline"
                            nombreCampoRadio="Tipo de Permiso:"
                            name="estatu_tipo_permiso"
                            nombreLabelRadioA="Normal"
                            idRadioA="tipoPermisoA"
                            checkedRadioA={this.state.estatu_tipo_permiso}
                            valueRadioA="1"
                            nombreLabelRadioB="Retiro"
                            idRadioB="tipoPermisoB"
                            valueRadioB="0"
                            eventoPadre={this.desactivarDiasPermiso}
                            checkedRadioB={this.state.estatu_tipo_permiso}
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