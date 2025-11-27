/* eslint-disable prettier/prettier */
import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { VacanciesComponent } from './pages/vacancies/vacancies.component';
import { ApplicationsComponent } from './pages/applications/applications.component';

export const routes: Routes = [
  {
    path: '',
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
];
