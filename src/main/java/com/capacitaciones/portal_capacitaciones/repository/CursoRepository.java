package com.capacitaciones.portal_capacitaciones.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.capacitaciones.portal_capacitaciones.model.Curso;

public interface CursoRepository extends MongoRepository<Curso, String> {
    List<Curso> findByModulo(String modulo);
}