package ec.edu.ucacue.proyectoReto.product.repository;

import ec.edu.ucacue.proyectoReto.product.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByDateTimeBetween(LocalDate start, LocalDate end);
    List<Order> findByStatus(String status);
    Optional<Order> findByOrderNumber(String orderNumber);
    @Query("SELECT o.orderNumber FROM Order o WHERE o.orderNumber LIKE CONCAT('ORD-', :year, '-%') ORDER BY o.orderNumber DESC")
    List<String> findLastOrderNumberByYear(@org.springframework.data.repository.query.Param("year") String year, org.springframework.data.domain.Pageable pageable);
}