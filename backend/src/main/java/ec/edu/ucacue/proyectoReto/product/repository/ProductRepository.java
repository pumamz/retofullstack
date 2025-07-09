package ec.edu.ucacue.proyectoReto.product.repository;

import ec.edu.ucacue.proyectoReto.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByActiveTrue();
    Optional<Product> findByIdAndActiveTrue(Long id);
    Optional<Product> findByBarcode(String barcode);
    List<Product> findByStockLessThanAndActiveTrue(int minimumStock);
}