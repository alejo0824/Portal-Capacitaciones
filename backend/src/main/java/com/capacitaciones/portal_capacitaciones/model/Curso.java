package com.capacitaciones.portal_capacitaciones.model;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "cursos")
public class Curso {
    
    @Id
    private String id;
    private String nombre;
    private String descripcion;
    private String modulo; // Fullstack, APIs, Cloud, DataEngineer
    private String insignia;
    
    // Constructores
    public Curso() {}
    
    public Curso(String nombre, String descripcion, String modulo, String insignia) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.modulo = modulo;
        this.insignia = insignia;
    }
    
    // Getters y Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    
    public String getModulo() { return modulo; }
    public void setModulo(String modulo) { this.modulo = modulo; }
    
    public String getInsignia() { return insignia; }
    public void setInsignia(String insignia) { this.insignia = insignia; }
}