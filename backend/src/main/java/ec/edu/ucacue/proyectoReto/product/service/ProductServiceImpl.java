package ec.edu.ucacue.proyectoReto.product.service;

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
        return productRepository.findByActiveTrue();
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findByIdAndActiveTrue(id)
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
    public void deactivateProduct(Long id) {
        Product product = getProductById(id);
        product.setActive(false);
        product.setUpdatedAt(LocalDate.now());
        productRepository.save(product);
    }

    @Override
    public Product findByBarcode(String barcode) {
        return productRepository.findByBarcode(barcode)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con código: " + barcode));
    }

    @Override
    public List<Product> findLowStockProducts() {
        return productRepository.findByStockLessThanAndActiveTrue(0);
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

}