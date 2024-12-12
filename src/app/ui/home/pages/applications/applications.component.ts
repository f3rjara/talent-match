import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, ButtonModule, RatingModule, FormsModule, CardModule],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss',
})
export class ApplicationsComponent implements OnInit {
  titulo: string | null = null;
  candidates = [
    { nombre: 'Juan Pérez', telefono: '123-456-7890' },
    { nombre: 'Ana Gómez', telefono: '987-654-3210' },
    { nombre: 'Carlos Rodríguez', telefono: '456-789-1234' },
  ];
  products = [
    {
      id: '1000',
      code: 'f230fh0g3',
      name: 'Bamboo Watch',
      description: 'Product Description',
      image: 'bamboo-watch.jpg',
      price: 65,
      category: 'Accessories',
      quantity: 24,
      inventoryStatus: 'INSTOCK',
      rating: 5,
    },
  ];
  cols!: Column[];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.titulo = params['titulo'] || null;
    });

    this.cols = [
      { field: 'code', header: 'Code' },
      { field: 'candidate', header: 'Candidato' },
      { field: 'telephone', header: 'Teléfono' },
      { field: 'actions', header: 'Acciones' },
    ];
  }
}
