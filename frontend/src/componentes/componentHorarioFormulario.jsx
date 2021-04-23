import React from "react"
import {withRouter} from 'react-router-dom'
import axios from 'axios'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentHorarioFormulario.css'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'
import ButtonIcon from '../subComponentes/buttonIcon'
import ComponentFormCampo from '../subComponentes/componentFormCampo';
import ComponentFormTextArea from "../subComponentes/componentFormTextArea"
import ComponentFormSelect from "../subComponentes/componentFormSelect"
import ComponentFormRadioState from "../subComponentes/componentFormRadioState"
import AlertBootstrap from "../subComponentes/alertBootstrap"

class ComponentHorarioFormulario extends React.Component {

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.agregar=this.agregar.bind(this);
        this.operacion=this.operacion.bind(this);
        this.regresar=this.regresar.bind(this);
        this.state={
            modulo:"",
            estado_menu:false,
            // -------------------
            id_horario:"",
            horario_descripcion:"",
            horario_entrada:"",
            horario_salida:"",
            estatu_horario:"1",
            // -------------------
            horaEntrada:"01",
            minutoEntrada:"00",
            horaSalida:"01",
            minutoSalida:"00",
            periodoEntrada:"PM",
            periodoSalida:"AM",
            listHora:[],
            listMinuto:[],
            // -------------------
            msj_horario_descripcion:{
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
        // alert("hola")
        const {operacion} = this.props.match.params
        let listHora=[];
        let listMinuto=[];
        let contandor=1;
        while(contandor<=12){
            listHora.push((contandor<=9)?"0"+contandor:contandor);
            contandor++
        }
        let contandor2=0;
        while(contandor2<=59){
            listMinuto.push((contandor2<=9)?"0"+contandor2:contandor2);
            contandor2++
        }
        this.setState({
            listHora,
            listMinuto
        });

        if(operacion==="actualizar"){
            if(this.props.match.params.id){
                const {id} = this.props.match.params
                let datos =await this.consultarHorario(id)
            }
        }
        else{
            this.setState({
                horaEntrada:"01",
                minutoEntrada:"00",
                horaSalida:"01",
                minutoSalida:"00",
                periodoEntrada:"PM",
                periodoSalida:"AM",
            })
        }
    }

    async consultarHorario(id){
        let datos=[]
        const token=localStorage.getItem('usuario')
        await axios.get(`http://localhost:8080/configuracion/horario/consultar/${id}/${token}`)
        .then(repuesta => {
            const json=JSON.parse(JSON.stringify(repuesta.data))
            if(json.estado_peticion==="200"){
                this.setState(json.horario)
                this.setState({
                    horaEntrada:json.horario.horario_entrada.substr(0,2),
                    minutoEntrada:json.horario.horario_entrada.substr(3,2),
                    horaSalida:json.horario.horario_salida.substr(0,2),
                    minutoSalida:json.horario.horario_salida.substr(3,2),
                    periodoEntrada:json.horario.horario_entrada.substr(5,2),
                    periodoSalida:json.horario.horario_salida.substr(5,2),
                })
                document.getElementById("horaEntrada").value=json.horario.horario_entrada.substr(0,2)
                document.getElementById("minutoEntrada").value=json.horario.horario_entrada.substr(3,2)
                document.getElementById("periodoEntrada").value=json.horario.horario_entrada.substr(5,2)
                document.getElementById("horaSalida").value=json.horario.horario_salida.substr(0,2)
                document.getElementById("minutoSalida").value=json.horario.horario_salida.substr(3,2)
                document.getElementById("periodoSalida").value=json.horario.horario_salida.substr(5,2)
            }
            else{
                let alerta={
                    color:"danger",
                    mensaje:"no se encontro el horario consultado",
                    estado:true
                }
                this.props.history.push(`/dashboard/configuracion/horario${JSON.stringify(alerta)}`)
            }
            

        })
        .catch(error => {
            // console.log("error al conectar con el servidor")
            let alerta={
                color:"danger",
                mensaje:"error al conectar con el servidor",
                estado:true
            }
            this.props.history.push(`/dashboard/configuracion/horario${JSON.stringify(alerta)}`)
        })
    }

    insertatHorarioActual(horaio){
        let horaEntrada=horaio.horario_entrada[0]+horaio.horario_entrada[1];
        let minutoEntrada=horaio.horario_entrada[3]+horaio.horario_entrada[4];
        let periodoEntrada=horaio.horario_entrada[5]+horaio.horario_entrada[6];
        let horaSalida=horaio.horario_salida[0]+horaio.horario_salida[1];
        let minutoSalida=horaio.horario_salida[3]+horaio.horario_salida[4];
        let periodoSalida=horaio.horario_salida[5]+horaio.horario_salida[6];
        this.setState({
            horaEntrada,
            minutoEntrada,
            horaSalida,
            minutoSalida,
            periodoEntrada,
            periodoSalida,
        })
    }

    cambiarEstado(a){
        var input=a.target;
        this.setState({[input.name]:input.value})
    }

    agregar(){
        this.setState({
            id_horario:"",
            horario_descripcion:"",
            estatu_horario:"1",
            horaEntrada:"01",
            minutoEntrada:"00",
            horaSalida:"01",
            minutoSalida:"00",
            periodoEntrada:"PM",
            periodoSalida:"AM",
        })
        this.props.history.push("/dashboard/configuracion/horario/registrar")
    }

    operacion(){
        const {operacion}=this.props.match.params
        // alert("operacion")
        const token=localStorage.getItem('usuario')
        if(this.validarDescripcion()){
            if(operacion==="registrar"){
                // alert("registrando")
                let datosFormulario=new FormData(document.getElementById("formularioHoraio"))
                let datosFormatiados=this.extrarDatosDelFormData(datosFormulario)
                // console.log(datosFormatiados)
                const horaEntrada=`${datosFormatiados.horaEntrada}:${datosFormatiados.minutoEntrada}${datosFormatiados.periodoEntrada}`
                const horaSalida=`${datosFormatiados.horaSalida}:${datosFormatiados.minutoSalida}${datosFormatiados.periodoSalida}`
                let datos={
                    horario:{
                        id_horario:"",
                        horario_descripcion:datosFormatiados.horario_descripcion,
                        horario_entrada:horaEntrada,
                        horario_salida:horaSalida,
                        estatu_horario:datosFormatiados.estatu_horario
                    },
                    token
                }
                // console.log(datos)
                axios.post("http://localhost:8080/configuracion/horario/agregar-horario",datos)
                .then(repuesta => {
                    const json=JSON.parse(JSON.stringify(repuesta.data))
                    // console.log(json)
                    let alerta=JSON.parse(JSON.stringify(this.state.alerta))
                    if(json.estado_peticion==="200"){
                        alerta.color="success"
                        alerta.mensaje="registro completado"
                        alerta.estado=true
                        this.setState({alerta})
                    }
                    else{
                        alerta.color="danger"
                        alerta.mensaje="error al registrar"
                        alerta.estado=true
                        this.setState({alerta})

                    }
                })
                .catch(error => {
                    console.log("error al conectar con el servidor")
                })
            }
            else if(operacion==="actualizar"){
                let datosFormulario=new FormData(document.getElementById("formularioHoraio"))
                let datosFormatiados=this.extrarDatosDelFormData(datosFormulario)
                // console.log(datosFormatiados)
                const horaEntrada=`${datosFormatiados.horaEntrada}:${datosFormatiados.minutoEntrada}${datosFormatiados.periodoEntrada}`
                const horaSalida=`${datosFormatiados.horaSalida}:${datosFormatiados.minutoSalida}${datosFormatiados.periodoSalida}`
                let datos={
                    horario:{
                        id_horario:document.getElementById("id_horario").value,
                        horario_descripcion:datosFormatiados.horario_descripcion,
                        horario_entrada:horaEntrada,
                        horario_salida:horaSalida,
                        estatu_horario:datosFormatiados.estatu_horario
                    },
                    token
                }
                console.log(datos)
                axios.put(`http://localhost:8080/configuracion/horario/actualizar/${this.state.id_horario}`,datos)
                .then(repuesta => {
                    const json=JSON.parse(JSON.stringify(repuesta.data))
                    // console.log(json)
                    let alerta=JSON.parse(JSON.stringify(this.state.alerta))
                    if(json.estado_peticion==="200"){
                        alerta.color="success"
                        alerta.mensaje="actualización completada"
                        alerta.estado=true
                        this.setState({alerta})
                    }
                    else{
                        alerta.color="danger"
                        alerta.mensaje="error al actualizar"
                        alerta.estado=true
                        this.setState({alerta})
                    }
                })
                .catch(error => {
                    console.log("error al conectar con el servidor")
                })
            }
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


    // --------
    //  validaciones

    validarDescripcion(){
        let estado=false
        const $descripcionHorario=document.getElementById("horario_descripcion")
        let msj_horario_descripcion=JSON.parse(JSON.stringify(this.state.msj_horario_descripcion))
        if($descripcionHorario.value!==""){
            if(/[a-zA-Z]/.test($descripcionHorario.value) || /[0-9]/.test($descripcionHorario.value)){
                estado=true
                msj_horario_descripcion.mensaje=""
                msj_horario_descripcion.color_texto="rojo"
                this.setState({
                    msj_horario_descripcion
                })
            }
            else{
                msj_horario_descripcion.mensaje="no solo puede tener espacion en blanco"
                msj_horario_descripcion.color_texto="rojo"
                this.setState({
                    msj_horario_descripcion
                })
            }
        }
        else{
            msj_horario_descripcion.mensaje="este campo no puede estar vacio"
            msj_horario_descripcion.color_texto="rojo"
            this.setState({
                msj_horario_descripcion
            })
        }
        return estado
    }

    regresar(){
        this.props.history.push("/dashboard/configuracion/horario")
    }

    render(){
        const component=(
            <div className="row justify-content-center">
                {this.state.alerta.estado===true &&
                    (<div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">

                        <AlertBootstrap colorAlert={this.state.alerta.color} mensaje={this.state.alerta.mensaje}/>
                        
                    </div>)
                }
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_formulario_horario">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-horario">
                            <span className="titulo-form-horario">Formulario Horario</span>
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
                    <form id="formularioHoraio">
                        <div className="row justify-content-center">
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            nombreCampo="Código Horario:"
                            activo="no"
                            type="text"
                            value={this.state.id_horario}
                            name="id_horario"
                            id="id_horario"
                            placeholder="Codigo Horario"
                            />
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            obligatorio="si"
                            mensaje={this.state.msj_horario_descripcion}
                            nombreCampo="Descripción:"
                            activo="si"
                            type="text"
                            value={this.state.horario_descripcion}
                            name="horario_descripcion"
                            id="horario_descripcion"
                            placeholder="Descripción"
                            eventoPadre={this.cambiarEstado}
                            />
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>

                        </div>

                        <div className="row justify-content-center mb-3">
                        
                            <div className="PM-formulario col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div> Hora de entrada</div>
                                <select onChange={this.cambiarEstado} id="horaEntrada" name="horaEntrada" className="hora tiempo" value={this.state.horaEntrada}>
                                    {
                                        this.state.listHora.map(hora => {
                                            return(<option key={hora} value={hora}>{hora}</option>)
                                        })
                                    }
                                </select>
                                <div className="dosPuntos">:</div>
                                <select onChange={this.cambiarEstado} id="minutoEntrada" name="minutoEntrada" className="minito tiempo" value={this.state.minutoEntrada}>

                                {
                                    this.state.listMinuto.map(minuto => {
                                        return (<option key={minuto} value={minuto}>{minuto}</option>)
                                    })
                                }
                                
                                </select>
                                <select onChange={this.cambiarEstado} id="periodoEntrada"  name="periodoEntrada" className="periodo tiempo" value={this.state.periodoEntrada}>
                                    <option value="PM">PM</option>
                                    <option value="AM">AM</option>
                                </select>
                            </div>

                            <div className="AM-formulario col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div> Hora de salida</div>
                                <select onChange={this.cambiarEstado} id="horaSalida" name="horaSalida" className="hora tiempo" value={this.state.horaSalida}>
                                {
                                    this.state.listHora.map(hora => {
                                        return(<option key={hora} value={hora}>{hora}</option>)
                                    })
                                }
                                
                                </select>
                                <div className="dosPuntos">:</div>
                                <select onChange={this.cambiarEstado} id="minutoSalida" name="minutoSalida" className="minito tiempo" value={this.state.minutoSalida}>
                                {
                                    this.state.listMinuto.map(minuto => {
                                        return (<option key={minuto} value={minuto}>{minuto}</option>)
                                    })
                                }
                                </select>
                                <select onChange={this.cambiarEstado} id="periodoSalida" name="periodoSalida" className="periodo tiempo" value={this.state.periodoSalida}>
                                    <option value="PM">PM</option>
                                    <option value="AM">AM</option>
                                </select>
                            </div>
                            
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormRadioState
                            clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            extra="custom-control-inline"
                            nombreCampoRadio="Estatus:"
                            name="estatu_horario"
                            nombreLabelRadioA="Activo"
                            idRadioA="activoA"
                            checkedRadioA={this.state.estatu_horario}
                            valueRadioA="1"
                            nombreLabelRadioB="Inactivo"
                            idRadioB="activoB"
                            valueRadioB="0"
                            eventoPadre={this.cambiarEstado}
                            checkedRadioB={this.state.estatu_horario}
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
            <div className="component_cam_formulario">
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

export default withRouter(ComponentHorarioFormulario)