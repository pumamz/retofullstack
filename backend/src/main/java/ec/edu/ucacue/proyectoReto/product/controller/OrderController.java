package ec.edu.ucacue.proyectoReto.product.controller;

import ec.edu.ucacue.proyectoReto.product.model.Order;
import ec.edu.ucacue.proyectoReto.product.model.Sale;
import ec.edu.ucacue.proyectoReto.product.service.OrderService;
import jakarta.validation.Valid;
import org.aspectj.weaver.ast.Or;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@Valid @RequestBody Order order) {
        return ResponseEntity.ok(orderService.registerOrder(order));
    }

    @Transactional
    @GetMapping
    public ResponseEntity<List<Order>> listOrders() {
        return ResponseEntity.ok(orderService.listOrders());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Order>> searchOrders(
            @RequestParam(required = false) String searchTerm) {
        return ResponseEntity.ok(orderService.searchOrders(searchTerm));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long orderId, 
                                                 @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    @PutMapping("/{orderId}/receive")
    public ResponseEntity<Void> receiveOrder(@PathVariable Long orderId, 
                                           @RequestBody Map<Long, Integer> receivedQuantities) {
        orderService.updateReceivedQuantities(orderId, receivedQuantities);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Order>> getSalesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(orderService.findOrdersByDateRange(start, end));
    }
}