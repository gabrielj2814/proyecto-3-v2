import React from 'react';
import {withRouter} from 'react-router-dom'
import $ from 'jquery'
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
        this.cerrarModal=this.cerrarModal.bind(this)
        this.verficarDisponibilidadProfesorAnoEscolarSiguiente=this.verficarDisponibilidadProfesorAnoEscolarSiguiente.bind(this)
        this.consultarAnoEscolarActivo = this.consultarAnoEscolarActivo.bind(this)
        this.guardarEspecialista = this.guardarEspecialista.bind(this)
        this.eliminarEspecialistas = this.eliminarEspecialistas.bind(this)
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
            numero_total_de_estudiantes:"",
            estatus_asignacion_aula_profesor:"1",
            id_especialista:"",
            id_aula_espacio:"",
            listaDenNumeroEstudiante:[],
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
            listaDeEspecialistas:[],
            listaIdEspecialistaHaEnviar:[],
            especialistaHaMostrarInterfaz:[],
            listaDeAulaEspacio:[],
            aulasDisponiblesSelect:[],
            //
            alerta:{
                color:"",
                mensaje:"",
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
            let existenciaSeccionGrado=await this.verificarEcistenciaDeSeccionesEnGrados()
            if(existenciaSeccionGrado.length===0){
                let datosEspecialistaActivos=await this.consultarEspecialistasActivos()
                // alert(datosEspecialistaActivos.length)
                if(datosEspecialistaActivos.length>0){
                    let cantidadDeEstudiante=36
                    let listaDenNumeroEstudiante=[]

                    for(let contador=0;contador < cantidadDeEstudiante;contador++){
                        listaDenNumeroEstudiante.push(contador+1)
                    }
                    this.setState({listaDenNumeroEstudiante})

                    await this.consultarAulaEspacio()
                    await this.consultarAnoEscolarActivo()
                    await this.consultarProfesores()
                    await this.consultarGrados()
                    await this.consultarAulasPorGrado()
                    if(operacion==="registrar"){

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
                        // await this.consultarAulaEspacio()
                        // await this.consultarProfesores()
                        // await this.consultarGrados()
                        // await this.consultarAulasPorGrado()
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
                            await this.cosultarAulasEspaciosDisponibles(this.state.id_ano_escolar)
                        }

                    }
                }
                else{
                    alert("no hay especialistas activos")
                    this.props.history.goBack()
                }
            }
            else{
                let listaDeGrados=existenciaSeccionGrado.map(grado => grado.numero_grado)
                let grados=((listaDeGrados.length>1)?listaDeGrados.join(", "):listaDeGrados[0])
                alert("hay un total de "+existenciaSeccionGrado.length+" grados que no tienen seccion de los cuales son ( "+grados+" ) por favor agregarle al menos una sección a esos grados")
                this.props.history.goBack()
            }
        }
        else{
            alert("No tienes acesso a este modulo(sera redirigido a la vista anterior)")
            this.props.history.goBack()
        }


    }

    async consultarEspecialistasActivos(){
        let respuestaEspecialista = []
        await axiosCustom.get(`/configuracion/especialista/consultar-todos-activo`)
        .then(respuesta =>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
            respuestaEspecialista=[...json.datos]
            if(json.estado_respuesta===true){
                this.setState({listaDeEspecialistas: json.datos})
            }

        })
        .catch(error => {
            console.error(error)
        })
        return respuestaEspecialista
    }

    async consultarAulaEspacio(){
        await axiosCustom.get(`/configuracion/aula-espacio/consultar-todos`)
        .then(respuesta =>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
            if(json.estado_respuesta===true){
                this.setState({listaDeAulaEspacio: json.datos})
            }

        })
        .catch(error => {
            console.error(error)
        })
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
            // console.log(modulosSistema)
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
        const token=localStorage.getItem("usuario")
        await axiosCustom.get(`transaccion/asignacion-aula-profesor/consultar/${id}/${token}`)
        .then(respuesta => {
            let json=JSON.parse(JSON.stringify(respuesta.data))
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
                    ano_hasta:json.datos[0].ano_hasta,
                    numero_total_de_estudiantes:json.datos[0].numero_total_de_estudiantes,
                    id_aula_espacio:json.datos[0].id_aula_espacio

                })
                let listaIdEspecialistaHaEnviar=json.datos[0].especialistas.map(especialista => parseInt(especialista.id_especialista))
                this.setState({listaIdEspecialistaHaEnviar})
                let especialistaHaMostrar=listaIdEspecialistaHaEnviar.map(idEspecialista => {
                    return this.state.listaDeEspecialistas.find(especialista => parseInt(idEspecialista)===especialista.id_especialista)
                })
                this.setState({especialistaHaMostrarInterfaz:especialistaHaMostrar})
                document.getElementById("numero_total_de_estudiantes").value=json.datos[0].numero_total_de_estudiantes
                let respaldoDatos=JSON.parse(JSON.stringify({
                    id_cedula:json.datos[0].id_cedula,
                    id_asignacion_aula_profesor:json.datos[0].id_asignacion_aula_profesor,
                    id_profesor:json.datos[0].id_profesor,
                    id_grado:json.datos[0].id_grado,
                    id_aula:json.datos[0].id_aula,
                    id_ano_escolar:json.datos[0].id_ano_escolar,
                    estatus_asignacion_aula_profesor:json.datos[0].estatus_asignacion_aula_profesor,
                    id_aula_espacio:json.datos[0].id_aula_espacio,
                    listaIdEspecialistaHaEnviar
                }))
                this.setState({respaldoDatos})
            }
            else{
                alert("El registro que intento consultar no se encuentra en la base de datos")
            }
        })
        .catch(error => {
            console.error(error)
        })
    }

    async consultarAnoEscolarActivo(){
        await axiosCustom.get(`configuracion/ano-escolar/consultar-ano-escolar-activo`)
        .then(async respuesta =>{
            let json=JSON.parse(JSON.stringify(respuesta.data))

            if(json.datos.length===1){

                this.setState({
                    id_ano_escolar:json.datos[0].id_ano_escolar,
                    ano_desde:json.datos[0].ano_desde,
                    ano_hasta:json.datos[0].ano_hasta,
                    hashAnoEscolaresActivo: json.datos[0]
                })
                await this.cosultarAulasEspaciosDisponibles(json.datos[0].id_ano_escolar)
                return true;
            }else{
                let mensaje = {};

                mensaje.color = json.color_alerta
                mensaje.estado = true
                mensaje.mensaje = json.mensaje

                document.getElementById("id_cedula").disabled = true;
                document.getElementById("boton-registrar").disabled = true;
                this.setState({alerta:mensaje})
              // alert(alerta.mensaje);

                return false;
            }

        })
        .catch(error => {
            console.error(error)
        })
    }

    async consultarAnoEscolarSiguiente(){
        await axiosCustom.get(`configuracion/ano-escolar/consultar-ano-escolar-siguiente`)
        .then(async respuesta =>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
            if(json.estado_respuesta===true){
                let hashAnoEscolaresSiguiente=json.datos[0]
                await this.cosultarAulasEspaciosDisponibles(json.datos[0].id_ano_escolar)
                this.setState({hashAnoEscolaresSiguiente})
                // this.setState({id_ano_escolar:this.state.hashAnoEscolaresSiguiente.id_ano_escolar})
            }
            else{
                this.setState({disponibilidadProfesor:false})
                // poner mensaje de que no hay año siguiente disponible
            }

        })
        .catch(error => {
            console.error(error)
        })
    }


    async cosultarAulasEspaciosDisponibles(idAnnoEscolar){
        let datos={
            idAnnoEscolar:idAnnoEscolar,
            aulas:this.state.listaDeAulaEspacio
        }
        // console.log("lista de datos => ",datos)
        await axiosCustom.post(`transaccion/asignacion-aula-profesor/consultar-aulas-espacio-disponible`,datos)
        .then(respuesta =>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
            console.log("id ano escolar => ",idAnnoEscolar)
            console.log("datos de aulas diponibles => ",json)
            this.setState({aulasDisponiblesSelect:json.datos})

        })
        .catch(error => {
            console.error(error)
        })
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
        this.setState({hashAnoEscolaresSiguiente:{}})
        let input=a.target
        let $seccionNombreProfesor=document.getElementById("nombreProfesor")
        let msj_id_cedula=JSON.parse(JSON.stringify(this.state.msj_id_cedula))
        if(input.value.length>=7){
            let profesor=this.state.hashListaProfesores[input.value]
            if(this.state.hashListaProfesores[input.value]){
                $seccionNombreProfesor.textContent=`${profesor.nombres} ${profesor.apellidos}`
                this.setState({id_profesor:profesor.id_profesor})
                msj_id_cedula.mensaje=""
                msj_id_cedula.color_texto="rojo"

                if(this.props.match.params.operacion==="actualizar"){
                    if(this.state.respaldoDatos.id_profesor!==this.state.id_profesor){
                        this.setState({cambioProfesor:true})
                    }
                    else{
                        this.setState({cambioProfesor:false})

                    }
                }
                else{
                    await this.verficarDisponibilidadProfesor(profesor.id_profesor)
                }
            }
            else{
                $seccionNombreProfesor.textContent=``
                this.setState({id_profesor:""})
                msj_id_cedula.mensaje="No hay ningun profesor en la lista que tenga esta cédula"
                msj_id_cedula.color_texto="rojo"
            }
            this.setState({msj_id_cedula})
        }
        else{
            this.setState({id_profesor:""})
            $seccionNombreProfesor.textContent=``
        }
        if(this.props.match.params.operacion==="registrar"){
            if(document.getElementById("boton-registrar")){
                if(input.value.length>=7){
                    this.verficarEstadoTrebajador(input.value)
                }
            }
        }
    }

    async verficarEstadoTrebajador(cedula){
        // esta funcion se ultiliza para consultrar si el trabajador esta activo
        // ademas ve si tiene un reposos o un permiso activo para evitar que se puede registrar el trabajador
        // en asignacion aula profesor
        await axiosCustom.get(`transaccion/asignacion-aula-profesor/verificar-disponibilidad-trabajador/${cedula}`)
        .then(async respuesta =>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
            if(json.disponibilidad===true){
                document.getElementById("boton-registrar").removeAttribute("disabled")
            }
            else{
                alert(json.mensaje)
                document.getElementById("boton-registrar").setAttribute("disabled","disabled")
            }

        })
        .catch(error => {
            console.error(error)
        })

    }

    async verficarDisponibilidadProfesor(idProfesor){
        await axiosCustom.get(`transaccion/asignacion-aula-profesor/consultar-disponibilidad-profesor/${this.state.id_ano_escolar}/${idProfesor}`)
        .then(async respuesta =>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
            console.log("disponibilidad profesor",json)
            if(json.datos.disponibilidadProfesor===true){
                // alert("ook")
                this.setState({disponibilidadProfesor:true})
            }
            else{
                await this.consultarAnoEscolarSiguiente()
                if(this.state.hashAnoEscolaresSiguiente.id_ano_escolar){

                    if(this.props.match.params.operacion==="actualizar"){
                        if(this.state.respaldoDatos.id_profesor!==this.state.id_profesor){
                            // alert("aqui 2")
                            $("#modalAginacionProferosSiguiente").modal("show")
                            document.getElementById("asginarProfesor").setAttribute("data-id-profesor",idProfesor)
                        }
                    }
                    else{
                        // alert("aqui")
                        $("#modalAginacionProferosSiguiente").modal("show")
                        document.getElementById("asginarProfesor").setAttribute("data-id-profesor",idProfesor)
                    }
                    // await this.verficarDisponibilidadProfesorAnoEscolarSiguiente(idProfesor)
                }
                else{
                    document.getElementById("parrafoMensaje").textContent="no hay año siguiente disponible"
                    $("#modalMensaje").modal("show")
                    this.setState({disponibilidadProfesor:false})
                }
            }

        })
        .catch(error => {
            console.error(error)
        })
    }

    async verficarDisponibilidadProfesorAnoEscolarSiguiente(a){
        let idProfesor=a.target.getAttribute("data-id-profesor")
        await axiosCustom.get(`transaccion/asignacion-aula-profesor/consultar-disponibilidad-profesor/${this.state.hashAnoEscolaresSiguiente.id_ano_escolar}/${idProfesor}`)
        .then(async respuesta =>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
            // console.log(json)
            if(json.datos.disponibilidadProfesor===true){
                this.setState({
                    id_ano_escolar:this.state.hashAnoEscolaresSiguiente.id_ano_escolar,
                    ano_desde:this.state.hashAnoEscolaresSiguiente.ano_desde,
                    ano_hasta:this.state.hashAnoEscolaresSiguiente.ano_hasta
                })
                $("#modalAginacionProferosSiguiente").modal("hide")
                this.setState({disponibilidadProfesor:true})
            }
            else{
                document.getElementById("parrafoMensaje").textContent="El profesor ya tiene asignaciones tanto para el año actual como para el siguiente"
                $("#modalMensaje").modal("show")
                await this.consultarAnoEscolarActivo()
                this.setState({disponibilidadProfesor:false})
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
            if(cedulaProfesor.value.length>=7){
                if(this.state.hashListaProfesores[cedulaProfesor.value]){
                    estado=true
                    msj_id_cedula.mensaje=``
                    msj_id_cedula.color_texto="verde"
                }
                else{
                    msj_id_cedula.mensaje=`El profesor no ha sido encontrado, por favor verifique que la cedula este bien escrita`
                    msj_id_cedula.color_texto="rojo"
                }
            }
            else{
                msj_id_cedula.mensaje=`Este campo no cumple con los caracteres minimos para realizar la busqueda del profesor ${cedulaProfesor.value.length}/8`
                msj_id_cedula.color_texto="rojo"
            }
        }
        else{
            msj_id_cedula.mensaje="Este campo no puede estar vacio"
            msj_id_cedula.color_texto="rojo"
        }
        this.setState({msj_id_cedula})
        return estado

    }

    async verificarDisponibilidadAula(a){
        this.cambiarEstado(a)
        let input =a.target
        if(this.state.id_ano_escolar == "") return false;

        if(this.props.match.params.operacion==="actualizar"){
            if(this.state.respaldoDatos.id_aula!==parseInt(input.value)){
                this.setState({cambioAula:true})
            }
            else{
                this.setState({cambioAula:false})

            }
            await axiosCustom.get(`transaccion/asignacion-aula-profesor/consultar-disponibilidad-aula/${this.state.id_ano_escolar}/${input.value}`)
                .then(async respuesta =>{
                  let json=JSON.parse(JSON.stringify(respuesta.data))
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
        }
        else{
            if(this.state.hashAnoEscolaresSiguiente.id_ano_escolar){
                alert("Cambio de Año Escolar")
                await this.consultarAnoEscolarSiguiente()
                if(this.state.hashAnoEscolaresSiguiente.id_ano_escolar){

                  if(window.confirm("Deseas cambiar al siguiente Año Escolar?") === true){
                    this.setState({ano_desde:this.state.hashAnoEscolaresSiguiente.ano_desde})
                    this.setState({ano_hasta:this.state.hashAnoEscolaresSiguiente.ano_hasta})
                    await this.consultarDisponivilidadAulaSiguienteAnoEscolar(input.value);

                    if(this.props.match.operacion === "registrar") document.getElementById("btn-registrar").disabled = "";
                    else document.getElementById("btn-actualizar").disabled = "";
                  }else{
                    if(this.props.match.operacion === "registrar") document.getElementById("btn-registrar").disabled = "disabled";
                    else document.getElementById("btn-actualizar").disabled = "disabled";
                    alert("No se puede continuar con la operación");
                  }
                }
                else{
                  document.getElementById("parrafoMensaje").textContent="no hay año siguiente disponible"
                  $("#modalMensaje").modal("show")
                  this.setState({disponibilidadAula:false})
                }
              }
              else{
                await axiosCustom.get(`transaccion/asignacion-aula-profesor/consultar-disponibilidad-aula/${this.state.hashAnoEscolaresActivo.id_ano_escolar}/${input.value}`)
                .then(async respuesta =>{
                  let json=JSON.parse(JSON.stringify(respuesta.data))
                  if(json.datos.disponibilidadAula===true){
                    this.setState({disponibilidadAula:true})
                    // this.setState({id_ano_escolar:this.state.hashAnoEscolaresActivo.id_ano_escolar})
                  }
                  else{
                      // this.setState({disponibilidadAula:false})
                    await this.consultarAnoEscolarSiguiente()
                    if(this.state.hashAnoEscolaresSiguiente.id_ano_escolar){
                      alert("Camio de Año Escolar")
                      this.setState({ano_desde:this.state.hashAnoEscolaresSiguiente.ano_desde})
                      this.setState({ano_hasta:this.state.hashAnoEscolaresSiguiente.ano_hasta})
                      this.setState({id_ano_escolar:this.state.hashAnoEscolaresSiguiente.id_ano_escolar})
                      await this.consultarDisponivilidadAulaSiguienteAnoEscolar(input.value);
                    }
                    else{
                      document.getElementById("parrafoMensaje").textContent="no hay año siguiente disponible"
                      $("#modalMensaje").modal("show")
                      this.setState({disponibilidadAula:false})
                    }
                  }
                })
                .catch(error => {
                    console.error(error)
                })
              }
        }

    }

    async verificarEcistenciaDeSeccionesEnGrados(){
        let resupuesta = []
        await axiosCustom.get(`configuracion/grado/verificar-existencia-secciones-grados`)
        .then(async respuesta =>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
            console.log("grados sin aulas => ",json)
            resupuesta=json.datos
        })
        .catch(error => {
            console.error(error)
        })
        return resupuesta
    }

    async consultarDisponivilidadAulaSiguienteAnoEscolar(idAula){
        await axiosCustom.get(`transaccion/asignacion-aula-profesor/consultar-disponibilidad-aula/${this.state.hashAnoEscolaresSiguiente.id_ano_escolar}/${idAula}`)
        .then(async respuesta =>{
            let json=JSON.parse(JSON.stringify(respuesta.data))
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
    }

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
            // alert("no")
            estadoValidacionAula=true
        }
        if(this.state.respaldoDatos.id_profesor!==idProfesor){
            // alert("no")
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
        $(".columna-modulo").animate({
            scrollTop: 0
          }, 1000)
        const token=localStorage.getItem('usuario')

            if(operacion==="registrar"){
                if(this.state.disponibilidadAula===true &&
                    this.state.disponibilidadProfesor===true &&
                    this.validarCampoCedulaProfesor()===true &&
                    document.getElementById("id_especialista").value!=="null" &&
                    document.getElementById("id_aula_espacio").value!=="null"
                    ){
                    // alert("Registrar")
                    let datosFormulario=new FormData(document.getElementById("formularioAsigAulaProf"))
                    let datosFormatiados=this.extrarDatosDelFormData(datosFormulario)
                    let datosAsignacion={
                        asignacionAulaProfesor:datosFormatiados,
                        especialistas:this.state.listaIdEspecialistaHaEnviar,
                        token
                    }
                    console.log(datosAsignacion)
                    await axiosCustom.post("transaccion/asignacion-aula-profesor/registrar",datosAsignacion)
                    .then(async respuesta => {
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
                        if(this.state.hashAnoEscolaresSiguiente.id_ano_escolar){
                            await this.cosultarAulasEspaciosDisponibles(this.state.hashAnoEscolaresSiguiente.id_ano_escolar)
                        }
                        else{
                            await this.cosultarAulasEspaciosDisponibles(this.state.hashAnoEscolaresActivo.id_ano_escolar)
                        }
                        this.setState({alerta})
                        this.setState({
                          id_cedula:"",
                        })
                    })
                    .catch(error => {
                        console.error(`Error de la peticion axios =>>> ${error}`)
                    })
                }
                else{
                    alert("Error al validar el formulario")
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
                    if(this.state.disponibilidadAula===true && this.state.disponibilidadProfesor===true && document.getElementById("id_especialista").value!=="null"){
                        estadoOperacion=true
                    }
                }
                else{
                    estadoOperacion=true
                }
                if(estadoOperacion){
                    let datosFormulario=new FormData(document.getElementById("formularioAsigAulaProf"))
                    let datosFormatiados=this.extrarDatosDelFormData(datosFormulario)
                    datosFormatiados.id_ano_escolar = this.state.id_ano_escolar
                    let datosAsignacion={
                        asignacionAulaProfesor:datosFormatiados,
                        especialistas:this.state.listaIdEspecialistaHaEnviar,
                        token
                    }
                    console.log("datos ha actualizar => ",datosAsignacion.asignacionAulaProfesor.id_aula_espacio)
                    if(datosAsignacion.asignacionAulaProfesor.id_aula_espacio==="null"){
                        datosAsignacion.asignacionAulaProfesor.id_aula_espacio=this.state.respaldoDatos.id_aula_espacio
                    }
                    await axiosCustom.put(`transaccion/asignacion-aula-profesor/actualizar/${this.props.match.params.id}`,datosAsignacion)
                    .then(async respuesta => {
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
                        await this.cosultarAulasEspaciosDisponibles(this.state.id_ano_escolar)
                        this.setState({alerta})
                        this.setState({
                          id_cedula:"",
                        })
                    })
                    .catch(error => {
                        console.error(`Error de la peticion axios =>>> ${error}`)
                    })
                }
                else{
                    alert("Error al validar el formulario")
                }
            }


    }

    cerrarModal(a){
        let idModal=a.target.getAttribute("data-id-modal")
        $(`#${idModal}`).modal("hide")
    }

    guardarEspecialista(a){
        a.preventDefault()
        let selectEspecialista=document.getElementById("id_especialista")
        if(selectEspecialista.value!=="null"){
            let listaIdEspecialistaHaEnviar =[...this.state.listaIdEspecialistaHaEnviar]
            listaIdEspecialistaHaEnviar.push(parseInt(selectEspecialista.value))
            let borrarDuplicados=new Set(listaIdEspecialistaHaEnviar)
            console.log(borrarDuplicados)
            borrarDuplicados=Array.from(borrarDuplicados)
            console.log("lista sin duplicados => ",borrarDuplicados)
            this.setState({listaIdEspecialistaHaEnviar:borrarDuplicados})
            let especialistaHaMostrar=borrarDuplicados.map(idEspecialista => {
                return this.state.listaDeEspecialistas.find(especialista => parseInt(idEspecialista)===especialista.id_especialista)
            })
            console.log("datos => ",especialistaHaMostrar)
            this.setState({especialistaHaMostrarInterfaz:especialistaHaMostrar})
        }
    }

    eliminarEspecialistas(a){
        a.preventDefault()
        let boton=a.target
        let id=boton.getAttribute("data-id-especialista")
        let listaIdEspecialistaHaEnviar =[...this.state.listaIdEspecialistaHaEnviar]
        listaIdEspecialistaHaEnviar=listaIdEspecialistaHaEnviar.filter(idEspecialista => parseInt(id)!==idEspecialista)
        console.log("actualizando datos => ",listaIdEspecialistaHaEnviar)
        this.setState({listaIdEspecialistaHaEnviar})
        let especialistaHaMostrar=listaIdEspecialistaHaEnviar.map(idEspecialista => {
            return this.state.listaDeEspecialistas.find(especialista => parseInt(idEspecialista)===especialista.id_especialista)
        })
        console.log("datos => ",especialistaHaMostrar)
        this.setState({especialistaHaMostrarInterfaz:especialistaHaMostrar})
    }

    render(){
        const jsx=(
            <div className="row justify-content-center">
                {this.state.alerta.estado===true &&
                    (<div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">

                        <AlertBootstrap colorAlert={this.state.alerta.color} mensaje={this.state.alerta.mensaje}/>

                    </div>)
                }

                    <div class="modal fade" id="modalAginacionProferosSiguiente" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg" role="document">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Reporte PDF</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                              <p>El profesor consultado ya tiene una planificación para el año escolar {this.state.hashAnoEscolaresActivo.ano_desde} - {this.state.hashAnoEscolaresActivo.ano_hasta}, pero esta disponble para el siguiente año escolar {this.state.hashAnoEscolaresSiguiente.ano_desde} - {this.state.hashAnoEscolaresSiguiente.ano_hasta} desea asignarlo para el siguiente año escolar</p>
                            </div>
                            <div class="modal-footer ">
                                <button type="button" id="asginarProfesor" class="btn btn-success " data-id-profesor="" onClick={this.verficarDisponibilidadProfesorAnoEscolarSiguiente}>Asignar</button>
                                <button type="button" id="cancelarAsignacion" class="btn btn-danger " data-id-modal="modalAginacionProferosSiguiente" onClick={this.cerrarModal}>Cancelar</button>
                            </div>
                            </div>
                        </div>
                    </div>

                    <div class="modal fade" id="modalMensaje" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg" role="document">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Reporte pdf</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                              <p id="parrafoMensaje"></p>
                            </div>
                            <div class="modal-footer ">
                                <button type="button" id="cancelarAsignacion" class="btn btn-danger " data-id-modal="modalMensaje" onClick={this.cerrarModal}>Cerrar</button>
                            </div>
                            </div>
                        </div>
                    </div>
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_formulario_asig_aula_prof">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-asig-aula-prof">
                            <span className="titulo-form-reposo">Formulario Asignación Aula Profesor</span>
                        </div>
                    </div>
                    <form id="formularioAsigAulaProf" >
                        <div className="row justify-content-center text-center">
                          <input name="id_asignacion_aula_profesor" value={this.state.id_asignacion_aula_profesor} type="hidden"/>

                            <div className='col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 h3' >
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
                            nombreCampo="Cédula:"
                            activo="si"
                            type="text"
                            value={this.state.id_cedula}
                            name="id_cedula"
                            id="id_cedula"
                            placeholder="Cédula"
                            mensaje={this.state.msj_id_cedula}
                            eventoPadre={this.buscarProfesor}
                            />
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <label>Nombre Completo:</label>
                                <div id="nombreProfesor" className="font-weight-bold">Sin nombre</div>
                            </div>
                            <input type="hidden" id="id_profesor" name="id_profesor" value={this.state.id_profesor}/>
                            <input type="hidden" id="id_ano_escolar" name="id_ano_escolar" value={this.state.id_ano_escolar}/>
                            {this.state.cambioProfesor===true &&
                                <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3" id="contenedorDisponibilidadProfesor">
                                    <label>Disponibilidad del Profesor:</label>
                                    {this.state.disponibilidadProfesor===true &&
                                        <div className="text-success" >Disponible </div>
                                    }
                                    {this.state.disponibilidadProfesor===false &&
                                        <div className="text-danger" >No Disponible</div>
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
                                    <option value='null' >Seleccione</option>
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
                                        <option value='null' >Seleccione</option>
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
                                            <div className="text-success">Aula Disponible</div>
                                    }
                                    {this.state.disponibilidadAula===false &&
                                            <div className='text-danger'>Aula no Disponible</div>
                                    }
                                </div>
                            }
                            {this.state.cambioAula===false &&
                                <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
                            }
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div class="form-groud">
                                    <label>Número total de estudiantes</label>
                                    <select id="numero_total_de_estudiantes" name="numero_total_de_estudiantes" class="form-select custom-select" aria-label="Default select example" onChange={this.cambiarEstado}>

                                        {this.state.listaDenNumeroEstudiante.map((numeroEstudiante,index)=> {
                                            return(
                                                <option key={index} value={numeroEstudiante} >{numeroEstudiante}</option>
                                            )
                                            })

                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div class="form-groud">
                                    <label>Aulas</label>
                                    <select id="id_aula_espacio" name="id_aula_espacio" class="form-select custom-select" aria-label="Default select example" onChange={this.cambiarEstado}>
                                    <option value='null' >Seleccione</option>
                                            {this.state.aulasDisponiblesSelect.map((aulasEspacio,index)=> {
                                            return(
                                                <option key={index} value={aulasEspacio.id_aula_espacio} > {aulasEspacio.numero_aula_espacio} </option>
                                            )
                                            })

                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-asig-aula-prof">
                                <span className="sub-titulo-form-reposo-trabajador">Datos Adicionales</span>
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
                        <div className="row justify-content-center mb-3">
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div class="form-groud">
                                    <label>Especialista</label>
                                    <select id="id_especialista" name="id_especialista" class="form-select custom-select" aria-label="Default select example" onChange={this.cambiarEstado}>
                                    <option value='null' >Seleccione</option>
                                            {this.state.listaDeEspecialistas.map((especialista,index)=> {
                                            return(
                                                <option key={index} value={especialista.id_especialista} >{especialista.nombres} {especialista.apellidos} - {especialista.especialidad}</option>
                                            )
                                            })

                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 padding-top-30">
                                <button className='btn btn-success' onClick={this.guardarEspecialista}>Guardar</button>
                            </div>
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
                        </div>


                    </form>
                    <div className="row justify-content-center mb-3">
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">Lista de Especialistas Guardados</div>
                            <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6"></div>
                        </div>
                        {this.state.especialistaHaMostrarInterfaz.map(especialista =>{
                                return (
                                    <div className="row justify-content-center mb-3" key={especialista.id_especialista}>
                                        <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                            <button data-id-especialista={especialista.id_especialista} className='btn btn-danger margin-right-10' onClick={this.eliminarEspecialistas}>
                                                <svg data-id-especialista={especialista.id_especialista} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                                                    <path data-id-especialista={especialista.id_especialista} d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
                                                </svg>
                                            </button>
                                                {especialista.nombres} {especialista.apellidos}</div>
                                        <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6"></div>
                                    </div>
                                )
                            })

                        }
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
