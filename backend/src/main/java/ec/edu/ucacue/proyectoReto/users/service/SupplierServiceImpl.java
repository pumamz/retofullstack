package ec.edu.ucacue.proyectoReto.users.service;

import ec.edu.ucacue.proyectoReto.users.model.Supplier;
import ec.edu.ucacue.proyectoReto.users.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
public class SupplierServiceImpl implements SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Supplier> listSupplier() {
        return supplierRepository.findAll();
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
    public void deleteSupplierById(Long id) {
        Supplier supplier = findSupplierById(id);
        supplier.setEnabled(false);
        supplierRepository.save(supplier);
    }

    @Override
    @Transactional
    public void editSupplier(Supplier supplier) {
        Supplier existingSupplier = findSupplierById(supplier.getId());
        validateSupplierData(supplier);
        
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
    public List<Supplier> searchSuppliers(String name, String dni) {
        if (dni != null && !dni.isEmpty()) {
            return supplierRepository.findByDni(dni)
                .map(List::of)
                .orElse(new ArrayList<>());
        }
        
        if (name != null && !name.isEmpty()) {
            return supplierRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name, name);
        }
        
        return new ArrayList<>();
    }

    @Override
    @Transactional
    public void toggleEnabled(Long id, boolean enabled) {
        Supplier supplier = findSupplierById(id);
        supplier.setEnabled(enabled);
        supplierRepository.save(supplier);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Supplier> findByEnabled(boolean enabled) {
        return supplierRepository.findByEnabled(enabled);
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