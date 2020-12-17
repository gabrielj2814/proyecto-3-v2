import React, { createElement } from 'react';
import {withRouter} from 'react-router-dom'
import axios from 'axios'
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentHorario.css'
//componentes
import ComponentDashboard from './componentDashboard'


class ComponentHorario extends React.Component{

    constructor(){
        super();
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.guardarHorario=this.guardarHorario.bind(this);
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.state={
            modulo:"",
            estado_menu:false,
            horaEntrada:"01",
            minutoEntrada:"00",
            horaSalida:"01",
            minutoSalida:"00",
            periodoEntrada:"PM",
            periodoSalida:"AM",
            //////
            listHora:[],
            listMinuto:[],
            mensaje:{
              texto:"",
              estado:""
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
        // alert("hola")
        let listHora=[];
        let listMinuto=[];
        let contandor=1;
        while(contandor<=12){
            listHora.push((contandor<=9)?"0"+contandor:contandor);
            contandor++
        }
        let contandor2=0;
        while(contandor2<=59){
            listMinuto.push((contandor2<=9)?"0"+contandor2:contandor2);
            contandor2++
        }
        this.setState({
            listHora,
            listMinuto
        });
        let respuesta=await this.consultarHorarioActivo();
        console.log("respuesta servidor ->>>",respuesta)
        if(respuesta.horario){
            this.insertatHorarioActual(respuesta.horario)
        }
        else{
            this.setState({
                horaEntrada:"01",
                minutoEntrada:"00",
                horaSalida:"01",
                minutoSalida:"00",
                periodoEntrada:"PM",
                periodoSalida:"AM",
            })
        }
        

    }

    insertatHorarioActual(horaio){
        let horaEntrada=horaio.horario_entrada[0]+horaio.horario_entrada[1];
        let minutoEntrada=horaio.horario_entrada[3]+horaio.horario_entrada[4];
        let periodoEntrada=horaio.horario_entrada[5]+horaio.horario_entrada[6];
        let horaSalida=horaio.horario_salida[0]+horaio.horario_salida[1];
        let minutoSalida=horaio.horario_salida[3]+horaio.horario_salida[4];
        let periodoSalida=horaio.horario_salida[5]+horaio.horario_salida[6];
        this.setState({
            horaEntrada,
            minutoEntrada,
            horaSalida,
            minutoSalida,
            periodoEntrada,
            periodoSalida,
        })
    }

   async consultarHorarioActivo(){
       let repuestaServidor=null;
        await axios.get("http://localhost:8080/configuracion/horario/consultar-activo")
        .then(respuesta => {
            repuestaServidor=respuesta.data;
        })
        .catch(error => {
            console.log(error);
        })
        return repuestaServidor
    }

    guardarHorario(){
        // alert("hola")
        let horaEntrada=`${this.state.horaEntrada}:${this.state.minutoEntrada}${this.state.periodoEntrada}`;
        let horaSalida=`${this.state.horaSalida}:${this.state.minutoSalida}${this.state.periodoSalida}`;
        alert(horaEntrada+" / "+horaSalida)
        let datos={
            "horario":{
                "horario_entrada":horaEntrada,
                "horario_salida":horaSalida
            }
        }
        axios.post("http://localhost:8080/configuracion/horario/agregar-horario",datos)
        .then(respuesta => {
            console.log(respuesta);
        })
        .catch(error => {
            console.log(error);
        })
    }

    cambiarEstado($inputSelect){
        let $input=$inputSelect.target;
        // alert($input.name)
        this.setState({[$input.name]:$input.value})
    }
    
    

    render(){
        const jsx=(

            <div className="contenedor_from">

                <h1 className="titulo_h1">Horario</h1>

                <form id="formularioHorario" className="formularioHorario">

                    <div className="PM">
                        <div> Hora de entrada</div>
                        <select onChange={this.cambiarEstado} id="horaEntrada" name="horaEntrada" className="hora tiempo" value={this.state.horaEntrada}>
                            {
                                this.state.listHora.map(hora => {
                                    return(<option key={hora} value={hora}>{hora}</option>)
                                })
                            }
                        </select>
                        <div className="dosPuntos">:</div>
                        <select onChange={this.cambiarEstado} id="minutoEntrada" name="minutoEntrada" className="minito tiempo" value={this.state.minutoEntrada}>

                        {
                            this.state.listMinuto.map(minuto => {
                                return (<option key={minuto} value={minuto}>{minuto}</option>)
                            })
                        }
                        
                        </select>
                        <select onChange={this.cambiarEstado} id="periodoEntrada"  name="periodoEntrada" className="periodo tiempo" value={this.state.periodoEntrada}>
                            <option value="PM">PM</option>
                            <option value="AM">AM</option>
                        </select>
                    </div>
                    <div className="AM">
                        <div> Hora de salida</div>
                        <select onChange={this.cambiarEstado} id="horaSalida" name="horaSalida" className="hora tiempo" value={this.state.horaSalida}>
                        {
                            this.state.listHora.map(hora => {
                                return(<option key={hora} value={hora}>{hora}</option>)
                            })
                        }
                        
                        </select>
                        <div className="dosPuntos">:</div>
                        <select onChange={this.cambiarEstado} id="minutoSalida" name="minutoSalida" className="minito tiempo" value={this.state.minutoSalida}>
                        {
                            this.state.listMinuto.map(minuto => {
                                return (<option key={minuto} value={minuto}>{minuto}</option>)
                            })
                        }
                        </select>
                        <select onChange={this.cambiarEstado} id="periodoSalida" name="periodoSalida" className="periodo tiempo" value={this.state.periodoSalida}>
                            <option value="PM">PM</option>
                            <option value="AM">AM</option>
                        </select>
                    </div>
                
                
                </form>

                <div className="contenedor_boton_guardar_horario">

                    <button className="btn btn-primary btn-block" onClick={this.guardarHorario}>Guardar</button>
                
                </div>
            
            
            
            </div>
        )


        return(
            <div className="contenedor_horario">
                    
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

export default withRouter(ComponentHorario);