package ec.edu.ucacue.proyectoReto.users.repository;

import ec.edu.ucacue.proyectoReto.users.model.Client;
import ec.edu.ucacue.proyectoReto.users.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    @Query("SELECT s FROM Supplier s WHERE s.enabled = true AND " +
            "(LOWER(s.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(s.dni) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Supplier> searchActiveSuppliers(@Param("searchTerm") String searchTerm);

    Optional<Supplier> findByDni(String dni);

    List<Supplier> findSuppliersByEnabledTrue();
}