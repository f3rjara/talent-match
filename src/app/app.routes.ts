/* eslint-disable prettier/prettier */
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'empresa',
    pathMatch: 'full',
  },
  {
    path: 'empresa',
    loadChildren: () => import('./ui/company/company.routes').then((company) => company.routes),
  },
  {
    path: 'candidato',
    loadChildren: () => import('./ui/candidate/candidate.routes').then((candidate) => candidate.routes),
  },
];
