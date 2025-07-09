package ec.edu.ucacue.proyectoReto.product.repository;

import ec.edu.ucacue.proyectoReto.product.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findByDateTimeBetween(LocalDate start, LocalDate end);
    Optional<Sale> findByInvoiceNumber(String invoiceNumber);
    List<Sale> findByCancelled(boolean cancelled);

    @Query("SELECT MAX(CAST(SUBSTRING(s.invoiceNumber, 6) AS int)) FROM Sale s WHERE s.invoiceNumber LIKE CONCAT('FACT-', ?1, '%')")
    Optional<Integer> findLastInvoiceNumberForYear(String year);
}