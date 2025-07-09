package ec.edu.ucacue.proyectoReto.membership.service;

import ec.edu.ucacue.proyectoReto.exception.ResourceNotFoundException;
import ec.edu.ucacue.proyectoReto.membership.model.VentaMembresia;
import ec.edu.ucacue.proyectoReto.membership.repository.VentaMembresiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class VentaMembresiaServiceImpl implements VentaMembresiaService {

    @Autowired
    private VentaMembresiaRepository ventaRepository;

    @Override
    public VentaMembresia crearVenta(VentaMembresia venta) {
        // Validaciones básicas
        if (venta == null) {
            throw new IllegalArgumentException("La venta no puede ser nula");
        }
        if (venta.getCliente() == null) {
            throw new IllegalArgumentException("La venta debe tener un cliente");
        }
        if (venta.getMembresia() == null) {
            throw new IllegalArgumentException("La venta debe tener una membresía");
        }

        // Establecer fecha de venta automáticamente usando zona horaria de Ecuador
        if (venta.getFechaVenta() == null) {
            venta.setFechaVenta(LocalDate.now(java.time.ZoneId.of("America/Guayaquil")));
        }

        // Guardar y luego recargar la entidad para obtener relaciones completas
        VentaMembresia ventaGuardada = ventaRepository.save(venta);
        return ventaRepository.findById(ventaGuardada.getId())
                .orElseThrow(() -> new RuntimeException("Error al recuperar la venta recién creada"));
    }

    @Override
    public List<VentaMembresia> obtenerTodas() {
        return ventaRepository.findAll();
    }

    @Override
    public VentaMembresia obtenerPorId(Long id) {
        return ventaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venta no encontrada con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        VentaMembresia venta = obtenerPorId(id);
        ventaRepository.delete(venta);
    }

}
