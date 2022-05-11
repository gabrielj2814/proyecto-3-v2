import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentProfesorFormulario.css'
//JS
import axios from 'axios'
import $ from 'jquery'
// IP servidor
import servidor from '../ipServer.js'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import AlertBootstrap from "../subComponentes/alertBootstrap"
import InputButton from '../subComponentes/input_button'
import ComponentFormCampo from '../subComponentes/componentFormCampo';
import ComponentFormSelect from '../subComponentes/componentFormSelect';
import ComponentFormRadioState from '../subComponentes/componentFormRadioState';


const axiosCustom=axios.create({
    baseURL:`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/`
})

class ComponentEspecialistaForm extends React.Component {

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this)
        this.cambiarEstado=this.cambiarEstado.bind(this)
        this.operacion=this.operacion.bind(this)
        this.regresar=this.regresar.bind(this)
        this.cambiarEstadoDos = this.cambiarEstadoDos.bind(this);
        this.validarTexto = this.validarTexto.bind(this);
        this.validarRadio = this.validarRadio.bind(this);
        this.validarSelect = this.validarSelect.bind(this);
        this.validarCampoNumero = this.validarCampoNumero.bind(this);
        this.validarCampo = this.validarCampo.bind(this)
        this.state={
            modulo:"",
            estado_menu:false,
            // formulario
            id_especialista: "",
            id_cedula: "",
            especialidad: "",
            estatus_especialista: "1",
            selectTrabajadores:[],
            //
            msj_id_cedula: [{ mensaje:"", color_texto:""}],
            msj_especialidad: [{ mensaje:"", color_texto:""}],
            //
            alerta:{
                color:null,
                mensaje:null,
                estado:false
            },
            StringExprecion: /[A-Za-z]|[0-9]/
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

    async componentWillMount(){
        let acessoModulo=await this.validarAccesoDelModulo("/dashboard/configuracion","/profesor")
        if(acessoModulo){
            const {operacion}=this.props.match.params
            await this.consultarTrabajadores()
            if(operacion==="actualizar"){
                await this.consultarEspecialista(this.props.match.params.id)
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

    async consultarEspecialista(id){
        const token=localStorage.getItem('usuario')
        await axiosCustom.get(`configuracion/especialista/consultar/${id}/${token}`)
        .then(respuesta => {
            let json=JSON.parse(JSON.stringify(respuesta.data))
            if(json.datos.length > 0){
                this.setState({
                  id_especialista: json.datos.id_especialista,
                  id_cedula: json.datos.id_cedula,
                  especialidad: json.datos.especialidad,
                  estatus_especialista: json.datos.estatus_especialista,
                })
            }
            else{
                alert("el registro que intento consultar no se encuentra en la base de datos")
            }
        })
        .catch(error => {
            console.error("error al conectar con el servidor")
        })
    }

    async consultarTrabajadores(){
        await axiosCustom.get(`configuracion/trabajador/consultar-todos`)
        .then(respuesta => {
            let json=JSON.parse(JSON.stringify(respuesta.data))
            let select = [{id: "", descripcion: "Seleccione un trabajador"}];
            for(let item of json.trabajadores){
              select.push({id: item.id_cedula, descripcion: `${item.nombres} ${item.apellidos}`})
            }
            this.setState({selectTrabajadores:select})
        })
        .catch(error => {
            console.error("error al conectar con el servidor")
        })
    }

    cambiarEstado(a){
        var input=a.target;
        this.setState({[input.name]:input.value})
    }

    extrarDatosDelFormData(formData){
        let json={}
        let iterador = formData.entries()
        let next= iterador.next();
        while(!next.done){
            json[next.value[0]]=next.value[1]
            next=iterador.next()
        }
        return json
    }

    validarComboTrabajador(){
        let estado=false
        if(this.state.listaTrabajadores.length>0){
            estado=true
        }
        return estado
    }

    validarCampo(nombre_campo){
        var estado=false

        const valor=this.state[nombre_campo]
        let msj = this.state["msj_"+nombre_campo]

        if(valor!==""){
          if(this.state.StringExprecion.test(valor)){
            estado=true
            msj[0] = {mensaje: "",color_texto:"rojo"}
            this.setState({["msj_"+nombre_campo]:msj})
          }else{
            msj[0] = {mensaje: "este campo solo permite letras",color_texto:"rojo"}
            this.setState({["msj_"+nombre_campo]:msj})
          }
        }else{
          msj[0] = {mensaje: "Este campo no puede estar vacio",color_texto:"rojo"}
          this.setState({["msj_"+nombre_campo]:msj})
        }
        return estado
    }

    validarCampoNumero(nombre_campo){
        var estado=false
        const campo=this.state[nombre_campo],
        exprecion=/\d$/,
        exprecion_2=/\s/
        var mensaje_campo=this.state["msj_"+nombre_campo]
        if(campo!==""){
            if(!exprecion_2.test(campo)){
                if(exprecion.test(campo)){
                    estado=true
                    mensaje_campo[0]={mensaje:"",color_texto:"rojo"}
                    this.setState({["msj_"+nombre_campo]:mensaje_campo})
                }
            }
            else{
                mensaje_campo[0]={mensaje:"este campo solo permite numeros",color_texto:"rojo"}
                this.setState({["msj_"+nombre_campo]:mensaje_campo})
            }
        }
        else{
            mensaje_campo[0]={mensaje:"este campo no puede estar vacio",color_texto:"rojo"}
            this.setState({["msj_"+nombre_campo]:mensaje_campo})
        }
        return estado
    }

    validarSelect(name){

      const valor = this.state[name]
      let mensaje_campo = this.state["msj_"+name];

      if(valor !== "") mensaje_campo[0] = {mensaje: "", color_texto:"rojo"}
      else mensaje_campo[0] = {mensaje: "Debe de seleccionar una opcion", color_texto:"rojo"}

      this.setState({["msj_"+name]:mensaje_campo})
      if(mensaje_campo[0].mensaje === "") return true; else return false;
    }

    validarRadio(name){
      const valor = this.state[name]
      let msj = [{mensaje: "", color_texto: ""}]
      if(valor !== "") msj[0] = {mensaje: "", color_texto:"rojo"}
      else msj[0] = {mensaje: "Debe de seleccionar una opción", color_texto:"rojo"}

      if(msj[0].mensaje === "") return true;
      else{
        alert(msj[0].mensaje)
        document.getElementsByName(name)[0].focus();
        return false
      };
    }

    validarFormularioRegistrar(){
      const validaCedula = this.validarSelect("id_cedula"),validaEspecialidad = this.validarCampo('especialidad'),validaEstatus = this.validarRadio('estatus_especialista')
      if( validaCedula && validaEspecialidad && validaEstatus) return true;
      else return false;
    }

    async operacion(){
      $(".columna-modulo").animate({
        scrollTop: 0
      }, 1000)
        const {operacion}=this.props.match.params
        // alert("operacion")
        const token=localStorage.getItem('usuario')
        if(this.validarFormularioRegistrar()){
            if(operacion==="registrar"){
                let datosEspecialista={
                    especialista:{
                      id_especialista: this.state.id_especialista,
                      id_cedula: this.state.id_cedula,
                      especialidad: this.state.especialidad,
                      estatus_especialista: this.state.estatus_especialista,
                    },
                    token
                }
                await axiosCustom.post("configuracion/especialista/registrar",datosEspecialista)
                .then(respuesta => {
                    let respuestaServidor=JSON.parse(JSON.stringify(respuesta.data))
                    let alerta=JSON.parse(JSON.stringify(this.state.alerta))
                    // console.log(respuestaServidor)
                    console.log(respuesta)
                    alerta.color=respuestaServidor.color_alerta
                    alerta.mensaje=respuestaServidor.mensaje
                    if(respuestaServidor.estado_respuesta===false){
                        alerta.estado=true
                    }
                    else{
                        alerta.estado=respuestaServidor.estado_respuesta
                    }
                    this.setState({alerta})
                })
                .catch(error => {
                    console.error(`error de la peticion axios =>>> ${error}`)
                })
            }
            else if(operacion==="actualizar"){

                let datosEspecialista={
                    especialista:{
                      id_especialista: this.state.id_especialista,
                      id_cedula: this.state.id_cedula,
                      especialidad: this.state.especialidad,
                      estatus_especialista: this.state.estatus_especialista,
                    },
                    token
                }
                await axiosCustom.put(`configuracion/especalista/actualizar/${this.props.match.params.id}`,datosEspecialista)
                .then(respuesta => {
                    let respuestaServidor=JSON.parse(JSON.stringify(respuesta.data))
                    let alerta=JSON.parse(JSON.stringify(this.state.alerta))
                    // console.log(respuestaServidor)
                    alerta.color=respuestaServidor.color_alerta
                    alerta.mensaje=respuestaServidor.mensaje
                    if(respuestaServidor.estado_respuesta===false){
                        alerta.estado=true
                    }
                    else{
                        alerta.estado=respuestaServidor.estado_respuesta
                    }
                    this.setState({alerta})
                })
                .catch(error => {
                    console.error(`error de la peticion axios =>>> ${error}`)
                })
            }
        }
    }
    cambiarEstadoDos(input){ this.setState({[input.name]:input.value}) }

    validarTexto(a){
      const input = a.target,
      exprecion=/[A-Za-z\s]$/
      if(input.value!==""){
        if(exprecion.test(input.value)) this.cambiarEstadoDos(input)
        else console.log("NO se acepta valores numericos")
      }else this.cambiarEstadoDos(input)
    }

    regresar(){
        this.props.history.push(`/dashboard/configuracion/especialista`)
    }

    render(){
        const jsx=(
            <div className="row justify-content-center">
                {this.state.alerta.estado===true &&
                    (<div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">

                        <AlertBootstrap colorAlert={this.state.alerta.color} mensaje={this.state.alerta.mensaje}/>

                    </div>)
                }
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_formulario_profesor">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-profesor">
                            <span className="titulo-form-reposo">Formulario Especialista</span>
                        </div>
                    </div>
                    <form id="formularioProfesor" >
                      <div className="row justify-content-center align-items-center">
                        <ComponentFormCampo
                          clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                          clasesCampo="form-control"
                          nombreCampo="Código Especialista:"
                          activo="no"
                          type="text"
                          value={this.state.id_especialista}
                          name="id_especialista"
                          id="id_especialista"
                          placeholder="Código Profesor"
                          eventoPadre={this.cambiarEstado}
                        />
                        <ComponentFormSelect
                          clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                          obligatorio="si"
                          mensaje={this.state.msj_id_cedula[0]}
                          nombreCampoSelect="Trabajador:"
                          clasesSelect="custom-select"
                          name="id_cedula"
                          id="id_cedula"
                          eventoPadre={this.cambiarEstado}
                          defaultValue={this.state.id_cedula}
                          option={this.state.selectTrabajadores}
                        />

                        </div>
                        <div className="row justify-content-center">
                          <ComponentFormCampo clasesColumna="col-33 col-sm-33 col-md-33 col-lg-33 col-xl-33"
                                clasesCampo="form-control" obligatorio="si" mensaje={this.state.msj_especialidad[0]}
                                nombreCampo="Especialidad:" activo="si" type="text" value={this.state.especialidad}
                                name="especialidad" id="especialidad" placeholder="Especialidad" eventoPadre={this.validarTexto}
                              />
                            <ComponentFormRadioState
                            clasesColumna="col-6 col-ms-6 col-md-6 col-lg-6 col-xl-6"
                            extra="custom-control-inline"
                            nombreCampoRadio="Estatus:"
                            name="estatus_especialista"
                            nombreLabelRadioA="Activo"
                            idRadioA="activoA"
                            checkedRadioA={this.state.estatus_especialista}
                            valueRadioA="1"
                            nombreLabelRadioB="Inactivo"
                            idRadioB="activoB"
                            valueRadioB="0"
                            eventoPadre={this.cambiarEstado}
                            checkedRadioB={this.state.estatus_especialista}
                            />
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-auto">
                                {this.props.match.params.operacion==="registrar" &&
                                    <InputButton
                                    clasesBoton="btn btn-primary"
                                    id="boton-registrar"
                                    value="Registrar"
                                    eventoPadre={this.operacion}
                                    />
                                }
                                {this.props.match.params.operacion==="actualizar" &&
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
            <div className="component_aula_formulario">

                <ComponentDashboard
                componente={jsx}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />


            </div>
        )
    }

}

export default withRouter(ComponentEspecialistaForm)
