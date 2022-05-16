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

class ComponentCambioAulaForm extends React.Component{
  constructor(){
    super();
    this.consultarPerfilTrabajador=this.consultarPerfilTrabajador.bind(this)
    this.mostrarModulo = this.mostrarModulo.bind(this);
    this.regresar=this.regresar.bind(this);
    this.operacion=this.operacion.bind(this);
    this.cambiarEstado=this.cambiarEstado.bind(this);
    this.agregar=this.agregar.bind(this);
    this.validarSelect=this.validarSelect.bind(this);
    this.cambiarEstadoDos = this.cambiarEstadoDos.bind(this);
    this.validarFormulario = this.validarFormulario.bind(this);
    this.enviarDatos=this.enviarDatos.bind(this)
    this.BuscarEstudiante = this.BuscarEstudiante.bind(this);
    this.ConsultarAulasPorGrado = this.ConsultarAulasPorGrado.bind(this);
    this.traslado = this.traslado.bind(this);
    this.atras = this.atras.bind(this);
    this.consultarAula = this.consultarAula.bind(this)
    this.validaEstudianteA = this.validaEstudianteA.bind(this);

    this.state={
        // ------------------
        modulo:"",// modulo menu
        estado_menu:false,
        //formulario
        id_grado: "",
        // ESTUDIANTE A
        id_inscripcion_a: "",
        id_aula_a: "",
        cedula_escolar_a: "",
        nombres_estudiante_a: "",
        apellidos_estudiante_a: "",
        datos_docente_a: "",
        id_asignacion_aula_a:"",
        // ESTUDIANTE B
        id_inscripcion_b: "",
        id_aula_b: "",
        cedula_escolar_b: "",
        nombres_estudiante_b: "",
        apellidos_estudiante_b: "",
        datos_docente_b: "",
        id_asignacion_aula_b:"",
        //
        listaGrados:[],
        listaAulas:[],
        listaEstudiantes_a:[],
        listaEstudiantes_b:[],
        hashEstudiantes_a:{},
        hashEstudiantes_b:{},
        //MSJ
        msj_id_grado:[{mensaje:"",color_texto:""}],
        msj_id_aula_a:[{mensaje:"",color_texto:""}],
        msj_id_aula_b:[{mensaje:"",color_texto:""}],
        msj_id_inscripcion_a:[{mensaje:"",color_texto:""}],
        msj_id_inscripcion_b:[{mensaje:"",color_texto:""}],
        //// combo box
        lista_profesores: [],
        estadoBusquedaEstudiante: false,
        form_step: 0,
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

  async UNSAFE_componentWillMount(){
    let acessoModulo=await this.validarAccesoDelModulo("/dashboard/configuracion","/traslado-estudiantes")
    if(acessoModulo){

      const ruta_api=`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/grado/consultar-todos`,
      nombre_propiedad_lista_1="datos",
      propiedad_id_1="id_grado",
      propiedad_descripcion_1="numero_grado",
      propiedad_estado_1="estatus_grado"
      const grados = await this.consultarServidor(ruta_api,nombre_propiedad_lista_1,propiedad_id_1,propiedad_descripcion_1,propiedad_estado_1)

      if(grados.length === 0){
        alert("No hay Grados registrados (será redirigido a la vista anterior)")
        this.props.history.goBack()
      }else{
        const ruta_api_2=`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/aula/consultar-aula-por-grado/${grados[0].id}`,
        nombre_propiedad_lista_2="datos",
        propiedad_id_2="id_aula",
        propiedad_descripcion_2="nombre_aula",
        propiedad_estado_2="estatus_aula"
        const aulas = await this.consultarServidor(ruta_api_2,nombre_propiedad_lista_2,propiedad_id_2,propiedad_descripcion_2,propiedad_estado_2)

        if(aulas.length === 0){
          alert("No hay Secciones registradas(será redirigido a la vista anterior)")
          this.props.history.goBack()
        }
        aulas.unshift({id: "", descripcion: "Selecione una Sección"})
        grados.unshift({id: "", descripcion: "Selecione un Grado"})

        this.setState({
          listaGrados: grados,
          listaAulas: aulas,
          id_grado: "",
          id_aula_a: '',
          id_aula_b: '',
        })
      }

    }else{
        alert("No tienes acesso a este modulo(será redirigido a la vista anterior)")
        this.props.history.goBack()
    }
  }

  async ConsultarAulasPorGrado(a){
    let target = a.target;

    this.cambiarEstado(a)

    const ruta_api_2=`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/aula/consultar-aula-por-grado/${target.value}`,
    nombre_propiedad_lista_2="datos",
    propiedad_id_2="id_aula",
    propiedad_descripcion_2="nombre_aula",
    propiedad_estado_2="estatus_aula"
    const aulas = await this.consultarServidor(ruta_api_2,nombre_propiedad_lista_2,propiedad_id_2,propiedad_descripcion_2,propiedad_estado_2)

    if(aulas.length > 1){
      aulas.unshift({id: "", descripcion: "Selecione una Sección"})

      this.setState({
        listaAulas: aulas,
        id_aula_a: "",
        id_aula_b: "",
      })

      if(target.name == "id_grado_a") await this.consultarEstudiantes({lista:'a', id: aulas[1].id})
      else await this.consultarEstudiantes({lista:'b', id: aulas[1].id})
    }else{
      alert("No hay Suficientes secciones registradas en el Grado Seleccionado")
    }
  }

  async consultarAula(a){

    if(a.target.name === "id_aula_b" && a.target.value === this.state.id_aula_a){
      this.setState({id_aula_b: ""})
      alert("Debes de seleccionar un aula diferente")
    }else{
      this.cambiarEstado(a);
      if(a.target.name == "id_aula_a") await this.consultarEstudiantes({lista: 'a', id: a.target.value})
      else await this.consultarEstudiantes({lista: 'b', id: a.target.value})
    }
  }

  async consultarEstudiantes(datos){
    let idAula = datos.id;
    let name = datos.lista;

    if(!idAula){
      alert("No Existen aulas")
      return false;
    }

    await axiosCustom.get(`configuracion/inscripcion/consultar-estudiante/${idAula}`)
    .then( ({data}) => {

      if(data.estado_respuesta){
        this.consultarProfesor(datos)

        let estudianteLista = data.datos.map( item => {
          return {id: item.id_inscripcion, descripcion: `${item.codigo_cedula_escolar}-${item.cedula_escolar}`}
        })

        estudianteLista.unshift({id: "", descripcion: "Seleccione un estudiante"})

        let hashEstudiantes={}
        for(let estudiante of data.datos) hashEstudiantes[estudiante.id_inscripcion] = estudiante

        this.setState({
          [`listaEstudiantes_${name}`]: estudianteLista,
          [`hashEstudiantes_${name}`]: hashEstudiantes,
        })

        this.BuscarEstudiante({target:{ name: `id_inscripcion_${name}`, value: estudianteLista[0].id }})
      }else{
        alert("No hay Estudiantes en la Sección seleccionada");
      }

    })
    .catch( error => console.error(error))
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
          console.error("error al conectar con el servidor")
      })
  }

  async consultarServidor(ruta_api,nombre_propiedad_lista,propiedad_id,propiedad_descripcion,propiedad_estado){
      var respuesta_servidor=[]
      var lista=[]
      var mensaje={texto:"",estado:""}
      await axios.get(ruta_api)
      .then(respuesta=>{
          respuesta_servidor=respuesta.data
          if(respuesta_servidor.estado_respuesta){
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
              this.props.history.push(`/dashboard/transaccion/promocion${JSON.stringify(mensaje)}`)
          }
      })
      .catch(error=>{
          console.error(error)
      })
      return lista
  }

  formatoOptionSelect(lista,lista_vacia,propiedades){
      var veces=0
      while(veces < lista.length){
          if(lista[veces][propiedades.estado]==="1"){
              lista_vacia.push({id:lista[veces][propiedades.id],descripcion:lista[veces][propiedades.descripcion]})
          }
          veces+=1
      }
      return lista_vacia
  }

  async consultarProfesor(datos){
    let idAula = datos.id;
    let name = datos.lista;

    await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/inscripcion/consultar-aula-profesor/${idAula}`)
    .then( res => {

      let profesor = res.data.datos[0];
      this.setState({ [`datos_docente_${name}`]: `${profesor.id_cedula} ${profesor.nombres} ${profesor.apellidos}`});
    })
    .catch( err => console.error(err));
  }

  BuscarEstudiante(a){
    let letra;
    if(a.target.name == "id_inscripcion_a") letra = 'a'; else letra = 'b';

    let hashEstudiante = JSON.parse(JSON.stringify(this.state[`hashEstudiantes_${letra}`]));

    if(hashEstudiante[a.target.value]){
      if(letra == "b"){
        if(this.state.id_inscripcion_a !== a.target.value){
          this.cambiarEstado(a)
          this.setState({
            [`id_cedula_estudiante_${letra}`]: `${hashEstudiante[a.target.value].codigo_cedula_escolar}-${hashEstudiante[a.target.value].cedula_escolar}`,
            [`nombres_estudiante_${letra}`]: hashEstudiante[a.target.value].nombres_estudiante,
            [`apellidos_estudiante_${letra}`]: hashEstudiante[a.target.value].apellidos_estudiante,
            [`id_asignacion_aula_${letra}`]: hashEstudiante[a.target.value].id_asignacion_aula_profesor,
            estadoBusquedaEstudiante: true,
          });
        }else{
          this.setState({
            id_cedula_estudiante_b: "",
            id_inscripcion_b: "",
            nombres_estudiante_b: "",
            apellidos_estudiante_b: "",
          });

          alert("No se pude volver a seleccionar el mismo estudiante")
        }
      }else{

        this.cambiarEstado(a)
        this.setState({
          [`id_cedula_estudiante_${letra}`]: `${hashEstudiante[a.target.value].codigo_cedula_escolar}-${hashEstudiante[a.target.value].cedula_escolar}`,
          [`nombres_estudiante_${letra}`]: hashEstudiante[a.target.value].nombres_estudiante,
          [`apellidos_estudiante_${letra}`]: hashEstudiante[a.target.value].apellidos_estudiante,
          [`id_asignacion_aula_${letra}`]: hashEstudiante[a.target.value].id_asignacion_aula_profesor,
          estadoBusquedaEstudiante: true,
        });
      }
    }
    this.setState({ estadoBusquedaEstudiante: false});
  }

  cambiarEstadoDos(input){ this.setState({[input.name]:input.value}) }

  cambiarEstado(a){
    var input=a.target;
    this.setState({[input.name]:input.value})
  }

  async agregar(){
    var mensaje=this.state.mensaje
    mensaje.estado=""
    var mensaje_campo=[{mensaje:"",color_texto:""}]
    this.setState({
      id_grado: "",
      // ESTUDIANTE A
      id_inscripcion_a: "",
      id_aula_a: "",
      cedula_escolar_a: "",
      nombres_estudiante_a: "",
      apellidos_estudiante_a: "",
      datos_docente_a: "",
      id_asignacion_aula_a:"",
      // ESTUDIANTE B
      id_inscripcion_b: "",
      id_aula_b: "",
      cedula_escolar_b: "",
      nombres_estudiante_b: "",
      apellidos_estudiante_b: "",
      datos_docente_b: "",
      id_asignacion_aula_b:"",
      //
      listaGrados:[],
      listaAulas:[],
      listaEstudiantes_a:[],
      listaEstudiantes_b:[],
      hashEstudiantes_a:{},
      hashEstudiantes_b:{},
      //MSJ
      msj_id_grado:[{mensaje:"",color_texto:""}],
      msj_id_aula_a:[{mensaje:"",color_texto:""}],
      msj_id_aula_b:[{mensaje:"",color_texto:""}],
      msj_id_inscripcion_a:[{mensaje:"",color_texto:""}],
      msj_id_inscripcion_b:[{mensaje:"",color_texto:""}],
      //
      hashListaEstudiantes:{},
      selectEstudiantes:[],
    })

    this.props.history.push("/dashboard/configuracion/traslado-estudiantes")
  }


  validarSelect(name){

    const valor = this.state[name]
    let mensaje_campo = this.state["msj_"+name];

    if(valor !== "") mensaje_campo[0] = {mensaje: "", color_texto:"rojo"}
    else mensaje_campo[0] = {mensaje: "Debe de seleccionar una opción", color_texto:"rojo"}

    this.setState({["msj_"+name]:mensaje_campo})
    if(mensaje_campo[0].mensaje === "") return true; else return false;
  }

  validarFormulario(){
    const validaInscripcionA = this.validarSelect("id_inscripcion_a"),
    validaInscripcionB = this.validarSelect("id_inscripcion_b"),
    validaAulaA = this.validarSelect("id_aula_a"),validaAulaB = this.validarSelect("id_aula_b")

    if( validaInscripcionA, validaInscripcionB, validaAulaA, validaAulaB ) return {estado: true}
    else return {estado: false}
  }

  operacion(){
    $(".columna-modulo").animate({
      scrollTop: 0
    }, 1000)

    const mensajes={
      mensaje:"",
      id_grado: "",
      // ESTUDIANTE A
      id_inscripcion_a: "",
      id_aula_a: "",
      cedula_escolar_a: "",
      nombres_estudiante_a: "",
      apellidos_estudiante_a: "",
      datos_docente_a: "",
      id_asignacion_aula_a:"",
      // ESTUDIANTE B
      id_inscripcion_b: "",
      id_aula_b: "",
      cedula_escolar_b: "",
      nombres_estudiante_b: "",
      apellidos_estudiante_b: "",
      datos_docente_b: "",
      id_asignacion_aula_b:"",

      msj_id_grado:[{mensaje:"",color_texto:""}],
      msj_id_aula_a:[{mensaje:"",color_texto:""}],
      msj_id_aula_b:[{mensaje:"",color_texto:""}],
      msj_id_inscripcion_a:[{mensaje:"",color_texto:""}],
      msj_id_inscripcion_b:[{mensaje:"",color_texto:""}],

      form_step: 0,
    }

    const estado_validar_formulario=this.validarFormulario()

    if(estado_validar_formulario.estado){
      this.enviarDatos(estado_validar_formulario,(objeto)=>{
        const mensaje =this.state.mensaje
        var respuesta_servidor=""
        axios.put(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/inscripcion/cambiar/${this.state.id_inscripcion_a}`,objeto.estudiante_1)
          .then(respuesta=>{
            respuesta_servidor=respuesta.data
            mensaje.texto=respuesta_servidor.mensaje
            mensaje.estado=respuesta_servidor.estado_respuesta
            mensaje.color_alerta = respuesta_servidor.color_alerta
            this.setState(mensaje)
          })
          .catch(error=>{
            mensaje.texto = "No se puedo conectar con el servidor"
            mensaje.estado = false
            mensaje.color_alerta = "danger";
            this.setState(mensaje)
          })

        axios.put(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/inscripcion/cambiar/${this.state.id_inscripcion_b}`,objeto.estudiante_2)
          .then(respuesta=>{
              respuesta_servidor=respuesta.data
              mensaje.texto=respuesta_servidor.mensaje
              mensaje.estado=respuesta_servidor.estado_respuesta
              mensaje.color_alerta = respuesta_servidor.color_alerta
              this.setState(mensaje)
          })
          .catch(error=>{
              mensaje.texto = "No se puedo conectar con el servidor"
              mensaje.estado = false
              mensaje.color_alerta = "danger";
              this.setState(mensaje)
          })
        this.setState(mensajes)
      })
    }
  }

  enviarDatos(estado_validar_formulario,petion){
      const token=localStorage.getItem('usuario')
      const objeto={
        estudiante_1:{
          cambio:{
            id_inscripcion: this.state.id_inscripcion_a,
            id_asignacion_aula_profesor: this.state.id_asignacion_aula_b,
          },
          token:token
        },
        estudiante_2:{
          cambio:{
            id_inscripcion: this.state.id_inscripcion_b,
            id_asignacion_aula_profesor: this.state.id_asignacion_aula_a,
          },
          token:token
        }
      }
      petion(objeto)
  }

  validaEstudianteA(){
    const validaInscripcionA = this.validarSelect("id_inscripcion_a"),validaAulaA = this.validarSelect("id_aula_a")

    if( validaInscripcionA && validaAulaA ) return true
    else return false
  }

  validaEstudianteB(){
    const validaInscripcionB = this.validarSelect("id_inscripcion_b"),validaAulaB = this.validarSelect("id_aula_b")

    if( validaInscripcionB && validaAulaB ) return true
    else return false
  }

  traslado(){
    let num = parseInt(this.state.form_step) + 1;

    if(num === 1){

      if(this.validaEstudianteA()) this.setState({form_step: num})
    }else if(num === 2){

      if(this.validaEstudianteB()) this.setState({form_step: num})
    }
  }

  atras(){
    let num = parseInt(this.state.form_step) - 1;
    this.setState({form_step: num})
  }

  regresar(){ this.props.history.push("/dashboard"); }

  render(){
    let jsx_traslado_form;

    if(this.state.form_step == 0){
      jsx_traslado_form=(
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
                          <span className="titulo-form-trabajador">Traslado de estudiantes</span>
                      </div>
                  </div>
                  <form id="form_trabajador">
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
                    <div className="row mt-3">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                            <span className="sub-titulo-form-reposo-trabajador">Datos de la Sección (A) </span>
                        </div>
                    </div>
                    <div className="row justify-content-center mx-auto my-2">
                      <ComponentFormSelect
                      clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                      obligatorio="si"
                      mensaje={this.state.msj_id_grado}
                      nombreCampoSelect="Grados:"
                      clasesSelect="custom-select"
                      name="id_grado"
                      id="id_grado"
                      eventoPadre={this.ConsultarAulasPorGrado}
                      defaultValue={this.state.id_grado}
                      option={this.state.listaGrados}
                      />
                      <ComponentFormSelect
                      clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                      obligatorio="si"
                      mensaje={this.state.msj_id_aula_a[0]}
                      nombreCampoSelect="Sección (A):"
                      clasesSelect="custom-select"
                      name="id_aula_a"
                      id="id_aula_a"
                      eventoPadre={this.consultarAula}
                      defaultValue={this.state.id_aula_a}
                      option={this.state.listaAulas}
                      />
                    <ComponentFormCampo clasesColumna="col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5"
                          clasesCampo="form-control" obligatorio="si" mensaje={[]}
                          nombreCampo="Datos del docente:" activo="no" type="text" value={this.state.datos_docente_a}
                          name="datos_docente_a" id="datos_docente_a" placeholder="Datos del docente"
                        />
                    </div>
                    <div className="row mt-3">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                            <span className="sub-titulo-form-reposo-trabajador">Datos del estudiante (A)</span>
                        </div>
                    </div>
                    <div className="row justify-content-center mx-auto my-2">
                      <ComponentFormSelect
                      clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                      obligatorio="si"
                      mensaje={this.state.msj_id_inscripcion_a[0]}
                      nombreCampoSelect="Estudiante:"
                      clasesSelect="custom-select"
                      name="id_inscripcion_a"
                      id="id_inscripcion_a"
                      eventoPadre={this.BuscarEstudiante}
                      defaultValue={this.state.id_inscripcion_a}
                      option={this.state.listaEstudiantes_a}
                      />
                      <div className='col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5'>
                          <label>Nombre del estudiante: {this.state.nombres_estudiante_a}</label><br></br>
                          <label>Apellido del estudiante: {this.state.apellidos_estudiante_a}</label>
                      </div>
                    </div>

                      <div className="row justify-content-center">
                        <div className="col-auto">
                          <InputButton
                            clasesBoton="btn btn-success"
                            id="boton-actualizar"
                            value="Continuar"
                            eventoPadre={this.traslado}
                          />
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
    }else if(this.state.form_step == 1){
      jsx_traslado_form=(
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
                        <span className="titulo-form-trabajador">Traslado de estudiantes</span>
                    </div>
                </div>
                <form id="form_trabajador">
                  <div className="row mt-3">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                          <span className="sub-titulo-form-reposo-trabajador">Datos de la Sección (B) </span>
                      </div>
                  </div>
                  <div className="row justify-content-center mx-auto my-2">
                    <ComponentFormCampo clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                      clasesCampo="form-control" obligatorio="si" mensaje={[]}
                      nombreCampo="Grado:" activo="no" type="text" value={this.state.id_grado}
                      name="grado_b" id="grado_b" placeholder="Datos del docente"
                    />
                    <ComponentFormSelect
                    clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                    obligatorio="si"
                    mensaje={this.state.msj_id_aula_b[0]}
                    nombreCampoSelect="Sección (B):"
                    clasesSelect="custom-select"
                    name="id_aula_b"
                    id="id_aula_b"
                    eventoPadre={this.consultarAula}
                    defaultValue={this.state.id_aula_b}
                    option={this.state.listaAulas}
                    />
                  <ComponentFormCampo clasesColumna="col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5"
                        clasesCampo="form-control" obligatorio="si" mensaje={[]}
                        nombreCampo="Datos del docente:" activo="no" type="text" value={this.state.datos_docente_b}
                        name="datos_docente_b" id="datos_docente_b" placeholder="Datos del docente"
                      />
                  </div>
                  <div className="row mt-3">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                          <span className="sub-titulo-form-reposo-trabajador">Datos del estudiante (B)</span>
                      </div>
                  </div>
                  <div className="row justify-content-center mx-auto my-2">
                    <ComponentFormSelect
                    clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                    obligatorio="si"
                    mensaje={this.state.msj_id_inscripcion_b[0]}
                    nombreCampoSelect="Estudiante:"
                    clasesSelect="custom-select"
                    name="id_inscripcion_b"
                    id="id_inscripcion_b"
                    eventoPadre={this.BuscarEstudiante}
                    defaultValue={this.state.id_inscripcion_b}
                    option={this.state.listaEstudiantes_b}
                    />
                    <div className='col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5'>
                        <label>Nombre del estudiante: {this.state.nombres_estudiante_b}</label><br></br>
                        <label>Apellido del estudiante: {this.state.apellidos_estudiante_b}</label>
                    </div>
                  </div>



                    <div className="row justify-content-center">
                        <div className="col-auto">
                          <InputButton
                            clasesBoton="btn btn-success"
                            id="boton-actualizar"
                            value="Confirmar"
                            eventoPadre={this.traslado}
                          />
                        </div>
                        <div className="col-auto">
                          <InputButton
                            clasesBoton="btn btn-primary"
                            id="boton-atras"
                            value="Atrás"
                            eventoPadre={this.atras}
                          />
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
    }else if(this.state.form_step == 2){
      jsx_traslado_form=(
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
                        <span className="titulo-form-trabajador">Traslado de estudiantes</span>
                    </div>
                </div>
                <form id="form_trabajador">
                  <div className="row mt-3">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                          <span className="sub-titulo-form-reposo-trabajador">Datos del estudiante (A)</span>
                      </div>
                  </div>
                  <div className="row justify-content-center mx-auto my-2">
                    <ComponentFormCampo clasesColumna="col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5"
                      clasesCampo="form-control" obligatorio="si" mensaje={[]}
                      nombreCampo="Cédula escolar:" activo="no" type="text" value={this.state.id_cedula_estudiante_a}
                      name="id_cedula_estudiante_a" id="id_cedula_estudiante_a" placeholder="Datos del estudiante"
                    />
                    <div className='col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5'>
                      <label>Nombre del estudiante: <span className='font-weight-bold'>{this.state.nombres_estudiante_a}</span></label><br></br>
                     <label>Apellido del estudiante: <span className='font-weight-bold'>{this.state.apellidos_estudiante_a}</span></label>
                    </div>
                  </div>

                  <div className="row justify-content-center mx-auto my-2">
                    <ComponentFormCampo clasesColumna="col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5"
                      clasesCampo="form-control" obligatorio="si" mensaje={[]}
                      nombreCampo="Sección origen:" activo="no" type="text" value={this.state.listaAulas.filter( aula => aula.id == this.state.id_aula_a)[0].descripcion}
                      name="id_aula_a" id="id_aula_a" placeholder="aula"
                    />

                    <ComponentFormCampo clasesColumna="col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5"
                      clasesCampo="form-control" obligatorio="si" mensaje={[]}
                      nombreCampo="Sección Destino:" activo="no" type="text" value={this.state.listaAulas.filter( aula => aula.id == this.state.id_aula_b)[0].descripcion}
                      name="id_aula_b" id="id_aula_b" placeholder="aula"
                    />
                  </div>

                  <div className="row mt-3">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                          <span className="sub-titulo-form-reposo-trabajador">Datos del estudiante (B)</span>
                      </div>
                  </div>

                  <div className="row justify-content-center mx-auto my-2">
                    <ComponentFormCampo clasesColumna="col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5"
                      clasesCampo="form-control" obligatorio="si" mensaje={[]}
                      nombreCampo="Cédula escolar:" activo="no" type="text" value={this.state.id_cedula_estudiante_b}
                      name="id_cedula_estudiante_b" id="id_cedula_estudiante_b" placeholder="Datos del estudiante"
                    />
                    <div className='col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5'>
                      <label>Nombre del estudiante: <span className='font-weight-bold'>{this.state.nombres_estudiante_b}</span></label><br></br>
                      <label>Apellido del estudiante: <span className='font-weight-bold'>{this.state.apellidos_estudiante_b}</span></label>
                    </div>
                  </div>
                  <div className="row justify-content-center mx-auto my-2">
                    <ComponentFormCampo clasesColumna="col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5"
                      clasesCampo="form-control" obligatorio="si" mensaje={[]}
                      nombreCampo="Sección origen:" activo="no" type="text" value={this.state.listaAulas.filter( aula => aula.id == this.state.id_aula_b)[0].descripcion}
                      name="id_aula_a" id="id_aula_a" placeholder="aula"
                    />

                    <ComponentFormCampo clasesColumna="col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5"
                      clasesCampo="form-control" obligatorio="si" mensaje={[]}
                      nombreCampo="Sección Destino:" activo="no" type="text" value={this.state.listaAulas.filter( aula => aula.id == this.state.id_aula_a)[0].descripcion}
                      name="id_aula_b" id="id_aula_b" placeholder="aula"
                    />
                  </div>

                    <div className="row justify-content-center">
                        <div className="col-auto">
                          <InputButton
                            clasesBoton="btn btn-warning"
                            id="boton-actualizar"
                            value="Confirmar intercambio"
                            eventoPadre={this.operacion}
                          />
                        </div>
                        <div className="col-auto">
                          <InputButton
                            clasesBoton="btn btn-primary"
                            id="boton-atras"
                            value="Atrás"
                            eventoPadre={this.atras}
                          />
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
    }


    return(
        <div className="component_trabajador_form">
          <ComponentDashboard
          componente={jsx_traslado_form}
          modulo={this.state.modulo}
          eventoPadreMenu={this.mostrarModulo}
          estado_menu={this.state.estado_menu}
          />
        </div>
    )
  }
}

export default withRouter(ComponentCambioAulaForm)
