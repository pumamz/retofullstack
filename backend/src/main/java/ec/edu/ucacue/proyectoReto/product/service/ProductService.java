package ec.edu.ucacue.proyectoReto.product.service;

import ec.edu.ucacue.proyectoReto.product.model.Product;
import java.util.List;

public interface ProductService {
    List<Product> listProducts();
    Product getProductById(Long id);
    Product saveProduct(Product product);
    void deactivateProduct(Long id);
    Product findByBarcode(String barcode);
    List<Product> findLowStockProducts();
    void updateStock(Long productId, int quantity);
}