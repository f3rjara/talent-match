import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';

const PRIME_COMPONENTS = [
  CardModule,
  InputTextModule,
  InputTextarea,
  ButtonModule,
  AvatarModule,
  DividerModule,
  TagModule,
];

@Component({
  selector: 'app-profile',
  imports: [FormsModule, ...PRIME_COMPONENTS],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  companyData: Record<string, string> = {
    name: 'Tech Innovators S.A.S',
    nit: '900.123.456-7',
    email: 'contacto@techinnovators.com',
    phone: '+57 310 123 4567',
    address: 'Cra 7 # 71-21, Bogotá D.C.',
    website: 'www.techinnovators.com',
    description:
      'Somos una empresa líder en desarrollo de soluciones tecnológicas innovadoras, especializada en transformación digital y desarrollo de software a la medida.',
    employees: '50-100',
    industry: 'Tecnología',
  };

  fields = [
    { key: 'name', label: 'Nombre de la Empresa', type: 'text', placeholder: 'Nombre de la empresa' },
    { key: 'nit', label: 'NIT', type: 'text', placeholder: 'NIT' },
    { key: 'email', label: 'Correo Electrónico', type: 'email', placeholder: 'correo@empresa.com' },
    { key: 'phone', label: 'Teléfono', type: 'text', placeholder: '+57 300 123 4567' },
    { key: 'website', label: 'Sitio Web', type: 'text', placeholder: 'www.empresa.com' },
    { key: 'address', label: 'Dirección', type: 'text', placeholder: 'Dirección completa' },
  ];

  editMode = false;

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  saveProfile(): void {
    // Aquí iría la lógica para guardar
    this.editMode = false;
  }
}
