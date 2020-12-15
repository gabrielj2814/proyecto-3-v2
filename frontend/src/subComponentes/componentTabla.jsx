import React from 'react'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentTabla.css'

const ComponentTabla= (props) => {

    return(
        <div className="componentTabla">
            <div className="contenedor_tabla">
                <table className="tabla table table-dark table-striped table-bordered table-hover table-responsive-xl">
                    {props.tabla_encabezado}
                    {props.tabla_body}
                </table>
            </div>
            <span>Numero de registros: {props.numeros_registros}</span>
            <br></br>
        </div>
    )

}

export default ComponentTabla
