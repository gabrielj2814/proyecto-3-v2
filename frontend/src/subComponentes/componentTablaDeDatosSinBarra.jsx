import React from 'react';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import '../css/componentTablaDeDatos.css'

import Tabla from './componentTabla'
import ComponentFormRadioState from './componentFormRadioState';

const componentTableDeDatosSinBarra= (props) =>{ 

    return(
        <div className="row component-tabla-de-datos">
            <div className="col-12 col-ms-12 col-md-12 contenedor-tabla-de-datos">
                <div className="row">
                            <ComponentFormRadioState
                            clasesColumna="col-auto"
                            extra="custom-control-inline"
                            nombreCampoRadio="Filtro Tabla:"
                            name="tabla"
                            nombreLabelRadioA="En espera"
                            idRadioA="es-espera"
                            checkedRadioA={props.tabla}
                            valueRadioA="E"
                            nombreLabelRadioB="Aprobado"
                            idRadioB="aprovado"
                            valueRadioB="A"
                            eventoPadre={props.ventoConsultarPermiso}
                            checkedRadioB={props.tabla}
                            />
                            <ComponentFormRadioState
                            clasesColumna="col-auto"
                            extra="custom-control-inline"
                            nombreCampoRadio=""
                            name="tabla"
                            nombreLabelRadioA="Denegado"
                            idRadioA="denegado"
                            checkedRadioA={props.tabla}
                            valueRadioA="D"
                            nombreLabelRadioB="Culminado"
                            idRadioB="culminado"
                            valueRadioB="C"
                            eventoPadre={props.ventoConsultarPermiso}
                            checkedRadioB={props.tabla}
                            />
                    </div>
                <Tabla 
                tabla_encabezado={props.tabla_encabezado}
                tabla_body={props.tabla_body}
                numeros_registros={props.numeros_registros}
                />
            </div>     
        </div>
    )

}

export default componentTableDeDatosSinBarra