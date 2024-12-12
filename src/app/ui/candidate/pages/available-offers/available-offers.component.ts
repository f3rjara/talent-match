import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { VacancyService } from './services/vacancy.service';

@Component({
  selector: 'app-available-offers',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule],
  templateUrl: './available-offers.component.html',
  styleUrl: './available-offers.component.scss',
})
export class AvailableOffersComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _vacancyService: VacancyService = inject(VacancyService);

  availablOffers: any = [];

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
        console.log('response:', response);
        this.availablOffers = response;
      },
      error: (error) => {
        console.log('error get:', error);
        this.availablOffers = [
          { id: 1, title: 'Frontend Developer', experience: '3+ years', location: 'Remote' },
          { id: 2, title: 'Backend Developer', experience: '4+ years', location: 'On-site' },
          { id: 3, title: 'UI/UX Designer', experience: '2+ years', location: 'Hybrid' },
          { id: 4, title: 'DevOps Engineer', experience: '5+ years', location: 'Remote' },
          { id: 5, title: 'Data Scientist', experience: '3+ years', location: 'Remote' },
        ];
      },
    });
  }
}
