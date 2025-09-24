package com.capacitaciones.portal_capacitaciones.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "progresos")
public class Progreso {

    @Id
    private String id;
    private String usuarioId;
    private String cursoId;
    private String estado; // "iniciado" o "completado"
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaCompletado;
    
    public Progreso() {
    }

    public Progreso(String usuarioId, String cursoId, String estado) {
        this.usuarioId = usuarioId;
        this.cursoId = cursoId;
        this.estado = estado;
        this.fechaInicio = LocalDateTime.now();
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

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDateTime getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDateTime fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDateTime getFechaCompletado() {
        return fechaCompletado;
    }

    public void setFechaCompletado(LocalDateTime fechaCompletado) {
        this.fechaCompletado = fechaCompletado;
    }
    
}
