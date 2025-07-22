package ec.edu.ucacue.proyectoReto.product.repository;

import ec.edu.ucacue.proyectoReto.product.model.Order;
import ec.edu.ucacue.proyectoReto.users.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT o FROM Order o WHERE " +
            "LOWER(o.orderNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(o.notes) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Order> searchOrders(@Param("searchTerm") String searchTerm);

    List<Order> findByDateTimeBetween(LocalDate start, LocalDate end);

    Optional<Order> findByOrderNumber(String orderNumber);

    @Query("SELECT o.orderNumber FROM Order o WHERE o.orderNumber LIKE CONCAT('ORD-', :year, '-%') ORDER BY o.orderNumber DESC")
    List<String> findLastOrderNumberByYear(@org.springframework.data.repository.query.Param("year") String year, org.springframework.data.domain.Pageable pageable);
}