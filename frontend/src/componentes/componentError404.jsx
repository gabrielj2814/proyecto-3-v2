import React from "react"
import {withRouter} from 'react-router-dom'
// css
import "../css/componentError404.css"
import 'bootstrap/dist/css/bootstrap.css'
// imagen
import Error404 from "../galeria/imagenes/errores/page-not-found.gif"

class ComponentError404 extends React.Component {

    constructor(){
        super()
        this.regresar=this.regresar.bind(this)
        this.state={

        }
    }

    regresar(){
        this.props.history.goBack()
    }

    render(){
        return (
            <div className="contenedorError404">
                <img className="imagen404" src={Error404}  alt="error404"/>
                <div className="mensaje-error-404 mb-4">Error 404 pagina no encontrada</div>
                <div className="contendor-boton">
                    <button className="boton-regresar btn btn-primary" onClick={this.regresar}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-90deg-left" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M1.146 4.854a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H12.5A2.5 2.5 0 0 1 15 6.5v8a.5.5 0 0 1-1 0v-8A1.5 1.5 0 0 0 12.5 5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4z"/>
                        </svg>
                        Regresar
                    </button>
                </div>
            
            </div>

        )
    }

}

export default withRouter(ComponentError404)