import React from 'react';
import {withRouter} from 'react-router-dom'
import axios from 'axios'
// IP servidor
import servidor from '../ipServer.js'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import "../css/componentGrado.css"
//componentes
import ComponentDashboard from './componentDashboard'
// subComponent
import AlertBootstrap from "../subComponentes/alertBootstrap"
import InputButton from '../subComponentes/input_button'
import TituloModulo from '../subComponentes/tituloModulo'
import Tabla from '../subComponentes/componentTabla'
import ButtonIcon from '../subComponentes/buttonIcon'

const axiosCustom=axios.create({
    baseURL:`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/`
})

class ComponentGrado extends React.Component{


    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this)
        this.redirigirFormulario=this.redirigirFormulario.bind(this)
        this.actualizarElementoTabla=this.actualizarElementoTabla.bind(this)
        this.state={
            //////
            modulo:"",
            estado_menu:false,
            registros:[],
            // --------
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
        await this.consultarTodosLosGrados()
    }

    async consultarTodosLosGrados(){
        await axiosCustom.get("configuracion/grado/consultar-todos")
        .then(respuesta => {
            let repuestaServidor=JSON.parse(JSON.stringify(respuesta.data))
            console.log(repuestaServidor)
            this.setState({registros:repuestaServidor.datos})
        })
        .catch(error => {
            console.error("error =>>> ",error)
        })
    }

    redirigirFormulario(a){
        this.props.history.push("/dashboard/configuracion/grado/registrar")
    }
    
    actualizarElementoTabla(a){
        const input = a.target;
        this.props.history.push(`/dashboard/configuracion/grado/actualizar/${input.id}`)
    }

    render(){
        const jsx_tabla_encabezado=(
            <thead> 
                <tr> 
                  <th>Código</th> 
                  <th>Grado</th>
                  <th>Estatus</th>
                  </tr> 
            </thead>
        )

        const jsx_tabla_body=(
            <tbody>
                {this.state.registros.map((grado,index)=>{
                    return(
                        <tr key={index}>
                            <td>{grado.id_grado}</td>
                            <td>{grado.numero_grado}</td>
                            <td>{(grado.estatus_grado==="1")?"Activo":"Inactivo"}</td>
                            {!grado.vacio &&
                                <td>
                                    <ButtonIcon 
                                    clasesBoton="btn btn-warning btn-block" 
                                    value={grado.id_grado} 
                                    id={grado.id_grado}
                                    eventoPadre={this.actualizarElementoTabla} 
                                    icon="icon-pencil"
                                    />
                                </td>
                            }
                    </tr>
                    )
                })}
            </tbody>
        )

        const jsx=(
            <div>
                {this.state.alerta.estado===true &&
                    (<div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">

                        <AlertBootstrap colorAlert={this.state.alerta.color} mensaje={this.state.alerta.mensaje}/>
                        
                    </div>)
                }
                <TituloModulo clasesRow="row mb-5" clasesColumna="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center " tituloModulo="Módulo de Grado"/>
                
                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_tabla_grado">
                        <Tabla tabla_encabezado={jsx_tabla_encabezado} tabla_body={jsx_tabla_body} numeros_registros={this.state.registros.length}/>
                    </div>
                </div>
                <div className="row">
                
                  <div className="col-3 col-ms-3 col-md-3 columna-boton">
                      <div className="row justify-content-center align-items-center contenedor-boton">
                        <div className="col-auto">
                          <InputButton clasesBoton="btn btn-primary" eventoPadre={this.redirigirFormulario} value="Registrar"/>
                        </div>
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

export default withRouter(ComponentGrado)