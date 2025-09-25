package com.capacitaciones.portal_capacitaciones.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.capacitaciones.portal_capacitaciones.model.Usuario;
import com.capacitaciones.portal_capacitaciones.repository.UsuarioRepository;

@RestController
@RequestMapping("api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    // DTO para login
    static class LoginRequest {
        public String username;
        public String password;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(request.username);
        
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            if (usuario.getPassword().equals(request.password)) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("usuario", usuario);
                response.put("message", "Login exitoso");
                return ResponseEntity.ok(response);
            }
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Credenciales inválidas");
        return ResponseEntity.status(401).body(response);
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        Map<String, Object> response = new HashMap<>();
        
        // Validar username duplicado
        Optional<Usuario> usuarioExistente = usuarioRepository.findByUsername(usuario.getUsername());
        if (usuarioExistente.isPresent()) {
            response.put("success", false);
            response.put("message", "El nombre de usuario ya está en uso");
            return ResponseEntity.status(409).body(response);
        }
        
        // Validar email duplicado
        Optional<Usuario> emailExistente = usuarioRepository.findByEmail(usuario.getEmail());
        if (emailExistente.isPresent()) {
            response.put("success", false);
            response.put("message", "El email ya está registrado");
            return ResponseEntity.status(409).body(response);
        }
        
        // Si todo está bien, registrar usuario
        Usuario nuevoUsuario = usuarioRepository.save(usuario);
        response.put("success", true);
        response.put("usuario", nuevoUsuario);
        response.put("message", "Usuario registrado exitosamente");
        
        return ResponseEntity.ok(response);
    }
    
    // GET - Endpoint de prueba
    @GetMapping("/test")
    public String test() {
        return "Auth API funcionando ✅";
    }

    
}
