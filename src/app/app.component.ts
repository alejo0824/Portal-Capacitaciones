import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import 'zone.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h1 class="text-center mb-4">Portal de Capacitaciones</h1>
      
      <div class="row">
        <div class="col-md-6 mx-auto">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Estado del Sistema</h5>
              <p class="text-success">✅ Frontend: Angular funcionando</p>
              <p [class]="backendStatus.includes('Error') ? 'text-danger' : 'text-success'">
                🔗 Backend: {{backendStatus}}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-md-3">
          <div class="card border-success">
            <div class="card-body">
              <h6 class="card-title">🖥 Fullstack</h6>
              <p class="card-text">React, Angular, Node.js</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-info">
            <div class="card-body">
              <h6 class="card-title">🔗 APIs</h6>
              <p class="card-text">REST, GraphQL, Microservicios</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-warning">
            <div class="card-body">
              <h6 class="card-title">☁️ Cloud</h6>
              <p class="card-text">AWS, Azure, Docker</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-danger">
            <div class="card-body">
              <h6 class="card-title">📊 Data Engineer</h6>
              <p class="card-text">Python, Spark, ETL</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  backendStatus = 'Conectando...';
  
  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    // Cambio aquí: usar responseType: 'text' en lugar de JSON
    this.http.get('http://localhost:8081/api/cursos/test', { responseType: 'text' }).subscribe({
      next: (response) => {
        this.backendStatus = 'Conectado - ' + response;
      },
      error: (error) => {
        this.backendStatus = 'Error de conexión';
        console.error('Error conectando al backend:', error);
      }
    });
  }
}