import React from 'react'
import {withRouter} from 'react-router-dom'

//JS
import axios from 'axios'
import $ from 'jquery'
// IP servidor
import servidor from '../ipServer.js'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import "../css/componentListaAsistencia.css"
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'
import AlertBootstrap from "../subComponentes/alertBootstrap"
import ComponentFormCampo from '../subComponentes/componentFormCampo';

class ComponentListaAsistencia extends React.Component{

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.pasarAsistencia=this.pasarAsistencia.bind(this);
        this.mostrarModalObservacion=this.mostrarModalObservacion.bind(this);
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.enviarObservacion=this.enviarObservacion.bind(this);
        this.mostrarModalPdf=this.mostrarModalPdf.bind(this);
        this.mostrarFiltros=this.mostrarFiltros.bind(this);
        this.generarPdf=this.generarPdf.bind(this);
        this.mostrarModalAyuda=this.mostrarModalAyuda.bind(this);
        this.state={
            modulo:"",// modulo menu
            estado_menu:false,
            //----------
            nombre_usuario:null,
            tiposTrabajadores:[],
            id_cedula:null,
            tipoPdf:null,
            hashAsistencia:{},
            id_asistencia:null,
            observacion_asistencia:"",
            asistencias:[],
            alerta:{
                color:null,
                mensaje:null,
                estado:false
            }
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
        let acessoModulo=await this.validarAccesoDelModulo("/dashboard/transaccion","/asistencia/lista")
        if(acessoModulo){
            await this.consultarAsistencia()
            await this.consultarTipoTrabajador()
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

    async consultarTipoTrabajador(){
        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}configuracion/tipo-trabajador/consultar-tipos-trabajador`)
        .then(respuesta => {
            let json=JSON.parse(JSON.stringify(respuesta.data))
            console.log(json)
            this.setState({tiposTrabajadores:json.tipos_trabajador})
        })
        .catch(error => {
            console.log(error)
        })
    }

    async consultarAsistencia(){
        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/transaccion/asistencia/consultar-asistencia-hoy`)
        .then(repuesta => {
            let json=JSON.parse(JSON.stringify(repuesta.data))
            console.log(json)
            
            let hash={}
            for(let asistencia of json.asistencias){
                hash[asistencia.id_asistencia]=asistencia
            }
            // console.log(hash)
            this.setState({asistencias:json.asistencias,hashAsistencia:hash})

        })
        .catch(error => {
            console.log("error al conectar con el servidor")
        })
    }
    
    async pasarAsistencia(){
        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/transaccion/asistencia/verificar-inasistencias-justificada`)
        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/transaccion/asistencia/verificar-inasistencias-injustificada`)
        window.location.href = window.location.href;
    }

    mostrarModalObservacion(fila){
        let idAsistencia=fila.target.getAttribute("data-id-asistencia")
        this.setState({id_asistencia:idAsistencia})
        $("#modalObservacion").modal("show")
        let asistencias=JSON.parse(JSON.stringify(this.state.hashAsistencia))
        let asistencia=asistencias[idAsistencia]
        console.log(asistencia)
        this.setState({observacion_asistencia:(asistencia.observacion_asistencia===null)?"":asistencia.observacion_asistencia})
    }

    async enviarObservacion(){
        let  alerta={
            color:null,
            mensaje:null,
            estado:false
        }
        let $inputObservacion=document.getElementById("observacion_asistencia")
        let token=localStorage.getItem("usuario")
        const datos={
            asistencia:{
                id_asistencia:this.state.id_asistencia,
                observacion_asistencia:$inputObservacion.value,
                token
            }
        }
        console.log("datos =>>>> ",datos)
        await axios.put(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/transaccion/asistencia/agregar-observacion`,datos)
        .then(async respuesta => {
            let json=JSON.parse(JSON.stringify(respuesta.data))
            console.log("repuesta servidor =>>> ",json)
            $("#modalObservacion").modal("hide")
            if(json.estado_peticion==="200"){
                alerta.mensaje=json.mensaje
                alerta.color="success"
                alerta.estado=true
            }
            else{
                
                alerta.mensaje=json.mensaje
                alerta.color="danger"
            }
            this.setState({alerta,observacion_asistencia:""})
            await this.consultarAsistencia()
        })
        .catch(error => { 
            console.log("error  al conectarse con el servidor")
            alerta.mensaje="Error al conectarse con el servidor"
            alerta.color="danger"
            alerta.estado=true
            this.setState({alerta})
        })
    }

    cambiarEstado(a){
        let input = a.target
        this.setState({[input.name]:input.value})
    }


    mostrarModalPdf(){
        // alert("hola")
        $("#modalPdfAsistencia").modal("show")
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

    buscar(nombre,lista){
        let contador=0
        let listaNueva=[]
        while(contador<lista.length){
            if(lista[contador].name===nombre){
                listaNueva.push(lista[contador].value)
            }
            contador++
        }
        return listaNueva
    }

    buscarEspecifico(nombres,lista){
        let busqueda= lista.filter(dato => {
            if(dato.name===nombres){
                return dato
            }
        })
        return busqueda[0].value
    }

      generarPdf(){
        let $filaVerPdf=document.getElementById("filaVerPdf")
        // $filaVerPdf.classList.remove("ocultarFormulario") //esta line sirve para mostrar el boton para ver el pdf => usar en success
        // $filaVerPdf.classList.add("ocultarFormulario") //esta line sirve para ocultar el boton para ver el pdf => usar en error
        let datos=null
        let datosFinales={}
        if(this.state.tipoPdf==="0"){
          datos=$("#formListaEspecifico").serializeArray()
          console.log(datos)
        }
        else if(this.state.tipoPdf==="1"){
          datos=$("#formLista").serializeArray()
        }

        datos.push({name:"nombre_usuario",value:this.state.nombre_usuario})
  
        if(datos!==null){
          $.ajax({
            url: `http://${servidor.ipServidor}:${servidor.servidorApache.puerto}/proyecto/backend/controlador_php/controlador_asistencia.php`,
            type:"post",
            data:datos,
            success: function(respuesta) {
                console.log(respuesta)
                let json=JSON.parse(respuesta)
                if(json.nombrePdf!=="false"){
                    $filaVerPdf.classList.remove("ocultarFormulario") 
                    document.getElementById("linkPdf").href=`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/reporte/${json.nombrePdf}`
                }
                else{
                    $filaVerPdf.classList.add("ocultarFormulario") 
                    alert("No se pudo generar el pdf por que no hay registros que coincidan con los datos enviados")
                }
            },
            error: function() {
              alert("error")
              $filaVerPdf.classList.add("ocultarFormulario")
            }
          });
        }
        
  
      }

    mostrarModalAyuda(){
        $("#modalAyuda").modal("show")
    }

    render(){

        const component=(
            <div className="row justify-content-center">
                {this.state.alerta.estado===true &&
                    (<div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">

                        <AlertBootstrap colorAlert={this.state.alerta.color} mensaje={this.state.alerta.mensaje}/>
                        
                    </div>)
                }
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_formulario_lista_asistencia">
                    <div className="row justify-content-center mb-3">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-cam">
                            <span className="titulo-form-cam">Lista de Asistencia</span>
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
                    <div className="row  mb-3">
                        <div className="col-auto">

                            <button class="btn btn-success"  data-toggle="modal" data-target="#exampleModal">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-check" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                                    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                                </svg>
                            </button>

                        </div>

                        <div className="col-auto">

                            <button class="btn btn-danger" onClick={this.mostrarModalPdf} >pdf</button>

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
                                    Este boton activa una modal que te permitira generar reportes de las asistencia en formato pdf
                                   </div>
                               </div>
                               <div className="row mb-3">
                                   <div className="col-auto">
                                        <button class="btn btn-success mr-3"  data-toggle="modal">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-check" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                                                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                                                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                                            </svg>
                                        </button>
                                        Este boton te mostrara una modal preguntandote si estas seguro de pasar la asistencia
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

                    <div class="modal fade" id="modalPdfAsistencia" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                    <div className="col-auto">Para seleccionar mas de un elemento mantener Ctrl + click izquierdo del ratón</div>
                                </div>
                              <div className="row justify-content-center">
                                    <ComponentFormCampo
                                    clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                                    clasesCampo="form-control"
                                    obligatorio="no"
                                    nombreCampo="Cédula del trabajador"
                                    activo="si"
                                    type="text"
                                    value={this.state.id_cedula}
                                    name="id_cedula"
                                    id="id_cedula"
                                    placeholder="cedula"
                                    eventoPadre={this.cambiarEstado}
                                    />
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Estado de asistencia</label>
                                      <select class="form-select custom-select" multiple id="array_estatu_asistencia[]" name="array_estatu_asistencia[]" aria-label="Default se0lec0t example">
                                        <option value="P" >Presente</option>
                                        <option value="II" >Inasistencia injustificada</option>
                                        <option value="IJR" >Inasistencia justificada por reposo</option>
                                        <option value="IJP" >Inasistencia justificada por permiso</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Estado del trabajador</label>
                                      <select class="form-select custom-select" multiple id="array_id_permiso_trabajador[]" name="array_id_permiso_trabajador[]" aria-label="Default se0lec0t example">
                                        <option value="1" >Laborando</option>
                                        <option value="0" >Retiro</option>
                                      </select>
                                    </div>
                                  </div>
                                  
                                  

                                </div>
                                
                                <div className="row justify-content-center">
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                        <div class="form-groud">
                                        <label>Cumplimiento Horario</label>
                                        <select class="form-select custom-select" multiple id="array_estatu_cumplimiento_horario[]" name="array_estatu_cumplimiento_horario[]" aria-label="Default se0lec0t example">

                                            <option value="C" >Cumplio</option>
                                            <option value="N" >No cumplio</option>
                                        </select>
                                        </div>
                                    </div>
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                        <div class="form-groud">
                                        <label>Mes</label>
                                        <select class="form-select custom-select" multiple id="array_mes[]" name="array_mes[]" aria-label="Default se0lec0t example">
                                            <option value="null" >Custom</option>
                                            <option value="01" >Enero</option>
                                            <option value="02" >Febrero</option>
                                            <option value="03" >Marzo</option>
                                            <option value="04" >Abril</option>
                                            <option value="05" >Mayo</option>
                                            <option value="06" >Junio</option>
                                            <option value="07" >Julio</option>
                                            <option value="08" >Agosto</option>
                                            <option value="09" >Septiembre</option>
                                            <option value="10" >Octubre</option>
                                            <option value="11" >Noviembre</option>
                                            <option value="12" >Diciembre</option>
                                        </select>
                                        </div>
                                    </div>
                                    
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                        <div class="form-groud">
                                        <label>Tipo de trabajador</label>
                                        <select class="form-select custom-select" multiple id="array_tipos_trabajador[]" name="array_tipos_trabajador[]" aria-label="Default se0lec0t example">
                                            {this.state.tiposTrabajadores.map((tipo,index) => {
                                                return (<option key={"lista-"+tipo.id_tipo_trabajador} value={tipo.id_tipo_trabajador} >{tipo.descripcion_tipo_trabajador}</option>)
                                            })}
                                        </select>
                                        </div>
                                    </div>
                                   
                                    
                                    
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                        <div class="form-groud">
                                        <label>Fecha desdé</label>
                                        <input type="date" class="form-control" id="desde" name="desde"/>
                                        </div>
                                    </div>
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                        <div class="form-groud">
                                        <label>Fecha hasta</label>
                                        <input type="date" class="form-control" id="hasta" name="hasta"/>
                                        </div>
                                    </div>
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
                                </div>
                              </form>


                              <form id="formLista" class="ocultarFormulario mb-3">
                                <div className="row justify-content-center mb-3">
                                    <div className="col-auto">Para seleccionar mas de un elemento mantener Ctrl + click izquierdo del ratón</div>
                                </div>
                                <div className="row justify-content-center">
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Estado de asistencia</label>
                                      <select class="form-select custom-select" multiple id="array_estatu_asistencia[]" name="array_estatu_asistencia[]" aria-label="Default se0lec0t example">
                                        <option value="P" >Presente</option>
                                        <option value="II" >Inasistencia injustificada</option>
                                        <option value="IJR" >Inasistencia justificada por reposo</option>
                                        <option value="IJP" >Inasistencia justificada por permiso</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Estado del trabajador</label>
                                      <select class="form-select custom-select" multiple id="array_id_permiso_trabajador[]" name="array_id_permiso_trabajador[]" aria-label="Default se0lec0t example">
                                        <option value="1" >Laborando</option>
                                        <option value="0" >Retiro</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Cumplimiento Horario</label>
                                      <select class="form-select custom-select" multiple id="array_estatu_cumplimiento_horario[]" name="array_estatu_cumplimiento_horario[]" aria-label="Default se0lec0t example">
                                        <option value="C" >Cumplio</option>
                                        <option value="N" >No cumplio</option>
                                      </select>
                                    </div>
                                  </div>
                                  

                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                        <div class="form-groud">
                                        <label>Mes</label>
                                        <select class="form-select custom-select" multiple id="array_mes[]" name="array_mes[]" aria-label="Default se0lec0t example">
                                            <option value="null" >Custom</option>
                                            <option value="01" >Enero</option>
                                            <option value="02" >Febrero</option>
                                            <option value="03" >Marzo</option>
                                            <option value="04" >Abril</option>
                                            <option value="05" >Mayo</option>
                                            <option value="06" >Junio</option>
                                            <option value="07" >Julio</option>
                                            <option value="08" >Agosto</option>
                                            <option value="09" >Septiembre</option>
                                            <option value="10" >Octubre</option>
                                            <option value="11" >Noviembre</option>
                                            <option value="12" >Diciembre</option>
                                        </select>
                                        </div>
                                    </div>
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                        <div class="form-groud">
                                        <label>Tipo de trabajador</label>
                                        <select class="form-select custom-select" multiple id="array_tipos_trabajador[]" name="array_tipos_trabajador[]" aria-label="Default se0lec0t example">
                                            {this.state.tiposTrabajadores.map((tipo,index) => {
                                                return (<option key={"lista-"+tipo.id_tipo_trabajador} value={tipo.id_tipo_trabajador} >{tipo.descripcion_tipo_trabajador}</option>)
                                            })}
                                        </select>
                                        </div>
                                    </div>
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                        <div class="form-groud">
                                        <label>Fecha desdé</label>
                                        <input type="date" class="form-control" id="desde" name="desde"/>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                        <div class="form-groud">
                                        <label>Fecha hasta</label>
                                        <input type="date" class="form-control" id="hasta" name="hasta"/>
                                        </div>
                                    </div>
                                    <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6"></div>
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

                    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Asistencia</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                               <p>¿Esta seguro de quiere pasar la asistencia?</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger" data-dismiss="modal">No</button>
                                <button type="button" class="btn btn-success" onClick={this.pasarAsistencia}>Si</button>
                            </div>
                            </div>
                        </div>
                    </div>

                    <div class="modal fade" id="modalObservacion" tabindex="-1" role="dialog" aria-labelledby="modalObservacionLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="modalObservacionLabel">Asistencia</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                               <h3 className="text-center mb-3">Agregue una observación</h3>
                               <textarea className="form-control observacion" id="observacion_asistencia" name="observacion_asistencia" value={this.state.observacion_asistencia} onChange={this.cambiarEstado}></textarea>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-primary" onClick={this.enviarObservacion}>Guardar</button>
                            </div>
                            </div>
                        </div>
                    </div>

                    <table className="table table-bordered table-hover table-dark">
                        <thead>
                            <tr>
                            <th scope="col">Cédula</th>
                            <th scope="col">Nombre trabajador</th>
                            <th scope="col">Hora de llegada</th>
                            <th scope="col">Cumplimiento H.</th>
                            <th scope="col">Estado asistencia</th>
                            <th scope="col">Estado trabajador</th>
                            </tr>
                        </thead>
                        <tbody>
                           {this.state.asistencias.map((asistencia,index) => {
                               return(
                                <tr key={index} className="filaTabla" data-id-asistencia={asistencia.id_asistencia} onClick={this.mostrarModalObservacion}>
                                    <td data-id-asistencia={asistencia.id_asistencia} >{asistencia.id_cedula}</td>
                                    <td data-id-asistencia={asistencia.id_asistencia} >{asistencia.nombres} {asistencia.apellidos}</td>
                                    <td data-id-asistencia={asistencia.id_asistencia} >{(asistencia.horario_entrada_asistencia==="--:--AM")?"--:--":asistencia.horario_entrada_asistencia}</td>
                                    <td data-id-asistencia={asistencia.id_asistencia}  className={(asistencia.estatu_cumplimiento_horario==="C")?"bg-success":"bg-danger"}>{(asistencia.estatu_cumplimiento_horario==="C")?"cumplio con el horario":"no cumplio con el horario"}</td>
                                    <td data-id-asistencia={asistencia.id_asistencia}  className={(asistencia.estatu_asistencia==="P")?"bg-success":(asistencia.estatu_asistencia==="II")?"bg-danger":"bg-primary"}>{(asistencia.estatu_asistencia==="P")?"Presente":(asistencia.estatu_asistencia==="II")?"Inasistencia injustificada":(asistencia.estatu_asistencia==="IJP")?"Inasistencia justificada por Permiso":"Inasistencia justificada por Reposo"}</td>
                                    <td data-id-asistencia={asistencia.id_asistencia}  >{(asistencia.horario_entrada_asistencia!="--:--AM" && asistencia.id_permiso_trabajador===null)?"Laborando":(asistencia.horario_entrada_asistencia!="--:--AM" && asistencia.id_permiso_trabajador!==null)?"vino pero se retiro":"-"}</td>
                                </tr>
                               )
                            })
                           }
                        </tbody>
                    </table>

                </div>
            </div>
        )

        return (

            <div className="component_lista_asistencia">
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

export default withRouter(ComponentListaAsistencia)