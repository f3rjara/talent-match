/* eslint-disable prettier/prettier */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-console */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { VacancyService } from './services/vacancy.service';

@Component({
  selector: 'app-vacancies',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, CardModule, DialogModule, DropdownModule],
  templateUrl: './vacancies.component.html',
  styleUrl: './vacancies.component.scss',
})
export class VacanciesComponent implements OnInit {
  vacancies: any;
  /*vacancies = [
    { titulo: 'Frontend Developer', experiencia: '3+ años', ubicacion: 'Remoto', disponibilidad: 'Inmediata' },
    { titulo: 'Backend Developer', experiencia: '4+ años', ubicacion: 'Presencial', disponibilidad: '15 días' },
    { titulo: 'UI/UX Designer', experiencia: '2+ años', ubicacion: 'Híbrido', disponibilidad: '1 mes' },
    { titulo: 'DevOps Engineer', experiencia: '5+ años', ubicacion: 'Remoto', disponibilidad: 'Inmediata' },
    { titulo: 'Data Scientist', experiencia: '3+ años', ubicacion: 'Remoto', disponibilidad: '15 días' },
  ];*/
  modalVisible = false;
  isRecording = false;
  transcription = '';
  recognition: any;
  filters = {
    experiencia: '',
    ubicacion: '',
    disponibilidad: '',
  };
  filteredVacancies: any
  //filteredVacancies = [...this.vacancies];
  experienciaOptions = [
    { label: 'Todas', value: '' },
    { label: '3+ años', value: '3+ años' },
    { label: '4+ años', value: '4+ años' },
    { label: '5+ años', value: '5+ años' },
  ];
  ubicacionOptions = [
    { label: 'Todas', value: '' },
    { label: 'Remoto', value: 'Remoto' },
    { label: 'Presencial', value: 'Presencial' },
    { label: 'Híbrido', value: 'Híbrido' },
  ];
  disponibilidadOptions = [
    { label: 'Todas', value: '' },
    { label: 'Inmediata', value: 'Inmediata' },
    { label: '15 días', value: '15 días' },
    { label: '1 mes', value: '1 mes' },
  ];

  constructor(private router: Router, private vacancyService: VacancyService) {}

  ngOnInit(): void {
    this.getVacancies();
  }

  getVacancies() {
    this.vacancyService.getVacancy().subscribe({
      next: (response) => {
        console.log('response:', response);
        this.vacancies = response;
        this.filteredVacancies = [...this.vacancies];
      }, error: (error) => {
        console.log('error:', error);
      }
    });
  }

  openModal() {
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
    this.transcription = '';
  }

  startRecording() {
    if ('webkitSpeechRecognition' in window) {
      this.isRecording = true;
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.lang = 'es-ES'; // Cambia a 'es-ES' para español
      this.recognition.continuous = false;

      this.recognition.onresult = (event: any) => {
        this.transcription = event.results[0][0].transcript;
      };

      this.recognition.onerror = (event: any) => {
        console.error('Error al reconocer la grabación:', event.error);
        this.isRecording = false;
      };

      this.recognition.onend = () => {
        this.isRecording = false;
      };

      this.recognition.start();
    } else {
      alert('Su navegador no soporta la funcionalidad de grabación de voz');
    }
  }

  stopRecording() {
    if (this.recognition) {
      this.recognition.stop();
      this.isRecording = false;
    }
  }

  applyFilters() {
    this.filteredVacancies = this.vacancies.filter((vacancy: any) => {
      const matchesExperiencia = this.filters.experiencia
        ? vacancy.experiencia === this.filters.experiencia
        : true;
      const matchesUbicacion = this.filters.ubicacion
        ? vacancy.ubicacion === this.filters.ubicacion
        : true;
      const matchesDisponibilidad = this.filters.disponibilidad
        ? vacancy.disponibilidad === this.filters.disponibilidad
        : true;

      return matchesExperiencia && matchesUbicacion && matchesDisponibilidad;
    });
    console.log('Filtro: ', this.filteredVacancies);
  }

  saveVacancy() {
    if (!this.transcription) {
      alert('No hay transcripción disponible.');
      return;
    }

    // Convertir la transcripción a minúsculas para un análisis consistente
    const lowerCaseTranscription = this.transcription.toLowerCase();

    // Extraer experiencia (buscar "experiencia X años")
    const experienciaMatch = lowerCaseTranscription.match(/experiencia (\d+\+? años?)/i);
    const experiencia = experienciaMatch ? experienciaMatch[1].trim() : 'Por definir';

    // Extraer ubicación (buscar "ubicación palabra")
    const ubicacionMatch = lowerCaseTranscription.match(/ubicación ([a-záéíóúñ]+)/i);
    const ubicacion = ubicacionMatch ? this.capitalize(ubicacionMatch[1].trim()) : 'Desconocida';

    // Extraer disponibilidad (buscar "disponibilidad X")
    const disponibilidadMatch = lowerCaseTranscription.match(/disponibilidad ([\w\s]+)/i);
    const disponibilidad = disponibilidadMatch ? this.capitalize(disponibilidadMatch[1].trim()) : 'No especificada';

    // Extraer título (todo antes de "experiencia", "ubicación" o "disponibilidad")
    const tituloEndIndex = Math.min(
      ...['experiencia', 'ubicación', 'disponibilidad']
        .map((key) => lowerCaseTranscription.indexOf(key))
        .filter((index) => index > -1)
    );
    const titulo = tituloEndIndex > 0 ? this.capitalize(lowerCaseTranscription.slice(0, tituloEndIndex).trim()) : '';

    // Validar que las propiedades se hayan capturado correctamente
    if (!titulo || !experiencia || !ubicacion || !disponibilidad) {
      alert(
        'No se pudieron identificar todas las propiedades. Por favor, hable en el formato: "Título experiencia X años ubicación Y disponibilidad Z".'
      );
      return;
    }

    // Crear el objeto de la nueva vacante
    const newVacancy = {
      titulo,
      experiencia,
      ubicacion,
      disponibilidad,
    };

    // Agregar la nueva vacante al array
    // this.vacancies.push(newVacancy);
    // this.closeModal();
    this.createVacancy(newVacancy);
  }

  createVacancy(vacancy: any) {
    this.vacancyService.createVacancy(vacancy).subscribe({
      next: (result) => {
        this.getVacancies();
        this.closeModal();
      }, error: (error) => {
        console.log('error:', error);
      }
    })
  }

  // Capitalizar palabras (primera letra en mayúscula)
  capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  navigateToCandidates(vacancy: any): void {
    this.router.navigate(['/home/applications'], { queryParams: { titulo: vacancy.titulo } });
  }
}
