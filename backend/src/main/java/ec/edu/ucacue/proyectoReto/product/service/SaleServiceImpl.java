package ec.edu.ucacue.proyectoReto.product.service;

import ec.edu.ucacue.proyectoReto.product.model.Product;
import ec.edu.ucacue.proyectoReto.product.model.Sale;
import ec.edu.ucacue.proyectoReto.product.model.SaleDetail;
import ec.edu.ucacue.proyectoReto.product.repository.ProductRepository;
import ec.edu.ucacue.proyectoReto.product.repository.SaleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class SaleServiceImpl implements SaleService {

    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;

    public SaleServiceImpl(SaleRepository saleRepository, ProductRepository productRepository) {
        this.saleRepository = saleRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public void registerSale(Sale sale) {
        sale.setDate(LocalDate.now());
        
        if (sale.getDetails() != null) {
            for (SaleDetail detail : sale.getDetails()) {
                Product product = productRepository.findById(detail.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
                
                if (product.getStock() < detail.getQuantity()) {
                    throw new RuntimeException("Stock insuficiente para " + product.getName());
                }
                
                detail.setProduct(product);
                detail.setSale(sale);
                product.setStock(product.getStock() - detail.getQuantity());
                productRepository.save(product);
            }
        }
        
        saleRepository.save(sale);
    }

    @Override
    public List<Sale> listSales() {
        return saleRepository.findAll();
    }
}