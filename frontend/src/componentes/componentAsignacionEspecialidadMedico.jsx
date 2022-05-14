import React from "react"
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import $ from 'jquery'
// IP servidor
import servidor from '../ipServer.js'
// css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import "../css/componentAsignacionEspecialidadMedico.css"
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes 
import TituloModulo from '../subComponentes/tituloModulo'
import ButtonIcon from '../subComponentes/buttonIcon'
import ComponentFormSelect from '../subComponentes/componentFormSelect';
import InputButton from '../subComponentes/input_button'
import Tabla from '../subComponentes/componentTabla'
import ComponentFormCampo from '../subComponentes/componentFormCampo';

class ComponentAsignacionEspecialidadMedico extends React.Component{

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.consultarAsignacionesMedico=this.consultarAsignacionesMedico.bind(this)
        this.redirigirFormulario=this.redirigirFormulario.bind(this)
        this.eliminarElementoTabla=this.eliminarElementoTabla.bind(this)
        this.actualizarElementoTabla=this.actualizarElementoTabla.bind(this)
        this.consultarElementoTabla=this.consultarElementoTabla.bind(this)
        this.mostrarModalPdf=this.mostrarModalPdf.bind(this)
        this.mostrarFiltros=this.mostrarFiltros.bind(this)
        this.generarPdf=this.generarPdf.bind(this)
        this.state={
            modulo:"",
            estado_menu:false,
            //------------
            nombre_usuario:null,
            listaMedicos:[], 
            listaEspecialidades:[], 
            tipoPdf:null,
            medicos:[],
            registros:[],
            id_medico:"",
            numeros_registros:0,
            msj_id_medico:{
                mensaje:"",
                color_texto:""
            },
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
        let acessoModulo=await this.validarAccesoDelModulo("/dashboard/configuracion","/asignacion-especialidad-medico")
        if(acessoModulo){
            await this.consultarTodosLosMedicos2()
            await this.consultarTodasEspecialidad2()
            let medicos=await this.consultarTodosLosMedicos()
            let listaMedico=this.formatoOptionSelect(medicos)
            this.setState({
                medicos:listaMedico,
                id_medico:(listaMedico.length===0)?null:listaMedico[0].id
            })
            console.log("medicos ->>>> ",medicos)
            let asignacionesPorMedico=await this.consultarSignacionesPorMedico(this.state.id_medico)
            let datos=this.verficarLista(asignacionesPorMedico)
            console.log(datos)
            this.setState(datos)
            
            console.log("asignaciones ->>>> ",asignacionesPorMedico)
            if(this.props.match.params.mensaje){
                // alert("mensaje")
                const msj=JSON.parse(this.props.match.params.mensaje)
                // alert("OK "+msj.texto)
                var mensaje=JSON.parse(JSON.stringify(this.state.mensaje))
                mensaje.texto=msj.texto
                mensaje.estado=msj.estado
                this.setState({mensaje:mensaje})
            }
        }
        else{
            alert("No tienes acesso a este módulo(sera redirigido a la vista anterior)")
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
                console.log(respuesta_servior.usuario)
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

    async consultarSignacionesPorMedico(id){
        let datos=null
        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/asignacion-medico-especialidad/consultar-asignacion-por-medico/${id}`)
        .then(repuesta => {
            datos=repuesta.data.medico_especialidad
        })
        .catch(error => {
            alert("No se pudo conectar con el servidor")
            console.log(error)
        })
        return datos
    }

    async consultarTodosLosMedicos(){
        var respuesta_servidor=[]
        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/medico/consultar-todos`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data.medicos
            // console.log(respuesta.data)
        })
        .catch(error=>{
            alert("No se pudo conectar con el servidor")
            console.log(error)
        })
        return respuesta_servidor;
    }

    formatoOptionSelect(lista){
        var veces=0
        let lista_vacia=[];
        while(veces<lista.length){
            lista_vacia.push({id:lista[veces].id_medico,descripcion:lista[veces].nombre_medico+" "+lista[veces].apellido_medico})
            veces+=1
        }
        return lista_vacia
    }

    cambiarEstado(a){
        var input=a.target;
        this.setState({[input.name]:input.value})
    }

    async consultarAsignacionesMedico(a){
        var input=a.target;
        this.setState({[input.name]:input.value})
        let asignaciones=await this.consultarSignacionesPorMedico(input.value)
        console.log("consultar asignaciones medico ->>>> ",asignaciones)
        let datos=this.verficarLista(asignaciones)
        console.log("datos -->>>>", datos)
        this.setState(datos)
    }

    verficarLista(json_server_response){
        if(json_server_response.length===0){
            json_server_response.push({
            id_estado:"0",
            nombre_medico:"vacio",
            apellido_medico:"",
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


    /**
     * 
     * <Tabla 
                        tabla_encabezado={props.tabla_encabezado}
                        tabla_body={props.tabla_body}
                        numeros_registros={props.numeros_registros}
                        />
    */

   redirigirFormulario(){
        this.props.history.push("/dashboard/configuracion/asignacion-especialidad-medico/registrar")
    }

    eliminarElementoTabla(a){
        var input=a.target;
        alert("Eliminar -> "+input.id);
    }
  
  actualizarElementoTabla(a){
      var input=a.target;
      this.props.history.push("/dashboard/configuracion/asignacion-especialidad-medico/actualizar/"+input.id);
  }
  
  consultarElementoTabla(a){
      let input=a.target;
    //   alert("Consultar -> "+input.id);
      this.props.history.push("/dashboard/configuracion/asignacion-especialidad-medico/consultar/"+input.id);
  }

    async consultarTodosLosMedicos2(){
        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/medico/consultar-todos`)
        .then(respuesta=>{
            let json=JSON.parse(JSON.stringify(respuesta.data.medicos))
            console.log("datos medicos =>>>>",json)
            this.setState({listaMedicos:json})
            
        })
        .catch(error=>{
            alert("No se pudo conectar con el servidor")
            console.log(error)
        })
    }

    async consultarTodasEspecialidad2(){
        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/especialidad/consultar-todos`)
        .then(respuesta=>{
          let json=JSON.parse(JSON.stringify(respuesta.data.especialidades))
        //   console.log("datos especialidades =>>> ",json)
          let especialidades=json.filter(especialidad => {
            if(especialidad.estatu_especialidad==="1"){
                return especialidad
            }
        })
        this.setState({listaEspecialidades:especialidades})
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
        let $formListaMedico=document.getElementById("formListaMedico")
        let $formListaEspecialidad=document.getElementById("formListaEspecialidad")
        if($select.value==="0"){
        $formListaEspecialidad.classList.add("ocultarFormulario")
        $formListaMedico.classList.remove("ocultarFormulario")
        $botonGenerarPdf.classList.remove("ocultarFormulario")
        this.setState({tipoPdf:"0"})
        }
        else if($select.value==="1"){
        this.setState({tipoPdf:"1"})
        $formListaEspecialidad.classList.remove("ocultarFormulario")
        $botonGenerarPdf.classList.remove("ocultarFormulario")
        $formListaMedico.classList.add("ocultarFormulario")
        }
        else{
        this.setState({tipoPdf:null})
        $formListaEspecialidad.classList.add("ocultarFormulario")
        $formListaMedico.classList.add("ocultarFormulario")
        $botonGenerarPdf.classList.add("ocultarFormulario")
        }
    }

    generarPdf(){
        let $filaVerPdf=document.getElementById("filaVerPdf")
        // $filaVerPdf.classList.remove("ocultarFormulario") //esta line sirve para mostrar el boton para ver el pdf => usar en success
        // $filaVerPdf.classList.add("ocultarFormulario") //esta line sirve para ocultar el boton para ver el pdf => usar en error
        let datos=null
        if(this.state.tipoPdf==="0"){
          datos=$("#formListaMedico").serializeArray()
        }
        else if(this.state.tipoPdf==="1"){
          datos=$("#formListaEspecialidad").serializeArray()
        }
  
        console.log(datos)
        datos.push({name:"nombre_usuario",value:this.state.nombre_usuario})
        if(datos!==null){
        //   alert("generar pdf")
          $.ajax({
            url: `http://${servidor.ipServidor}:${servidor.servidorApache.puerto}/proyecto/backend/controlador_php/controlador_medico_especialidad.php`,
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
            //   alert("error")
              $filaVerPdf.classList.add("ocultarFormulario") 
            }
          });
        }
        
  
      }


    render(){
        const jsx_tabla_encabezado=(
            <thead> 
                <tr> 
                  <th>Código</th> 
                  <th>Asignación</th>
                </tr> 
            </thead>
        )

        const jsx_tabla_body=(
            <tbody>
                {this.state.registros.map((asignacion)=>{
                    return(
                        <tr key={asignacion.id_asignacion_medico_especialidad}>
                            <td>{asignacion.id_asignacion_medico_especialidad}</td>
                            <td>{asignacion.nombre_medico} {(asignacion.apellido_medico==="")?"":asignacion.apellido_medico+","} {asignacion.nombre_especialidad}</td>
                            {!asignacion.vacio &&
                                <td>
                                    <ButtonIcon 
                                    clasesBoton="btn btn-warning btn-block" 
                                    value={asignacion.id_asignacion_medico_especialidad} 
                                    id={asignacion.id_asignacion_medico_especialidad}
                                    eventoPadre={this.actualizarElementoTabla} 
                                    icon="icon-pencil"
                                    />
                                </td>
                            }
                        
                        {!asignacion.vacio &&
                            <td>
                                <ButtonIcon 
                                clasesBoton="btn btn-secondary btn-block" 
                                value={asignacion.id_asignacion_medico_especialidad}
                                id={asignacion.id_asignacion_medico_especialidad} 
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
            {this.state.mensaje.texto!=="" && (this.state.mensaje.estado==="500" || this.state.mensaje.estado==="404") &&
                    <div className="row">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <div className="alert alert-danger alert-dismissible ">
                        <p>Mensaje del Error: {this.state.mensaje.texto}</p>
                        {/* <p>Estado del Error: {this.state.mensaje.estado}</p> */}
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
                                    <label>Tipo de Reporte</label>
                                    <select class="form-select custom-select" aria-label="Default select example" onChange={this.mostrarFiltros}>
                                      <option value="null" >Seleccione un tipo de Reporte</option>
                                      <option value="1" >Por Especialidad</option>
                                      <option value="0" >Por Médico</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <form id="formListaMedico" class="ocultarFormulario mb-3">
                                    <div className="row justify-content-center">
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Médico</label>
                                      <select class="form-select custom-select" id="id_medico" name="id_medico" aria-label="Default se0lec0t example">
                                        <option value="null" >Seleccione</option>
                                        {this.state.listaMedicos.map((medico,index) => (<option key={"medico-"+index} value={medico.id_medico}  >{medico.nombre_medico} {medico.apellido_medico}</option>))}
                                      </select>
                                    </div>
                                  </div>
                                  
                                  

                                </div>
                              </form>


                              <form id="formListaEspecialidad" class="ocultarFormulario mb-3">
                              <div className="row justify-content-center">
                                  <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-groud">
                                      <label>Especialidad</label>
                                      <select class="form-select custom-select" id="id_especialidad" name="id_especialidad" aria-label="Default se0lec0t example">
                                        <option value="null" >Seleccione</option>
                                        {this.state.listaEspecialidades.map((especialidad,index) => (<option key={"especialidad-"+index} value={especialidad.id_especialidad}  >{especialidad.nombre_especialidad}</option>))}
                                      </select>
                                    </div>
                                  </div>

                                  
                                  

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


                <TituloModulo clasesRow="row" clasesColumna="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center" tituloModulo="Módulo de Asignación Especialidad Médico"/>
                <div className="row component-tabla-de-datos">
                    <div className="col-12 col-ms-12 col-md-12 contenedor-tabla-de-datos">
                        <div className="row">
                            <ComponentFormSelect
                            clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                            obligatorio="no"
                            mensaje={this.state.msj_id_medico}
                            nombreCampoSelect="Médico:"
                            clasesSelect="custom-select"
                            name="id_medico"
                            id="id_medico"
                            eventoPadre={this.consultarAsignacionesMedico}
                            defaultValue={this.state.id_medico}
                            option={this.state.medicos}
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

        return(
            <div className="component_asignacion_inicio">
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

export default withRouter(ComponentAsignacionEspecialidadMedico)