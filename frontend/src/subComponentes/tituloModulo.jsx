import React from 'react'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'

import '../css/tituloModulo.css'

const TituloModulo= (props) => {

    return(
        <div className={props.clasesRow}>
            <div className={props.clasesColumna+" columna-titulo-form"}>{props.tituloModulo}</div>
        </div>
    )

}

export default TituloModulo
