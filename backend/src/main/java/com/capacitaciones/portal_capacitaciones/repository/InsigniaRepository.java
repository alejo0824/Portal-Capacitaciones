package com.capacitaciones.portal_capacitaciones.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.capacitaciones.portal_capacitaciones.model.Insignia;
import java.util.List;

public interface InsigniaRepository extends MongoRepository<Insignia, String> {
    List<Insignia> findByUsuarioId(String usuarioId);
}