package ec.edu.ucacue.proyectoReto.users.service;

import ec.edu.ucacue.proyectoReto.users.model.Client;
import ec.edu.ucacue.proyectoReto.users.model.Supplier;
import ec.edu.ucacue.proyectoReto.users.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierServiceImpl(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Supplier> listSupplier() {
        return supplierRepository.findAll();
    }

    @Override
    public List<Supplier> listEnabledSuppliers() {
        return supplierRepository.findSuppliersByEnabledTrue();
    }

    @Override
    @Transactional(readOnly = true)
    public Supplier findSupplierById(Long id) {
        return supplierRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Proveedor no encontrado con ID: " + id));
    }

    @Override
    @Transactional
    public void createSupplier(Supplier supplier) {
        validateSupplierData(supplier);
        supplierRepository.save(supplier);
    }

    @Override
    @Transactional
    public void editSupplier(Supplier supplier) {
        Supplier existingSupplier = findSupplierById(supplier.getId());
        validateSupplierData(supplier);
        existingSupplier.setDni(supplier.getDni());
        existingSupplier.setFirstName(supplier.getFirstName());
        existingSupplier.setLastName(supplier.getLastName());
        existingSupplier.setEmail(supplier.getEmail());
        existingSupplier.setPhone(supplier.getPhone());
        existingSupplier.setCompany(supplier.getCompany());
        existingSupplier.setRuc(supplier.getRuc());
        
        supplierRepository.save(existingSupplier);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Supplier> searchSuppliers(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return null;
        }
        return supplierRepository.searchActiveSuppliers(searchTerm);
    }

    @Override
    @Transactional
    public void toggleEnabled(Long id, boolean enabled) {
        Supplier supplier = findSupplierById(id);
        supplier.setEnabled(enabled);
        supplierRepository.save(supplier);
    }

    private void validateSupplierData(Supplier supplier) {
        if (supplier.getDni() != null) {
            supplierRepository.findByDni(supplier.getDni())
                .ifPresent(existingSupplier -> {
                    if (!existingSupplier.getId().equals(supplier.getId())) {
                        throw new RuntimeException("Ya existe un proveedor con el DNI: " + supplier.getDni());
                    }
                });
        }
    }
}