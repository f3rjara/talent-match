import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-init-aplication',
  standalone: true,
  imports: [InputTextModule, FormsModule, DividerModule, ButtonModule],
  templateUrl: './init-aplication.component.html',
  styleUrl: './init-aplication.component.scss',
})
export class InitAplicationComponent implements OnInit {
  @Input() vancancieId: string = '';
  vacancieTitle: string = '';
  documnet: string = '';

  constructor(private readonly route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.vacancieTitle = params['title'] || '';
    });
  }

  goToChatboot() {
    const URL = this.buildUrlChatboot();
    window.open(URL, '_blank');
  }

  buildUrlChatboot() {
    const vacancieTitleEncoded = encodeURIComponent(this.vacancieTitle);
    const vancancieIdEncoded = encodeURIComponent(this.vancancieId);
    return `https://api.whatsapp.com/send?phone=573172396943&text=Hola%20%E2%9C%8C%EF%B8%8F%F0%9F%98%8A%2C%0A%0AMe%20gustar%C3%ADa%20crear%20mi%20curr%C3%ADculum%20con%20su%20ayuda%20y%20postularme%20para%20la%20oferta%20laboral%20disponible%20para%3A%20*${vacancieTitleEncoded}*%20%F0%9F%92%BB%E2%9C%A8.%0A%0A************************%0A%23vacante%3A*${vancancieIdEncoded}%23`;
  }
}
