import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentLapso.css'
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

class ComponentLapso extends React.Component{

    constructor(){
        super();
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.regresarHaLapsosPlanificacion=this.regresarHaLapsosPlanificacion.bind(this);
        this.state={
            modulo:"",
            estado_menu:false,
            // ------
            id_lapso:null,
            listaObjetivos:[],

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
        this.setState({id_lapso:this.props.match.params.id_lapso})
        await this.consultarObjetivos()
    }

    async consultarObjetivos(){
        await axiosCustom.get(
            `transaccion/planificacion-lapso-escolar/consultar-todos-objetivo/${this.props.match.params.id_lapso}`
        )
        .then(respuesta=>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
            this.setState({listaObjetivos:json.datos})
        })
        .catch(error => {
            let alerta=JSON.parse(JSON.stringify(this.state.alerta))
            alerta.color="danger"
            alerta.mensaje="error al conectarse con el servidor"
            alerta.estado=true
            this.setState({alerta})
        })
    }

    regresarHaLapsosPlanificacion(){
        const {id_planificacion} =this.props.match.params
        this.props.history.push(`/dashboard/transaccion/planificacion/${id_planificacion}/lapso`)
    }

    render(){
        const jsx=(
            <div>
                {this.state.alerta.estado===true &&
                    (<div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">

                        <AlertBootstrap colorAlert={this.state.alerta.color} mensaje={this.state.alerta.mensaje}/>
                        
                    </div>)
                }
                <button className='btn btn-primary' onClick={this.regresarHaLapsosPlanificacion}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                    </svg>
                </button>
                <h2 className='titulo-modulo-lapso'>lapso {this.props.match.params.id_lapso}</h2>
                <div className='contenedor-lapso pt-5 pb-5'>
                    <form id="formularioLapso" className='mb-5'>
                        <div class="form-group row justify-content-center">
                            <label className="col-auto col-form-label">Descripción del objetivo:</label>
                            <div className="col-3">
                                <input type="text" className="form-control" placeholder='Descripción del objetivo' id="descripcion_objetivo_academico" name="descripcion_objetivo_academico"/>
                            </div>
                            <div className='col-auto'>
                                <button className='btn btn-primary' >Guardar</button>
                            </div>
                        </div>
                        <input type="hidden" id="estatu_objetivo_lapso_academico" name="estatu_objetivo_lapso_academico" value="1"/>
                        <input type="hidden" id="id_planificacion" name="id_planificacion" value={this.props.match.params.id_planificacion}/>
                    </form>
                    <form id="formularioPlanificaionLapso" className='mb-5'>
                        <div class="form-group row justify-content-center">
                            <label className="col-auto col-form-label">Estado de la planificaión:</label>
                            <div className='col-3'>
                                <select className='form-control'>
                                    <option value="1">En desarrollo</option>
                                    <option value="2">Listo para usarse</option>
                                </select>
                            </div>
                            <div className='col-auto'>
                                <button className='btn btn-primary' >Guardar</button>
                            </div>
                        </div>
                        <input type="hidden" id="estatu_objetivo_lapso_academico" name="estatu_objetivo_lapso_academico" value="1"/>
                        <input type="hidden" id="id_planificacion" name="id_planificacion" value={this.props.match.params.id_planificacion}/>
                    </form>
                    <h2 className='titulo-modulo-lapso-negro mb-3'>Lista de objetivos</h2>
                    <div className='row justify-content-center'>
                        <div className='col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9'>
                            <table className="table table-hover table-dark ">
                                <thead>
                                    <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Nombre del objetivo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {this.state.listaObjetivos.map((objetivo, index) => {
                                    return (
                                        <tr key={index}>
                                            <th scope="row">{index+1}</th>
                                            <td>{objetivo.descripcion_objetivo_academico}</td>
                                            <td>
                                                <button className='btn btn-danger'data-id-objetivo={objetivo.id_objetivo_lapso_academico} >Eliminar</button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                {this.state.listaObjetivos.length===0 && 
                                    (
                                        <tr >
                                            <td colspan="3"><center>Sin Objetivos Registrados</center></td>
                                        </tr>
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
        return (
            <div className="component_lapso_planificaion">
                    
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

export default withRouter(ComponentLapso);