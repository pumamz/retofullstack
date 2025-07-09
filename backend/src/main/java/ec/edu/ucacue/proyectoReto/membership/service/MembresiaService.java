package ec.edu.ucacue.proyectoReto.membership.service;


import ec.edu.ucacue.proyectoReto.membership.model.Membresia;

import java.util.List;

public interface MembresiaService {

       Membresia crearMembresia(Membresia membresia);

       List<Membresia> obtenerTodas();

       Membresia obtenerPorId(Long id);

       Membresia actualizar(Long id, Membresia membresia);

       void eliminar(Long id);

}
