package ec.edu.ucacue.proyectoReto.product.service;

import ec.edu.ucacue.proyectoReto.product.model.Order;
import ec.edu.ucacue.proyectoReto.product.model.OrderDetail;
import ec.edu.ucacue.proyectoReto.product.repository.OrderRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ec.edu.ucacue.proyectoReto.exception.ResourceNotFoundException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.concurrent.locks.ReentrantLock;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final ProductService productService;

    public OrderServiceImpl(OrderRepository orderRepository, ProductService productService) {
        this.orderRepository = orderRepository;
        this.productService = productService;
    }

    private final ReentrantLock lock = new ReentrantLock();

    private String generateOrderNumber() {
        lock.lock();
        try {
            String year = String.valueOf(LocalDate.now().getYear());
            String prefix = "ORD-" + year + "-";

            PageRequest pageRequest = PageRequest.of(0, 1, Sort.by(Sort.Direction.DESC, "orderNumber"));
            List<String> lastNumbers = orderRepository.findLastOrderNumberByYear(year, pageRequest);

            int nextNumber = 1;
            if (!lastNumbers.isEmpty()) {
                String last = lastNumbers.get(0);
                String[] parts = last.split("-");
                nextNumber = Integer.parseInt(parts[2]) + 1;
            }

            return prefix + String.format("%04d", nextNumber);
        } finally {
            lock.unlock();
        }
    }


    @Override
    public Order registerOrder(Order order) {
        order.setDateTime(LocalDate.now());
        order.setStatus("PENDING");
        order.setOrderNumber(generateOrderNumber());

        if (order.getDetails() != null) {
            order.getDetails().forEach(detail -> {
                detail.setOrder(order);
                detail.setSubtotal(detail.getUnitPrice()
                    .multiply(BigDecimal.valueOf(detail.getQuantity())));
            });
        }

        assert order.getDetails() != null;
        BigDecimal totalAmount = order.getDetails().stream()
            .map(OrderDetail::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(totalAmount);
        
        return orderRepository.save(order);
    }

    @Override
    public List<Order> listOrders() {
        return orderRepository.findAll();
    }

    @Override
    public List<Order> findOrdersByDateRange(LocalDate start, LocalDate end) {
        return orderRepository.findByDateTimeBetween(start, end);
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    @Override
    public Order findByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
            .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));
    }

    @Override
    @Transactional
    public void updateReceivedQuantities(Long orderId, Map<Long, Integer> receivedQuantities) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));

        if ("Rececived".equals(order.getStatus())) {
            throw new IllegalStateException("El pedido ya ha sido recibido");
        }

        order.getDetails().forEach(detail -> {
            Integer received = receivedQuantities.get(detail.getId());
            if (received != null) {
                if (received < 0) {
                    throw new IllegalArgumentException("La cantidad recibida no puede ser negativa");
                }
                if (received > detail.getQuantity()) {
                    throw new IllegalArgumentException(
                            "La cantidad recibida no puede ser mayor que la cantidad pedida");
                }
                detail.setReceivedQuantity(received);

                try {
                    productService.updateStock(detail.getProduct().getId(), received);
                } catch (Exception e) {
                    throw new RuntimeException("Error al actualizar el stock: " + e.getMessage());
                }
            }
        });

        order.setStatus("Received");
        orderRepository.save(order);
    }

}