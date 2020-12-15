import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'

const InputButton= (props) => {


    return(
        <input type="button" className={props.clasesBoton} id={props.id} value={props.value} onClick={props.eventoPadre}/>
    )
}

export default InputButton