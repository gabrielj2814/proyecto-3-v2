import React from 'react';
import {withRouter} from 'react-router-dom'
import $ from "jquery"
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentTrabajadorForm.css'
//JS
import axios from 'axios'
import Moment from 'moment'
// IP servidor
import servidor from '../ipServer.js'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'
import ButtonIcon from '../subComponentes/buttonIcon'
import ComponentFormCampo from '../subComponentes/componentFormCampo';
import ComponentFormRadioState from '../subComponentes/componentFormRadioState';
import ComponentFormRadioMultiState from '../subComponentes/componentFormRadioMultiState';
import ComponentFormSelect from '../subComponentes/componentFormSelect';
import ComponentFormDate from '../subComponentes/componentFormDate'
import ComponentFormTextArea from '../subComponentes/componentFormTextArea'
import { Alert } from 'bootstrap';
import AlertBootstrap from "../subComponentes/alertBootstrap"

const axiosCustom=axios.create({
    baseURL:`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/`
})

class ComponentAsistenciaEstudiantesForm extends React.Component{
  constructor(){
    super();
    this.consultarPerfilTrabajador=this.consultarPerfilTrabajador.bind(this)
    this.mostrarModulo = this.mostrarModulo.bind(this);
    this.regresar=this.regresar.bind(this);
    this.operacion=this.operacion.bind(this);
    this.agregar=this.agregar.bind(this);
    this.validarFormularioRegistrar=this.validarFormularioRegistrar.bind(this);
    this.enviarDatos=this.enviarDatos.bind(this)
    this.obtenerDatosDeLasesion = this.obtenerDatosDeLasesion.bind(this)
    this.AsistenciaDeHoy = this.AsistenciaDeHoy.bind(this)
    this.updateObjeto = this.updateObjeto.bind(this)

    this.state={
        // ------------------
        modulo:"",// modulo menu
        estado_menu:false,
        //formulario
        cedula_profesor: "",
        asistencias_estudiantes: [],
        estados_asistencia:[
          {id: " ",descripcion: "Seleccione una opción"},
          {id: "0",descripcion: "NO vino"},
          {id: "1",descripcion: "Vino"},
          {id: "2",descripcion: "Se enfermó"},
          {id: "3",descripcion: "Otros"},
        ],
        // -- 1 -> vino , 0 -> no vino , 2 -> por que se enfermo, 3 -> otros sumar observacion
        //// combo box
        hashListaEstudiantes:{},
        estadoBusquedaProfesor: false,
        operacion: "Registrar",
        ///
        mensaje:{
            texto:"",
            color_alerta: "",
            estado:""
        },
        //
        fechaServidor:null,
        StringExprecion: /[A-Za-z]|[0-9]/
    }
  }

  async obtenerDatosDeLasesion(){
    const token=localStorage.getItem("usuario")
    await axiosCustom.get(`login/verificar-sesion${token}`)
    .then(respuesta=>{
        let respuesta_servior=respuesta.data
        if(respuesta_servior.usuario){
            this.setState({
                cedula_profesor:respuesta_servior.usuario.id_cedula
            })
        }
    })
    .catch(error => {
        let mensaje=JSON.parse(JSON.stringify(this.state.mensaje))
        mensaje.estado="danger"
        mensaje.texto="error al conectarse con el servidor"
        this.setState({mensaje})
    })
  }

  updateObjeto(a){
    let input = a.target;
    let name = input.name.split("-");

    let estudiantes = this.state.asistencias_estudiantes.map( item => {
      if(item.id_inscripcion == name[1]){
        item[name[0]] = input.value;
        return item;
      }else return item;
    })
    this.setState({asistencias_estudiantes: estudiantes})
  }

  async AsistenciaDeHoy(){
    await axiosCustom.post(`transaccion/asistencia-estudiante/crear-asistencia/${this.state.cedula_profesor}`)
    .then(({data}) =>{

      let lista = data.datos.map( item => {
        return {
          id_asistencia_estudiante: item.id_asistencia_estudiante,
          id_inscripcion: item.id_inscripcion,
          fecha_asistencia_estudiante: Moment(item.fecha_asistencia_estudiante).format("YYYY-MM-DD"),
          estatus_asistencia_estudiante: item.estatus_asistencia_estudiante,
          observacion_asistencia_estudiante: item.observacion_asistencia_estudiante
        }
      })
      this.setState({hashListaEstudiantes: data.datos, asistencias_estudiantes: lista})
    })
    .catch(error => {
        let mensaje=JSON.parse(JSON.stringify(this.state.mensaje))
        mensaje.estado="danger"
        mensaje.texto="error al conectarse con el servidor"
        this.setState({mensaje})
    })
  }

  async UNSAFE_componentWillMount(){
    let acessoModulo=await this.validarAccesoDelModulo("/dashboard/transaccion","/asistencia_estudiante")
    if(acessoModulo){
      await this.consultarFechaServidor()
      await this.obtenerDatosDeLasesion();
      await this.AsistenciaDeHoy();

    }else{
        alert("no tienes acesso a este modulo(sera redirigido a la vista anterior)")
        this.props.history.goBack()
    }
  }

  async validarAccesoDelModulo(modulo,subModulo){
    let estado = false
    if(localStorage.getItem("usuario")){

      const token=localStorage.getItem("usuario")
      await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/login/verificar-sesion${token}`)
      .then(async respuesta=>{
          let respuesta_servior = respuesta.data
          if(respuesta_servior.usuario){
            estado = await this.consultarPerfilTrabajador(modulo,subModulo,respuesta_servior.usuario.id_perfil)
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
        console.error(error)
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

  async consultarFechaServidor(){
      await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/trabajador/fecha-servidor`)
      .then(respuesta => {
          let fechaServidor=respuesta.data.fechaServidor
          this.setState({fechaServidor: fechaServidor, fecha_inscripcion: fechaServidor})
      })
      .catch(error => {
          console.log("error al conectar con el servidor")
      })
  }

  async consultarServidor(ruta_api,nombre_propiedad_lista,propiedad_id,propiedad_descripcion,propiedad_estado){
      var respuesta_servidor=[]
      var lista=[]
      var mensaje={texto:"",estado:""}
      await axios.get(ruta_api)
      .then(respuesta=>{
          respuesta_servidor=respuesta.data
          if(respuesta_servidor.estado_peticion==="200"){
              var lista_vacia=[]
              const propiedades={
                  id:propiedad_id,
                  descripcion:propiedad_descripcion,
                  estado:propiedad_estado
              }
              lista=this.formatoOptionSelect(respuesta_servidor[nombre_propiedad_lista],lista_vacia,propiedades)
          }
          else if(respuesta_servidor.estado_peticion==="404"){
              mensaje.texto=respuesta_servidor.mensaje
              mensaje.estado=respuesta_servidor.estado_peticion
              this.props.history.push(`/dashboard/transaccion/asistencia-estudiante${JSON.stringify(mensaje)}`)
          }
      })
      .catch(error=>{
          console.error(error)
      })
      return lista
  }

  async agregar(){
    var mensaje=this.state.mensaje
    mensaje.estado=""
    var mensaje_campo=[{mensaje:"",color_texto:""}]
    this.setState({
      cedula_profesor: "",
      asistencias_estudiantes: [],
      //// combo box
      hashListaEstudiantes:{},
    })
    this.props.history.push("/dashboard/transaccion/asistencia_estudiante")
  }

  validarFormularioRegistrar(){

    let msj = this.state.asistencias_estudiantes.map( item => {
      if(item.estatus_asistencia_estudiante == " " || item.estatus_asistencia_estudiante == null || item.estatus_asistencia_estudiante == ""){
        return {msj: "Todos los estudiantes deben de tener un estatus", name: `estatus_asistencia_estudiante-${item.id_inscripcion}`}
      }else if(item.estatus_asistencia_estudiante == "3" && item.observacion_asistencia_estudiante == ""){
        return {msj: "Tambien debes de ingresar una observación", name: `observacion_asistencia_estudiante-${item.id_inscripcion}`}
      }

      return {value: true}
    });
    let estatusValidaciones = true;

    if(msj){
      for(let item of msj){
        if(!item.value){
          estatusValidaciones = false;
          document.getElementById("form_trabajador")[item.name].focus();
          alert(item.msj)
          break;
        }
      }
    }
    return {estado: estatusValidaciones};
  }

  operacion(){
    $(".columna-modulo").animate({
      scrollTop: 0
    }, 1000)

    const mensaje_formulario={ mensaje:"",}
    const estado_validar_formulario=this.validarFormularioRegistrar()
    if(estado_validar_formulario.estado){
      this.enviarDatos(estado_validar_formulario,(objeto)=>{
        console.log(objeto)
        return false;
        const mensaje =this.state.mensaje
        var respuesta_servidor=""
        axios.post(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/transaccion/asistencia-estudiante/actualizar-estado`,objeto)
        .then(respuesta=>{
          respuesta_servidor=respuesta.data
          mensaje.texto=respuesta_servidor.mensaje
          mensaje.estado=respuesta_servidor.estado
          mensaje.color_alerta=respuesta_servidor.color_alerta
          mensaje_formulario.mensaje=mensaje
          this.setState(mensaje_formulario)
        })
        .catch(error=>{
          mensaje.texto="No se puedo conectar con el servidor"
          mensaje.color_alerta=respuesta_servidor.color_alerta
          mensaje.estado=false
          console.error(error)
          mensaje_formulario.mensaje=mensaje
          this.setState(mensaje_formulario)
        })
      })
    }
  }

  enviarDatos(estado_validar_formulario,petion){
      const token=localStorage.getItem('usuario')
      const objeto={
          asistencias:this.state.asistencias_estudiantes,
          token:token
      }
      petion(objeto)
  }

  regresar(){ this.props.history.push("/dashboard/transaccion/asistencia_estudiante"); }

  render(){
    var jsx_asistencia_form=(
        <div className="row justify-content-center">

            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                {this.state.mensaje.texto!=="" && (this.state.mensaje.estado===true || this.state.mensaje.estado===false || this.state.mensaje.estado==="danger") &&
                    <div className="row">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <div className={`alert alert-${(this.state.mensaje.color_alerta)} alert-dismissible`}>
                                <p>Mensaje: {this.state.mensaje.texto}</p>
                                <button className="close" data-dismiss="alert">
                                    <span>X</span>
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_formulario_trabajador">
                <div className="row justify-content-center">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-trabajador">
                        <span className="titulo-form-trabajador">Asistencia de Estudiantes</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-auto">
                        <ButtonIcon
                        clasesBoton="btn btn-outline-success"
                        icon="icon-plus"
                        id="icon-plus"
                        eventoPadre={this.agregar}
                        />
                    </div>
                </div>
                <form id="form_trabajador">
                  <div className="row mt-3">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                          <span className="sub-titulo-form-reposo-trabajador">Listado de estudiantes</span>
                      </div>
                  </div>
                  {this.state.hashListaEstudiantes.length > 0 &&
                    this.state.hashListaEstudiantes.map( (item,index) => {
                      let observacion = this.state.asistencias_estudiantes.filter( itemx => itemx.id_inscripcion == item.id_inscripcion)[0].observacion_asistencia_estudiante
                      let estatus = this.state.asistencias_estudiantes.filter( itemx => itemx.id_inscripcion == item.id_inscripcion)[0].estatus_asistencia_estudiante

                      return (
                        <div className="row justify-content-center align-items-center" key={index}>
                          <ComponentFormCampo clasesColumna="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4"
                            clasesCampo="form-control" obligatorio="si" mensaje={""}
                            nombreCampo={`Estudiante: ${item.codigo_cedula_escolar+'-'+item.cedula_escolar}`} activo="no" type="text" value={ (item.nombres_estudiante+' '+item.apellidos_estudiante) }
                            name="id_inscripcion" id="id_inscripcion" placeholder="Cédula" eventoPadre={this.BuscarProfesor}
                          />
                          <ComponentFormSelect
                            clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                            obligatorio="si"
                            mensaje={""}
                            nombreCampoSelect="Estatus asistencia:"
                            clasesSelect="custom-select"
                            name={`estatus_asistencia_estudiante-${item.id_inscripcion}`}
                            id="estatus_asistencia_estudiante"
                            eventoPadre={this.updateObjeto}
                            defaultValue={estatus}
                            option={this.state.estados_asistencia}
                          />
                          <ComponentFormCampo clasesColumna="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4"
                            clasesCampo="form-control" obligatorio="no" mensaje={""}
                            nombreCampo="Observación:" activo="si" type="text" value={observacion}
                            name={`observacion_asistencia_estudiante-${item.id_inscripcion}`} id="observacion_asistencia_estudiante" placeholder="Observación" eventoPadre={this.updateObjeto}
                          />
                        </div>
                      )
                    })
                  }

                    <div className="row justify-content-center">
                      <div className="col-auto">
                        {this.state.operacion === "Registrar" &&
                          <InputButton
                            clasesBoton="btn btn-primary"
                            id="boton-registrar"
                            value="Registrar"
                            eventoPadre={this.operacion}
                            />
                        }

                        {this.state.operacion === "Actualizar" &&
                            <InputButton
                              clasesBoton="btn btn-warning"
                              id="boton-actualizar"
                              value="Actualizar"
                              eventoPadre={this.operacion}
                            />
                          }
                        </div>
                        <div className="col-auto">
                            <InputButton
                            clasesBoton="btn btn-danger"
                            id="boton-cancelar"
                            value="Cancelar"
                            eventoPadre={this.regresar}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )

    return(
        <div className="component_trabajador_form">
          <ComponentDashboard
          componente={jsx_asistencia_form}
          modulo={this.state.modulo}
          eventoPadreMenu={this.mostrarModulo}
          estado_menu={this.state.estado_menu}
          />
        </div>
    )
  }
}

export default withRouter(ComponentAsistenciaEstudiantesForm)
