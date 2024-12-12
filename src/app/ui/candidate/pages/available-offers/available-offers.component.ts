import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-available-offers',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule],
  templateUrl: './available-offers.component.html',
  styleUrl: './available-offers.component.scss',
})
export class AvailableOffersComponent {
  private readonly _router = inject(Router);

  availablOffers = [
    { title: 'Frontend Developer', experience: '3+ years', location: 'Remote' },
    { title: 'Backend Developer', experience: '4+ years', location: 'On-site' },
    { title: 'UI/UX Designer', experience: '2+ years', location: 'Hybrid' },
    { title: 'DevOps Engineer', experience: '5+ years', location: 'Remote' },
    { title: 'Data Scientist', experience: '3+ years', location: 'Remote' },
  ];

  gotoInitAplication() {
    this._router.navigate(['/candidate/init-aplication']);
  }
}
