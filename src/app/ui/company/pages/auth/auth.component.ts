import { ChangeDetectionStrategy, Component, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumber } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

const PRIME_COMPONENTS = [CardModule, InputTextModule, InputNumber, PasswordModule, FloatLabel, ButtonModule];

@Component({
  selector: 'app-auth',
  imports: [FormsModule, ...PRIME_COMPONENTS],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  private readonly _cdr = inject(ChangeDetectorRef);
  private readonly _router = inject(Router);

  nitCompany: string | undefined;
  passCompany: string | undefined;
  loading: boolean = false;

  load() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
      this._cdr.markForCheck();
      this._router.navigate(['/empresa/gestion/q']);
    }, 2500);
  }
}
