import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VacancyService {
  constructor(private readonly http: HttpClient) {}

  getVacancy(): Observable<any> {
    return this.http.get(`http://localhost:3000/api/vacancy`);
  }

  createVacancy(data: any): Observable<any> {
    return this.http.post(`http://localhost:3000/api/vacancy`, data);
  }
}
