package ec.edu.ucacue.proyectoReto.product.service;

import ec.edu.ucacue.proyectoReto.product.model.Order;
import ec.edu.ucacue.proyectoReto.product.model.OrderDetail;
import ec.edu.ucacue.proyectoReto.product.model.Product;
import ec.edu.ucacue.proyectoReto.product.repository.OrderRepository;
import ec.edu.ucacue.proyectoReto.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderServiceImpl(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public void registerOrder(Order order) {
        order.setDate(LocalDate.now());
        
        if (order.getDetails() != null) {
            for (OrderDetail detail : order.getDetails()) {
                Product product = productRepository.findById(detail.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
                
                detail.setProduct(product);
                detail.setOrder(order);
                
                // Actualizar el stock del producto
                product.setStock(product.getStock() + detail.getQuantity());
                productRepository.save(product);
            }
        }
        
        orderRepository.save(order);
    }

    @Override
    public List<Order> listOrders() {
        return orderRepository.findAll();
    }
}