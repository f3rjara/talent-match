import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { VacancyService } from '@core/services/vacancies/vacancy.service';
import { Vacancy } from '@core/models/vacancies/vacancy.interface';

@Component({
  selector: 'app-available-offers',
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TagModule,
    TooltipModule,
    SkeletonModule,
    DialogModule,
    DividerModule,
    ChipModule,
  ],
  templateUrl: './available-offers.component.html',
  styleUrl: './available-offers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailableOffersComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _vacancyService = inject(VacancyService);

  vacancies = signal<Vacancy[]>([]);
  favorites = signal<Set<string>>(new Set());
  loading = signal<boolean>(true);
  selectedVacancy = signal<Vacancy | null>(null);
  showDetails = signal<boolean>(false);

  ngOnInit(): void {
    this.loadVacancies();
  }

  loadVacancies(): void {
    this.loading.set(true);
    this._vacancyService.getVacancies().subscribe({
      next: (response) => {
        this.vacancies.set(response.vacancies);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  toggleFavorite(vacancyId: string, event: Event): void {
    event.stopPropagation();
    const currentFavorites = new Set(this.favorites());

    if (currentFavorites.has(vacancyId)) {
      currentFavorites.delete(vacancyId);
    } else {
      currentFavorites.add(vacancyId);
    }

    this.favorites.set(currentFavorites);
  }

  isFavorite(vacancyId: string): boolean {
    return this.favorites().has(vacancyId);
  }

  viewDetails(vacancy: Vacancy): void {
    this.selectedVacancy.set(vacancy);
    this.showDetails.set(true);
  }

  closeDetails(): void {
    this.showDetails.set(false);
    this.selectedVacancy.set(null);
  }

  applyToVacancy(vacancy: Vacancy): void {
    const navigateTo = `/candidato/aplicar/${vacancy.vacancyId}`;
    this._router.navigate([navigateTo], {
      queryParams: { title: vacancy.title },
    });
  }

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    const severityMap: Record<string, 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast'> = {
      open: 'success',
      closed: 'danger',
      paused: 'warning',
    };
    return severityMap[status] || 'info';
  }

  getStatusLabel(status: string): string {
    const labelMap: Record<string, string> = {
      open: 'Abierta',
      closed: 'Cerrada',
      paused: 'Pausada',
    };
    return labelMap[status] || status;
  }
}
