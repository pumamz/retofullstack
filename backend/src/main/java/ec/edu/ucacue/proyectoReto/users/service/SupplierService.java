package ec.edu.ucacue.proyectoReto.users.service;

import ec.edu.ucacue.proyectoReto.users.model.Supplier;

import java.util.List;

public interface SupplierService {
    public List<Supplier> listSupplier();
    public Supplier findSupplierById(Long id);
    public  void    createSupplier(Supplier supplier);
    public void deleteSupplierById(Long id);
    public void editSupplier(Supplier supplier);
}
