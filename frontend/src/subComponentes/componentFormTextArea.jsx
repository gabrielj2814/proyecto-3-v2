import React from 'react'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentFormTextArea.css'

const componentFormTextArea = (props) => {

    return(
        <div className={props.clasesColumna}>
            <div className="form-groud">
                <label>
                {props.obligatorio && props.obligatorio==="si" && 
                    (
                        <span className="obligatorio-campo">(*)</span>
                    )
                }
                {props.nombreCampoTextArea}</label>
                <textarea  
                value={props.value}
                className={props.clasesTextArear+" textArea"}
                name={props.name}
                id={props.id}
                onChange={props.eventoPadre}
                rows={5}
                />
                {(props.mensaje && props.mensaje!=="") && 
                    (
                        <span className={`color-texto-${props.mensaje.color_texto}`}>{props.mensaje.mensaje}</span>
                    )
                }
            </div>
        </div>
    )

}

//<span className={`color-text-${props..mensaje.color_texto}`}>{props.mensaje.mensaje}</span>

export default componentFormTextArea