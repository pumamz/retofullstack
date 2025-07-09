package ec.edu.ucacue.proyectoReto.membership.service;

import ec.edu.ucacue.proyectoReto.membership.model.ClasePersonalizada;
import ec.edu.ucacue.proyectoReto.membership.repository.ClasePersonalizadaRepository;
import ec.edu.ucacue.proyectoReto.users.model.Client;
import ec.edu.ucacue.proyectoReto.users.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ClasePersonalizadaServiceImpl implements ClasePersonalizadaService {
    @Autowired
    private ClasePersonalizadaRepository claseRepository;
    @Autowired
    private ClientRepository clientRepository;

    @Override
    public ClasePersonalizada crearClase(ClasePersonalizada clase) {
        if (clase == null) {
            throw new IllegalArgumentException("La clase no puede ser nula");
        }
        if (clase.getCliente() == null || clase.getCliente().getId() == null) {
            throw new IllegalArgumentException("Debe especificar el cliente");
        }
        // Buscar el cliente real en la base de datos
        Client clienteReal = clientRepository.findById(clase.getCliente().getId())
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado"));
        clase.setCliente(clienteReal);
        if (clase.getNombreClase() == null || clase.getNombreClase().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la clase es obligatorio");
        }
        if (clase.getFecha() == null) {
            throw new IllegalArgumentException("La fecha de la clase es obligatoria");
        }
        if (clase.getHora() == null) {
            throw new IllegalArgumentException("La hora de la clase es obligatoria");
        }
        if (clase.getPrecio() == null || clase.getPrecio() <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor a cero");
        }
        // Validar que no exista una clase con el mismo nombre, fecha y cliente
        if (claseRepository.findAll().stream()
                .anyMatch(c -> c.getNombreClase().equalsIgnoreCase(clase.getNombreClase())
                        && c.getFecha().equals(clase.getFecha())
                        && c.getCliente().getId().equals(clase.getCliente().getId()))) {
            throw new IllegalArgumentException("Ya existe una clase con ese nombre, fecha y cliente");
        }
        return claseRepository.save(clase);
    }

    @Override
    public List<ClasePersonalizada> obtenerTodas() {
        return claseRepository.findAll();
    }

    @Override
    public ClasePersonalizada obtenerPorId(Long id) {
        return claseRepository.findById(id)
                .orElseThrow(() -> new ec.edu.ucacue.proyectoReto.exception.ResourceNotFoundException(
                        "Clase personalizada no encontrada con ID: " + id));
    }

    @Override
    public ClasePersonalizada actualizar(Long id, ClasePersonalizada claseActualizada) {
        ClasePersonalizada existente = obtenerPorId(id);
        if (claseActualizada.getNombreClase() != null && !claseActualizada.getNombreClase().trim().isEmpty()) {
            // Validar que no exista otra clase igual para el mismo cliente y fecha
            if (claseRepository.findAll().stream()
                    .anyMatch(c -> c.getNombreClase().equalsIgnoreCase(claseActualizada.getNombreClase())
                            && c.getFecha().equals(claseActualizada.getFecha())
                            && c.getCliente().getId().equals(claseActualizada.getCliente().getId())
                            && !c.getId().equals(id))) {
                throw new IllegalArgumentException("Ya existe otra clase con ese nombre, fecha y cliente");
            }
            existente.setNombreClase(claseActualizada.getNombreClase());
        }
        if (claseActualizada.getDescripcion() != null) {
            existente.setDescripcion(claseActualizada.getDescripcion());
        }
        if (claseActualizada.getFecha() != null) {
            existente.setFecha(claseActualizada.getFecha());
        }
        if (claseActualizada.getHora() != null) {
            existente.setHora(claseActualizada.getHora());
        }
        if (claseActualizada.getPrecio() != null && claseActualizada.getPrecio() > 0) {
            existente.setPrecio(claseActualizada.getPrecio());
        }
        if (claseActualizada.getMetodoPago() != null) {
            existente.setMetodoPago(claseActualizada.getMetodoPago());
        }
        if (claseActualizada.getCliente() != null && claseActualizada.getCliente().getId() != null) {
            existente.setCliente(claseActualizada.getCliente());
        }
        return claseRepository.save(existente);
    }

    @Override
    public void eliminar(Long id) {
        ClasePersonalizada existente = obtenerPorId(id);
        claseRepository.delete(existente);
    }

}
