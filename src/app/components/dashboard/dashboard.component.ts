// src/app/components/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CursoService } from '../../services/curso.service';
import { ProgresoService } from '../../services/progreso.service';
import { Usuario, Curso, Progreso } from '../../models/models';

interface ModuloInfo {
  nombre: string;
  icono: string;
  color: string;
  cursos: Curso[];
  completados: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-dark bg-primary">
      <div class="container-fluid">
        <span class="navbar-brand">🎓 Portal de Capacitaciones</span>
        <div class="d-flex align-items-center">
          <span class="text-white me-3">¡Hola, {{ currentUser?.nombreCompleto }}!</span>
          <button class="btn btn-sm btn-outline-light me-2" routerLink="/perfil">
            👤 Mi Perfil
          </button>
          <button class="btn btn-sm btn-outline-light" (click)="logout()">
            🚪 Salir
          </button>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <!-- Resumen de Progreso -->
      <div class="row mb-4">
        <div class="col-md-12">
          <div class="card bg-light">
            <div class="card-body">
              <h5>📊 Tu Progreso General</h5>
              <div class="row text-center mt-3">
                <div class="col-md-4">
                  <h3 class="text-primary">{{ totalCursos }}</h3>
                  <p class="text-muted">Cursos Disponibles</p>
                </div>
                <div class="col-md-4">
                  <h3 class="text-warning">{{ cursosIniciados }}</h3>
                  <p class="text-muted">En Progreso</p>
                </div>
                <div class="col-md-4">
                  <h3 class="text-success">{{ cursosCompletados }}</h3>
                  <p class="text-muted">Completados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Módulos de Capacitación -->
      <h4 class="mb-3">📚 Módulos de Capacitación</h4>
      <div class="row">
        <div 
          *ngFor="let modulo of modulos" 
          class="col-md-6 mb-4"
        >
          <div class="card h-100 shadow-sm hover-card" [style.border-left]="'4px solid ' + modulo.color">
            <div class="card-body">
              <h5 class="card-title">
                {{ modulo.icono }} {{ modulo.nombre }}
              </h5>
              <p class="text-muted mb-3">{{ modulo.cursos.length }} cursos disponibles</p>
              
              <div class="progress mb-3" style="height: 25px;">
                <div 
                  class="progress-bar" 
                  [style.width.%]="getProgresoPorcentaje(modulo)"
                  [style.background-color]="modulo.color"
                >
                  {{ getProgresoPorcentaje(modulo) }}%
                </div>
              </div>

              <button 
                class="btn btn-sm w-100"
                [style.background-color]="modulo.color"
                [style.color]="'white'"
                (click)="verModulo(modulo.nombre)"
              >
                Ver Cursos
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista de Cursos del Módulo Seleccionado -->
      <div *ngIf="moduloSeleccionado" class="mt-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4>📖 Cursos de {{ moduloSeleccionado }}</h4>
          <button class="btn btn-sm btn-secondary" (click)="cerrarModulo()">
            ← Volver
          </button>
        </div>

        <div class="row">
          <div 
            *ngFor="let curso of cursosModulo" 
            class="col-md-6 mb-3"
          >
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">{{ curso.nombre }}</h5>
                <p class="card-text text-muted">{{ curso.descripcion }}</p>
                
                <div class="d-flex justify-content-between align-items-center">
                  <span 
                    class="badge"
                    [class.bg-success]="getEstadoCurso(curso.id) === 'completado'"
                    [class.bg-warning]="getEstadoCurso(curso.id) === 'iniciado'"
                    [class.bg-secondary]="!getEstadoCurso(curso.id)"
                  >
                    {{ getEstadoTexto(curso.id) }}
                  </span>
                  
                  <div>
                    <button 
                      *ngIf="!getEstadoCurso(curso.id)"
                      class="btn btn-sm btn-primary"
                      (click)="iniciarCurso(curso)"
                    >
                      Iniciar
                    </button>
                    <button 
                      *ngIf="getEstadoCurso(curso.id) === 'iniciado'"
                      class="btn btn-sm btn-success"
                      (click)="completarCurso(curso)"
                    >
                      ✓ Completar
                    </button>
                    <span 
                      *ngIf="getEstadoCurso(curso.id) === 'completado'"
                      class="text-success"
                    >
                      🏅 ¡Completado!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hover-card {
      transition: transform 0.2s;
      cursor: pointer;
    }
    .hover-card:hover {
      transform: translateY(-5px);
    }
    .progress {
      border-radius: 10px;
    }
    .progress-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: Usuario | null = null;
  todosLosCursos: Curso[] = [];
  progresosUsuario: Progreso[] = [];
  moduloSeleccionado: string | null = null;
  cursosModulo: Curso[] = [];

  totalCursos = 0;
  cursosIniciados = 0;
  cursosCompletados = 0;

  modulos: ModuloInfo[] = [
    { nombre: 'Fullstack', icono: '🖥', color: '#28a745', cursos: [], completados: 0 },
    { nombre: 'APIs', icono: '🔗', color: '#17a2b8', cursos: [], completados: 0 },
    { nombre: 'Cloud', icono: '☁️', color: '#ffc107', cursos: [], completados: 0 },
    { nombre: 'DataEngineer', icono: '📊', color: '#dc3545', cursos: [], completados: 0 }
  ];

  constructor(
    private authService: AuthService,
    private cursoService: CursoService,
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
    this.cursoService.obtenerTodos().subscribe({
      next: (cursos) => {
        this.todosLosCursos = cursos;
        this.totalCursos = cursos.length;
        
        // Organizar cursos por módulo
        this.modulos.forEach(modulo => {
          modulo.cursos = cursos.filter(c => c.modulo === modulo.nombre);
        });

        this.cargarProgresos();
      },
      error: (error) => console.error('Error cargando cursos:', error)
    });
  }

  cargarProgresos(): void {
    if (!this.currentUser?.id) return;

    this.progresoService.obtenerProgresoUsuario(this.currentUser.id).subscribe({
      next: (progresos) => {
        this.progresosUsuario = progresos;
        this.cursosIniciados = progresos.filter(p => p.estado === 'iniciado').length;
        this.cursosCompletados = progresos.filter(p => p.estado === 'completado').length;

        // Calcular completados por módulo
        this.modulos.forEach(modulo => {
          modulo.completados = modulo.cursos.filter(curso => 
            this.getEstadoCurso(curso.id) === 'completado'
          ).length;
        });
      },
      error: (error) => console.error('Error cargando progresos:', error)
    });
  }

  getProgresoPorcentaje(modulo: ModuloInfo): number {
    if (modulo.cursos.length === 0) return 0;
    return Math.round((modulo.completados / modulo.cursos.length) * 100);
  }

  getEstadoCurso(cursoId: string): string | null {
    const progreso = this.progresosUsuario.find(p => p.cursoId === cursoId);
    return progreso?.estado || null;
  }

  getEstadoTexto(cursoId: string): string {
    const estado = this.getEstadoCurso(cursoId);
    if (estado === 'completado') return '✓ Completado';
    if (estado === 'iniciado') return '⏳ En progreso';
    return '⭕ No iniciado';
  }

  verModulo(nombreModulo: string): void {
    this.moduloSeleccionado = nombreModulo;
    this.cursosModulo = this.todosLosCursos.filter(c => c.modulo === nombreModulo);
  }

  cerrarModulo(): void {
    this.moduloSeleccionado = null;
    this.cursosModulo = [];
  }

  iniciarCurso(curso: Curso): void {
    if (!this.currentUser?.id) return;

    const progreso: Progreso = {
      usuarioId: this.currentUser.id,
      cursoId: curso.id,
      estado: 'iniciado'
    };

    this.progresoService.actualizarProgreso(progreso).subscribe({
      next: () => {
        alert(`✅ Has iniciado el curso: ${curso.nombre}`);
        this.cargarProgresos();
      },
      error: (error) => console.error('Error iniciando curso:', error)
    });
  }

  completarCurso(curso: Curso): void {
    if (!this.currentUser?.id) return;

    const progreso: Progreso = {
      usuarioId: this.currentUser.id,
      cursoId: curso.id,
      estado: 'completado'
    };

    this.progresoService.actualizarProgreso(progreso).subscribe({
      next: () => {
        alert(`🎉 ¡Felicitaciones! Has completado: ${curso.nombre}\n🏅 Has obtenido una insignia`);
        this.cargarProgresos();
      },
      error: (error) => console.error('Error completando curso:', error)
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}