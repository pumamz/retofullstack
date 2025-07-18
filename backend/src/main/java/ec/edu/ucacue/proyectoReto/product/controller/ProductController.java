package ec.edu.ucacue.proyectoReto.product.controller;

import ec.edu.ucacue.proyectoReto.product.model.Product;
import ec.edu.ucacue.proyectoReto.product.service.ProductService;
import ec.edu.ucacue.proyectoReto.users.model.Supplier;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> listAllProducts() {
        return ResponseEntity.ok(productService.listProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/enabled")
    public ResponseEntity<List<Product>> getEnabledProducts() {
        return ResponseEntity.ok(productService.listEnabledProducts());
    }

    @GetMapping("/barcode/{barcode}")
    public ResponseEntity<Product> getProductByBarcode(@PathVariable String barcode) {
        return ResponseEntity.ok(productService.findByBarcode(barcode));
    }

    @PostMapping
    public ResponseEntity<Product> saveProduct(@Valid @RequestBody Product product) {
        return ResponseEntity.ok(productService.saveProduct(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody Product product) {
        Product existingProduct = productService.getProductById(id);

        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPriceBuy(product.getPriceBuy());
        existingProduct.setPriceSale(product.getPriceSale());
        existingProduct.setStock(product.getStock());
        existingProduct.setMinimumStock(product.getMinimumStock());
        existingProduct.setBarcode(product.getBarcode());

        return ResponseEntity.ok(productService.saveProduct(existingProduct));
    }

    @PatchMapping("/{id}/enable")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id, @RequestParam boolean enabled) {
        productService.toggleEnabled(id, enabled);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchSuppliers(
            @RequestParam(required = false) String searchTerm) {
        return ResponseEntity.ok(productService.searchProducts(searchTerm));
    }
}