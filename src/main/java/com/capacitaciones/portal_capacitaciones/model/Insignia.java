package com.capacitaciones.portal_capacitaciones.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "insignias")
public class Insignia {
    @Id
    private String id;
    private String usuarioId;
    private String cursoId;
    private String nombreCurso;
    private String imagen; // URL o nombre de archivo
    private LocalDateTime fechaObtencion;
    
    public Insignia() {
    }

    public Insignia(String usuarioId, String cursoId, String nombreCurso, String imagen) {
        this.usuarioId = usuarioId;
        this.cursoId = cursoId;
        this.nombreCurso = nombreCurso;
        this.imagen = imagen;
        this.fechaObtencion = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(String usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getCursoId() {
        return cursoId;
    }

    public void setCursoId(String cursoId) {
        this.cursoId = cursoId;
    }

    public String getNombreCurso() {
        return nombreCurso;
    }

    public void setNombreCurso(String nombreCurso) {
        this.nombreCurso = nombreCurso;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public LocalDateTime getFechaObtencion() {
        return fechaObtencion;
    }

    public void setFechaObtencion(LocalDateTime fechaObtencion) {
        this.fechaObtencion = fechaObtencion;
    }
    
    
}
