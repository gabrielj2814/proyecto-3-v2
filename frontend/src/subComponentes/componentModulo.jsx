import React from 'react'

import '../css/componentModulo.css'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
//<div className="col-11 col-sm-11 col-md-11 col-lg-11 col-xl-11 columna-modulo">

const ComponentModulo = (props) => {
    return(
       <>
       {props.estado_menu===true&&

            (
                <div className="col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9 columna-modulo">
                    <div className="row justify-content-center">
                        <div className="contenedor-modulo col-md-11">
                            {props.componente}
                        </div>                      
                    </div>
                </div>
            )
       }
       {props.estado_menu===false&&

        (
            <div className="col-11 col-sm-11 col-md-11 col-lg-11 col-xl-11 columna-modulo">
                <div className="row justify-content-center">
                    <div className="contenedor-modulo col-md-11">
                        {props.componente}
                    </div>                      
                </div>
            </div>
        )
   }
       </>
    )
}

export default ComponentModulo