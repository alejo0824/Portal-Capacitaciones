import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Progreso, Insignia } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ProgresoService {
  private apiUrl = 'http://localhost:8081/api/progreso';
  private insigniasUrl = 'http://localhost:8081/api/insignias';

  constructor(private http: HttpClient) {}

  obtenerProgresoUsuario(usuarioId: string): Observable<Progreso[]> {
    return this.http.get<Progreso[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  obtenerCompletados(usuarioId: string): Observable<Progreso[]> {
    return this.http.get<Progreso[]>(`${this.apiUrl}/usuario/${usuarioId}/completados`);
  }

  actualizarProgreso(progreso: Progreso): Observable<Progreso> {
    return this.http.post<Progreso>(this.apiUrl, progreso);
  }

  obtenerInsigniasUsuario(usuarioId: string): Observable<Insignia[]> {
    return this.http.get<Insignia[]>(`${this.insigniasUrl}/usuario/${usuarioId}`);
  }
}