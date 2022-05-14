import React from 'react';
import {withRouter} from 'react-router-dom'
import axios from 'axios'
// IP servidor
import servidor from '../ipServer.js'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentFuncionTrabajador.css'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes 
import TituloModulo from '../subComponentes/tituloModulo'
import ComponentTablaDatos from '../subComponentes/componentTablaDeDatos'
import ButtonIcon from '../subComponentes/buttonIcon'
import InputButton from '../subComponentes/input_button'

class ComponentFuncionTrabajador extends React.Component{

    constructor(){
        super();
        this.eliminarElementoTabla=this.eliminarElementoTabla.bind(this)
        this.actualizarElementoTabla=this.actualizarElementoTabla.bind(this)
        this.consultarElementoTabla=this.consultarElementoTabla.bind(this)
        this.buscar=this.buscar.bind(this)
        this.escribir_codigo=this.escribir_codigo.bind(this)
        this.redirigirFormulario=this.redirigirFormulario.bind(this)
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.state={
            modulo:"",
            estado_menu:false,
            //////
            datoDeBusqueda:"",
            registros:[],
            numeros_registros:0,
            horariosHash:{},
            mensaje:{
                texto:"",
                estado:""
            }
        }
    }

    // logica menu
    mostrarModulo(a){
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

    async UNSAFE_componentWillMount(){
        let acessoModulo=await this.validarAccesoDelModulo("/dashboard/configuracion","/funcion-trabajador")
        if(acessoModulo){
            await this.consultarTodosLosHorarios()
            var json_server_response=await this.consultarTodosFuncionTrabajador();
            var servidor=this.verficarLista(json_server_response);
            if(this.props.match.params.mensaje){
                const msj=JSON.parse(this.props.match.params.mensaje)
                //alert("OK "+msj.texto)
                var mensaje=this.state.mensaje
                mensaje.texto=msj.texto
                mensaje.estado=msj.estado
                servidor.mensaje=mensaje
            }
            this.setState(servidor)
        }
        else{
            alert("No tienes acesso a este modulo(sera redirigido a la vista anterior)")
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

    async consultarTodosLosHorarios(){
        let datos=[]
        let horariosHash={}
        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/horario/consultar-todos`)
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

    async consultarTodosFuncionTrabajador(){
        var respuesta_servidor=[]
        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/funcion-trabajador/consultar-todos`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data.funciones
            console.log(respuesta.data)
        })
        .catch(error=>{
            alert("No se pudo conectar con el servidor")
            console.log(error)
        })
        return respuesta_servidor;
    }

    verficarLista(json_server_response){
        if(json_server_response.length===0){
            json_server_response.push({
                id_funcion_trabajador:"0",
                funcion_descripcion:"vacio",
                id_horario:"vacio",
                vacio:"vacio"
            })
            return {registros:json_server_response,numeros_registros:0}
        }
        else{
            return {
                registros:json_server_response,
                numeros_registros:json_server_response.length
            }
        } 
    }

    redirigirFormulario(a){
        const input = a.target;
        if(input.value==="Registrar"){
            this.props.history.push("/dashboard/configuracion/funcion-trabajador/registrar")
        }
    }

    eliminarElementoTabla(a){
        var input=a.target;
        alert("Eliminar -> "+input.id);
    }
    
    actualizarElementoTabla(a){
        var input=a.target;
        this.props.history.push("/dashboard/configuracion/funcion-trabajador/actualizar/"+input.id);
    }
    
    consultarElementoTabla(a){
        let input=a.target;
        //alert("Consultar -> "+input.id);
        this.props.history.push("/dashboard/configuracion/funcion-trabajador/consultar/"+input.id);
    }

    async buscar(a){
        var respuesta_servidor="",
        valor=this.state.datoDeBusqueda
        if(valor!==""){
            await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/funcion-trabajador/consultar-patron/${valor}`)
            .then(respuesta=>{
                respuesta_servidor=respuesta.data
                console.log(respuesta_servidor)
                this.setState({registros:respuesta_servidor.funciones,numeros_registros:respuesta_servidor.funciones.length})
            })
            .catch(error=>{
                console.log(error)
                alert("Error en el servidor")
            })
        }
        else{
            alert("Error:la barra de busqueda esta vacia")
        }
    }

    async escribir_codigo(a){
        var input=a.target,
        valor=input.value
        if(valor!==""){
            await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/funcion-trabajador/consultar-patron/${valor}`)
            .then(respuesta=>{
                    let respuesta_servidor=JSON.parse(JSON.stringify(respuesta.data))
                    this.setState({registros:respuesta_servidor.funciones,numeros_registros:respuesta_servidor.funciones.length})
            })
            .catch(error=>{
                    console.log(error)
                    alert("Error en el servidor")
            })
        }
        else{
            console.log("no se puedo realizar la busqueda por que intento realizarla con el campo vacio")
            var json_server_response=await this.consultarTodosFuncionTrabajador();
            var servidor=this.verficarLista(json_server_response);
            this.setState(servidor)
        }
    }

    /**
     * {!funcion.vacio &&
                            <td>
                                <ButtonIcon clasesBoton="btn btn-danger btn-block" 
                                value={funcion.id_funcion_trabajador} 
                                id={funcion.id_funcion_trabajador}
                                eventoPadre={this.eliminarElementoTabla} 
                                icon="icon-bin"
                                />
                            </td>
                        }
    */

    render(){
        const jsx_tabla_encabezado=(
            <thead> 
                <tr> 
                    <th>Código</th> 
                    <th>Función Trabajador</th>
                    <th>Descripción Horario</th>
                    <th>Hora de Entrada</th>
                    <th>Hora de Salida</th>
                </tr> 
            </thead>
        )
        const jsx_tabla_body=(
            <tbody>
                {this.state.registros.map((funcion)=>{
                    return(
                        <tr key={funcion.id_funcion_trabajador}>
                            <td>{funcion.id_funcion_trabajador}</td>
                            <td>{funcion.funcion_descripcion}</td>
                            <td>{(funcion.id_horario==="vacio")?"vacio":this.state.horariosHash[funcion.id_horario].horario_descripcion}</td>
                            <td>{(funcion.id_horario==="vacio")?"vacio":this.state.horariosHash[funcion.id_horario].horario_entrada}</td>
                            <td>{(funcion.id_horario==="vacio")?"vacio":this.state.horariosHash[funcion.id_horario].horario_salida}</td>
                            
                        {!funcion.vacio &&
                            <td>
                                <ButtonIcon 
                                clasesBoton="btn btn-warning btn-block" 
                                value={funcion.id_funcion_trabajador} 
                                id={funcion.id_funcion_trabajador}
                                eventoPadre={this.actualizarElementoTabla} 
                                icon="icon-pencil"
                                />
                            </td>
                        }
                        
                        </tr>
                    )
                })}
            </tbody>
        )
        const jsx_funcion_trabajador_inicio=(
            <div>
                {this.state.mensaje.texto!=="" && (this.state.mensaje.estado==="500" || this.state.mensaje.estado==="404") &&
                    <div className="row">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <div className="alert alert-danger alert-dismissible ">
                                <p>Mensaje del Error: {this.state.mensaje.texto}</p>
                                <p>Estado del Error: {this.state.mensaje.estado}</p>
                                <button className="close" data-dismiss="alert">
                                    <span>X</span>
                                </button>
                            </div>
                        </div>
                    </div>
                }
                <TituloModulo clasesRow="row" clasesColumna="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center" tituloModulo="Módulo de Función Trabajador"/>
                <ComponentTablaDatos 
                    eventoBuscar={this.buscar}
                    eventoEscribirCodigo={this.escribir_codigo}
                    tabla_encabezado={jsx_tabla_encabezado}
                    tabla_body={jsx_tabla_body}
                    numeros_registros={this.state.numeros_registros}
                />
                <div className="row">
                    <div className="col-3 col-ms-3 col-md-3 columna-boton">
                        <div className="row justify-content-center align-items-center contenedor-boton">
                            <div className="col-auto">
                                <InputButton clasesBoton="btn btn-primary" eventoPadre={this.redirigirFormulario} value="Registrar"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

        return (
            <div className="component_permiso_inicio">
                <ComponentDashboard
                componente={jsx_funcion_trabajador_inicio}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />
            </div>
        )
    }
}

export default withRouter(ComponentFuncionTrabajador)