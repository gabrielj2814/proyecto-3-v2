import React from 'react';
import {withRouter} from 'react-router-dom'
import axios from 'axios'
// IP servidor
import servidor from '../ipServer.js'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import "../css/componentAula.css"
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


class ComponentAula extends React.Component{

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this)
        this.redirigirFormulario=this.redirigirFormulario.bind(this)
        this.consultarAulasPorGrado=this.consultarAulasPorGrado.bind(this)
        this.irAlFormularioDeActualizacion=this.irAlFormularioDeActualizacion.bind(this)
        this.state={
            //////
            modulo:"",
            estado_menu:false,
            registros:[],
            grados:[],
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
        let acessoModulo=await this.validarAccesoDelModulo("/dashboard/configuracion","/aula")
        if(acessoModulo){
            await this.consultarTodosLosGrados()
            await this.consultarTodosLasAulas()
        }
        else{
            alert("no tienes acesso a este modulo(sera redirigido a la vista anterior)")
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

    redirigirFormulario(a){
        this.props.history.push("/dashboard/configuracion/aula/registrar")
    }

    irAlFormularioDeActualizacion(a){
        let input=a.target
        this.props.history.push(`/dashboard/configuracion/aula/actualizar/${input.id}`)
    }

    async consultarTodosLasAulas(){
        await axiosCustom.get("configuracion/aula/consultar-todos")
        .then(respuesta => {
            let repuestaServidor=JSON.parse(JSON.stringify(respuesta.data))
            let secciones =  repuestaServidor.datos.sort( (a, b) => parseInt(a.numero_grado) - parseInt(b.numero_grado) )
            this.setState({registros:secciones})
        })
        .catch(error => {
            console.error("error =>>> ",error)
        })
    }

    async consultarTodosLosGrados(){
        await axiosCustom.get("configuracion/grado/consultar-todos")
        .then(respuesta => {
            let repuestaServidor=JSON.parse(JSON.stringify(respuesta.data))
            this.setState({grados:repuestaServidor.datos})
        })
        .catch(error => {
            console.error("error =>>> ",error)
        })
    }

    async consultarAulasPorGrado(){
        const idGrado=document.getElementById("selectGradoFiltro").value
        // alert(IdGrado)
        if(idGrado!="null"){
            await axiosCustom.get(`configuracion/aula/consultar-aula-por-grado/${idGrado}`)
            .then(respuesta => {
                let repuestaServidor=JSON.parse(JSON.stringify(respuesta.data))
                console.log(repuestaServidor)
                this.setState({registros:repuestaServidor.datos})
            })
            .catch(error => {
                console.error("error =>>> ",error)
            })
        }
        else{
            await this.consultarTodosLasAulas()
        }
    }

    render(){
        const jsx_tabla_encabezado=(
            <thead>
                <tr>
                    <th>Nombre Aula</th>
                    <th>Número de Grado</th>
                    <th>Estatus</th>
                </tr>
            </thead>
        )

        const jsx_tabla_body=(
            <tbody>
                {this.state.registros.map((aula,index)=>{
                    return(
                        <tr key={index}>
                            <td>{aula.nombre_aula}</td>
                            <td>{aula.numero_grado}</td>
                            <td>{(aula.estatus_aula==="1")?"Activo":"Inactivo"}</td>
                            {!aula.vacio &&
                                <td>
                                    <ButtonIcon
                                    clasesBoton="btn btn-warning btn-block"
                                    value={aula.id_aula}
                                    id={aula.id_aula}
                                    eventoPadre={this.irAlFormularioDeActualizacion}
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
                <TituloModulo clasesRow="row mb-5" clasesColumna="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center" tituloModulo="Módulo de Sección"/>

                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_tabla_aula">
                        <div className="row">
                            <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3 mb-3">
                                <div class="form-groud">
                                        <label>Grado</label>
                                        <select class="form-select custom-select" id="selectGradoFiltro" name="selectGradoFiltro" aria-label="Default select example" onChange={this.consultarAulasPorGrado}>
                                            <option value="null" >Seleccione un grado escolar</option>
                                            {this.state.grados.map((grado,index) => {
                                                return <option key={index} value={grado.id_grado} >{grado.numero_grado}</option>
                                            })}
                                        </select>
                                  </div>
                            </div>
                        </div>
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
            <div className="component_aula">

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

export default withRouter(ComponentAula)
