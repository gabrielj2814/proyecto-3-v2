import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import '../Icon-Simple/style.css'
import '../css/buttonIcon.css'
//<span className={props.clasesBoton+" "+props.icon} id={props.name} onClick={props.eventoPadre}></span>

const ButtonIcon= (props) => {

    return(<button className={props.clasesBoton+" ButtonIcono "+props.icon} id={props.id} onClick={props.eventoPadre}></button>)
}

export default ButtonIcon