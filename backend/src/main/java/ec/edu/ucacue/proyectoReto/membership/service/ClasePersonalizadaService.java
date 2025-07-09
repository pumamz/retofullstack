package ec.edu.ucacue.proyectoReto.membership.service;

import ec.edu.ucacue.proyectoReto.membership.model.ClasePersonalizada;

import java.util.List;

public interface ClasePersonalizadaService {

    ClasePersonalizada crearClase(ClasePersonalizada clase);

    List<ClasePersonalizada> obtenerTodas();

    ClasePersonalizada obtenerPorId(Long id);

    ClasePersonalizada actualizar(Long id, ClasePersonalizada clase);

    void eliminar(Long id);

}
