import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
// import { ProgressComponent } from './progress/progress.component';
// import { Grafica1Component } from './grafica1/grafica1.component';
// import { AccountSettingsComponent } from './account-settings/account-settings.component';
// import { PromesasComponent } from './promesas/promesas.component';
// import { RxjsComponent } from './rxjs/rxjs.component';
// import { PerfilComponent } from './perfil/perfil.component';
// import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
// import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
// import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
// import { MedicoComponent } from './mantenimientos/medicos/medico.component';
// import { BusquedaComponent } from './busqueda/busqueda.component';
// import { AdminGuard } from '../guards/admin.guard';



const routes: Routes = [
    
    {
        path: 'dashboard',
        component: PagesComponent,
        canActivate: [AuthGuard], // Sino pasa AuthGuard (no pasa validarToken) el usuario no se puede activar las rutas hijas
        //children: [
            // { path: '', component: DashboardComponent, data:{ titulo: 'Dashboard'} },
            // { path: 'progress', component: ProgressComponent, data: { titulo: 'ProgressBar' } },
            // { path: 'grafica1', component: Grafica1Component, data: { titulo: 'Grafica #1' } },
            // { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Account-settings' } },
            // { path: 'buscar/:termino', component: BusquedaComponent, data: { titulo: 'Busquedas' } },
            // { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas' } },
            // { path: 'rxjs', component: RxjsComponent, data: { titulo: 'Rxjs' } },
            // { path: 'perfil', component: PerfilComponent, data: { titulo: 'Perfil de usuario' } },
           
            // // Mantenimientos
            // { path: 'hospitales', component: HospitalesComponent, data: { titulo: 'Mantenimientos de hospitales' }},
            // { path: 'medicos' , component: MedicosComponent, data: { titulo: 'Mantenimiento de médicos' }},
            // { path: 'medico/:id', component: MedicoComponent, data: { titulo: 'Mantenimiento de médico' } },

            // // Rutas de admin
            // // Sino pasa el guard de admin no se cargará el path usuarios
            // { path: 'usuarios', canActivate:[ AdminGuard ], component: UsuariosComponent, data: { titulo: 'Mantenimientos de usuarios' }},
        //]
        canLoad:[ AuthGuard ], // Sino pasa AuthGuard (no pasa validarToken) no continuará con la carga de las rutas hijas
        loadChildren: () => import('./child-routes.module')
            .then( m => m.ChildRoutesModule )
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}
