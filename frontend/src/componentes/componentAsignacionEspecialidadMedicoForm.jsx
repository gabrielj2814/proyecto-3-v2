import React from "react"
import {withRouter} from "react-router-dom"
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import "../css/componentAsignacionEspecialidadMedicoForm.css"
//JS
import axios from 'axios'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'
import ButtonIcon from '../subComponentes/buttonIcon'
import ComponentFormCampo from '../subComponentes/componentFormCampo';
import ComponentFormSelect from '../subComponentes/componentFormSelect';
import ComponentFormRadioState from '../subComponentes/componentFormRadioState';
import AlertBootstrap from "../subComponentes/alertBootstrap"




class ComponentAsignacionEspecialidadMedicoForm extends React.Component{

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.operacion=this.operacion.bind(this);
        // this.regresar=this.regresar.bind(this);
        this.agregar= this.agregar.bind(this);
        this.state={
            modulo:"",
            estado_menu:false,
            //----------------------
            id_asignacion_medico_especialidad:"",
            id_medico:"",
            id_especialidad:"",
            estatu_asignacion:"1",
            medicos:[],
            especialidades:[],
            msj_id_medico:{
                mensaje:"",
                color_texto:""
            },
            msj_id_especialidad:{
                mensaje:"",
                color_texto:""
            },
            alerta:{
                color:null,
                mensaje:null,
                estado:false
            }
        }
    }

    // logica menu
    mostrarModulo(a){// esta funcion tiene la logica del menu no tocar si no quieres que el menu no te responda como es devido
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

    async generarId(){
        await axios.get("http://localhost:8080/configuracion/asignacion-medico-especialidad/generar-id")
        .then(respuesta => {
            console.log(respuesta)
            this.setState({
                id_asignacion_medico_especialidad:respuesta.data.id
            })
        })
        .catch(error => {
            alert("error al generar el id")
        })
    }


    async UNSAFE_componentWillMount(){
        const {operacion,id}=this.props.match.params
        if(operacion==="registrar"){
            this.generarId();
            let medicos=await this.consultarTodosLosMedicos()
            console.log("lista de medicos ->>> ",medicos)
            let listaMedicos=this.formatoOptionSelect(medicos)
            let especialidades=await  this.consultarTodasEspecialidad()
            console.log("lista de especialidades ->>> ",especialidades )
            let listaEspecialidades=this.formatoOptionSelect2(especialidades)
            console.log(listaEspecialidades)
            this.setState({
                medicos:listaMedicos,
                especialidades:listaEspecialidades,
                id_medico:(listaMedicos.length===0)?null:listaMedicos[0].id,
                id_especialidad:(especialidades.length===0)?null:especialidades[0].id,
            })
        }
        else if(operacion==="actualizar"){
            let asignacion=await this.consultarAsignacion(id)
            console.log("asignacion ->>> ",asignacion)
            let medicos=await this.consultarTodosLosMedicos()
            console.log("lista de medicos ->>> ",medicos)
            let listaMedicos=this.formatoOptionSelect(medicos)
            let especialidades=await  this.consultarTodasEspecialidad()
            console.log("lista de especialidades ->>> ",especialidades )
            let listaEspecialidades=this.formatoOptionSelect2(especialidades)
            console.log(listaEspecialidades)
            this.setState({
                id_asignacion_medico_especialidad:asignacion.id_asignacion_medico_especialidad,
                medicos:listaMedicos,
                especialidades:listaEspecialidades,
                estatu_asignacion:asignacion.estatu_asignacion
            })
            document.getElementById("id_medico").value=asignacion.id_medico
            document.getElementById("id_especialidad").value=asignacion.id_especialidad
        }
    }

    async consultarAsignacion(id){
        var respuesta_servidor=[]
        const token=localStorage.getItem('usuario')
        await axios.get(`http://localhost:8080/configuracion/asignacion-medico-especialidad/consultar/${id}/${token}`)
        .then(respuesta=>{
          respuesta_servidor=respuesta.data.medico_especialidad
          console.log(respuesta.data)
        })
        .catch(error=>{
          alert("No se pudo conectar con el servidor")
          console.log(error)
        })
        return respuesta_servidor;
    } 

    async consultarTodasEspecialidad(){
        var respuesta_servidor=[]
        await axios.get("http://localhost:8080/configuracion/especialidad/consultar-todos")
        .then(respuesta=>{
          respuesta_servidor=respuesta.data.especialidades
          console.log(respuesta.data)
        })
        .catch(error=>{
          alert("No se pudo conectar con el servidor")
          console.log(error)
        })
        return respuesta_servidor;
    }

    async consultarTodosLosMedicos(){
        var respuesta_servidor=[]
        await axios.get("http://localhost:8080/configuracion/medico/consultar-todos")
        .then(respuesta=>{
            respuesta_servidor=respuesta.data.medicos
            // console.log(respuesta.data)
        })
        .catch(error=>{
            alert("No se pudo conectar con el servidor")
            console.log(error)
        })
        return respuesta_servidor;
    }
    
    formatoOptionSelect(lista){
        var veces=0
        let lista_vacia=[];
        while(veces<lista.length){
            lista_vacia.push({id:lista[veces].id_medico,descripcion:lista[veces].nombre_medico+" "+lista[veces].apellido_medico})
            veces+=1
        }
        return lista_vacia
    }
    
    formatoOptionSelect2(lista){
        var veces=0
        let lista_vacia=[];
        while(veces<lista.length){
            if(lista[veces].estatu_especialidad==="1"){
                lista_vacia.push({id:lista[veces].id_especialidad,descripcion:lista[veces].nombre_especialidad})
            }
            veces+=1
        }
        return lista_vacia
    }

    agregar(){
        alert("agregando nuevo formulario")
    }

    cambiarEstado(a){
        var input=a.target;
        this.setState({[input.name]:input.value})
    }

    operacion(){
        let alerta=JSON.parse(JSON.stringify(this.state.alerta))
        const token=localStorage.getItem('usuario')
        const {operacion,id}=this.props.match.params
        if(this.validarFormulario()){
            let datosFormulario=new FormData(document.getElementById("formulario_asignacion"))
            let datos={
                medico_especialidad_json:this.extrarDatosDelFormData(datosFormulario),
                token
            }
            console.log("datos del formulario preparados ->>>> ",datos)
            if(operacion==="registrar"){
                // alert("registrando datos")
                axios.post("http://localhost:8080/configuracion/asignacion-medico-especialidad/registrar",datos)
                .then(respuesta => {
                    let datosServidor=JSON.parse(JSON.stringify(respuesta.data))
                    console.log(datosServidor)
                    if(datosServidor.estado_peticion && datosServidor.estado_peticion==="200"){
                        alerta.color="success"
                        alerta.mensaje=datosServidor.mensaje
                        alerta.estado=true
                        this.setState({alerta})
                    }
                })
                .catch(error => {
                    alerta.color="danger"
                    alerta.mensaje="Error al conectar con el servidor"
                    alerta.estado=true
                    this.setState({alerta})
                    console.log("error al registrar ->>>> ",error)
                })
            }
            else if(operacion==="actualizar"){
                // alert("actualizando datos")
                axios.put(`http://localhost:8080/configuracion/asignacion-medico-especialidad/actualizar/${id}`,datos)
                .then(respuesta => {
                    let datosServidor=JSON.parse(JSON.stringify(respuesta.data))
                    console.log(datosServidor)
                    if(datosServidor.estado_peticion && datosServidor.estado_peticion==="200"){
                        alerta.color="success"
                        alerta.mensaje=datosServidor.mensaje
                        alerta.estado=true
                        this.setState({alerta})
                    }
                })
                .catch(error => {
                    alerta.color="danger"
                    alerta.mensaje="Error al conectar con el servidor"
                    alerta.estado=true
                    this.setState({alerta})
                    console.log("error al registrar ->>>> ",error)
                })
            }
        }
    }

    validarFormulario(){
        let estado=false
        let validarMedico=this.validarSelectNull("medico")
        let validarEspecialidad=this.validarSelectNull("especialidad")
        if(validarMedico && validarEspecialidad){
            estado=true
        }
        return estado

    }

    validarSelectNull(valorSelect){
        let estado=false;
        let msj=JSON.parse(JSON.stringify(this.state["msj_id_"+valorSelect]));
        if(this.state["id_"+valorSelect]!==null){
            estado = true
            msj.mensaje="";
            msj.color_texto="";
            this.setState({["msj_"+valorSelect]:msj})
        }
        else{
            msj.mensaje="este combo esta vacio por favor inserte datos primero en el modulo de "+valorSelect+" para poder continuar";
            msj.color_texto="rojo";
            this.setState({["msj_"+valorSelect]:msj})
        }
        return estado;

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



    render(){
        const component=(
            <div className="row justify-content-center">
                {this.state.alerta.estado===true &&
                    (<div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">

                        <AlertBootstrap colorAlert={this.state.alerta.color} mensaje={this.state.alerta.mensaje}/>
                        
                    </div>)
                }
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_asignacion_form">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-asignacion-form">
                            <span className="titulo-asignacion-form">Formulario de asignacion de especialidad medico</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-auto">
                            <ButtonIcon 
                            clasesBoton="btn btn-outline-success"
                            icon="icon-plus"
                            id="icon-plus"
                            eventoPadre={this.agregar}
                            />
                        </div>
                    </div>
                    <form  id="formulario_asignacion" >
                        <div className="row justify-content-center">
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            nombreCampo="Codigo Registro:"
                            activo="no"
                            type="text"
                            value={this.state.id_asignacion_medico_especialidad}
                            name="id_asignacion_medico_especialidad"
                            id="id_asignacion_medico_especialidad"
                            placeholder="Codigo aisgnacion"
                            />
                            <ComponentFormSelect
                            clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                            obligatorio="si"
                            mensaje={this.state.msj_id_medico}
                            nombreCampoSelect="Medico:"
                            clasesSelect="custom-select"
                            name="id_medico"
                            id="id_medico"
                            eventoPadre={this.cambiarEstado}
                            defaultValue={this.state.id_medico}
                            option={this.state.medicos}
                            />
                            <ComponentFormSelect
                            clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                            obligatorio="si"
                            mensaje={this.state.msj_id_especialidad}
                            nombreCampoSelect="Especialidad:"
                            clasesSelect="custom-select"
                            name="id_especialidad"
                            id="id_especialidad"
                            eventoPadre={this.cambiarEstado}
                            defaultValue={this.state.id_especialidad}
                            option={this.state.especialidades}
                            />
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormRadioState
                            clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            extra="custom-control-inline"
                            nombreCampoRadio="Estatus:"
                            name="estatu_asignacion"
                            nombreLabelRadioA="Activo"
                            idRadioA="activoA"
                            checkedRadioA={this.state.estatu_asignacion}
                            valueRadioA="1"
                            nombreLabelRadioB="Inactivo"
                            idRadioB="activoB"
                            valueRadioB="0"
                            eventoPadre={this.cambiarEstado}
                            checkedRadioB={this.state.estatu_asignacion}
                            />
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-auto">
                                {this.props.match.params.operacion==="registrar" &&
                                    <InputButton 
                                    clasesBoton="btn btn-primary"
                                    id="boton-registrar"
                                    value="registrar"
                                    eventoPadre={this.operacion}
                                    />
                                }
                                {this.props.match.params.operacion==="actualizar" &&
                                    <InputButton 
                                    clasesBoton="btn btn-warning"
                                    id="boton-actualizar"
                                    value="actualizar"
                                    eventoPadre={this.operacion}
                                    />   
                                }
                            </div>
                            <div className="col-auto">
                                <InputButton 
                                clasesBoton="btn btn-danger"
                                id="boton-cancelar"
                                value="cancelar"
                                eventoPadre={this.regresar}
                                />   
                            </div>
                        </div>
                    
                    </form>
                
                
                </div>
            </div>
        )

        return (
            <div className="component_asignacion_form">
                <ComponentDashboard
                componente={component}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />
            </div>
        )
    }

}

export default withRouter(ComponentAsignacionEspecialidadMedicoForm)