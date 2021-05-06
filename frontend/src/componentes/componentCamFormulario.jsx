import React from "react"

import {withRouter} from "react-router-dom"

//JS
import axios from 'axios'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import "../css/componentCamFormulario.css"
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'
import ButtonIcon from '../subComponentes/buttonIcon'
import ComponentFormCampo from '../subComponentes/componentFormCampo';
import ComponentFormTextArea from "../subComponentes/componentFormTextArea"
import ComponentFormSelect from "../subComponentes/componentFormSelect"
import ComponentFormRadioState from "../subComponentes/componentFormRadioState"
import AlertBootstrap from "../subComponentes/alertBootstrap"

class ComponentCamFormulario extends React.Component {

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.consultarCiudadesXEstado=this.consultarCiudadesXEstado.bind(this)
        this.operacion=this.operacion.bind(this)
        this.regresar=this.regresar.bind(this);
        this.agregar=this.agregar.bind(this)
        this.state={
            modulo:"",// modulo menu
            estado_menu:false,
            //---------- 
            // formulario
            id_cam:"",
            nombre_cam:"",
            telefono_cam:"",
            direccion_cam:"",
            id_tipo_cam:"",
            id_estado:"",
            id_ciudad:"",
            estatu_cam:"1",
            msj_nombre_cam:{
                mensaje:"",
                color_texto:""
            },
            msj_telefono_cam:{
                mensaje:"",
                color_texto:""
            },
            msj_direccion_cam:{
                mensaje:"",
                color_texto:""
            },
            msj_id_estado:{
                mensaje:"",
                color_texto:""
            },
            msj_id_ciudad:{
                mensaje:"",
                color_texto:""
            },
            msj_id_tipo_cam:{
                mensaje:"",
                color_texto:""
            },
            // 
            tipo_cams:[],
            estados:[],
            ciudades:[],
            alerta:{
                color:null,
                mensaje:null,
                estado:false
            }
        }
    }

    async UNSAFE_componentWillMount(){
        let acessoModulo=await this.validarAccesoDelModulo("/dashboard/configuracion","/cam")
        if(acessoModulo){
            const {operacion}=this.props.match.params
            if(operacion==="registrar"){
                const ruta_api="http://localhost:8080/configuracion/estado/consultar-todos",
                nombre_propiedad_lista="estados",
                propiedad_id="id_estado",
                propiedad_descripcion="nombre_estado",
                propiedad_estado="estatu_estado"
                const estados=await this.consultarServidor(ruta_api,nombre_propiedad_lista,propiedad_id,propiedad_descripcion,propiedad_estado)
                console.log("lista de estados ->>>",estados)
                const ruta_api_2=`http://localhost:8080/configuracion/ciudad/consultar-x-estado/${estados[0].id}`,
                nombre_propiedad_lista_2="ciudades",
                propiedad_id_2="id_ciudad",
                propiedad_descripcion_2="nombre_ciudad",
                propiedad_estado_2="estatu_ciudad"
                const ciudades=await this.consultarServidor(ruta_api_2,nombre_propiedad_lista_2,propiedad_id_2,propiedad_descripcion_2,propiedad_estado_2)
                console.log("lista de de ciudades por estado ->>>",ciudades)
                const ruta_api_3="http://localhost:8080/configuracion/tipo-cam/consultar-todos",
                nombre_propiedad_lista_3="tipo_cams",
                propiedad_id_3="id_tipo_cam",
                propiedad_descripcion_3="nombre_tipo_cam",
                propiedad_estado_3="estatu_tipo_cam"
                const tipo_cams=await this.consultarServidor(ruta_api_3,nombre_propiedad_lista_3,propiedad_id_3,propiedad_descripcion_3,propiedad_estado_3)
                console.log("lista todos los tipo cam ->>>",tipo_cams)
                this.setState({
                    tipo_cams,
                    estados,
                    ciudades,
                    id_estado:(estados.length===0)?null:estados[0].id,
                    id_ciudad:(ciudades.length===0)?null:ciudades[0].id,
                    id_tipo_cam:(tipo_cams.length===0)?null:tipo_cams[0].id
                })
            }
            else if(operacion==="actualizar"){
                const {id}=this.props.match.params
                let datos = await this.consultarIdConsultar(id)
                console.log(datos)
                let datosCiudad=await this.consultarCiudad(datos.id_ciudad)
                const ruta_api="http://localhost:8080/configuracion/estado/consultar-todos",
                nombre_propiedad_lista="estados",
                propiedad_id="id_estado",
                propiedad_descripcion="nombre_estado",
                propiedad_estado="estatu_estado"
                const estados=await this.consultarServidor(ruta_api,nombre_propiedad_lista,propiedad_id,propiedad_descripcion,propiedad_estado)
                console.log("lista de estados ->>>",estados)
                const ruta_api_2=`http://localhost:8080/configuracion/ciudad/consultar-x-estado/${datosCiudad.id_estado}`,
                nombre_propiedad_lista_2="ciudades",
                propiedad_id_2="id_ciudad",
                propiedad_descripcion_2="nombre_ciudad",
                propiedad_estado_2="estatu_ciudad"
                const ciudades=await this.consultarServidor(ruta_api_2,nombre_propiedad_lista_2,propiedad_id_2,propiedad_descripcion_2,propiedad_estado_2)
                console.log("lista de de ciudades por estado ->>>",ciudades)
                const ruta_api_3="http://localhost:8080/configuracion/tipo-cam/consultar-todos",
                nombre_propiedad_lista_3="tipo_cams",
                propiedad_id_3="id_tipo_cam",
                propiedad_descripcion_3="nombre_tipo_cam",
                propiedad_estado_3="estatu_tipo_cam"
                const tipo_cams=await this.consultarServidor(ruta_api_3,nombre_propiedad_lista_3,propiedad_id_3,propiedad_descripcion_3,propiedad_estado_3)
                console.log("lista todos los tipo cam ->>>",tipo_cams)
                this.setState({
                    tipo_cams,
                    estados,
                    ciudades,
                    id_estado:datosCiudad.id_estado
                })
                document.getElementById("id_estado").value=datosCiudad.id_estado
                document.getElementById("id_ciudad").value=datos.id_ciudad
                document.getElementById("id_tipo_cam").value=datos.id_tipo_cam
                
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

    async consultarCiudad(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        var ciudad={}
        const token=localStorage.getItem('usuario')
        await axios.get(`http://localhost:8080/configuracion/ciudad/consultar/${id}/${token}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            if(respuesta_servidor.estado_peticion==="200"){
                ciudad=respuesta_servidor.ciudad
            }
            else if(respuesta_servidor.estado_peticion==="404"){
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                this.props.history.push(`/dashboard/configuracion/cam${JSON.stringify(mensaje)}`)
            }

        })
        .catch(error=>{
            console.log(error)
            mensaje.texto="No se puedo conectar con el servidor"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/cam${JSON.stringify(mensaje)}`)
        })
        return ciudad
    }

    async consultarIdConsultar(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        let datos=[]
        const token=localStorage.getItem('usuario')
        await axios.get(`http://localhost:8080/configuracion/cam/consultar/${id}/${token}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            if(respuesta_servidor.estado_peticion==="200"){
                // console.log(respuesta_servidor.cam)
                this.setState(respuesta_servidor.cam)
                datos=JSON.parse(JSON.stringify(respuesta_servidor.cam))
            }
            else if(respuesta_servidor.estado_peticion==="404"){
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                this.props.history.push(`/dashboard/configuracion/cam${JSON.stringify(mensaje)}`)
            }
        })
        .catch(error=>{
            console.log(error)
            mensaje.texto="No se puedo conectar con el servidor"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/cam${JSON.stringify(mensaje)}`)
        })
        return datos
    }

    async consultarServidor(ruta_api,nombre_propiedad_lista,propiedad_id,propiedad_descripcion,propiedad_estado){
        var respuesta_servidor=[]
        var lista=[]
        var mensaje={texto:"",estado:""}
        await axios.get(ruta_api)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            if(respuesta_servidor.estado_peticion==="200"){
                var lista_vacia=[]
                const propiedades={
                    id:propiedad_id,
                    descripcion:propiedad_descripcion,
                    estado:propiedad_estado
                }
                lista=this.formatoOptionSelect(respuesta_servidor[nombre_propiedad_lista],lista_vacia,propiedades)
            }
            else if(respuesta_servidor.estado_peticion==="404"){
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                // this.props.history.push(`/dashboard/configuracion/ciudad${JSON.stringify(mensaje)}`)
            } 
        })
        .catch(error=>{
            console.log(error)
        })
        return lista
    }

    formatoOptionSelect(lista,lista_vacia,propiedades){
        var veces=0
        while(veces<lista.length){
            if(lista[veces][propiedades.estado]==="1"){
                lista_vacia.push({id:lista[veces][propiedades.id],descripcion:lista[veces][propiedades.descripcion]})
            }
            veces+=1
        }
        return lista_vacia
    }

    async consultarCiudadesXEstado(a){
        let input=a.target
        const ruta_api_2=`http://localhost:8080/configuracion/ciudad/consultar-x-estado/${input.value}`,
        nombre_propiedad_lista_2="ciudades",
        propiedad_id_2="id_ciudad",
        propiedad_descripcion_2="nombre_ciudad",
        propiedad_estado_2="estatu_ciudad"
        const ciudades=await this.consultarServidor(ruta_api_2,nombre_propiedad_lista_2,propiedad_id_2,propiedad_descripcion_2,propiedad_estado_2)
        console.log("lista de de ciudades por estado ->>>",ciudades)
        this.setState({
            id_estado:input.value,
            ciudades,
            id_ciudad:(ciudades.length===0)?null:ciudades[0].id
        })
    }

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

    cambiarEstado(a){
        var input=a.target;
        this.setState({[input.name]:input.value})
    }

    regresar(){
        // alert("regesando")
        this.props.history.push("/dashboard/configuracion/cam");
    }

    extrarDatosDelFormData(formData){
        let json={}
        let iterador = formData.entries()
        let next= iterador.next();
        while(!next.done){
            json[next.value[0]]=next.value[1]
            next=iterador.next()
        }
        return json   
    }

    operacion(){
        // alert("operacion")
        let alerta=JSON.parse(JSON.stringify(this.state.alerta))
        const token=localStorage.getItem('usuario')
        const {operacion}=this.props.match.params
        if(this.validarFormulario()){
            // alert("formulario ok")
            let datosFormulario=new FormData(document.getElementById("formulario_cam"))
            let datos={
                cam:this.extrarDatosDelFormData(datosFormulario),
                token
            }
            console.log("datos del formulario preparados ->>>> ",datos)
            if(operacion==="registrar"){

                axios.post(`http://localhost:8080/configuracion/cam/registrar`,datos)
                .then(respuesta => {
                    let datosServidor=JSON.parse(JSON.stringify(respuesta.data))
                    console.log(datosServidor)
                    if(datosServidor.estado_peticion && datosServidor.estado_peticion==="200"){
                        alerta.color="success"
                        alerta.mensaje=datosServidor.mensaje
                        alerta.estado=true
                        this.setState({alerta})
                    }
                })
                .catch(error => {
                    alerta.color="danger"
                    alerta.mensaje="Error al conectar con el servidor"
                    alerta.estado=true
                    this.setState({alerta})
                    console.log("error al registrar ->>>> ",error)
                })

            }
            else if(operacion==="actualizar"){
                // alert("actualizando")
                const {id}=this.props.match.params 
                axios.put(`http://localhost:8080/configuracion/cam/actualizar/${id}`,datos)
                .then(respuesta => {
                    let datosServidor=JSON.parse(JSON.stringify(respuesta.data))
                    console.log(datosServidor)
                    if(datosServidor.estado_peticion && datosServidor.estado_peticion==="200"){
                        alerta.color="success"
                        alerta.mensaje=datosServidor.mensaje
                        alerta.estado=true
                        this.setState({alerta})
                    }
                    else{
                        alerta.color="danger"
                        alerta.mensaje=datosServidor.mensaje
                        alerta.estado=true
                        this.setState({alerta})
                    }
                })
                .catch(error => {
                    alerta.color="danger"
                    alerta.mensaje="Error al conectar con el servidor"
                    alerta.estado=true
                    this.setState({alerta})
                    console.log("error al actualizar ->>>> ",error)
                })
            }
        }
    }

    

    validarFormulario(){
        let estadoFormulario=false
        const estadoNombreCam=this.validarNombreCam();
        const estadoTelelfono=this.validarTelefono();
        const estatuEstado=this.validarSelectNull("estado");
        const estatuCiudad=this.validarSelectNull("ciudad");
        const estatuTipoCam=this.validarSelectNull("tipo_cam"); 
        const estatuDireccion=this.validarDireccion(); 
        if(estadoNombreCam && estadoTelelfono && estatuEstado && estatuCiudad && estatuTipoCam && estatuDireccion){
            estadoFormulario=true;
        }
        return estadoFormulario;
    }

    validarTelefono(){
        let estado=false;
        let $inputTelefono=document.getElementById("telefono_cam");
        let msj_telefono_cam=JSON.parse(JSON.stringify(this.state.msj_telefono_cam))
        const exprecion1=/\s/g;
        const exprecion2=/[a-zA-Z]/g;
        if($inputTelefono.value!==""){

            if(!exprecion1.test($inputTelefono.value)){

                if(!exprecion2.test($inputTelefono.value)){
                    
                    if($inputTelefono.value.length===11){
                        estado = true;
                        msj_telefono_cam.mensaje="";
                        msj_telefono_cam.color_texto="";
                        this.setState({msj_telefono_cam});
                    }
                    else{
                        msj_telefono_cam.mensaje=`numeros insuficientes -> ${$inputTelefono.value.length}/11`;
                        msj_telefono_cam.color_texto="rojo";
                        this.setState({msj_telefono_cam});
                    }
                    
                }
                else{
                    msj_telefono_cam.mensaje="este campo no permite letras";
                    msj_telefono_cam.color_texto="rojo";
                    this.setState({msj_telefono_cam});
                }

            }
            else{
                msj_telefono_cam.mensaje="este campo no permite espacios en blanco";
                msj_telefono_cam.color_texto="rojo";
                this.setState({msj_telefono_cam});
            }

        }
        else{
            msj_telefono_cam.mensaje="esta campo no puede estar vacio";
            msj_telefono_cam.color_texto="rojo";
            this.setState({msj_telefono_cam});
        }

        return estado;
    }

    validarNombreCam(){
        let estado=false;
        let msj_nombre_cam=JSON.parse(JSON.stringify(this.state.msj_nombre_cam));
        let $inputNombreCam=document.getElementById("nombre_cam");
        const exprecion1=/[a-zA-Z]|[0-9]/g;
        if($inputNombreCam.value!==""){

            if(exprecion1.test($inputNombreCam.value)){
                estado = true;
                msj_nombre_cam.mensaje="";
                msj_nombre_cam.color_texto="";
                this.setState({msj_nombre_cam});

            }
            else{
                msj_nombre_cam.mensaje="este campo no permite espacios en blanco";
                msj_nombre_cam.color_texto="rojo";
                this.setState({msj_nombre_cam});
            }

        }
        else{
            msj_nombre_cam.mensaje="esta campo no puede estar vacio";
            msj_nombre_cam.color_texto="rojo";
            this.setState({msj_nombre_cam});
        }
        return estado;
    }

    validarSelectNull(valorSelect){
        let estado=false;
        let msj=JSON.parse(JSON.stringify(this.state["msj_id_"+valorSelect]));
        if(this.state["id_"+valorSelect]!==null){
            estado = true
            msj.mensaje="";
            msj.color_texto="";
            this.setState({["msj_"+valorSelect]:msj})
        }
        else{
            msj.mensaje="este combo esta vacio por favor inserte datos primero en el modulo de "+valorSelect+" para poder continuar";
            msj.color_texto="rojo";
            this.setState({["msj_"+valorSelect]:msj})
        }
        return estado;

    }

    validarDireccion(){
        let estado=false;
        let $inputDireccion=document.getElementById("direccion_cam");
        let msj_direccion_cam=JSON.parse(JSON.stringify(this.state.msj_direccion_cam));
        const exprecion1=/[a-zA-Z]|[0-9]/g;
        if($inputDireccion.value!==""){

            if(exprecion1.test($inputDireccion.value)){
                estado = true;
                msj_direccion_cam.mensaje="";
                msj_direccion_cam.color_texto="";
                this.setState({msj_direccion_cam});

            }
            else{
                msj_direccion_cam.mensaje="este campo no permite espacios en blanco";
                msj_direccion_cam.color_texto="rojo";
                this.setState({msj_direccion_cam});
            }

        }
        else{
            msj_direccion_cam.mensaje="esta campo no puede estar vacio";
            msj_direccion_cam.color_texto="rojo";
            this.setState({msj_direccion_cam});
        }

        return estado
    }

    async agregar(){
        const ruta_api="http://localhost:8080/configuracion/estado/consultar-todos",
        nombre_propiedad_lista="estados",
        propiedad_id="id_estado",
        propiedad_descripcion="nombre_estado",
        propiedad_estado="estatu_estado"
        const estados=await this.consultarServidor(ruta_api,nombre_propiedad_lista,propiedad_id,propiedad_descripcion,propiedad_estado)
        console.log("lista de estados ->>>",estados)
        const ruta_api_2=`http://localhost:8080/configuracion/ciudad/consultar-x-estado/${estados[0].id}`,
        nombre_propiedad_lista_2="ciudades",
        propiedad_id_2="id_ciudad",
        propiedad_descripcion_2="nombre_ciudad",
        propiedad_estado_2="estatu_ciudad"
        const ciudades=await this.consultarServidor(ruta_api_2,nombre_propiedad_lista_2,propiedad_id_2,propiedad_descripcion_2,propiedad_estado_2)
        console.log("lista de de ciudades por estado ->>>",ciudades)
        const ruta_api_3="http://localhost:8080/configuracion/tipo-cam/consultar-todos",
        nombre_propiedad_lista_3="tipo_cams",
        propiedad_id_3="id_tipo_cam",
        propiedad_descripcion_3="nombre_tipo_cam",
        propiedad_estado_3="estatu_tipo_cam"
        const tipo_cams=await this.consultarServidor(ruta_api_3,nombre_propiedad_lista_3,propiedad_id_3,propiedad_descripcion_3,propiedad_estado_3)
        console.log("lista todos los tipo cam ->>>",tipo_cams)
        this.setState({
            id_cam:"",
            nombre_cam:"",
            telefono_cam:"",
            direccion_cam:"",
            tipo_cams,
            estados,
            ciudades,
            id_estado:(estados.length===0)?null:estados[0].id,
            id_ciudad:(ciudades.length===0)?null:ciudades[0].id,
            id_tipo_cam:(tipo_cams.length===0)?null:tipo_cams[0].id,
            estatu_cam:"1",
        })
        this.props.history.push("/dashboard/configuracion/cam/registrar")
        document.getElementById("id_estado").value=(estados.length===0)?null:estados[0].id
        document.getElementById("id_tipo_cam").value=(tipo_cams.length===0)?null:tipo_cams[0].id
    }

    render(){
        const component=(
            <div className="row justify-content-center">
                {this.state.alerta.estado===true &&
                    (<div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">

                        <AlertBootstrap colorAlert={this.state.alerta.color} mensaje={this.state.alerta.mensaje}/>
                        
                    </div>)
                }
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_formulario_cam">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-cam">
                            <span className="titulo-form-cam">Formulario de CAM (Centro de Asistencia Médica)</span>
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
                    <form  id="formulario_cam" >
                        <div className="row justify-content-center">
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            nombreCampo="Código Registro:"
                            activo="no"
                            type="text"
                            value={this.state.id_cam}
                            name="id_cam"
                            id="id_cam"
                            placeholder="Código CAM"
                            />
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            obligatorio="si"
                            mensaje={this.state.msj_nombre_cam}
                            nombreCampo="Nombre:"
                            activo="si"
                            type="text"
                            value={this.state.nombre_cam}
                            name="nombre_cam"
                            id="nombre_cam"
                            placeholder="Nombre del CAM"
                            eventoPadre={this.cambiarEstado}
                            />
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            obligatorio="si"
                            mensaje={this.state.msj_telefono_cam}
                            nombreCampo="Teléfono:"
                            activo="si"
                            type="text"
                            value={this.state.telefono_cam}
                            name="telefono_cam"
                            id="telefono_cam"
                            placeholder="Teléfono"
                            eventoPadre={this.cambiarEstado}
                            />
                        </div>

                        <div className="row justify-content-center">
                            <ComponentFormTextArea
                            clasesColumna="col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9"
                            nombreCampoTextArea="Dirección:"
                            clasesTextArear="form-control"
                            obligatorio="si"
                            value={this.state.direccion_cam}
                            name="direccion_cam"
                            id="direccion_cam"
                            mensaje={this.state.msj_direccion_cam}
                            eventoPadre={this.cambiarEstado}
                            />
                        </div>

                        <div className="row justify-content-center">
                            <ComponentFormSelect
                            clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                            obligatorio="si"
                            mensaje={this.state.msj_id_tipo_cam}
                            nombreCampoSelect="Tipo de Centro:"
                            clasesSelect="custom-select"
                            name="id_tipo_cam"
                            id="id_tipo_cam"
                            eventoPadre={this.cambiarEstado}
                            defaultValue={this.state.id_tipo_cam}
                            option={this.state.tipo_cams}
                            />
                            <ComponentFormSelect
                            clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                            obligatorio="si"
                            mensaje={this.state.msj_id_estado}
                            nombreCampoSelect="Estado:"
                            clasesSelect="custom-select"
                            name="id_estado"
                            id="id_estado"
                            eventoPadre={this.consultarCiudadesXEstado}
                            defaultValue={this.state.id_estado}
                            option={this.state.estados}
                            />
                            <ComponentFormSelect
                            clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                            obligatorio="si"
                            mensaje={this.state.msj_id_ciudad}
                            nombreCampoSelect="Ciudad:"
                            clasesSelect="custom-select"
                            name="id_ciudad"
                            id="id_ciudad"
                            eventoPadre={this.cambiarEstado}
                            defaultValue={this.state.id_ciudad}
                            option={this.state.ciudades}
                            />
                        
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormRadioState
                            clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            extra="custom-control-inline"
                            nombreCampoRadio="Estatus:"
                            name="estatu_cam"
                            nombreLabelRadioA="Activo"
                            idRadioA="activoA"
                            checkedRadioA={this.state.estatu_cam}
                            valueRadioA="1"
                            nombreLabelRadioB="Inactivo"
                            idRadioB="activoB"
                            valueRadioB="0"
                            eventoPadre={this.cambiarEstado}
                            checkedRadioB={this.state.estatu_cam}
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


        return (
            <div className="component_cam_formulario">
				<ComponentDashboard
                componente={component}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />
			</div>
        )
    }

}

export default withRouter(ComponentCamFormulario)