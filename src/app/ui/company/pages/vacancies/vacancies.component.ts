import { CommonModule } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { VacancyService } from './services/vacancy.service';
import { VacancyFormComponent } from './components/vacancy-form/vacancy-form.component';
import { Vacancy } from './models/vacancy.interface';

@Component({
  selector: 'app-vacancies',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    DialogModule,
    DropdownModule,
    VacancyFormComponent,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.scss'],
  animations: [
    trigger('fadeOut', [
      state('visible', style({ opacity: 1, transform: 'translateX(0)' })),
      state('hidden', style({ opacity: 0, transform: 'translateX(-100px)' })),
      transition('visible => hidden', animate('300ms ease-out'))
    ])
  ]
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

  // Propiedades para el sistema undo/deshacer
  deletedVacancy: Vacancy | null = null;
  deletedVacancyIndex: number = -1;
  undoTimeout: any = null;

  // Estado de animación para cada vacante
  vacancyStates: Map<string, string> = new Map();

  constructor(
    private router: Router,
    private vacancyService: VacancyService,
    private ngZone: NgZone,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getVacancies();
  }

  // Getters para contador de vacantes
  get totalVacancies(): number {
    return this.vacancies ? this.vacancies.length : 0;
  }

  get filteredVacanciesCount(): number {
    return this.filteredVacancies ? this.filteredVacancies.length : 0;
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
      this.messageService.add({
        severity: 'warn',
        summary: 'Formato incorrecto',
        detail: 'Por favor, hable en el formato: "Título experiencia X años ubicación Y disponibilidad Z".',
        life: 5000
      });
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
    this.vacancies.push(newVacancy);
    this.closeModal();
    //this.createVacancy(newVacancy);
  }

  createVacancy(vacancy: any) {
    this.vacancyService.createVacancy(vacancy).subscribe({
      next: (_result: any) => {
        this.getVacancies();
        this.closeModal();
        this.messageService.add({
          severity: 'success',
          summary: 'Vacante creada',
          detail: `La vacante "${vacancy.titulo}" ha sido creada exitosamente.`,
          life: 3000
        });
      },
      error: (_error: any) => {
        this.vacancies.push(vacancy);
        this.closeModal();
        this.messageService.add({
          severity: 'info',
          summary: 'Vacante agregada localmente',
          detail: `La vacante "${vacancy.titulo}" ha sido agregada (sin conexión).`,
          life: 3000
        });
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
          this.messageService.add({
            severity: 'success',
            summary: 'Vacante actualizada',
            detail: `La vacante "${updatedVacancy.titulo}" ha sido actualizada exitosamente.`,
            life: 3000
          });
        },
        error: (_error: any) => {
          // Si falla, actualizar localmente
          const index = this.vacancies.findIndex((v: any) => v.id === updatedVacancy.id);
          if (index !== -1) {
            this.vacancies[index] = updatedVacancy;
            this.applyFilters();
          }
          this.closeEditModal();
          this.messageService.add({
            severity: 'warn',
            summary: 'Actualización local',
            detail: 'La vacante se actualizó localmente (sin conexión).',
            life: 3000
          });
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
      this.messageService.add({
        severity: 'success',
        summary: 'Vacante actualizada',
        detail: `La vacante "${updatedVacancy.titulo}" ha sido actualizada.`,
        life: 3000
      });
    }
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingVacancy = null;
  }

  deleteVacancy(vacancy: any): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar la vacante "${vacancy.titulo}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        // Guardar información para undo
        const index = this.vacancies.findIndex((v: any) => 
          v.id ? v.id === vacancy.id : v.titulo === vacancy.titulo
        );
        this.deletedVacancy = { ...vacancy };
        this.deletedVacancyIndex = index;

        // Eliminar de la vista inmediatamente
        if (index !== -1) {
          this.vacancies.splice(index, 1);
          this.applyFilters();
        }

        // Mostrar toast con opción de deshacer
        this.messageService.add({
          severity: 'info',
          summary: 'Vacante eliminada',
          detail: `"${vacancy.titulo}" ha sido eliminada. Tienes 5 segundos para deshacer.`,
          sticky: true,
          key: 'deleteToast',
          icon: 'pi pi-trash',
          data: { vacancy }
        });

        // Configurar timeout para confirmar eliminación
        this.undoTimeout = setTimeout(() => {
          this.confirmDelete();
        }, 5000);
      }
    });
  }

  undoDelete(): void {
    if (this.deletedVacancy && this.deletedVacancyIndex !== -1) {
      // Cancelar timeout
      if (this.undoTimeout) {
        clearTimeout(this.undoTimeout);
        this.undoTimeout = null;
      }

      // Restaurar vacante
      this.vacancies.splice(this.deletedVacancyIndex, 0, this.deletedVacancy);
      this.applyFilters();

      // Limpiar toast
      this.messageService.clear('deleteToast');

      // Mostrar confirmación
      this.messageService.add({
        severity: 'success',
        summary: 'Eliminación cancelada',
        detail: `La vacante "${this.deletedVacancy.titulo}" ha sido restaurada.`,
        life: 3000
      });

      // Limpiar variables
      this.deletedVacancy = null;
      this.deletedVacancyIndex = -1;
    }
  }

  confirmDelete(): void {
    if (this.deletedVacancy) {
      // Limpiar toast
      this.messageService.clear('deleteToast');

      // Si tiene ID, eliminar del servidor
      if (this.deletedVacancy.id) {
        this.vacancyService.deleteVacancy(this.deletedVacancy.id).subscribe({
          next: (_result: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminación confirmada',
              detail: `La vacante "${this.deletedVacancy?.titulo}" ha sido eliminada permanentemente.`,
              life: 3000
            });
          },
          error: (_error: any) => {
            // Ya fue eliminada localmente, solo mostrar mensaje
            this.messageService.add({
              severity: 'info',
              summary: 'Eliminación local',
              detail: 'La vacante fue eliminada localmente (sin conexión).',
              life: 3000
            });
          },
        });
      }

      // Limpiar variables
      this.deletedVacancy = null;
      this.deletedVacancyIndex = -1;
      this.undoTimeout = null;
    }
  }
}
