import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { CursoService } from '../../services/curso.service';
import { Usuario, Curso, AdminStats } from '../../models/models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <nav class="navbar navbar-dark bg-danger">
      <div class="container-fluid">
        <span class="navbar-brand">⚙️ Panel de Administración</span>
        <div>
          <button class="btn btn-sm btn-outline-light" (click)="logout()">
            Salir
          </button>
        </div>
      </div>
    </nav>

    <div class="container-fluid mt-4">
      <!-- Tabs -->
      <ul class="nav nav-tabs mb-4">
        <li class="nav-item">
          <a class="nav-link" [class.active]="activeTab === 'stats'" (click)="activeTab = 'stats'">
            Estadísticas
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" [class.active]="activeTab === 'usuarios'" (click)="activeTab = 'usuarios'">
            Usuarios
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" [class.active]="activeTab === 'cursos'" (click)="activeTab = 'cursos'">
            Gestión de Cursos
          </a>
        </li>
      </ul>

      <!-- TAB: ESTADÍSTICAS -->
      <div *ngIf="activeTab === 'stats'">
        <h4 class="mb-4">Estadísticas Generales</h4>
        
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card text-center bg-primary text-white">
              <div class="card-body">
                <h2>{{ stats?.totalUsuarios || 0 }}</h2>
                <p>Total Usuarios</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-center bg-success text-white">
              <div class="card-body">
                <h2>{{ stats?.totalCursos || 0 }}</h2>
                <p>Total Cursos</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-center bg-info text-white">
              <div class="card-body">
                <h2>{{ stats?.totalCompletados || 0 }}</h2>
                <p>Cursos Completados</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-center bg-warning text-white">
              <div class="card-body">
                <h2>{{ stats?.totalEnProgreso || 0 }}</h2>
                <p>En Progreso</p>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="card">
              <div class="card-body">
                <h5>Cursos por Módulo</h5>
                <div *ngFor="let modulo of getModulos()" class="mb-2">
                  <strong>{{ modulo }}:</strong> {{ stats?.cursosPorModulo?.[modulo] || 0 }} cursos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB: USUARIOS -->
      <div *ngIf="activeTab === 'usuarios'">
        <h4 class="mb-4">Gestión de Usuarios</h4>
        
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Completados</th>
                <th>En Progreso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let usuario of usuarios">
                <td>{{ usuario.username }}</td>
                <td>{{ usuario.nombreCompleto }}</td>
                <td>{{ usuario.email }}</td>
                <td>
                  <span class="badge" [class.bg-danger]="usuario.rol === 'ADMIN'" [class.bg-secondary]="usuario.rol !== 'ADMIN'">
                    {{ usuario.rol || 'USER' }}
                  </span>
                </td>
                <td>{{ getUsuarioStats(usuario.id!).completados }}</td>
                <td>{{ getUsuarioStats(usuario.id!).enProgreso }}</td>
                <td>
                  <button class="btn btn-sm btn-info" (click)="verDetalleUsuario(usuario)">
                    Ver Detalle
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Modal Detalle Usuario -->
        <div *ngIf="usuarioSeleccionado" class="modal d-block" style="background: rgba(0,0,0,0.5)">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Progreso de {{ usuarioSeleccionado.nombreCompleto }}</h5>
                <button type="button" class="btn-close" (click)="cerrarDetalle()"></button>
              </div>
              <div class="modal-body">
                <p><strong>Usuario:</strong> {{ usuarioSeleccionado.username }}</p>
                <p><strong>Email:</strong> {{ usuarioSeleccionado.email }}</p>
                
                <h6 class="mt-3">Estadísticas:</h6>
                <ul>
                  <li>Cursos completados: {{ usuarioProgreso?.completados || 0 }}</li>
                  <li>Cursos en progreso: {{ usuarioProgreso?.enProgreso || 0 }}</li>
                </ul>
              </div>
              <div class="modal-footer">
                <button class="btn btn-secondary" (click)="cerrarDetalle()">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB: GESTIÓN DE CURSOS -->
      <div *ngIf="activeTab === 'cursos'">
        <div class="row mb-4">
          <div class="col-md-12">
            <button class="btn btn-success" (click)="mostrarFormularioCurso()">
              + Nuevo Curso
            </button>
          </div>
        </div>

        <!-- Formulario Crear/Editar Curso -->
        <div *ngIf="mostrarFormulario" class="card mb-4">
          <div class="card-body">
            <h5>{{ cursoEditando ? 'Editar Curso' : 'Nuevo Curso' }}</h5>
            <form (ngSubmit)="guardarCurso()" #cursoForm="ngForm">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Nombre del Curso</label>
                  <input type="text" class="form-control" [(ngModel)]="cursoFormData.nombre" name="nombre" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Módulo</label>
                  <select class="form-control" [(ngModel)]="cursoFormData.modulo" name="modulo" required>
                    <option value="">Seleccionar...</option>
                    <option value="Fullstack">Fullstack</option>
                    <option value="APIs">APIs</option>
                    <option value="Cloud">Cloud</option>
                    <option value="DataEngineer">DataEngineer</option>
                  </select>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea class="form-control" [(ngModel)]="cursoFormData.descripcion" name="descripcion" rows="3" required></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Insignia (emoji)</label>
                <input type="text" class="form-control" [(ngModel)]="cursoFormData.insignia" name="insignia" placeholder="🏆" required>
              </div>
              <button type="submit" class="btn btn-primary" [disabled]="!cursoForm.valid">
                {{ cursoEditando ? 'Actualizar' : 'Crear' }}
              </button>
              <button type="button" class="btn btn-secondary ms-2" (click)="cancelarFormulario()">
                Cancelar
              </button>
            </form>
          </div>
        </div>

        <!-- Lista de Cursos -->
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Módulo</th>
                <th>Insignia</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let curso of cursos">
                <td>{{ curso.nombre }}</td>
                <td>{{ curso.descripcion }}</td>
                <td>
                  <span class="badge bg-primary">{{ curso.modulo }}</span>
                </td>
                <td style="font-size: 24px">{{ curso.insignia }}</td>
                <td>
                  <button class="btn btn-sm btn-warning me-2" (click)="editarCurso(curso)">
                    Editar
                  </button>
                  <button class="btn btn-sm btn-danger" (click)="eliminarCurso(curso)">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal {
      overflow-y: auto;
    }
    .nav-link {
      cursor: pointer;
    }
  `]
})
export class AdminComponent implements OnInit {
  activeTab = 'stats';
  stats: AdminStats | null = null;
  usuarios: Usuario[] = [];
  cursos: Curso[] = [];
  usuarioSeleccionado: Usuario | null = null;
  usuarioProgreso: any = null;
  usuariosStats: Map<string, any> = new Map();
  
  mostrarFormulario = false;
  cursoEditando: Curso | null = null;
  cursoFormData: any = {
    nombre: '',
    descripcion: '',
    modulo: '',
    insignia: ''
  };

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private cursoService: CursoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.cargarEstadisticas();
    this.cargarUsuarios();
    this.cargarCursos();
  }

  cargarEstadisticas(): void {
    this.adminService.obtenerEstadisticas().subscribe({
      next: (stats) => this.stats = stats,
      error: (error) => console.error('Error cargando estadísticas:', error)
    });
  }

  cargarUsuarios(): void {
    this.adminService.obtenerTodosUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        usuarios.forEach(u => {
          if (u.id) {
            this.adminService.obtenerProgresoUsuario(u.id).subscribe({
              next: (progreso) => this.usuariosStats.set(u.id!, progreso)
            });
          }
        });
      },
      error: (error) => console.error('Error cargando usuarios:', error)
    });
  }

  cargarCursos(): void {
    this.cursoService.obtenerTodos().subscribe({
      next: (cursos) => this.cursos = cursos,
      error: (error) => console.error('Error cargando cursos:', error)
    });
  }

  getModulos(): string[] {
    return ['Fullstack', 'APIs', 'Cloud', 'DataEngineer'];
  }

  getUsuarioStats(usuarioId: string): any {
    return this.usuariosStats.get(usuarioId) || { completados: 0, enProgreso: 0 };
  }

  verDetalleUsuario(usuario: Usuario): void {
    this.usuarioSeleccionado = usuario;
    if (usuario.id) {
      this.adminService.obtenerProgresoUsuario(usuario.id).subscribe({
        next: (progreso) => this.usuarioProgreso = progreso
      });
    }
  }

  cerrarDetalle(): void {
    this.usuarioSeleccionado = null;
    this.usuarioProgreso = null;
  }

  mostrarFormularioCurso(): void {
    this.mostrarFormulario = true;
    this.cursoEditando = null;
    this.cursoFormData = { nombre: '', descripcion: '', modulo: '', insignia: '' };
  }

  editarCurso(curso: Curso): void {
    this.cursoEditando = curso;
    this.cursoFormData = { ...curso };
    this.mostrarFormulario = true;
  }

  guardarCurso(): void {
    if (this.cursoEditando) {
      this.adminService.actualizarCurso(this.cursoEditando.id, this.cursoFormData).subscribe({
        next: () => {
          alert('Curso actualizado exitosamente');
          this.cargarCursos();
          this.cancelarFormulario();
        },
        error: (error) => console.error('Error actualizando curso:', error)
      });
    } else {
      this.adminService.crearCurso(this.cursoFormData).subscribe({
        next: () => {
          alert('Curso creado exitosamente');
          this.cargarCursos();
          this.cargarEstadisticas();
          this.cancelarFormulario();
        },
        error: (error) => console.error('Error creando curso:', error)
      });
    }
  }

  eliminarCurso(curso: Curso): void {
    if (confirm(`¿Estás seguro de eliminar el curso "${curso.nombre}"?`)) {
      this.adminService.eliminarCurso(curso.id).subscribe({
        next: () => {
          alert('Curso eliminado exitosamente');
          this.cargarCursos();
          this.cargarEstadisticas();
        },
        error: (error) => console.error('Error eliminando curso:', error)
      });
    }
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.cursoEditando = null;
    this.cursoFormData = { nombre: '', descripcion: '', modulo: '', insignia: '' };
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}