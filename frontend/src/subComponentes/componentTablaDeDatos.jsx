import React from 'react';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentTablaDeDatos.css'

import BarraDeBusqueda from './barraDeBusqueda'
import Tabla from './componentTabla'

const componentTableDeDatos= (props) =>{ 

    return(
        <div className="row component-tabla-de-datos">
            <div className="col-12 col-ms-12 col-md-12 contenedor-tabla-de-datos">
                <BarraDeBusqueda 
                eventoBuscar={props.eventoBuscar}
                eventoEscribirCodigo={props.eventoEscribirCodigo}
                />
                <Tabla 
                tabla_encabezado={props.tabla_encabezado}
                tabla_body={props.tabla_body}
                numeros_registros={props.numeros_registros}
                />
            </div>     
        </div>
    )

}

export default componentTableDeDatos