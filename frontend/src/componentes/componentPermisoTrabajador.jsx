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
        this.mostrarModalInterrumpiPermiso=this.mostrarModalInterrumpiPermiso.bind(this);
        this.cerrarModalInterrumpiPermiso=this.cerrarModalInterrumpiPermiso.bind(this);
        this.interumpirPermiso=this.interumpirPermiso.bind(this);
        this.state={
            modulo:"",
            estado_menu:false,
            //////
            nombre_usuario:null,
            id_permiso_trabajador_interumpir:null,
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
        let acessoModulo=await this.validarAccesoDelModulo("/dashboard/transaccion","/permiso-trabajador")
        if(acessoModulo){
          await this.consultarTodosPermiso()
          const ruta_permisos=`http://localhost:8080/transaccion/permiso-trabajador/consultar-estatu/${"E"}`
          const permisos=await this.consultarAlServidor(ruta_permisos)
          const permisos_verificado=this.verficarLista(permisos.permisos_trabajador)
          permisos_verificado.tabla="E"
          this.setState(permisos_verificado)
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
            // console.log(respuesta_servidor)
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
        // $filaVerPdf.classList.remove("ocultarFormulario") //esta line sirve para mostrar el boton para ver el pdf => usar en success
        // $filaVerPdf.classList.add("ocultarFormulario") //esta line sirve para ocultar el boton para ver el pdf => usar en error
        let datos=null
        if(this.state.tipoPdf==="0"){
          datos=$("#formListaEspecifico").serializeArray()
        }
        else if(this.state.tipoPdf==="1"){
          datos=$("#formLista").serializeArray()
        }
  
        console.log(datos)
        datos.push({name:"nombre_usuario",value:this.state.nombre_usuario})
        if(datos!==null){
          // alert("generar pdf")
          $.ajax({
            url: 'http://localhost:80/proyecto/backend/controlador_php/controlador_permiso_trabajador.php',
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

    mostrarModalInterrumpiPermiso(a){
      let boton=a.target
      this.setState({id_permiso_trabajador_interumpir:boton.id})
      $("#modalInterumpirPermiso").modal("show")
    }
    
    cerrarModalInterrumpiPermiso(){
      // let boton=a.target
      this.setState({id_permiso_trabajador_interumpir:null})
      $("#modalInterumpirPermiso").modal("hide")
    }

    async interumpirPermiso(){
      // alert(this.state.id_permiso_trabajador_interumpir)
      // UPDATE tpermisotrabajador set estatu_permiso_trabajador='A' WHERE id_permiso_trabajador='pert-1-07-05-2021' OR id_permiso_trabajador='pert-1-08-05-2021' ;
      let mensaje=JSON.parse(JSON.stringify(this.state.mensaje))
      const token=localStorage.getItem('usuario')
      let json={
        id:this.state.id_permiso_trabajador_interumpir,
        token
      }
      await axios.post(`http://localhost:8080/transaccion/permiso-trabajador/interumpir`,json)
      .then(async repuesta => {
        let json=JSON.parse(JSON.stringify(repuesta.data))
        console.log(json)
        if(json.estado_peticion==="200"){
          const ruta_permisos=`http://localhost:8080/transaccion/permiso-trabajador/consultar-aprovados`
          const permisos=await this.consultarAlServidor(ruta_permisos)
          const permisos_verificado=this.verficarLista(permisos.permisos_trabajador)
          permisos_verificado.tabla="A"
          if(!permisos_verificado.numeros_registros){
              permisos_verificado.numeros_registros=0
          }
          this.cerrarModalInterrumpiPermiso()
          mensaje.estado="200"
          mensaje.texto=json.mensaje
          this.setState(permisos_verificado)
          this.setState({mensaje})
          
        }
        else{
          mensaje.estado=json.estado_peticion
          mensaje.texto=json.mensaje
          this.setState({mensaje})
        }
      })
      .catch(error => {
        console.log(error)
      })
    }

    mostrarModalAyuda(){
      $("#modalAyuda").modal("show")
    }

    render(){
        const jsx_tabla_encabezado=(
            <thead> 
                  <tr> 
                    <th>Trabajador</th>
                    <th>Permiso</th>
                    <th>Remunerado</th>
                    <th>Hábil</th>
                    <th>Tipo de permiso</th>
                  </tr> 
              </thead>
          )
          const jsx_tabla_body=(
            <tbody>
                  {this.state.registros.map((permiso)=>{
                      
                      return(
                          <tr key={permiso.id_permiso_trabajador}>
                            <td>{(permiso.nombres!=="vacio" && permiso.apellidos!=="vacio")?permiso.nombres+" "+permiso.apellidos:"vacio"}</td>
                            <td>{permiso.nombre_permiso}</td>
                            <td>{(permiso.estatu_remunerado==="1")?"Si":"No"}</td>
                            <td>{(permiso.estatu_dias_aviles==="1")?"Si":"No"}</td>
                            <td>{(permiso.permiso_trabajador_tipo==="PR")?"Permiso de retiro":"Permiso normal"}</td>
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
                          {(!permiso.vacio && this.state.tabla==="A") &&
                              <td>
                                 <button className="btn btn-danger btn-block" id={permiso.id_permiso_trabajador} onClick={this.mostrarModalInterrumpiPermiso}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-scissors" viewBox="0 0 16 16" id={permiso.id_permiso_trabajador}>
                                    <path id={permiso.id_permiso_trabajador} d="M3.5 3.5c-.614-.884-.074-1.962.858-2.5L8 7.226 11.642 1c.932.538 1.472 1.616.858 2.5L8.81 8.61l1.556 2.661a2.5 2.5 0 1 1-.794.637L8 9.73l-1.572 2.177a2.5 2.5 0 1 1-.794-.637L7.19 8.61 3.5 3.5zm2.5 10a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0zm7 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z"/>
                                  </svg>
                                 </button>
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

                  <div class="modal fade" id="modalInterumpirPermiso" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg" role="document">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Interumpir el permiso</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                              <p>
                                Esta seguro que deseaa interrumpir este permiso
                              </p>
                            </div>
                            <div class="modal-footer ">
                                <button type="button" class="btn btn-danger mr-3" onClick={this.cerrarModalInterrumpiPermiso}>No</button>
                                <button type="button" class="btn btn-success" onClick={this.interumpirPermiso}>Si</button>
                            </div>
                            </div>
                        </div>
                  </div>

                  <div class="modal fade" id="modalAyuda" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Info</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                               <div className="row mb-3">
                                   <div className="col-auto">
                                    <button class="btn btn-danger mr-3">pdf</button>
                                    Este boton activa una modal que te permitira generar reportes en formato pdf
                                   </div>
                               </div>
                               <div className="row mb-3">
                                   <div className="col-auto">
                                        <ButtonIcon clasesBoton="btn btn-danger mr-3" 
                                        value="" 
                                        id=""
                                        eventoPadre=""
                                        icon="icon-cross"
                                        />
                                        Este boton cambia el estado del permiso de espera a "denegado"
                                   </div>
                               </div>
                               <div className="row mb-3">
                                   <div className="col-auto">
                                        <ButtonIcon clasesBoton="btn btn-success mr-3" 
                                        value="" 
                                        id=""
                                        eventoPadre=""
                                        icon="icon-checkmark"
                                        />
                                        Este boton cambia el estado del permiso de espera a "aprobado"
                                   </div>
                               </div>
                               <div className="row mb-3">
                                   <div className="col-auto">
                                        <ButtonIcon clasesBoton="btn btn-warning mr-3" 
                                        value="" 
                                        id=""
                                        eventoPadre=""
                                        icon="icon-pencil"
                                        />
                                        Este boton te permite editar el permiso del trabajador
                                   </div>
                               </div>
                               <div className="row mb-3">
                                   <div className="col-auto">
                                        <button className="btn btn-danger mr-3">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-scissors" viewBox="0 0 16 16" >
                                            <path  d="M3.5 3.5c-.614-.884-.074-1.962.858-2.5L8 7.226 11.642 1c.932.538 1.472 1.616.858 2.5L8.81 8.61l1.556 2.661a2.5 2.5 0 1 1-.794.637L8 9.73l-1.572 2.177a2.5 2.5 0 1 1-.794-.637L7.19 8.61 3.5 3.5zm2.5 10a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0zm7 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z"/>
                                          </svg>
                                        </button>
                                        Este boton te permite interrumpir el permiso del trabajador
                                   </div>
                               </div>
                            </div>
                            {/* <div class="modal-footer">
                                <button type="button" class="btn btn-danger" data-dismiss="modal">No</button>
                                <button type="button" class="btn btn-success" onClick={this.pasarAsistencia}>Si</button>
                            </div> */}
                            </div>
                        </div>
                    </div>






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
                                    <label>Tipo de Reporte</label>
                                    <select class="form-select custom-select" aria-label="Default select example" onChange={this.mostrarFiltros}>
                                      <option value="null" >Seleccione un Tipo de Reporte</option>
                                      <option value="1" >Generar una Lista</option>
                                      <option value="0" >Generar un Específico</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <form id="formListaEspecifico" class="ocultarFormulario mb-3">
                                  <div className="row justify-content-center mb-3">
                                      <div className="col-auto">Para seleccionar más de un elemento mantener Ctrl + click izquierdo del ratón</div>
                                  </div>
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
                                      <select class="form-select custom-select" multiple id="estatu_permiso_trabajador" name="array_estatu_permiso_trabajador[]" aria-label="Default se0lec0t example">
                                        <option value="E" >En espera</option>
                                        <option value="A" >Aprobado</option>
                                        <option value="C" >Culminado</option>
                                        <option value="D" >Denegado</option>
                                        <option value="I" >Interrumpido</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Tipo de permiso</label>
                                      <select class="form-select custom-select" id="permiso_trabajador_tipo" name="permiso_trabajador_tipo" aria-label="Default se0lec0t example">
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
                                      <select class="form-select custom-select" multiple id="id_permiso" name="array_id_permiso[]" aria-label="Default select example" >
                                        {this.state.tiposPermiso.map((tipoPermiso,index) => (<option key={index} value={tipoPermiso.id_permiso}  >{tipoPermiso.nombre_permiso}</option>))}
                                      </select>
                                    </div>
                                  </div>
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                        <div class="form-groud">
                                        <label>Fecha desdé</label>
                                        <input type="date" class="form-control" id="fecha_desde_permiso_trabajador" name="fecha_desde_permiso_trabajador"/>
                                        </div>
                                    </div>
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                        <div class="form-groud">
                                        <label>Fecha hasta</label>
                                        <input type="date" class="form-control" id="fecha_hasta_permiso_trabajador" name="fecha_hasta_permiso_trabajador"/>
                                        </div>
                                    </div>
                                    
                                </div>
                              </form>


                              <form id="formLista" class="ocultarFormulario mb-3">
                                <div className="row justify-content-center mb-3">
                                    <div className="col-auto">Para seleccionar más de un elemento mantener Ctrl + click izquierdo del ratón</div>
                                </div>
                                <div className="row justify-content-center">
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Estado permiso</label>
                                      <select class="form-select custom-select" multiple id="estatu_permiso_trabajador" name="array_estatu_permiso_trabajador[]" aria-label="Default se0lec0t example">
                                        <option value="E" >En espera</option>
                                        <option value="A" >Aprobado</option>
                                        <option value="C" >Culminado</option>
                                        <option value="D" >Denegado</option>
                                        <option value="I" >Interrumpido</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Tipo de permiso</label>
                                      <select class="form-select custom-select" id="permiso_trabajador_tipo" name="permiso_trabajador_tipo" aria-label="Default se0lec0t example">
                                        <option value="PR" >Permiso de retiro</option>
                                        <option value="PN" >Permiso normal</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Permiso</label>
                                      <select class="form-select custom-select" multiple id="id_permiso" name="array_id_permiso[]" aria-label="Default select example" >
                                        {this.state.tiposPermiso.map((tipoPermiso,index) => (<option key={index} value={tipoPermiso.id_permiso}  >{tipoPermiso.nombre_permiso}</option>))}
                                      </select>
                                    </div>
                                  </div>
                                  
                                  

                                </div>
                                <div className="row justify-content-center">
                                    
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                        <div class="form-groud">
                                        <label>Fecha desdé</label>
                                        <input type="date" class="form-control" id="fecha_desde_permiso_trabajador" name="fecha_desde_permiso_trabajador"/>
                                        </div>
                                    </div>
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                        <div class="form-groud">
                                        <label>Fecha hasta</label>
                                        <input type="date" class="form-control" id="fecha_hasta_permiso_trabajador" name="fecha_hasta_permiso_trabajador"/>
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

                  <div className="row justify-content-end  mb-3">
                        <div className="col-auto">
                            <button class="btn btn-info"  data-toggle="modal" onClick={this.mostrarModalAyuda}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                </svg>
                            </button>

                        </div>

                    </div>
                <TituloModulo clasesrow="row" clasesColumna="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center" tituloModulo="Módulo de Permiso Trabajador"/>
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