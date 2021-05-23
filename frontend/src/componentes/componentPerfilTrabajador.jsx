import React from 'react'
import {withRouter} from "react-router-dom"

//JS
import axios from 'axios'
import $ from 'jquery'
import Moment from 'moment'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import "../css/componentPerfilTrabajador.css"
//componentes
import ComponentDashboard from './componentDashboard'
import ComponentFormCampo from '../subComponentes/componentFormCampo';
import InputButton from '../subComponentes/input_button'
//sub componentes
import AlertBootstrap from "../subComponentes/alertBootstrap"

class ComponentPerfilTrabajador extends React.Component{


    constructor(){
        super()
        this.cambiarEstado=this.cambiarEstado.bind(this)
        this.compararRespuesta=this.compararRespuesta.bind(this)
        this.compararClaveTrabajador=this.compararClaveTrabajador.bind(this)
        this.validarClave=this.validarClave.bind(this)
        this.mostrarModulo=this.mostrarModulo.bind(this)
        this.mostarModalCambiarContraseña=this.mostarModalCambiarContraseña.bind(this)
        this.mostarModalMisPermisos=this.mostarModalMisPermisos.bind(this)
        this.solicitarPermiso=this.solicitarPermiso.bind(this)
        this.cerrarModalPermiso=this.cerrarModalPermiso.bind(this)
        this.mostarModalMisReposo=this.mostarModalMisReposo.bind(this)
        this.cerrarModalMisReposo=this.cerrarModalMisReposo.bind(this)
        this.solicitarReposo=this.solicitarReposo.bind(this)
        this.generarPdfPermisoEspecifico=this.generarPdfPermisoEspecifico.bind(this)
        this.generarPdfReposoEspecifico=this.generarPdfReposoEspecifico.bind(this)
        this.state={
            paso:0,
            modulo:"",// modulo menu
            estado_menu:false,
            // -------------
            id_cedula:null,
            nombres:null,
            apellidos:null,
            telefono_movil:null,
            telefono_local:null,
            correo:null,
            grado_instruccion:null,
            titulo_grado_instruccion:null,
            fecha_nacimiento:null,
            fecha_ingreso:null,
            direccion:null,
            id_perfil:null,
            id_tipo_trabajador:null,
            id_funcion_trabajador:null,
            estatu_trabajador:null,
            sexo_trabajador:null,
            designacion:null,
            id_tipo_trabajador:null ,
            descripcion_tipo_trabajador:null ,
            estatu_tipo_trabajador:null,
            id_funcion_trabajador:null ,
            funcion_descripcion:null ,
            id_tipo_trabajador:null,
            estatu_funcion_trabajador:null,
            id_horario:null,
            id_perfil:null,
            nombre_perfil:null,
            estatu_perfil:null,

            pregunta_1:"",
            pregunta_2:"",
            respuesta_1:"",
            respuesta_2:"",

            respuesta_usuario_1:"",
            respuesta_usuario_2:"",

            clave_trabajador:"",
            confirmar_clave_trabajador:"",

            nueva_clave_trabajador:"",
            confirmar_nueva_clave:"",

            msj_respuesta_1:{
                mensaje:"",
                color_texto:""
            },
            msj_respuesta_2:{
                mensaje:"",
                color_texto:""
            },
            
            msj_confirmar_nueva_clave:{
                mensaje:"",
                color_texto:""
            },

            msj_respuesta_usuario_1:{
                mensaje:"",
                color_texto:""
            },
            msj_respuesta_usuario_2:{
                mensaje:"",
                color_texto:""
            },

            msj_clave_trabajador:{
                mensaje:"",
                color_texto:""
            },
            // msj_clave_confirmar:{
            //     mensaje:"",
            //     color_texto:""
            // },

            // ----------------
            listaPermisos:[],
            listaReposos:[],
            estadosPermiso:{
                I:"Interumpido",
                E:"En espera",
                A:"Aprovado",
                D:"Denegado",
                C:"culminado",
            },
            estadoReposo:{
                "1":"Activo",
                "0":"Inactivo",
                "2":"Interumpido",
            },
            estadoEntregaReposo:{
                "P":"En espera",
                "E":"Entregado",
                "N":"No entregado",
            },

            mensaje:{
                texto:"",
                estado:""
              },
        }
    }

    async UNSAFE_componentWillMount(){
        await this.consultarDatosDeLaSesion()
        await this.consultarTodosLosReposos()
        await this.consultarTodosLosPermisos()
        
    }

    async consultarTodosLosReposos(){
        let json={
            id_cedula:this.state.id_cedula
        }
        await axios.post(`http://localhost:8080/transaccion/reposo-trabajador/consultar-todos-reposos`,json)
        .then(respuesta => {
            let jsonResponse=JSON.parse(JSON.stringify(respuesta.data))
            console.log("todos los reposos =>>> ",jsonResponse)
            this.setState({listaReposos:jsonResponse.datos})
        })
        .catch(error => {
            console.log(error)
        })
    }

    async consultarTodosLosPermisos(){
        let json={
            id_cedula:this.state.id_cedula
        }
        await axios.post("http://localhost:8080/transaccion/permiso-trabajador/consultar-todos-permisos",json)
        .then(respuesta => {
            let jsonResponse=JSON.parse(JSON.stringify(respuesta.data))
            console.log("todos los permiso =>>> ",jsonResponse)
            this.setState({listaPermisos:jsonResponse.datos})
        })
        .catch(error => {
            console.log(error)
        })
    }

    async consultarDatosDeLaSesion(){
        var respuesta_servior=""
        const token=localStorage.getItem("usuario")
        await axios.get(`http://localhost:8080/login/verificar-sesion${token}`)
        .then(async respuesta=>{
            respuesta_servior=respuesta.data
            if(respuesta_servior.usuario){
                await this.consultarTrabajador(respuesta_servior.usuario.id_cedula)
            }  
        })
    }

    async consultarTrabajador(id){
        var respuesta_servidor=""
        const token=localStorage.getItem('usuario')
        await axios.get(`http://localhost:8080/configuracion/trabajador/consultar-trabajador/${id}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            console.log(respuesta_servidor)
            if(respuesta_servidor.estado_peticion==="200"){
                this.setState(respuesta_servidor.trabajador)
            }
           else if(respuesta_servidor.estado_peticion==="404"){
                alert("no se a encontrador a este trabajador")
           }
        })
        .catch(error=>{
            alert("error al conectar con el servidor")
        })
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

    cambiarEstadoInput(input){
        this.setState({[input.name]:input.value});
    }

    cambiarEstado(a){
        const input=a.target;
        this.setState({[input.name]:input.value})
    }

    

    validarCampoTexto(nombre_campo){// validar la clave como texto
        var estado=false
        const campo=this.state[nombre_campo],
        exprecion=/[A-Za-z]|[0-9]/
        // alert(nombre_campo)
        var mensaje_campo=this.state["msj_"+nombre_campo]
        if(campo!==""){
            if(exprecion.test(campo)){
                estado=true
                console.log("campo nombre "+nombre_campo+" OK")
                mensaje_campo.mensaje=""
                mensaje_campo.color_texto="blanco"
                this.setState({["msj_"+nombre_campo]:mensaje_campo})
            }
            else{
                mensaje_campo.mensaje="* este campo solo permite letras"
                mensaje_campo.color_texto="blanco"
                this.setState({["msj_"+nombre_campo]:mensaje_campo})
            } 
        }
        else{
            mensaje_campo.mensaje="* este campo no puede estar vacio"
            mensaje_campo.color_texto="blanco"
            this.setState({["msj_"+nombre_campo]:mensaje_campo})
        }
        return estado
    }

    async compararClaveTrabajador(){
        if(this.state.nueva_clave_trabajador=== this.state.confirmar_nueva_clave){
            //alert("La clave fue validada con exito.(ツ)")
            await this.compararClaveTrabajador(this.state.id_cedula)
        }
        else{
            alert("La clave introducida no coincide, Por favor verifique")
        }
    }

    compararRespuesta(){
        if(this.state.respuesta_usuario_1=== this.state.respuesta_1 && this.state.respuesta_usuario_2===this.state.respuesta_2){
            //alert("Las respuestas validadas con exito.(ツ)")
            this.setState({
                paso:1
            })
        }
        else{
            alert("Las respuestas no coinciden, por favor verifique sus Respuestas")
        }
    }


    validarMinimoClave(validar_clave,propiedad){
        var estado=false
        var mensaje_clave=this.state["msj_"+propiedad]
        if(validar_clave){
            if(this.state[propiedad].length>=6){
                estado=true
                mensaje_clave.mensaje=""
                mensaje_clave.color_texto="blanco"
                this.setState({["msj_"+propiedad]:mensaje_clave})
            }
            else{
                mensaje_clave.mensaje="* la clave tiene que tener como minimo 6 caracteres"
                mensaje_clave.color_texto="blanco"
                this.setState({["msj_"+propiedad]:mensaje_clave})
            }
        }
        return estado
    }

    validarTexto(a){
        const input=a.target,
        exprecion=/[A-Za-z\s]$/
        if(input.value!==""){
            if(exprecion.test(input.value)){
                console.log("OK")
                this.cambiarEstado(input)
            }
            else{
                console.log("NO se acepta valores numericos")
            }
        }
        else{
            this.cambiarEstado(input)
        }
    }

    validarContraseña(){
        var estado=false
        var mensaje_clave=this.state["msj_confirmar_nueva_clave"]
        const validar_clave=this.validarCampoTexto("confirmar_nueva_clave")
        if(this.validarMinimoClave(validar_clave,"confirmar_nueva_clave")){
            const exprecion=/[A-Z]{2}/g
            const exprecion2=/[a-z]{2}/g
            let clave=document.getElementById("confirmar_nueva_clave").value
            if(exprecion.test(clave) && exprecion2.test(clave)){
                // alert("si")
                const validar_clave_confirmar=this.validarCampoTexto("confirmar_nueva_clave")
                if(this.validarMinimoClave(validar_clave_confirmar,"confirmar_nueva_clave")){
                    if(this.state.nueva_clave_trabajador===this.state.confirmar_nueva_clave){
                        estado=true
                        mensaje_clave.mensaje=""
                        mensaje_clave.color_texto="negro"
                        this.setState({msj_clave_confirmar:mensaje_clave})
                    }
                    else{
                        mensaje_clave.mensaje="* las claves no coinciden"
                        mensaje_clave.color_texto="negro"
                        this.setState({msj_clave_confirmar:mensaje_clave})
                    }
                }

            }
            else{
                mensaje_clave.mensaje="la clave debe tener al menos 2 caracteres en MAYUSCULA y dos en MINUSCULA"
                mensaje_clave.color_texto="blanco"
                this.setState({msj_clave_confirmar:mensaje_clave})
            }
            
        }
        return estado
    }

    validarFormulario(){
        var estado=false
        const validar_respuesta_1=this.validarCampoTexto("respuesta_usuario_1"),
        validar_respuesta_2=this.validarCampoTexto("respuesta_usuario_2"),
        validar_clave=this.validarContraseña()
        if(validar_respuesta_1 && validar_respuesta_2 && validar_clave){
            estado=true
        }
        return estado
    }

    validarClave(){
        if(this.validarFormulario()){
        var respuesta_servidor=""
        var mensaje=this.state.mensaje
        axios.get(`http://localhost:8080/configuracion/trabajador/cambiar-clave/${this.state.id_cedula}/${this.state.nueva_clave_trabajador}/${this.state.respuesta_usuario_1}/${this.state.respuesta_usuario_2}`)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
            console.log(respuesta_servidor)
            if(respuesta_servidor.estado_peticion==="200"){
                mensaje.texto="la clave a sido cambiada exitosamente"
                mensaje.estado=respuesta_servidor.estado_peticion
                $("#modalCambiarContaseña").modal("hide")
                this.setState({
                    paso:0
                })
            }
            else if(respuesta_servidor.estado_peticion==="404"){
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                this.setState(mensaje)
            }
        })
        .catch(error=>{
            mensaje.texto="No se puedo conectar con el servidor"
            mensaje.estado="500"
            console.log(error)
            this.setState({mensaje:mensaje})
        })
    }
    else{
        alert("error al validar el formulario")
    }
}

    mostarModalCambiarContraseña(){
        $("#modalCambiarContaseña").modal("show")
    }
    
    mostarModalMisPermisos(){
        $("#modalHistorialPermiso").modal("show")
    }
    
    cerrarModalPermiso(){
        $("#modalHistorialPermiso").modal("hide")
    }
    
    solicitarPermiso(){
        this.cerrarModalPermiso()
        this.props.history.push("/dashboard/transaccion/permiso-trabajador/solicitar")
    }
    
    mostarModalMisReposo(){
        $("#modalHistorialReposo").modal("show")
    }
    
    cerrarModalMisReposo(){
        $("#modalHistorialReposo").modal("hide")
    }

    solicitarReposo(){
        this.cerrarModalMisReposo()
        this.props.history.push("/dashboard/transaccion/reposo-trabajador/solicitar")
    }


    generarPdfReposoEspecifico(a){
        let boton=a.target
        alert(boton.id)
        let $filaVerPdf=document.getElementById("filaVerPdfReposo")
        $filaVerPdf.classList.add("ocultarFormulario") 
        $.ajax({
            url: 'http://localhost:80/proyecto/backend/controlador_php/controlador_reposo_especifico.php',
            type:"post",
            data:[{name:"id_reposo_trabajador",value:boton.id}],
            success: function(respuesta) {
              // alert("OK")
              console.log(respuesta)
                // let json=JSON.parse(respuesta)
                // if(json.nombrePdf!=="false"){
                //     $filaVerPdf.classList.remove("ocultarFormulario") 
                //     document.getElementById("linkPdfReposo").href=`http://localhost:8080/reporte/${json.nombrePdf}`
                // }
                // else{
                //     $filaVerPdf.classList.add("ocultarFormulario") 
                //     alert("no se pudo generar el pdf por que no hay registros que coincidan con los datos enviados")
                // }
            },
            error: function() {
              alert("error")
            }
          });
    }
    generarPdfPermisoEspecifico(a){
        let boton=a.target
        alert(boton.id)
        let $filaVerPdf=document.getElementById("filaVerPdfPermiso")
        $filaVerPdf.classList.add("ocultarFormulario") 

        $.ajax({
            url: 'http://localhost:80/proyecto/backend/controlador_php/controlador_permiso_especifico.php',
            type:"post",
            data:[{name:"id_permiso_trabajador",value:boton.id}],
            success: function(respuesta) {
              // alert("OK")
              console.log(respuesta)
                // let json=JSON.parse(respuesta)
                // if(json.nombrePdf!=="false"){
                //     $filaVerPdf.classList.remove("ocultarFormulario") 
                //     document.getElementById("linkPdfPermiso").href=`http://localhost:8080/reporte/${json.nombrePdf}`
                // }
                // else{
                //     $filaVerPdf.classList.add("ocultarFormulario") 
                //     alert("no se pudo generar el pdf por que no hay registros que coincidan con los datos enviados")
                // }
            },
            error: function() {
              alert("error")
            }
          });
    }
    
    render(){
        const vista=(
            <div className="row justify-content-center">
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                    {this.state.mensaje.texto!=="" && (this.state.mensaje.estado==="200" || this.state.mensaje.estado==="404" || this.state.mensaje.estado==="401" || this.state.mensaje.estado==="500") &&
                        <div className="row">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                <div className={`alert alert-${(this.state.mensaje.estado==="200" || this.state.mensaje.estado==="401")?"success":"danger"} alert-dismissible`} >
                                    <p>Mensaje: {this.state.mensaje.texto}</p>
                                    <button className="close" data-dismiss="alert">
                                        <span>X</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                </div>

                <div class="modal fade" id="modalHistorialReposo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-xl" role="document">
                                    <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">Mis Reposos</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                    <button class="btn btn-outline-primary mb-3" onClick={this.solicitarReposo}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                            <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"/>
                                        </svg>
                                    </button>
                                    
                                    <table id="tablaReposo" className="tabla table table-dark table-striped table-bordered table-hover table-responsive-xl ">
                                        <thead> 
                                            <tr> 
                                                <th>N°</th> 
                                                <th>Reposo</th> 
                                                <th>Desde</th> 
                                                <th>Hasta</th>
                                                <th>Ultimo dia de Entrega</th>
                                                <th>Estado</th>
                                                <th>Estado de entrega</th>
                                            </tr> 
                                        </thead>
                                        <tbody>

                                            {this.state.listaReposos.map((reposo,index) => {
                                                return(
                                                    <tr key={"reposo-"+index}> 
                                                        <th>{index+1}</th> 
                                                        <th>{reposo.nombre_reposo}</th> 
                                                        <th>{Moment(reposo.fecha_desde_reposo_trabajador,"YYYY-MM-DD").format("DD-MM-YYYY")}</th> 
                                                        <th>{Moment(reposo.fecha_hasta_reposo_trabajador,"YYYY-MM-DD").format("DD-MM-YYYY")}</th>
                                                        <th>{Moment(reposo.fecha_hasta_entrega_reposo_trabajador,"YYYY-MM-DD").format("DD-MM-YYYY")}</th>
                                                        <th>{this.state.estadoReposo[`${reposo.estatu_reposo_trabajador}`]}</th>
                                                        <th>{this.state.estadoEntregaReposo[reposo.estatu_entrega_reposo]}</th>
                                                        <th>
                                                            <button id={reposo.id_reposo_trabajador} className="btn btn-danger btn-block" onClick={this.generarPdfReposoEspecifico}>PDF</button>
                                                        </th>
                                                    </tr>
                                                )
                                            })}
                                                
                                        </tbody>


                                    </table>
                                    
                                    </div>
                                    <div class="modal-footer ">
                                        
                                        <div class="row justify-content-center ocultarFormulario" id="filaVerPdfReposo">
                                            <a className="btn btn-success" id="linkPdfReposo" href="#">Ver pdf</a>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                        </div>

                <div class="modal fade" id="modalHistorialPermiso" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-xl" role="document">
                                    <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">Mis Permisos</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                    <button class="btn btn-outline-primary mb-3" onClick={this.solicitarPermiso}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                            <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"/>
                                        </svg>
                                    </button>
                                    <table id="tablaPermisos" className="tabla table table-dark table-striped table-bordered table-hover table-responsive-xl ">
                                        <thead> 
                                            <tr> 
                                                <th>N°</th> 
                                                <th>Permiso</th> 
                                                <th>Desde</th> 
                                                <th>Hasta</th>
                                                <th>Estado</th>
                                                <th>Remunerado</th>
                                                <th>habil</th>
                                            </tr> 
                                        </thead>
                                        <tbody>

                                            {this.state.listaPermisos.map((permiso,index) => {
                                                return(
                                                    <tr key={"permiso-"+index}> 
                                                        <td>{index+1}</td> 
                                                        <td>{permiso.nombre_permiso}</td> 
                                                        <td>{Moment(permiso.fecha_desde_permiso_trabajador,"YYYY-MM-DD").format("DD-MM-YYYY")}</td> 
                                                        <td>{Moment(permiso.fecha_hasta_permiso_trabajador,"YYYY-MM-DD").format("DD-MM-YYYY")}</td>
                                                        <td>{this.state.estadosPermiso[permiso.estatu_permiso_trabajador]}</td>
                                                        <td>{(permiso.estatu_remunerado==="1")?"Si":"No"}</td>
                                                        <td>{(permiso.estatu_dias_aviles==="1")?"Si":"No"}</td>
                                                        <th>
                                                            <button id={permiso.id_permiso_trabajador} className="btn btn-danger btn-block" onClick={this.generarPdfPermisoEspecifico}>PDF</button>
                                                        </th>
                                                    </tr> 
                                                )
                                            })

                                            }
                                                
                                        </tbody>


                                    </table>
                                    
                                    </div>
                                    <div class="modal-footer ">
                                        <div class="row justify-content-center ocultarFormulario" id="filaVerPdfPermiso">
                                            <a className="btn btn-success" id="linkPdfPermiso" href="#">Ver pdf</a>

                                        </div>
                                    </div>
                                    </div>
                                </div>
                        </div>
                
                <div class="modal fade" id="modalCambiarContaseña" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg" role="document">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Cambiar contraseña</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            
                            {this.state.paso===0 &&
                    <>
                        <div className="modal-body">
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center">
                                <div className="styleFont_2">
                                    {this.state.pregunta_1}
                                </div> 
                            </div>
                            <div className="row justify-content-center margen_bottom_10 ">
                                <ComponentFormCampo
                                clasesColumna="col-7 col-sm-7 col-md-7 col-lg-7 col-xl-7 text-center"
                                nombreCampo=""
                                activo="si"
                                mensaje={this.state.msj_respuesta_usuario_1}
                                clasesCampo="form-control"
                                type="text"
                                value={this.state.respuesta_usuario_1}
                                name="respuesta_usuario_1"
                                id="respuesta_usuario_1"
                                placeholder="RESPUESTA NRO 1"
                                eventoPadre={this.cambiarEstado}
                                />
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center">
                                <div className="styleFont_2">
                                    {this.state.pregunta_2}
                                    </div>
                            </div>
                            <div className="row justify-content-center margen_bottom_10 ">
                                <ComponentFormCampo
                                clasesColumna="col-7 col-sm-7 col-md-7 col-lg-7 col-xl-7 text-center"
                                nombreCampo=""
                                activo="si"
                                mensaje={this.state.msj_respuesta_usuario_2}
                                clasesCampo="form-control"
                                type="text"
                                value={this.state.respuesta_usuario_2}
                                name="respuesta_usuario_2"
                                id="respuesta_usuario_2"
                                placeholder="RESPUESTA NRO 2"
                                eventoPadre={this.cambiarEstado}
                                />
                            </div>

                            <div className="modal-footer">    
                                <div className="col-auto">
                                    <InputButton 
                                    clasesBoton="btn btn-success"
                                    id="boton-recuperar_siguiente"
                                    value="Siguiente"
                                    eventoPadre={this.compararRespuesta}
                                    />   
                                </div>
                            </div>
                    </>
                }
                            {this.state.paso===1 &&
                            <>
                                <div class="modal-body">
                                
                                <div className="row justify-content-center margen_bottom_10 ">
                                    <ComponentFormCampo
                                    clasesColumna="col-7 col-sm-7 col-md-7 col-lg-7 col-xl-7 text-center"
                                    nombreCampo={`Nueva Contraseña ${this.state.nueva_clave_trabajador.length}/6`}
                                    mensaje={this.state.msj_clave_trabajador}
                                    activo="si"
                                    clasesCampo="form-control"
                                    type="text"
                                    value={this.state.nueva_clave_trabajador}
                                    name="nueva_clave_trabajador"
                                    id="nueva_clave_trabajador"
                                    placeholder="INGRESE NUEVA CONTRASEÑA"
                                    eventoPadre={this.cambiarEstado}
                                    />
                                </div>
                                <div className="row justify-content-center margen_bottom_10 ">
                                    <ComponentFormCampo
                                    clasesColumna="col-7 col-sm-7 col-md-7 col-lg-7 col-xl-7 text-center"
                                    nombreCampo={`Confirmar Contraseña ${this.state.confirmar_nueva_clave.length}/6`}
                                    mensaje={this.state.msj_clave_confirmar}
                                    activo="si"
                                    clasesCampo="form-control"
                                    type="password"
                                    value={this.state.confirmar_nueva_clave}
                                    name="confirmar_nueva_clave"
                                    id="confirmar_nueva_clave"
                                    placeholder="CONFIRME NUEVA CONTRASEÑA"
                                    eventoPadre={this.cambiarEstado}
                                    />
                                </div>
                            </div>
                            <div class="modal-footer">
                            <div className="row row justify-content-center margen_bottom_10">    
                                <div className="col-auto">
                                    <InputButton 
                                    clasesBoton="btn btn-success"
                                    id="boton-recuperar"
                                    value="Cambiar Contraseña"
                                    eventoPadre={this.validarClave}
                                    />   
                                </div>
                            </div>
                            
                                <button type="button" id="botonGenerarPdf" class="btn btn-success ocultarFormulario" onClick={this.generarPdf}>Generar pdf</button>
                                
                            </div>
                            </>
                            }
                            </div>
                        </div>
                  </div>

                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_perfil">
                    <div className="row justify-content-center contenedor-titulo-form-perfil">
                        <div className="col-auto ">
                            <h1 className="titulo-form-perfil">Perfil</h1>
                        </div>
                    </div>
                    <div className="row justify-content-center mb-2">
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Cedula</label>
                                <input type="text" class="form-control" disabled value={this.state.id_cedula}/>
                            </div>
                        </div>
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Nombres</label>
                                <input type="text" class="form-control" disabled value={this.state.nombres}/>
                            </div>
                        </div>
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Apellidos</label>
                                <input type="text" class="form-control" disabled value={this.state.apellidos}/>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center mb-2">
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Fecha de nacimiento</label>
                                <input type="text" class="form-control" disabled value={Moment(this.state.fecha_nacimiento,"YYYY-MM-DD").format("DD-MM-YYYY")}/>
                            </div>
                        </div>
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Edad</label>
                                <input type="text" class="form-control" disabled value={Moment().diff(Moment(this.state.fecha_nacimiento,"YYYY-MM-DD"),"years")}/>
                            </div>
                        </div>
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Telefono movil</label>
                                <input type="text" class="form-control" disabled value={this.state.telefono_movil}/>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center mb-2">
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Telefono local</label>
                                <input type="text" class="form-control" disabled value={this.state.telefono_local}/>
                            </div>
                        </div>
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Correo</label>
                                <input type="text" class="form-control" disabled value={this.state.correo}/>
                            </div>
                        </div>
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Sexo</label>
                                <input type="text" class="form-control" disabled value={(this.state.sexo_trabajador==="1")?"Masculino":"Femenino"}/>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center mb-2">
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Grado instrucción</label>
                                <input type="text" class="form-control" disabled value={this.state.grado_instruccion}/>
                            </div>
                        </div>
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Titulo</label>
                                <input type="text" class="form-control" disabled value={this.state.titulo_grado_instruccion}/>
                            </div>
                        </div>
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
                    </div>
                    <div className="row justify-content-center mb-2">
                        <div className="col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9">
                            <div className="form-groud">
                                <label>Dirección</label>
                                <textarea className="textArea form-control" disabled value={this.state.direccion} rows="5"></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center mb-2">
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Tipo de Perfil</label>
                                <input type="text" class="form-control" disabled value={this.state.nombre_perfil}/>
                            </div>
                        </div>
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Tipo del trabajador</label>
                                <input type="text" class="form-control" disabled value={this.state.descripcion_tipo_trabajador}/>
                            </div>
                        </div>
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Función del trabajador</label>
                                <input type="text" class="form-control" disabled value={this.state.funcion_descripcion}/>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center mb-5">
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-groud">
                                <label>Designación</label>
                                <input type="text" class="form-control" disabled value={(this.state.designacion==="1")?"Interno":"Externo"}/>
                            </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6"></div>
                    </div>
                    <div className="row justify-content-center mb-4">
                        <div className="col-auto">
                            <button class="btn btn-warning" onClick={this.mostarModalCambiarContraseña}>Cambiar mi contraseña</button>
                        </div>
                    </div>
                    <div className="row justify-content-center mb-2">
                            <div className="col-auto" onClick={this.mostarModalMisPermisos}>
                                <button class="btn btn-info">Ver el historial de mis permisos</button>
                            </div>
                            <div className="col-auto">
                                <button class="btn btn-info" onClick={this.mostarModalMisReposo}>Ver el historial de mis reposos</button>
                            </div>
                    </div>

                </div>
 

            </div>
        )


        return(
            <div className="component_perfil_formulario ">
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

export default withRouter(ComponentPerfilTrabajador)