package com.capacitaciones.portal_capacitaciones.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.capacitaciones.portal_capacitaciones.model.Progreso;

public interface ProgresoRepository extends MongoRepository<Progreso, String>{
    List<Progreso> findByUsuarioId(String usuarioId);
    Optional<Progreso> findByUsuarioIdAndCursoId(String usuarioId, String cursoId);
    List<Progreso> findByUsuarioIdAndEstado(String usuarioId, String estado);
}

  
