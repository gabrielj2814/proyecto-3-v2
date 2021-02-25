import React from "react"
import {withRouter} from 'react-router-dom'
import axios from 'axios'

// css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import "../css/componentAsignacionEspecialidadMedico.css"
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes 
import TituloModulo from '../subComponentes/tituloModulo'
import ButtonIcon from '../subComponentes/buttonIcon'
import ComponentFormSelect from '../subComponentes/componentFormSelect';
import InputButton from '../subComponentes/input_button'
import Tabla from '../subComponentes/componentTabla'

class ComponentAsignacionEspecialidadMedico extends React.Component{

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.consultarAsignacionesMedico=this.consultarAsignacionesMedico.bind(this)
        this.redirigirFormulario=this.redirigirFormulario.bind(this)
        this.eliminarElementoTabla=this.eliminarElementoTabla.bind(this)
        this.actualizarElementoTabla=this.actualizarElementoTabla.bind(this)
        this.consultarElementoTabla=this.consultarElementoTabla.bind(this)
        this.state={
            modulo:"",
            estado_menu:false,
            //------------ 
            medicos:[],
            registros:[],
            id_medico:"",
            numeros_registros:0,
            msj_id_medico:{
                mensaje:"",
                color_texto:""
            },
            mensaje:{
                texto:"",
                estado:""
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
        let medicos=await this.consultarTodosLosMedicos()
        let listaMedico=this.formatoOptionSelect(medicos)
        this.setState({
            medicos:listaMedico,
            id_medico:(listaMedico.length===0)?null:listaMedico[0].id
        })
        console.log("medicos ->>>> ",medicos)
        let asignacionesPorMedico=await this.consultarSignacionesPorMedico(this.state.id_medico)
        let datos=this.verficarLista(asignacionesPorMedico)
        console.log(datos)
        this.setState(datos)
        
        console.log("asignaciones ->>>> ",asignacionesPorMedico)
        if(this.props.match.params.mensaje){
            // alert("mensaje")
            const msj=JSON.parse(this.props.match.params.mensaje)
            // alert("OK "+msj.texto)
            var mensaje=JSON.parse(JSON.stringify(this.state.mensaje))
            mensaje.texto=msj.texto
            mensaje.estado=msj.estado
            this.setState({mensaje:mensaje})
        }
    }

    async consultarSignacionesPorMedico(id){
        let datos=null
        await axios.get(`http://localhost:8080/configuracion/asignacion-medico-especialidad/consultar-asignacion-por-medico/${id}`)
        .then(repuesta => {
            datos=repuesta.data.medico_especialidad
        })
        .catch(error => {
            alert("No se pudo conectar con el servidor")
            console.log(error)
        })
        return datos
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

    cambiarEstado(a){
        var input=a.target;
        this.setState({[input.name]:input.value})
    }

    async consultarAsignacionesMedico(a){
        var input=a.target;
        this.setState({[input.name]:input.value})
        let asignaciones=await this.consultarSignacionesPorMedico(input.value)
        console.log("consultar asignaciones medico ->>>> ",asignaciones)
        let datos=this.verficarLista(asignaciones)
        console.log("datos -->>>>", datos)
        this.setState(datos)
    }

    verficarLista(json_server_response){
        if(json_server_response.length===0){
            json_server_response.push({
            id_estado:"0",
            nombre_medico:"vacio",
            apellido_medico:"",
            vacio:"vacio"
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


    /**
     * 
     * <Tabla 
                        tabla_encabezado={props.tabla_encabezado}
                        tabla_body={props.tabla_body}
                        numeros_registros={props.numeros_registros}
                        />
    */

   redirigirFormulario(){
        this.props.history.push("/dashboard/configuracion/asignacion-especialidad-medico/registrar")
    }

    eliminarElementoTabla(a){
        var input=a.target;
        alert("Eliminar -> "+input.id);
    }
  
  actualizarElementoTabla(a){
      var input=a.target;
      this.props.history.push("/dashboard/configuracion/asignacion-especialidad-medico/actualizar/"+input.id);
  }
  
  consultarElementoTabla(a){
      let input=a.target;
    //   alert("Consultar -> "+input.id);
      this.props.history.push("/dashboard/configuracion/asignacion-especialidad-medico/consultar/"+input.id);
  }

    render(){
        const jsx_tabla_encabezado=(
            <thead> 
                <tr> 
                  <th>Codigo</th> 
                  <th>Asignacion</th>
                </tr> 
            </thead>
        )

        const jsx_tabla_body=(
            <tbody>
                {this.state.registros.map((asignacion)=>{
                    return(
                        <tr key={asignacion.id_asignacion_medico_especialidad}>
                            <td>{asignacion.id_asignacion_medico_especialidad}</td>
                            <td>{asignacion.nombre_medico} {(asignacion.apellido_medico==="")?"":asignacion.apellido_medico+","} {asignacion.nombre_especialidad}</td>
                            {!asignacion.vacio &&
                                <td>
                                    <ButtonIcon 
                                    clasesBoton="btn btn-warning btn-block" 
                                    value={asignacion.id_asignacion_medico_especialidad} 
                                    id={asignacion.id_asignacion_medico_especialidad}
                                    eventoPadre={this.actualizarElementoTabla} 
                                    icon="icon-pencil"
                                    />
                                </td>
                            }
                        
                        {!asignacion.vacio &&
                            <td>
                                <ButtonIcon 
                                clasesBoton="btn btn-secondary btn-block" 
                                value={asignacion.id_asignacion_medico_especialidad}
                                id={asignacion.id_asignacion_medico_especialidad} 
                                eventoPadre={this.consultarElementoTabla} 
                                icon="icon-search"
                                />
                            </td>
                        }
                    </tr>
                    )
                })}
            </tbody>
        )

        const component=(
            <div>
            {this.state.mensaje.texto!=="" && (this.state.mensaje.estado==="500" || this.state.mensaje.estado==="404") &&
                    <div className="row">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <div className="alert alert-danger alert-dismissible ">
                        <p>Mensaje del Error: {this.state.mensaje.texto}</p>
                        <p>Estado del Error: {this.state.mensaje.estado}</p>
                        <button className="close" data-dismiss="alert">
                            <span>X</span>
                        </button>
                        </div>
                    </div>
                    </div>
                }

                <TituloModulo clasesrow="row" clasesColumna="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center" tituloModulo="Modulo de asignacion especialidad medico"/>
                <div className="row component-tabla-de-datos">
                    <div className="col-12 col-ms-12 col-md-12 contenedor-tabla-de-datos">
                        <div className="row">
                            <ComponentFormSelect
                            clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                            obligatorio="no"
                            mensaje={this.state.msj_id_medico}
                            nombreCampoSelect="Medico:"
                            clasesSelect="custom-select"
                            name="id_medico"
                            id="id_medico"
                            eventoPadre={this.consultarAsignacionesMedico}
                            defaultValue={this.state.id_medico}
                            option={this.state.medicos}
                            />
                        </div>
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
            <div className="component_asignacion_inicio">
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

export default withRouter(ComponentAsignacionEspecialidadMedico)