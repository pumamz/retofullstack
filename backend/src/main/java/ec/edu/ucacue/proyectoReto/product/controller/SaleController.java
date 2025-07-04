package ec.edu.ucacue.proyectoReto.product.controller;

import ec.edu.ucacue.proyectoReto.product.model.Sale;
import ec.edu.ucacue.proyectoReto.product.service.ProductService;
import ec.edu.ucacue.proyectoReto.product.service.SaleService;
import ec.edu.ucacue.proyectoReto.users.service.ClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "http://localhost:3000")
public class SaleController {

    private final SaleService saleService;
    private final ClientService clientService;
    private final ProductService productService;

    public SaleController(SaleService saleService, ClientService clientService, ProductService productService) {
        this.saleService = saleService;
        this.clientService = clientService;
        this.productService = productService;
    }

    @GetMapping("/data")
    public ResponseEntity<Map<String, Object>> getSaleData() {
        Map<String, Object> response = new HashMap<>();
        response.put("clients", clientService.listClient());
        response.put("products", productService.listProducts());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Sale> saveSale(@RequestBody Sale sale) {
        saleService.registerSale(sale);
        return ResponseEntity.ok(sale);
    }

    @GetMapping
    public ResponseEntity<?> listSales() {
        return ResponseEntity.ok(saleService.listSales());
    }
}