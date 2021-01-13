import React from "react";
import "bootstrap/dist/css/bootstrap.css";

const AlertBootstrap = props => {

    return (

        <>
            <div className={"alert alert-"+((props.colorAlert))+" alert-dismissible fade show"} role="alert">
                {props.mensaje}
                <button className="close" data-dismiss="alert">
                    <span>X</span>
                </button>
            </div>
        
        </>

    )
}

export default AlertBootstrap

