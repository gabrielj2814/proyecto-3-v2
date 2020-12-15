import React from 'react';
// css
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
//sub componentes
import ComponentMenuHomePage from '../subComponentes/componentMenuHomePage';
import ComponentCarusel from '../subComponentes/componentCarusel';
import ComponentSociales from '../subComponentes/componentSociales';
import ComponentEntidades from '../subComponentes/componentEntidades';
class ComponentInicio extends React.Component{


    render(){
        return(
            <div className="containter-fluid component_inicio">
                <ComponentMenuHomePage/>
                <ComponentCarusel/>
                <ComponentSociales/>
                <ComponentEntidades/>
            </div>
        )
    }

}

export default ComponentInicio