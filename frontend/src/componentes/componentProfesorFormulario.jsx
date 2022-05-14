import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentProfesorFormulario.css'
//JS
import axios from 'axios'
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

class ComponentProfesorFormulario extends React.Component {

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this)
        this.cambiarEstado=this.cambiarEstado.bind(this)
        this.operacion=this.operacion.bind(this)
        this.regresar=this.regresar.bind(this)
        this.state={
            modulo:"",
            estado_menu:false,
            // formulario
            id_profesor:"",
            id_cedula:"",
            estatus_profesor:"1",
            listaTrabajadores:[],
            // 
            msj_nombre_profesor:{
                mensaje:"",
                color_texto:""
            },
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
        let acessoModulo=await this.validarAccesoDelModulo("/dashboard/configuracion","/profesor")
        if(acessoModulo){
            const {operacion}=this.props.match.params
            await this.consultarTrabajadores()
            if(operacion==="actualizar"){
                await this.consultarProfesorTrabajador(this.props.match.params.id)
            }

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

    async consultarProfesorTrabajador(id){
        const token=localStorage.getItem('usuario')
        await axiosCustom.get(`configuracion/profesor/consultar/${id}/${token}`)
        .then(respuesta => {
            let json=JSON.parse(JSON.stringify(respuesta.data))
            // console.log(json)
            if(json.datos.length>0){
                document.getElementById("id_cedula").value=json.datos[0].id_cedula
                this.setState(json.datos[0])
            }
            else{
                alert("El registro que intento consultar no se encuentra en la base de datos")
            }
        })
        .catch(error => {
            console.error("Error al conectar con el servidor")
        })
    }

    async consultarTrabajadores(){
        await axiosCustom.get(`configuracion/trabajador/consultar-todos`)
        .then(respuesta => {
            let json=JSON.parse(JSON.stringify(respuesta.data))
            this.setState({listaTrabajadores:json.trabajadores})
        })
        .catch(error => {
            console.error("Error al conectar con el servidor")
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

    async operacion(){
        const {operacion}=this.props.match.params
        // alert("operacion")
        const token=localStorage.getItem('usuario')
        if(this.validarComboTrabajador()){
            if(operacion==="registrar"){
                // alert("Registrar")
                let datosFormulario=new FormData(document.getElementById("formularioProfesor"))
                let datosFormatiados=this.extrarDatosDelFormData(datosFormulario)
                let datosProfesor={
                    profesor:datosFormatiados,
                    token
                }
                // console.log(datosProfesor)
                await axiosCustom.post("configuracion/profesor/registrar",datosProfesor)
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
            else if(operacion==="actualizar"){
                // alert("Registrar")
                let datosFormulario=new FormData(document.getElementById("formularioProfesor"))
                let datosFormatiados=this.extrarDatosDelFormData(datosFormulario)
                let datosProfesor={
                    profesor:datosFormatiados,
                    token
                }
                // console.log(datosProfesor)
                await axiosCustom.put(`configuracion/profesor/actualizar/${this.props.match.params.id}`,datosProfesor)
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
        else{
            alert("Error al validar el formulario")
        }
    }

    regresar(){
        this.props.history.push(`/dashboard/configuracion/profesor`)
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
                            <span className="titulo-form-reposo">Formulario Profesor</span>
                        </div>
                    </div>
                    <form id="formularioProfesor" >
                        <div className="row justify-content-center">
                        <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            nombreCampo="Código Profesor:"
                            activo="no"
                            type="text"
                            value={this.state.id_profesor}
                            name="id_profesor"
                            id="id_profesor"
                            placeholder="Código Profesor"
                            eventoPadre={this.cambiarEstado}
                            />
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div class="form-groud">
                                    <label>trabajador</label>
                                    <select id="id_cedula" name="id_cedula" class="form-select custom-select" aria-label="Default select example" onChange={this.cambiarEstado}>
                                        {this.state.listaTrabajadores.map((trabajador,index)=> {
                                            return(
                                                <option key={index} value={trabajador.id_cedula} >{trabajador.nombres} {trabajador.apellidos}</option>
                                            )
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormRadioState
                            clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            extra="custom-control-inline"
                            nombreCampoRadio="Estatus:"
                            name="estatus_profesor"
                            nombreLabelRadioA="Activo"
                            idRadioA="activoA"
                            checkedRadioA={this.state.estatus_profesor}
                            valueRadioA="1"
                            nombreLabelRadioB="Inactivo"
                            idRadioB="activoB"
                            valueRadioB="0"
                            eventoPadre={this.cambiarEstado}
                            checkedRadioB={this.state.estatus_profesor}
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

export default withRouter(ComponentProfesorFormulario)