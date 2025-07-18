package ec.edu.ucacue.proyectoReto.product.service;

import ec.edu.ucacue.proyectoReto.membership.model.Membership;
import ec.edu.ucacue.proyectoReto.product.model.Product;
import ec.edu.ucacue.proyectoReto.exception.ResourceNotFoundException;
import ec.edu.ucacue.proyectoReto.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<Product> listProducts() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> listEnabledProducts() {
        return productRepository.findProductsByEnabledTrue();
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
    }

    @Override
    public Product saveProduct(Product product) {
        if (product.getId() == null) {
            product.setCreatedAt(LocalDate.now());
        } else {
            Product existingProduct = productRepository.findById(product.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
            product.setCreatedAt(existingProduct.getCreatedAt());
        }
        product.setUpdatedAt(LocalDate.now());
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public void toggleEnabled(Long id, boolean enabled) {
        Product product = getProductById(id);
        product.setEnabled(enabled);
        productRepository.save(product);
    }

    @Override
    public Product findByBarcode(String barcode) {
        return productRepository.findByBarcode(barcode)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con código: " + barcode));
    }

    @Override
    @Transactional
    public void updateStock(Long productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        int newStock = product.getStock() + quantity;
        if (newStock < 0) {
            throw new IllegalStateException("El stock no puede ser negativo");
        }

        product.setStock(newStock);
        product.setUpdatedAt(LocalDate.now());
        productRepository.save(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> searchProducts(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return null;
        }
        return productRepository.searchEnabledProducts(searchTerm);
    }

}