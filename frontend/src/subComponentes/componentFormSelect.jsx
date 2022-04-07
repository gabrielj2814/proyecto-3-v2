import React from 'react'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentFormSelect.css'

const componentFormSelect = (props) => {
    return(
        <div className={props.clasesColumna+" columna"}>
            <div className="form-groud">
                <label>
                {props.obligatorio && props.obligatorio==="si" &&
                    (
                        <span className="obligatorio-campo">(*)</span>
                    )
                }
                {props.nombreCampoSelect}</label>
                {props.option.length!==0 &&
                    <select defaultValue={props.defaultValue} className={props.clasesSelect} name={props.name} id={props.id} onBlur={props.eventoPadre}>
                    {props.option.map((option)=>{
                        return (<option key={props.name+"#"+option.id} id={option.id} value={option.id}>{option.descripcion}</option>)
                        }
                    )}
                    </select>
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

export default componentFormSelect
