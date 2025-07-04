package ec.edu.ucacue.proyectoReto.product.service;

import ec.edu.ucacue.proyectoReto.product.model.Order;

import java.util.List;

public interface OrderService {
    void registerOrder(Order order);
    List<Order> listOrders();
}
