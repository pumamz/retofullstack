package ec.edu.ucacue.proyectoReto.users.service;

import ec.edu.ucacue.proyectoReto.users.model.Supplier;
import ec.edu.ucacue.proyectoReto.users.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        return supplierRepository.findById(id).orElseThrow(() -> new RuntimeException("Id no encontrado"));
    }

    @Override
    public void createSupplier(Supplier supplier) {
        supplierRepository.save(supplier);
    }


    @Override
    public void deleteSupplierById(Long id) {
        supplierRepository.deleteById(id);
    }

    @Override
    public void editSupplier(Supplier supplier) {

    }
}
