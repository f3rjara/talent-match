import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { Vacancy } from '../../models/vacancy.interface';

@Component({
  selector: 'app-vacancy-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    InputTextModule
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

  experienciaOptions = [
    { label: '1+ año', value: '1+ año' },
    { label: '2+ años', value: '2+ años' },
    { label: '3+ años', value: '3+ años' },
    { label: '4+ años', value: '4+ años' },
    { label: '5+ años', value: '5+ años' },
    { label: '6+ años', value: '6+ años' },
    { label: '7+ años', value: '7+ años' },
    { label: '8+ años', value: '8+ años' },
    { label: '9+ años', value: '9+ años' },
    { label: '10+ años', value: '10+ años' }
  ];

  ubicacionOptions = [
    { label: 'Remoto', value: 'Remoto' },
    { label: 'Presencial', value: 'Presencial' },
    { label: 'Híbrido', value: 'Híbrido' }
  ];

  disponibilidadOptions = [
    { label: 'Inmediata', value: 'Inmediata' },
    { label: '15 días', value: '15 días' },
    { label: '1 mes', value: '1 mes' },
    { label: '2 meses', value: '2 meses' },
    { label: '3 meses', value: '3 meses' }
  ];

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
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      experiencia: ['', Validators.required],
      ubicacion: ['', Validators.required],
      disponibilidad: ['', Validators.required]
    });

    if (this.vacancy) {
      this.populateForm();
    }
  }

  private populateForm(): void {
    if (this.vacancy) {
      this.vacancyForm.patchValue({
        titulo: this.vacancy.titulo || '',
        experiencia: this.vacancy.experiencia || '',
        ubicacion: this.vacancy.ubicacion || '',
        disponibilidad: this.vacancy.disponibilidad || ''
      });
    }
  }

  save(): void {
    if (this.vacancyForm.valid) {
      const formValue = this.vacancyForm.value;
      const updatedVacancy: Vacancy = {
        ...this.vacancy,
        ...formValue
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
    this.vacancyForm.reset();
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
      return 'Debe tener al menos 3 caracteres';
    }
    return '';
  }
}
