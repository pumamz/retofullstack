package ec.edu.ucacue.proyectoReto.users.controller;

import ec.edu.ucacue.proyectoReto.users.model.Supplier;
import ec.edu.ucacue.proyectoReto.users.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "*")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    @GetMapping
    public ResponseEntity<List<Supplier>> getAllSuppliers() {
        return ResponseEntity.ok(supplierService.listSupplier());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getSupplierById(@PathVariable Long id) {
        return ResponseEntity.ok(supplierService.findSupplierById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Supplier>> searchSuppliers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String dni) {
        return ResponseEntity.ok(supplierService.searchSuppliers(name, dni));
    }

    @PostMapping
    public ResponseEntity<Void> createSupplier(@Valid @RequestBody Supplier supplier) {
        supplierService.createSupplier(supplier);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateSupplier(@PathVariable Long id, @Valid @RequestBody Supplier supplier) {
        supplier.setId(id);
        supplierService.editSupplier(supplier);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplierById(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/enable")
    public ResponseEntity<Void> toggleSupplierStatus(@PathVariable Long id, @RequestParam boolean enabled) {
        supplierService.toggleEnabled(id, enabled);
        return ResponseEntity.ok().build();
    }
}
