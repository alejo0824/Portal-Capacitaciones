package com.capacitaciones.portal_capacitaciones.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.capacitaciones.portal_capacitaciones.model.Curso;
import com.capacitaciones.portal_capacitaciones.model.Progreso;
import com.capacitaciones.portal_capacitaciones.model.Usuario;
import com.capacitaciones.portal_capacitaciones.repository.CursoRepository;
import com.capacitaciones.portal_capacitaciones.repository.ProgresoRepository;
import com.capacitaciones.portal_capacitaciones.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final CursoController cursoController;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private CursoRepository cursoRepository;
    
    @Autowired
    private ProgresoRepository progresoRepository;

    AdminController(CursoController cursoController) {
        this.cursoController = cursoController;
    }
    
    // ===== GESTIÓN DE USUARIOS =====
    
    @GetMapping("/usuarios")
    public ResponseEntity<?> obtenerTodosUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return ResponseEntity.ok(usuarios);
    }
    
    @GetMapping("/usuarios/{id}/progreso")
    public ResponseEntity<?> obtenerProgresoUsuario(@PathVariable String id) {
        List<Progreso> progresos = progresoRepository.findByUsuarioId(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("progresos", progresos);
        response.put("completados", progresos.stream()
            .filter(p -> "completado".equals(p.getEstado()))
            .count());
        response.put("enProgreso", progresos.stream()
            .filter(p -> "iniciado".equals(p.getEstado()))
            .count());
        
        return ResponseEntity.ok(response);
    }
    
    // ===== GESTIÓN DE CURSOS =====
    
    @PostMapping("/cursos")
    public ResponseEntity<?> crearCurso(@RequestBody Curso curso) {
        Curso nuevoCurso = cursoRepository.save(curso);
        return ResponseEntity.ok(nuevoCurso);
    }
    
    @PutMapping("/cursos/{id}")
    public ResponseEntity<?> actualizarCurso(@PathVariable String id, @RequestBody Curso curso) {
        Optional<Curso> cursoExistente = cursoRepository.findById(id);
        
        if (cursoExistente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Curso cursoActualizado = cursoExistente.get();
        cursoActualizado.setNombre(curso.getNombre());
        cursoActualizado.setDescripcion(curso.getDescripcion());
        cursoActualizado.setModulo(curso.getModulo());
        cursoActualizado.setInsignia(curso.getInsignia());
        
        cursoRepository.save(cursoActualizado);
        return ResponseEntity.ok(cursoActualizado);
    }
    
    @DeleteMapping("/cursos/{id}")
    public ResponseEntity<?> eliminarCurso(@PathVariable String id) {
        Optional<Curso> curso = cursoRepository.findById(id);
        
        if (curso.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        cursoRepository.deleteById(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Curso eliminado exitosamente");
        return ResponseEntity.ok(response);
    }
    
    // ===== ESTADÍSTICAS GENERALES =====
    
    @GetMapping("/estadisticas")
    public ResponseEntity<?> obtenerEstadisticas() {
        Map<String, Object> stats = new HashMap<>();
        
        // Usuarios
        long totalUsuarios = usuarioRepository.count();
        stats.put("totalUsuarios", totalUsuarios);
        
        // Cursos
        long totalCursos = cursoRepository.count();
        stats.put("totalCursos", totalCursos);
        
        // Cursos por módulo
        Map<String, Long> cursosPorModulo = new HashMap<>();
        cursosPorModulo.put("Fullstack", cursoRepository.findByModulo("Fullstack").stream().count());
        cursosPorModulo.put("APIs", cursoRepository.findByModulo("APIs").stream().count());
        cursosPorModulo.put("Cloud",  cursoRepository.findByModulo("Cloud").stream().count());
        cursosPorModulo.put("DataEngineer", cursoRepository.findByModulo("DataEngineer").stream().count());
        stats.put("cursosPorModulo", cursosPorModulo);
        
        // Progresos
        List<Progreso> todosProgresos = progresoRepository.findAll();
        long cursosCompletados = todosProgresos.stream()
            .filter(p -> "completado".equals(p.getEstado()))
            .count();
        long cursosEnProgreso = todosProgresos.stream()
            .filter(p -> "iniciado".equals(p.getEstado()))
            .count();
        
        stats.put("totalCompletados", cursosCompletados);
        stats.put("totalEnProgreso", cursosEnProgreso);
        
        return ResponseEntity.ok(stats);
    }
}