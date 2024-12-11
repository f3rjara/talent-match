/* eslint-disable prettier/prettier */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-vacancies',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule
  ],
  templateUrl: './vacancies.component.html',
  styleUrl: './vacancies.component.scss'
})
export class VacanciesComponent {
  vacancies = [
    { title: 'Frontend Developer', experience: '3+ years', location: 'Remote' },
    { title: 'Backend Developer', experience: '4+ years', location: 'On-site' },
    { title: 'UI/UX Designer', experience: '2+ years', location: 'Hybrid' },
    { title: 'DevOps Engineer', experience: '5+ years', location: 'Remote' },
    { title: 'Data Scientist', experience: '3+ years', location: 'Remote' },
  ];

}
