package com.capacitaciones.portal_capacitaciones.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.capacitaciones.portal_capacitaciones.model.Curso;
import com.capacitaciones.portal_capacitaciones.model.Insignia;
import com.capacitaciones.portal_capacitaciones.model.Progreso;
import com.capacitaciones.portal_capacitaciones.repository.CursoRepository;
import com.capacitaciones.portal_capacitaciones.repository.InsigniaRepository;
import com.capacitaciones.portal_capacitaciones.repository.ProgresoRepository;

@RestController
@RequestMapping("/api/progreso")
@CrossOrigin(origins = "*")
public class ProgresoController {

    @Autowired
    private ProgresoRepository progresoRepository;

    @Autowired
    private InsigniaRepository insigniaRepository;

    @Autowired
    private CursoRepository cursoRepository;
    
    @GetMapping("/usuario/{usuarioId}")
    public List<Progreso> obtenerProgresoUsuario(@PathVariable String usuarioId){
        return progresoRepository.findByUsuarioId(usuarioId);
    }

    static class ProgresoRequest {
        public String usuarioId;
        public String cursoId;
        public String estado;
    }

    @PostMapping
    public ResponseEntity<Progreso> actualizarProgreso(@RequestBody Progreso progreso){
        Optional<Progreso> progresoExistente = progresoRepository.
            findByUsuarioIdAndCursoId(progreso.getUsuarioId(), progreso.getCursoId());

            // Valida si hay progreso de un usuario en un curso
            if(progresoExistente.isPresent()){ 
                Progreso p = progresoExistente.get();
                p.setEstado(progreso.getEstado());

                if("completado".equals(progreso.getEstado())){
                    p.setFechaCompletado(LocalDateTime.now());
                    crearInsignia(p.getUsuarioId(), p.getCursoId());
                }

                return ResponseEntity.ok(progresoRepository.save(p));
            } else{
                // Crea un nuevo progreso
                progreso.setFechaInicio(LocalDateTime.now());

                if("completado".equals(progreso.getEstado())){
                    progreso.setFechaCompletado(LocalDateTime.now());
                    crearInsignia(progreso.getUsuarioId(), progreso.getCursoId());
                }

                return ResponseEntity.ok(progresoRepository.save(progreso));

            }

    }

    // Creación de insignia cuando esta completado
    private void crearInsignia(String usuarioId, String cursoId){
        Optional<Curso> cursoOpt = cursoRepository.findById(cursoId);

        if(cursoOpt.isPresent()){
            Curso curso = cursoOpt.get();
            Insignia insignia = new Insignia(usuarioId, cursoId, curso.getNombre(), curso.getInsignia());
            insigniaRepository.save(insignia);
        }
    }

    // Obtener cursos completados por usuario
    @GetMapping("/usuario/{usuarioId}/completados")
    public List<Progreso> obtenerCompletados(@PathVariable String usuarioId) {
        return progresoRepository.findByUsuarioIdAndEstado(usuarioId, "completado");
    }
}
