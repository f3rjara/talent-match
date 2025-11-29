/* eslint-disable prettier/prettier */
import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { AvailableOffersComponent } from './pages/available-offers/available-offers.component';
import { InitAplicationComponent } from './pages/init-aplication/init-aplication.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'vacantes', component: AvailableOffersComponent },
      { path: 'aplicar/:vancancieId', component: InitAplicationComponent },
      {
        path: '**',
        redirectTo: 'vacantes',
        pathMatch: 'full',
      },
    ],
  },
];
