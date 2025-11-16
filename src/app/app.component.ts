import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
@Component({
  selector: 'app-root',
  template: '<router-outlet />',
  imports: [RouterModule],
})
export class AppComponent implements OnInit {
  private readonly _primengConfig: PrimeNGConfig = inject(PrimeNGConfig);
  ngOnInit(): void {
    this._primengConfig.ripple = true;
  }
}
