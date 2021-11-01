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
        this.buscarProfesor=this.buscarProfesor.bind(this)
        this.consultarAulasPorGrado2=this.consultarAulasPorGrado2.bind(this)
        this.operacion=this.operacion.bind(this)
        // this.regresar=this.regresar.bind(this)
        this.state={
            modulo:"",
            estado_menu:false,
            // formulario
            id_cedula:"",
            id_grado:"",
            //
            id_asignacion_aula_profesor:"",
            id_profesor:"",
            id_aula:"",
            id_ano_escolar:"",
            estatus_asignacion_aula_profesor:"1",
            // -----------------------------
            listaGrados:[],
            listaAulas:[],
            hashListaProfesores:{},
            hashListaAnoEscolares:{},
            hashAnoEscolaresActivo:{},
            // 
            estado_aula_seleccionada:null,
            // 
            msj_id_cedula:{
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
        const {operacion}=this.props.match.params
        if(operacion==="registrar"){
            await this.consultarAnoEscolarActivo()
            await this.consultarProfesores()
            await this.consultarGrados()
            await this.consultarAulasPorGrado()
        }
        else if(operacion==="actualizar"){
            const {id}=this.props.match.params
            await this.consultarProfesores()
            await this.consultarGrados()
            await this.consultarAulasPorGrado()
            await this.consultarAsignacionAulaProfesor(id)
            if(this.state.id_asignacion_aula_profesor!=""){
                let cedulaProfesor={
                    target:{
                        value:this.state.id_cedula,
                    }
                }
                let selectIdGrado={
                    target:{
                        value:this.state.id_grado,
                    }
                }
                this.buscarProfesor(cedulaProfesor)
                document.getElementById("id_grado").value=this.state.id_grado
                await this.consultarAulasPorGrado2(selectIdGrado)
                document.getElementById("id_aula").value=this.state.id_aula
            }

        }

    }

    async consultarAsignacionAulaProfesor(id){
        await axiosCustom.get(`transaccion/asignacion-aula-profesor/consultar/${id}`)
        .then(respuesta => {
            let json=JSON.parse(JSON.stringify(respuesta.data))
            console.log(json)
            if(json.datos.length>0){
                this.setState({
                    id_cedula:json.datos[0].id_cedula,
                    id_asignacion_aula_profesor:json.datos[0].id_asignacion_aula_profesor,
                    id_profesor:json.datos[0].id_profesor,
                    id_grado:json.datos[0].id_grado,
                    id_aula:json.datos[0].id_aula,
                    id_ano_escolar:json.datos[0].id_ano_escolar,
                    estatus_asignacion_aula_profesor:json.datos[0].estatus_asignacion_aula_profesor
                })
            }
        })
        .catch(error => {
            console.error(error)
        })
    }

    async consultarAnoEscolarActivo(){
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
            let hash={}
            for(let profesor of json.datos){
                hash[profesor.id_cedula]=profesor
            }
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
            await axiosCustom.get(`configuracion/aula/consultar-aula-por-grado/${this.state.listaGrados[0].id_grado}`)
            .then(respuesta =>{
                let json=JSON.parse(JSON.stringify(respuesta.data))
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
        await axiosCustom.get(`configuracion/aula/consultar-aula-por-grado/${inputSelectGrados.value}`)
        .then(respuesta =>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
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

    buscarProfesor(a){
        let input=a.target
        let $seccionNombreProfesor=document.getElementById("nombreProfesor")
        let msj_id_cedula=JSON.parse(JSON.stringify(this.state.msj_id_cedula))
        if(input.value.length===8){
            if(this.state.hashListaProfesores[input.value]){
                let profesor=this.state.hashListaProfesores[input.value]
                $seccionNombreProfesor.textContent=`${profesor.nombres} ${profesor.apellidos}`
                this.setState({id_profesor:profesor.id_profesor})
                msj_id_cedula.mensaje=""
                msj_id_cedula.color_texto="rojo"
                
            }
            else{
                $seccionNombreProfesor.textContent=``
                this.setState({id_profesor:""})
                msj_id_cedula.mensaje="no hay ningun profesor en la lista que tenga esta cedula"
                msj_id_cedula.color_texto="rojo"
            }
            this.setState({msj_id_cedula})
        }
        else{
            this.setState({id_profesor:""})
            $seccionNombreProfesor.textContent=``
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

    async operacion(){
        const {operacion}=this.props.match.params
        // alert("operacion")
        const token=localStorage.getItem('usuario')
        if(operacion==="registrar"){
            // alert("Registrar")
            let datosFormulario=new FormData(document.getElementById("formularioAsigAulaProf"))
            let datosFormatiados=this.extrarDatosDelFormData(datosFormulario)
            let datosAsignacion={
                asignacionAulaProfesor:datosFormatiados,
                token
            }
            // console.log(datosAula)
            await axiosCustom.post("transaccion/asignacion-aula-profesor/registrar",datosAsignacion)
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
            let datosFormulario=new FormData(document.getElementById("formularioAsigAulaProf"))
            let datosFormatiados=this.extrarDatosDelFormData(datosFormulario)
            let datosAsignacion={
                asignacionAulaProfesor:datosFormatiados,
                token
            }
            // console.log(datosAula)
            await axiosCustom.put(`transaccion/asignacion-aula-profesor/actualizar/${this.props.match.params.id}`,datosAsignacion)
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
                                <span className="sub-titulo-form-reposo-trabajador">Profesor</span>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            nombreCampo="Cedula:"
                            activo="si"
                            type="text"
                            value={this.state.id_cedula}
                            name="id_cedula"
                            id="id_cedula"
                            placeholder="Cedula"
                            mensaje={this.state.msj_id_cedula}
                            eventoPadre={this.buscarProfesor}
                            />
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <label>Nombre Completo:</label>
                                <div id="nombreProfesor">Sin nombre</div>
                            </div>
                            <input type="hidden" id="id_profesor" name="id_profesor" value={this.state.id_profesor}/>
                            <input type="hidden" id="id_ano_escolar" name="id_ano_escolar" value={this.state.id_ano_escolar}/>
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                                <span className="sub-titulo-form-reposo-trabajador">Aula</span>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div class="form-groud">
                                    <label>Grado</label>
                                    <select id="id_grado" name="id_grado" class="form-select custom-select" aria-label="Default select example" onChange={this.consultarAulasPorGrado2}>
                                        {this.state.listaGrados.map((grado,index)=> {
                                            return(
                                                <option key={index} value={grado.id_grado} >{grado.numero_grado}</option>
                                            )
                                            })

                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div class="form-groud">
                                    <label>Sección</label>
                                    <select id="id_aula" name="id_aula" class="form-select custom-select" aria-label="Default select example" onChange={this.cambiarEstado}>
                                        {this.state.listaAulas.map((aula,index)=> {
                                            return(
                                                <option key={index} value={aula.id_aula} >{aula.nombre_aula}</option>
                                            )
                                            })

                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                                <span className="sub-titulo-form-reposo-trabajador">Otros</span>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormRadioState
                            clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            extra="custom-control-inline"
                            nombreCampoRadio="Estatus:"
                            name="estatus_asignacion_aula_profesor"
                            nombreLabelRadioA="Activo"
                            idRadioA="activoA"
                            checkedRadioA={this.state.estatus_asignacion_aula_profesor}
                            valueRadioA="1"
                            nombreLabelRadioB="Inactivo"
                            idRadioB="activoB"
                            valueRadioB="0"
                            eventoPadre={this.cambiarEstado}
                            checkedRadioB={this.state.estatus_asignacion_aula_profesor}
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