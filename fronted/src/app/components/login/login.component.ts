import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="row justify-content-center mt-5">
        <div class="col-md-6">
          <div class="card shadow">
            <div class="card-body p-5">
              <h2 class="text-center mb-4">Portal de Capacitaciones</h2>
              <h5 class="text-center text-muted mb-4">Iniciar Sesión</h5>
              
              <div *ngIf="errorMessage" class="alert alert-danger" role="alert">
                {{ errorMessage }}
              </div>

              <div *ngIf="successMessage" class="alert alert-success" role="alert">
                {{ successMessage }}
              </div>

              <form (ngSubmit)="onLogin()" #loginForm="ngForm">
                <div class="mb-3">
                  <label for="username" class="form-label">Usuario</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="username"
                    [(ngModel)]="credentials.username" 
                    name="username"
                    required
                    placeholder="Ingresa tu usuario"
                  >
                </div>
                
                <div class="mb-3">
                  <label for="password" class="form-label">Contraseña</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="password"
                    [(ngModel)]="credentials.password" 
                    name="password"
                    required
                    placeholder="Ingresa tu contraseña"
                  >
                </div>

                <button 
                  type="submit" 
                  class="btn btn-primary w-100"
                  [disabled]="!loginForm.valid || loading"
                >
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
                </button>
              </form>

              <hr class="my-4">
              
              <div class="text-center">
                <p class="mb-2">¿No tienes cuenta?</p>
                <button 
                  class="btn btn-outline-secondary"
                  (click)="toggleRegister()"
                >
                  {{ showRegister ? 'Volver al Login' : 'Registrarse' }}
                </button>
              </div>

              <!-- Formulario de Registro -->
              <div *ngIf="showRegister" class="mt-4">
                <h5 class="text-center mb-3">Registro</h5>
                <form (ngSubmit)="onRegister()" #registerForm="ngForm">
                  <div class="mb-3">
                    <input 
                      type="text" 
                      class="form-control" 
                      [(ngModel)]="newUser.username" 
                      name="regUsername"
                      placeholder="Usuario"
                      required
                    >
                  </div>
                  <div class="mb-3">
                    <input 
                      type="email" 
                      class="form-control" 
                      [(ngModel)]="newUser.email" 
                      name="email"
                      placeholder="Email"
                      required
                    >
                  </div>
                  <div class="mb-3">
                    <input 
                      type="text" 
                      class="form-control" 
                      [(ngModel)]="newUser.nombreCompleto" 
                      name="nombreCompleto"
                      placeholder="Nombre Completo"
                      required
                    >
                  </div>
                  <div class="mb-3">
                    <input 
                      type="password" 
                      class="form-control" 
                      [(ngModel)]="newUser.password" 
                      name="regPassword"
                      placeholder="Contraseña"
                      required
                    >
                  </div>
                  <button 
                    type="submit" 
                    class="btn btn-success w-100"
                    [disabled]="!registerForm.valid"
                  >
                    Registrarse
                  </button>
                </form>
              </div>

              <!-- Info de prueba -->
              <div class="mt-4 p-3 bg-light rounded">
                <small class="text-muted">
                  <strong>Usuario de prueba:</strong><br>
                  Usuario: admin | Contraseña: 1234
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
      border-radius: 15px;
    }
    .btn {
      border-radius: 8px;
    }
  `]
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  newUser = { username: '', password: '', email: '', nombreCompleto: '' };
  errorMessage = '';
  successMessage = '';
  loading = false;
  showRegister = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          // Redirigir según el rol
          if (response.usuario?.rol === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Error al conectar con el servidor';
        console.error('Error login:', error);
      }
    });
  }

  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.newUser).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Usuario registrado exitosamente. Ya puedes iniciar sesión.';
          this.showRegister = false;
          this.newUser = { username: '', password: '', email: '', nombreCompleto: '' };
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        if (error.status === 409) {
          this.errorMessage = error.error.message || 'El usuario o email ya existe';
        } else {
          this.errorMessage = 'Error al registrar usuario';
        }
        console.error('Error registro:', error);
      }
    });
  }

  toggleRegister(): void {
    this.showRegister = !this.showRegister;
    this.errorMessage = '';
    this.successMessage = '';
  }
}