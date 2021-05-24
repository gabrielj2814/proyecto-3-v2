import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentEditarPermisoTrabajadorForm.css'
//JS
import axios from 'axios'
import Moment from 'moment'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'
import ButtonIcon from '../subComponentes/buttonIcon'
//import ComponentFormRadioState from '../subComponentes/componentFormRadioState';
//import ComponentFormDate from '../subComponentes/componentFormDate'
//import ComponentFormSelect from '../subComponentes/componentFormSelect';

class ComponentEditarPermisoTrabajadorForm extends React.Component{

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.modificarDiasAviles=this.modificarDiasAviles.bind(this);
        this.actualizarPermiso=this.actualizarPermiso.bind(this);
        this.regresar=this.regresar.bind(this);
        this.calcularDiasNoAviles=this.calcularDiasNoAviles.bind(this);
        this.state={
            modulo:"",// modulo menu
            estado_menu:false,
            //trabajador
            id_cedula:"",
            nombres:"",
            apellidos:"",
            //permiso trabajador
            id_permiso_trabajador:"",
            fecha_desde_permiso_trabajador:"",
            fecha_hasta_permiso_trabajador:"",
            estatu_permiso_trabajador:"",
            permiso_trabajador_dias_aviles:"",
            //permiso
            id_permiso:"",
            nombre_permiso:"",
            dias_permiso:"",
            estatu_permiso:"",
            estatu_remunerado:"",
            estatu_dias_aviles:"",
            //
            estadoCalcular:true,
            diasNoAviles:0,
            mensaje:{
                texto:"",
                estado:""
            },
        }
    }

    async consultarAlServidor(ruta){
        var respuesta_servidor=""
        await axios.get(ruta)
        .then(respuesta=>{
            respuesta_servidor=respuesta.data
        })
        .catch(error=>{
            console.log(error)
        })
        return respuesta_servidor
    }

    async UNSAFE_componentWillMount(){
        let acessoModulo=await this.validarAccesoDelModulo("/dashboard/transaccion","/permiso-trabajador")
        if(acessoModulo){
            const id=this.props.match.params.id
            const token=localStorage.getItem('usuario')
            const ruta_permiso=`http://localhost:8080/transaccion/permiso-trabajador/consultar/${id}/${token}`
            const permiso_trabajador=await this.consultarAlServidor(ruta_permiso)
            this.setState({
                id_cedula:permiso_trabajador.permiso_trabajador.id_cedula,
                nombres:permiso_trabajador.permiso_trabajador.nombres,
                apellidos:permiso_trabajador.permiso_trabajador.apellidos,

                id_permiso:permiso_trabajador.permiso_trabajador.id_permiso,
                nombre_permiso:permiso_trabajador.permiso_trabajador.nombre_permiso,
                dias_permiso:permiso_trabajador.permiso_trabajador.dias_permiso,
                estatu_permiso:permiso_trabajador.permiso_trabajador.estatu_permiso,
                estatu_remunerado:permiso_trabajador.permiso_trabajador.estatu_remunerado,
                estatu_dias_aviles:permiso_trabajador.permiso_trabajador.estatu_dias_aviles,

                id_permiso_trabajador:permiso_trabajador.permiso_trabajador.id_permiso_trabajador,
                fecha_desde_permiso_trabajador:permiso_trabajador.permiso_trabajador.fecha_desde_permiso_trabajador,
                fecha_hasta_permiso_trabajador:permiso_trabajador.permiso_trabajador.fecha_hasta_permiso_trabajador,
                estatu_permiso_trabajador:(permiso_trabajador.permiso_trabajador.estatu_permiso_trabajador==="A")?"Aprovado":"",
                permiso_trabajador_dias_aviles:(permiso_trabajador.permiso_trabajador.permiso_trabajador_dias_aviles==="VC")?0:permiso_trabajador.permiso_trabajador.permiso_trabajador_dias_aviles,
                diasNoAviles:(permiso_trabajador.permiso_trabajador.permiso_trabajador_dias_aviles==="VC")?0:permiso_trabajador.permiso_trabajador.permiso_trabajador_dias_aviles,
            })
            console.log(this.state)
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
            await axios.get(`http://localhost:8080/login/verificar-sesion${token}`)
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
        await axios.get(`http://localhost:8080/configuracion/acceso/consultar/${idPerfil}`)
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

    // logica menu
    mostrarModulo(a){
        // esta funcion tiene la logica del menu no tocar si no quieres que el menu no te responda como es devido
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

    modificarDiasAviles(a){
        const boton=a.target
        //alert(boton.id)
        var dias=parseInt(this.state.permiso_trabajador_dias_aviles)
        const fecha_hasta=Moment(this.state.fecha_hasta_permiso_trabajador)
        if(boton.id==="icon-plus"){
            fecha_hasta.add(1,"days")
            dias+=1
            this.setState({
                permiso_trabajador_dias_aviles:dias,
                // fecha_hasta_permiso_trabajador:fecha_hasta.format("YYYY-MM-DD")
            })
        }
        else{
            if(dias!==0){
                fecha_hasta.subtract(1,"days")
                dias-=1
                this.setState({
                    permiso_trabajador_dias_aviles:dias,
                    // fecha_hasta_permiso_trabajador:fecha_hasta.format("YYYY-MM-DD")
                })
            }
        }
        this.setState({estadoCalcular:false})
    }

    calcularDiasNoAviles(){
        // let numeroDiasNoAviles=this.state.total_dias_no_aviles_reposo_trabajador
        for(let contador=0;contador<2;contador++){
            // this.setState({total_dias_no_aviles_reposo_trabajador:numeroDiasNoAviles})
            if(this.state.permiso_trabajador_dias_aviles!==""){
                if(this.state.fecha_desde_reposo_trabajador!==""){
                    let fecha=Moment(Moment(this.state.fecha_desde_permiso_trabajador).format("YYYY-MM-DD"),"YYYY-MM-DD")
                    let suma=parseInt(this.state.dias_permiso)
                    let diasNoAvilesUsuario=((parseInt(this.state.permiso_trabajador_dias_aviles)-this.state.diasNoAviles>0)?parseInt(this.state.permiso_trabajador_dias_aviles)-this.state.diasNoAviles:0)
                    console.clear()
                    let diasNoAviles=0
                    let diasNoAvilesAgregados=0
                    let cont=0
                    // let n=0
                    while(cont<suma || (fecha.format("dd")==="Su" || fecha.format("dd")==="Sa")){
                        if(fecha.format("dd")==="Su" || fecha.format("dd")==="Sa"){
                            fecha.add(1,"days");
                            diasNoAviles++
                        }
                        else{
                            if(diasNoAvilesUsuario>0){
                                diasNoAvilesUsuario--
                                // diasNoAviles++
                                diasNoAvilesAgregados++
                                fecha.add(1,"days");
                            }
                            else{
                                cont++
                                fecha.add(1,"days");
                            }
                        }
                        // n++
                    }
                    // console.log(n)
                    console.log(cont)
                    console.log(diasNoAviles)
                    console.log(diasNoAvilesAgregados)
                    console.log(diasNoAviles+diasNoAvilesAgregados)
                    let sumaDiasNoAviles=diasNoAviles+diasNoAvilesAgregados
                    this.setState({
                        permiso_trabajador_dias_aviles:sumaDiasNoAviles,
                        diasNoAviles
                    })
                    this.setState({
                        fecha_hasta_permiso_trabajador:fecha,
                        // total_dias_no_aviles_reposo_trabajador:diasNoAviles,
                    })
                    this.setState({estadoCalcular:true})
                }
            }
        }
    }

    async actualizarPermiso(){
        const token=localStorage.getItem('usuario')
        const objeto={
            permiso_trabajador:{
                id_permiso_trabajador:this.state.id_permiso_trabajador,
                permiso_trabajador_dias_aviles:(this.state.permiso_trabajador_dias_aviles==="VC" || this.state.permiso_trabajador_dias_aviles===0)?"VC":this.state.permiso_trabajador_dias_aviles,
                fecha_hasta_permiso_trabajador:Moment(this.state.fecha_hasta_permiso_trabajador).format("YYYY-MM-DD")
            },
            token
        }
        //axios
        if(this.state.estadoCalcular===true){
            var respuesta_servidor=""
            var mensaje=this.state.mensaje
            await axios.patch(`http://localhost:8080/transaccion/permiso-trabajador/actualizar-dias-aviles/${this.state.id_permiso_trabajador}`,objeto)
            .then(respuesta=>{
                respuesta_servidor=respuesta.data
                console.log(respuesta_servidor)
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                this.setState({
                    mensaje:mensaje
                })
            })
            .catch(error=>{
                console.log(error)
                mensaje.texto="no hay conexion al servidor"
                mensaje.estado="500"
                this.setState({
                    mensaje:mensaje
                })
            })
        }
        else{
            alert("Por favor calcular primero los días no Habiles")
        }
    }

    regresar(){
        this.props.history.push("/dashboard/transaccion/permiso-trabajador")
    }

    render(){
        var jsx_solicitud_permiso_editar=(
            <div className="row justify-content-center">
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                    {this.state.mensaje.texto!=="" && (this.state.mensaje.estado==="200" || this.state.mensaje.estado==="404" || this.state.mensaje.estado==="500") &&
                        <div className="row">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                <div className={`alert alert-${(this.state.mensaje.estado==="200")?"success":"danger"} alert-dismissible`}>
                                    <p>Mensaje: {this.state.mensaje.texto}</p>
                                    <button className="close" data-dismiss="alert">
                                        <span>X</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_formulario_solicitud_permiso_editar">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-solicitud-permiso">
                            <span className="titulo-form-solicitud-permiso">Editar Solicitud Permiso</span>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3">
                            <span>Código: {this.state.id_permiso_trabajador}</span>
                        </div>
                        <div className="col-6 col-ms-6 col-md-6 col-lg-6 col-xl-6">
                            <span>Estatus del Permiso Trabajador: {this.state.estatu_permiso_trabajador}</span>
                        </div>
                    </div>
                    <div className="row justify-content-center mt-2">
                        {this.state.estatu_dias_aviles==="1" &&
                        (
                                <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3">
                                    <span>Días no Habiles: {this.state.permiso_trabajador_dias_aviles}</span>
                                </div>
                        )
                        }
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3 ">
                            <span className="">Desdé: {Moment(this.state.fecha_desde_permiso_trabajador).format("DD-MM-YYYY")}</span>
                        </div>
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3">
                            <span className="">Hasta: {Moment(this.state.fecha_hasta_permiso_trabajador).format("DD-MM-YYYY")}</span>
                        </div>
                        {this.state.estatu_dias_aviles==="0" &&
                        (
                                <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"></div>
                                   
                        )
                        }
                    </div>
                    {this.state.estatu_dias_aviles==="1" &&
                        (
                            <div className="row justify-content-center mt-2">
                                <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3">
                                    <div className="row">
                                        <div className="col-auto">
                                            <ButtonIcon 
                                            clasesBoton="btn btn-primary"
                                            icon="icon-plus"
                                            id="icon-plus"
                                            eventoPadre={this.modificarDiasAviles}
                                            />
                                        </div>
                                        <div className="col-auto">
                                            <ButtonIcon 
                                            clasesBoton="btn btn-danger"
                                            icon="icon-minus"
                                            id="icon-minus"
                                            eventoPadre={this.modificarDiasAviles}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3 offset-3"></div>
                            </div>
                        )
                    }
                    
                    <div className="row mt-3 justify-content-center">
                        <div className="col-2 col-ms-2 col-md-2 col-lg-2 col-xl-2 ">
                            <input className="btn btn-success btn-block" type="button" value="calcular" onClick={this.calcularDiasNoAviles}/>
                        </div>
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3 offset-4 offset-ms-4 offset-lg-4 offset-xl-4"></div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-solicitud-permiso-editar">
                            <span className="sub-titulo-form-solicitud-permiso">Permiso</span>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3">
                            <span className="">Nombre: {this.state.nombre_permiso}</span>
                        </div>
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3">
                            <span className="">Días: {this.state.dias_permiso}</span>
                        </div>
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3 ">
                            <span className="">Remunerado: {(this.state.estatu_remunerado==="1")?"Si":"No"}</span>
                        </div>
                    </div>
                    <div className="row justify-content-center row mt-2">
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3 ">
                            <span className="">Habiles: {(this.state.estatu_dias_aviles==="1")?"Si":"No"}</span>
                        </div>
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3">
                            <span className="">Estatus Permiso: {(this.state.estatu_permiso==="1")?"Activo":"Inactivo"}</span>
                        </div>
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"></div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-solicitud-permiso-editar">
                            <span className="sub-titulo-form-solicitud-permiso">Trabajador</span>
                        </div>
                    </div>
                    <div className="row justify-content-center row mt-2">
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3 ">
                            <span className="">Cédula: {this.state.id_cedula}</span>
                        </div>
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3">
                            <span className="">Nombre: {`${this.state.nombres} ${this.state.apellidos}`}</span>
                        </div>
                        <div className="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3 "></div>
                    </div>
                    <div className="row justify-content-center mt-5">
                        {(this.state.estatu_dias_aviles==="1") &&
                        (
                                <div className="col-auto">
                                        <InputButton 
                                        clasesBoton="btn btn-success"
                                        id="boton-actualizar"
                                        value="Actualizar Permiso"
                                        eventoPadre={this.actualizarPermiso}
                                        />
                                </div>  
                            
                        )
                        }
                        <div className="col-auto">
                            <InputButton 
                            clasesBoton="btn btn-danger"
                            id="boton-actualizar"
                            value="Cancelar"
                            eventoPadre={this.regresar}
                            />
                    </div> 
                    </div>
                </div>
            </div>
        )

        return(
            <div className="component_solicitud_permiso_form">
                <ComponentDashboard
                componente={jsx_solicitud_permiso_editar}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />
            </div>
        )
    }
}

export default withRouter(ComponentEditarPermisoTrabajadorForm)