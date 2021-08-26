import Axios from 'axios';
import React from 'react';
// IP servidor
import servidor from '../ipServer.js'
// js
import axios from "axios"
import moment from "moment"
//css
import  "../css/cintilloComponent.css"
// imagenes
import Cintillo from '../galeria/imagenes/encabezadoPrincipal.jpeg'

class CintilloComponent extends React.Component{

    constructor(){
        super()
        this.state={
            estadoCintillo:false,
            estatuCintilloActual:{}
        }
    }

    UNSAFE_componentWillMount(){
        this.consultarCintilloActual()
    }

    consultarCintilloActual(){
        axios.get(`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/configuracion/cintillo/consultar-activo`)
        .then(respuesta => {
            let json=JSON.parse(JSON.stringify(respuesta.data))
            if(json.estado){
                json.datos[0].fecha_subida_foto=json.datos[0].fecha_subida_foto.split("T")[0]
                this.setState({
                    estadoCintillo:true,
                    cintilloActual:json.datos[0]
                })
                document.getElementById("cintillo").src=`http://${servidor.ipServidor}:${servidor.servidorNode.puerto}/cintillo/cintillo-${json.datos[0].fecha_subida_foto}_${json.datos[0].hora_subida_foto}.${json.datos[0].extension_foto_cintillo}`
            }
            else{
                // alert("no")
                this.setState({estadoCintillo:false})
            }
        })
        .catch(error => {
            console.log("error al conectar con el servidor")
        })
    }

    render(){
        return(
            <div className="grid-cintillo">
                <img className="cintillo" src={Cintillo} alt="cintillo"/>
                {this.state.estadoCintillo &&
                    <div className="cintillo-dinamico">
                        <img id="cintillo" className="cintillo-principal" alt="cintillo principal"/>
                    </div>
                }
                {this.state.estadoCintillo===false &&
                    (
                        <div className="cintillo-dafault">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-image" viewBox="0 0 16 16">
                                    <path d="M8.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                    <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8l-2.083-2.083a.5.5 0 0 0-.76.063L8 11 5.835 9.7a.5.5 0 0 0-.611.076L3 12V2z"/>
                                </svg>
                                <span>sin cintillo</span>
                            </div>
                        </div>
                    )
                }

            </div>
        )
    }


}

export default CintilloComponent;
