package ec.edu.ucacue.proyectoReto.users.service;

import ec.edu.ucacue.proyectoReto.users.model.Supplier;

import java.util.List;

public interface SupplierService {
    List<Supplier> listSupplier();

    List<Supplier> listEnabledSuppliers();

    Supplier findSupplierById(Long id);

    void createSupplier(Supplier supplier);

    void editSupplier(Supplier supplier);

    List<Supplier> searchSuppliers(String search);

    void toggleEnabled(Long id, boolean enabled);

}