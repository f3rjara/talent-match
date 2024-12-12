/* eslint-disable prettier/prettier */
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('./ui/home/home.routes').then((home) => home.routes),
  },
  {
    path: 'candidate',
    loadChildren: () => import('./ui/candidate/candidate.routes').then((candidate) => candidate.routes),
  },
];
