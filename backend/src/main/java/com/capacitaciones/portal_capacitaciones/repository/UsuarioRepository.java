
package com.capacitaciones.portal_capacitaciones.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.capacitaciones.portal_capacitaciones.model.Usuario;
import java.util.Optional;

public interface UsuarioRepository extends MongoRepository<Usuario, String>{
    Optional<Usuario> findByUsername(String username);
    Optional<Usuario> findByEmail(String email);
}

