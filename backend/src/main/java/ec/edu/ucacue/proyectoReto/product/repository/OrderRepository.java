package ec.edu.ucacue.proyectoReto.product.repository;

import ec.edu.ucacue.proyectoReto.product.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
