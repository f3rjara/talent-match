import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule} from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { ChipsModule } from 'primeng/chips';
import { TabViewModule } from 'primeng/tabview';
import { Vacancy } from '../../models/vacancy.interface';

@Component({
  selector: 'app-vacancy-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    InputTextarea,
    ChipsModule,
    TabViewModule
  ],
  templateUrl: './vacancy-form.component.html',
  styleUrls: ['./vacancy-form.component.scss']
})
export class VacancyFormComponent implements OnInit, OnChanges {
  @Input() vacancy: Vacancy | null = null;
  @Input() isVisible: boolean = false;
  @Output() onSave = new EventEmitter<Vacancy>();
  @Output() onCancel = new EventEmitter<void>();

  vacancyForm!: FormGroup;

  statusOptions = [
    { label: 'Borrador', value: 'draft' },
    { label: 'Publicada', value: 'published' },
    { label: 'Cerrada', value: 'closed' }
  ];

  // Arrays para chips
  requiredTechnicalSkills: string[] = [];
  preferredTechnicalSkills: string[] = [];
  behavioralCompetencies: string[] = [];
  cognitiveSkills: string[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vacancy'] && this.vacancy && this.vacancyForm) {
      this.populateForm();
    }
  }

  private initForm(): void {
    this.vacancyForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      experienceRequired: [''],
      location: [''],
      availability: [''],
      description: [''],
      status: ['draft'],
      technicalSkillsWeight: [0.4, [Validators.min(0), Validators.max(1)]],
      behavioralWeight: [0.3, [Validators.min(0), Validators.max(1)]],
      cognitiveWeight: [0.3, [Validators.min(0), Validators.max(1)]]
    });

    if (this.vacancy) {
      this.populateForm();
    }
  }

  private populateForm(): void {
    if (this.vacancy) {
      // Poblar campos básicos
      this.vacancyForm.patchValue({
        title: this.vacancy.title || this.vacancy.titulo || '',
        experienceRequired: this.vacancy.experienceRequired || this.vacancy.experiencia || '',
        location: this.vacancy.location || this.vacancy.ubicacion || '',
        availability: this.vacancy.availability || this.vacancy.disponibilidad || '',
        description: this.vacancy.description || '',
        status: this.vacancy.status || 'draft'
      });

      // Poblar skills de matchingCriteria si existen
      if (this.vacancy.matchingCriteria) {
        this.requiredTechnicalSkills = [...(this.vacancy.matchingCriteria.technicalSkills?.required || [])];
        this.preferredTechnicalSkills = [...(this.vacancy.matchingCriteria.technicalSkills?.preferred || [])];
        this.behavioralCompetencies = [...(this.vacancy.matchingCriteria.behavioralCompetencies?.required || [])];
        this.cognitiveSkills = [...(this.vacancy.matchingCriteria.cognitiveSkills?.required || [])];

        this.vacancyForm.patchValue({
          technicalSkillsWeight: this.vacancy.matchingCriteria.technicalSkills?.weight || 0.4,
          behavioralWeight: this.vacancy.matchingCriteria.behavioralCompetencies?.weight || 0.3,
          cognitiveWeight: this.vacancy.matchingCriteria.cognitiveSkills?.weight || 0.3
        });
      }
    }
  }

  fillMockData(): void {
    this.vacancyForm.patchValue({
      title: 'Full Stack Developer',
      experienceRequired: '3+ years with Angular and Node.js',
      location: 'Remote',
      availability: 'Immediate',
      description: 'We are looking for a skilled Full Stack Developer to join our dynamic team. You will be working on cutting-edge technologies and building scalable applications.',
      status: 'published',
      technicalSkillsWeight: 0.5,
      behavioralWeight: 0.3,
      cognitiveWeight: 0.2
    });
    this.requiredTechnicalSkills = ['Angular', 'TypeScript', 'Node.js'];
    this.preferredTechnicalSkills = ['MongoDB', 'AWS', 'Docker'];
    this.behavioralCompetencies = ['Teamwork', 'Communication', 'Problem Solving'];
    this.cognitiveSkills = ['Analytical Thinking', 'Creativity'];
  }

  save(): void {
    if (this.vacancyForm.valid) {
      const formValue = this.vacancyForm.value;
      
      const updatedVacancy: Vacancy = {
        ...this.vacancy,
        id: this.vacancy?.id,
        title: formValue.title,
        experienceRequired: formValue.experienceRequired,
        location: formValue.location,
        availability: formValue.availability,
        description: formValue.description,
        status: formValue.status,
        matchingCriteria: {
          technicalSkills: {
            required: this.requiredTechnicalSkills,
            preferred: this.preferredTechnicalSkills,
            weight: formValue.technicalSkillsWeight
          },
          behavioralCompetencies: {
            required: this.behavioralCompetencies,
            weight: formValue.behavioralWeight
          },
          cognitiveSkills: {
            required: this.cognitiveSkills,
            weight: formValue.cognitiveWeight
          }
        }
      };
      
      this.onSave.emit(updatedVacancy);
      this.resetForm();
    } else {
      this.markFormGroupTouched(this.vacancyForm);
    }
  }

  cancel(): void {
    this.resetForm();
    this.onCancel.emit();
  }

  private resetForm(): void {
    this.vacancyForm.reset({
      status: 'draft',
      technicalSkillsWeight: 0.4,
      behavioralWeight: 0.3,
      cognitiveWeight: 0.3
    });
    this.requiredTechnicalSkills = [];
    this.preferredTechnicalSkills = [];
    this.behavioralCompetencies = [];
    this.cognitiveSkills = [];
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.vacancyForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.vacancyForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Debe tener al menos ${minLength} caracteres`;
    }
    if (field?.hasError('min') || field?.hasError('max')) {
      return 'El peso debe estar entre 0 y 1';
    }
    return '';
  }
}
