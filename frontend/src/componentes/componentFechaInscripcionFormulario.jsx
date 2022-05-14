import React from 'react';
import {withRouter} from 'react-router-dom'
import axios from 'axios'
// IP servidor
import servidor from '../ipServer.js'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentFechaInscripcionFormulario.css'
//componentes
import ComponentDashboard from './componentDashboard'
// subComponent
import AlertBootstrap from "../subComponentes/alertBootstrap"
import InputButton from '../subComponentes/input_button'
import ComponentFormCampo from '../subComponentes/componentFormCampo';
import ComponentFormRadioState from "../subComponentes/componentFormRadioState"
import ComponentFormDate from '../subComponentes/componentFormDate'
import moment from 'moment';

const axiosCustom=axios.create({
    baseURL:`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/`
})

class ComponentFechaInscripcionFormulario extends React.Component{

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this)
        this.cambiarEstado=this.cambiarEstado.bind(this)
        this.regresar=this.regresar.bind(this)
        this.operacion=this.operacion.bind(this)
        // this.validarNumero=this.validarNumero.bind(this)
        this.state={
            //////
            modulo:"",
            estado_menu:false,
			/////------------
			id_fecha_incripcion:"",
			id_ano_escolar:"",
			id_ano_escolar_respaldo:"",
			fecha_incripcion_desde:"",
			fecha_incripcion_hasta:"",
			fecha_tope_inscripcion:"",
			estado_reapertura_inscripcion:"0",
			///-----
			listaAnosEscolares:[],
            msj_fecha_incripcion_desde:{
                mensaje:"",
                color_texto:""
            },
            msj_fecha_incripcion_hasta:{
                mensaje:"",
                color_texto:""
            },
            msj_fecha_tope_inscripcion:{
                mensaje:"",
                color_texto:""
            },
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
        let acessoModulo =await this.validarAccesoDelModulo("/dashboard/configuracion","/fecha-inscripcion")
        if(acessoModulo){
            const {operacion}=this.props.match.params
            const token=localStorage.getItem('usuario')
            let respuestaAnoActivo=await this.consultarAnoActivo();
            let respuestaAnoSiguiente=await this.consultarAnoSiguiente();
            let datos=[...respuestaAnoActivo,...respuestaAnoSiguiente]
            if(datos.length === 0){
              alert("No hay registros de Año Escolar(será redirigido a la vista anterior)")
              this.props.history.goBack()
            }else{
              this.setState({listaAnosEscolares:datos})
            //   await this.consultarDisponibilidadFechaInscripcion(datos)
              if(operacion==="actualizar"){
                const {id}=this.props.match.params
                await this.consultarFechaInscripcion(id);
              }
            }
         }
         else{
          alert("No tienes acesso a este modulo(será redirigido a la vista anterior)")
          this.props.history.goBack()
         }
    }

    // async consultarDisponibilidadFechaInscripcion(datos){
    //     let json={
    //         anosEscolares:datos
    //     }
    //     await axiosCustom.post(`/configuracion/fecha-inscripcion/consultar-disponibilidad-fecha-inscripcion`,json)
    //     .then(respuesta => {
    //         let respuestaServidor=JSON.parse(JSON.stringify(respuesta.data))
    //         console.log("datos => ",respuestaServidor)
    //         this.setState({listaAnosEscolares:respuestaServidor.datos})
    //     })
    //     .catch(error => {
    //         console.error(`error de la peticion axios =>>> ${error}`)
    //     })
    // }

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
        await axiosCustom.get(`configuracion/acceso/consultar/${idPerfil}`)
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
            if(modulosSistema[modulo][subModulo]){
              estado=true
            }
            // this.setState({modulosSistema})


        })
        .catch(error =>  {
            console.error(error)
        })
        return estado
    }

    async consultarFechaInscripcion(id){
        await axiosCustom.get(`configuracion/fecha-inscripcion/consultar/${id}`)
        .then(respuesta => {
            let respuestaServidor=JSON.parse(JSON.stringify(respuesta.data))
            this.setState({
                id_fecha_incripcion:respuestaServidor.datos.id_fecha_incripcion,
                fecha_incripcion_desde:moment(respuestaServidor.datos.fecha_incripcion_desde).format("YYYY-MM-DD"),
                fecha_incripcion_hasta:moment(respuestaServidor.datos.fecha_incripcion_hasta).format("YYYY-MM-DD"),
                fecha_tope_inscripcion:moment(respuestaServidor.datos.fecha_tope_inscripcion).format("YYYY-MM-DD"),
                id_ano_escolar:respuestaServidor.datos.id_ano_escolar,
                // id_ano_escolar_respaldo:respuestaServidor.datos.id_ano_escolar
            })
            document.getElementById("id_ano_escolar").value=respuestaServidor.datos.id_ano_escolar

        })
        .catch(error => {
            console.error(`error de la peticion axios =>>> ${error}`)
        })
    }

    async consultarAnoActivo(){
        let datos=[]
        await axiosCustom.get(`configuracion/ano-escolar/consultar-ano-escolar-activo`)
        .then(respuesta => {
            let respuestaServidor=JSON.parse(JSON.stringify(respuesta.data))
            datos=respuestaServidor.datos
        })
        .catch(error => {
            console.error(`error de la peticion axios =>>> ${error}`)
        })
        return datos
    }

    async consultarAnoSiguiente(){
        let datos=[]
        await axiosCustom.get(`configuracion/ano-escolar/consultar-ano-escolar-siguiente`)
        .then(respuesta => {
            let respuestaServidor=JSON.parse(JSON.stringify(respuesta.data))
            datos=respuestaServidor.datos
        })
        .catch(error => {
            console.error(`error de la peticion axios =>>> ${error}`)
        })
        return datos
    }

    cambiarEstado(a){
        var input=a.target;
        this.setState({[input.name]:input.value})
    }

    validarFechaInicioInscripcio(){
            let msj_fecha_incripcion_desde=JSON.parse(JSON.stringify(this.state.msj_fecha_incripcion_hasta))
            let estado=false;
            let fechaIncripcionDesde=document.getElementById("fecha_incripcion_desde")
            let fechaIncripcionHasta=document.getElementById("fecha_incripcion_hasta")
            let anoEscolarSelect=document.getElementById("id_ano_escolar")
            let opcionSeleccionado="";
            for(let opcion of anoEscolarSelect.childNodes){
                if(anoEscolarSelect.value===opcion.value){
                    opcionSeleccionado=opcion
                    break;
                }
            }
            // alert(opcionSeleccionado.textContent)
            let inicioAno=opcionSeleccionado.textContent.split("-")[0]
            let finAno=opcionSeleccionado.textContent.split("-")[1]
            if(moment(fechaIncripcionDesde.value,"YYYY-MM-DD").isAfter(inicioAno+"-01-01")){
                if(moment(fechaIncripcionDesde.value,"YYYY-MM-DD").isBefore(finAno+"-12-31")){
                    if(moment(fechaIncripcionDesde.value,"YYYY-MM-DD").isBefore(fechaIncripcionHasta.value)){
                        msj_fecha_incripcion_desde.color_texto="rojo"
                        msj_fecha_incripcion_desde.mensaje=""
                        this.setState({msj_fecha_incripcion_desde})
                        estado=true;
                    }
                    else{
                        msj_fecha_incripcion_desde.color_texto="rojo"
                        msj_fecha_incripcion_desde.mensaje="la fecha inicio de inscripción tiene que ser anterior a la fecha de fin de inscripción"
                        this.setState({msj_fecha_incripcion_desde})
                    }
                }
                else{
                    msj_fecha_incripcion_desde.color_texto="rojo"
                    msj_fecha_incripcion_desde.mensaje="la fecha inicio de inscripción no puede salir del rango del año escolar"
                    this.setState({msj_fecha_incripcion_desde})
                }
            }
            else{
                msj_fecha_incripcion_desde.color_texto="rojo"
                msj_fecha_incripcion_desde.mensaje="la fecha inicio de inscripción no puede salir del rango del año escolar"
                this.setState({msj_fecha_incripcion_desde})
            }
            return estado
        }

        validarFechaFinInscripcio(){
            let msj_fecha_incripcion_hasta=JSON.parse(JSON.stringify(this.state.msj_fecha_incripcion_hasta))
            let estado=false;
            let fechaIncripcionDesde=document.getElementById("fecha_incripcion_desde")
            let fechaIncripcionHasta=document.getElementById("fecha_incripcion_hasta")
            let anoEscolarSelect=document.getElementById("id_ano_escolar")
            let opcionSeleccionado="";
            for(let opcion of anoEscolarSelect.childNodes){
                if(anoEscolarSelect.value===opcion.value){
                    opcionSeleccionado=opcion
                    break;
                }
            }
            // alert(opcionSeleccionado.textContent)
            let inicioAno=opcionSeleccionado.textContent.split("-")[0]
            let finAno=opcionSeleccionado.textContent.split("-")[1]
            if(moment(fechaIncripcionHasta.value,"YYYY-MM-DD").isAfter(moment(inicioAno+"-01-01","YYYY-MM-DD").format("YYYY-MM-DD"))){
                if(moment(fechaIncripcionHasta.value,"YYYY-MM-DD").isBefore(finAno+"-12-31")){
                    if(moment(fechaIncripcionHasta.value,"YYYY-MM-DD").isAfter(fechaIncripcionDesde.value)){
                        msj_fecha_incripcion_hasta.color_texto="rojo"
                        msj_fecha_incripcion_hasta.mensaje=""
                        this.setState({msj_fecha_incripcion_hasta})
                        estado=true;
                    }
                    else{
                        msj_fecha_incripcion_hasta.color_texto="rojo"
                        msj_fecha_incripcion_hasta.mensaje="la fecha fin de inscripción tiene que ser posterior a la fecha inicio de inscripción"
                        this.setState({msj_fecha_incripcion_hasta})
                    }
                }
                else{
                    msj_fecha_incripcion_hasta.color_texto="rojo"
                    msj_fecha_incripcion_hasta.mensaje="la fecha fin de inscripción no puede salir del rango del año escolar"
                    this.setState({msj_fecha_incripcion_hasta})
                }
            }
            else{
                msj_fecha_incripcion_hasta.color_texto="rojo"
                msj_fecha_incripcion_hasta.mensaje="la fecha fin de inscripción no puede salir del rango del año escolar"
                this.setState({msj_fecha_incripcion_hasta})
            }
            return estado;
        }

        validarFechaTopeInscripcio(){
            let msj_fecha_tope_inscripcion=JSON.parse(JSON.stringify(this.state.msj_fecha_tope_inscripcion))
            let estado=false;
            let fechaTopeInscripcion=document.getElementById("fecha_tope_inscripcion")
            let fechaIncripcionHasta=document.getElementById("fecha_incripcion_hasta")
            let anoEscolarSelect=document.getElementById("id_ano_escolar")
            let opcionSeleccionado="";
            for(let opcion of anoEscolarSelect.childNodes){
                if(anoEscolarSelect.value===opcion.value){
                    opcionSeleccionado=opcion
                    break;
                }
            }
            // alert(opcionSeleccionado.textContent)
            let inicioAno=opcionSeleccionado.textContent.split("-")[0]
            let finAno=opcionSeleccionado.textContent.split("-")[1]
            if(moment(fechaTopeInscripcion.value,"YYYY-MM-DD").isBefore(finAno+"-12-31")){
                if(moment(fechaTopeInscripcion.value,"YYYY-MM-DD").isAfter(fechaIncripcionHasta.value)){
                    msj_fecha_tope_inscripcion.color_texto="rojo"
                    msj_fecha_tope_inscripcion.mensaje=""
                    this.setState({msj_fecha_tope_inscripcion})
                    estado=true;
                }
                else{
                    msj_fecha_tope_inscripcion.color_texto="rojo"
                    msj_fecha_tope_inscripcion.mensaje="la fecha tope tiene que ser posterior que la fecha de fin de inscripción"
                    this.setState({msj_fecha_tope_inscripcion})
                }
            }
            else{
                msj_fecha_tope_inscripcion.color_texto="rojo"
                msj_fecha_tope_inscripcion.mensaje="la fecha tope no puede salir del rango del año ecolar"
                this.setState({msj_fecha_tope_inscripcion})
            }
            return estado
        }

    async operacion(){
        const {operacion}=this.props.match.params
        // alert("operacion")
        // validaciones
        // this.validarFechaInicioInscripcio();
        const token=localStorage.getItem('usuario')
        if(this.validarFechaInicioInscripcio() && this.validarFechaFinInscripcio() && this.validarFechaTopeInscripcio()){
            if(operacion==="registrar"){
                let datosFormulario=new FormData(document.getElementById("formularioFechaInscripcion"))
                let datosFormatiados=this.extrarDatosDelFormData(datosFormulario)
                let datosFechaInscripcion={
                    fecha_inscripcion:datosFormatiados,
                    token
                }
                await axiosCustom.post("configuracion/fecha-inscripcion/registrar",datosFechaInscripcion)
                .then(respuesta => {
                    let respuestaServidor=JSON.parse(JSON.stringify(respuesta.data))
                    let alerta=JSON.parse(JSON.stringify(this.state.alerta))
                    alerta.color=respuestaServidor.color_alerta
                    alerta.mensaje=respuestaServidor.mensaje
                    if(respuestaServidor.estado_respuesta===false){
                        alerta.estado=true
                    }
                    else{
                        alerta.estado=respuestaServidor.estado_respuesta
                    }
                    this.setState({alerta})
                })
                .catch(error => {
                    console.error(`error de la peticion axios =>>> ${error}`)
                })
                // this.consultarDisponibilidadFechaInscripcion(this.state.listaAnosEscolares)

            }
            else if(operacion==="actualizar"){
                // alert("actualizando")
                let {id} = this.props.match.params
                let datosFormulario=new FormData(document.getElementById("formularioFechaInscripcion"))
                let datosFormatiados=this.extrarDatosDelFormData(datosFormulario)
                let datosFechaInscripcion={
                    fecha_inscripcion:datosFormatiados,
                    token
                }
                // console.log(datosFechaInscripcion)
                await axiosCustom.put(`configuracion/fecha-inscripcion/actualizar/${id}`,datosFechaInscripcion)
                .then(respuesta => {
                    let respuestaServidor=JSON.parse(JSON.stringify(respuesta.data))
                    let alerta=JSON.parse(JSON.stringify(this.state.alerta))
                    alerta.color=respuestaServidor.color_alerta
                    alerta.mensaje=respuestaServidor.mensaje
                    if(respuestaServidor.estado_respuesta===false){
                        alerta.estado=true
                    }
                    else{
                        alerta.estado=respuestaServidor.estado_respuesta
                    }
                    this.setState({alerta})
                })
                .catch(error => {
                    console.error(`error de la peticion axios =>>> ${error}`)
                })
                // this.consultarDisponibilidadFechaInscripcion(this.state.listaAnosEscolares)
            }
        }
        else{
            alert("error al validar el formulario")
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

    regresar(){
        this.props.history.push("/dashboard/configuracion/fecha-inscripcion")
    }


    render(){
        const jsx=(
            <div className="row justify-content-center">
                {this.state.alerta.estado===true &&
                    (<div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                        <AlertBootstrap colorAlert={this.state.alerta.color} mensaje={this.state.alerta.mensaje}/>
                    </div>
				    )
				}

                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_formulario_grado">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-fecha-inscripcion">
                            <span className="titulo-form-fecha-inscripcion">Formulario Fecha Inscripción</span>
                        </div>
                    </div>
                    <form id="formularioFechaInscripcion" >
                        <div className="row justify-content-center">
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            nombreCampo="Código Fecha Inscripción:"
                            activo="no"
                            type="text"
                            value={this.state.id_fecha_incripcion}
							name="id_fecha_incripcion"
							id="id_fecha_incripcion"
							placeholder="Código Fecha Inscripción"
                            eventoPadre={this.cambiarEstado}
                            />

                            <ComponentFormDate
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            nombreCampoDate="Fecha Inicio Inscripción:"
                            clasesCampo="form-control"
                            mensaje={this.state.msj_fecha_incripcion_desde}
                            obligatorio="si"
                            value={this.state.fecha_incripcion_desde}
                            name="fecha_incripcion_desde"
                            id="fecha_incripcion_desde"
                            eventoPadre={this.cambiarEstado}
                            />

                            <ComponentFormDate
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            nombreCampoDate="Fecha Fin Inscripción:"
                            clasesCampo="form-control"
                            mensaje={this.state.msj_fecha_incripcion_hasta}
                            obligatorio="si"
                            value={this.state.fecha_incripcion_hasta}
                            name="fecha_incripcion_hasta"
                            id="fecha_incripcion_hasta"
                            eventoPadre={this.cambiarEstado}
                            />

						</div>
                        <div className="row justify-content-center">
                        <ComponentFormDate
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            nombreCampoDate="Fecha Tope de Inscripción:"
                            clasesCampo="form-control"
                            mensaje={this.state.msj_fecha_tope_inscripcion}
                            obligatorio="si"
                            value={this.state.fecha_tope_inscripcion}
                            name="fecha_tope_inscripcion"
                            id="fecha_tope_inscripcion"
                            eventoPadre={this.cambiarEstado}
                            />
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div class="form-groud">
                                    <label><span className="obligatorio-campo">(*)</span>Año Escolares</label>
                                    <select class="form-select custom-select" onChange={this.cambiarEstado} id="id_ano_escolar" name="id_ano_escolar" aria-label="Default select example" >
                                        <option value="null">Selccione un año escolar</option>
						{this.state.listaAnosEscolares.map((ano,index) => {
								return <option key={index} value={ano.id_ano_escolar}>{ano.ano_desde}-{ano.ano_hasta}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
                            <input type="hidden" value="0" id="estado_reapertura_inscripcion" name="estado_reapertura_inscripcion" />
                        </div>
					</form>
                    <div className="row justify-content-center">
                        <div className="col-auto">
                            {this.props.match.params.operacion==="registrar" &&
                                <InputButton
                                clasesBoton="btn btn-primary"
                                id="boton-registrar"
                                value="Registrar"
                                eventoPadre={this.operacion}
                                />
                            }
                            {this.props.match.params.operacion==="actualizar" &&
                                <InputButton
                                clasesBoton="btn btn-warning"
                                id="boton-actualizar"
                                value="Actualizar"
                                eventoPadre={this.operacion}
                                />
                            }
                        </div>
                        <div className="col-auto">
                            <InputButton
                            clasesBoton="btn btn-danger"
                            id="boton-cancelar"
                            value="Cancelar"
                            eventoPadre={this.regresar}
                            />
                        </div>
                    </div>
				</div>
            </div>
        )
        return(
            <div className="component_fecha_inscripcion_formulario">

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

export default withRouter(ComponentFechaInscripcionFormulario)
