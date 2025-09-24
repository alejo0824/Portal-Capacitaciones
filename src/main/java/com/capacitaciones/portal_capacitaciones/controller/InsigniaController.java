package com.capacitaciones.portal_capacitaciones.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.capacitaciones.portal_capacitaciones.model.Insignia;
import com.capacitaciones.portal_capacitaciones.repository.InsigniaRepository;
import java.util.List;

@RestController
@RequestMapping("/api/insignias")
@CrossOrigin(origins = "*")
public class InsigniaController {
    
    @Autowired
    private InsigniaRepository insigniaRepository;
    
    // GET - Obtener insignias de un usuario
    @GetMapping("/usuario/{usuarioId}")
    public List<Insignia> obtenerInsigniasUsuario(@PathVariable String usuarioId) {
        return insigniaRepository.findByUsuarioId(usuarioId);
    }
    
    // GET - Obtener todas las insignias (admin)
    @GetMapping
    public List<Insignia> obtenerTodas() {
        return insigniaRepository.findAll();
    }
}