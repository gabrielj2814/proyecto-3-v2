import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentAulaFormulario.css'
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

class ComponentAulaFormulario extends React.Component{

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
            id_aula:"",
            id_grado:"",
            nombre_aula:"",
            estatus_aula:"1",
            listaGradosEscolares:[],
            // 
            msj_nombre_aula:{
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
        await this.consultarGradosEscolar()
        const {operacion} = this.props.match.params
        const {id} = this.props.match.params
        if(operacion==="actualizar"){
            await this.consultarAula(id)
        }
    }

    cambiarEstado(a){
        var input=a.target;
        this.setState({[input.name]:input.value})
    }

    async consultarGradosEscolar(){
        await axiosCustom.get(`configuracion/grado/consultar-todos`)
        .then(respuesta => {
            let respuestaServidor=JSON.parse(JSON.stringify(respuesta.data))
            console.log(respuestaServidor)
            if(respuestaServidor.estado_respuesta===true){
                this.setState({listaGradosEscolares:respuestaServidor.datos})
            }
            else{
                alert("este registro no exite")
            }

        })
        .catch(error => {
            console.error(`error de la peticion axios =>>> ${error}`)
        })

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

    async consultarAula(id){
        await axiosCustom.get(`configuracion/aula/consultar/${id}`)
        .then(respuesta => {
            console.log(respuesta.data)
            let respuestaServidor=JSON.parse(JSON.stringify(respuesta.data))
            this.setState(respuestaServidor.datos[0])
            document.getElementById("id_grado").value=respuestaServidor.datos[0].id_grado
        })
        .catch(error => {
            console.error(`error de la peticion axios =>>> ${error}`)
        })
    }

    validarNombreAula(){
        let estado=false
        let msj_nombre_aula=JSON.parse(JSON.stringify(this.state.msj_nombre_aula))
        const nombreAula=document.getElementById("nombre_aula"),
        exprecion=/[A-Za-z0-9]/g
        if(nombreAula.value!==""){
            if(exprecion.test(nombreAula.value)){
                estado=true
                msj_nombre_aula.mensaje=""
                msj_nombre_aula.color_texto=""
            }
            else{
                // console.log("NO se acepta valores numericos")
                msj_nombre_aula.mensaje="no puede solo haber espacios en blanco"
                msj_nombre_aula.color_texto="rojo"
                estado= false
            }
        }
        else{
            msj_nombre_aula.color_texto="rojo"
            msj_nombre_aula.mensaje="este campo no puede estar vacio"
            estado= false
        }
        this.setState({msj_nombre_aula})
        return estado
    }

    validarAnoEscolar(){
        if(this.state.listaGradosEscolares.length>0){
            // return true
            let selectAnoEscolar=document.getElementById("id_grado")
            let anoEscolarEncontrado=this.state.listaGradosEscolares.filter((anoEscolar,index) => anoEscolar.id_grado===parseInt(selectAnoEscolar.value))
            if(anoEscolarEncontrado.length>0){
                return true
            }
            else{
                return false
            }
        }
        else{
            alert("no se a podido hacer la operacion por que no hay años escolares registrados")
            return false
        }
    }

    validarFormulario(){
        let estadoValidacionNombreAula=this.validarNombreAula()
        let validacionAnoEscolar=this.validarAnoEscolar()
        if(estadoValidacionNombreAula && validacionAnoEscolar){
            return true
        }
        else{
            return false
        }
    }


    async operacion(){
        const {operacion}=this.props.match.params
        // alert("operacion")
        const token=localStorage.getItem('usuario')
        if(this.validarFormulario()){
            if(operacion==="registrar"){
                // alert("Registrar")
                let datosFormulario=new FormData(document.getElementById("formularioAula"))
                let datosFormatiados=this.extrarDatosDelFormData(datosFormulario)
                let datosAula={
                    aula:datosFormatiados,
                    token
                }
                // console.log(datosAula)
                await axiosCustom.post("configuracion/aula/registrar",datosAula)
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
                let datosFormulario=new FormData(document.getElementById("formularioAula"))
                let datosFormatiados=this.extrarDatosDelFormData(datosFormulario)
                let datosAula={
                    aula:datosFormatiados,
                    token
                }
                // console.log(datosAula)
                await axiosCustom.put(`configuracion/aula/actualizar/${this.props.match.params.id}`,datosAula)
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
        this.props.history.push("/dashboard/configuracion/aula")
    }

    render(){
        const jsx=(
            <div className="row justify-content-center">
                {this.state.alerta.estado===true &&
                    (<div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">

                        <AlertBootstrap colorAlert={this.state.alerta.color} mensaje={this.state.alerta.mensaje}/>
                        
                    </div>)
                }
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_formulario_aula">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-reposo">
                            <span className="titulo-form-reposo">Formulario de Aula</span>
                        </div>
                    </div>
                    <form id="formularioAula" >
                        <div className="row justify-content-center">
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            nombreCampo="Código Aula:"
                            activo="no"
                            type="text"
                            value={this.state.id_aula}
                            name="id_aula"
                            id="id_aula"
                            placeholder="Código Aula"
                            eventoPadre={this.cambiarEstado}
                            />
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            nombreCampo="Nombre Aula:"
                            activo="si"
                            type="text"
                            value={this.state.nombre_aula}
                            name="nombre_aula"
                            id="nombre_aula"
                            placeholder="Nombre Aula"
                            mensaje={this.state.msj_nombre_aula}
                            eventoPadre={this.cambiarEstado}
                            />
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div class="form-groud">
                                    <label>Año de la Sección</label>
                                    <select id="id_grado" name="id_grado" class="form-select custom-select" aria-label="Default select example" onChange={this.cambiarEstado}>
                                        {this.state.listaGradosEscolares.map((grado,index)=> {
                                            return(
                                                <option key={index} value={grado.id_grado} >{grado.numero_grado}</option>
                                            )
                                            })

                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormRadioState
                            clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            extra="custom-control-inline"
                            nombreCampoRadio="Estatus:"
                            name="estatus_aula"
                            nombreLabelRadioA="Activo"
                            idRadioA="activoA"
                            checkedRadioA={this.state.estatus_aula}
                            valueRadioA="1"
                            nombreLabelRadioB="Inactivo"
                            idRadioB="activoB"
                            valueRadioB="0"
                            eventoPadre={this.cambiarEstado}
                            checkedRadioB={this.state.estatus_aula}
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

export default withRouter(ComponentAulaFormulario)