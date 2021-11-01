import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentAsignacionAulaProfesorForm.css'
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


class ComponentAsignacionAulaProfesorForm extends React.Component {

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this)
        this.cambiarEstado=this.cambiarEstado.bind(this)
        // this.operacion=this.operacion.bind(this)
        // this.regresar=this.regresar.bind(this)
        this.state={
            modulo:"",
            estado_menu:false,
            // formulario
            id_asignacion_aula_profesor:"",
            id_profesor:"",
            id_grado:"",
            id_aula:"",
            id_ano_escolar:"",
            estatus_asignacion_aula_profesor:"1",
            // 
            listaGrados:[],
            listaAulas:[],
            hashListaProfesores:{},
            hashListaAnoEscolares:{},
            hashAnoEscolaresActivo:{},
            // 
            // msj_nombre_aula:{
            //     mensaje:"",
            //     color_texto:""
            // },
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
        const {operacion}=this.props.match.params
        if(operacion==="registrar"){
            await this.consultarAnoEscolarActico()
            await this.consultarProfesores()
            await this.consultarGrados()
            await this.consultarAulasPorGrado()
        }
        // else if(operacion==="actualizar"){
        //     await this.consultarGrados()
        //     await this.consultarAulasPorGrado()
        // }

    }

    async consultarAnoEscolarActico(){
        await axiosCustom.get(`configuracion/ano-escolar/consultar-ano-escolar-activo`)
        .then(respuesta =>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
            // console.log(json)
            if(json.datos.length===1){
                this.setState({hashAnoEscolaresActivo:json.datos[0]})
                this.setState({id_ano_escolar:this.state.hashAnoEscolaresActivo.id_ano_escolar})
            }

        })
        .catch(error => {
            console.error(error)
        })
    }

    async consultarProfesores(){
        await axiosCustom.get(`configuracion/profesor/consultar-todos`)
        .then(respuesta =>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
            // console.log(json)
            let hash={}
            for(let profesor of json.datos){
                hash[profesor.id_cedula]=profesor
            }
            // console.log(hash)
            this.setState({hashListaProfesores:hash})

        })
        .catch(error => {
            console.error(error)
        })
    }

    async consultarGrados(){
        await axiosCustom.get(`configuracion/grado/consultar-todos`)
        .then(respuesta =>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
            // console.log(json)
            this.setState({listaGrados:json.datos})
            if(json.datos.length>0){
                this.setState({id_grado:this.state.listaGrados[0].id_grado})
            }

        })
        .catch(error => {
            console.error(error)
        })
    }
    
    async consultarAulasPorGrado(){
        if(this.state.listaGrados.length>0){
            await axiosCustom.get(`configuracion/aula//consultar-aula-por-grado/${this.state.listaGrados[0].id_grado}`)
            .then(respuesta =>{
                let json=JSON.parse(JSON.stringify(respuesta.data))
                // console.log(json)
                this.setState({listaAulas:json.datos})
                if(json.datos.length>0){
                    this.setState({id_aula:this.state.listaAulas[0].id_aula})
                }

            })
            .catch(error => {
                console.error(error)
            })
        }
    }
    
    async consultarAulasPorGrado2(a){
        let inputSelectGrados=a.target
        await axiosCustom.get(`configuracion/aula//consultar-aula-por-grado/${inputSelectGrados.value}`)
        .then(respuesta =>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
            // console.log(json)
            this.setState({listaAulas:json.datos})

        })
        .catch(error => {
            console.error(error)
        })
    }

    cambiarEstado(a){
        var input=a.target;
        this.setState({[input.name]:input.value})
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
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_formulario_asig_aula_prof">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-asig-aula-prof">
                            <span className="titulo-form-reposo">Formulario Asignacion Aula Profesor</span>
                        </div>
                    </div>
                    <form id="formularioAsigAulaProf" >
                        <div className="row justify-content-center">
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            nombreCampo="Código Asignación:"
                            activo="no"
                            type="text"
                            value={this.state.id_asignacion_aula_profesor}
                            name="id_asignacion_aula_profesor"
                            id="id_asignacion_aula_profesor"
                            placeholder="Código Asignacion"
                            eventoPadre={this.cambiarEstado}
                            />
                            <div className='col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6'></div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                                <span className="sub-titulo-form-reposo-trabajador">Trabajador</span>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                                <span className="sub-titulo-form-reposo-trabajador">Aula</span>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                                <span className="sub-titulo-form-reposo-trabajador">Otros</span>
                            </div>
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
            <div className="component_asig_aula_prof_formulario">

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

export default withRouter(ComponentAsignacionAulaProfesorForm)