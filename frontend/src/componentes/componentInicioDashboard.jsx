import React from 'react';
//css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentInicioDashboard.css'
//componentes
import ComponentDashboard from './componentDashboard'

class ComponentInicioDashboard extends React.Component{

    constructor(){
        super()
        this.mostrarModulo=this.mostrarModulo.bind(this);
        this.state={
            modulo:"",
            estado_menu:false
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

    render(){
        var jsx_inicio_dashboard=(
            <div className="bienvenidos">
                <div class="row justify-content-center">
                        <div className="row justify-content-center align-items-center content height-100x100">
                            <div className="col-auto content__containers">
                                <p className="text-center titulo-bienvenidos mb-3">Bienvenidos al Portal Web de La escuela Bolivariana “Villas del Pilar”</p>
                                <h5 className="text-center mb-3 titulo-bienvenida">“El pasado es historia, el futuro un misterio, pero hoy es un regalo, por eso se llama presente. Recibe este día con mucho amor ¡Bienvenido!”</h5>
                            </div>

                    </div>

                </div>
            </div>
        )
        return(
            <div className="component_inicio_dashboard">
                <ComponentDashboard 
                componente={jsx_inicio_dashboard} 
                modulo={this.state.modulo}
                eventoPadreMenu={this.mostrarModulo}
                estado_menu={this.state.estado_menu}
                />
            </div>
        )
    }

}

export default ComponentInicioDashboard;