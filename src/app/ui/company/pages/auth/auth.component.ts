import { ChangeDetectionStrategy, Component, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { Router } from '@angular/router';
import { AuthCompanyService } from '@app/core/services/auth/auth-company.service';
import { catchError, of, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs';

const PRIME_COMPONENTS = [CardModule, InputTextModule, PasswordModule, FloatLabel, ButtonModule, MessageModule];

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, ...PRIME_COMPONENTS],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  private readonly _cdr = inject(ChangeDetectorRef);
  private readonly _router = inject(Router);
  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(AuthCompanyService);

  authForm: FormGroup;
  loading: boolean = false;
  errorMessage: string = '';

  private readonly MIN_PASSWORD_LENGTH = 6;

  constructor() {
    this.authForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(this.MIN_PASSWORD_LENGTH)]],
    });
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.authForm.invalid) {
      this.markFormAsTouched();
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      this._cdr.markForCheck();
      return;
    }

    this.loading = true;
    this._cdr.markForCheck();

    const { email, password } = this.authForm.value;

    this._authService
      .login(email, password)
      .pipe(
        catchError((error) => {
          this.handleLoginError(error);
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          this._authService.saveAuthData(response);
          this._router.navigate(['/empresa/gestion/mis-vacantes']);
        }
      });
  }

  private handleLoginError(error: any): void {
    this.loading = false;
    this.errorMessage = error.error?.message || 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
    this._cdr.markForCheck();
  }

  private markFormAsTouched(): void {
    Object.keys(this.authForm.controls).forEach((key) => {
      this.authForm.get(key)?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.authForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.authForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    if (field.errors['required']) {
      return 'Este campo es requerido.';
    }
    if (field.errors['email']) {
      return 'Por favor, ingresa un email válido.';
    }
    if (field.errors['minlength']) {
      return `Mínimo ${field.errors['minlength'].requiredLength} caracteres.`;
    }
    return '';
  }
}
