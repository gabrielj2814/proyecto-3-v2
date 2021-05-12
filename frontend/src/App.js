import React from 'react';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
//componentes
import ComponentInicio from './componentes/componentInicio';
import ComponentNosotros from './componentes/componentNosotros';
import ComponentAsistenciaPublica from './componentes/componentAsistenciaPublica';
import ComponentLogin from './componentes/componentLogin';
import ComponentRecuperarCuenta from './componentes/componentRecuperarCuenta';
import ComponentTrabajadorRegistrar from './componentes/componentTrabajadorRegistro'
//APP
//import ComponentDashboard from './componentes/componentDashboard';
import ComponentInicioDashboard from './componentes/componentInicioDashboard';
import ComponentPerfilTrabajador from './componentes/componentPerfilTrabajador';
//modulos transaccion
//PERMISO TRABAJADOR
import ComponentSolicitarPermisoForm from './componentes/componentSolicitarPermisoForm'
import ComponentSolicitarPermisoTrabajadorForm from './componentes/componentSolicitarPermisoTrabajadorForm'
import ComponentPermisoTrabajador from './componentes/componentPermisoTrabajador'
import ComponentEditarPermisoTrabajador from './componentes/componentEditarPermisoTrabajadorForm'
//modulos reporte
//modulos configuracion
//ACCESO
import ComponentAcceso from './componentes/componentAcceso'
import ComponentAccesoForm from './componentes/componentAccesoForm'
import ComponentAccesoConsulta from './componentes/componentAccesoConsulta'
//PERMISO
import ComponentPermiso from './componentes/componentPermiso'
import ComponentPermisoForm from './componentes/componentPermisoForm'
import ComponentPermisoConsulta from './componentes/componentPermisoConsulta'
//REPOSO
import ComponentReposo from './componentes/componentReposo'
import ComponentReposoForm from './componentes/componentReposoForm'
import ComponentReposoConsulta from './componentes/componentReposoConsulta'
//TIPO TRABAJADOR
import ComponentTipoTrabajador from './componentes/componentTipoTrab'
import ComponentTipoTrabajadorForm from './componentes/componentTipoTrabForm'
import ComponentTipoTrabajadorConsulta from './componentes/componentTipoTrabajadorConsulta'
//TRABAJADOR
import ComponentTrabajadorForm from './componentes/componentTrabajadorForm'
import ComponentTrabajadorConsulta from './componentes/componentTrabajadorConsulta'
import ComponentTrabajador from './componentes/componentTrabajador'
//FUNCION TRABAJADOR
import ComponentFuncionTrabajadorForm from './componentes/componentFuncionTrabajadorForm'
import ComponentFuncionTrabajadorConsulta from './componentes/componentFuncionTrabajadorConsulta'
import ComponentFuncionTrabajador from './componentes/componentFuncionTrabajador'
//ESTADO
import ComponentEstado from './componentes/componentEstado'
import ComponentEstadoForm from './componentes/componentEstadoForm'
import ComponentEstadoConsulta from './componentes/componentEstadoConsulta'
//CIUDAD
import ComponentCiudad from './componentes/componentCiudad'
import ComponentCiudadForm from './componentes/componentCiudadForm'
import ComponentCiudadConsulta from './componentes/componentCiudadConsulta'
//MEDICO
import ComponentMedico from './componentes/componentMedico'
import ComponentMedicoForm from './componentes/componentMedicoForm'
import ComponentMedicoConsulta from './componentes/componentMedicoConsulta'
//ESPECIALIDAD
import ComponentEspecialidad from './componentes/componentEspecialidad'
import ComponentEspecialidadForm from './componentes/componentEspecialidadForm'
import ComponentEspecialidadConsulta from './componentes/componentEspecialidadConsulta'
// ASIGNACION ESPECIALIDAD MEDICO
import ComponentAsignacionEspecialidadMedicoForm from "./componentes/componentAsignacionEspecialidadMedicoForm"
import ComponentAsignacionEspecialidadMedico from "./componentes/componentAsignacionEspecialidadMedico"
import ComponentAsignacionEspecialidadMedicoConsulta from "./componentes/componentAsignacionEspecialidadMedicoConsulta"
//TIPO CAM
import ComponentTipoCam from './componentes/componentTipoCam'
import ComponentTipoCamForm from './componentes/componentTipoCamForm'
import ComponentTipoCamConsulta from './componentes/componentTipoCamConsulta'
// CAM
import ComponentCamFormulario from "./componentes/componentCamFormulario"
import ComponentCam from "./componentes/componentCam"
import ComponentCamConsultar from "./componentes/componentCamConsulta"
// HORARIO
import componentHorario from './componentes/componentHorario';
import componentHorarioFormulario from './componentes/componentHorarioFormulario';
// ASISTENCIA
import ComponentAsistencia from './componentes/componentAsistencia';
import ComponentListaAsistencia from './componentes/componentListaAsistencia';
// REPOSO TRABAJADOR 
import ComponentReposoTrabajadorFormDirecto from "./componentes/componentReposoTrabajadorFormDirecto"
import ComponentReposoTrabajadorForm from "./componentes/componentReposoTrabajadorForm"
import ComponentReposoTrabajador from "./componentes/componentReposoTrabajador"
import ComponentReposoTrabajadorConsulta from "./componentes/componentReposoTrabajadorConsulta"
//cintillo
import ComponentCintillo from "./componentes/componentCintillo"
// error
import ComponentError404 from "./componentes/componentError404"
// seguridad
import ComponentBitacora from "./componentes/componentBitacora"



import ComponentReporteMedico from './componentes/componentReporteMedico'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={ComponentInicio}/>
        <Route exact path="/nosotros" component={ComponentNosotros}/>
        <Route exact path="/asistencia" component={ComponentAsistenciaPublica}/>
        <Route exact path="/login:mensaje?" component={ComponentLogin}/>
        <Route exact path="/recuperar-cuenta" component={ComponentRecuperarCuenta}/>
        <Route exact path="/registrar/trabajador:mensaje?" component={ComponentTrabajadorRegistrar}/>
        <Route exact path="/dashboard" component={ComponentInicioDashboard}/>
        <Route exact path="/dashboard/perfil" component={ComponentPerfilTrabajador}/>
        <Route exact path="/dashboard/configuracion/acceso/consultar/:id" component={ComponentAccesoConsulta}/>
        <Route exact path="/dashboard/configuracion/acceso/:operacion/:id?" component={ComponentAccesoForm}/>
        <Route exact path="/dashboard/configuracion/acceso:mensaje?" component={ComponentAcceso}/>
        <Route exact path="/dashboard/configuracion/permiso/consultar/:id" component={ComponentPermisoConsulta}/>
        <Route exact path="/dashboard/configuracion/permiso/:operacion/:id?" component={ComponentPermisoForm}/>
        <Route exact path="/dashboard/configuracion/permiso:mensaje?" component={ComponentPermiso}/>


        <Route exact path="/dashboard/configuracion/reposo/consultar/:id" component={ComponentReposoConsulta}/>
        <Route exact path="/dashboard/configuracion/reposo/:operacion/:id?" component={ComponentReposoForm}/>
        <Route exact path="/dashboard/configuracion/reposo:mensaje?" component={ComponentReposo}/>

        <Route exact path="/dashboard/configuracion/tipo-trabajador/consultar/:id" component={ComponentTipoTrabajadorConsulta}/>
        <Route exact path="/dashboard/configuracion/tipo-trabajador/:operacion/:id?" component={ComponentTipoTrabajadorForm}/>
        <Route exact path="/dashboard/configuracion/tipo-trabajador:mensaje?" component={ComponentTipoTrabajador}/>

        <Route exact path="/dashboard/configuracion/trabajador/consultar/:id" component={ComponentTrabajadorConsulta}/>
        <Route exact path="/dashboard/configuracion/trabajador/:operacion/:id?" component={ComponentTrabajadorForm}/>
        <Route exact path="/dashboard/configuracion/trabajador:mensaje?" component={ComponentTrabajador}/>

        <Route exact path="/dashboard/configuracion/funcion-trabajador/consultar/:id" component={ComponentFuncionTrabajadorConsulta}/>
        <Route exact path="/dashboard/configuracion/funcion-trabajador/:operacion/:id?" component={ComponentFuncionTrabajadorForm}/>
        <Route exact path="/dashboard/configuracion/funcion-trabajador:mensaje?" component={ComponentFuncionTrabajador}/>

        <Route exact path="/dashboard/configuracion/estado/consultar/:id" component={ComponentEstadoConsulta}/>
        <Route exact path="/dashboard/configuracion/estado/:operacion/:id?" component={ComponentEstadoForm}/>
        <Route exact path="/dashboard/configuracion/estado:mensaje?" component={ComponentEstado}/>

        <Route exact path="/dashboard/configuracion/ciudad/consultar/:id" component={ComponentCiudadConsulta}/>
        <Route exact path="/dashboard/configuracion/ciudad/:operacion/:id?" component={ComponentCiudadForm}/>
        <Route exact path="/dashboard/configuracion/ciudad:mensaje?" component={ComponentCiudad}/>

        <Route exact path="/dashboard/configuracion/medico/consultar/:id" component={ComponentMedicoConsulta}/>
        <Route exact path="/dashboard/configuracion/medico/:operacion/:id?" component={ComponentMedicoForm}/>
        <Route exact path="/dashboard/configuracion/medico:mensaje?" component={ComponentMedico}/>

        <Route exact path="/dashboard/configuracion/especialidad/consultar/:id" component={ComponentEspecialidadConsulta}/>
        <Route exact path="/dashboard/configuracion/especialidad/:operacion/:id?" component={ComponentEspecialidadForm}/>
        <Route exact path="/dashboard/configuracion/especialidad:mensaje?" component={ComponentEspecialidad}/>
        
        <Route exact path="/dashboard/configuracion/asignacion-especialidad-medico/consultar/:id" component={ComponentAsignacionEspecialidadMedicoConsulta}/>
        <Route exact path="/dashboard/configuracion/asignacion-especialidad-medico/:operacion/:id?" component={ComponentAsignacionEspecialidadMedicoForm}/>
        <Route exact path="/dashboard/configuracion/asignacion-especialidad-medico:mensaje?" component={ComponentAsignacionEspecialidadMedico}/>

        <Route exact path="/dashboard/configuracion/tipo-cam/consultar/:id" component={ComponentTipoCamConsulta}/>
        <Route exact path="/dashboard/configuracion/tipo-cam/:operacion/:id?" component={ComponentTipoCamForm}/>
        <Route exact path="/dashboard/configuracion/tipo-cam:mensaje?" component={ComponentTipoCam}/>
        
        <Route exact path="/dashboard/configuracion/horario/:operacion/:id?" component={componentHorarioFormulario}/>
        <Route exact path="/dashboard/configuracion/horario:mensaje?" component={componentHorario}/>

        <Route exact path="/dashboard/configuracion/cintillo-home" component={ComponentCintillo}/>
        
        
        <Route exact path="/dashboard/configuracion/cam/consultar/:id" component={ComponentCamConsultar}/>
        <Route exact path="/dashboard/configuracion/cam/:operacion/:id?" component={ComponentCamFormulario}/>
        <Route exact path="/dashboard/configuracion/cam:mensaje?" component={ComponentCam}/>
        
        <Route exact path="/dashboard/transaccion/reposo-trabajador/solicitar" component={ComponentReposoTrabajadorFormDirecto}/>
        <Route exact path="/dashboard/transaccion/reposo-trabajador/consultar/:id" component={ComponentReposoTrabajadorConsulta}/>
        <Route exact path="/dashboard/transaccion/reposo-trabajador/:operacion/:id?" component={ComponentReposoTrabajadorForm}/>
        <Route exact path="/dashboard/transaccion/reposo-trabajador:mensaje?" component={ComponentReposoTrabajador}/>


        <Route exact path="/dashboard/transaccion/permiso-trabajador/solicitar" component={ComponentSolicitarPermisoForm}/>
        <Route exact path="/dashboard/transaccion/permiso-trabajador/trabajador/solicitar" component={ComponentSolicitarPermisoTrabajadorForm}/>
        <Route exact path="/dashboard/transaccion/permiso-trabajador:mensaje?" component={ComponentPermisoTrabajador}/>
        <Route exact path="/dashboard/transaccion/permiso-trabajador/editar:id" component={ComponentEditarPermisoTrabajador}/>

        <Route exact path="/dashboard/transaccion/asistencia" component={ComponentAsistencia}/>
        <Route exact path="/dashboard/transaccion/asistencia/lista" component={ComponentListaAsistencia}/>

        <Route exact path="/dashboard/seguridad/bitacora" component={ComponentBitacora}/>

        <Route exact path="/dashboard/reporte/medico" component={ComponentReporteMedico}/>

        <Route  path="*" component={ComponentError404}/>
        </Switch>
    </Router>
  );
}

export default App;
