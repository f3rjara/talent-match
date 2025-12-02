import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { AuthRequest, AuthResponse, RefreshTokenResponse } from '../../models/auth/auth.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthCompanyService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _tokenService = inject(TokenService);

  login(email: string, password: string): Observable<AuthResponse> {
    const url = environment.AUTH_API_LOGIN_URL;
    const body: AuthRequest = { email, password };
    return this._httpClient.post<AuthResponse>(url, body);
  }

  logout(): Observable<void> {
    const url = environment.AUTH_API_LOGOUT_URL;
    return this._httpClient.post<void>(url, {});
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    const url = environment.AUTH_API_REFRESH_URL;
    return this._httpClient.post<RefreshTokenResponse>(url, {});
  }

  // Delegar gestión de tokens al TokenService
  saveAuthData(authResponse: AuthResponse): void {
    this._tokenService.saveAuthData(authResponse);
  }

  clearAuthData(): void {
    this._tokenService.clearAuthData();
  }

  isAuthenticated(): boolean {
    return this._tokenService.isAuthenticated();
  }
}
