import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { VacanciesComponent } from './pages/vacancies/vacancies.component';
import { ApplicationsComponent } from './pages/applications/applications.component';
import { AuthComponent } from './pages/auth/auth.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'ingreso',
    pathMatch: 'full',
  },
  {
    path: 'gestion',
    component: LayoutComponent,
    children: [
      { path: 'mis-vacantes', component: VacanciesComponent },
      { path: 'postulaciones', component: ApplicationsComponent },
      {
        path: '**',
        redirectTo: 'mis-vacantes',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'ingreso',
    component: AuthComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'ingreso',
    pathMatch: 'full',
  },
];
