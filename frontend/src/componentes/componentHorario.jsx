import React from 'react';
import {withRouter} from 'react-router-dom'
import axios from 'axios'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentHorario.css'
//componentes
import ComponentDashboard from './componentDashboard'
// sub componentes
import AlertBootstrap from "../subComponentes/alertBootstrap"
import TituloModulo from '../subComponentes/tituloModulo'
import ComponentTablaDatos from '../subComponentes/componentTablaDeDatos'
import ButtonIcon from '../subComponentes/buttonIcon'
import InputButton from '../subComponentes/input_button'
import Tabla from '../subComponentes/componentTabla'


class ComponentHorario extends React.Component{

    constructor(){
        super();
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.redirigirFormulario=this.redirigirFormulario.bind(this);
        this.actualizarElementoTabla=this.actualizarElementoTabla.bind(this);
        this.state={
            registros:[],
            numeros_registros:0,
            //////
            modulo:"",
            estado_menu:false,
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

    async UNSAFE_componentWillMount(){
        let datos=await this.consultarTodosLosHorarios()
        this.setState(this.verficarLista(datos))
        
        // if(this.props.match.params.mensaje){

        // }
    }

    async consultarTodosLosHorarios(){
        let datos=[]
        await axios.get("http://localhost:8080/configuracion/horario/consultar-todos")
        .then(respuesta => {
            let json=JSON.parse(JSON.stringify(respuesta.data))
            // console.log("datos =>>>> ",json)
            datos=json.horarios
        })
        .catch(error => {
            console.log("error al conectar con el servidor")
        })
        return datos
    }

    verficarLista(json_server_response){
        if(json_server_response.length===0){
            json_server_response.push({
                id_horario:"0",
                horario_descripcion:"vacio",
                horario_entrada:"--:--",
                horario_salida:"--:--"
            })
            return {registros:json_server_response,numeros_registros:0}
        }
        else{
            return {
            registros:json_server_response,
            numeros_registros:json_server_response.length
            }
        } 
    }


    cambiarEstado($inputSelect){
        let $input=$inputSelect.target;
        // alert($input.name)
        this.setState({[$input.name]:$input.value})
    }

    redirigirFormulario(){
        this.props.history.push("/dashboard/configuracion/horario/registrar")
    }
    
    actualizarElementoTabla(a){
        const boton=a.target
        this.props.history.push(`/dashboard/configuracion/horario/actualizar/${boton.id}`)
    }
    // <Tabla 
    // tabla_encabezado={jsx_tabla_encabezado}
    // tabla_body={jsx_tabla_body}
    // numeros_registros={this.state.numeros_registros}
    // />

    render(){
        const jsx_tabla_encabezado=(
            <thead> 
                <tr> 
                  <th>Codigo</th> 
                  <th>descripción</th>
                  <th>horario entrada</th>
                  <th>horario salida</th>
                  </tr> 
            </thead>
        )

        const jsx_tabla_body=(
            <tbody>
                {this.state.registros.map((horario,index)=>{
                    return(
                        <tr key={index}>
                            <td>{horario.id_horario}</td>
                            <td>{horario.horario_descripcion}</td>
                            <td>{horario.horario_descripcion}</td>
                            <td>{horario.horario_entrada}</td>
                            <td>{horario.horario_salida}</td>
                            {!horario.vacio &&
                                <td>
                                    <ButtonIcon 
                                    clasesBoton="btn btn-warning btn-block" 
                                    value={horario.id_horario} 
                                    id={horario.id_horario}
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
            <div >
                {this.state.alerta.estado===true &&
                    (<div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">

                        <AlertBootstrap colorAlert={this.state.alerta.color} mensaje={this.state.alerta.mensaje}/>
                        
                    </div>)
                }
                <TituloModulo clasesrow="row" clasesColumna="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center" tituloModulo="Modulo Horario"/>
                

                <div className="row component-tabla-de-datos">
                <div className="col-12 col-ms-12 col-md-12 contenedor-tabla-de-datos">
                    <Tabla 
                    tabla_encabezado={jsx_tabla_encabezado}
                    tabla_body={jsx_tabla_body}
                    numeros_registros={this.state.numeros_registros}
                    />
                </div>     
            </div>



                <div className="row">
                    <div className="col-3 col-ms-3 col-md-3 columna-boton">
                        <div className="row justify-content-center align-items-center contenedor-boton">
                            <div className="col-auto">
                                <InputButton clasesBoton="btn btn-primary" eventoPadre={this.redirigirFormulario} value="registrar"/>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )


        return(
            <div className="component_horario_inicio">
                    
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

export default withRouter(ComponentHorario);