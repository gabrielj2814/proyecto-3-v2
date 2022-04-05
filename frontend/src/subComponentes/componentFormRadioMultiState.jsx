import React from 'react'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentFormRadioState.css'

import ComponentFormRadio from './componentFormRadio'

const ComponentFormRadioMultiState = (props) => {
  let estates = Array.isArray(props.estates[0]) ? props.estates[0] : props.estates
  
    return(
        <div className={props.clasesColumna+" columna"}>
          <label className="nombre-campo-label-state">{props.nombreCampoRadio}</label>
          { estates.map( (item,index) => {
            let id = props.idRadio[index], nombre, valor = item;
            if(!props.nombreUnico) nombre = props.nombreLabelRadio[index]
            else{
              nombre = `${props.nombreUnico[0]}${item[props.nombreUnico[1]]}`;
              if(item[props.nombreUnico[2]]) nombre += `${item[props.nombreUnico[2]]}`
              if(item[props.nombreUnico[3]]) nombre += ` ${item[props.nombreUnico[3]]}`
              valor = item[props.name]
            }

            return (
              <ComponentFormRadio
                key={index}
                clasesRadio="custom-control-input"
                extra={props.extra}
                name={props.name}
                id={id}
                value={valor}
                nombreLabe={nombre}
                eventoPadre={props.eventoPadre}
                estado={props.checkedRadio}
              />
            )
          })}
        </div>
    )
}

export default ComponentFormRadioMultiState
