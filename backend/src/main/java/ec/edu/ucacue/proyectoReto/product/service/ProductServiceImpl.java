package ec.edu.ucacue.proyectoReto.product.service;

import ec.edu.ucacue.proyectoReto.product.model.Product;
import ec.edu.ucacue.proyectoReto.exception.ResourceNotFoundException;
import ec.edu.ucacue.proyectoReto.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

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
                .orElseThrow(() -> new RuntimeException("Producto no encontrado o está desactivado"));
    }

    @Override
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public void deactivateProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
        product.setActive(false);
        productRepository.save(product);
    }
}