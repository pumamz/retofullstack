package ec.edu.ucacue.proyectoReto.product.controller;

import ec.edu.ucacue.proyectoReto.product.model.Order;
import ec.edu.ucacue.proyectoReto.users.service.SupplierService;
import ec.edu.ucacue.proyectoReto.product.service.OrderService;
import ec.edu.ucacue.proyectoReto.product.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {
    private final OrderService orderService;
    private final ProductService productService;
    private final SupplierService supplierService;

    public OrderController(OrderService orderService, ProductService productService, 
                         SupplierService supplierService) {
        this.orderService = orderService;
        this.productService = productService;
        this.supplierService = supplierService;
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

    @GetMapping("/{orderNumber}")
    public ResponseEntity<Order> getOrderByNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.findByOrderNumber(orderNumber));
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
}