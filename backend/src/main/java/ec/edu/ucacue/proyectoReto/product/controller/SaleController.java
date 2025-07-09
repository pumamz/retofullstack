package ec.edu.ucacue.proyectoReto.product.controller;

import ec.edu.ucacue.proyectoReto.exception.BusinessException;
import ec.edu.ucacue.proyectoReto.product.model.Sale;
import ec.edu.ucacue.proyectoReto.product.service.ProductService;
import ec.edu.ucacue.proyectoReto.product.service.SaleService;
import ec.edu.ucacue.proyectoReto.users.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "http://localhost:3000")
public class SaleController {
    private final SaleService saleService;
    private final ClientService clientService;
    private final ProductService productService;

    public SaleController(SaleService saleService, ClientService clientService, 
                         ProductService productService) {
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
    public ResponseEntity<Sale> createSale(@Valid @RequestBody Sale sale) {
        return ResponseEntity.ok(saleService.registerSale(sale));
    }

    @GetMapping
    public ResponseEntity<List<Sale>> listSales() {
        return ResponseEntity.ok(saleService.listSales());
    }

    @GetMapping("/{invoiceNumber}")
    public ResponseEntity<Sale> getSaleByInvoiceNumber(@PathVariable String invoiceNumber) {
        return ResponseEntity.ok(saleService.findByInvoiceNumber(invoiceNumber));
    }

    @PostMapping("/{saleId}/cancel")
    public ResponseEntity<Void> cancelSale(@PathVariable Long saleId) throws BusinessException {
        saleService.cancelSale(saleId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Sale>> getSalesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(saleService.findSalesByDateRange(start, end));
    }

}