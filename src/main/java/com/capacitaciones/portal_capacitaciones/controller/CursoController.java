package com.capacitaciones.portal_capacitaciones.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.capacitaciones.portal_capacitaciones.model.Curso;
import com.capacitaciones.portal_capacitaciones.repository.CursoRepository;

@RestController
@RequestMapping("/api/cursos")
public class CursoController {
    
    @Autowired
    private CursoRepository cursoRepository;
    
    // GET - Obtener todos los cursos
    @GetMapping
    public List<Curso> obtenerTodos() {
        return cursoRepository.findAll();
    }
    
    // GET - Obtener cursos por módulo
    @GetMapping("/modulo/{modulo}")
    public List<Curso> obtenerPorModulo(@PathVariable String modulo) {
        return cursoRepository.findByModulo(modulo);
    }
    
    // POST - Crear un curso de prueba
    @PostMapping
    public Curso crearCurso(@RequestBody Curso curso) {
        return cursoRepository.save(curso);
    }
    
    // GET - Endpoint de prueba
    @GetMapping("/test")
    public String test() {
        return "¡API funcionando correctamente! 🚀";
    }
}