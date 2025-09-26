# Portal de Capacitaciones - Kata Junior Fullstack/Cloud

Sistema completo de gestión de capacitaciones con seguimiento de progreso, insignias y panel administrativo.

## 🚀 Stack Tecnológico

### Backend
- Java 17
- Spring Boot 3.x
- MongoDB
- Maven

### Frontend
- Angular 22 (Standalone Components)
- Bootstrap 5
- TypeScript

## 📋 Funcionalidades Implementadas

### Para Usuarios Normales
- ✅ Registro e inicio de sesión
- ✅ Validación de usuarios duplicados
- ✅ Dashboard con 4 módulos (Fullstack, APIs, Cloud, DataEngineer)
- ✅ Visualización de cursos por módulo
- ✅ Iniciar y completar cursos
- ✅ Sistema de insignias automático
- ✅ Perfil de usuario con historial
- ✅ Seguimiento de progreso

### Para Administradores
- ✅ Panel de administración completo
- ✅ Estadísticas generales del sistema
- ✅ Gestión de usuarios
- ✅ Ver progreso de cada usuario
- ✅ Crear, editar y eliminar cursos
- ✅ Visualización de métricas por módulo

## 🔧 Instalación y Configuración

### Requisitos Previos
- Java 17 o superior
- Node.js 18+ y npm
- MongoDB instalado y corriendo
- Git

### 1. Clonar el Repositorio
```bash
git clone <tu-repositorio>
cd portal-capacitaciones
```

### 2. Configurar MongoDB

#### Iniciar MongoDB
```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongodb
```

#### Inicializar Base de Datos
```bash
# Usando mongosh
mongosh
use capacitaciones_pruebas

# Copiar y pegar el contenido de init-db.js
```

O ejecutar directamente:
```bash
mongosh < init-db.js
```

### 3. Configurar Backend

```bash
cd backend

# Instalar dependencias (Maven las descargará automáticamente)
mvn clean install

# Ejecutar aplicación
mvn spring-boot:run
```

El backend estará disponible en: `http://localhost:8081`

### 4. Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
ng serve
```

El frontend estará disponible en: `http://localhost:4200`

## 👤 Usuarios de Prueba

### Usuario Administrador
- **Usuario:** `admin`
- **Contraseña:** `1234`
- **Acceso:** Panel de administración completo

### Usuario Normal
- **Usuario:** `usuario1`
- **Contraseña:** `1234`
- **Acceso:** Dashboard de estudiante

## 📁 Estructura del Proyecto

```
portal-capacitaciones/
├── backend/
│   ├── src/main/java/.../
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── CursoController.java
│   │   │   ├── ProgresoController.java
│   │   │   ├── InsigniaController.java
│   │   │   └── AdminController.java
│   │   ├── model/
│   │   │   ├── Usuario.java
│   │   │   ├── Curso.java
│   │   │   ├── Progreso.java
│   │   │   └── Insignia.java
│   │   └── repository/
│   └── pom.xml
│
├── frontend/
│   ├── src/app/
│   │   ├── components/
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── perfil/
│   │   │   └── admin/
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── curso.service.ts
│   │   │   ├── progreso.service.ts
│   │   │   └── admin.service.ts
│   │   └── models/
│   └── package.json
│
└── init-db.js
```

## 🔐 Sistema de Roles

### USER (Usuario Normal)
- Ver dashboard personal
- Iniciar y completar cursos
- Ver insignias obtenidas
- Acceder a perfil personal

### ADMIN (Administrador)
- Todo lo anterior +
- Ver panel de administración
- Gestionar todos los cursos
- Ver todos los usuarios
- Ver estadísticas globales
- Crear/Editar/Eliminar cursos

## 🗄️ Colecciones MongoDB

### usuarios
```javascript
{
  _id: ObjectId,
  username: String,
  password: String,
  email: String,
  nombreCompleto: String,
  rol: String // "USER" o "ADMIN"
}
```

### cursos
```javascript
{
  _id: ObjectId,
  nombre: String,
  descripcion: String,
  modulo: String,
  insignia: String
}
```

### progresos
```javascript
{
  _id: ObjectId,
  usuarioId: String,
  cursoId: String,
  estado: String, // "iniciado" o "completado"
  fechaInicio: DateTime,
  fechaCompletado: DateTime
}
```

### insignias
```javascript
{
  _id: ObjectId,
  usuarioId: String,
  cursoId: String,
  nombreCurso: String,
  imagen: String,
  fechaObtencion: DateTime
}
```

## 🛠️ APIs Disponibles

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/test` - Test de conexión

### Cursos
- `GET /api/cursos` - Obtener todos los cursos
- `GET /api/cursos/modulo/{modulo}` - Cursos por módulo
- `POST /api/cursos` - Crear curso (solo admin)

### Progreso
- `GET /api/progreso/usuario/{id}` - Progreso de usuario
- `POST /api/progreso` - Actualizar progreso
- `GET /api/progreso/usuario/{id}/completados` - Cursos completados

### Insignias
- `GET /api/insignias/usuario/{id}` - Insignias de usuario
- `GET /api/insignias` - Todas las insignias

### Admin (Solo ADMIN)
- `GET /api/admin/usuarios` - Todos los usuarios
- `GET /api/admin/usuarios/{id}/progreso` - Progreso de usuario
- `POST /api/admin/cursos` - Crear curso
- `PUT /api/admin/cursos/{id}` - Actualizar curso
- `DELETE /api/admin/cursos/{id}` - Eliminar curso
- `GET /api/admin/estadisticas` - Estadísticas generales

Proyecto educativo - Kata Junior Fullstack/Cloud
