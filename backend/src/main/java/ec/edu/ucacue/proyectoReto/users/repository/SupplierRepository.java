package ec.edu.ucacue.proyectoReto.users.repository;

import ec.edu.ucacue.proyectoReto.users.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier,Long> {
    List<Supplier> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
    Optional<Supplier> findByDni(String dni);
    List<Supplier> findByEnabled(boolean enabled);
}