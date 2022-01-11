import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentPlanificacionLapsoEscolar.css'
//JS
import axios from 'axios'
// IP servidor
import servidor from '../ipServer.js'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import AlertBootstrap from "../subComponentes/alertBootstrap"
import InputButton from '../subComponentes/input_button'
import TituloModulo from '../subComponentes/tituloModulo'
import Tabla from '../subComponentes/componentTabla'
import ButtonIcon from '../subComponentes/buttonIcon'

const axiosCustom=axios.create({
    baseURL:`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/`
})

class ComponentPlanificacionLapsoEscolar extends React.Component{


    constructor(){
        super();
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.state={
            modulo:"",
            estado_menu:false,
            // ------
            id_cedula:null,
            planificaciones:[],
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
        await this.obtenerDatosDeLasesion();
        await this.generarPlanificaion();
        await this.obtenerPlanificaion();
        await this.generarLapso();
    }

    async generarPlanificaion(){
        await axiosCustom.post(
            `transaccion/planificacion-lapso-escolar/crear-planificacion`,
            {id_cedula:this.state.id_cedula}
        )
        .then(respuesta=>{
            console.log(respuesta)
            let json=JSON.parse(JSON.stringify(respuesta.data))
            if(json.datos.length===0 && json.color_alerta==="danger"){
                let alerta=JSON.parse(JSON.stringify(this.state.alerta))
                alerta.color="danger"
                alerta.mensaje=json.mensaje
                alerta.estado=true
                this.setState({alerta})
            }
            // console.log(json)
        })
        .catch(error => {
            let alerta=JSON.parse(JSON.stringify(this.state.alerta))
            alerta.color="danger"
            alerta.mensaje="error al conectarse con el servidor"
            alerta.estado=true
            this.setState({alerta})
        })
    }
    
    async generarLapso(){
        await axiosCustom.post(
            `transaccion/planificacion-lapso-escolar/crear-lapso`,
            {id_cedula:this.state.id_cedula}
        )
        .then(respuesta=>{
            console.log(respuesta)
            let json=JSON.parse(JSON.stringify(respuesta.data))
            console.log("=>>>>>>>>>>>>>>>>>>>>>>",json)
        })
        .catch(error => {
            let alerta=JSON.parse(JSON.stringify(this.state.alerta))
            alerta.color="danger"
            alerta.mensaje="error al conectarse con el servidor"
            alerta.estado=true
            this.setState({alerta})
        })
    }

    async obtenerPlanificaion(){
        await axiosCustom.get(
            `transaccion/planificacion-lapso-escolar/consultar-planificacion/${this.state.id_cedula}`
        )
        .then(respuesta=>{
            console.log(respuesta)
            let json=JSON.parse(JSON.stringify(respuesta.data))
            console.log(json)
            if(json.datos.length>0){
               this.setState({planificaciones:json.datos})
            }
        })
        .catch(error => {
            let alerta=JSON.parse(JSON.stringify(this.state.alerta))
            alerta.color="danger"
            alerta.mensaje="error al conectarse con el servidor"
            alerta.estado=true
            this.setState({alerta})
        })
    }

    async obtenerDatosDeLasesion(){
        const token=localStorage.getItem("usuario")
        await axiosCustom.get(`login/verificar-sesion${token}`)
        .then(respuesta=>{
            let respuesta_servior=respuesta.data
            if(respuesta_servior.usuario){
                this.setState({
                    id_cedula:respuesta_servior.usuario.id_cedula,
                })
            }
        })
        .catch(error => {
            let alerta=JSON.parse(JSON.stringify(this.state.alerta))
            alerta.color="danger"
            alerta.mensaje="error al conectarse con el servidor"
            alerta.estado=true
            this.setState({alerta})
        })
    }

    render(){
        const jsx=(
            <div>
                {this.state.alerta.estado===true &&
                    (<div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">

                        <AlertBootstrap colorAlert={this.state.alerta.color} mensaje={this.state.alerta.mensaje}/>
                        
                    </div>)
                }
                <h2 className='titulo-modulo-planificacaion'>Planificaiones de lapso academico</h2>
                <div className="contenedor_planificacion_lapso_academico">

                        {this.state.planificaciones.map((planificaion,index) => {
                            return(
                                <div key={index} className='boton-planificacion' id={planificaion.id_planificacion_lapso_escolar}>
                                    <div className='texto-boton-planificacion'>Plan: {planificaion.ano_desde}-{planificaion.ano_hasta}</div>
                                </div>
                            )
                        })

                        }
                </div>

            </div>
        )
        return (
            <div className="component_profesor">
                    
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

export default withRouter(ComponentPlanificacionLapsoEscolar);