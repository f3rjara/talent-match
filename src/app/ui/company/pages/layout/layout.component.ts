import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';

@Component({
  selector: 'app-layout',
  imports: [ButtonModule, RouterOutlet, RouterModule, Menubar],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  items: MenuItem[] = [
    { label: 'Inicio', icon: 'pi pi-fw pi-home', routerLink: '/empresa/gestion/mis-vacantes' },
    { label: 'Vacantes', icon: 'pi pi-fw pi-briefcase', routerLink: '/empresa/gestion/mis-vacantes' },
    { label: 'Candidatos', icon: 'pi pi-fw pi-users', routerLink: '/empresa/gestion/postulaciones' },
    { label: 'Perfil', icon: 'pi pi-fw pi-user', routerLink: '/empresa/gestion/perfil' },
  ];
}
