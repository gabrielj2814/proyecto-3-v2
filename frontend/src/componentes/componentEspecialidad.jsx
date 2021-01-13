import React from 'react';
import {withRouter} from 'react-router-dom'
import axios from 'axios'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentEspecialidad.css'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes 
import TituloModulo from '../subComponentes/tituloModulo'
import ComponentTablaDatos from '../subComponentes/componentTablaDeDatos'
import ButtonIcon from '../subComponentes/buttonIcon'
import InputButton from '../subComponentes/input_button'

class ComponentEspecialidad extends React.Component{

    constructor(){
        super();
        this.eliminarElementoTabla=this.eliminarElementoTabla.bind(this)
        this.actualizarElementoTabla=this.actualizarElementoTabla.bind(this)
        this.consultarElementoTabla=this.consultarElementoTabla.bind(this)
        this.buscar=this.buscar.bind(this)
        this.escribir_codigo=this.escribir_codigo.bind(this)
        this.redirigirFormulario=this.redirigirFormulario.bind(this)
        this.mostrarModulo=this.mostrarModulo.bind(this)
        this.state={
            modulo:"",
            estado_menu:false,
            //////
            datoDeBusqueda:"",
            registros:[],
            numeros_registros:0,
            mensaje:{
                texto:"",
                estado:""
            }
        }
    }

    async UNSAFE_componentWillMount(){
        var json_server_response=await this.consultarTodasEspecialidad();
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

    async consultarTodasEspecialidad(){
        var respuesta_servidor=[]
        await axios.get("http://localhost:8080/configuracion/especialidad/consultar-todos")
        .then(respuesta=>{
          respuesta_servidor=respuesta.data.especialidades
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
              id_especialidad:"0",
              nombre_especialidad:"vacio",
              vacio:"vacio"
            })
            return {registros:json_server_response}
          }
          else{
            return {
              registros:json_server_response,
              numeros_registros:json_server_response.length
            }
          } 
      }

      eliminarElementoTabla(a){
        var input=a.target;
        alert("Eliminar -> "+input.id);
      }
      
      actualizarElementoTabla(a){
          var input=a.target;
          this.props.history.push("/dashboard/configuracion/especialidad/actualizar/"+input.id);
      }
      
      consultarElementoTabla(a){
          let input=a.target;
          //alert("Consultar -> "+input.id);
          this.props.history.push("/dashboard/configuracion/especialidad/consultar/"+input.id);
      }

      async buscar(a){
        var respuesta_servidor="",
        valor=this.state.datoDeBusqueda
        if(valor!==""){
          await axios.get(`http://localhost:8080/configuracion/especialidad/consultar-patron/${valor}`)
            .then(respuesta=>{
              respuesta_servidor=respuesta.data
              console.log(respuesta_servidor)
              this.setState({registros:respuesta_servidor.especialidades})
            })
            .catch(error=>{
              console.log(error)
              alert("error en el servidor")
            })
        }
        else{
          alert("Error:la barra de busqueda esta vacia")
        }
      }

      async escribir_codigo(a){
        var input=a.target,
        valor=input.value,
        respuesta_servidor=""
        if(valor!==""){
          await axios.get(`http://localhost:8080/configuracion/especialidad/consultar-patron/${valor}`)
          .then(respuesta=>{
            respuesta_servidor=respuesta.data
            console.log(respuesta_servidor)
            this.setState({datoDeBusqueda:valor,registros:respuesta_servidor.especialidades})
          })
          .catch(error=>{
            console.log(error)
            alert("error en el servidor")
          })
        }
        else{
          console.log("no se puedo realizar la busqueda por que intento realizarla con el campo vacio")
        }
      }

      redirigirFormulario(a){
        const input = a.target;
        if(input.value==="registrar"){
          this.props.history.push("/dashboard/configuracion/especialidad/registrar")
        }
    }
    

    render(){

        const jsx_tabla_encabezado=(
            <thead> 
                <tr> 
                  <th>Codigo</th> 
                  <th>Nombre</th>
                </tr> 
            </thead>
        )

        const jsx_tabla_body=(
            <tbody>
                  {this.state.registros.map((especialidad)=>{
                      return(
                          <tr key={especialidad.id_especialidad}>
                            <td>{especialidad.id_especialidad}</td>
                            <td>{especialidad.nombre_especialidad}</td>
                           {!especialidad.vacio &&
                              <td>
                                  <ButtonIcon 
                                  clasesBoton="btn btn-warning btn-block" 
                                  value={especialidad.id_especialidad} 
                                  id={especialidad.id_especialidad}
                                  eventoPadre={this.actualizarElementoTabla} 
                                  icon="icon-pencil"
                                  />
                              </td>
                           }
                          {!especialidad.vacio &&
                            <td>
                              <ButtonIcon clasesBoton="btn btn-danger btn-block" 
                              value={especialidad.id_especialidad} 
                              id={especialidad.id_especialidad}
                              eventoPadre={this.eliminarElementoTabla} 
                              icon="icon-bin"
                              />
                            </td>
                          }
                         {!especialidad.vacio &&
                          <td>
                              <ButtonIcon 
                              clasesBoton="btn btn-secondary btn-block" 
                              value={especialidad.id_especialidad}
                              id={especialidad.id_especialidad} 
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

        var jsx_especialidad_inicio=(
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
                <TituloModulo clasesrow="row" clasesColumna="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center" tituloModulo="Modulo de Especialidad"/>
                
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
                          <InputButton clasesBoton="btn btn-primary" eventoPadre={this.redirigirFormulario} value="registrar"/>
                        </div>
                      </div>
                    </div>
                </div>
                
                
            </div>
        )
        return(
            <div className="component_especialidad_inicio">
               <ComponentDashboard
                componente={jsx_especialidad_inicio}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />
            </div>

    	)
    }
}

export default withRouter(ComponentEspecialidad)