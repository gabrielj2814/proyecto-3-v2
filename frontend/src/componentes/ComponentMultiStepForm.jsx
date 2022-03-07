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
import ComponentMultiStepFormRepresentante from '../subComponentes/ComponentMultiStepFormRepresentante'
import ComponentMultiStepFormEstudiante from '../subComponentes/ComponentMultiStepFormEstudiante'
import ComponentMultiStepFormAsignacion from '../subComponentes/ComponentMultiStepFormAsignacion'
import InputButton from '../subComponentes/input_button'
import ButtonIcon from '../subComponentes/buttonIcon'
import ComponentFormCampo from '../subComponentes/componentFormCampo';
import ComponentFormRadioState from '../subComponentes/componentFormRadioState';
import ComponentFormSelect from '../subComponentes/componentFormSelect';
import ComponentFormDate from '../subComponentes/componentFormDate'
import ComponentFormTextArea from '../subComponentes/componentFormTextArea'
import { Alert } from 'bootstrap';
import AlertBootstrap from "../subComponentes/alertBootstrap"

class ComponentMultiStepForm extends React.Component{

    constructor(){
        super();
        this.mostrarModulo = this.mostrarModulo.bind(this);
        this.agregar=this.agregar.bind(this);
        this.consultarPerfilTrabajador=this.consultarPerfilTrabajador.bind(this)
        this.StatePadre = this.StatePadre.bind(this);
        this.next = this.next.bind(this);
        this.AddCedulas = this.AddCedulas.bind(this)
        this.reverse = this.reverse.bind(this);
        this.state={
            // ------------------
            modulo:"",// modulo menu
            estado_menu:false,
            //formulario
            formulario_step: 0,
            id_estudiante:"",
            cedulas_representante: [
              {id: "", descripcion: ""},
            ],
            ///
            mensaje:{
                texto:"",
                estado:""
            },
            //
            fechaServidor:null,
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
        // let acessoModulo=await this.validarAccesoDelModulo("/dashboard/configuracion","/estudiante")
        if(true){
            await this.consultarFechaServidor()
            const ruta_api=`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/estado/consultar-todos`,
            nombre_propiedad_lista="estados",
            propiedad_id="id_estado",
            propiedad_descripcion="nombre_estado",
            propiedad_estado="estatu_estado"
            const estados=await this.consultarServidor(ruta_api,nombre_propiedad_lista,propiedad_id,propiedad_descripcion,propiedad_estado)

            const ruta_api_2=`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/ciudad/consultar-x-estado/${estados[0].id}`,
            nombre_propiedad_lista_2="ciudades",
            propiedad_id_2="id_ciudad",
            propiedad_descripcion_2="nombre_ciudad",
            propiedad_estado_2="estatu_ciudad"
            const ciudades=await this.consultarServidor(ruta_api_2,nombre_propiedad_lista_2,propiedad_id_2,propiedad_descripcion_2,propiedad_estado_2)

            this.setState({
                estados,
                ciudades,
                id_estado:(estados.length===0)?null:estados[0].id,
                id_ciudad:(ciudades.length===0)?null:ciudades[0].id,
            })
        }
    }

    async validarAccesoDelModulo(modulo,subModulo){
        await this.consultarFechaServidor();
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

    async consultarFechaServidor(){
        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/trabajador/fecha-servidor`)
        .then(respuesta => {
            let fechaServidor=respuesta.data.fechaServidor
            // alert(fechaServidor)
            this.setState({fechaServidor})
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
                this.props.history.push(`/dashboard/configuracion/estudiante${JSON.stringify(mensaje)}`)
            }
        })
        .catch(error=>{
            console.log(error)
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

    async agregar(){
      var mensaje=this.state.mensaje
      mensaje.estado=""
      var mensaje_campo=[{mensaje:"",color_texto:""}]
      this.setState({
        id_cedula_escolar:"",
        id_cedula:"",
        nombres:"",
        apellidos:"",
        fecha_nacimiento:"",
        direccion_nacimiento:"",
        escolaridad:"",
        vive_con:"",
        procedencia:"",
        id_estado:"",
        id_ciudad:"",
        sexo_estudiante:"1",
        estatu_estudiante:"1",
        //MSJ
        msj_id_cedula_escolar:mensaje_campo,
        msj_id_cedula:mensaje_campo,
        msj_nombres:mensaje_campo,
        msj_apellidos:mensaje_campo,
        msj_fecha_nacimiento:mensaje_campo,
        msj_direccion_nacimiento:mensaje_campo,
        msj_escolaridad:mensaje_campo,
        msj_vive_con:mensaje_campo,
        msj_procedencia:mensaje_campo,
        msj_sexo_estudiante:mensaje_campo,
        msj_estatu_estudiante:mensaje_campo,
        msj_id_estado:mensaje_campo,
        msj_id_ciudad:mensaje_campo,
        edadEstudiante:null,
      })
      this.props.history.push("/dashboard/configuracion/estudiante/registrar")
    }

    next(){ this.setState({formulario_step: this.state.formulario_step + 1})}
    reverse(){ this.setState(prevState => ({formulario_step: prevState.formulario_step - 1 }))}
    StatePadre(index, value){ this.setState({[index]: value}); }
    AddCedulas(value){
        let cedulas_representante = this.state.cedulas_representante;
        let status = true;
        if(cedulas_representante.length > 0){
            cedulas_representante.map( item => { if(item.id == value) status = false; })
            if(!status) return ;

            cedulas_representante.push({id: value, descripcion: value});
            this.setState({cedulas_representante: cedulas_representante})
        }else this.setState({cedulas_representante: [value]});
    }

    render(){
        let componenteForm1 = <>
            <ComponentMultiStepFormEstudiante
                operacion="registrar"
                next={this.next}
                state={this.StatePadre}
                obligatorio={true}
            />
        </>

        let componenteForm2 = <>
            <ComponentMultiStepFormRepresentante
                operacion="registrar"
                next={this.next}
                state={this.StatePadre}
                addCedulas={this.AddCedulas}
                obligatorio={true}
            />
        </>

        let componenteForm3 = <>
            <ComponentMultiStepFormAsignacion
                operacion="registrar"
                next={this.next}
                state={this.StatePadre}
                idEstudiante={this.state.id_estudiante}
                cedulasRepresentante={ this.state.cedulas_representante }
                reverse={this.reverse}
                obligatorio={true}
            />
        </>

      if(this.state.formulario_step === 0){
            return(
                <div className="component_trabajador_form">
                  <ComponentDashboard
                  componente={componenteForm1}
                  modulo={this.state.modulo}
                  eventoPadreMenu={this.mostrarModulo}
                  estado_menu={this.state.estado_menu}
                  />
                </div>
            )
        }

        if(this.state.formulario_step === 1){
            return(
                <div className="component_trabajador_form">
                  <ComponentDashboard
                  componente={componenteForm2}
                  modulo={this.state.modulo}
                  eventoPadreMenu={this.mostrarModulo}
                  estado_menu={this.state.estado_menu}
                  />
                </div>
            )
        }

        if(this.state.formulario_step === 2){
            return(
                <div className="component_trabajador_form">
                  <ComponentDashboard
                  componente={componenteForm3}
                  modulo={this.state.modulo}
                  eventoPadreMenu={this.mostrarModulo}
                  estado_menu={this.state.estado_menu}
                  />
                </div>
            )
        }

    }
}

export default withRouter(ComponentMultiStepForm)
