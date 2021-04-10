import React from 'react'
import {withRouter} from 'react-router-dom'

//JS
import axios from 'axios'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import "../css/componentListaAsistencia.css"
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'
import ButtonIcon from '../subComponentes/buttonIcon'
import AlertBootstrap from "../subComponentes/alertBootstrap"

class ComponentListaAsistencia extends React.Component{

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.state={
            modulo:"",// modulo menu
            estado_menu:false,
            //----------
            asistencias:[],
            alerta:{
                color:null,
                mensaje:null,
                estado:false
            }
        }
    }

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

    async componentWillMount(){
        await this.consultarAsistencia()
    }

    async consultarAsistencia(){
        await axios.get(`http://localhost:8080/transaccion/asistencia/consultar-asistencia-hoy`)
        .then(repuesta => {
            let json=JSON.parse(JSON.stringify(repuesta.data))
            console.log(json)
            this.setState({asistencias:json.asistencias})
        })
        .catch(error => {
            console.log("error al conectar con el servidor")
        })
    }
    // bg-primary

    render(){

        const component=(
            <div className="row justify-content-center">
                {this.state.alerta.estado===true &&
                    (<div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">

                        <AlertBootstrap colorAlert={this.state.alerta.color} mensaje={this.state.alerta.mensaje}/>
                        
                    </div>)
                }
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_formulario_cam">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-cam">
                            <span className="titulo-form-cam">Lista Asistencia</span>
                        </div>
                    </div>

                    <table className="table table-bordered table-hover table-dark">
                        <thead>
                            <tr>
                            <th scope="col">cedula</th>
                            <th scope="col">Nombre Trabajador</th>
                            <th scope="col">Cumplimiento H.</th>
                            <th scope="col">Estado Asistencia</th>
                            </tr>
                        </thead>
                        <tbody>
                           {this.state.asistencias.map((asistencia,index) => {
                               return(
                                <tr>
                                    <td>{asistencia.id_cedula}</td>
                                    <td>{asistencia.nombres} {asistencia.apellidos}</td>
                                    <td className={(asistencia.estatu_cumplimiento_horario==="C")?"bg-success":"bg-danger"}>{(asistencia.estatu_cumplimiento_horario==="C")?"cumplio con el horario":"no cumplio con el horario"}</td>
                                    <td className={(asistencia.estatu_asistencia==="P")?"bg-success":(asistencia.estatu_asistencia==="II")?"bg-danger":"bg-primary"}>{(asistencia.estatu_asistencia==="P")?"Presente":(asistencia.estatu_asistencia==="II")?"Inasistencia injustificada":(asistencia.estatu_asistencia==="IJP")?"Inasistencia justificada por permiso":"Inasistencia justificada por reposo"}</td>
                                </tr>
                               )
                            })
                           }
                        </tbody>
                    </table>

                </div>
            </div>
        )

        return (

            <div className="component_lista_asistencia">
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

export default withRouter(ComponentListaAsistencia)