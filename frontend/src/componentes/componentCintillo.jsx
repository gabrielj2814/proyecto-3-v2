import React from "react"

import {withRouter} from "react-router-dom"

//JS
import axios from 'axios'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import "../css/componentCintillo.css"
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'
import ButtonIcon from '../subComponentes/buttonIcon'
import ComponentFormCampo from '../subComponentes/componentFormCampo';
import AlertBootstrap from "../subComponentes/alertBootstrap"
// imagenes
// import imagen1 from "../../../backend/upload/cintillo/cintillo-2021-02-11_05-11-56PM.png"

class ComponentCintillo extends React.Component{

    constructor(){
        super();
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.mostarModalFormulario=this.mostarModalFormulario.bind(this);
        this.cerrarModalFormulario=this.cerrarModalFormulario.bind(this);
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.enviarDatos=this.enviarDatos.bind(this);
        this.envitarEventoPorDefecto=this.envitarEventoPorDefecto.bind(this);
        this.state={
            modulo:"",// modulo menu
            estado_menu:false,
            //----------
            // datos foto selecionada visor
            id_foto_cintillo:"",
            nombre_foto_cintillo:"",
            extension_foto_cintillo:"",
            fecha_subida_foto: "",
            hora_subida_foto: "",
            estatu_foto_cintillo: "",
            // ---------
            alerta:{
                color:null,
                mensaje:null,
                estado:false
            },
            archvios:[]

        }
    }

    UNSAFE_componentWillMount(){
        this.refrescarGaleria()
    }

    refrescarGaleria(){
        axios.get("http://localhost:8080/configuracion/cintillo/consultar-todos")
        .then(repuesta => {
            let json=repuesta.data
            // console.log(json)
            let archvios=[]
            for(let archivo of json.datos){
                if(archivo.extension_foto_cintillo!==null){
                    archivo.fecha_subida_foto=archivo.fecha_subida_foto.split("T")[0]
                    archvios.push(archivo)
                }
            }
            console.log(archvios)
            this.setState({
                archvios
            })
        })
        .catch(error => {
            console.log("error al conectar con el servidor")
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

    mostarModalFormulario(){
        const $formulario=document.getElementById("formularioCintillo")
        $formulario.classList.toggle("contenedor-formulario-cintillo-mostrar")
    }

    cerrarModalFormulario(){
        const $formulario=document.getElementById("formularioCintillo")
        $formulario.classList.toggle("contenedor-formulario-cintillo-mostrar")
    }

    cambiarEstado(a){
        let input=a.target;
        this.setState({[input.name]:input.value})
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

    validarFormulario(){
        let estado=false
        const estadoArchivo=this.validarArchivo()
        const estadoNombreArchvio=this.validarNombreArchivo()
        if(estadoArchivo && estadoNombreArchvio){
            estado=true
        }
        return estado
    }

    validarArchivo(){
        let estado=false
        let archivo=document.getElementById("archivo")
        let $mensajeInputFile=document.getElementById("mensaje_foto_cintillo")
        if(archivo.files.length>0){
            const infoFile=archivo.files[0]
            if(infoFile.type==="image/png" || infoFile.type==="image/jpg" || infoFile.type==="image/jpeg"){
                // alert("ok")
                $mensajeInputFile.textContent=""
                estado=true
            }
            else{
                $mensajeInputFile.style.color="rgb(226, 43, 43)"
                $mensajeInputFile.textContent="el archivo no es valido los archivos permitidos son los (png,jpg,jpeg)"
                // alert("no")
            }
        }
        else{
            $mensajeInputFile.style.color="rgb(226, 43, 43)"
            $mensajeInputFile.textContent="este campo no puede estar vacio, selecciona un archivo"
            // alert("esta vacion el input file")
        }
        return estado
    }

    validarNombreArchivo(){
        let estado=false
        let nombreArchivo=document.getElementById("nombre_foto_cintillo")
        let $mensajeNombreArchivo=document.getElementById("mensaje_nombre_foto_cintillo")
        const expresionRegularText=/[a-zA-Z]/g
        const expresionRegularNumber=/[0-9]/g
        if(nombreArchivo.value!==""){
            if(expresionRegularText.test(nombreArchivo.value) || expresionRegularNumber.test(nombreArchivo.value)){
                $mensajeNombreArchivo.textContent=""
                estado=true
            }
            else{
                $mensajeNombreArchivo.style.color="rgb(226, 43, 43)"
                $mensajeNombreArchivo.textContent="no se puede enviar espacios en blanco"
            }

        }
        else{
            $mensajeNombreArchivo.style.color="rgb(226, 43, 43)"
            $mensajeNombreArchivo.textContent="este campo no puede estar vacio"
        }
        return estado
    }

    envitarEventoPorDefecto(a){
        a.preventDefault()
    }

    enviarDatos(a){
        const boton=a.target
        const operacion=boton.getAttribute("data-operacion")
        // alert(operacion)
        if(this.validarFormulario()){
            // alert("formulario validado correctamente")
            let formulario=document.getElementById("formularioCintillo")
            let datosFormulario=this.extrarDatosDelFormData(new FormData(formulario))
            let datos={
                cintillo:{
                    nombre_foto_cintillo: datosFormulario.nombre_foto_cintillo,
                    extension_foto_cintillo:"",
                    fecha_subida_foto: "",
                    hora_subida_foto: "",
                    estatu_foto_cintillo: ""
                },
                token:"",
            }
            // console.log(datosFormulario)
            axios.post("http://localhost:8080/configuracion/cintillo/subir-cintillo",datos)
            .then(repuesta => {
                let  json=JSON.parse(JSON.stringify(repuesta.data))
                // console.log(json)
                if(json.estado){
                    let datosArchivo=new FormData()
                    let archivo=document.getElementById("archivo")
                    datosArchivo.append("archivo",archivo.files[0])
                    axios.post(`http://localhost:8080/configuracion/cintillo/enviar-foto/${json.fecha}/${json.hora}`,datosArchivo,{
                        headers:{'Content-Type': 'multipart/form-data'}
                    })
                    .then(repuesta2 => {
                        let json2=JSON.parse(JSON.stringify(repuesta2.data))
                        console.log(json2)
                        if(json2.estado){
                            this.cerrarModalFormulario()
                            let alerta=JSON.parse(JSON.stringify(this.state.alerta))
                            alerta.estado=false
                            alerta.color="danger"
                            alerta.mensaje=""
                            this.setState({
                                nombre_foto_cintillo:"",
                                alerta
                            })
                            this.refrescarGaleria()
                        }
                        else{
                            // 
                            let alerta=JSON.parse(JSON.stringify(this.state.alerta))
                            alerta.estado=true
                            alerta.color="danger"
                            alerta.mensaje="error al subir la foto intente de nuevo"
                            this.setState({alerta})
                        }
                    })
                    .catch(error => {
                        console.log("error al conectarse con el servidor")
                    })
                }
                else{
                    // alert("error al registrar")
                    let alerta=JSON.parse(JSON.stringify(this.state.alerta))
                    alerta.estado=true
                    alerta.color="danger"
                    alerta.mensaje="error al registrar"
                    this.setState({alerta})
                }
            })
            .catch(error => {
                console.log("error al conectarse con el sevidor")
            })
        }
        
    }

    render(){
        const component=(
            <div className="row justify-content-center">
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_formulario_cintillo">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-cintillo">
                            <span className="titulo-form-cintillo">Modulo de Cintillo</span>
                        </div>
                    </div>

                    <form id="formularioCintillo" onSubmit={this.envitarEventoPorDefecto} className="contenedor-formulario-cintillo">
                        <div className="icon-x" onClick={this.cerrarModalFormulario}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </div>
                        {this.state.alerta.estado===true &&
                            (<div className="col-6 col-ms-6 col-md-6 col-lg-6 col-xl-6 alerta_formulario_cintillo">
        
                                <AlertBootstrap colorAlert={this.state.alerta.color} mensaje={this.state.alerta.mensaje}/>
                                
                            </div>)
                        }
                        <div className="icono-cloud-upload">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cloud-upload" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/>
                                <path fill-rule="evenodd" d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"/>
                            </svg>
                        </div>
                        <h2 className="titulo-modal-formulario mb-5">Subir Cintillo</h2>
                        <div className="row mb-2">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                <input type="file" className="input-file-archivo btn btn-primary" id="archivo" name="archivo"/>
                                <span id="mensaje_foto_cintillo" className="span-mensaje"></span>
                            </div>
                        </div>
                        <div className="row mb-5">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                <div class="form-groud">
                                    <label className="label-input-nombre-archivo">Nombre del archivo:</label>
                                    <input type="text" accept=".png,.jpg,.jpeg" onChange={this.cambiarEstado} className="form-control" id="nombre_foto_cintillo" name="nombre_foto_cintillo" placeholder="nombre del archivo"/>
                                    <span id="mensaje_nombre_foto_cintillo" className="span-mensaje"></span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-auto">
                                <button className="btn btn-success" data-operacion="guardar" onClick={this.enviarDatos}>
                                    Guardar
                                    <svg data-operacion="guardar" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cloud-arrow-up margin-left-icon-2" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"/>
                                        <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
                                    </svg>
                                </button>
                            </div>
                        
                        </div>

                    </form>


                    <div className="row justify-content-center mb-3">
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3">
                            <button className="btn btn-block btn-outline-primary" onClick={this.mostarModalFormulario}>
                                Subir
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cloud-upload margin-left-icon-2" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/>
                                    <path fill-rule="evenodd" d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    

                    <div id="galeriaCintillo" className="galeria-cintillo">
                        {this.state.archvios.map((archivo,index) => {
                            return (
                                <div id={"contendor-imagen-index-"+index} className="contenedor-imagen">
                                <img id="" className="imagen-cintillo" src={`http://localhost:8080/cintillo/cintillo-${archivo.fecha_subida_foto}_${archivo.hora_subida_foto}.${archivo.extension_foto_cintillo}`} alt="cintillo-img"/>
                                <div class="hover-imagen">
                                    <div className="row justify-content-center">
                                        <div className=" col-6 col-ms-6 col-md-6 col-lg-6 col-xl-6">
                                            <button className="btn btn-block btn-outline-info">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="nombre-archivo mt-2">
                                        {archivo.nombre_foto_cintillo}
                                    </div>
                                    
                                </div>
                            </div>
                    
                        )})}
                    </div>
                
                </div>
            </div>
        )
        // <div className="contenedor-imagen">
        //                     <img id="" className="imagen-cintillo" src="http://localhost:8080/cintillo/cintillo-2021-02-11_05-11-56PM.png" alt="cintillo-img"/>
        //                     <div class="hover-imagen">
        //                         <div className="row justify-content-center">
        //                             <div className=" col-6 col-ms-6 col-md-6 col-lg-6 col-xl-6">
        //                                 <button className="btn btn-block btn-outline-info">
        //                                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
        //                                         <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
        //                                         <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
        //                                     </svg>
        //                                 </button>
        //                             </div>
        //                         </div>
        //                         <div className="nombre-archivo mt-2">
        //                             nombre
        //                         </div>
                                
        //                     </div>
        //                 </div>
        // <img id="imagenPrueba" src="http://localhost:8080/cintillo/cintillo-2021-02-11_05-11-56PM.png" />
        // <img id="imagenPrueba" src="http://localhost:8080/cintillo/cintillo-2021-02-11_05-32-55PM.jpg" />
        return(
            <div className="component_cintillo_formulario">
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

export default withRouter(ComponentCintillo)