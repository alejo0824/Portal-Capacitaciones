package com.capacitaciones.portal_capacitaciones.model;

import org.springframework.data.annotation.Id;

public class Usuario {
    
    @Id
    private String id;
    private String username;
    private String password; // En producción usar BCrypt, aquí es simulado
    private String email;
    private String nombreCompleto;

    public Usuario() {
    }

    public Usuario(String username, String password, String email, String nombreCompleto) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.nombreCompleto = nombreCompleto;
    }

    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getEmail() {
        return email;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }   
    
}
