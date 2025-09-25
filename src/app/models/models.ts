// src/app/models/models.ts

export interface Usuario {
  id?: string;
  username: string;
  password?: string;
  email: string;
  nombreCompleto: string;
}

export interface Curso {
  id: string;
  nombre: string;
  descripcion: string;
  modulo: string;
  insignia: string;
}

export interface Progreso {
  id?: string;
  usuarioId: string;
  cursoId: string;
  estado: 'iniciado' | 'completado';
  fechaInicio?: string;
  fechaCompletado?: string;
}

export interface Insignia {
  id?: string;
  usuarioId: string;
  cursoId: string;
  nombreCurso: string;
  imagen: string;
  fechaObtencion: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  usuario?: Usuario;
  message: string;
}