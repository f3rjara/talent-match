import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-init-aplication',
  standalone: true,
  imports: [InputTextModule, FormsModule, DividerModule, ButtonModule],
  templateUrl: './init-aplication.component.html',
  styleUrl: './init-aplication.component.scss',
})
export class InitAplicationComponent {
  documnet: string = '';
  private readonly _router = inject(Router);

  url =
    'https://api.whatsapp.com/send?phone=573172396943&text=Hola%20%E2%9C%8C%EF%B8%8F%E2%9C%8C%EF%B8%8F..%20Quiero%20crear%20mi%20CV%20con%20su%20ayuda%20y%20postularme%20a%20las%20ofertas%20laborales%20disponibles.%20';

  goToChatboot() {
    window.open(this.url, '_blank');
  }
}
