import React from 'react';
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import $ from 'jquery'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentTrabajador.css'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes 
import TituloModulo from '../subComponentes/tituloModulo'
import ComponentTablaDatos from '../subComponentes/componentTablaDeDatos'
import ButtonIcon from '../subComponentes/buttonIcon'
import InputButton from '../subComponentes/input_button'
import ComponentFormCampo from '../subComponentes/componentFormCampo';

class ComponentTrabajador extends React.Component{

    constructor(){
        super();
        this.eliminarElementoTabla=this.eliminarElementoTabla.bind(this)
        this.actualizarElementoTabla=this.actualizarElementoTabla.bind(this)
        this.consultarElementoTabla=this.consultarElementoTabla.bind(this)
        this.buscar=this.buscar.bind(this)
        this.escribir_codigo=this.escribir_codigo.bind(this)
        this.redirigirFormulario=this.redirigirFormulario.bind(this)
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.cambiarEstadoTipoTrabajador=this.cambiarEstadoTipoTrabajador.bind(this);
        this.mostrarModalPdf=this.mostrarModalPdf.bind(this);
        this.mostrarFiltros=this.mostrarFiltros.bind(this);
        this.generarPdf=this.generarPdf.bind(this);
        this.state={
            modulo:"",
            estado_menu:false,
            //////
            nombre_usuario:null,
            datoDeBusqueda:"",
            registros:[],

            id_cedula:"",
            nombrePdf:null,
            tipoPdf:null,
            tiposTrabajadores:[],
            funcionesTrabajadores:[],
            numeros_registros:0,
            mensaje:{
              texto:"",
              estado:""
            }
        }
    }

    async UNSAFE_componentWillMount(){
      let acessoModulo=await this.validarAccesoDelModulo("/dashboard/configuracion","/trabajador")
      if(acessoModulo){
          await this.consultarTodosTiposTrabajador()
          var json_server_response=await this.consultarTodosTrabajadores();
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
                this.setState({nombre_usuario:respuesta_servior.usuario.nombre_usuario})
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

      async consultarTodosTrabajadores(){
        var respuesta_servidor=[]
        await axios.get("http://localhost:8080/configuracion/trabajador/consultar-todos")
        .then(respuesta=>{
          respuesta_servidor=respuesta.data.trabajadores
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
              id_permiso:"0",
              nombre_permiso:"vacio",
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
    
    async buscar(a){
        var respuesta_servidor="",
        valor=this.state.datoDeBusqueda
        if(valor!==""){
          await axios.get(`http://localhost:8080/configuracion/trabajador/consultar-patron/${valor}`)
            .then(respuesta=>{
              respuesta_servidor=respuesta.data
              console.log(respuesta_servidor)
              this.setState({registros:respuesta_servidor.trabajadores})
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

    redirigirFormulario(a){
        const input = a.target;
        if(input.value==="Registrar"){
          this.props.history.push("/dashboard/configuracion/trabajador/registrar")
        }
    }

    async escribir_codigo(a){
        var input=a.target,
        valor=input.value,
        respuesta_servidor=""
        if(valor!==""){
          await axios.get(`http://localhost:8080/configuracion/trabajador/consultar-patron/${valor}`)
          .then(respuesta=>{
            respuesta_servidor=respuesta.data
            console.log(respuesta_servidor)
            this.setState({datoDeBusqueda:valor,registros:respuesta_servidor.trabajadores,numeros_registros:respuesta_servidor.trabajadores.length})
          })
          .catch(error=>{
            console.log(error)
            alert("error en el servidor")
          })
        }
        else{
          // console.log("no se puedo realizar la busqueda por que intento realizarla con el campo vacio")
          var json_server_response=await this.consultarTodosTrabajadores();
          var servidor=this.verficarLista(json_server_response);
          this.setState(servidor)
        }
    }

    eliminarElementoTabla(a){
        var input=a.target;
        alert("Eliminar -> "+input.id);
    }
    
    actualizarElementoTabla(a){
        var input=a.target;
        this.props.history.push("/dashboard/configuracion/trabajador/actualizar/"+input.id);
    }
    
    consultarElementoTabla(a){
        let input=a.target;
        //alert("Consultar -> "+input.id);
        this.props.history.push("/dashboard/configuracion/trabajador/consultar/"+input.id);
    }

    /**
     * {!trabajador.vacio &&
                            <td>
                              <ButtonIcon clasesBoton="btn btn-danger btn-block" 
                              value={trabajador.id_cedula} 
                              id={trabajador.id_cedula}
                              eventoPadre={this.eliminarElementoTabla} 
                              icon="icon-bin"
                              />
                            </td>
                          }
    */

    async consultarTodosTiposTrabajador(){
      await axios.get("http://localhost:8080/configuracion/tipo-trabajador/consultar-tipos-trabajador")
      .then(async respuesta => {
        let json=JSON.parse(JSON.stringify(respuesta.data))
        // console.log("datos => ",json)
        this.setState({tiposTrabajadores:json.tipos_trabajador})
        // if(json.tipos_trabajador.length>0){
        //   await this.buscarFuncionTrabajador(json.tipos_trabajador[0].id_tipo_trabajador)
        // }
      })
      .catch(error => {
        console.log(error)
      })
    }
    async buscarFuncionTrabajador(id){
      await axios.get(`http://localhost:8080/configuracion/funcion-trabajador/consultar-id-tipo-trabajador/${id}`)
      .then(respuesta=>{
          let json=JSON.parse(JSON.stringify(respuesta.data))
          console.log("datos funcion trabajador => ",json)
          this.setState({funcionesTrabajadores:json.funciones})
          
      })
      .catch(error=>{
          console.log(error)
      })
  }

  async cambiarEstadoTipoTrabajador(a){
    let $select=a.target
    this.cambiarEstado(a)
    await this.buscarFuncionTrabajador($select.value)
  }

    mostrarModalPdf(){
      // alert("hola")
      $("#exampleModal").modal("show")
    }

    mostrarFiltros(a){
      let $select=a.target
      let $filaVerPdf=document.getElementById("filaVerPdf")
      $filaVerPdf.classList.add("ocultarFormulario")
      // alert($select.value)
      let $botonGenerarPdf=document.getElementById("botonGenerarPdf")
      let $fromFiltroCedula=document.getElementById("fromFiltroCedula")
      let $fromListar=document.getElementById("fromListar")
      if($select.value==="0"){
        $fromListar.classList.add("ocultarFormulario")
        $fromFiltroCedula.classList.remove("ocultarFormulario")
        $botonGenerarPdf.classList.remove("ocultarFormulario")
        this.setState({tipoPdf:"0"})
      }
      else if($select.value==="1"){
        this.setState({tipoPdf:"1"})
        $fromListar.classList.remove("ocultarFormulario")
        $botonGenerarPdf.classList.remove("ocultarFormulario")
        $fromFiltroCedula.classList.add("ocultarFormulario")
      }
      else{
        this.setState({tipoPdf:null})
        $fromListar.classList.add("ocultarFormulario")
        $fromFiltroCedula.classList.add("ocultarFormulario")
        $botonGenerarPdf.classList.add("ocultarFormulario")
      }
    }
    generarPdf(){
      let $filaVerPdf=document.getElementById("filaVerPdf")
      // $filaVerPdf.classList.remove("ocultarFormulario") //esta line sirve para mostrar el boton para ver el pdf => usar en success
      // $filaVerPdf.classList.add("ocultarFormulario") //esta line sirve para ocultar el boton para ver el pdf => usar en error
      let datos=null
      if(this.state.tipoPdf==="0"){
        datos=$("#fromFiltroCedula").serializeArray()
      }
      else if(this.state.tipoPdf==="1"){
        datos=$("#fromListar").serializeArray()
      }

      console.log(datos)
      datos.push({name:"nombre_usuario",value:this.state.nombre_usuario})
      if(datos!==null){
        // alert("generar pdf")
        $.ajax({
          url: 'http://localhost:80/proyecto/backend/controlador_php/controlador_trabajador.php',
          type:"post",
          data:datos,
          success: function(respuesta) {
            // alert("OK")
            console.log(respuesta)
              let json=JSON.parse(respuesta)
              if(json.nombrePdf!=="false"){
                  $filaVerPdf.classList.remove("ocultarFormulario") 
                  document.getElementById("linkPdf").href=`http://localhost:8080/reporte/${json.nombrePdf}`
              }
              else{
                  $filaVerPdf.classList.add("ocultarFormulario") 
                  alert("no se pudo generar el pdf por que no hay registros que coincidan con los datos enviados")
              }
          },
          error: function() {
            alert("error")
          }
        });
      }
      

    }

    cambiarEstado(a){
      var input=a.target;
      this.setState({[input.name]:input.value})
  }

    render(){
        const jsx_tabla_encabezado=(
            <thead> 
                  <tr> 
                    <th>Cédula</th> 
                    <th>Nombre trabajador</th>
                  </tr> 
              </thead>
          )
          const jsx_tabla_body=(
            <tbody>
                  {this.state.registros.map((trabajador)=>{
                      return(
                          <tr key={trabajador.id_cedula}>
                            <td>{trabajador.id_cedula}</td>
                            <td>{trabajador.nombres+" "+trabajador.apellidos}</td>
                           {!trabajador.vacio &&
                              <td>
                                  <ButtonIcon 
                                  clasesBoton="btn btn-warning btn-block" 
                                  value={trabajador.id_cedula} 
                                  id={trabajador.id_cedula}
                                  eventoPadre={this.actualizarElementoTabla} 
                                  icon="icon-pencil"
                                  />
                              </td>
                           }
                          
                         {!trabajador.vacio &&
                          <td>
                              <ButtonIcon 
                              clasesBoton="btn btn-secondary btn-block" 
                              value={trabajador.id_cedula}
                              id={trabajador.id_cedula} 
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
        
        var jsx_trabajador_inicio=(
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
                <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                              <form id="fromFiltroCedula" class="ocultarFormulario">
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
                                  eventoPadre={this.cambiarEstado}
                                  />
                                </div>
                              </form>
                              <form id="fromListar" class="ocultarFormulario mb-3">
                                <div className="row justify-content-center mb-3">
                                    <div className="col-auto">Para seleccionar mas de un elemento mantenr Ctrl + click izquierdo del raton</div>
                                </div>
                                <div className="row justify-content-center">
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Tipo de trabajador</label>
                                      <select class="form-select custom-select" multiple id="id_tipo_trabajador" name="array_id_tipo_trabajador[]" aria-label="Default se0lec0t example" onChange={this.cambiarEstadoTipoTrabajador}>
                                        <option value="null" >seleccione</option>
                                        {this.state.tiposTrabajadores.map((tipoTrabajador,index) => (<option key={"tipo-trabajador"+index} value={tipoTrabajador.id_tipo_trabajador}  >{tipoTrabajador.descripcion_tipo_trabajador}</option>))}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Funcion del trabajador</label>
                                      <select class="form-select custom-select" multiple id="id_funcion_trabajador" name="array_id_funcion_trabajador[]" aria-label="Default select example" >
                                        {this.state.funcionesTrabajadores.map((funcionTrabajador,index) => (<option key={"funcion-trabajador"+index} value={funcionTrabajador.id_funcion_trabajador}  >{funcionTrabajador.funcion_descripcion}</option>))}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Sexo</label>
                                      <select class="form-select custom-select" multiple id="sexo" name="array_sexo[]" aria-label="Default select example" >
                                        <option value="1" >Masculino</option>
                                        <option value="0" >Femenino</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                <div className="row justify-content-center">
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Designación</label>
                                      <select class="form-select custom-select" multiple id="designacion" name="array_designacion[]" aria-label="Default select example" >
                                        <option value="1" >Interno</option>
                                        <option value="0" >Externo</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Estatus</label>
                                      <select class="form-select custom-select" multiple id="estatu_trabajador" name="array_estatu_trabajador[]" aria-label="Default select example" >
                                        <option value="1" >Activo</option>
                                        <option value="0" >Inactivo</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>

                                </div>
                              </form>
                              <div id="filaVerPdf" className="row justify-content-center ocultarFormulario">
                                  <div className="col-auto">
                                    <a className="btn btn-success" id="linkPdf" target="_blank" href="#">Ver pdf</a>
                                  </div>
                              </div>
                              
                            </div>
                            <div class="modal-footer ">
                                <button type="button" id="botonGenerarPdf" class="btn btn-success ocultarFormulario" onClick={this.generarPdf}>Generar pdf</button>
                            </div>
                            </div>
                        </div>
                  </div>
                <TituloModulo clasesrow="row" clasesColumna="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center" tituloModulo="Modulo Trabajador"/>
                <ComponentTablaDatos 
                    eventoBuscar={this.buscar}
                    eventoEscribirCodigo={this.escribir_codigo}
                    tabla_encabezado={jsx_tabla_encabezado}
                    tabla_body={jsx_tabla_body}
                    numeros_registros={this.state.numeros_registros}
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
            <div className="component_trabajador_inicio">
                <ComponentDashboard
                componente={jsx_trabajador_inicio}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />
            </div>
        )
    }
}

export default withRouter(ComponentTrabajador)