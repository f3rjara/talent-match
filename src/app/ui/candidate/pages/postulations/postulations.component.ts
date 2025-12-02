import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { TimelineModule } from 'primeng/timeline';
import { TooltipModule } from 'primeng/tooltip';

export type ApplicationStatus = 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected';

export interface Application {
  id: string;
  vacancyId: string;
  position: string;
  company: string;
  location: string;
  salary: string;
  status: ApplicationStatus;
  appliedDate: string;
  lastUpdate: string;
  description: string;
  interviewDate?: string;
  notes?: string;
  progress: number;
}

export interface ApplicationStats {
  total: number;
  pending: number;
  reviewing: number;
  interviews: number;
  accepted: number;
  rejected: number;
}

@Component({
  selector: 'app-postulations-component',
  imports: [CommonModule, ButtonModule, TagModule, CardModule, ChipModule, TimelineModule, TooltipModule],
  templateUrl: './postulations.component.html',
  styleUrl: './postulations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostulationsComponent {
  applications = signal<Application[]>([
    {
      id: '1',
      vacancyId: 'v1',
      position: 'Desarrollador Full Stack Senior',
      company: 'Tech Innovations SA',
      location: 'Bogotá, Colombia',
      salary: '$5.000.000 - $7.000.000 COP',
      status: 'interview',
      appliedDate: '2025-11-15',
      lastUpdate: '2025-11-28',
      description: 'Desarrollo de aplicaciones web empresariales con Angular y Node.js',
      interviewDate: '2025-12-05',
      progress: 75,
    },
    {
      id: '2',
      vacancyId: 'v2',
      position: 'Frontend Developer React',
      company: 'Digital Solutions',
      location: 'Medellín, Colombia',
      salary: '$4.500.000 - $6.000.000 COP',
      status: 'reviewing',
      appliedDate: '2025-11-20',
      lastUpdate: '2025-11-25',
      description: 'Crear interfaces modernas con React y TypeScript',
      progress: 50,
    },
    {
      id: '3',
      vacancyId: 'v3',
      position: 'Backend Engineer Node.js',
      company: 'Cloud Systems',
      location: 'Remoto',
      salary: '$6.000.000 - $8.000.000 COP',
      status: 'pending',
      appliedDate: '2025-11-25',
      lastUpdate: '2025-11-25',
      description: 'Desarrollo de APIs RESTful y microservicios',
      progress: 25,
    },
    {
      id: '4',
      vacancyId: 'v4',
      position: 'DevOps Engineer',
      company: 'Infrastructure Pro',
      location: 'Cali, Colombia',
      salary: '$5.500.000 - $7.500.000 COP',
      status: 'accepted',
      appliedDate: '2025-10-10',
      lastUpdate: '2025-11-30',
      description: 'Gestión de infraestructura cloud y CI/CD',
      progress: 100,
    },
    {
      id: '5',
      vacancyId: 'v5',
      position: 'Mobile Developer Flutter',
      company: 'App Factory',
      location: 'Bogotá, Colombia',
      salary: '$4.000.000 - $5.500.000 COP',
      status: 'rejected',
      appliedDate: '2025-11-01',
      lastUpdate: '2025-11-18',
      description: 'Desarrollo de aplicaciones móviles multiplataforma',
      progress: 0,
    },
  ]);

  stats = signal<ApplicationStats>({
    total: 5,
    pending: 1,
    reviewing: 1,
    interviews: 1,
    accepted: 1,
    rejected: 1,
  });

  selectedFilter = signal<ApplicationStatus | 'all'>('all');

  filteredApplications = signal<Application[]>([]);

  constructor() {
    // Inicializar aplicaciones filtradas
    this.filteredApplications.set(this.applications());
  }

  getStatusConfig(status: ApplicationStatus) {
    const configs = {
      pending: {
        label: 'Pendiente',
        severity: 'secondary' as const,
        icon: 'pi-clock',
        color: 'text-gray-600',
        bg: 'bg-gray-100',
      },
      reviewing: {
        label: 'En Revisión',
        severity: 'info' as const,
        icon: 'pi-eye',
        color: 'text-blue-600',
        bg: 'bg-blue-100',
      },
      interview: {
        label: 'Entrevista',
        severity: 'warn' as const,
        icon: 'pi-calendar',
        color: 'text-amber-600',
        bg: 'bg-amber-100',
      },
      accepted: {
        label: 'Aceptado',
        severity: 'success' as const,
        icon: 'pi-check-circle',
        color: 'text-green-600',
        bg: 'bg-green-100',
      },
      rejected: {
        label: 'Rechazado',
        severity: 'danger' as const,
        icon: 'pi-times-circle',
        color: 'text-red-600',
        bg: 'bg-red-100',
      },
    };
    return configs[status];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  getDaysAgo(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  filterApplications(filter: ApplicationStatus | 'all') {
    this.selectedFilter.set(filter);
    if (filter === 'all') {
      this.filteredApplications.set(this.applications());
    } else {
      this.filteredApplications.set(this.applications().filter((app) => app.status === filter));
    }
  }

  getStatusLabel(status: ApplicationStatus | 'all'): string {
    if (status === 'all') return 'Todas';
    return this.getStatusConfig(status).label;
  }

  viewDetails(application: Application) {
    console.log('Ver detalles:', application);
  }

  withdrawApplication(application: Application) {
    console.log('Retirar aplicación:', application);
  }
}
