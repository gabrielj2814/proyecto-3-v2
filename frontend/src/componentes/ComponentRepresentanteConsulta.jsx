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
    this.mostrarModulo=this.mostrarModulo.bind(this);
    this.regresar=this.regresar.bind(this);
    this.actualizar=this.actualizar.bind(this)
    this.state={
        modulo:"",// modulo menu
        estado_menu:false,
        //formulario
        id_cedula_representante : "",
        nombre_representante: "",
        apellidos_representante: "",
        estatus_representante:"1",
        fecha_nacimiento_representante: "",
        nivel_instruccion_representante: "",
        ocupacion_representante: "",
        direccion_representante: "",
        nombre_ciudad: "",
        telefono_movil_representante: "",
        telefono_local_representante: "",
        numero_hijos_representante: "",
        constitucion_familiar_representante: "",
        ingresos_representante: "",
        tipo_vivienda_representante : "",
        numero_estudiante_inicial_representante: "",
        numero_estudiante_grado_1_representante: "",
        numero_estudiante_grado_2_representante: "",
        numero_estudiante_grado_3_representante: "",
        numero_estudiante_grado_4_representante: "",
        numero_estudiante_grado_5_representante: "",
        numero_estudiante_grado_6_representante: "",
        ////parametros de modulos relacionados
        descripcion_tipo_trabajador:"",
        nombre_perfil:"",
        funcion_descripcion:"",
        estatu_cuenta:"",
        tipo_viviendas:[
          {id:"1",descripcion:"Rancho"},
          {id:"2",descripcion:"Casa"},
          {id:"3",descripcion:"Quinta"},
          {id:"4",descripcion:"Apartamento"},
          {id:"5",descripcion:"Alquilada"}
        ],
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
          await this.consultarRepresentante(id)
      }
      else{
          alert("no tienes acesso a este modulo(sera redirigido a la vista anterior)")
          this.props.history.goBack()
      }

  }

  async validarAccesoDelModulo(modulo,subModulo){
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
    let mensaje = {}
    const token=localStorage.getItem('usuario')
    let fechaServidor=Moment(this.state.fechaServidor,"YYYY-MM-DD")
    // /${token}
    return await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/representante/consultar/${id}`)
    .then(respuesta=>{
        let respuesta_servidor=respuesta.data
        if(respuesta_servidor.estado_respuesta=== true){
          console.log(respuesta_servidor.datos)
          let results = respuesta_servidor.datos[0]

          this.setState({
            id_cedula_representante : results.id_cedula_representante,
            nombre_representante: results.nombres_representante,
            apellidos_representante: results.apellidos_representante,
            estatus_representante:(results.estatus_representante === "1") ? "Activo" : "Inactivo",
            fecha_nacimiento_representante: Moment(results.fecha_nacimiento_representante).format("DD/MM/YYYY"),
            nivel_instruccion_representante: results.nivel_instruccion_representante,
            ocupacion_representante: results.ocupacion_representante,
            direccion_representante: results.direccion_representante,
            nombre_ciudad: results.nombre_ciudad,
            telefono_movil_representante: results.telefono_movil_representante,
            telefono_local_representante: results.telefono_local_representante,
            numero_hijos_representante: results.numero_hijos_representante,
            constitucion_familiar_representante: results.constitucion_familiar_representante,
            ingresos_representante: results.ingresos_representante,
            tipo_vivienda_representante : this.state.tipo_viviendas.filter( e => e.id === results.tipo_vivienda_representante)[0].descripcion,
            numero_estudiante_inicial_representante: results.numero_estudiante_inicial_representante,
            numero_estudiante_grado_1_representante: results.numero_estudiante_grado_1_representante,
            numero_estudiante_grado_2_representante: results.numero_estudiante_grado_2_representante,
            numero_estudiante_grado_3_representante: results.numero_estudiante_grado_3_representante,
            numero_estudiante_grado_4_representante: results.numero_estudiante_grado_4_representante,
            numero_estudiante_grado_5_representante: results.numero_estudiante_grado_5_representante,
            numero_estudiante_grado_6_representante: results.numero_estudiante_grado_6_representante,
          })
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
                        <span className="titulo-trabajador-consulta">Representante Consultado: {this.state.nombre_representante+" "+this.state.apellidos_representante}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Cédula: </span>
                        <span className="valor">{this.state.id_cedula_representante}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Nombre: </span>
                        <span className="valor">{this.state.nombre_representante}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Apellido: </span>
                        <span className="valor">{this.state.apellidos_representante}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Fecha de Nacimiento: </span>
                        <span className="valor">{this.state.fecha_nacimiento_representante}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Direccion: </span>
                        <span className="valor">{this.state.direccion_representante}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Telefono movil: </span>
                        <span className="valor">{this.state.telefono_movil_representante}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Telefono local: </span>
                        <span className="valor">{this.state.telefono_local_representante}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Estatus representante: </span>
                        <span className="valor">{this.state.estatus_representante}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Ocupacion: </span>
                        <span className="valor">{this.state.ocupacion_representante}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Grado de instruccion: </span>
                        <span className="valor">{this.state.nivel_instruccion_representante}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Ingresos del representante: </span>
                        <span className="valor">{this.state.ingresos_representante}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Tipo de vivienda: </span>
                        <span className="valor">{this.state.tipo_vivienda_representante}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Ciudad: </span>
                        <span className="valor">{ this.state.nombre_ciudad}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Constitucion familiar: </span>
                        <span className="valor">{ this.state.constitucion_familiar_representante}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Numero de hijos del representante: </span>
                        <span className="valor">{ this.state.numero_hijos_representante}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Numero de estudiantes en inicial: </span>
                        <span className="valor">{ this.state.numero_estudiante_inicial_representante}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Numero de estudiantes en primer grado: </span>
                        <span className="valor">{ this.state.numero_estudiante_grado_1_representante}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Numero de estudiantes en segundo grado: </span>
                        <span className="valor">{ this.state.numero_estudiante_grado_2_representante}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Numero de estudiantes en tercer grado: </span>
                        <span className="valor">{ this.state.numero_estudiante_grado_3_representante}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Numero de estudiantes en cuarto grado: </span>
                        <span className="valor">{ this.state.numero_estudiante_grado_4_representante}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Numero de estudiantes en quinto grado: </span>
                        <span className="valor">{ this.state.numero_estudiante_grado_5_representante}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="propiedad">Numero de estudiantes en sexto grado: </span>
                        <span className="valor">{ this.state.numero_estudiante_grado_6_representante}</span>
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
export default withRouter(ComponentRepresentanteConsulta)
