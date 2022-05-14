import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentLapsoPlanificaion.css'
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

class ComponentLapsoPlanificaion extends React.Component{

    constructor(){
        super();
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.regresarHaPlanificaiones=this.regresarHaPlanificaiones.bind(this);
        this.irHaLapso=this.irHaLapso.bind(this);
        this.state={
            modulo:"",
            estado_menu:false,
            // ------
            listaDeLapsos:[],
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

        let acessoModulo=await this.validarAccesoDelModulo("/dashboard/transaccion","/planificaion")
        if(acessoModulo){
            const {id_planificacion} =this.props.match.params
            await this.consultarLapsoPlanificacion(id_planificacion)
        }
        else{
            alert("No tienes acesso a este modulo(sera redirigido a la vista anterior)")
            this.props.history.goBack()
        }
    }

    async validarAccesoDelModulo(modulo,subModulo){
        // /dashboard/configuracion/acceso
        let estado = false
          if(localStorage.getItem("usuario")){
            var respuesta_servior=""
            const token=localStorage.getItem("usuario")
            await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/login/verificar-sesion${token}`)
            .then(async respuesta=>{
                respuesta_servior=respuesta.data
                if(respuesta_servior.usuario){
                  estado=await this.consultarPerfilTrabajador(modulo,subModulo,respuesta_servior.usuario.id_perfil)
                }  
            })
        }
        return estado
      }
  
      async consultarPerfilTrabajador(modulo,subModulo,idPerfil){
        let estado=false
        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/acceso/consultar/${idPerfil}`)
        .then(repuesta => {
            let json=JSON.parse(JSON.stringify(repuesta.data))
            // console.log("datos modulos =>>>",json)
            let modulosSistema={}
            let modulosActivos=json.modulos.filter( modulo => {
                if(modulo.estatu_modulo==="1"){
                    return modulo
                }
            })
            // console.log("datos modulos =>>>",modulosActivos);
            for(let medulo of modulosActivos){
                if(modulosSistema[medulo.modulo_principal]){
                    modulosSistema[medulo.modulo_principal][medulo.sub_modulo]=true
                }
                else{
                    modulosSistema[medulo.modulo_principal]={}
                    modulosSistema[medulo.modulo_principal][medulo.sub_modulo]=true
                }
            }
            console.log(modulosSistema)
            if(modulosSistema[modulo][subModulo]){
              estado=true
            }
            // this.setState({modulosSistema})
            
            
        })
        .catch(error =>  {
            console.log(error)
        })
        return estado
    }

    async consultarLapsoPlanificacion(idPlanificacion){
        await axiosCustom.get(
            `transaccion/planificacion-lapso-escolar/consultar-lapso/${idPlanificacion}`
        )
        .then(respuesta=>{
            console.log(respuesta)
            let json=JSON.parse(JSON.stringify(respuesta.data))
            console.log("->>>>>>>>>>",json)
            this.setState({listaDeLapsos:json.datos})
        })
        .catch(error => {
            let alerta=JSON.parse(JSON.stringify(this.state.alerta))
            alerta.color="danger"
            alerta.mensaje="Error al conectarse con el servidor"
            alerta.estado=true
            this.setState({alerta})
        })
    }

    regresarHaPlanificaiones(){
        this.props.history.push(`/dashboard/transaccion/planificacion`)
    }

    irHaLapso(a){
        let input=a.target
        const {id_planificacion} =this.props.match.params
        const id_lapso=input.getAttribute("data-id-lapso")
        const id_ano_escolar=input.getAttribute("data-id-ano-escolar")
        this.props.history.push(`/dashboard/transaccion/planificacion/${id_planificacion}/año-escolar/${id_ano_escolar}/lapso/${id_lapso}`)
    }

    render(){
        const jsx=(
            <div>
                 {this.state.alerta.estado===true &&
                    (<div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">

                        <AlertBootstrap colorAlert={this.state.alerta.color} mensaje={this.state.alerta.mensaje}/>
                        
                    </div>)
                }
                <button className='btn btn-primary' onClick={this.regresarHaPlanificaiones}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                    </svg>
                </button>
                <h2 className='titulo-modulo-lapso-planificaion'>lapsos Academico</h2>
                {this.state.listaDeLapsos.map((lapso,index) => {
                    return (
                        <div className="contenedor-lapso" key={index} data-id-lapso={lapso.id_lapso_academico} data-id-ano-escolar={lapso.id_ano_escolar} onClick={this.irHaLapso}>
                            <div className='lapso' data-id-lapso={lapso.id_lapso_academico} data-id-ano-escolar={lapso.id_ano_escolar}>
                                <div class="nombre-lapso" data-id-lapso={lapso.id_lapso_academico} data-id-ano-escolar={lapso.id_ano_escolar}>Lapso {lapso.nombre_lapso_academico}</div>
                                <div class="estado-lapso" data-id-lapso={lapso.id_lapso_academico} data-id-ano-escolar={lapso.id_ano_escolar}> {(lapso.estatu_lapso_academico==="1")?
                                <button className='btn btn-warning'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
                                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                                    </svg>
                                </button>
                                :
                                <button className='btn btn-success'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check2" viewBox="0 0 16 16">
                                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                                    </svg>
                                </button>
                                }</div>
                            </div>
                        </div>
                    )
                })}
                
            </div>
        )
        return(
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

export default withRouter(ComponentLapsoPlanificaion);