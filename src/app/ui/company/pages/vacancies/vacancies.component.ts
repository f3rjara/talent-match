import { CommonModule } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { VacancyService } from './services/vacancy.service';
import { VacancyFormComponent } from './components/vacancy-form/vacancy-form.component';
import { Vacancy } from './models/vacancy.interface';

@Component({
  selector: 'app-vacancies',
  imports: [CommonModule, FormsModule, ButtonModule, CardModule, DialogModule, DropdownModule, VacancyFormComponent],
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.scss'],
})
export class VacanciesComponent implements OnInit {
  vacancies: any;
  vacanciesMock = [
    { titulo: 'Frontend Developer', experiencia: '3+ años', ubicacion: 'Remoto', disponibilidad: 'Inmediata' },
    { titulo: 'Backend Developer', experiencia: '4+ años', ubicacion: 'Presencial', disponibilidad: '15 días' },
    { titulo: 'UI/UX Designer', experiencia: '2+ años', ubicacion: 'Híbrido', disponibilidad: '1 mes' },
    { titulo: 'DevOps Engineer', experiencia: '5+ años', ubicacion: 'Remoto', disponibilidad: 'Inmediata' },
    { titulo: 'Data Scientist', experiencia: '3+ años', ubicacion: 'Remoto', disponibilidad: '15 días' },
  ];
  modalVisible = false;
  isRecording = false;
  transcription = '';
  recognition: any;
  filters = {
    experiencia: '',
    ubicacion: '',
    disponibilidad: '',
  };
  filteredVacancies: any;
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

  // Propiedades para el formulario de edición
  editingVacancy: Vacancy | null = null;
  showEditModal: boolean = false;

  constructor(
    private router: Router,
    private vacancyService: VacancyService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.getVacancies();
  }

  getVacancies() {
    this.vacancyService.getVacancy().subscribe({
      next: (response) => {
        this.vacancies = response;
        this.filteredVacancies = [...this.vacancies];
      },
      error: (error) => {
        this.vacancies = this.vacanciesMock;
        this.filteredVacancies = [...this.vacancies];
      },
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
        this.ngZone.run(() => {
          this.transcription = event.results[0][0].transcript;
        });
      };

      this.recognition.onerror = (event: any) => {
        this.isRecording = false;
      };

      this.recognition.onend = () => {
        this.isRecording = false;
        if (!this.transcription) {
          alert('No se pudo capturar ninguna transcripción. Inténtalo de nuevo.');
        }
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
      const matchesExperiencia = this.filters.experiencia ? vacancy.experiencia === this.filters.experiencia : true;
      const matchesUbicacion = this.filters.ubicacion ? vacancy.ubicacion === this.filters.ubicacion : true;
      const matchesDisponibilidad = this.filters.disponibilidad
        ? vacancy.disponibilidad === this.filters.disponibilidad
        : true;

      return matchesExperiencia && matchesUbicacion && matchesDisponibilidad;
    });
  }

  saveVacancy() {
    if (!this.transcription) {
      alert('No hay transcripción disponible.');
      return;
    }

    // Convertir la transcripción a minúsculas para un análisis consistente
    const lowerCaseTranscription = this.transcription.toLowerCase();
    console.log(lowerCaseTranscription);

    // Extraer experiencia (buscar "experiencia X años")
    const experienciaMatch = lowerCaseTranscription.match(/experiencia (\d+\+? años?)/i);
    const experiencia = experienciaMatch ? experienciaMatch[1].trim() : '';

    // Extraer ubicación (buscar "ubicación palabra")
    const ubicacionMatch = lowerCaseTranscription.match(/ubicación ([a-záéíóúñ]+)/i);
    const ubicacion = ubicacionMatch ? this.capitalize(ubicacionMatch[1].trim()) : '';

    // Extraer disponibilidad (buscar "disponibilidad X")
    const disponibilidadMatch = lowerCaseTranscription.match(/disponibilidad ([\w\s]+)/i);
    const disponibilidad = disponibilidadMatch ? this.capitalize(disponibilidadMatch[1].trim()) : '';

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
      },
      error: (error) => {
        this.vacancies.push(vacancy);
        this.closeModal();
      },
    });
  }

  // Capitalizar palabras (primera letra en mayúscula)
  capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  navigateToCandidates(vacancy: any): void {
    this.router.navigate(['/home/applications'], { queryParams: { titulo: vacancy.titulo } });
  }

  // Métodos para edición de vacantes
  editVacancy(vacancy: any): void {
    this.editingVacancy = { ...vacancy };
    this.showEditModal = true;
  }

  handleSaveVacancy(updatedVacancy: Vacancy): void {
    // Si la vacante tiene ID, actualizar en el servicio
    if (updatedVacancy.id) {
      this.vacancyService.updateVacancy(updatedVacancy.id, updatedVacancy).subscribe({
        next: (_result: any) => {
          this.getVacancies();
          this.closeEditModal();
        },
        error: (_error: any) => {
          // Si falla, actualizar localmente
          const index = this.vacancies.findIndex((v: any) => v.id === updatedVacancy.id);
          if (index !== -1) {
            this.vacancies[index] = updatedVacancy;
            this.applyFilters();
          }
          this.closeEditModal();
        },
      });
    } else {
      // Si no tiene ID, buscar por título y actualizar
      const index = this.vacancies.findIndex((v: any) => v.titulo === this.editingVacancy?.titulo);
      if (index !== -1) {
        this.vacancies[index] = updatedVacancy;
        this.applyFilters();
      }
      this.closeEditModal();
    }
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingVacancy = null;
  }
}
