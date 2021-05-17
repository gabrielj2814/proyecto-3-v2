import React from "react"
import {withRouter} from "react-router-dom"

//JS
import axios from 'axios'
import Moment from 'moment'
import $ from 'jquery'
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
import ComponentFormCampo from '../subComponentes/componentFormCampo';

class ComponentReposoTrabajador extends React.Component{


    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.redirigirFormulario=this.redirigirFormulario.bind(this);
        this.buscarReposos=this.buscarReposos.bind(this);
        this.actualizarElementoTabla=this.actualizarElementoTabla.bind(this);
        this.consultarElementoTabla=this.consultarElementoTabla.bind(this);
        this.reposoEntregado=this.reposoEntregado.bind(this);
        this.reposoNoEntregado=this.reposoNoEntregado.bind(this);
        this.mostrarModalPdf=this.mostrarModalPdf.bind(this);
        this.mostrarFiltros=this.mostrarFiltros.bind(this);
        this.generarPdf=this.generarPdf.bind(this);
        this.mostrarModalInterumpirReposo=this.mostrarModalInterumpirReposo.bind(this);
        this.cerrarModalInterumpirReposo=this.cerrarModalInterumpirReposo.bind(this);
        this.interumpirReposo=this.interumpirReposo.bind(this);
        this.state={
            modulo:"",// modulo menu
            estado_menu:false,
            //---------- 
            id_reposo_trabajador_interumpir:null,
            listaReposos:[],
            tipoPdf:null,
            fecha_desde_reposo_trabajador_filtro_tabla:"",
            fecha_hasta_reposo_trabajador_filtro_tabla:"",
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
        let acessoModulo=await this.validarAccesoDelModulo("/dashboard/transaccion","/reposo-trabajador")
        if(acessoModulo){
            await this.consultarTodosReposo2()
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
                fecha_desde_reposo_trabajador_filtro_tabla:fechaDesde,
                fecha_hasta_reposo_trabajador_filtro_tabla:fechaHasta,
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

    verficarLista(json_server_response){
        if(json_server_response.length===0){
            json_server_response.push({
                id_reposo_trabajador:"0",
                id_cedula:"vacio",
                id_reposo:"vacio",
                estatu_reposo_trabajador:"vacio",
                estatu_reposo_trabajador:"vacio",
                estatu_entrega_reposo:"vacio",
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
        await axios.get(`http://localhost:8080/transaccion/reposo-trabajador/consultar-reposo/${fechaDesde}/${fechaHasta}`)
        .then(repuesta => {
            let json=JSON.parse(JSON.stringify(repuesta.data))
            datos=json
            console.log(datos)
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
        let fechaDesde=document.getElementById("fecha_desde_reposo_trabajador_filtro_tabla").value
        let fechaHasta=document.getElementById("fecha_hasta_reposo_trabajador_filtro_tabla").value
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

    async reposoEntregado(a){
        let boton=a.target
        // alert("Reposo entregado "+boton.id)
        await axios.get(`http://localhost:8080/transaccion/reposo-trabajador/actualizar-entrega-reposo/${boton.id}/${"E"}`)
        .then(async repuesta => {
            let json=repuesta.data
            if(json.mensaje!==""){
                var alerta=this.state.alerta
                alerta.mensaje=json.mensaje
                alerta.estado=true
                alerta.color="success"
                this.setState({
                    alerta
                })
                await this.actualizarTabla()
            }
        })
        .catch(error => {
            console.log("error al conectar con el servidor")
        })

    }

    async reposoNoEntregado(a){
        let boton=a.target
        // alert("Reposo no entregado "+boton.id)
        await axios.get(`http://localhost:8080/transaccion/reposo-trabajador/actualizar-entrega-reposo/${boton.id}/${"N"}`)
        .then(async repuesta => {
            let json=repuesta.data
            if(json.mensaje!==""){
                var alerta=this.state.alerta
                alerta.mensaje=json.mensaje
                alerta.estado=true
                alerta.color="success"
                this.setState({
                    alerta
                })
                await this.actualizarTabla()
                
            }
        })
        .catch(error => {
            console.log("error al conectar con el servidor")
        })
    }

    async actualizarTabla(){
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
    }

    async consultarTodosReposo2(){
        await axios.get("http://localhost:8080/configuracion/reposo/consultar-todos")
        .then(respuesta=>{
          let json=JSON.parse(JSON.stringify(respuesta.data.reposos))
            let listaReposos=json.filter(reposo => {
                if(reposo.estatu_reposo==="1"){
                    return reposo
                }
            })
            this.setState({listaReposos})
            // console.log("datos reposo =>>>>>>>>>>>>>>>>>> ",listaReposos)
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
  
        if(datos!==null){
        //   alert("generar pdf")
          $.ajax({
            url: 'http://localhost:80/proyecto/backend/controlador_php/controlador_reposo_trabajador.php',
            type:"post",
            data:datos,
            success: function(respuesta) {
            //   alert("OK")
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

    mostrarModalInterumpirReposo(a){
        let boton=a.target
        this.setState({id_reposo_trabajador_interumpir:boton.id})
        $("#modalInterumpirReposo").modal("show")
    }

    cerrarModalInterumpirReposo(){
        this.setState({id_reposo_trabajador_interumpir:null})
        $("#modalInterumpirReposo").modal("hide")
    }

    async interumpirReposo(){
        // alert(this.state.id_reposo_trabajador_interumpir)
        // UPDATE treposotrabajador SET estatu_reposo_trabajador='1' WHERE id_cedula='22222222';
        let alerta=JSON.parse(JSON.stringify(this.state.alerta))
        const token=localStorage.getItem('usuario')
        let json={
            id_reposo_trabajador:this.state.id_reposo_trabajador_interumpir,
            token
        }
        // this.setState({
        //     registros:[],
        //       numeros_registros:0
        // })
        await axios.post(`http://localhost:8080/transaccion/reposo-trabajador/interumpir`,json)
        .then(async respuesta => {
            let jsonResponse=JSON.parse(JSON.stringify(respuesta.data))
            if(jsonResponse.estado===true){
                alerta.color="success"
                alerta.mensaje="reposo interumpido exitosamente"
                alerta.estado=true
                this.setState({alerta})
                let datosResposos=await this.consultarRepososTrabajadoresFechaDesdeHasta(this.state.fecha_desde_reposo_trabajador_filtro_tabla,this.state.fecha_hasta_reposo_trabajador_filtro_tabla)
                let datosTabla=this.verficarLista(datosResposos.reposo_trabajadores)
                this.cerrarModalInterumpirReposo()
                this.setState(datosTabla)
            }
            else{
                alerta.color="danger"
                alerta.mensaje="reposo no pudo ser interumpido"
                alerta.estado=true
                this.setState({alerta})

            }
        })
        .catch(error => {
            console.log(error)
        })
    }

    render(){
        const jsx_tabla_encabezado=(
            <thead> 
                <tr>
                    <th>Nombre Trabajador</th>
                    <th>Reposo</th>
                    <th>Estatus del Reposo</th>
                </tr> 
            </thead>
        )

        const jsx_tabla_body=(
            <tbody>
                  {this.state.registros.map((reposoTrabajador)=>{
                      return(
                          <tr key={reposoTrabajador.id_reposo_trabajador}>
                            <td>{(reposoTrabajador.id_cedula==="vacio")?"vacio":this.state.trabajadores[reposoTrabajador.id_cedula].nombres} {(reposoTrabajador.id_cedula==="vacio")?"":this.state.trabajadores[reposoTrabajador.id_cedula].apellidos}</td>
                            <td>{(reposoTrabajador.id_reposo==="vacio")?"vacio":this.state.reposos[reposoTrabajador.id_reposo].nombre_reposo}</td>
                            <td>{(reposoTrabajador.estatu_reposo_trabajador==="vacio")?"vacio":(reposoTrabajador.estatu_reposo_trabajador==="1")?"Activo":(reposoTrabajador.estatu_reposo_trabajador==="2")?"Interumpido":"Inactivo"}</td>
                            
                            {reposoTrabajador.estatu_entrega_reposo==="N" &&
                              <td>
                                  <button className="btn btn-danger btn-block">No fue entregado</button>
                              </td>
                           }
                            {reposoTrabajador.estatu_entrega_reposo==="E" &&
                              <td>
                                  <button className="btn btn-success btn-block">Entregado</button>
                              </td>
                           }
                           
                           {reposoTrabajador.estatu_entrega_reposo==="P" &&
                              <td>
                                  <ButtonIcon 
                                  clasesBoton="btn btn-success btn-block" 
                                  value={reposoTrabajador.id_reposo_trabajador} 
                                  id={reposoTrabajador.id_reposo_trabajador}
                                  eventoPadre={this.reposoEntregado} 
                                  icon="icon-checkmark"
                                  />
                              </td>
                           }
                           {reposoTrabajador.estatu_entrega_reposo==="P" &&
                              <td>
                                  <ButtonIcon 
                                  clasesBoton="btn btn-danger btn-block" 
                                  value={reposoTrabajador.id_reposo_trabajador} 
                                  id={reposoTrabajador.id_reposo_trabajador}
                                  eventoPadre={this.reposoNoEntregado} 
                                  icon="icon-cross"
                                  />
                              </td>
                           }
                           
                           {reposoTrabajador.estatu_reposo_trabajador==="1"  &&
                              <td colSpan="2">
                                  <ButtonIcon 
                                  clasesBoton="btn btn-warning btn-block" 
                                  value={reposoTrabajador.id_reposo_trabajador} 
                                  id={reposoTrabajador.id_reposo_trabajador}
                                  eventoPadre={this.actualizarElementoTabla} 
                                  icon="icon-pencil"
                                  />
                              </td>
                           }
                           {reposoTrabajador.estatu_reposo_trabajador==="1" &&
                            <td>
                                <button className="btn btn-danger btn-block" id={reposoTrabajador.id_reposo_trabajador} onClick={this.mostrarModalInterumpirReposo}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-scissors" viewBox="0 0 16 16" id={reposoTrabajador.id_reposo_trabajador}>
                                        <path id={reposoTrabajador.id_reposo_trabajador} d="M3.5 3.5c-.614-.884-.074-1.962.858-2.5L8 7.226 11.642 1c.932.538 1.472 1.616.858 2.5L8.81 8.61l1.556 2.661a2.5 2.5 0 1 1-.794.637L8 9.73l-1.572 2.177a2.5 2.5 0 1 1-.794-.637L7.19 8.61 3.5 3.5zm2.5 10a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0zm7 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z"/>
                                    </svg>
                                </button>
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

                    <div class="modal fade" id="modalInterumpirReposo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg" role="document">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Interumpir el reposo</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                              <p>
                                Esta seguro que deseaa interumpir este reposo
                              </p>
                            </div>
                            <div class="modal-footer ">
                                <button type="button" class="btn btn-danger mr-3" onClick={this.cerrarModalInterumpirReposo}>No</button>
                                <button type="button" class="btn btn-success" onClick={this.interumpirReposo}>Si</button>
                            </div>
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
                                      <label>Estado Reposo</label>
                                      <select class="form-select custom-select" multiple id="estatu_reposo_trabajador" name="array_estatu_reposo_trabajador[]" aria-label="Default se0lec0t example">
                                        <option value="1" >Activo</option>
                                        <option value="0" >Inactivo</option>
                                        <option value="2" >Interumpido</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Reposo</label>
                                      <select class="form-select custom-select" multiple id="id_reposo" name="array_id_reposo[]" aria-label="Default select example" >
                                        <option value="null" >Selecciones</option>
                                        {this.state.listaReposos.map((reposo,index) => (<option key={index} value={reposo.id_reposo}  >{reposo.nombre_reposo}</option>))}
                                      </select>
                                    </div>
                                  </div>
                                  
                                  

                                </div>
                                <div className="row justify-content-center">
                                <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Estado de Entrega</label>
                                      <select class="form-select custom-select" multiple id="estado_entrega" name="array_estado_entrega[]" aria-label="Default se0lec0t example">
                                        <option value="P" >En espera</option>
                                        <option value="E" >Entregado</option>
                                        <option value="N" >No entregado</option>
                                      </select>
                                    </div>
                                  </div>
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                        <div class="form-groud">
                                        <label>Fecha desde</label>
                                        <input type="date" class="form-control" id="fecha_desde_reposo_trabajador" name="fecha_desde_reposo_trabajador"/>
                                        </div>
                                    </div>
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                        <div class="form-groud">
                                        <label>Fecha desde</label>
                                        <input type="date" class="form-control" id="fecha_hasta_reposo_trabajador" name="fecha_hasta_reposo_trabajador"/>
                                        </div>
                                    </div>
                                    
                                </div>
                              </form>


                              <form id="formLista" class="ocultarFormulario mb-3">
                              <div className="row justify-content-center">
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Estado Reposo</label>
                                      <select class="form-select custom-select" multiple id="estatu_reposo_trabajador" name="array_estatu_reposo_trabajador[]" aria-label="Default se0lec0t example">
                                        <option value="1" >Activo</option>
                                        <option value="0" >Inactivo</option>
                                        <option value="2" >Interumpido</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Reposo</label>
                                      <select class="form-select custom-select" multiple id="id_reposo" name="array_id_reposo[]" aria-label="Default select example" >
                                        {this.state.listaReposos.map((reposo,index) => (<option key={index} value={reposo.id_reposo}  >{reposo.nombre_reposo}</option>))}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Estado de Entrega</label>
                                      <select class="form-select custom-select" multiple id="estado_entrega" name="array_estado_entrega[]" aria-label="Default se0lec0t example">
                                        <option value="P" >En espera</option>
                                        <option value="E" >Entregado</option>
                                        <option value="N" >No entregado</option>
                                      </select>
                                    </div>
                                  </div>
                                  
                                  

                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                        <div class="form-groud">
                                        <label>Fecha desde</label>
                                        <input type="date" class="form-control" id="fecha_desde_reposo_trabajador" name="fecha_desde_reposo_trabajador"/>
                                        </div>
                                    </div>
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                        <div class="form-groud">
                                        <label>Fecha desde</label>
                                        <input type="date" class="form-control" id="fecha_hasta_reposo_trabajador" name="fecha_hasta_reposo_trabajador"/>
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

                
                <TituloModulo clasesrow="row" clasesColumna="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center" tituloModulo="Módulo de Reposo Trabajador"/>
                
                <div className="row component-tabla-de-datos">
                    <div className="col-12 col-ms-12 col-md-12 contenedor-tabla-de-datos">
                        <div className="row">
                            <ComponentFormDate
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            obligatorio="no"
                            mensaje={this.state.msj_fecha_desde_reposo_trabajador}
                            nombreCampoDate="Desde:"
                            clasesCampo="form-control"
                            value={this.state.fecha_desde_reposo_trabajador_filtro_tabla}
                            name="fecha_desde_reposo_trabajador_filtro_tabla"
                            id="fecha_desde_reposo_trabajador_filtro_tabla"
                            eventoPadre={this.buscarReposos}
                            />
                            <ComponentFormDate
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            obligatorio="no"
                            mensaje={this.state.msj_fecha_hasta_reposo_trabajador}
                            nombreCampoDate="Hasta:"
                            clasesCampo="form-control"
                            value={this.state.fecha_hasta_reposo_trabajador_filtro_tabla}
                            name="fecha_hasta_reposo_trabajador_filtro_tabla"
                            id="fecha_hasta_reposo_trabajador_filtro_tabla"
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