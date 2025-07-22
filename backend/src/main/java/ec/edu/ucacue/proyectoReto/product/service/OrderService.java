package ec.edu.ucacue.proyectoReto.product.service;

import ec.edu.ucacue.proyectoReto.product.model.Order;
import ec.edu.ucacue.proyectoReto.users.model.Supplier;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface OrderService {
    Order registerOrder(Order order);

    List<Order> listOrders();

    List<Order> findOrdersByDateRange(LocalDate start, LocalDate end);

    Order updateOrderStatus(Long orderId, String status);

    void updateReceivedQuantities(Long orderId, Map<Long, Integer> receivedQuantities);

    List<Order> searchOrders(String search);
}