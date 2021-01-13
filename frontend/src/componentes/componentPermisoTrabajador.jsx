import React from 'react';
import {withRouter} from 'react-router-dom'
import axios from 'axios'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentPermisoTrabajador.css'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes 
import TituloModulo from '../subComponentes/tituloModulo'
import ComponentTablaDatosSinBarra from '../subComponentes/componentTablaDeDatosSinBarra'
import ButtonIcon from '../subComponentes/buttonIcon'
//import InputButton from '../subComponentes/input_button'


class ComponentPermisoTrabajador extends React.Component{

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.consultarPermisosXEstatu=this.consultarPermisosXEstatu.bind(this);
        this.aprovarPermiso=this.aprovarPermiso.bind(this);
        this.denegarPermiso=this.denegarPermiso.bind(this);
        this.consultarPermiso=this.consultarPermiso.bind(this);
        this.editarPermiso=this.editarPermiso.bind(this);
        this.state={
            modulo:"",
            estado_menu:false,
            //////
            tabla:"",
            datoDeBusqueda:"",
            registros:[],
            numeros_registros:0,
            mensaje:{
              texto:"",
              estado:""
            }
        }
    }

    verficarLista(json_server_response){
        if(json_server_response.length===0){
            json_server_response.push({
              id_permiso_trabajador:"0",
              id_cedula:"vacio",
              nombres:"vacio",
              apellidos:"vacio",
              nombre_permiso:"vacio",
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

      async UNSAFE_componentWillMount(){
        const ruta_permisos=`http://localhost:8080/transaccion/permiso-trabajador/consultar-estatu/${"E"}`
        const permisos=await this.consultarAlServidor(ruta_permisos)
        const permisos_verificado=this.verficarLista(permisos.permisos_trabajador)
        permisos_verificado.tabla="E"
        this.setState(permisos_verificado)
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

    cambiarEstado(a){
        var input=a.target;
        this.setState({[input.name]:input.value})
    }

    async consultarAlServidor(ruta){
        var respuesta_servidor=""
        var mensaje=this.state.mensaje
        await axios.get(ruta)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
        })
        .catch(error=>{
            console.log(error)
            mensaje.texto="no hay conxion con el servidor"
            mensaje.estado="500"
            this.setState({mensaje})
        })

        return respuesta_servidor
    }

    async enviarDatosAlServidor(ruta,datos){
        var respuesta_servidor=""
        var mensaje=this.state.mensaje
        await axios.put(ruta,datos)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
        })
        .catch(error=>{
            console.log(error)
            mensaje.texto="no hay conxion con el servidor"
            mensaje.estado="500"
            this.setState({mensaje})
        })

        return respuesta_servidor
    }

    async consultarPermisosXEstatu(a){
        var input=a.target;
        const ruta_permisos=`http://localhost:8080/transaccion/permiso-trabajador/consultar-estatu/${input.value}`
        const permisos=await this.consultarAlServidor(ruta_permisos)
        const permisos_verificado=this.verficarLista(permisos.permisos_trabajador)
        permisos_verificado.tabla=input.value
        if(!permisos_verificado.numeros_registros){
            permisos_verificado.numeros_registros=0
        }
        this.setState(permisos_verificado)
    }

    async aprovarPermiso(a){
        var input=a.target
        const token=localStorage.getItem('usuario')
        const objeto={
            permiso_trabajador:{
                id_permiso_trabajador:input.id,
                estatu_permiso_trabajador:"A"
            },
            token
        }//UPDATE tpermisotrabajador SET estatu_permiso_trabajador='D' WHERE id_permiso_trabajador='pert-1-22-04-2020'
        //UPDATE tpermisotrabajador SET estatu_permiso_trabajador='C' WHERE id_permiso_trabajador='pert-1-22-04-2020'
        var mensaje=this.state.mensaje
        const ruta_actualizar_permiso=`http://localhost:8080/transaccion/permiso-trabajador/actualizar-estatu/${input.id}`
        const actualizar_permiso=await this.enviarDatosAlServidor(ruta_actualizar_permiso,objeto)
        const ruta_permisos=`http://localhost:8080/transaccion/permiso-trabajador/consultar-estatu/${this.state.tabla}`
        const permisos=await this.consultarAlServidor(ruta_permisos)
        mensaje.texto=actualizar_permiso.mensaje
        mensaje.estado=actualizar_permiso.estado_peticion
        this.setState({
            registros:permisos.permisos_trabajador,
            mensaje:mensaje,
            tabla:this.state.tabla
        })
    }

    async denegarPermiso(a){
        var input=a.target
        const token=localStorage.getItem('usuario')
        const objeto={
            permiso_trabajador:{
                id_permiso_trabajador:input.id,
                estatu_permiso_trabajador:"D"
            },
            token
        }//UPDATE tpermisotrabajador SET estatu_permiso_trabajador='E' WHERE id_permiso_trabajador='pert-1-22-04-2020'
        var mensaje=this.state.mensaje
        const ruta_actualizar_permiso=`http://localhost:8080/transaccion/permiso-trabajador/actualizar-estatu/${input.id}`
        const actualizar_permiso=await this.enviarDatosAlServidor(ruta_actualizar_permiso,objeto)
        const ruta_permisos=`http://localhost:8080/transaccion/permiso-trabajador/consultar-estatu/${this.state.tabla}`
        const permisos=await this.consultarAlServidor(ruta_permisos)
        mensaje.texto=actualizar_permiso.mensaje
        mensaje.estado=actualizar_permiso.estado_peticion
        this.setState({
            registros:permisos.permisos_trabajador,
            mensaje:mensaje,
            tabla:this.state.tabla
        })
    }

    consultarPermiso(a){
        var input=a.target
        alert("consultar permiso "+input.id)
    }

    editarPermiso(a){
        var input=a.target
        this.props.history.push(`/dashboard/transaccion/permiso-trabajador/editar${input.id}`)
    }

    render(){
        const jsx_tabla_encabezado=(
            <thead> 
                  <tr> 
                    <th>Codigo</th> 
                    <th>Trabajador</th>
                    <th>Permiso</th>
                  </tr> 
              </thead>
          )
          const jsx_tabla_body=(
            <tbody>
                  {this.state.registros.map((permiso)=>{
                      
                      return(
                          <tr key={permiso.id_permiso_trabajador}>
                            <td>{permiso.id_permiso_trabajador}</td>
                            <td>{(permiso.nombres!=="vacio" && permiso.apellidos!=="vacio")?permiso.nombres+" "+permiso.apellidos:"vacio"}</td>
                            <td>{permiso.nombre_permiso}</td>
                           {(!permiso.vacio && this.state.tabla==="E") &&
                              <td>
                                  <ButtonIcon 
                                  clasesBoton="btn btn-success btn-block" 
                                  value={permiso.id_permiso_trabajador} 
                                  id={permiso.id_permiso_trabajador}
                                  eventoPadre={this.aprovarPermiso} 
                                  icon="icon-checkmark"
                                  />
                              </td>
                           }
                          {(!permiso.vacio && this.state.tabla==="E") &&
                            <td>
                              <ButtonIcon clasesBoton="btn btn-danger btn-block" 
                              value={permiso.id_permiso_trabajador} 
                              id={permiso.id_permiso_trabajador}
                              eventoPadre={this.denegarPermiso} 
                              icon="icon-cross"
                              />
                            </td>
                          }
                          {(!permiso.vacio && this.state.tabla==="A") &&
                              <td>
                                  <ButtonIcon 
                                  clasesBoton="btn btn-warning btn-block" 
                                  value={permiso.id_permiso_trabajador} 
                                  id={permiso.id_permiso_trabajador}
                                  eventoPadre={this.editarPermiso} 
                                  icon="icon-pencil"
                                  />
                              </td>
                           }
                      </tr>
                      )
                  })}
              </tbody>
          )

        var jsx_permiso_trabajador_inicio=(
            <div>
                {this.state.mensaje.texto!=="" && (this.state.mensaje.estado==="200" || this.state.mensaje.estado==="500" || this.state.mensaje.estado==="404") &&
                <div className="row">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <div className={`alert alert-${(this.state.mensaje.estado==="200")?"success":"danger"} alert-dismissible`}>
                        <p>Mensaje: {this.state.mensaje.texto}</p>
                        <button className="close" data-dismiss="alert">
                            <span>X</span>
                        </button>
                        </div>
                    </div>
                </div>
                }
                <TituloModulo clasesrow="row" clasesColumna="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center" tituloModulo="Modulo de Permiso Trabajador"/>
                    <ComponentTablaDatosSinBarra 
                    eventoEscribirCodigo={this.escribir_codigo}
                    tabla_encabezado={jsx_tabla_encabezado}
                    tabla_body={jsx_tabla_body}
                    numeros_registros={this.state.numeros_registros}
                    ventoConsultarPermiso={this.consultarPermisosXEstatu}
                    tabla={this.state.tabla}
                    />
            </div>
        )

        return(
            <div className="component_permiso_trabajador_inicio">
               <ComponentDashboard
                componente={jsx_permiso_trabajador_inicio}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />
            </div>
        )
    }

}

export default withRouter(ComponentPermisoTrabajador)