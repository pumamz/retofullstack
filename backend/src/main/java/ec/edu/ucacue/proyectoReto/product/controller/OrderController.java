package ec.edu.ucacue.proyectoReto.product.controller;

import ec.edu.ucacue.proyectoReto.product.model.Order;
import ec.edu.ucacue.proyectoReto.users.service.SupplierService;
import ec.edu.ucacue.proyectoReto.product.service.OrderService;
import ec.edu.ucacue.proyectoReto.product.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderService orderService;
    private final ProductService productService;
    private final SupplierService supplierService;

    public OrderController(OrderService orderService, 
                         ProductService productService, 
                         SupplierService supplierService) {
        this.orderService = orderService;
        this.productService = productService;
        this.supplierService = supplierService;
    }

    @GetMapping("/data")
    public ResponseEntity<Map<String, Object>> getOrderData() {
        Map<String, Object> response = new HashMap<>();
        response.put("products", productService.listProducts());
        response.put("suppliers", supplierService.listSupplier());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Order> saveOrder(@RequestBody Order order) {
        orderService.registerOrder(order);
        return ResponseEntity.ok(order);
    }

    @GetMapping
    public ResponseEntity<?> listOrders() {
        return ResponseEntity.ok(orderService.listOrders());
    }
}