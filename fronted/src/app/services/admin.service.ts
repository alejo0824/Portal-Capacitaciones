import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario, Curso, AdminStats, UsuarioProgreso } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8081/api/admin';

  constructor(private http: HttpClient) {}

  // Usuarios
  obtenerTodosUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`);
  }

  obtenerProgresoUsuario(usuarioId: string): Observable<UsuarioProgreso> {
    return this.http.get<UsuarioProgreso>(`${this.apiUrl}/usuarios/${usuarioId}/progreso`);
  }

  // Cursos
  crearCurso(curso: Curso): Observable<Curso> {
    return this.http.post<Curso>(`${this.apiUrl}/cursos`, curso);
  }

  actualizarCurso(id: string, curso: Curso): Observable<Curso> {
    return this.http.put<Curso>(`${this.apiUrl}/cursos/${id}`, curso);
  }

  eliminarCurso(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cursos/${id}`);
  }

  // Estadísticas
  obtenerEstadisticas(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/estadisticas`);
  }
}