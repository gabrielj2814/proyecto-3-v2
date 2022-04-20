import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentProfesor.css'
//JS
import axios from 'axios'
import $ from 'jquery'
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

class ComponentProfesor extends React.Component {


    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this)
        this.redirigirFormulario=this.redirigirFormulario.bind(this)
        this.irAlFormularioDeActualizacion=this.irAlFormularioDeActualizacion.bind(this)
        this.mostrarModalPdf=this.mostrarModalPdf.bind(this)
        this.mostrarFiltros=this.mostrarFiltros.bind(this)
        this.generarPdf=this.generarPdf.bind(this)
        this.state={
            modulo:"",
            estado_menu:false,
            
            registros:[],
            //
            alerta:{
                color:null,
                mensaje:null,
                estado:false
            },
            // 
            tipoPdf:null,
            id_cedula:null,
            nombre_usuario:null,
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
        let acessoModulo=await this.validarAccesoDelModulo("/dashboard/configuracion","/profesor")
        if(acessoModulo){
            await this.consultarTodosProfesorTrabajador()
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
                    this.setState({id_cedula:respuesta_servior.usuario.id_cedula})
                    this.setState({nombre_usuario:respuesta_servior.usuario.nombre_usuario})
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

    async consultarTodosProfesorTrabajador(id){
        // const token=localStorage.getItem('usuario')
        await axiosCustom.get(`configuracion/profesor/consultar-todos`)
        .then(respuesta => {
            let json=JSON.parse(JSON.stringify(respuesta.data))
            console.log(">>>",json)
            this.setState({registros:json.datos})
        })
        .catch(error => {
            console.error("error al conectar con el servidor")
        })
    }

    redirigirFormulario(a){
        this.props.history.push("/dashboard/configuracion/profesor/registrar")
    }
    
    irAlFormularioDeActualizacion(a){
        let input=a.target
        this.props.history.push(`/dashboard/configuracion/profesor/actualizar/${input.id}`)
    }

    mostrarModalPdf(){
        $("#modalPdf").modal("show")
    }

    mostrarFiltros(a){
        let $select=a.target
        let $filaVerPdf=document.getElementById("filaVerPdf")
        $filaVerPdf.classList.add("ocultarFormulario")
        // alert($select.value)
        let $botonGenerarPdf=document.getElementById("botonGenerarPdf")
        if($select.value==="0"){
            $botonGenerarPdf.classList.remove("ocultarFormulario")
            this.setState({tipoPdf:"0"})
        }
        else if($select.value==="1"){
            this.setState({tipoPdf:"1"})
            $botonGenerarPdf.classList.remove("ocultarFormulario")
        }
        else{
            this.setState({tipoPdf:null})
            $botonGenerarPdf.classList.add("ocultarFormulario")
        }
    }

    generarPdf(){
        let $filaVerPdf=document.getElementById("filaVerPdf")
        // $filaVerPdf.classList.remove("ocultarFormulario") //esta line sirve para mostrar el boton para ver el pdf => usar en success
        // $filaVerPdf.classList.add("ocultarFormulario") //esta line sirve para ocultar el boton para ver el pdf => usar en error
        let datos=[]
        // console.log(datos)
        datos.push({name:"nombre_usuario",value:this.state.nombre_usuario})
        datos.push({name:"tipo_matricula",value:this.state.tipoPdf})
        datos.push({name:"cedula_usuario",value:this.state.id_cedula})
        console.log(datos)
        if(datos!==null){
          // alert("generar pdf")
          $.ajax({
            url: `http://${servidor.ipServidor}:${servidor.servidorApache.puerto}/proyecto/backend/controlador_php/controlador_lista_profesor.php`,
            type:"post",
            data:datos,
            success: function(respuesta) {
                console.log(respuesta)
                let json=JSON.parse(respuesta)
                console.log("datos reporte martricula =>>>> ",json)
                if(json.nombrePdf!=="false"){
                    $filaVerPdf.classList.remove("ocultarFormulario") 
                    document.getElementById("linkPdf").href=`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/reporte/${json.nombrePdf}`
                }
                else{
                    $filaVerPdf.classList.add("ocultarFormulario") 
                    alert("no se pudo generar el pdf por que no hay registros que coincidan con los datos enviados")
                }
            },
            error: function() {
            //   alert("error")
              $filaVerPdf.classList.add("ocultarFormulario") 
            }
          });
        }
    }



    render(){

        const jsx_tabla_encabezado=(
            <thead> 
                <tr> 
                    <th>Código</th> 
                    <th>Nombre del profesor</th>
                    <th>Estatus</th>
                </tr> 
            </thead>
        )

        const jsx_tabla_body=(
            <tbody>
                {this.state.registros.map((profesor,index)=>{
                    return(
                        <tr key={index}>
                            <td>{profesor.id_profesor}</td>
                            <td>{profesor.nombres} {profesor.apellidos}</td>
                            <td>{(profesor.estatus_profesor==="1")?"Activo":"Inactivo"}</td>
                            <td>
                                <ButtonIcon 
                                clasesBoton="btn btn-warning btn-block" 
                                value={profesor.id_profesor} 
                                id={profesor.id_profesor}
                                eventoPadre={this.irAlFormularioDeActualizacion} 
                                icon="icon-pencil"
                                />
                            </td>
                    </tr>
                    )
                })}
            </tbody>
        )
        const jsx=(
            <div>
                <div class="modal fade" id="modalPdf" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg" role="document">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Reporte pdf</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                            <div className="row justify-content-center mb-3">
                                <div className="col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5">
                                  <div class="form-groud">
                                    <label>Tipo de Reporte</label>
                                    <select class="form-select custom-select" aria-label="Default select example" onChange={this.mostrarFiltros}>
                                      <option value="null" >Seleccione un Tipo de Reporte</option>
                                      <option value="1" >Generar una Lista</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                             
                              <div id="filaVerPdf" className="row justify-content-center ocultarFormulario">
                                  <div className="col-auto">
                                    <a className="btn btn-success" id="linkPdf" target="_blank" href="#">Ver pdf</a>
                                  </div>
                              </div>
                              
                            </div>
                            <div class="modal-footer ">
                                <button type="button" id="botonGenerarPdf" class="btn btn-success ocultarFormulario" onClick={this.generarPdf}>Generar pdf</button>
                            </div>
                            </div>
                        </div>
                  </div>

                {this.state.alerta.estado===true &&
                    (<div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">

                        <AlertBootstrap colorAlert={this.state.alerta.color} mensaje={this.state.alerta.mensaje}/>
                        
                    </div>)
                }
                <TituloModulo clasesRow="row mb-5" clasesColumna="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center" tituloModulo="Módulo Profesor"/>

                <div className="row">
                    <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_tabla_aula">
                        <Tabla tabla_encabezado={jsx_tabla_encabezado} tabla_body={jsx_tabla_body} numeros_registros={this.state.registros.length}/>
                    </div>
                </div>
                
                <div className="row justify-content-between">
                
                    <div className="col-3 col-ms-3 col-md-3 columna-boton">
                      <div className="row justify-content-center align-items-center contenedor-boton">
                        <div className="col-auto">
                          <InputButton clasesBoton="btn btn-primary" eventoPadre={this.redirigirFormulario} value="Registrar"/>
                        </div>
                      </div>
                    </div>
                    <div className="col-3 col-ms-3 col-md-3 columna-boton">
                        <div className="row justify-content-center align-items-center contenedor-boton">
                            <div className="col-auto">
                                <InputButton clasesBoton="btn btn-danger" eventoPadre={this.mostrarModalPdf} value="pdf"/>
                            </div>
                        </div>
                    </div>
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

export default withRouter(ComponentProfesor)