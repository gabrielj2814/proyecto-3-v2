import React from 'react'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentFormDate.css'

const ComponentFormDate = (props) => {
  let desactivado = "";
  if(props.inactivo && props.inactivo == "si"){ desactivado = "disabled" }
    return(
        <div className={props.clasesColumna+" columna"}>
            <div className="form-groud">
                <label>
                {props.obligatorio && props.obligatorio==="si" &&
                    (
                        <span className="obligatorio-campo">(*)</span>
                    )
                }
                {props.nombreCampoDate}</label>
                {props.minio &&
                    (
                        <input className={props.clasesCampo} disabled={desactivado} type="date" value={props.value} name={props.name} id={props.id} onChange={props.eventoPadre} min={props.minio} max={ (props.maxim) ? props.maxim : null }  required />
                    )
                }
                {!props.minio &&
                    (
                        <input className={props.clasesCampo} disabled={desactivado} type="date" value={props.value} name={props.name} id={props.id} onChange={props.eventoPadre}  required />
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

export default ComponentFormDate
