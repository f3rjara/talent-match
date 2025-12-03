import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { ActivatedRoute } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-init-aplication',
  imports: [
    CommonModule,
    InputTextModule,
    FormsModule,
    DividerModule,
    ButtonModule,
    CardModule,
    TagModule,
    ChipModule,
    QRCodeComponent,
  ],
  templateUrl: './init-aplication.component.html',
  styleUrl: './init-aplication.component.scss',
})
export class InitAplicationComponent implements OnInit {
  @Input() vancancieId: string = '';
  vacancieTitle: string = '';
  documnet: string = '';
  qrCodeValue = signal<string>('');
  whatsappNumber = '573172396943';

  // Simular datos de la vacante (en producción vendrían del servicio)
  vacancyData = {
    title: 'Senior Software Engineer',
    company: 'Empresa X',
    status: 'Abierta',
    location: 'Remote / Pasto, Nariño',
    experience: '5 years in software development',
    requiredInfo: [
      'Nombres completos',
      'Apellidos completos',
      'Dirección de residencia completa',
      'Teléfono celular o WhatsApp',
      'Correo electrónico',
      'Número de documento de identidad (Cédula de ciudadanía colombiana)',
    ],
  };

  constructor(private readonly route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.vacancieTitle = params['title'] || this.vacancyData.title;
      this.generateQRCode();
    });
  }

  generateQRCode(): void {
    const url = this.buildUrlChatboot();
    this.qrCodeValue.set(url);
  }

  goToChatboot() {
    const URL = this.buildUrlChatboot();
    window.open(URL, '_blank');
  }

  buildUrlChatboot() {
    const vacancieTitleEncoded = encodeURIComponent(this.vacancieTitle);
    const vancancieIdEncoded = encodeURIComponent(this.vancancieId);
    return `https://api.whatsapp.com/send?phone=573172396943&text=Hola%20%E2%9C%8C%EF%B8%8F%F0%9F%98%8A%2C%0A%0AMe%20gustar%C3%ADa%20crear%20mi%20curr%C3%ADculum%20con%20su%20ayuda%20y%20postularme%20para%20la%20oferta%20laboral%20disponible%20para%3A%20*${vacancieTitleEncoded}*%20%F0%9F%92%BB%E2%9C%A8.%0A%0A************************%0A%23vacancy%3A${vancancieIdEncoded}`;
  }
}
