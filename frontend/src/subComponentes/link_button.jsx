import React from 'react'
import {Link} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css'

const LinkButton= (props) => {

    return(
        <Link  className={props.clases} to={props.ruta}>{props.texto}</Link>
    )
}

export default LinkButton