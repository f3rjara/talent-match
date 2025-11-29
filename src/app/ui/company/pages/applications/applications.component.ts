/* eslint-disable prettier/prettier */
/* eslint-disable no-trailing-spaces */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-applications',
  imports: [CommonModule, TableModule, TagModule, ButtonModule, RatingModule, FormsModule, CardModule, DialogModule],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss',
})
export class ApplicationsComponent implements OnInit {
  titulo: string | null = null;
  candidates = [
    {
      id: 1,
      name: 'Holguer Andrade',
      phone: '315 474 3845',
      email: 'holguer@gmail.com',
      score: 'Altamente calificado',
    },
    {
      id: 2,
      name: 'Fernando Jaramillo',
      phone: '315 656 1234',
      email: 'fernando@gmail.com',
      score: 'Altamente calificado',
    },
    {
      id: 3,
      name: 'Elkyn Enriquez',
      phone: '312 876 8927',
      email: 'elkyn@gmail.com',
      score: 'Parcialmente calificado',
    },
    {
      id: 4,
      name: 'Luis Narvaez',
      phone: '310 675 9182',
      email: 'luis@gmail.com',
      score: 'No calificado',
    },
  ];
  cols!: Column[];
  modalVisible = false;
  selectedCandidate: any = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.titulo = params['titulo'] || null;
    });

    this.cols = [
      { field: 'id', header: 'Code' },
      { field: 'name', header: 'Candidato' },
      { field: 'phone', header: 'Teléfono' },
      { field: 'email', header: 'Email' },
      { field: 'score', header: 'Observación' },
      { field: 'actions', header: 'Acciones' },
    ];
  }

  getScoreClass(score: string): string {
    switch (score) {
      case 'Altamente calificado':
        return 'score-high';
      case 'Parcialmente calificado':
        return 'score-medium';
      case 'No calificado':
        return 'score-low';
      default:
        return '';
    }
  }

  viewCandidateDetails(candidate: any): void {
    this.selectedCandidate = candidate;
    this.modalVisible = true;
  }
}
