import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentAsignacionAulaProfesorForm.css'
//JS
import axios from 'axios'
// IP servidor
import servidor from '../ipServer.js'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import AlertBootstrap from "../subComponentes/alertBootstrap"
import InputButton from '../subComponentes/input_button'
import ComponentFormCampo from '../subComponentes/componentFormCampo';
import ComponentFormSelect from '../subComponentes/componentFormSelect';
import ComponentFormRadioState from '../subComponentes/componentFormRadioState';

const axiosCustom=axios.create({
    baseURL:`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/`
})


class ComponentAsignacionAulaProfesorForm extends React.Component {

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this)
        this.cambiarEstado=this.cambiarEstado.bind(this)
        this.buscarProfesor=this.buscarProfesor.bind(this)
        this.consultarAulasPorGrado2=this.consultarAulasPorGrado2.bind(this)
        this.operacion=this.operacion.bind(this)
        this.verificarDisponibilidadAula=this.verificarDisponibilidadAula.bind(this)
        this.regresar=this.regresar.bind(this)
        this.state={
            modulo:"",
            estado_menu:false,
            // formulario
            id_cedula:"",
            id_grado:"",
            //
            id_asignacion_aula_profesor:"",
            id_profesor:"",
            id_aula:"",
            id_ano_escolar:"",
            estatus_asignacion_aula_profesor:"1",
            // -----------------------------
            ano_desde:"",
            ano_hasta:"",
            // -----------------------------
            listaGrados:[],
            listaAulas:[],
            hashListaProfesores:{},
            hashListaAnoEscolares:{},
            hashAnoEscolaresActivo:{},
            hashAnoEscolaresSiguiente:{},
            // 
            disponibilidadProfesor:null,
            disponibilidadAula:null,
            // 
            msj_id_cedula:{
                mensaje:"",
                color_texto:""
            },
            // estas propiedades son para al momento de actualizar el registro destingir si estan igual o si se ha aplicado algun cambio,
            // para poder asi poder aplicar las validaciones
            cambioProfesor:true,
            cambioAula:true,
            respaldoDatos:{
                id_asignacion_aula_profesor:null,
                id_profesor:null,
                id_aula:null,
                id_ano_escolar:null,
                estatus_asignacion_aula_profesor:null
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
        const {operacion}=this.props.match.params
        let acessoModulo=await this.validarAccesoDelModulo("/dashboard/transaccion","/asignacion-aula-profesor")
        if(acessoModulo){
            if(operacion==="registrar"){
                await this.consultarAnoEscolarActivo()
                await this.consultarProfesores()
                await this.consultarGrados()
                await this.consultarAulasPorGrado()
                let selectAula={
                    target:{
                        id:"id_aula",
                        name:"id_aula",
                        value:document.getElementById("id_aula").value
                    }
                }
                await this.verificarDisponibilidadAula(selectAula)
            }
            else if(operacion==="actualizar"){
                const {id}=this.props.match.params
                await this.consultarProfesores()
                await this.consultarGrados()
                await this.consultarAulasPorGrado()
                await this.consultarAsignacionAulaProfesor(id)
                if(this.state.id_asignacion_aula_profesor!=""){
                    let cedulaProfesor={
                        target:{
                            value:this.state.id_cedula,
                        }
                    }
                    let selectIdGrado={
                        target:{
                            value:this.state.id_grado,
                        }
                    }
                    this.buscarProfesor(cedulaProfesor)
                    document.getElementById("id_grado").value=this.state.id_grado
                    await this.consultarAulasPorGrado2(selectIdGrado)
                    document.getElementById("id_aula").value=this.state.id_aula
                    this.setState({cambioProfesor:false})
                    this.setState({cambioAula:false})
                    // document.getElementById("contenedorDisponibilidadProfesor").style.display="none"
                }
    
            }
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

    async consultarAsignacionAulaProfesor(id){
        await axiosCustom.get(`transaccion/asignacion-aula-profesor/consultar/${id}`)
        .then(respuesta => {
            let json=JSON.parse(JSON.stringify(respuesta.data))
            console.log(json)
            if(json.datos.length>0){
                this.setState({
                    id_cedula:json.datos[0].id_cedula,
                    id_asignacion_aula_profesor:json.datos[0].id_asignacion_aula_profesor,
                    id_profesor:json.datos[0].id_profesor,
                    id_grado:json.datos[0].id_grado,
                    id_aula:json.datos[0].id_aula,
                    id_ano_escolar:json.datos[0].id_ano_escolar,
                    estatus_asignacion_aula_profesor:json.datos[0].estatus_asignacion_aula_profesor,
                    ano_desde:json.datos[0].ano_desde,
                    ano_hasta:json.datos[0].ano_hasta
                })
                let respaldoDatos=JSON.parse(JSON.stringify({
                    id_cedula:json.datos[0].id_cedula,
                    id_asignacion_aula_profesor:json.datos[0].id_asignacion_aula_profesor,
                    id_profesor:json.datos[0].id_profesor,
                    id_grado:json.datos[0].id_grado,
                    id_aula:json.datos[0].id_aula,
                    id_ano_escolar:json.datos[0].id_ano_escolar,
                    estatus_asignacion_aula_profesor:json.datos[0].estatus_asignacion_aula_profesor
                }))
                this.setState({respaldoDatos})
            }
            else{
                alert("el registro que intento consultar no se encuentra en la base de datos")
            }
        })
        .catch(error => {
            console.error(error)
        })
    }

    async consultarAnoEscolarActivo(){
        await axiosCustom.get(`configuracion/ano-escolar/consultar-ano-escolar-activo`)
        .then(respuesta =>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
            // console.log(json)
            if(json.datos.length===1){
                this.setState({hashAnoEscolaresActivo:json.datos[0]})
                this.setState({id_ano_escolar:this.state.hashAnoEscolaresActivo.id_ano_escolar})
                this.setState({ano_desde:this.state.hashAnoEscolaresActivo.ano_desde})
                this.setState({ano_hasta:this.state.hashAnoEscolaresActivo.ano_hasta})
            }

        })
        .catch(error => {
            console.error(error)
        })
    }
    
    async consultarAnoEscolarSiguiente(){
        await axiosCustom.get(`configuracion/ano-escolar/consultar-ano-escolar-siguiente`)
        .then(respuesta =>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
            console.log(json)
            let hashAnoEscolaresSiguiente=json.datos
            if(json.estado_respuesta===true){
                this.setState({hashAnoEscolaresSiguiente})
                

            }
            else{
                this.setState({disponibilidadProfesor:false})
            }

        })
        .catch(error => {
            console.error(error)
        })
    }

    async verficarDisponibilidadProfesorSiguienteAnoEscolar(){

    }

    async consultarProfesores(){
        await axiosCustom.get(`configuracion/profesor/consultar-todos`)
        .then(respuesta =>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
            let hash={}
            for(let profesor of json.datos){
                hash[profesor.id_cedula]=profesor
            }
            this.setState({hashListaProfesores:hash})

        })
        .catch(error => {
            console.error(error)
        })
    }

    async consultarGrados(){
        await axiosCustom.get(`configuracion/grado/consultar-todos`)
        .then(respuesta =>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
            this.setState({listaGrados:json.datos})
            if(json.datos.length>0){
                this.setState({id_grado:this.state.listaGrados[0].id_grado})
            }

        })
        .catch(error => {
            console.error(error)
        })
    }
    
    async consultarAulasPorGrado(){
        if(this.state.listaGrados.length>0){
            let id_grado=document.getElementById("id_grado").value
            await axiosCustom.get(`configuracion/aula/consultar-aula-por-grado/${id_grado}`)
            .then(respuesta =>{
                let json=JSON.parse(JSON.stringify(respuesta.data))
                this.setState({listaAulas:json.datos})
                if(json.datos.length>0){
                    this.setState({id_aula:this.state.listaAulas[0].id_aula})
                }

            })
            .catch(error => {
                console.error(error)
            })
        }
    }
    
    async consultarAulasPorGrado2(a){
        let inputSelectGrados=a.target
        await axiosCustom.get(`configuracion/aula/consultar-aula-por-grado/${inputSelectGrados.value}`)
        .then(respuesta =>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
            this.setState({listaAulas:json.datos})
            if(this.props.match.params.operacion==="actualizar"){
                if(this.state.respaldoDatos.id_aula!==json.datos[0].id_aula){
                    this.setState({cambioAula:true})
                }
                else{
                    this.setState({cambioAula:false})
    
                }
            }

        })
        .catch(error => {
            console.error(error)
        })
    }

    cambiarEstado(a){
        var input=a.target;
        this.setState({[input.name]:input.value})
    }

    regresar(){
        this.props.history.push("/dashboard/transaccion/asignacion-aula-profesor")
    }

    async buscarProfesor(a){
        this.cambiarEstado(a)
        let input=a.target
        let $seccionNombreProfesor=document.getElementById("nombreProfesor")
        let msj_id_cedula=JSON.parse(JSON.stringify(this.state.msj_id_cedula))
        if(input.value.length===8){
            let profesor=this.state.hashListaProfesores[input.value]
            if(this.state.hashListaProfesores[input.value]){
                $seccionNombreProfesor.textContent=`${profesor.nombres} ${profesor.apellidos}`
                this.setState({id_profesor:profesor.id_profesor})
                msj_id_cedula.mensaje=""
                msj_id_cedula.color_texto="rojo"
                await this.verficarDisponibilidadProfesor(profesor.id_profesor)
                if(this.props.match.params.operacion==="actualizar"){
                    if(this.state.respaldoDatos.id_profesor!==this.state.id_profesor){
                        this.setState({cambioProfesor:true})
                    }
                    else{
                        this.setState({cambioProfesor:false})

                    }
                }
            }
            else{
                $seccionNombreProfesor.textContent=``
                this.setState({id_profesor:""})
                msj_id_cedula.mensaje="no hay ningun profesor en la lista que tenga esta cedula"
                msj_id_cedula.color_texto="rojo"
            }
            this.setState({msj_id_cedula})
        }
        else{
            this.setState({id_profesor:""})
            $seccionNombreProfesor.textContent=``
        }
        
        
    }

    async verficarDisponibilidadProfesor(idProfesor){
        await axiosCustom.get(`transaccion/asignacion-aula-profesor/consultar-disponibilidad-profesor/${this.state.id_ano_escolar}/${idProfesor}`)
        .then(async respuesta =>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
            // console.log(json)
            if(json.datos.disponibilidadProfesor===true){
                this.setState({disponibilidadProfesor:true})
            }
            else{
                // this.setState({disponibilidadProfesor:false})
                // AQUI
                await this.consultarAnoEscolarSiguiente()
            }

        })
        .catch(error => {
            console.error(error)
        })
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

    validarCampoCedulaProfesor(){
        let estado=false
        let cedulaProfesor=document.getElementById("id_cedula")
        let exprecion=/[0-9]/
        let msj_id_cedula=JSON.parse(JSON.stringify(this.state.msj_id_cedula))
        if(cedulaProfesor.value!=""){
            if(cedulaProfesor.value.length===8){
                if(this.state.hashListaProfesores[cedulaProfesor.value]){
                    estado=true
                    msj_id_cedula.mensaje=``
                    msj_id_cedula.color_texto="verde"
                }
                else{
                    msj_id_cedula.mensaje=`el profesor no ha sido encontrado, por favor verifique que la cedula este bien escrita`
                    msj_id_cedula.color_texto="rojo"
                }
            }
            else{
                msj_id_cedula.mensaje=`este campo no cumple con los caracteres minimos para realizar la busqueda del profesor ${cedulaProfesor.value.length}/8`
                msj_id_cedula.color_texto="rojo"
            }
        }
        else{
            msj_id_cedula.mensaje="este campo no puede estar vacio"
            msj_id_cedula.color_texto="rojo"
        }
        this.setState({msj_id_cedula})
        return estado

    }

    async verificarDisponibilidadAula(a){
        this.cambiarEstado(a)
        let input =a.target
        await axiosCustom.get(`transaccion/asignacion-aula-profesor/consultar-disponibilidad-aula/${this.state.id_ano_escolar}/${input.value}`)
        .then(respuesta =>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
            console.log(json)
            if(json.datos.disponibilidadAula===true){
                this.setState({disponibilidadAula:true})
            }
            else{
                
                this.setState({disponibilidadAula:false})
            }
        })
        .catch(error => {
            console.error(error)
        })
        if(this.props.match.params.operacion==="actualizar"){
            if(this.state.respaldoDatos.id_aula!==parseInt(input.value)){
                this.setState({cambioAula:true})
            }
            else{
                this.setState({cambioAula:false})

            }
        }

    }

    // validarDisponibilidadAula(){

    // }

    validarFormulario(){
        let estado=false
        let estadoValidacionCedulaProfesor=this.validarCampoCedulaProfesor()
        if(estadoValidacionCedulaProfesor){
            estado=true
        }
        return estado
    }

    verificarCambios(){
        let idProfesor=parseInt(document.getElementById("id_profesor").value )
        let idAula=parseInt(document.getElementById("id_aula").value)
        let estadoValidacionAula=false
        let estadoValidacionProfesor=false
        if(this.state.respaldoDatos.id_aula!==idAula){
            alert("no")
            estadoValidacionAula=true
        }
        if(this.state.respaldoDatos.id_profesor!==idProfesor){
            alert("no")
            estadoValidacionProfesor=true
        }
        if(estadoValidacionAula===false && estadoValidacionProfesor===false){
            return true
        }
        else{
            return false
        }
    }

    async operacion(){
        const {operacion}=this.props.match.params
        // alert("operacion")
        const token=localStorage.getItem('usuario')

            if(operacion==="registrar"){
                if(this.state.disponibilidadAula===true && this.state.disponibilidadProfesor===true && this.validarCampoCedulaProfesor()===true){
                    // alert("Registrar")
                    let datosFormulario=new FormData(document.getElementById("formularioAsigAulaProf"))
                    let datosFormatiados=this.extrarDatosDelFormData(datosFormulario)
                    let datosAsignacion={
                        asignacionAulaProfesor:datosFormatiados,
                        token
                    }
                    // console.log(datosAula)
                    await axiosCustom.post("transaccion/asignacion-aula-profesor/registrar",datosAsignacion)
                    .then(respuesta => {
                        let respuestaServidor=JSON.parse(JSON.stringify(respuesta.data))
                        let alerta=JSON.parse(JSON.stringify(this.state.alerta))
                        // console.log(respuestaServidor)
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
                }
                else{
                    alert("error al validar el formulario")
                }
            }
            else if(operacion==="actualizar"){
                let estado=false
                let estadoOperacion=false
                if(this.state.cambioAula===false || this.state.cambioProfesor===false){
                    estado=true
                }
                if(!estado){
                    if(this.state.cambioProfesor===true){
                        this.validarCampoCedulaProfesor()
                    }
                    if(this.state.disponibilidadAula===true && this.state.disponibilidadProfesor===true){
                        estadoOperacion=true
                    }
                }
                else{
                    estadoOperacion=true
                }
                if(estadoOperacion){
                    let datosFormulario=new FormData(document.getElementById("formularioAsigAulaProf"))
                    let datosFormatiados=this.extrarDatosDelFormData(datosFormulario)
                    let datosAsignacion={
                        asignacionAulaProfesor:datosFormatiados,
                        token
                    }
                    // console.log(datosAula)
                    await axiosCustom.put(`transaccion/asignacion-aula-profesor/actualizar/${this.props.match.params.id}`,datosAsignacion)
                    .then(respuesta => {
                        let respuestaServidor=JSON.parse(JSON.stringify(respuesta.data))
                        let alerta=JSON.parse(JSON.stringify(this.state.alerta))
                        // console.log(respuestaServidor)
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
                }
                else{
                    alert("error al validar el formulario")
                }

               
            }
    }

    render(){
        const jsx=(
            <div className="row justify-content-center">
                {this.state.alerta.estado===true &&
                    (<div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">

                        <AlertBootstrap colorAlert={this.state.alerta.color} mensaje={this.state.alerta.mensaje}/>
                        
                    </div>)
                }
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_formulario_asig_aula_prof">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-asig-aula-prof">
                            <span className="titulo-form-reposo">Formulario Asignacion Aula Profesor</span>
                        </div>
                    </div>
                    <form id="formularioAsigAulaProf" >
                        <div className="row justify-content-center">
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            nombreCampo="Código Asignación:"
                            activo="no"
                            type="text"
                            value={this.state.id_asignacion_aula_profesor}
                            name="id_asignacion_aula_profesor"
                            id="id_asignacion_aula_profesor"
                            placeholder="Código Asignacion"
                            eventoPadre={this.cambiarEstado}
                            />
                            <div className='col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3'></div>
                            <div className='col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3'>
                                <label>Año Escolar:</label>
                                <div>{this.state.ano_desde} - {this.state.ano_hasta}</div>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                                <span className="sub-titulo-form-reposo-trabajador">Profesor</span>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            nombreCampo="Cedula:"
                            activo="si"
                            type="text"
                            value={this.state.id_cedula}
                            name="id_cedula"
                            id="id_cedula"
                            placeholder="Cedula"
                            mensaje={this.state.msj_id_cedula}
                            eventoPadre={this.buscarProfesor}
                            />
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <label>Nombre Completo:</label>
                                <div id="nombreProfesor">Sin nombre</div>
                            </div>
                            <input type="hidden" id="id_profesor" name="id_profesor" value={this.state.id_profesor}/>
                            <input type="hidden" id="id_ano_escolar" name="id_ano_escolar" value={this.state.id_ano_escolar}/>
                            {this.state.cambioProfesor===true &&
                                <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3" id="contenedorDisponibilidadProfesor">
                                    <label>Disponibilidad del Profesor:</label>
                                    {this.state.disponibilidadProfesor===true &&
                                            <div>Disponible </div>
                                    }
                                    {this.state.disponibilidadProfesor===false &&
                                            <div>No Disponible</div>
                                    }
                                </div>
                            }
                            {this.state.cambioProfesor===false &&
                               <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
                            }
                        </div>
                        <div className="row mt-3">
                            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                                <span className="sub-titulo-form-reposo-trabajador">Aula</span>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div class="form-groud">
                                    <label>Grado</label>
                                    <select id="id_grado" name="id_grado" class="form-select custom-select" aria-label="Default select example" onChange={this.consultarAulasPorGrado2}>
                                        {this.state.listaGrados.map((grado,index)=> {
                                            return(
                                                <option key={index} value={grado.id_grado} >{grado.numero_grado}</option>
                                            )
                                            })

                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div class="form-groud">
                                    <label>Sección</label>
                                    <select id="id_aula" name="id_aula" class="form-select custom-select" aria-label="Default select example" onChange={this.verificarDisponibilidadAula}>
                                        {this.state.listaAulas.map((aula,index)=> {
                                            return(
                                                <option key={index} value={aula.id_aula} >{aula.nombre_aula}</option>
                                            )
                                            })

                                        }
                                    </select>
                                </div>
                            </div>
                            
                            {this.state.cambioAula===true &&
                                <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <label>Disponibilidad del Aula:</label>
                                    {this.state.disponibilidadAula===true &&
                                            <div>Aula Disponible</div>
                                    }
                                    {this.state.disponibilidadAula===false &&
                                            <div>Aula no Disponible</div>
                                    }
                                </div>
                            }
                            {this.state.cambioAula===false &&
                                <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
                            }
                        </div>
                        <div className="row mt-3">
                            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                                <span className="sub-titulo-form-reposo-trabajador">Otros</span>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormRadioState
                            clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            extra="custom-control-inline"
                            nombreCampoRadio="Estatus:"
                            name="estatus_asignacion_aula_profesor"
                            nombreLabelRadioA="Activo"
                            idRadioA="activoA"
                            checkedRadioA={this.state.estatus_asignacion_aula_profesor}
                            valueRadioA="1"
                            nombreLabelRadioB="Inactivo"
                            idRadioB="activoB"
                            valueRadioB="0"
                            eventoPadre={this.cambiarEstado}
                            checkedRadioB={this.state.estatus_asignacion_aula_profesor}
                            />
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
            <div className="component_asig_aula_prof_formulario">

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

export default withRouter(ComponentAsignacionAulaProfesorForm)