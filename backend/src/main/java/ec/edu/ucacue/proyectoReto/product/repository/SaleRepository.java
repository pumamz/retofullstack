package ec.edu.ucacue.proyectoReto.product.repository;

import ec.edu.ucacue.proyectoReto.product.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findByDateTimeBetween(LocalDate start, LocalDate end);
    Optional<Sale> findByInvoiceNumber(String invoiceNumber);
    List<Sale> findByInvoiceNumberStartingWith(String prefix);
}