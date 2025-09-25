package com.capacitaciones.portal_capacitaciones.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Document(collection = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    
    @Id
    private String id;
    private String username;
    private String password;
    private String email;
    private String nombreCompleto;
    private String rol = "USER"; 

    public Usuario(String username, String password, String email, String nombreCompleto) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.nombreCompleto = nombreCompleto;
        this.rol = "USER";
    }

    public boolean isAdmin() {
        return "ADMIN".equals(this.rol);
    }
}
