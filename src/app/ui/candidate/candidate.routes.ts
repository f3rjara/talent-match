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
      { path: 'available-offers', component: AvailableOffersComponent },
      { path: 'init-aplication/:vancancieId', component: InitAplicationComponent },
      {
        path: '**',
        redirectTo: 'available-offers',
        pathMatch: 'full',
      },
    ],
  },
];
