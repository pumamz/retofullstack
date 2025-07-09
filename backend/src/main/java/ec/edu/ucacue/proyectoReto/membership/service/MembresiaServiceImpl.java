package ec.edu.ucacue.proyectoReto.membership.service;

import ec.edu.ucacue.proyectoReto.exception.ResourceNotFoundException;
import ec.edu.ucacue.proyectoReto.membership.model.Membresia;
import ec.edu.ucacue.proyectoReto.membership.repository.MembresiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class MembresiaServiceImpl implements MembresiaService {

    @Autowired
    private MembresiaRepository membresiaRepository;

    @Override
    public Membresia crearMembresia(Membresia membresia) {
        // Validaciones básicas
        if (membresia == null) {
            throw new IllegalArgumentException("La membresía no puede ser nula");
        }
        if (membresia.getNombre() == null || membresia.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la membresía es obligatorio");
        }
        if (membresia.getPrecio() == null || membresia.getPrecio() <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor a cero");
        }
        if (membresia.getDuracionDias() == null || membresia.getDuracionDias() <= 0) {
            throw new IllegalArgumentException("La duración debe ser mayor a cero días");
        }
        // Validar que no exista una membresía con el mismo nombre
        if (membresiaRepository.findAll().stream()
                .anyMatch(m -> m.getNombre().equalsIgnoreCase(membresia.getNombre()))) {
            throw new IllegalArgumentException("Ya existe una membresía con ese nombre");
        }
        // Establecer fecha de creación si no existe usando zona horaria de Ecuador
        if (membresia.getFechaCreacion() == null) {
            membresia.setFechaCreacion(LocalDate.now(java.time.ZoneId.of("America/Guayaquil")));
        }

        return membresiaRepository.save(membresia);
    }

    @Override
    public List<Membresia> obtenerTodas() {
        return membresiaRepository.findAll();
    }

    @Override
    public Membresia obtenerPorId(Long id) {
        return membresiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membresía no encontrada con ID: " + id));
    }

    @Override
    public Membresia actualizar(Long id, Membresia membresia) {
        Membresia existente = obtenerPorId(id);

        // Validar datos antes de actualizar
        if (membresia.getNombre() != null && !membresia.getNombre().trim().isEmpty()) {
            // Validar que no exista otra membresía con ese nombre
            if (membresiaRepository.findAll().stream()
                    .anyMatch(m -> m.getNombre().equalsIgnoreCase(membresia.getNombre()) && !m.getId().equals(id))) {
                throw new IllegalArgumentException("Ya existe otra membresía con ese nombre");
            }
            existente.setNombre(membresia.getNombre());
        }
        if (membresia.getPrecio() != null && membresia.getPrecio() > 0) {
            existente.setPrecio(membresia.getPrecio());
        }
        if (membresia.getDuracionDias() != null && membresia.getDuracionDias() > 0) {
            existente.setDuracionDias(membresia.getDuracionDias());
        }

        return membresiaRepository.save(existente);
    }

    @Override
    public void eliminar(Long id) {
        Membresia existente = obtenerPorId(id);
        // Validar que la membresía no esté asociada a ventas activas, si aplica la
        // lógica de negocio
        // Por ejemplo:
        // if (!ventaMembresiaRepository.findByMembresiaId(id).isEmpty()) {
        // throw new IllegalStateException("No se puede eliminar una membresía asociada
        // a ventas activas");
        // }
        membresiaRepository.delete(existente);
    }

}
