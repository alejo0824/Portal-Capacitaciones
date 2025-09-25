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

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }
}
