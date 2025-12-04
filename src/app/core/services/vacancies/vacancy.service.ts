import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VacancyService {
  private readonly API_URL = environment.VACANCIES_API_URL;

  constructor(private http: HttpClient) {}

  getVacancies(): Observable<any> {
    return this.http.get(this.API_URL, { params: { page: '1', limit: '100' } });
  }

  getVacancyById(id:number): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}`);
  }

  createVacancy(data: any): Observable<any> {
    return this.http.post(this.API_URL, data);
  }

  updateVacancy(id: string, data: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, data);
  }

  deleteVacancy(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
