import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VacancyResponse } from '../../../../../shared/interfaces/vacancy.interface';
import { environment } from '@src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VacancyService {
  private readonly API_URL = environment.BASE_URL;

  constructor(private readonly http: HttpClient) {}

  getVacancies(): Observable<VacancyResponse> {
    return this.http.get<VacancyResponse>(`${environment.VACANCIES_API_URL}`);
  }

  applyToVacancy(vacancyId: string, applicationData: any): Observable<any> {
    return this.http.post(`${environment.VACANCIES_APPLICATIONS_API_URL}`, {
      vacancyId,
      ...applicationData,
    });
  }

  toggleFavorite(vacancyId: string): Observable<any> {
    return this.http.post(`${environment.VACANCIES_SET_FAVORITE_API_URL}`, { vacancyId });
  }

  getFavorites(): Observable<{ favorites: string[] }> {
    return this.http.get<{ favorites: string[] }>(`${environment.VACANCIES_FAVORITES_API_URL}`);
  }
}
