import { Injectable } from '@angular/core';
import { AuthResponse } from '../../models/auth/auth.model';
import { User } from '../../models/user/user.model';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';

  saveAuthData(authResponse: AuthResponse): void {
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, authResponse.accessToken);
    sessionStorage.setItem(this.REFRESH_TOKEN_KEY, authResponse.refreshToken);
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getUserData(): User | null {
    const userData = sessionStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  clearAuthData(): void {
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}
