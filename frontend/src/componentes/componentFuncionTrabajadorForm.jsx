import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentFuncionTrabajadorForm.css'
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

class ComponentFuncionTrabajador extends React.Component{

    constructor(){
        super();
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.validarTexto=this.validarTexto.bind(this);
        this.operacion=this.operacion.bind(this);
        this.regresar=this.regresar.bind(this);
        this.agregar= this.agregar.bind(this);
        this.mostrarHorario= this.mostrarHorario.bind(this);
        this.state={
            modulo:"",// modulo menu
            estado_menu:false,

            id_funcion_trabajador:"" ,
            funcion_descripcion:"" ,
            id_tipo_trabajador:"",
            estatu_funcion_trabajador:"1",
            id_horario:"",
            //
            msj_funcion_descripcion:{
                mensaje:"",
                color_texto:""
            },
            msj_id_tipo_trabajador:{
                mensaje:"",
                color_texto:""
            },
            msj_id_horario:{
                mensaje:"",
                color_texto:""
            },
            tipos_trabajador:[],
            horarios:[],
            horariosHash:{},
            hora_entrada:null,
            hora_salida:null,
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

    async generarIdFuncionTrabajador(){
        var respuesta_servidor="",
        mensaje={texto:"",estado:""}
        await axios.get("http://localhost:8080/configuracion/funcion-trabajador/generar-id")
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            //console.log(respuesta_servidor)
        })
        .catch(error=>{
            mensaje.texto="no hay conxion con el servido"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/funcion-trabajador${JSON.stringify(mensaje)}`)
        })
        return respuesta_servidor
    }

    async UNSAFE_componentWillMount(){
        let acessoModulo=await this.validarAccesoDelModulo("/dashboard/configuracion","/funcion-trabajador")
        if(acessoModulo){
            const {operacion}=this.props.match.params
        
            if(operacion==="registrar"){
                const {id}=await this.generarIdFuncionTrabajador();
                const ruta_api="http://localhost:8080/configuracion/tipo-trabajador/consultar-tipos-trabajador",
                nombre_propiedad_lista="tipos_trabajador",
                propiedad_id="id_tipo_trabajador",
                propiedad_descripcion="descripcion_tipo_trabajador",
                propiedad_estado="estatu_tipo_trabajador"
                const tipo_trabajador=await this.consultarServidor(ruta_api,nombre_propiedad_lista,propiedad_id,propiedad_descripcion,propiedad_estado)
                const horarios=await this.consultarTodosLosHorarios()
                this.setState({
                    id_funcion_trabajador:id,
                    tipos_trabajador:(tipo_trabajador.length===0)?null:tipo_trabajador,
                    id_tipo_trabajador:(tipo_trabajador.length===0)?null:tipo_trabajador[0].id,
                    horarios:(horarios.length===0)?null:horarios,
                    id_horario:(horarios.length===0)?null:horarios[0].id,
                    hora_entrada:(horarios.length===0)?null:this.state.horariosHash[horarios[0].id].horario_entrada,
                    hora_salida:(horarios.length===0)?null:this.state.horariosHash[horarios[0].id].horario_salida
                })
            }
            else{
                const {id}=this.props.match.params
                const funcion=await this.consultarFuncionTrabajador(id)
                const ruta_api="http://localhost:8080/configuracion/tipo-trabajador/consultar-tipos-trabajador",
                nombre_propiedad_lista="tipos_trabajador",
                propiedad_id="id_tipo_trabajador",
                propiedad_descripcion="descripcion_tipo_trabajador",
                propiedad_estado="estatu_tipo_trabajador"
                const tipo_trabajador=await this.consultarServidor(ruta_api,nombre_propiedad_lista,propiedad_id,propiedad_descripcion,propiedad_estado)
                funcion.tipos_trabajador=tipo_trabajador
                const horarios=await this.consultarTodosLosHorarios()
                this.setState(funcion)
                // console.log("=>>>> ",funcion)
                // console.log("=>>>> ",this.state.horariosHash[funcion.id_horario])
                this.setState({
                    horarios:(horarios.length===0)?null:horarios,
                    hora_entrada:(horarios.length===0)?null:this.state.horariosHash[funcion.id_horario].horario_entrada,
                    hora_salida:(horarios.length===0)?null:this.state.horariosHash[funcion.id_horario].horario_salida
                })
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

    async consultarTodosLosHorarios(){
        let datos=[]
        let horariosHash={}
        await axios.get("http://localhost:8080/configuracion/horario/consultar-todos")
        .then(respuesta => {
            let json=JSON.parse(JSON.stringify(respuesta.data))
            // console.log("lista de horarios =>>>>> ",json)
            if(json.estado_peticion==="200"){
                for(let horario of json.horarios){
                    if(horario.estatu_horario==="1"){
                        horariosHash[horario.id_horario]=horario
                        datos.push({
                            id:horario.id_horario,
                            descripcion:horario.horario_descripcion
                        })
                    }
                }
            }

        })
        .catch(error => {
            console.log("error al conectar con el servidor")
        })
        this.setState({horariosHash})
        return datos
    }

    async consultarFuncionTrabajador(id){
        var mensaje={texto:"",estado:""},
        respuesta_servidor=""
        var funcion={}
        const token=localStorage.getItem('usuario')
        await axios.get(`http://localhost:8080/configuracion/funcion-trabajador/consultar/${id}/${token}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            if(respuesta_servidor.estado_peticion==="200"){
                funcion=respuesta_servidor.funciones
            }
            else if(respuesta_servidor.estado_peticion==="404"){
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                this.props.history.push(`/dashboard/configuracion/funcion-trabajador${JSON.stringify(mensaje)}`)
            }

        })
        .catch(error=>{
            console.log(error)
            mensaje.texto="No se puedo conectar con el servidor"
            mensaje.estado="500"
            this.props.history.push(`/dashboard/configuracion/funcion-trabajador${JSON.stringify(mensaje)}`)
        })
        return funcion
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
                this.props.history.push(`/dashboard/configuracion/funcion-trabajador${JSON.stringify(mensaje)}`)
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

    validarNombreFuncion(){
        var estado = false
        const nombre=this.state.funcion_descripcion
        const msj_funcion_descripcion=this.state.msj_funcion_descripcion
        const exprecion=/[A-Za-z]/
        if(nombre!==""){
            if(exprecion.test(nombre)){
                estado=true
                msj_funcion_descripcion.color_texto=""
                msj_funcion_descripcion.mensaje=""
                this.setState({
                    msj_funcion_descripcion:msj_funcion_descripcion
                })
            }
            else{
                msj_funcion_descripcion.color_texto="rojo"
                msj_funcion_descripcion.mensaje="el campo no puede estar en blanco"
                this.setState({
                    msj_funcion_descripcion:msj_funcion_descripcion
                })
            }
        }
        else{
            msj_funcion_descripcion.color_texto="rojo"
            msj_funcion_descripcion.mensaje="el campo no puede estar vacio"
            this.setState({
                msj_funcion_descripcion:msj_funcion_descripcion
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
        const validarNombreFuncion=this.validarNombreFuncion(),
        validarSelect=this.verificarSelect("id_tipo_trabajador",this.state.id_tipo_trabajador,this.state.tipos_trabajador)
        if(validarNombreFuncion && validarSelect){
            estado=true
        }
        return estado
    }

    operacion(){
        const {operacion}=this.props.match.params,
        mensaje=this.state.mensaje,
        mensaje_formulario={
            mensaje:"",
            msj_funcion_descripcion:{
                mensaje:"",
                color_texto:""
            },
            msj_id_tipo_trabajador:{
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
                axios.post("http://localhost:8080/configuracion/funcion-trabajador/registrar",objeto)
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
                axios.put(`http://localhost:8080/configuracion/funcion-trabajador/actualizar/${this.state.id_funcion_trabajador}`,objeto)
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
            funcion:{
                id_funcion_trabajador:this.state.id_funcion_trabajador,
                funcion_descripcion:this.state.funcion_descripcion,
                id_tipo_trabajador:this.state.id_tipo_trabajador,
                estatu_funcion_trabajador:this.state.estatu_funcion_trabajador,
                id_horario:this.state.id_horario
            },
            token
        }
        peticion(datos)
    }

    async agregar(){
        const {id}=await this.generarIdFuncionTrabajador();
        const ruta_api="http://localhost:8080/configuracion/tipo-trabajador/consultar-tipos-trabajador",
        nombre_propiedad_lista="tipos_trabajador",
        propiedad_id="id_tipo_trabajador",
        propiedad_descripcion="descripcion_tipo_trabajador",
        propiedad_estado="estatu_tipo_trabajador"
        const tipo_trabajador=await this.consultarServidor(ruta_api,nombre_propiedad_lista,propiedad_id,propiedad_descripcion,propiedad_estado)
        const horarios=await this.consultarTodosLosHorarios()
        const formulario={
            id_funcion_trabajador:id,
            funcion_descripcion:"",
            id_tipo_trabajador:(tipo_trabajador.length===0)?null:tipo_trabajador[0].id,
            estatu_funcion_trabajador:"1",
            tipo_trabajador:tipo_trabajador,
            horarios:(horarios.length===0)?null:horarios,
            id_horario:(horarios.length===0)?null:horarios[0].id,
            hora_entrada:(horarios.length===0)?null:this.state.horariosHash[horarios[0].id].horario_entrada,
            hora_salida:(horarios.length===0)?null:this.state.horariosHash[horarios[0].id].horario_salida
        }
        this.setState(formulario)
        document.getElementById("id_tipo_trabajador").value=(tipo_trabajador.length===0)?null:tipo_trabajador[0].id
        document.getElementById("id_horario").value=(horarios.length===0)?null:horarios[0].id
    }

    regresar(){
        this.props.history.push("/dashboard/configuracion/funcion-trabajador");
    }

    mostrarHorario(a){
        let input=a.target
        this.cambiarEstado(a)
        this.setState({
            hora_entrada:this.state.horariosHash[input.value].horario_entrada,
            hora_salida:this.state.horariosHash[input.value].horario_salida
        })
        
    }

    render(){
        const jsx_funcion_trabajador=(
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
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_funcion_trabajador_form">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-tipo-trabajador">
                            <span className="titulo-funcion-trabajador-form">Formulario Función Trabajador</span>
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
                    <form id="form_funcion_trabajador">
                        <div className="row justify-content-center">
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            obligatorio="si"
                            nombreCampo="Codigo:"
                            activo="no"
                            type="text"
                            value={this.state.id_funcion_trabajador}
                            name="id_funcion_trabajador"
                            id="id_funcion_trabajador"
                            placeholder="CODIGO FUNCION"
                            />
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            obligatorio="si"
                            mensaje={this.state.msj_funcion_descripcion}
                            nombreCampo="Nombre:"
                            activo="si"
                            type="text"
                            value={this.state.funcion_descripcion}
                            name="funcion_descripcion"
                            id="funcion_descripcion"
                            placeholder="Nombre"
                            eventoPadre={this.validarTexto}
                            />
                            <ComponentFormSelect
                            clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                            obligatorio="si"
                            mensaje={this.state.msj_id_tipo_trabajador}
                            nombreCampoSelect="Tipo de Trabajador:"
                            clasesSelect="custom-select"
                            name="id_tipo_trabajador"
                            id="id_tipo_trabajador"
                            eventoPadre={this.cambiarEstado}
                            defaultValue={this.state.id_tipo_trabajador}
                            option={this.state.tipos_trabajador}
                            />
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormSelect
                            clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                            obligatorio="si"
                            mensaje={this.state.msj_id_horario}
                            nombreCampoSelect="Horario:"
                            clasesSelect="custom-select"
                            name="id_horario"
                            id="id_horario"
                            eventoPadre={this.mostrarHorario}
                            defaultValue={this.state.id_horario}
                            option={this.state.horarios}
                            />
                            <div className="col-6 col-ms-6 col-md-6 col-lg-6 col-xl-6"></div>
                        </div>
                        {this.state.hora_entrada!==null &&
                                (
                                <div className="row justify-content-center mb-3">
                                    <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3">Horario de Entrada: {this.state.hora_entrada}</div>
                                    <div className="col-6 col-ms-6 col-md-6 col-lg-6 col-xl-6"></div>
                                </div>
                                )

                        }
                        {this.state.hora_entrada!==null &&
                            (
                                <div className="row justify-content-center mb-3">
                                    <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3">Horario de Salida: {this.state.hora_salida}</div>
                                    <div className="col-6 col-ms-6 col-md-6 col-lg-6 col-xl-6"></div>
                                </div>
                            )

                        }
                        <div className="row justify-content-center">
                            <ComponentFormRadioState
                            clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            extra="custom-control-inline"
                            nombreCampoRadio="Estatus:"
                            name="estatu_funcion_trabajador"
                            nombreLabelRadioA="Activo"
                            idRadioA="activotrabajadorA"
                            checkedRadioA={this.state.estatu_funcion_trabajador}
                            valueRadioA="1"
                            nombreLabelRadioB="Inactivo"
                            idRadioB="activotrabajadorB"
                            valueRadioB="0"
                            eventoPadre={this.cambiarEstado}
                            checkedRadioB={this.state.estatu_funcion_trabajador}
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
			<div className="component_funcion_trabajador_form">
				<ComponentDashboard
                componente={jsx_funcion_trabajador}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />
			</div>
		)
    }


}

export default withRouter(ComponentFuncionTrabajador)