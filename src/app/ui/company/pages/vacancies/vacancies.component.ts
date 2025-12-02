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
import { VacancyDetailDialogComponent } from './components/vacancy-detail-dialog/vacancy-detail-dialog.component';
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
    VacancyDetailDialogComponent,
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
  vacanciesMock: Vacancy[] = [
    {
      id: 'mock-1',
      title: "Senior Software Engineer",
      experienceRequired: "5 years in software development",
      location: "Remote / Pasto, Nariño",
      availability: "Full-time, immediate start",
      description: "Buscamos un Ingeniero de Software Senior con amplia experiencia en desarrollo web full-stack. El candidato ideal tendrá sólidos conocimientos en JavaScript/TypeScript, frameworks modernos como React y Node.js, y experiencia liderando equipos técnicos.",
      matchingCriteria: {
        technicalSkills: {
          required: ["JavaScript", "TypeScript", "Node.js", "Git"],
          preferred: ["React", "NestJS", "MongoDB", "Docker", "AWS"],
          weight: 0.4
        },
        behavioralCompetencies: {
          required: ["Leadership", "Communication", "Teamwork", "Problem Solving"],
          weight: 0.3
        },
        cognitiveSkills: {
          required: ["Problem Solving", "Analytical Thinking", "Creativity", "Critical Thinking"],
          weight: 0.3
        }
      },
      status: "published"
    },
    {
      id: 'mock-2',
      title: "Practicante de Contabilidad",
      experienceRequired: "Estudiante de últimos semestres de Contaduría Pública",
      location: "Pasto, Nariño",
      availability: "Tiempo completo (prácticas universitarias)",
      description: "Buscamos un estudiante de Contaduría Pública en últimos semestres para realizar prácticas profesionales en nuestro departamento contable. El practicante apoyará en conciliaciones bancarias, depuración de cuentas y preparación de informes financieros.",
      matchingCriteria: {
        technicalSkills: {
          required: ["Contabilidad general", "Manejo de Excel", "Normativa NIIF"],
          preferred: ["Manejo de software contable", "Análisis financiero", "Power BI"],
          weight: 0.4
        },
        behavioralCompetencies: {
          required: ["Responsabilidad", "Orden y precisión", "Integridad", "Proactividad"],
          weight: 0.3
        },
        cognitiveSkills: {
          required: ["Pensamiento numérico", "Atención al detalle", "Capacidad analítica", "Organización"],
          weight: 0.3
        }
      },
      status: "published"
    },
    {
      id: 'mock-3',
      title: "Diseñador UX/UI",
      experienceRequired: "3+ años en diseño de interfaces",
      location: "Híbrido - Pasto, Nariño",
      availability: "Tiempo completo",
      description: "Buscamos un Diseñador UX/UI creativo y orientado al usuario para nuestro equipo de producto. Serás responsable de diseñar experiencias intuitivas y atractivas para nuestras aplicaciones web y móviles.",
      matchingCriteria: {
        technicalSkills: {
          required: ["Figma", "Adobe XD", "Prototipado", "Design Systems"],
          preferred: ["HTML/CSS", "After Effects", "Illustrator"],
          weight: 0.4
        },
        behavioralCompetencies: {
          required: ["Creatividad", "Comunicación", "Empatía", "Colaboración"],
          weight: 0.3
        },
        cognitiveSkills: {
          required: ["Pensamiento visual", "Resolución de problemas", "Atención al detalle"],
          weight: 0.3
        }
      },
      status: "draft"
    }
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

  // Propiedades para el diálogo de detalles
  selectedVacancy: Vacancy | null = null;
  showDetailDialog: boolean = false;

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
    console.log('🚀 ngOnInit - Inicializando componente de vacantes');
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
        console.log('✅ Vacantes cargadas desde API:', this.vacancies);
        console.log('✅ Vacantes filtradas:', this.filteredVacancies);
      },
      error: (error) => {
        console.warn('⚠️ Error al cargar vacantes desde API, usando mock data:', error);
        this.vacancies = this.vacanciesMock;
        // Asegurar que tengan IDs
        this.vacancies.forEach((v: any, index: number) => {
          if (!v.id) v.id = `mock-${index}`;
        });
        this.filteredVacancies = [...this.vacancies];
        console.log('✅ Vacantes mock cargadas:', this.vacancies);
        console.log('✅ Total de vacantes:', this.vacancies.length);
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

    const lowerCaseTranscription = this.transcription.toLowerCase();
    console.log('📝 Transcripción recibida:', lowerCaseTranscription);

    // Lista de todas las palabras clave
    const keywords = ['experiencia', 'ubicación', 'ubicacion', 'disponibilidad', 'descripción', 'descripcion', 'skills', 'habilidades'];
    
    // Extraer título (todo antes de la primera palabra clave)
    const tituloEndIndex = Math.min(
      ...keywords
        .map((key) => lowerCaseTranscription.indexOf(key))
        .filter((index) => index > -1)
    );
    const titulo = tituloEndIndex > 0 
      ? this.capitalize(lowerCaseTranscription.slice(0, tituloEndIndex).trim()) 
      : this.capitalize(lowerCaseTranscription.trim());

    // Validar título obligatorio
    if (!titulo) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Título requerido',
        detail: 'Por favor, menciona al menos el título del cargo.',
        life: 5000
      });
      return;
    }

    // Extraer campos opcionales con regex mejorado
    const experiencia = this.extractField(lowerCaseTranscription, /experiencia\s+([^,]+?)(?=\s+(?:ubicaci[oó]n|disponibilidad|descripci[oó]n|skills|habilidades)|$)/i) || '';
    const ubicacion = this.extractField(lowerCaseTranscription, /ubicaci[oó]n\s+([^,]+?)(?=\s+(?:experiencia|disponibilidad|descripci[oó]n|skills|habilidades)|$)/i) || '';
    const disponibilidad = this.extractField(lowerCaseTranscription, /disponibilidad\s+([^,]+?)(?=\s+(?:experiencia|ubicaci[oó]n|descripci[oó]n|skills|habilidades)|$)/i) || '';
    const descripcion = this.extractField(lowerCaseTranscription, /descripci[oó]n\s+([^,]+?)(?=\s+(?:experiencia|ubicaci[oó]n|disponibilidad|skills|habilidades)|$)/i) || '';
    
    // Extraer skills (separadas por espacios, no por comas)
    const skillsMatch = lowerCaseTranscription.match(/(skills|habilidades):?\s+(.+?)(?=\s+(?:experiencia|ubicaci[oó]n|disponibilidad|descripci[oó]n)|$)/i);
    const skillsText = skillsMatch ? skillsMatch[2].trim() : '';
    const skillsArray = skillsText ? skillsText.split(/\s+/).map(s => s.trim()).filter(s => s) : [];

    // Crear objeto de vacante
    const newVacancy: any = {
      title: titulo,
      experienceRequired: experiencia,
      location: ubicacion,
      availability: disponibilidad,
      description: descripcion || `Vacante para ${titulo}.`,
      status: 'draft',
      matchingCriteria: {
        technicalSkills: { 
          required: skillsArray, 
          preferred: [], 
          weight: 0.4 
        },
        behavioralCompetencies: { required: [], weight: 0.3 },
        cognitiveSkills: { required: [], weight: 0.3 }
      }
    };

    // Preparar lista de campos capturados para el toast
    const capturedFields = ['Título'];
    if (experiencia) capturedFields.push('Experiencia');
    if (ubicacion) capturedFields.push('Ubicación');
    if (disponibilidad) capturedFields.push('Disponibilidad');
    if (descripcion) capturedFields.push('Descripción');
    if (skillsArray.length > 0) capturedFields.push(`${skillsArray.length} Skills`);

    console.log('✅ Campos detectados:', capturedFields);

    // Mostrar toast informativo
    this.messageService.add({
      severity: 'info',
      summary: 'Campos detectados',
      detail: capturedFields.join(', '),
      life: 3000
    });

    // Crear la vacante
    this.createVacancy(newVacancy);
  }

  // Método auxiliar para extraer campos con regex
  private extractField(text: string, regex: RegExp): string {
    const match = text.match(regex);
    if (match && match[1]) {
      return this.capitalize(match[1].trim());
    }
    return '';
  }

  createVacancy(vacancy: any) {
    this.vacancyService.createVacancy(vacancy).subscribe({
      next: (_result: any) => {
        console.log('✅ Respuesta de creación (Voz) desde API:', _result);
        
        // Si la API devuelve el objeto con ID, usarlo.
        // Si no, usar el objeto local con un ID temporal.
        const createdVacancy = (_result && _result.id) ? _result : { ...vacancy, id: 'voice-' + Date.now() };
        
        this.vacancies.push(createdVacancy);
        this.vacancies = [...this.vacancies]; // Forzar cambio de referencia
        this.filteredVacancies = [...this.vacancies];
        
        this.closeModal();
        this.messageService.add({
          severity: 'success',
          summary: 'Vacante creada',
          detail: `La vacante "${vacancy.title}" ha sido creada exitosamente.`,
          life: 3000
        });
      },
      error: (_error: any) => {
        // Fallback local
        const createdVacancy = { ...vacancy, id: 'voice-local-' + Date.now() };
        
        this.vacancies.push(createdVacancy);
        this.vacancies = [...this.vacancies];
        this.filteredVacancies = [...this.vacancies];
        
        this.closeModal();
        this.messageService.add({
          severity: 'info',
          summary: 'Vacante agregada localmente',
          detail: `La vacante "${vacancy.title}" ha sido agregada (sin conexión).`,
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

  // Métodos para visualización de detalles
  viewVacancyDetail(vacancy: Vacancy): void {
    this.selectedVacancy = vacancy;
    this.showDetailDialog = true;
  }

  closeDetailDialog(): void {
    this.showDetailDialog = false;
    this.selectedVacancy = null;
  }

  // Métodos para edición de vacantes
  editVacancy(vacancy: any): void {
    this.editingVacancy = { ...vacancy };
    this.showEditModal = true;
  }

  handleSaveVacancy(updatedVacancy: Vacancy): void {
    console.log('📝 handleSaveVacancy llamado con:', updatedVacancy);
    
    if (updatedVacancy.id) {
      // Editando vacante existente
      console.log('✏️ Editando vacante existente con ID:', updatedVacancy.id);
      this.vacancyService.updateVacancy(updatedVacancy.id!, updatedVacancy).subscribe({
        next: (_response: any) => {
          const index = this.vacancies.findIndex((v: any) => v.id === updatedVacancy.id);
          if (index !== -1) {
            this.vacancies[index] = updatedVacancy;
            this.filteredVacancies = [...this.vacancies];
            console.log('✅ Vacante actualizada en índice:', index);
            console.log('✅ Array de vacantes después de actualizar:', this.vacancies);
          }
          this.closeEditModal();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `La vacante "${updatedVacancy.title}" ha sido actualizada correctamente.`,
            life: 3000
          });
        },
        error: (_error: any) => {
          console.warn('⚠️ Error al actualizar en API, actualizando localmente');
          const index = this.vacancies.findIndex((v: any) => v.id === updatedVacancy.id);
          if (index !== -1) {
            this.vacancies[index] = updatedVacancy;
            this.filteredVacancies = [...this.vacancies];
          }
          this.closeEditModal();
          this.messageService.add({
            severity: 'warn',
            summary: 'Actualización local',
            detail: `La vacante "${updatedVacancy.title}" ha sido actualizada localmente (sin conexión).`,
            life: 3000
          });
        },
      });
    } else {
      // Creando nueva vacante
      console.log('➕ Creando nueva vacante');
      console.log('📊 Estado antes de agregar - Total vacantes:', this.vacancies?.length || 0);
      
      this.vacancyService.createVacancy(updatedVacancy).subscribe({
        next: (_response: any) => {
          console.log('✅ Respuesta de creación desde API:', _response);
          
          // Si la API devuelve el objeto con ID, usarlo.
          // Si no, usar el objeto local con un ID temporal para asegurar que se muestre.
          const createdVacancy = (_response && _response.id) ? _response : { ...updatedVacancy, id: 'local-' + Date.now() };
          
          this.vacancies.push(createdVacancy);
          this.vacancies = [...this.vacancies]; // Forzar cambio de referencia
          this.filteredVacancies = [...this.vacancies];
          
          this.closeEditModal();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `La vacante "${updatedVacancy.title}" ha sido creada correctamente.`,
            life: 3000
          });
        },
        error: (_error: any) => {
          console.warn('⚠️ Error al crear en API, agregando localmente:', _error);
          
          // Generar ID temporal para manejo local
          const newVacancyWithId = { 
            ...updatedVacancy, 
            id: 'local-' + Date.now() 
          };
          
          this.vacancies.push(newVacancyWithId);
          // Forzar actualización de referencia para detección de cambios
          this.vacancies = [...this.vacancies];
          this.filteredVacancies = [...this.vacancies];
          
          console.log('✅ Vacante agregada localmente con ID:', newVacancyWithId.id);
          console.log('📊 Estado después de agregar - Total vacantes:', this.vacancies.length);
          
          this.closeEditModal();
          this.messageService.add({
            severity: 'info',
            summary: 'Vacante agregada localmente',
            detail: `La vacante "${updatedVacancy.title}" ha sido agregada (sin conexión).`,
            life: 3000
          });
        },
      });
    }
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingVacancy = null;
  }

  deleteVacancy(vacancy: any): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar la vacante "${vacancy.titulo || vacancy.title}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        // Guardar información para undo
        const index = this.vacancies.findIndex((v: any) => 
          v.id ? v.id === vacancy.id : (v.title === vacancy.title || v.titulo === vacancy.titulo)
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
          detail: `"${vacancy.titulo || vacancy.title}" ha sido eliminada. Tienes 5 segundos para deshacer.`,
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
        detail: `La vacante "${this.deletedVacancy.title || this.deletedVacancy.titulo}" ha sido restaurada.`,
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
              detail: `La vacante "${this.deletedVacancy?.title || this.deletedVacancy?.titulo}" ha sido eliminada permanentemente.`,
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
