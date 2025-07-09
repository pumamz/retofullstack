package ec.edu.ucacue.proyectoReto.membership.service;


import ec.edu.ucacue.proyectoReto.membership.model.VentaMembresia;

import java.util.List;

public interface VentaMembresiaService {

    VentaMembresia crearVenta(VentaMembresia venta);

    List<VentaMembresia> obtenerTodas();

    VentaMembresia obtenerPorId(Long id);

    void eliminar(Long id);
}
