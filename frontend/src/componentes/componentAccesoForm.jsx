import React from 'react';
import {withRouter} from 'react-router-dom'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentAccesoForm.css'
// IP servidor
import servidor from '../ipServer.js'
//JS
import axios from 'axios'
//componentes
import ComponentDashboard from './componentDashboard'
//sub componentes
import InputButton from '../subComponentes/input_button'
import ButtonIcon from '../subComponentes/buttonIcon'
import ComponentFormCampo from '../subComponentes/componentFormCampo';
import ComponentFormRadioState from '../subComponentes/componentFormRadioState';
import ComponentFormSelect from '../subComponentes/componentFormSelect';

class ComponentAccesoForm extends React.Component {

    constructor(){
        super();
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.filaModulo=this.filaModulo.bind(this);
        this.cambiarEstadoModuloPrincipal=this.cambiarEstadoModuloPrincipal.bind(this);
        this.cambiarEstadoSubModulo=this.cambiarEstadoSubModulo.bind(this);
        this.cambiarEstadoRadioModulo=this.cambiarEstadoRadioModulo.bind(this);
        this.regresar=this.regresar.bind(this);
        this.operacion=this.operacion.bind(this);
        this.agregar=this.agregar.bind(this);
        this.state={
            modulo:"",// modulo menu
            estado_menu:false,
            //formulario
            id_perfil:"",
            nombre_perfil:"",
            estatu_perfil:"1",
            top_modulos:0,
            //
            msj_nombre_perfil:{
                mensaje:"",
                color_texto:""
            },
            //
            mensaje:{
                texto:"",
                estado:""
              },
            //
            modulos:[],
            lista_modulos:[],/// la listas de los al cual el perfil va a tener acceso 
            // modulos del sistema
            modulos_principales:[
                {descripcion:"configuracion",id:"/dashboard/configuracion"}, 
                // {descripcion:"reporte",id:"/dashboard/reporte"},
                {descripcion:"transaccion",id:"/dashboard/transaccion"},
                {descripcion:"seguridad",id:"/dashboard/seguridad"}
            ],
            sub_modulos:{
                configuracion:[
                    {descripcion:"acceso",id:"/acceso"},
                    {descripcion:"trabajador",id:"/trabajador"}, 
                    {descripcion:"medico",id:"/medico"}, 
                    {descripcion:"cam",id:"/cam"}, 
                    {descripcion:"tipo cam",id:"/tipo-cam"}, 
                    {descripcion:"permiso",id:"/permiso"}, 
                    {descripcion:"reposo",id:"/reposo"}, 
                    {descripcion:"tipo trabajador",id:"/tipo-trabajador"}, 
                    {descripcion:"funcion trabajador",id:"/funcion-trabajador"}, 
                    {descripcion:"estado",id:"/estado"}, 
                    {descripcion:"ciudad",id:"/ciudad"}, 
                    {descripcion:"especialidad",id:"/especialidad"}, 
                    {descripcion:"asignacion especialidad medico",id:"/asignacion-especialidad-medico"}, 
                    {descripcion:"horario",id:"/horario"}, 
                    {descripcion:"cintillo home",id:"/cintillo-home"}, 
                    {descripcion:"grado",id:"/grado"}, 
                    {descripcion:"estudiante",id:"/estudiante"},
                    {descripcion:"representante",id:"/representante"},
                    {descripcion:"aula",id:"/aula"},
                    {descripcion:"profesor",id:"/profesor"},
                    {descripcion:"vacuna",id:"/vacuna"},
                    {descripcion:"enfermedad",id:"/enfermedad"},
                    {descripcion:"año escolar",id:"/ano-escolar"},
                    {descripcion:"Fecha Inscripción",id:"/fecha-inscripcion"},
                    {descripcion:"Inscripción",id:"/inscripcion"},
                    {descripcion:"Parroquia",id:"/parroquia"}
                ],
                // reporte:[
                //     {descripcion:"reporte trabajador",id:"/reporte-trabajador"}
                // ],
                transaccion:[
                    {descripcion:"reposo trabajador",id:"/reposo-trabajador"},
                    {descripcion:"permiso trabajador",id:"/permiso-trabajador"},
                    {descripcion:"asistencia",id:"/asistencia"},
                    {descripcion:"lista asistencia",id:"/asistencia/lista"},
                    {descripcion:"asignacion aula profesor",id:"/asignacion-aula-profesor"},
                    {descripcion:"asignacion estudiante representante",id:"/asignacion-representante-estudiante"},
                    {descripcion:"planificación",id:"/planificaion"}
                ],
                seguridad:[
                    {descripcion:"Bitacora",id:"/bitacora"},
                ]
            }
        }
    }
    
    async UNSAFE_componentWillMount(){
        //console.log(this.props.match);
        //documentar
        let acessoModulo=await this.validarAccesoDelModulo("/dashboard/configuracion","/acceso")
        if(acessoModulo){
            const operacion=this.props.match.params.operacion;
        if(operacion==="registrar"){
            const id_perfil=await this.generarIdPerfil()
            const objeto_modulo=[
                [
                    [{id:0,modulo:this.state.modulos_principales}],
                    [{id:0,modulo:this.state.sub_modulos["configuracion"]}],
                    {   
                        id:0,
                        modulo_principal:"/dashboard/configuracion",
                        sub_modulo:"/acceso",
                        estatu_modulo:"1",
                        valido:true}
                ]
            ];
            const objeto_lista_modulos=[
                {
                    modulo_principal:"/dashboard/configuracion",
                    sub_modulo:"/acceso",
                    estatu_modulo:"1",
                    valido:true
                }
            ];
            this.setState({id_perfil:id_perfil.id,modulos:objeto_modulo,top_modulos:1,lista_modulos:objeto_lista_modulos})
        }
        else if(operacion==="actualizar"){
            const id=this.props.match.params.id,
            respuesta=await this.consultar_perfil(id)
            var veces=0,
            objeto_modulo="",
            modulos=[]
            if(respuesta.modulos){
                while(veces<respuesta.modulos.length){
                    const numero_modulos=veces,
                    modulo=respuesta.modulos[veces]
                    objeto_modulo=[
                            [{id:numero_modulos,modulo:this.state.modulos_principales}],
                            [{id:numero_modulos,modulo:this.state.sub_modulos}]
                    ]
                    const objeto_selected_modulo=this.generarSelectModulo(numero_modulos,objeto_modulo,modulo)
                    respuesta.modulos[veces].valido=true
                    //lo que hago aqui es sobrescribir el valor que le da por defecto la funcion subModulo es uno y lo cambio al valor real
                    //esto es mas que todo se vea el valor real en la interfaz no es muy practico pero es mejor que repetir codigo
                    objeto_selected_modulo[2].estatu_modulo=respuesta.modulos[veces].estatu_modulo//<---
                    modulos.push(objeto_selected_modulo)
                    veces+=1
                }
                this.setState({
                    id_perfil:respuesta.perfil.id_perfil,
                    nombre_perfil:respuesta.perfil.nombre_perfil,
                    estatu_perfil:respuesta.perfil.estatu_perfil,
                    modulos:modulos,
                    top_modulos:respuesta.modulos.length,
                    lista_modulos:respuesta.modulos
                })
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

    async generarIdPerfil(){
        var respuesta_servidor="",
        mensaje={texto:"",estado:""}
        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/acceso/generar-id-perfil`)
        .then(respuesta=>{
             respuesta_servidor=respuesta.data
            //console.log(respuesta_servidor)
        })
        .catch(error=>{
            mensaje.texto="no hay conxion con el servido"
            mensaje.estado=500
            this.props.history.push(`/dashboard/configuracion/acceso${JSON.stringify(mensaje)}`)
        })
        return respuesta_servidor
    }

    async consultar_perfil(id){
        var respuesta_servidor="",
        mensaje={texto:"",estado:""}
        await axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/acceso/consultar/${id}`)
        .then(respuesta=>{
            respuesta_servidor= respuesta.data
            if(respuesta_servidor.estado_peticion==="200"){
                console.log(respuesta.data)
            }
            else if(respuesta_servidor.estado_peticion==="404"){
                mensaje.texto=respuesta_servidor.mensaje
                mensaje.estado=respuesta_servidor.estado_peticion
                this.props.history.push(`/dashboard/configuracion/acceso${JSON.stringify(mensaje)}`)
           }
           
        })
        .catch(error=>{
            mensaje.texto="no hay conxion con el servidor"
            mensaje.estado=500
            this.props.history.push(`/dashboard/configuracion/acceso${JSON.stringify(mensaje)}`)
        })
        return respuesta_servidor
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

    selecionarModulo(){
        //documentar
        const modulos_principales=this.state.modulos_principales,
        lista_modulos=this.state.lista_modulos,
        sub_modulos=this.state.sub_modulos,
        objeto_modulo={
            modulo_principal:"/dashboard/configuracion",
            sub_modulo:"/acceso",
            estatu_modulo:"1",
            valido:true
        };
        var veces=0,
        encontrado=0;
        while(veces<modulos_principales.length){
            const modulo_array=Object.entries(modulos_principales[veces]),
            atributo_sub_modulo=modulo_array[0][1],
            modulo_principal=modulo_array[1][1];//ruta 
            var veces_2=0;
            while(veces_2<sub_modulos[atributo_sub_modulo].length){
                const sub_modulo=sub_modulos[atributo_sub_modulo][veces_2]["id"];//ruta
                var veces_3=0;
                var numero_aciertos=0;
                while(veces_3<lista_modulos.length){
                    if(sub_modulo!==lista_modulos[veces_3].sub_modulo){
                        numero_aciertos+=1
                        if(numero_aciertos===lista_modulos.length){
                            if(encontrado===0){
                                objeto_modulo.modulo_principal=modulo_principal;
                                objeto_modulo.sub_modulo=sub_modulo;
                                encontrado+=1
                            }
                        }
                    }
                    else{
                        console.log("ERROR: no puedes ocupar este modulo por que ya a sido selecionado y no se permite un modulo repetido")
                    }
                    veces_3+=1;
                }
                veces_2+=1;
            }
            veces+=1;
        }
        
        if(objeto_modulo.sub_modulo!==""){
            return objeto_modulo
        }
        else{
            console.log("ERROR: no hay ningu sub modulo disponible por que ya todos an sido selecionados y no se permiten que un perfil tenga modulos repetidos")
        }
    }
    ////////////////////////////////////////
    cambiarEstado(a){
        var input=a.target;
        this.setState({[input.name]:input.value})
    }

    filaModulo(a){
        //documentar
        a.preventDefault();
        const modulo = this.selecionarModulo();
        const input=a.target
        if(input.id==="icon-plus"){
            const numero_modulos=this.state.modulos.length,
            objeto_modulo=[
                    [{id:numero_modulos,modulo:this.state.modulos_principales}],
                    [{id:numero_modulos,modulo:this.state.sub_modulos}]
            ],
            objeto_selected_modulo= this.generarSelectModulo(numero_modulos,objeto_modulo,modulo),
            modulos=this.state.modulos,
            lista_modulos=this.state.lista_modulos;
            modulos.push(objeto_selected_modulo);
            lista_modulos.push(modulo);
            console.log(modulos);
            this.setState({modulos:modulos,lista_modulos:lista_modulos});
        }
        else if(input.id==="icon-minus"){
            const modulos=this.state.modulos;
            const lista_modulos=this.state.lista_modulos;
            if(modulos.length>this.state.top_modulos){
                modulos.pop();
                lista_modulos.pop();
                this.setState({modulos:modulos,lista_modulos:lista_modulos});
            }
            else{
                if(modulos.length===1){
                    alert("al crear un perfil tiene que tener como minimo un lodulo de acceso")
                }
                else{
                    alert("nose puede elminar modulos ya registrados a este perfil, si no quiere que el perfil tenga acceso a ese modulo cambie el estado del modulo de activo a inactivo")
                } 
            }
        }
        else{
            alert("por favor no modifiques los botones")
        }
    }

    generarSelectModulo(numero_modulos,modulos,modulo){
        // documentar
        const modulos_sb =  this.selecionarSubModulo(numero_modulos,modulos,modulo);
        return modulos_sb
    }

    selecionarSubModulo(numero_modulos,modulos,modulo){
        var veces=0;
        const sub_modulos=modulos[1][0]["modulo"],
        atriburto_sub_modulo=this.obtenerAtributoModuloPrincipalXValor(this.state.modulos_principales,modulo.modulo_principal);
        while(veces<sub_modulos[atriburto_sub_modulo].length){
            if(modulo.sub_modulo===sub_modulos[atriburto_sub_modulo][veces]["id"]){
                modulos[1][0]["modulo"]=sub_modulos[atriburto_sub_modulo]
                modulos.push({
                    id:numero_modulos,
                    modulo_principal:modulo.modulo_principal,
                    sub_modulo:modulo.sub_modulo,
                    estatu_modulo:"1",
                    valido:true
                })
            }
            veces+=1;
        }
        return modulos
    }

    cambiarEstadoModuloPrincipal(a){
        // como lo indica el nombre de la funcion cambia el estado del modulo principal
        const select=a.target,
        modulos_principales=this.state.modulos_principales,
        respuesta=this.verificarSelect(select.value,modulos_principales);
        if(respuesta===1){
            const id_select_cortado=select.id.split("-"),
            numero_indice=parseInt(id_select_cortado[1]),
            lista_modulos=this.state.lista_modulos,
            modulos=this.state.modulos;
            if(select.value!==lista_modulos[numero_indice]["modulo_principal"]){
                const atributo_sub_modulo=this.obtenerAtributoModuloPrincipalXValor(modulos_principales,select.value);
                modulos[numero_indice][1][0]["modulo"]=this.state.sub_modulos[atributo_sub_modulo];
                const sub_modulo=modulos[numero_indice][1][0]["modulo"][0]["id"];
                lista_modulos[numero_indice]["modulo_principal"]=select.value;
                lista_modulos[numero_indice]["sub_modulo"]=sub_modulo;
                modulos[numero_indice][2]["modulo_principal"]=select.value;
                modulos[numero_indice][2]["sub_modulo"]=sub_modulo;
                const {encontrado,numero_veces_encontrado} = this.verificarSubModulosRepetidos(sub_modulo,lista_modulos,numero_indice);
                if(!encontrado){
                    console.log("NL-> 250:en hora buena");
                    lista_modulos[numero_indice]["valido"]=true;
                    modulos[numero_indice][2]["valido"]=true;
                    this.setState({modulos:modulos,lista_modulos:lista_modulos});
                    //console.log(modulos)
                }
                else{
                    if(numero_veces_encontrado>=1){
                        lista_modulos[numero_indice]["valido"]=false;
                        modulos[numero_indice][2]["valido"]=false;
                        this.setState({modulos:modulos,lista_modulos:lista_modulos});
                        //console.log(modulos)
                        
                    }
                }
            }
        }
        else{
            alert("error en validar modulo principal")
        }
    }

    obtenerAtributoModuloPrincipalXValor(modulos_principales,valor){
        // documentar
        var veces=0,
        atributo_sub_modulo="";
        while(veces<modulos_principales.length){
            const modulo_array=Object.entries(modulos_principales[veces])
            if(modulo_array[1][1]===valor){
                atributo_sub_modulo=modulo_array[0][1];
            }
            veces+=1;
        }
        return atributo_sub_modulo;
    }

    cambiarEstadoSubModulo(a){
        // como lo indica el nombre de la funcion cambia el estado del sub modulo
        const select_sub_modulo=a.target,
        select_sub_modulo_cortado=select_sub_modulo.id.split("-"),
        sub_modulo=select_sub_modulo.value,
        numero_indice=parseInt(select_sub_modulo_cortado[2]),
        lista_modulos=this.state.lista_modulos,
        modulos=this.state.modulos;
        if(sub_modulo!==lista_modulos[numero_indice]["sub_modulo"]){
            const modulo=this.state.lista_modulos[numero_indice],// el array lista_modulos guarda en la constante modulo un json con las propieddes del modulo como las ruta del modulo principal y sub modulo etc...
            valor_modulo_principal=modulo["modulo_principal"],
            modulos_principales=this.state.modulos_principales,
            atributo_sub_modulo=this.obtenerAtributoModuloPrincipalXValor(modulos_principales,valor_modulo_principal),
            sub_modulos=this.state.sub_modulos[atributo_sub_modulo],
            respuesta=this.verificarSelect(sub_modulo,sub_modulos);
            if(respuesta===1){
                //alert("entra")
                const {encontrado,numero_veces_encontrado}= this.verificarSubModulosRepetidos(sub_modulo,lista_modulos,numero_indice);
                if(!encontrado){
                    lista_modulos[numero_indice]["sub_modulo"]=sub_modulo;
                    lista_modulos[numero_indice]["valido"]=true;
                    modulos[numero_indice][2]["valido"]=true;
                    this.setState({modulos:modulos,lista_modulos:lista_modulos});
                    console.log("NL-> 206:en hora buena");
                }
                else{//
                    if(numero_veces_encontrado>=1){
                        lista_modulos[numero_indice]["sub_modulo"]=sub_modulo;
                        lista_modulos[numero_indice]["valido"]=false;
                        modulos[numero_indice][2]["valido"]=false;
                        modulos[numero_indice][2]["sub_modulo"]=sub_modulo;
                        this.setState({modulos:modulos,lista_modulos:lista_modulos});
                        console.log("NL-> 217: ERROR ->"+numero_veces_encontrado)
                        console.log(modulos)
                    }
                }
            }
            else{
                alert("error en validar sub modulo")
            }         
        }
        else{
            console.log("NL-> 212: no se hace nada");
        }      
    }

    verificarSelect(modulo,modulos){// su funciones que detecta si el usuario cambio el valor de los option que estan en los select 
        var respuesta=0,
        contador=0
        if(modulo!==""){
            while(contador<modulos.length){
                var {id} = modulos[contador];
                if(modulo===id){
                    respuesta+=1;
                }
                contador+=1
            }
            if(respuesta===1){
                console.log("NL-> 236: OK COMBO");
            }
            else{
                console.log("NL-> 239:Error no puedes modificar los valores del Combo");
            }
        }
        else{
            console.log("NL-> 243:Por favor seleciona un elemento del combo");
        }
        return respuesta;
    }

    verificarSubModulosRepetidos(sub_modulo,lista_modulos,numero_indice){// esta funcion lo que hace es indicarle al usuario que el sub modulo que acaba de escoje si es vaalido o no en otras palabra si ya fue selecio9na ya que no sepuede tener sub modulos repetidos
        var encontrado=false ,
        numero_veces_encontrado=0,
        veces=0;
        while(veces<lista_modulos.length){
            if(veces!==numero_indice){
                const modulo_recorido=lista_modulos[veces];
                if(sub_modulo===modulo_recorido["sub_modulo"]){
                    if(!encontrado){
                        encontrado=true;
                        numero_veces_encontrado+=1;
                    }
                    else{
                        numero_veces_encontrado+=1
                    }
                }
            }
            veces+=1;
        }
        return {encontrado,numero_veces_encontrado}
    }

    cambiarEstadoRadioModulo(a){
        const radio=a.target,
        id_radio_cortado=radio.id.split("-"),
        indice_modulo=id_radio_cortado[3],
        lista_modulos=this.state.lista_modulos;
        lista_modulos[indice_modulo].estatu_modulo=radio.value
        const modulos=this.state.modulos;
        modulos[indice_modulo][2].estatu_modulo=radio.value;
        console.log(modulos)
        console.log(lista_modulos)
        this.setState({modulos:modulos,lista_modulos:lista_modulos});
        
    }

    regresar(){
        this.props.history.push("/dashboard/configuracion/acceso");
    }
    // validaciones formulario
    validarNombrePerfil(){
        var estado=false;
        var msj_nombre_perfil=this.state.msj_nombre_perfil
        const nombre_perfil=this.state.nombre_perfil;
        if(nombre_perfil!==""){
            estado=true;
            msj_nombre_perfil.mensaje=""
            msj_nombre_perfil.color_texto=""
            this.setState({msj_nombre_perfil:msj_nombre_perfil})
            return estado;
        }
        else{
            msj_nombre_perfil.mensaje="este campo no puede estar vacio"
            msj_nombre_perfil.color_texto="rojo"
            this.setState({msj_nombre_perfil:msj_nombre_perfil})
            return estado;
        }
    }

    validar_modulos(){
        const lista_modulos=this.state.lista_modulos;
        var veces=0,
        estado=false,
        contador=0;
        while(veces<lista_modulos.length){
            if(!lista_modulos[veces].valido){
                //alert(lista_modulos[veces].valido)
                contador+=1;
            }
            veces+=1
        }
        if(contador===0){
            //alert("OK")
            estado=true;
            return estado
        }
        else{
            alert(`Error : el numero de modulos no validos en total son: ${contador}`)
            return estado
        }

    }

    validar(){
        const respuesta_validar_nombre =this.validarNombrePerfil(),
        respuesta_validar_modulos =this.validar_modulos();
        if(respuesta_validar_nombre && respuesta_validar_modulos){
            return true
        }
        else{
            return false
        }
    }

    async operacion(a){
        const mensaje =this.state.mensaje
        var respuesta_servidor=""
        const operacion=this.props.match.params.operacion
        if(operacion==="registrar"){
            const respuesta_validaciones=this.validar()
            if(respuesta_validaciones){
                const objeto={
                    perfil:{
                        id_perfil:this.state.id_perfil,
                        nombre_perfil:this.state.nombre_perfil,
                        estatu_perfil :this.state.estatu_perfil
                    },
                    modulos:this.state.lista_modulos
                }
                
                axios.post(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/acceso/registrar`,objeto)
                .then(respuesta=>{
                    respuesta_servidor=respuesta.data
                    mensaje.texto=respuesta_servidor.mensaje
                    mensaje.estado=respuesta_servidor.estado_peticion
                    this.setState({mensaje:mensaje})
                })
                .catch(error=>{
                    mensaje.texto="No se puedo conectar con el servidor"
                    mensaje.estado="500"
                    console.log(error)
                    this.setState({mensaje:mensaje})
                })
            }
            else{
                alert("Error al validar el formulario")
            }
        }
        else if(operacion==="actualizar"){
            const respuesta_validaciones=this.validar()
            if(respuesta_validaciones){
                // alert("validaciones OK")
                const objeto={
                    perfil:{
                        id_perfil:this.state.id_perfil,
                        nombre_perfil:this.state.nombre_perfil,
                        estatu_perfil :this.state.estatu_perfil
                    },
                    modulos:this.state.lista_modulos,
                    top_modulos:this.state.top_modulos
                }
                axios.put(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/acceso/actualizar/${this.state.id_perfil}`,objeto)
                .then(respuesta=>{
                    respuesta_servidor=respuesta.data
                    respuesta_servidor=respuesta.data
                    mensaje.texto=respuesta_servidor.mensaje
                    mensaje.estado=respuesta_servidor.estado_peticion
                    this.setState({mensaje:mensaje})
                })
                .catch(error=>{
                    mensaje.texto="No se puedo conectar con el servidor"
                    mensaje.estado="500"
                    console.log(error)
                    this.setState({mensaje:mensaje})
                })
            }
            else{
                alert("Error al validar el formulario")
            }
        }
        else{
            alert("por favor no cambir el valor del boton al formulario");
        }
    }

    async agregar(){
        const id_perfil=await this.generarIdPerfil()
        const objeto_modulo=[
            [
                [{id:0,modulo:this.state.modulos_principales}],
                [{id:0,modulo:this.state.sub_modulos["configuracion"]}],
                {   
                    id:0,
                    modulo_principal:"/dashboard/configuracion",
                    sub_modulo:"/acceso",
                    estatu_modulo:"1",
                    valido:true}
            ]
        ];
        const objeto_lista_modulos=[
            {
                modulo_principal:"/dashboard/configuracion",
                sub_modulo:"/acceso",
                estatu_modulo:"1",
                valido:true
            }
        ]
        this.setState({
            id_perfil:id_perfil.id,
            nombre_perfil:"",
            estatu_perfil:"1",
            modulos:objeto_modulo,
            top_modulos:1,
            lista_modulos:objeto_lista_modulos
        })
        this.props.history.push("/dashboard/configuracion/acceso/registrar")
    }

    render(){
        
        const jsx_acceso_form=(
            <div className="row justify-content-center">
                <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12">
                    {this.state.mensaje.texto!=="" && (this.state.mensaje.estado==="200" || this.state.mensaje.estado==="404" || this.state.mensaje.estado==="500") &&
                        <div className="row">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                <div className={`alert alert-${(this.state.mensaje.estado==="200")?"success":"danger"} alert-dismissible`}>
                                    <p>Mensaje: {this.state.mensaje.texto}</p>
                                    <p>Estado: {this.state.mensaje.estado}</p>
                                    <button className="close" data-dismiss="alert">
                                        <span>X</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
               <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor_formulario_acceso">
                    <div className="row justify-content-center">
                        <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 text-center contenedor-titulo-form-acceso">
                            <span className="titulo-form-acceso">Formulario de Acceso</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-auto">
                            <ButtonIcon 
                            clasesBoton="btn btn-outline-success"
                            icon="icon-plus"
                            id="icon-plus"
                            eventoPadre={this.agregar}
                            />
                        </div>
                    </div>
                    <form id="form_acceso">
                        <div className="row justify-content-center">
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            nombreCampo="Código Perfil:"
                            activo="no"
                            type="text"
                            value={this.state.id_perfil}
                            name="id_perfil"
                            id="id_perfil"
                            placeholder="Código Perfil"
                            />
                            <ComponentFormCampo
                            clasesColumna="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                            clasesCampo="form-control"
                            obligatorio="si"
                            mensaje={this.state.msj_nombre_perfil}
                            nombreCampo="Nombre Perfil:"
                            activo="si"
                            type="text"
                            value={this.state.nombre_perfil}
                            name="nombre_perfil"
                            id="nombre_perfil"
                            placeholder="Nombre Perfil"
                            eventoPadre={this.cambiarEstado}
                            />
                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
                        </div>
                        <div className="row justify-content-center">
                            <ComponentFormRadioState
                            clasesColumna="col-9 col-ms-9 col-md-9 col-lg-9 col-xl-9"
                            extra="custom-control-inline"
                            nombreCampoRadio="Estatus:"
                            name="estatu_perfil"
                            nombreLabelRadioA="Activo"
                            idRadioA="activoA"
                            checkedRadioA={this.state.estatu_perfil}
                            valueRadioA="1"
                            nombreLabelRadioB="Inactivo"
                            idRadioB="activoB"
                            valueRadioB="0"
                            eventoPadre={this.cambiarEstado}
                            checkedRadioB={this.state.estatu_perfil}
                            />
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-12 col-ms-12 col-md-12 col-lg-12 col-xl-12 contenedor-titulo-form-acceso">
                                <span className="sub-titulo-form-acceso">Módulos</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-auto">
                                <ButtonIcon 
                                clasesBoton="btn btn-primary"
                                icon="icon-plus"
                                id="icon-plus"
                                eventoPadre={this.filaModulo}
                                />
                            </div>
                            <div className="col-auto">
                                <ButtonIcon 
                                clasesBoton="btn btn-danger"
                                icon="icon-minus"
                                id="icon-minus"
                                eventoPadre={this.filaModulo}
                                />
                            </div>
                        </div>
                        <div className="contenedor-lista-modulos">
                            {this.state.modulos.map((lista)=>{
                                return(
                                    <div className="row justify-content-center">
                                        {lista[0].map((modulo_principal)=>{
                                            return(
                                                    <ComponentFormSelect
                                                    clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                                                    nombreCampoSelect="Módulo Principal"
                                                    clasesSelect="custom-select"
                                                    name={"modulo-"+modulo_principal.id}
                                                    id={"modulo-"+modulo_principal.id}
                                                    eventoPadre={this.cambiarEstadoModuloPrincipal}
                                                    defaultValue={lista[2].modulo_principal}
                                                    option={modulo_principal.modulo}
                                                    />
                                            )
                                            })
                                        }
                                        {lista[1].map((sub_modulo)=>{
                                            return(
                                                    <ComponentFormSelect
                                                    clasesColumna="col-3 col-ms-3 col-md-3 col-lg-3 col-xl-3"
                                                    nombreCampoSelect="Sub Módulo"
                                                    clasesSelect="custom-select"
                                                    name={"sub-modulo-"+sub_modulo.id}
                                                    id={"sub-modulo-"+sub_modulo.id}
                                                    eventoPadre={this.cambiarEstadoSubModulo}
                                                    defaultValue={lista[2].sub_modulo}
                                                    option={sub_modulo.modulo}
                                                    />
                                            )
                                            })
                                        }
                                        {
                                            (
                                                <div className="columna_estatu_modulo">
                                                    <ComponentFormRadioState
                                                    clasesColumna="col-auto"
                                                    extra="custom-control-inline"
                                                    nombreCampoRadio="Estatus:"
                                                    name={"radio-modulo-"+lista[2].id}
                                                    nombreLabelRadioA="Activo"
                                                    idRadioA={"activoA-radio-modulo-"+lista[2].id}
                                                    checkedRadioA={lista[2].estatu_modulo}
                                                    valueRadioA="1"
                                                    nombreLabelRadioB="Inactivo"
                                                    idRadioB={"activoB-radio-modulo-"+lista[2].id}
                                                    valueRadioB="0"
                                                    eventoPadre={this.cambiarEstadoRadioModulo}
                                                    checkedRadioB={lista[2].estatu_modulo}
                                                    />
                                                </div>
                                            )
                                        }
                                        {lista[2].valido===true &&
                                            (
                                                <div className="columna_estatu_modulo col-auto">
                                                    <span className="btn btn-success">OK</span>
                                                </div>
                                            )
                                        }
                                        {lista[2].valido===false &&
                                            (
                                                <div className="columna_estatu_modulo col-auto">
                                                    <span className="btn btn-danger">ERROR</span>
                                                </div>
                                            )
                                        }
                                        
                                    </div>
                                )
                            })}
                        </div>
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
                    </form>
               </div>
            </div>
        )

        return(
            <div className="component_acceso_form">
                <ComponentDashboard
                componente={jsx_acceso_form}
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />
            </div>
        )
    }
}
export default withRouter(ComponentAccesoForm);