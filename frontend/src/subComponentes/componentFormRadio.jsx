import React from 'react'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'

const ComponentFormRadio = (props) => {

    return(
        <div className={"custom-control custom-radio custom-inline "+props.extra}>
            <input
            type="radio"
            className={props.clasesRadio}
            name={props.name}
            id={props.id}
            value={props.value}
            checked={props.value==props.estado}
            onChange={props.eventoPadre}/>
            <label htmlFor={props.id} className="custom-control-label">{props.nombreLabe}</label>
        </div>
        )
}

export default ComponentFormRadio
