package ec.edu.ucacue.proyectoReto.product.service;

import ec.edu.ucacue.proyectoReto.product.model.Product;
import ec.edu.ucacue.proyectoReto.users.model.Supplier;

import java.util.List;

public interface ProductService {
    List<Product> listProducts();

    List<Product> listEnabledProducts();

    Product getProductById(Long id);

    Product saveProduct(Product product);

    void toggleEnabled(Long id, boolean enabled);

    Product findByBarcode(String barcode);

    void updateStock(Long productId, int quantity);

    List<Product> searchProducts(String searchTerm);
}