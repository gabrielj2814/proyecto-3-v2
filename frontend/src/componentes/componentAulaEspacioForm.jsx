import React from 'react';
import {withRouter} from 'react-router-dom'
import axios from 'axios'
// IP servidor
import servidor from '../ipServer.js'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentGradoFormulario.css'
//componentes
import ComponentDashboard from './componentDashboard'
// subComponent
import AlertBootstrap from "../subComponentes/alertBootstrap"
import InputButton from '../subComponentes/input_button'
import ComponentFormCampo from '../subComponentes/componentFormCampo';
import ComponentFormSelect from '../subComponentes/componentFormSelect';
import ComponentFormRadioState from "../subComponentes/componentFormRadioState"

const axiosCustom=axios.create({
    baseURL:`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/`
})

class ComponentAulaEspacioForm extends React.Component{

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this)
        this.cambiarEstado=this.cambiarEstado.bind(this)
        this.regresar=this.regresar.bind(this)
        this.operacion=this.operacion.bind(this)
        this.validarNumero=this.validarNumero.bind(this)
        this.validarCampoNumero = this.validarCampoNumero.bind(this)
        this.consultarAulaEspacio = this.consultarAulaEspacio.bind(this)
        this.state={
            //////
            modulo:"",
            estado_menu:false,
            // formulario
            id_aula_espacio: "",
            numero_aula_espacio: "",
            estatus_aula_espacio: "1",
            //
            msj_id_aula_espacio:[{mensaje:"",color_texto:""}],
            msj_numero_aula_espacio:[{mensaje:"",color_texto:""}],
            //
            alerta:{
                color:null,
                mensaje:null,
                estado:false
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

    async componentWillMount(){
        let acessoModulo =await this.validarAccesoDelModulo("/dashboard/configuracion","/aula-espacio")
        if(acessoModulo){
            const {operacion} = this.props.match.params
            if(operacion==="actualizar"){
                 // alert("formulario de actualizar")
                 if(this.props.match.params.id){
                    const {id} = this.props.match.params
                    let datos =await this.consultarAulaEspacio(id)
                }
            }
         }
         else{
          alert("No tienes acesso a este modulo(será redirigido a la vista anterior)")
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

    async consultarAulaEspacio(id){
        const token=localStorage.getItem("usuario")
        axiosCustom.get(`configuracion/aula-espacio/consultar/${id}/${token}`)
        .then(respuesta => {
            let respuestaServidor=JSON.parse(JSON.stringify(respuesta.data))
            console.log(respuestaServidor)
            if(respuestaServidor.estado_respuesta===true){
              let datos = respuestaServidor.datos[0];
              this.setState({
                id_aula_espacio: datos.id_aula_espacio,
                numero_aula_espacio: datos.numero_aula_espacio,
                estatus_aula_espacio: datos.estatus_aula_espacio,
              })

            }
            else{
                alert("este registro no exite")
            }
        })
        .catch(error => {
            console.error(`error de la peticion axios =>>> ${error}`)
        })
    }

      async consultarPerfilTrabajador(modulo,subModulo,idPerfil){
        let estado=false
        await axiosCustom.get(`configuracion/acceso/consultar/${idPerfil}`)
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
            console.log(error)
        })
        return estado
    }


    cambiarEstado(a){
        var input=a.target;
        this.setState({[input.name]:input.value})
    }

    validarNumero(a){
        const input=a.target,
        exprecion=/\d$/
        if(input.value!==""){
            if(exprecion.test(input.value)){
                // console.log("OK")
                if(input.value.length <= 2){
                    this.cambiarEstado(a)
                }
            }
        }
        else{
            this.cambiarEstado(a)
        }
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

    validarFormularioRegistrar(){

      const validar_numeroEspacio = this.validarCampoNumero("numero_aula_espacio")
      if(validar_numeroEspacio) return true; else return false;
    }

    validarFormularioActualizar(){
      const validar_numeroEspacio = this.validarCampoNumero("numero_aula_espacio"), validar_idnumeroEspacio = this.validarCampoNumero("id_aula_espacio")
      if(validar_numeroEspacio && validar_idnumeroEspacio) return true; else return false;
    }


    async operacion(){
        const {operacion}=this.props.match.params
        // alert("operacion")
        const token=localStorage.getItem('usuario')
        if(operacion==="registrar"){
            let datosFormulario=new FormData(document.getElementById("formularioGrado"))
            let datosFormatiados=this.extrarDatosDelFormData(datosFormulario)
            if(this.validarFormularioRegistrar()){
              let datosAulaEspacio={
                aulaEspacio:{
                  id_aula_espacio:this.state.id_aula_espacio,
                  numero_aula_espacio:this.state.numero_aula_espacio,
                  estatus_aula_espacio:this.state.estatus_aula_espacio,
                },
                token
              }

              await axiosCustom.post("configuracion/aula-espacio/registrar",datosAulaEspacio)
              .then(respuesta => {
                let respuestaServidor=JSON.parse(JSON.stringify(respuesta.data))
                let alerta=JSON.parse(JSON.stringify(this.state.alerta))
                alerta.color=respuestaServidor.color_alerta
                alerta.mensaje=respuestaServidor.mensaje
                if(respuestaServidor.estado_respuesta===false){
                  alerta.estado=true
                }
                else{
                  alerta.estado=respuestaServidor.estado_respuesta
                }
                this.setState({alerta})
                this.setState({
                  id_aula_espacio:"",
                  numero_aula_espacio:"",
                  estatus_aula_espacio:"1",
                })
              })
              .catch(error => {
                console.error(`error de la peticion axios =>>> ${error}`)
              })
            }

        }
        else if(operacion==="actualizar"){
            let {id} = this.props.match.params
            let datosFormulario=new FormData(document.getElementById("formularioGrado"))
            if(this.validarFormularioActualizar()){
              let datosFormatiados=this.extrarDatosDelFormData(datosFormulario)
              let datosAulaEspacio={
                aulaEspacio:{
                  id_aula_espacio:this.state.id_aula_espacio,
                  numero_aula_espacio:this.state.numero_aula_espacio,
                  estatus_aula_espacio:this.state.estatus_aula_espacio,
                },
                token
              }

              await axiosCustom.put(`configuracion/aula-espacio/actualizar/${id}`,datosAulaEspacio)
              .then(respuesta => {
                let respuestaServidor=JSON.parse(JSON.stringify(respuesta.data))
                let alerta=JSON.parse(JSON.stringify(this.state.alerta))
                alerta.color=respuestaServidor.color_alerta
                alerta.mensaje=respuestaServidor.mensaje
                if(respuestaServidor.estado_respuesta===false){
                  alerta.estado=true
                }
                else{
                  alerta.estado=respuestaServidor.estado_respuesta
                }
                this.setState({alerta})
                this.setState({
                  id_aula_espacio:"",
                  numero_aula_espacio:"",
                  estatus_aula_espacio:"1",
                })
              })
              .catch(error => {
                console.error(`error de la peticion axios =>>> ${error}`)
              })
            }
        }
    }

    regresar(){
        this.props.history.push(`/dashboard/configuracion/espacio-aula`)
    }

    render(){
        const jsx=(
            <div className="row justify-content-center">
                {this.state.alerta.estado===true &&
                    (<div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">

                        <AlertBootstrap colorAlert={this.state.alerta.color} mensaje={this.state.alerta.mensaje}/>

                    </div>)
                }
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_formulario_grado">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-reposo">
                            <span className="titulo-form-reposo">Formulario de Aula</span>
                        </div>
                    </div>
                    <form id="formularioGrado" >
                        <div className="row justify-content-center">
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            nombreCampo="Código Aula:"
                            activo="no"
                            type="text"
                            value={this.state.id_aula_espacio}
                            mensaje={this.state.msj_id_aula_espacio[0]}
                            name="id_aula_espacio"
                            id="id_aula_espacio"
                            placeholder="Código Grado"
                            eventoPadre={this.cambiarEstado}
                            />
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            nombreCampo="Número del Aula:"
                            mensaje={this.state.msj_numero_aula_espacio[0]}
                            activo="si"
                            obligatorio="si"
                            type="text"
                            value={this.state.numero_aula_espacio}
                            name="numero_aula_espacio"
                            id="numero_aula_espacio"
                            placeholder="Número del Aula"
                            eventoPadre={this.validarNumero}
                            />
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormRadioState
                            clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            extra="custom-control-inline"
                            nombreCampoRadio="Estatus:"
                            name="estatus_aula_espacio"
                            nombreLabelRadioA="Activo"
                            idRadioA="activoA"
                            checkedRadioA={this.state.estatus_aula_espacio}
                            valueRadioA="1"
                            nombreLabelRadioB="Inactivo"
                            idRadioB="activoB"
                            valueRadioB="0"
                            eventoPadre={this.cambiarEstado}
                            checkedRadioB={this.state.estatus_aula_espacio}
                            />
                        </div>


                    </form>
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
                </div>
            </div>
        )
        return(
            <div className="component_grado_formulario">

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

export default withRouter(ComponentAulaEspacioForm)
