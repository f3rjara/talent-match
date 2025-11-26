import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { VacancyService } from './services/vacancy.service';

@Component({
  selector: 'app-available-offers',
  imports: [CommonModule, ButtonModule, CardModule],
  templateUrl: './available-offers.component.html',
  styleUrl: './available-offers.component.scss',
})
export class AvailableOffersComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _vacancyService: VacancyService = inject(VacancyService);

  availablOffers: any = [];

  avaliableOffersMock = [
    {
      id: 1,
      titulo: 'Frontend Developer',
      experiencia: '3+ years',
      ubicacion: 'Remote',
      disponibilidad: 'inmediato',
    },
    {
      id: 2,
      titulo: 'Backend Developer',
      experiencia: '4+ years',
      ubicacion: 'On-site',
      disponibilidad: 'inmediato',
    },
    {
      id: 3,
      titulo: 'UI/UX Designer',
      experiencia: '2+ years',
      ubicacion: 'Hybrid',
      disponibilidad: 'inmediato',
    },
    {
      id: 4,
      titulo: 'DevOps Engineer',
      experiencia: '5+ years',
      ubicacion: 'Remote',
      disponibilidad: 'inmediato',
    },
    {
      id: 5,
      titulo: 'Data Scientist',
      experiencia: '3+ years',
      ubicacion: 'Remote',
      disponibilidad: 'inmediato',
    },
  ];

  ngOnInit(): void {
    this.getVacancies();
  }

  gotoInitAplication(idVacancie: number, title: string) {
    const navigateTo = `/candidate/init-aplication/${idVacancie}`;
    this._router.navigate([navigateTo], { queryParams: { title: title } });
  }

  getVacancies() {
    this._vacancyService.getVacancy().subscribe({
      next: (response) => {
        this.availablOffers = response;
      },
      error: (error) => {
        console.log('error get:', error);
        this.availablOffers = this.avaliableOffersMock;
      },
    });
  }
}
