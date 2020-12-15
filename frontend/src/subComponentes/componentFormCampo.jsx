import React from 'react'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentFormCampo.css'

const ComponentFormCampo = (props) => {

    return(
        <div className={props.clasesColumna+" columna"}>
            <div className="form-groud">
                <label>
                {props.obligatorio && props.obligatorio==="si" && 
                    (
                        <span className="obligatorio-campo">(*)</span>
                    )
                }
                {props.nombreCampo}</label>
                {props.activo==="si" &&
                    (
                        <input className={props.clasesCampo} type={props.type} value={props.value} name={props.name} id={props.id} placeholder={props.placeholder} onChange={props.eventoPadre} required />
                    )
                }
                {props.activo==="no" &&
                    (
                        <input className={props.clasesCampo} type={props.type} value={props.value} name={props.name} id={props.id} placeholder={props.placeholder} />
                    )
                }
                {(props.mensaje && props.mensaje!=="") && 
                    (
                        <span className={`color-texto-${props.mensaje.color_texto}`}>{props.mensaje.mensaje}</span>
                    )
                }
            </div>
        </div>
    )

}

export default ComponentFormCampo