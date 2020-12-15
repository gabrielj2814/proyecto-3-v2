import React from 'react';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/barraDeBusqueda.css'

import ButtonIcon from './buttonIcon'

const BarraDeBusqueda= (props) => {

    return(
        <div className="row component-barra-de-busqueda">
            <div className="col-12 col-ms-12 col-md-12 contenedor-barra-de-busqueda">
                <div className="row">
                    <div className="col-6 col-ms-6 col-md-6 columna-barra">
                        <input className="form-control barraDeBusqueda" type="text" id="buscador" name="buscador" onChange={props.eventoEscribirCodigo} placeholder="Buscar..."/>
                    </div>

                    <div className="col-auto columna-boton-buscar">
                        <ButtonIcon clasesBoton="btn btn-primary boton_buscar" id="boton_buscar" icon="icon-search" eventoPadre={props.eventoBuscar}/>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default BarraDeBusqueda