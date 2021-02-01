import React from "react"
import {withRouter} from "react-router-dom"

//JS
import axios from 'axios'
import Moment from 'moment'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import "../css/componentReposoTrabajador.css"
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'
import ButtonIcon from '../subComponentes/buttonIcon'
import ComponentFormSelect from "../subComponentes/componentFormSelect"
import AlertBootstrap from "../subComponentes/alertBootstrap"
import ComponentFormDate from '../subComponentes/componentFormDate'
// --
import TituloModulo from '../subComponentes/tituloModulo'
import Tabla from '../subComponentes/componentTabla'

class ComponentReposoTrabajador extends React.Component{


    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.redirigirFormulario=this.redirigirFormulario.bind(this);
        this.buscarReposos=this.buscarReposos.bind(this);
        this.actualizarElementoTabla=this.actualizarElementoTabla.bind(this);
        this.consultarElementoTabla=this.consultarElementoTabla.bind(this);
        this.state={
            modulo:"",// modulo menu
            estado_menu:false,
            //---------- 
            fecha_desde_reposo_trabajador:"",
            fecha_hasta_reposo_trabajador:"",
            msj_fecha_desde_reposo_trabajador:{
                mensaje:"",
                color_texto:""
            },msj_fecha_hasta_reposo_trabajador:{
                mensaje:"",
                color_texto:""
            },
            trabajadores:{},
            reposos:{},
            registros:[],
            numeros_registros:0,
            alerta:{
                color:null,
                mensaje:null,
                estado:false
            },
        }
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

    async componentWillMount(){
        let listaDeTrabajadores=await this.consultarTodosTrabajadores();
        let listaDetrabajadoresActivos=listaDeTrabajadores.filter( trabajador =>  trabajador.estatu_trabajador==="1" && trabajador.estatu_cuenta==="1")
        let trabajadores={}
        for(let trabajador of listaDetrabajadoresActivos){
            trabajadores[trabajador.id_cedula]=trabajador
        }
        // reposos
        let listaDeTodosLosReposos=await this.consultarTodosReposo()
        let listaDeRepososActivos= listaDeTodosLosReposos.filter(reposo => reposo.estatu_reposo==="1")
        let reposos={}
        for(let reposo of listaDeRepososActivos){
            reposos[reposo.id_reposo]=reposo
        }

        let fechaDesde=Moment(new Date()).format("YYYY-MM-DD")
        let fechaHasta=Moment(new Date()).format("YYYY-MM-DD")
        this.setState({
            fecha_desde_reposo_trabajador:fechaDesde,
            fecha_hasta_reposo_trabajador:fechaHasta,
            reposos,
            trabajadores
        })
        let datosResposos=await this.consultarRepososTrabajadoresFechaDesdeHasta(fechaDesde,fechaHasta)
        console.log("datos reposos =>>> ",datosResposos)
        let datosTabla=this.verficarLista(datosResposos.reposo_trabajadores)
        this.setState(datosTabla)
        if(this.props.match.params.mensaje){
            const msj=JSON.parse(this.props.match.params.mensaje)
            //alert("OK "+msj.texto)
            var alerta=this.state.alerta
            alerta.mensaje=msj.texto
            alerta.estado=true
            alerta.color="danger"
            this.setState({
                alerta
            })
        }

    }

    verficarLista(json_server_response){
        if(json_server_response.length===0){
            json_server_response.push({
                id_reposo_trabajador:"0",
                id_cedula:"vacio",
                id_reposo:"vacio",
                estatu_reposo_trabajador:"vacio",
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

    async consultarRepososTrabajadoresFechaDesdeHasta(fechaDesde,fechaHasta){
        let datos=null
        await axios.get(`http://localhost:8080/transaccion/reposo-trabajador/consultar-reposo/:${fechaDesde}/${fechaHasta}`)
        .then(repuesta => {
            let json=JSON.parse(JSON.stringify(repuesta.data))
            datos=json
        })
        .catch(error => {
            console.log(error)
        })
        return datos

    }

    cambiarEstado(a){
        var input=a.target;
        this.setState({[input.name]:input.value})
    }

    redirigirFormulario(){
        this.props.history.push("/dashboard/transaccion/reposo-trabajador/registrar")
    }

    async buscarReposos(a){
        this.cambiarEstado(a)
        let fechaDesde=document.getElementById("fecha_desde_reposo_trabajador").value
        let fechaHasta=document.getElementById("fecha_hasta_reposo_trabajador").value
        let datosResposos = await this.consultarRepososTrabajadoresFechaDesdeHasta(fechaDesde,fechaHasta)
        console.log("datos reposos =>>> ",datosResposos)
        let datosTabla=this.verficarLista(datosResposos.reposo_trabajadores)
        this.setState(datosTabla)
    }

    async consultarTodosTrabajadores(){
        let respuesta_servidor=null
        await axios.get("http://localhost:8080/configuracion/trabajador/consultar-todos")
        .then(respuesta=>{
            respuesta_servidor=respuesta.data.trabajadores
            // console.log(respuesta.data)
        })
        .catch(error=>{
            alert("No se pudo conectar con el servidor")
            console.log(error)
        })
        return respuesta_servidor;
    }

    async consultarTodosReposo(){
        let respuesta_servidor=null
        await axios.get("http://localhost:8080/configuracion/reposo/consultar-todos")
        .then(respuesta=>{
            respuesta_servidor=respuesta.data.reposos
        })
        .catch(error=>{
            alert("No se pudo conectar con el servidor")
            console.log(error)
        })
        return respuesta_servidor;
    }

    actualizarElementoTabla(a){
        let boton=a.target
        this.props.history.push(`/dashboard/transaccion/reposo-trabajador/actualizar/${boton.id}`)

    }

    consultarElementoTabla(a){
        let boton=a.target
        this.props.history.push(`/dashboard/transaccion/reposo-trabajador/consultar/${boton.id}`)
    }

    render(){
        const jsx_tabla_encabezado=(
            <thead> 
                <tr> 
                    <th>Codigo</th> 
                    <th>Nombre trabajador</th>
                    <th>Tipo de reposo</th>
                    <th>Estatu del reposo</th>
                </tr> 
            </thead>
        )

        const jsx_tabla_body=(
            <tbody>
                  {this.state.registros.map((reposoTrabajador)=>{
                      return(
                          <tr key={reposoTrabajador.id_reposo_trabajador}>
                            <td>{reposoTrabajador.id_reposo_trabajador}</td>
                            <td>{(reposoTrabajador.id_cedula==="vacio")?"vacio":this.state.trabajadores[reposoTrabajador.id_cedula].nombres} {(reposoTrabajador.id_cedula==="vacio")?"":this.state.trabajadores[reposoTrabajador.id_cedula].apellidos}</td>
                            <td>{(reposoTrabajador.id_reposo==="vacio")?"vacio":this.state.reposos[reposoTrabajador.id_reposo].nombre_reposo}</td>
                            <td>{(reposoTrabajador.estatu_reposo_trabajador==="vacio")?"vacio":(reposoTrabajador.estatu_reposo_trabajador==="1")?"Activo":"Inactivo"}</td>
                           {!reposoTrabajador.vacio &&
                              <td>
                                  <ButtonIcon 
                                  clasesBoton="btn btn-warning btn-block" 
                                  value={reposoTrabajador.id_reposo_trabajador} 
                                  id={reposoTrabajador.id_reposo_trabajador}
                                  eventoPadre={this.actualizarElementoTabla} 
                                  icon="icon-pencil"
                                  />
                              </td>
                           }
                          
                         {!reposoTrabajador.vacio &&
                          <td>
                              <ButtonIcon 
                              clasesBoton="btn btn-secondary btn-block" 
                              value={reposoTrabajador.id_reposo_trabajador}
                              id={reposoTrabajador.id_reposo_trabajador} 
                              eventoPadre={this.consultarElementoTabla} 
                              icon="icon-search"
                              />
                          </td>
                        }
                    </tr>
                    )
                })}
            </tbody>
        )


        const component=(
            <div>
                {this.state.alerta.estado===true &&
                    (<div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">

                        <AlertBootstrap colorAlert={this.state.alerta.color} mensaje={this.state.alerta.mensaje}/>
                        
                    </div>)
                }
                
                <TituloModulo clasesrow="row" clasesColumna="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center" tituloModulo="Modulo de Reposo Trabajador"/>
                
                <div className="row component-tabla-de-datos">
                    <div className="col-12 col-ms-12 col-md-12 contenedor-tabla-de-datos">
                        <div className="row">
                            <ComponentFormDate
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            obligatorio="no"
                            mensaje={this.state.msj_fecha_desde_reposo_trabajador}
                            nombreCampoDate="desde:"
                            clasesCampo="form-control"
                            value={this.state.fecha_desde_reposo_trabajador}
                            name="fecha_desde_reposo_trabajador"
                            id="fecha_desde_reposo_trabajador"
                            eventoPadre={this.buscarReposos}
                            />
                            <ComponentFormDate
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            obligatorio="no"
                            mensaje={this.state.msj_fecha_hasta_reposo_trabajador}
                            nombreCampoDate="hasta:"
                            clasesCampo="form-control"
                            value={this.state.fecha_hasta_reposo_trabajador}
                            name="fecha_hasta_reposo_trabajador"
                            id="fecha_hasta_reposo_trabajador"
                            eventoPadre={this.buscarReposos}
                            />
                        
                        </div>
                        <Tabla 
                        tabla_encabezado={jsx_tabla_encabezado}
                        tabla_body={jsx_tabla_body}
                        numeros_registros={this.state.numeros_registros}
                        />
                    
                    </div>
                
                </div>
                
                <div className="row">
                    <div className="col-3 col-ms-3 col-md-3 columna-boton">
                        <div className="row justify-content-center align-items-center contenedor-boton">
                            <div className="col-auto">
                                <InputButton clasesBoton="btn btn-primary" eventoPadre={this.redirigirFormulario} value="registrar"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

        return (
            <div className="component_reposo_trabajador">
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

export default withRouter(ComponentReposoTrabajador)