import React from 'react'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentFormRadioState.css'

import ComponentFormRadio from './componentFormRadio'

const ComponentFormRadioState = (props) => {
  let desactivado = "";
  if(props.inactivo && props.inactivo == "si"){ desactivado = props.inactivo }
    return(
        <div className={props.clasesColumna+" columna"}>
                <label className="nombre-campo-label-state">{props.nombreCampoRadio}</label>
                <ComponentFormRadio
                clasesRadio="custom-control-input"
                inactivo={desactivado}
                extra={props.extra}
                name={props.name}
                id={props.idRadioA}
                value={props.valueRadioA}
                nombreLabe={props.nombreLabelRadioA}
                eventoPadre={props.eventoPadre}
                estado={props.checkedRadioA}
                />
                <ComponentFormRadio
                clasesRadio="custom-control-input"
                extra={props.extra}
                inactivo={desactivado}
                name={props.name}
                id={props.idRadioB}
                value={props.valueRadioB}
                nombreLabe={props.nombreLabelRadioB}
                eventoPadre={props.eventoPadre}
                estado={props.checkedRadioB}
                />
        </div>
    )

}

export default ComponentFormRadioState
