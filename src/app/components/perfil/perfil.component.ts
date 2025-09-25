// src/app/components/perfil/perfil.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProgresoService } from '../../services/progreso.service';
import { Usuario, Insignia, Progreso } from '../../models/models';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-dark bg-primary">
      <div class="container-fluid">
        <span class="navbar-brand">🎓 Portal de Capacitaciones</span>
        <div>
          <button class="btn btn-sm btn-outline-light me-2" routerLink="/dashboard">
            ← Dashboard
          </button>
          <button class="btn btn-sm btn-outline-light" (click)="logout()">
            🚪 Salir
          </button>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <!-- Información del Usuario -->
      <div class="row mb-4">
        <div class="col-md-12">
          <div class="card shadow-sm">
            <div class="card-body text-center">
              <div class="avatar-circle mb-3">
                👤
              </div>
              <h3>{{ currentUser?.nombreCompleto }}</h3>
              <p class="text-muted">@{{ currentUser?.username }}</p>
              <p class="text-muted">✉️ {{ currentUser?.email }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="card text-center bg-primary text-white">
            <div class="card-body">
              <h2>{{ cursosCompletados }}</h2>
              <p>Cursos Completados</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-center bg-warning text-white">
            <div class="card-body">
              <h2>{{ cursosIniciados }}</h2>
              <p>En Progreso</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-center bg-success text-white">
            <div class="card-body">
              <h2>{{ insignias.length }}</h2>
              <p>Insignias Obtenidas</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Insignias Obtenidas -->
      <div class="row mb-4">
        <div class="col-md-12">
          <h4 class="mb-3">🏅 Mis Insignias</h4>
          <div *ngIf="insignias.length === 0" class="alert alert-info">
            Aún no has obtenido insignias. ¡Completa cursos para ganar tus primeras insignias!
          </div>
          
          <div class="row">
            <div 
              *ngFor="let insignia of insignias" 
              class="col-md-3 mb-3"
            >
              <div class="card text-center shadow-sm insignia-card">
                <div class="card-body">
                  <div class="insignia-icon">
                    {{ insignia.imagen || '🏆' }}
                  </div>
                  <h6 class="mt-2">{{ insignia.nombreCurso }}</h6>
                  <small class="text-muted">
                    {{ formatFecha(insignia.fechaObtencion) }}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Historial de Cursos -->
      <div class="row">
        <div class="col-md-12">
          <h4 class="mb-3">📚 Historial de Cursos</h4>
          <div class="card">
            <div class="card-body">
              <div *ngIf="progresos.length === 0" class="text-center text-muted py-4">
                No has iniciado ningún curso todavía
              </div>

              <div class="table-responsive" *ngIf="progresos.length > 0">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Curso</th>
                      <th>Estado</th>
                      <th>Fecha Inicio</th>
                      <th>Fecha Completado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let progreso of progresos">
                      <td>{{ getCursoNombre(progreso.cursoId) }}</td>
                      <td>
                        <span 
                          class="badge"
                          [class.bg-success]="progreso.estado === 'completado'"
                          [class.bg-warning]="progreso.estado === 'iniciado'"
                        >
                          {{ progreso.estado === 'completado' ? '✓ Completado' : '⏳ En progreso' }}
                        </span>
                      </td>
                      <td>{{ formatFecha(progreso.fechaInicio) }}</td>
                      <td>
                        {{ progreso.fechaCompletado ? formatFecha(progreso.fechaCompletado) : '-' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .avatar-circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      margin: 0 auto;
    }
    .insignia-card {
      transition: transform 0.2s;
    }
    .insignia-card:hover {
      transform: scale(1.05);
    }
    .insignia-icon {
      font-size: 64px;
      margin: 20px 0;
    }
  `]
})
export class PerfilComponent implements OnInit {
  currentUser: Usuario | null = null;
  insignias: Insignia[] = [];
  progresos: Progreso[] = [];
  cursosCompletados = 0;
  cursosIniciados = 0;

  constructor(
    private authService: AuthService,
    private progresoService: ProgresoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.cargarDatos();
  }

  cargarDatos(): void {
    if (!this.currentUser?.id) return;

    // Cargar insignias
    this.progresoService.obtenerInsigniasUsuario(this.currentUser.id).subscribe({
      next: (insignias) => {
        this.insignias = insignias;
      },
      error: (error) => console.error('Error cargando insignias:', error)
    });

    // Cargar progresos
    this.progresoService.obtenerProgresoUsuario(this.currentUser.id).subscribe({
      next: (progresos) => {
        this.progresos = progresos;
        this.cursosCompletados = progresos.filter(p => p.estado === 'completado').length;
        this.cursosIniciados = progresos.filter(p => p.estado === 'iniciado').length;
      },
      error: (error) => console.error('Error cargando progresos:', error)
    });
  }

  getCursoNombre(cursoId: string): string {
    const insignia = this.insignias.find(i => i.cursoId === cursoId);
    return insignia?.nombreCurso || 'Curso desconocido';
  }

  formatFecha(fecha: any): string {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}