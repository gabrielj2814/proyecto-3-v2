// id_cedula_representante char(8),
// nombre_representante varchar(150),
// apellidos_representante varchar(150),
// fecha_nacimiento_representante date,
// nivel_instruccion_representante varchar(150),
// ocupacion_representante varchar(2000),
// direccion_representante varchar(3000),
// id_ciudad varchar(6),
// telefono_movil_representante varchar(11)
// telefono_local_representante varchar(11)
// numero_hijos_representante varchar(2),
// constitucion_familiar_representante varchar(150),
// ingresos_representante varchar(10),
// tipo_vivienda_representante char(1),
//
// numero_estudiante_inicial_representante varchar(2),
// numero_estudiante_grado_1_representante varchar(2),
// numero_estudiante_grado_2_representante varchar(2),
// numero_estudiante_grado_3_representante varchar(2),
// numero_estudiante_grado_4_representante varchar(2),
// numero_estudiante_grado_5_representante varchar(2),
// numero_estudiante_grado_6_representante varchar(2),
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

class ComponentRepresentanteConsulta extends React.Component{
  constructor(){
    super();
    this.state={
        modulo:"",// modulo menu
        estado_menu:false,
        //formulario
        id_cedula: "",
        nombres: "",
        apellidos: "",
        fecha_nacimiento: "",
        nivel_instruccion: "",
        ocupacion: "",
        direccion: "",
        id_estado:"",
        id_ciudad:"",
        telefono_movil_representante: "",
        telefono_local_representante: "",
        numero_hijos_representante: "",
        constitucion_familiar_representante: "",
        ingresos_representante: "",
        tipo_vivienda_representante: "",
        sexo_representante:"1",
        estatus_representante:"1",
        ////parametros de modulos relacionados
        descripcion_tipo_trabajador:"",
        nombre_perfil:"",
        funcion_descripcion:"",
        estatu_cuenta:"",
        mensaje:{
            texto:"",
            estado:""
          }
    }
  }

  async UNSAFE_componentWillMount(){
      let acessoModulo=await this.validarAccesoDelModulo("/dashboard/configuracion","/representante")
      if(acessoModulo){
          const id=this.props.match.params.id
          await this.consultarEstudiante(id)
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

  async consultarRepresentante(id){
    let mensaje =""
    const token=localStorage.getItem('usuario')
    let fechaServidor=Moment(this.state.fechaServidor,"YYYY-MM-DD")
    // /${token}
    return await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/representante/consultar/${id}`)
    .then(respuesta=>{
        let respuesta_servidor=respuesta.data
        if(respuesta_servidor.estado_respuesta=== true){
          return respuesta_servidor.datos[0]
        }
        else if(respuesta_servidor.estado_respuesta===false){
            mensaje.texto=respuesta_servidor.mensaje
            mensaje.estado=respuesta_servidor.estado_peticion
            this.props.history.push(`/dashboard/configuracion/representante${JSON.stringify(mensaje)}`)
        }
    })
    .catch(error=>{
        console.log(error)
        mensaje.texto="No se puedo conectar con el servidor"
        mensaje.estado="500"
        this.props.history.push(`/dashboard/configuracion/representante${JSON.stringify(mensaje)}`)
    })
      // let edadTrabajador=(parseInt(fechaServidor.diff(Moment(this.state.fecha_nacimiento).format("YYYY-MM-DD"),"years"))>=18)?fechaServidor.diff(Moment(this.state.fecha_nacimiento).format("YYYY-MM-DD"),"years"):null
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

  actualizar(){
      this.props.history.push("/dashboard/configuracion/representante/actualizar/"+this.props.match.params.id);
  }

  regresar(){
      this.props.history.push("/dashboard/configuracion/representante");
  }

  render(){
    var jsx_representante_consulta=(
        <div className="row justify-content-center">
           <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_trabajador_consulta">
                <div className="row justify-content-center">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-trabajador-consulta">
                        <span className="titulo-trabajador-consulta">Representante Consultado: {this.state.nombres+" "+this.state.apellidos}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Cédula escolar: </span>
                        <span className="valor">{this.state.id_cedula_escolar}</span>
                    </div>
                </div>
                { this.state.id_cedula != "" &&
                  <div className="row">
                      <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                          <span className="propiedad">Cédula del estudiante: </span>
                          <span className="valor">{this.state.id_cedula}</span>
                      </div>
                  </div>
                }
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Nombre: </span>
                        <span className="valor">{this.state.nombres}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Apellido: </span>
                        <span className="valor">{this.state.apellidos}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Fecha de Nacimiento: </span>
                        <span className="valor">{this.state.fecha_nacimiento}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Direccion de nacimiento: </span>
                        <span className="valor">{this.state.direccion_nacimiento}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Escolaridad: </span>
                        <span className="valor">{this.state.escolaridad}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">El estudiante vive con: </span>
                        <span className="valor">{this.state.vive_con}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Procedencia del estudiante: </span>
                        <span className="valor">{this.state.procedencia}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Estatus Trabajador: </span>
                        <span className="valor">{this.state.estatu_estudiante}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Sexo del estudiante: </span>
                        <span className="valor">{this.state.sexo_estudiante}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Ciudad: </span>
                        <span className="valor">{ this.state.id_ciudad}</span>
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
    );

    return (
      <div className="component_trabajador_consulta">
          <ComponentDashboard
          componente={jsx_representante_consulta}
          modulo={this.state.modulo}
          eventoPadreMenu={this.mostrarModulo}
          estado_menu={this.state.estado_menu}
          />
      </div>
    )
  }
}
