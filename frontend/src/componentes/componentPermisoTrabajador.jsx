import React from 'react';
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import $ from 'jquery'
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
import InputButton from '../subComponentes/input_button'
import ComponentFormCampo from '../subComponentes/componentFormCampo';


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
        this.redirigirFormulario=this.redirigirFormulario.bind(this);
        this.mostrarModalPdf=this.mostrarModalPdf.bind(this);
        this.mostrarFiltros=this.mostrarFiltros.bind(this);
        this.generarPdf=this.generarPdf.bind(this);
        this.state={
            modulo:"",
            estado_menu:false,
            //////
            tabla:"",
            tipoPdf:null,
            datoDeBusqueda:"",
            registros:[],
            tiposPermiso:[],
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
          await this.consultarTodosPermiso()
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
        if(input.value==="C"){
            // /consultar-culminados
            // alert("hola")
            const ruta_permisos=`http://localhost:8080/transaccion/permiso-trabajador/consultar-culminados`
            const permisos=await this.consultarAlServidor(ruta_permisos)
            const permisos_verificado=this.verficarLista(permisos.permisos_trabajador)
            permisos_verificado.tabla=input.value
            if(!permisos_verificado.numeros_registros){
                permisos_verificado.numeros_registros=0
            }
            this.setState(permisos_verificado)
        }
        else if(input.value==="A"){
            // /consultar-culminados
            // alert("hola")
            const ruta_permisos=`http://localhost:8080/transaccion/permiso-trabajador/consultar-aprovados`
            const permisos=await this.consultarAlServidor(ruta_permisos)
            const permisos_verificado=this.verficarLista(permisos.permisos_trabajador)
            permisos_verificado.tabla=input.value
            if(!permisos_verificado.numeros_registros){
                permisos_verificado.numeros_registros=0
            }
            this.setState(permisos_verificado)
        }
        else{
            const ruta_permisos=`http://localhost:8080/transaccion/permiso-trabajador/consultar-estatu/${input.value}`
            const permisos=await this.consultarAlServidor(ruta_permisos)
            const permisos_verificado=this.verficarLista(permisos.permisos_trabajador)
            permisos_verificado.tabla=input.value
            if(!permisos_verificado.numeros_registros){
                permisos_verificado.numeros_registros=0
            }
            this.setState(permisos_verificado)
        }
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

    redirigirFormulario(){
        // alert("hola")
        this.props.history.push("/dashboard/transaccion/permiso-trabajador/trabajador/solicitar")
    }

    async consultarTodosPermiso(){
        await axios.get("http://localhost:8080/configuracion/permiso/consultar-permisos")
        .then(respuesta=>{
          let json=JSON.parse(JSON.stringify(respuesta.data.permisos))
          let datosSelect=json.filter(permiso => {
              if(permiso.estatu_permiso==="1"){
                  return permiso
              }
          })
          console.log("datos permiso => ",datosSelect)
          this.setState({tiposPermiso:datosSelect})
        })
        .catch(error=>{
          alert("No se pudo conectar con el servidor")
          console.log(error)
        })
    }

    mostrarModalPdf(){
        // alert("hola")
        $("#modalPdf").modal("show")
    }

    mostrarFiltros(a){
        let $select=a.target
        let $filaVerPdf=document.getElementById("filaVerPdf")
        $filaVerPdf.classList.add("ocultarFormulario")
        // alert($select.value)
        let $botonGenerarPdf=document.getElementById("botonGenerarPdf")
        let $formListaEspecifico=document.getElementById("formListaEspecifico")
        let $formLista=document.getElementById("formLista")
        if($select.value==="0"){
          $formLista.classList.add("ocultarFormulario")
          $formListaEspecifico.classList.remove("ocultarFormulario")
          $botonGenerarPdf.classList.remove("ocultarFormulario")
          this.setState({tipoPdf:"0"})
        }
        else if($select.value==="1"){
          this.setState({tipoPdf:"1"})
          $formLista.classList.remove("ocultarFormulario")
          $botonGenerarPdf.classList.remove("ocultarFormulario")
          $formListaEspecifico.classList.add("ocultarFormulario")
        }
        else{
          this.setState({tipoPdf:null})
          $formLista.classList.add("ocultarFormulario")
          $formListaEspecifico.classList.add("ocultarFormulario")
          $botonGenerarPdf.classList.add("ocultarFormulario")
        }
      }

      generarPdf(){
        let $filaVerPdf=document.getElementById("filaVerPdf")
        $filaVerPdf.classList.remove("ocultarFormulario") //esta line sirve para mostrar el boton para ver el pdf => usar en success
        // $filaVerPdf.classList.add("ocultarFormulario") //esta line sirve para ocultar el boton para ver el pdf => usar en error
        let datos=null
        if(this.state.tipoPdf==="0"){
          datos=$("#formListaEspecifico").serializeArray()
        }
        else if(this.state.tipoPdf==="1"){
          datos=$("#formLista").serializeArray()
        }
  
        console.log(datos)
  
        if(datos!==null){
          alert("generar pdf")
          // $.ajax({
          //   url: 'ruta',
          //   type:"post",
          //   data:[],
          //   success: function(respuesta) {
          //     alert("OK")
          //   },
          //   error: function() {
          //     alert("error")
          //   }
          // });
        }
        
  
      }

    render(){
        const jsx_tabla_encabezado=(
            <thead> 
                  <tr> 
                    <th>Código</th> 
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

                    <div class="modal fade" id="modalPdf" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg" role="document">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Reporte pdf</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                              <div className="row justify-content-center mb-3">
                                <div className="col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5">
                                  <div class="form-groud">
                                    <label>Tipo de reporte</label>
                                    <select class="form-select custom-select" aria-label="Default select example" onChange={this.mostrarFiltros}>
                                      <option value="null" >seleccione un tipo de reporte</option>
                                      <option value="1" >generar una lista</option>
                                      <option value="0" >generar un especifico</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <form id="formListaEspecifico" class="ocultarFormulario mb-3">
                                    <div className="row justify-content-center">
                                    <ComponentFormCampo
                                    clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                                    clasesCampo="form-control"
                                    obligatorio="no"
                                    nombreCampo="Cedula del trabajador"
                                    activo="si"
                                    type="text"
                                    value={this.state.id_cedula}
                                    name="id_cedula"
                                    id="id_cedula"
                                    placeholder="cedula"
                                    />
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Estado permiso</label>
                                      <select class="form-select custom-select" id="estatu_permiso_trabajador" name="estatu_permiso_trabajador" aria-label="Default se0lec0t example">
                                        <option value="null" >seleccione</option>
                                        <option value="E" >En espera</option>
                                        <option value="A" >Aprovado</option>
                                        <option value="C" >Culminado</option>
                                        <option value="D" >Denegado</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Tipo de pemriso</label>
                                      <select class="form-select custom-select" id="permiso_trabajador_tipo" name="permiso_trabajador_tipo" aria-label="Default se0lec0t example">
                                        <option value="null" >seleccione</option>
                                        <option value="PR" >Permiso de retiro</option>
                                        <option value="PN" >Permiso normal</option>
                                      </select>
                                    </div>
                                  </div>
                                  
                                  

                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Permiso</label>
                                      <select class="form-select custom-select" id="id_funcion_trabajador" name="id_funcion_trabajador" aria-label="Default select example" >
                                        <option value="null" >Selecciones</option>
                                        {this.state.tiposPermiso.map((tipoPermiso,index) => (<option key={index} value={tipoPermiso.id_permiso}  >{tipoPermiso.nombre_permiso}</option>))}
                                      </select>
                                    </div>
                                  </div>
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                        <div class="form-groud">
                                        <label>Fecha desde</label>
                                        <input type="date" class="form-control" id="fecha_desde_permiso_trabajador" name="fecha_desde_permiso_trabajador"/>
                                        </div>
                                    </div>
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                        <div class="form-groud">
                                        <label>Fecha desde</label>
                                        <input type="date" class="form-control" id="fecha_hasta_permiso_trabajador" name="fecha_hasta_permiso_trabajador"/>
                                        </div>
                                    </div>
                                    
                                </div>
                              </form>


                              <form id="formLista" class="ocultarFormulario mb-3">

                                <div className="row justify-content-center">
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Estado permiso</label>
                                      <select class="form-select custom-select" id="estatu_permiso_trabajador" name="estatu_permiso_trabajador" aria-label="Default se0lec0t example">
                                        <option value="null" >seleccione</option>
                                        <option value="E" >En espera</option>
                                        <option value="A" >Aprovado</option>
                                        <option value="C" >Culminado</option>
                                        <option value="D" >Denegado</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Tipo de pemriso</label>
                                      <select class="form-select custom-select" id="permiso_trabajador_tipo" name="permiso_trabajador_tipo" aria-label="Default se0lec0t example">
                                        <option value="null" >seleccione</option>
                                        <option value="PR" >Permiso de retiro</option>
                                        <option value="PN" >Permiso normal</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Permiso</label>
                                      <select class="form-select custom-select" id="id_funcion_trabajador" name="id_funcion_trabajador" aria-label="Default select example" >
                                        <option value="null" >Selecciones</option>
                                        {this.state.tiposPermiso.map((tipoPermiso,index) => (<option key={index} value={tipoPermiso.id_permiso}  >{tipoPermiso.nombre_permiso}</option>))}
                                      </select>
                                    </div>
                                  </div>
                                  
                                  

                                </div>
                                <div className="row justify-content-center">
                                    
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                        <div class="form-groud">
                                        <label>Fecha desde</label>
                                        <input type="date" class="form-control" id="fecha_desde_permiso_trabajador" name="fecha_desde_permiso_trabajador"/>
                                        </div>
                                    </div>
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                        <div class="form-groud">
                                        <label>Fecha desde</label>
                                        <input type="date" class="form-control" id="fecha_hasta_permiso_trabajador" name="fecha_hasta_permiso_trabajador"/>
                                        </div>
                                    </div>
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
                                    
                                </div>
                                
                              </form>
                              <div id="filaVerPdf" className="row justify-content-center ocultarFormulario">
                                  <div className="col-auto">
                                    <a className="btn btn-success" target="_blank" href="http://localhost:8080/reporte/test.pdf">Ver pdf</a>
                                  </div>
                              </div>
                              
                            </div>
                            <div class="modal-footer ">
                                <button type="button" id="botonGenerarPdf" class="btn btn-success ocultarFormulario" onClick={this.generarPdf}>Generar pdf</button>
                            </div>
                            </div>
                        </div>
                  </div>


                <TituloModulo clasesrow="row" clasesColumna="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center" tituloModulo="Modulo de Permiso Trabajador"/>
                    <ComponentTablaDatosSinBarra 
                    eventoEscribirCodigo={this.escribir_codigo}
                    tabla_encabezado={jsx_tabla_encabezado}
                    tabla_body={jsx_tabla_body}
                    numeros_registros={this.state.numeros_registros}
                    ventoConsultarPermiso={this.consultarPermisosXEstatu}
                    tabla={this.state.tabla}
                    />
                <div className="row justify-content-between">
                    <div className="col-3 col-ms-3 col-md-3 columna-boton">
                        <div className="row justify-content-center align-items-center contenedor-boton">
                            <div className="col-auto">
                                <InputButton clasesBoton="btn btn-primary" eventoPadre={this.redirigirFormulario} value="Registrar"/>
                            </div>
                        </div>
                    </div>
                    <div className="col-3 col-ms-3 col-md-3 columna-boton">
                      <div className="row justify-content-center align-items-center contenedor-boton">
                        <div className="col-auto">
                          <InputButton clasesBoton="btn btn-danger" eventoPadre={this.mostrarModalPdf} value="pdf"/>
                        </div>
                      </div>
                    </div>
                </div>
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