import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Menubar } from 'primeng/menubar';

@Component({
  selector: 'app-layout',
  imports: [ButtonModule, RouterOutlet, RouterModule, Menubar],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  items: MenuItem[] = [
    { label: 'Vacantes', icon: 'pi pi-fw pi-briefcase', routerLink: '/candidato/vacantes' },
    { label: 'Mis postulaciones', icon: 'pi pi-fw pi-users', routerLink: '/candidato/mis-postulaciones' },
    { label: 'Perfil', icon: 'pi pi-fw pi-user', routerLink: '/candidato/perfil' },
  ];
}
