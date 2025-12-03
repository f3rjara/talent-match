import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

interface CandidateProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  summary: string;
  avatar: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  languages: Language[];
}

interface Experience {
  position: string;
  company: string;
  period: string;
  description: string;
}

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface Language {
  name: string;
  level: string;
}

@Component({
  selector: 'app-profile.component',
  imports: [CommonModule, ButtonModule, TagModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  profile = signal<CandidateProfile>({
    name: 'María Rodríguez',
    email: 'maria.rodriguez@email.com',
    phone: '+57 312 456 7890',
    location: 'Bogotá, Colombia',
    title: 'Desarrolladora Full Stack Senior',
    summary:
      'Desarrolladora con más de 5 años de experiencia en desarrollo web y aplicaciones móviles. Apasionada por crear soluciones innovadoras y escalables.',
    avatar: 'https://ui-avatars.com/api/?name=Maria+Rodriguez&size=200&background=6366f1&color=fff',
    skills: ['Angular', 'React', 'Node.js', 'TypeScript', 'Python', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Git'],
    experience: [
      {
        position: 'Desarrolladora Full Stack Senior',
        company: 'Tech Solutions SA',
        period: '2021 - Presente',
        description:
          'Desarrollo de aplicaciones web empresariales usando Angular y Node.js. Liderazgo de equipo de 4 desarrolladores.',
      },
      {
        position: 'Desarrolladora Frontend',
        company: 'Digital Agency',
        period: '2019 - 2021',
        description:
          'Creación de interfaces de usuario responsivas y accesibles. Implementación de mejores prácticas de UX/UI.',
      },
      {
        position: 'Desarrolladora Junior',
        company: 'StartUp Innovación',
        period: '2018 - 2019',
        description:
          'Desarrollo de features para plataforma SaaS. Aprendizaje de tecnologías modernas y metodologías ágiles.',
      },
    ],
    education: [
      {
        degree: 'Ingeniería de Sistemas',
        institution: 'Universidad Nacional de Colombia',
        year: '2014 - 2018',
      },
      {
        degree: 'Certificación AWS Solutions Architect',
        institution: 'Amazon Web Services',
        year: '2022',
      },
    ],
    languages: [
      { name: 'Español', level: 'Nativo' },
      { name: 'Inglés', level: 'Avanzado' },
      { name: 'Francés', level: 'Básico' },
    ],
  });

  editProfile() {
    console.log('Editar perfil');
  }

  downloadCV() {
    console.log('Descargar CV');
  }
}
