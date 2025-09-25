import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curso } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private apiUrl = 'http://localhost:8081/api/cursos';

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl);
  }

  obtenerPorModulo(modulo: string): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/modulo/${modulo}`);
  }

  crearCurso(curso: Curso): Observable<Curso> {
    return this.http.post<Curso>(this.apiUrl, curso);
  }
}