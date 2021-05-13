import React from "react"

import {withRouter} from "react-router-dom"

//JS
import axios from 'axios'
import $ from 'jquery'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import "../css/componentBitacora.css"
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

class ComponentBitacora extends React.Component {

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this)
        this.mostrarFiltros=this.mostrarFiltros.bind(this)
        this.conultarOperaciones=this.conultarOperaciones.bind(this)
        this.state={
            modulo:"",// modulo menu
            estado_menu:false,
            //---------- 
            tablas:[
                {name:"ttipotrabajador",value:"tipo de trabajador"},
                {name:"thorario",value:"horario"},
                {name:"tfunciontrabajador",value:"funcipon trabajador"},
                {name:"ttrabajador",value:"trabajador"},
                {name:"tpermiso",value:"permiso"},
                {name:"tpermisotrabajador",value:"permiso trabajador"},
                {name:"testado",value:"estado"},
                {name:"tciudad",value:"ciudad"},
                {name:"ttipocam",value:"tipo cam"},
                {name:"tcam",value:"cam"},
                {name:"tmedico",value:"medico"},
                {name:"tespecialidad",value:"especialidad"},
                {name:"tasignacionmedicoespecialidad",value:"asignación especialidad medico"},
                {name:"treposo",value:"reposo"},
                {name:"treposotrabajador",value:"reposo del trabajador"},
                {name:"tasistencia",value:"asistencia"},
                {name:"tcintillo",value:"cintillo"},
            ],
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

    mostrarFiltros(a){
        let $selectFiltro=a.target
        let $formFiltroList=document.getElementById("bitacoraLista")
        let $formFiltroEspecifico=document.getElementById("bitacoraEspecifico")
        if($selectFiltro.value==="1"){
            $formFiltroList.classList.remove("ocultar")
            $formFiltroEspecifico.classList.add("ocultar")
            document.getElementById("filaBotonGenerar").classList.remove("ocultar")
        }
        else if($selectFiltro.value==="0"){
            $formFiltroList.classList.add("ocultar")
            $formFiltroEspecifico.classList.remove("ocultar")
            document.getElementById("filaBotonGenerar").classList.remove("ocultar")
        }
        else{
            $formFiltroList.classList.add("ocultar")
            $formFiltroEspecifico.classList.add("ocultar")
            document.getElementById("filaBotonGenerar").classList.add("ocultar")
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

    buscar(nombre,lista){
        let contador=0
        let listaNueva=[]
        while(contador<lista.length){
            if(lista[contador].name===nombre){
                listaNueva.push(lista[contador].value)
            }
            contador++
        }
        return listaNueva
    }

    conultarOperaciones(){
        let $tipoDeConsulta=document.getElementById("tipoDeConsulta")
        let $tablaBitacora=document.getElementById("tablaBitacora")
        // $tablaBitacora.classList.remove("ocultar")
        let datos=null;
        let datosFinales={}
        if($tipoDeConsulta.value==="1"){
            // datos=this.extrarDatosDelFormData(new FormData(document.getElementById("bitacoraLista")))
            datos=$("#bitacoraLista").serializeArray()
            
        }
        else if($tipoDeConsulta.value==="0"){
            // datos=this.extrarDatosDelFormData(new FormData(document.getElementById("bitacoraEspecifico")))
            datos=$("#bitacoraEspecifico").serializeArray()
            datosFinales["id_cedula"]=datos[0].value
        }
        datosFinales["fecha_desde"]=datos[datos.length-1].value
        
        let tablas=(this.buscar("tablas",datos).length>0)?this.buscar("tablas",datos):false
        let operaciones=(this.buscar("operaciones",datos).length>0)?this.buscar("operaciones",datos):false
        // console.log(tablas)
        // console.log(operaciones)
        if(tablas.length>0){
            datosFinales["tablas"]=tablas
        }
        if(operaciones.length>0){
            datosFinales["operaciones"]=operaciones
        }
        
        console.log(datosFinales)
        let json={
            vitacora:datosFinales
        }

        axios.post("http://localhost:8080/transaccion/bitacora/consultar",json)
        .then(respuesta => {
            // alert("ok")
            let json=JSON.parse(JSON.stringify(respuesta.data))
            console.log(json)
        })
        .catch(error => {
            console.log(error)
        })
    }

    render(){
        const vista=(
            <div className="row justify-content-center">
                {this.state.alerta.estado===true &&
                    (<div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">

                        <AlertBootstrap colorAlert={this.state.alerta.color} mensaje={this.state.alerta.mensaje}/>
                        
                    </div>)
                }
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_formulario_bitacora">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-cam">
                            <span className="titulo-form-cam">Bitacora</span>
                        </div>
                    </div>
                    <div className="row justify-content-center mb-3">
                        <div className="col-auto text-center">
                            <div className="form-groud">
                                <label>Tipo de bitacora</label>
                                <select class="form-select custom-select" id="tipoDeConsulta" aria-label="Default select example" onChange={this.mostrarFiltros}>
                                    <option value="null" >seleccione</option>
                                    <option value="1" >generar una lista</option>
                                    <option value="0" >generar un especifico</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <form id="bitacoraLista" className="ocultar mb-3">
                        <div className="row justify-content-center">
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="form-groud">
                                    <label>Modulo</label>
                                    <select class="form-select custom-select" multiple id="tablas" name="tablas" aria-label="Default select example" >
                                        {this.state.tablas.map((tabla,index) => {
                                            return (<option key={"lista-"+index} value={tabla.name}>{tabla.value}</option>)
                                        })}
                                    </select>
                                </div>
                            </div>

                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="form-groud">
                                    <label>Operacion</label>
                                    <select class="form-select custom-select" multiple id="operaciones" name="operaciones" aria-label="Default select example" >
                                        <option value="INSERT" >Registrar</option>
                                        <option value="UPDATE" >Actualizar</option>
                                        <option value="SELECT" >Consulta</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="form-groud">
                                    <label>Fecha</label>
                                    <input type="date" id="fecha_desde" name="fecha_desde" className="form-control" />
                                </div>
                            </div>
                        </div>
                    </form>
                    <form id="bitacoraEspecifico" className="ocultar mb-3">
                        <div className="row justify-content-center">
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="form-groud">
                                    <label>Modulo</label>
                                    <input type="text" id="id_cedula" name="id_cedula" className="form-control" placeholder="cedula"/>
                                </div>
                            </div>
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="form-groud">
                                    <label>Modulo</label>
                                    <select class="form-select custom-select" multiple id="tablas" name="tablas" aria-label="Default select example" >
                                        {this.state.tablas.map((tabla,index) => {
                                            return (<option key={"especifico-"+index} value={tabla.name}>{tabla.value}</option>)
                                        })}
                                    </select>
                                </div>
                            </div>

                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="form-groud">
                                    <label>Operacion</label>
                                    <select class="form-select custom-select " multiple id="operaciones" name="operaciones" aria-label="Default select example" >
                                        <option value="INSERT" >Registrar</option>
                                        <option value="UPDATE" >Actualizar</option>
                                        <option value="SELECT" >Consulta</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="form-groud">
                                    <label>Fecha</label>
                                    <input type="date" id="fecha_desde" name="fecha_desde" className="form-control" />
                                </div>
                            </div>
                        </div>
                    </form>
                    <div id="filaBotonGenerar" className="row justify-content-center ocultar mb-3">
                        <div className="col-auto">
                            <button className="btn btn-success" onClick={this.conultarOperaciones}>Consultar</button>
                        </div>
                    </div>

                    <table id="tablaBitacora" className="tabla table table-dark table-striped table-bordered table-hover table-responsive-xl ocultar">
                        <thead> 
                            <tr> 
                                <th>Cedula</th> 
                                <th>Modulo</th>
                                <th>Operacion</th>
                                <th>Aquien</th>
                            </tr> 
                        </thead>
                        <tbody>
                            <tr>
                                <td>a</td>
                                <td>a</td>
                                <td>a</td>
                                <td>a</td>
                            </tr>
                            <tr>
                                <td>a</td>
                                <td>a</td>
                                <td>a</td>
                                <td>a</td>
                            </tr>
                            <tr>
                                <td>a</td>
                                <td>a</td>
                                <td>a</td>
                                <td>a</td>
                            </tr>
                        </tbody>


                    </table>

                </div>
            </div>
        )

        return (
            <div className="component_bitacora">
                <ComponentDashboard
                componente={vista}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />
            </div>
        )
    }

}

export default withRouter(ComponentBitacora)