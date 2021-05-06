import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentCiudadForm.css'
//JS
import axios from 'axios'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'
import ButtonIcon from '../subComponentes/buttonIcon'
import ComponentFormCampo from '../subComponentes/componentFormCampo';
import ComponentFormSelect from '../subComponentes/componentFormSelect';
import ComponentFormRadioState from '../subComponentes/componentFormRadioState';


class ComponentCiudadForm extends React.Component{
	
	constructor(){
		super();
		this.mostrarModulo=this.mostrarModulo.bind(this);
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.validarTexto=this.validarTexto.bind(this);
        this.operacion=this.operacion.bind(this);
        this.regresar=this.regresar.bind(this);
        this.agregar= this.agregar.bind(this);
        this.state={
            modulo:"",// modulo menu
            estado_menu:false,

            id_ciudad:"" ,
            nombre_ciudad:"" ,
            id_estado:"",
            estatu_ciudad:"1",
            //
            msj_nombre_ciudad:{
                mensaje:"",
                color_texto:""
            },
            msj_id_estado:{
                mensaje:"",
                color_texto:""
            },
            estados:[],
            //
            mensaje:{
                texto:"",
                estado:""
            }
        }
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

    async generarIdCiudad(){
        var respuesta_servidor="",
        mensaje={texto:"",estado:""}
        await axios.get("http://localhost:8080/configuracion/ciudad/generar-id")
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            //console.log(respuesta_servidor)
        })
        .catch(error=>{
            mensaje.texto="no hay conxion con el servido"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/ciudad${JSON.stringify(mensaje)}`)
        })
        return respuesta_servidor
    }

    async UNSAFE_componentWillMount(){
        let acessoModulo=await this.validarAccesoDelModulo("/dashboard/configuracion","/ciudad")
        if(acessoModulo){
            const {operacion}=this.props.match.params
            if(operacion==="registrar"){
                const {id}=await this.generarIdCiudad();
                const ruta_api="http://localhost:8080/configuracion/estado/consultar-todos",
                nombre_propiedad_lista="estados",
                propiedad_id="id_estado",
                propiedad_descripcion="nombre_estado",
                propiedad_estado="estatu_estado"
                const estado=await this.consultarServidor(ruta_api,nombre_propiedad_lista,propiedad_id,propiedad_descripcion,propiedad_estado)
                // console.log("->>>>",estado)
                this.setState({
                    id_ciudad:id,
                    estados:estado,
                    id_estado:(estado.length===0)?null:estado[0].id
                })
            }
            else{
                const {id}=this.props.match.params
                const ciudad=await this.consultarCiudad(id)
                const ruta_api="http://localhost:8080/configuracion/estado/consultar-todos",
                nombre_propiedad_lista="estados",
                propiedad_id="id_estado",
                propiedad_descripcion="nombre_estado",
                propiedad_estado="estatu_estado"
                const estado=await this.consultarServidor(ruta_api,nombre_propiedad_lista,propiedad_id,propiedad_descripcion,propiedad_estado)
                ciudad.estados=estado
                this.setState(ciudad)
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
                ciudad={
                    id_ciudad:respuesta_servidor.ciudad.id_ciudad,
                    nombre_ciudad:respuesta_servidor.ciudad.nombre_ciudad,
                    id_estado:respuesta_servidor.ciudad.id_estado,
                    estatu_ciudad:respuesta_servidor.ciudad.estatu_ciudad,
                }
            }
            else if(respuesta_servidor.estado_peticion==="404"){
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                this.props.history.push(`/dashboard/configuracion/ciudad${JSON.stringify(mensaje)}`)
            }

        })
        .catch(error=>{
            console.log(error)
            mensaje.texto="No se puedo conectar con el servidor"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/ciudad${JSON.stringify(mensaje)}`)
        })
        return ciudad
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
                this.props.history.push(`/dashboard/configuracion/ciudad${JSON.stringify(mensaje)}`)
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

    cambiarEstadoDos(input){
        this.setState({[input.name]:input.value})
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

    validarNombreCiudad(){
        var estado = false
        const nombre=this.state.nombre_ciudad
        const msj_nombre_ciudad=this.state.msj_nombre_ciudad
        const exprecion=/[A-Za-z]/
        if(nombre!==""){
            if(exprecion.test(nombre)){
                estado=true
                msj_nombre_ciudad.color_texto=""
                msj_nombre_ciudad.mensaje=""
                this.setState({
                    msj_nombre_ciudad:msj_nombre_ciudad
                })
            }
            else{
                msj_nombre_ciudad.color_texto="rojo"
                msj_nombre_ciudad.mensaje="el campo no puede estar en blanco"
                this.setState({
                    msj_nombre_ciudad:msj_nombre_ciudad
                })
            }
        }
        else{
            msj_nombre_ciudad.color_texto="rojo"
            msj_nombre_ciudad.mensaje="el campo no puede estar vacio"
            this.setState({
                msj_nombre_ciudad:msj_nombre_ciudad
            })
        }
        return estado
    }

    verificarSelect(nombre_campo,modulo,modulos){
        var respuesta=false,
        contador=0
        var mensaje_select=this.state["msj_"+nombre_campo]
        if(modulo!==""){
            while(contador<modulos.length){
                var {id} = modulos[contador];
                if(modulo===id){
                    respuesta=true;
                }
                contador+=1
            }
            if(respuesta){
                console.log("NL-> 236: OK COMBO");
                mensaje_select[0]={mensaje:"",color_texto:"rojo"}
                this.setState({["msj_"+nombre_campo]:mensaje_select})
            }
            else{
                mensaje_select[0]={mensaje:"Error no puedes modificar los valores del Combo",color_texto:"rojo"}
                this.setState({["msj_"+nombre_campo]:mensaje_select})
            }
        }
        else{
            mensaje_select[0]={mensaje:"Por favor seleciona un elemento del combo",color_texto:"rojo"}
            this.setState({["msj_"+nombre_campo]:mensaje_select})
        }
        return respuesta;
    }

    validarFormulario(){
        var estado=false
        const validarNombreCiudad=this.validarNombreCiudad(),
        validarSelect=this.verificarSelect("id_estado",this.state.id_estado,this.state.estados)
        if(validarNombreCiudad && validarSelect){
            estado=true
        }
        return estado
    }

    operacion(){
        const {operacion}=this.props.match.params,
        mensaje=this.state.mensaje,
        mensaje_formulario={
            mensaje:"",
            msj_nombre_ciudad:{
                mensaje:"",
                color_texto:""
            },
            msj_id_estado:{
                mensaje:"",
                color_texto:""
            },
        }
        var respuesta_servidor={}
        if(operacion==="registrar"){
            this.registrar(mensaje_formulario,mensaje,respuesta_servidor)
        }
        else{
            this.actualizar(mensaje_formulario,mensaje,respuesta_servidor)
        }    
    }

    registrar(mensaje_formulario,mensaje,respuesta_servidor){
        if(this.validarFormulario()){
            this.enviarDatos((objeto)=>{
                axios.post("http://localhost:8080/configuracion/ciudad/registrar",objeto)
                .then(respuesta=>{
                    respuesta_servidor=respuesta.data
                    mensaje.texto=respuesta_servidor.mensaje
                    mensaje.estado=respuesta_servidor.estado_peticion
                    mensaje_formulario.mensaje=mensaje
                    this.setState(mensaje_formulario)
                })
                .catch(error=>{
                    mensaje.texto="No se puedo conectar con el servidor"
                    mensaje.estado="500"
                    console.log(error)
                    mensaje_formulario.mensaje=mensaje
                    this.setState(mensaje_formulario)
                })
            })
        }
        else{
            alert("ERROR al validar el formulario")
        }
    }

    actualizar(mensaje_formulario,mensaje,respuesta_servidor){
        if(this.validarFormulario()){
            this.enviarDatos((objeto)=>{
                axios.put(`http://localhost:8080/configuracion/ciudad/actualizar/${this.state.id_ciudad}`,objeto)
                .then(respuesta=>{
                respuesta_servidor=respuesta.data
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                mensaje_formulario.mensaje=mensaje
                this.setState(mensaje_formulario)
                })
                .catch(error=>{
                    mensaje.texto="No se puedo conectar con el servidor"
                    mensaje.estado="500"
                    console.log(error)
                    mensaje_formulario.mensaje=mensaje
                    this.setState(mensaje_formulario)
                })
            })
        }
        else{
            alert("ERROR al validar el formulario")
        }
    }

    enviarDatos(peticion){
        const token=localStorage.getItem('usuario')
        const datos={
            ciudad:{
                id_ciudad:this.state.id_ciudad,
                nombre_ciudad:this.state.nombre_ciudad,
                id_estado:this.state.id_estado,
                estatu_ciudad:this.state.estatu_ciudad
            },
            token
        }
        peticion(datos)
    }

    async agregar(){
        const {id}=await this.generarIdCiudad();
        const ruta_api="http://localhost:8080/configuracion/estado/consultar-todos",
        nombre_propiedad_lista="estados",
        propiedad_id="id_estado",
        propiedad_descripcion="nombre_estado",
        propiedad_estado="estatu_estado"
        const estado=await this.consultarServidor(ruta_api,nombre_propiedad_lista,propiedad_id,propiedad_descripcion,propiedad_estado)
        const formulario={
            id_ciudad:id,
            nombre_ciudad:"",
            id_estado:(estado.length===0)?null:estado[0].id,
            estatu_ciudad:"1",
            estados:estado
        }
        this.setState(formulario)
        this.props.history.push("/dashboard/configuracion/ciudad/registrar")
        document.getElementById("id_estado").value=(estado.length===0)?null:estado[0].id
    }

    regresar(){
        this.props.history.push("/dashboard/configuracion/ciudad");
    }

    

    render(){
    	const jsx_ciudad=(
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
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_ciudad_form">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-ciudad-form">
                            <span className="titulo-ciudad-form">Formulario Ciudad</span>
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
                    <form id="form_ciudad">
                        <div className="row justify-content-center">
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            obligatorio="si"
                            nombreCampo="Código:"
                            activo="no"
                            type="text"
                            value={this.state.id_ciudad}
                            name="id_ciudad"
                            id="id_ciudad"
                            placeholder="Código Ciudad"
                            />
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            obligatorio="si"
                            mensaje={this.state.msj_nombre_ciudad}
                            nombreCampo="Nombre:"
                            activo="si"
                            type="text"
                            value={this.state.nombre_ciudad}
                            name="nombre_ciudad"
                            id="nombre_ciudad"
                            placeholder="Nombre"
                            eventoPadre={this.validarTexto}
                            />
                            <ComponentFormSelect
                            clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                            obligatorio="si"
                            mensaje={this.state.msj_id_estado}
                            nombreCampoSelect="Estado:"
                            clasesSelect="custom-select"
                            name="id_estado"
                            id="id_estado"
                            eventoPadre={this.cambiarEstado}
                            defaultValue={this.state.id_estado}
                            option={this.state.estados}
                            />
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormRadioState
                            clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            extra="custom-control-inline"
                            nombreCampoRadio="Estatus:"
                            name="estatu_ciudad"
                            nombreLabelRadioA="Activo"
                            idRadioA="activotrabajadorA"
                            checkedRadioA={this.state.estatu_ciudad}
                            valueRadioA="1"
                            nombreLabelRadioB="Inactivo"
                            idRadioB="activotrabajadorB"
                            valueRadioB="0"
                            eventoPadre={this.cambiarEstado}
                            checkedRadioB={this.state.estatu_ciudad}
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
    		<div className="component_ciudad_form">
				<ComponentDashboard
                componente={jsx_ciudad}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />
			</div>
    	)
    }

}

export default withRouter(ComponentCiudadForm)