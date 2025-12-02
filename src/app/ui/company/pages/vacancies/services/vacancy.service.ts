import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VacancyService {
  constructor(private http: HttpClient) {}

  getVacancy(): Observable<any> {
    return this.http.get(`http://localhost:3000/api/vacancy`);
  }

  createVacancy(data: any): Observable<any> {
    return this.http.post(`http://localhost:3000/api/vacancy`, data);
  }

  updateVacancy(id: string, data: any): Observable<any> {
    return this.http.put(`http://localhost:3000/api/vacancy/${id}`, data);
  }

  deleteVacancy(id: string): Observable<any> {
    return this.http.delete(`http://localhost:3000/api/vacancy/${id}`);
  }
}
