package ec.edu.ucacue.proyectoReto.users.service;

import ec.edu.ucacue.proyectoReto.users.model.Supplier;

import java.util.List;

public interface SupplierService {
    List<Supplier> listSupplier();

    Supplier findSupplierById(Long id);

    void createSupplier(Supplier supplier);

    void deleteSupplierById(Long id);

    void editSupplier(Supplier supplier);

    List<Supplier> searchSuppliers(String name, String dni);

    void toggleEnabled(Long id, boolean enabled);

    List<Supplier> findByEnabled(boolean enabled);
}