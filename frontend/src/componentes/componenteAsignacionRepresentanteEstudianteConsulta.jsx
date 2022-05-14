import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentTrabajadorConsulta.css'
//JS
import axios from 'axios'
import Moment from 'moment'
// IP servidor
import servidor from '../ipServer.js'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'

class ComponentAsignacionRepresentanteEstudianteConsulta extends React.Component{
  constructor(){
    super();
    this.mostrarModulo=this.mostrarModulo.bind(this);
    this.regresar=this.regresar.bind(this);
    this.actualizar=this.actualizar.bind(this)
    this.consultarRegistros = this.consultarRegistros.bind(this);
    this.state = {
      modulo:"",// modulo menu
      estado_menu:false,
      //formulario
      id_asignacion_representante_estudiante: null,
      id_estudiante: "",
      id_cedula_representante: "",
      nombre_representante: "",
      apellidos_representante:"",
      nombres_estudiante: "",
      apellidos_estudiante: "",
      tipo_representante: "",
      parentesco: "",
      numero_representante: 0,
      estatus_asignacion_representante_estudiante:"1",
      ////parametros de modulos relacionados
      descripcion_tipo_trabajador:"",
      nombre_perfil:"",
      funcion_descripcion:"",
      estatu_cuenta:"",
      mensaje:{
        texto:"",
        estado:""
      },
      tipos_representantes:[
        {id: "M", descripcion: "Mama"},
        {id: "P", descripcion: "Papa"},
        {id: "O", descripcion: "Otro representante"}
      ],
    }
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

  async UNSAFE_componentWillMount(){
      let acessoModulo=await this.validarAccesoDelModulo("/dashboard/transaccion","/asignacion-representante-estudiante")
      if(acessoModulo){
          const id=this.props.match.params.id
          await this.consultarRegistros(id)
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

  async consultarRegistros(id){
    var mensaje={texto:"",estado:""},
    respuesta_servidor=""
    const token=localStorage.getItem('usuario')

    await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/asignacion-representante-estudiante/consultar/${id}`)
    .then( respuesta => {
      let respuesta_servidor=respuesta.data
      if(respuesta_servidor.estado_respuesta=== true){
        
        this.setState({
          id_asignacion_representante_estudiante: respuesta_servidor.datos[0].id_asignacion_representante_estudiante,
          id_estudiante: respuesta_servidor.datos[0].id_estudiante,
          id_cedula_representante: respuesta_servidor.datos[0].id_cedula_representante,
          nombre_representante: respuesta_servidor.datos[0].nombres_representante,
          apellidos_representante: respuesta_servidor.datos[0].apellidos_representante,
          nombres_estudiante: respuesta_servidor.datos[0].nombres_estudiante,
          apellidos_estudiante: respuesta_servidor.datos[0].apellidos_estudiante,
          tipo_representante: this.state.tipos_representantes.filter( e => e.id === respuesta_servidor.datos[0].tipo_representante )[0].descripcion,
          parentesco: respuesta_servidor.datos[0].parentesco,
          numero_representante: respuesta_servidor.datos[0].numero_representante,
          estatus_asignacion_representante_estudiante: (respuesta_servidor.datos[0].estatus_asignacion_representante_estudiante === "1") ? "Activo" : "Inactivo",
        })
      }
      else if(respuesta_servidor.estado_respuesta===false){
          mensaje.texto=respuesta_servidor.mensaje
          mensaje.estado=respuesta_servidor.estado_peticion
          this.props.history.push(`/dashboard/configuracion/asignacion-representante-estudiante${JSON.stringify(mensaje)}`)
      }
    })
    .catch(error=>{
        console.log(error)
        mensaje.texto="No se puedo conectar con el servidor"
        mensaje.estado="500"
        this.props.history.push(`/dashboard/configuracion/asignacion-representante-estudiante${JSON.stringify(mensaje)}`)
    })
  }

  actualizar(){ this.props.history.push("/dashboard/transaccion/asignacion-representante-estudiante/actualizar/"+this.props.match.params.id); }
  regresar(){ this.props.history.push("/dashboard/transaccion/asignacion-representante-estudiante"); }

  render(){
      var jsx_asignacion_consulta=(
          <div className="row justify-content-center">
             <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_trabajador_consulta">
                  <div className="row justify-content-center">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-trabajador-consulta">
                          <span className="titulo-trabajador-consulta">Consulta de asignacion representante-estudiante</span>
                      </div>
                  </div>
                  <div className="row">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                          <span className="propiedad">Id de la asignacion: </span>
                          <span className="valor font-weight-bold">{this.state.id_asignacion_representante_estudiante}</span>
                      </div>
                  </div>
                  <div className="row">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                          <span className="propiedad">Id del estudiante: </span>
                          <span className="valor font-weight-bold">{this.state.id_estudiante}</span>
                      </div>
                  </div>
                  <div className="row">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                          <span className="propiedad">Nombre del estudiante: </span>
                          <span className="valor font-weight-bold">{this.state.nombres_estudiante}</span>
                      </div>
                  </div>
                  <div className="row">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                          <span className="propiedad">Apellido del estudiante: </span>
                          <span className="valor font-weight-bold">{this.state.apellidos_estudiante}</span>
                      </div>
                  </div>
                  <div className="row">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                          <span className="propiedad">Cedula del representante: </span>
                          <span className="valor font-weight-bold">{this.state.id_cedula_representante}</span>
                      </div>
                  </div>
                  <div className="row">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                          <span className="propiedad">Nombre del representante: </span>
                          <span className="valor font-weight-bold">{this.state.nombre_representante}</span>
                      </div>
                  </div>
                  <div className="row">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                          <span className="propiedad">Apellido del representante: </span>
                          <span className="valor font-weight-bold">{this.state.apellidos_representante}</span>
                      </div>
                  </div>
                  <div className="row">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                          <span className="propiedad">Tipo de representante: </span>
                          <span className="valor font-weight-bold">{this.state.tipo_representante}</span>
                      </div>
                  </div>
                  <div className="row">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                          <span className="propiedad">Parentesco: </span>
                          <span className="valor font-weight-bold">{this.state.parentesco}</span>
                      </div>
                  </div>
                  <div className="row">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                          <span className="propiedad">Numer de representante: </span>
                          <span className="valor font-weight-bold">{this.state.numero_representante}</span>
                      </div>
                  </div>
                  <div className="row">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                          <span className="propiedad">Estatus de la asignacion: </span>
                          <span className="valor font-weight-bold">{this.state.estatus_asignacion_representante_estudiante}</span>
                      </div>
                  </div>
                  <div className="row justify-content-center">
                      <div className="col-auto">
                          <InputButton
                          clasesBoton="btn btn-warning"
                          id="boton-actualizar"
                          value="Actualizar"
                          eventoPadre={this.actualizar}
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
              </div>
          </div>
      )
      return(
          <div className="component_trabajador_consulta">
              <ComponentDashboard
              componente={jsx_asignacion_consulta}
              modulo={this.state.modulo}
              eventoPadreMenu={this.mostrarModulo}
              estado_menu={this.state.estado_menu}
              />
          </div>
      )
  }
}

export default  withRouter(ComponentAsignacionRepresentanteEstudianteConsulta)
