package ec.edu.ucacue.proyectoReto.product.service;

import ec.edu.ucacue.proyectoReto.exception.BusinessException;
import ec.edu.ucacue.proyectoReto.exception.ResourceNotFoundException;
import ec.edu.ucacue.proyectoReto.product.model.Product;
import ec.edu.ucacue.proyectoReto.product.model.Sale;
import ec.edu.ucacue.proyectoReto.product.model.SaleDetail;
import ec.edu.ucacue.proyectoReto.product.repository.SaleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class SaleServiceImpl implements SaleService {
    private final SaleRepository saleRepository;
    private final ProductService productService;

    public SaleServiceImpl(SaleRepository saleRepository, ProductService productService) {
        this.saleRepository = saleRepository;
        this.productService = productService;
    }

    private String generateInvoiceNumber() {
        String year = String.valueOf(LocalDate.now().getYear());
        Integer lastNumber = saleRepository.findLastInvoiceNumberForYear(year)
                .orElse(0);
        return String.format("FACT-%s-%06d", year, lastNumber + 1);
    }


    @Override
    public Sale registerSale(Sale sale) {
        sale.setDateTime(LocalDate.now());
        sale.setInvoiceNumber(generateInvoiceNumber());
        BigDecimal totalAmount = BigDecimal.ZERO;

        if (sale.getDetails() != null) {
            for (SaleDetail detail : sale.getDetails()) {
                Product product = productService.getProductById(detail.getProduct().getId());

                if (product.getStock() < detail.getQuantity()) {
                    try {
                        throw new BusinessException("Stock insuficiente para " + product.getName());
                    } catch (BusinessException e) {
                        throw new RuntimeException(e);
                    }
                }

                detail.setSale(sale);
                detail.setUnitPrice(product.getPriceSale());

                // Si no se especifica descuento, se establece en 0
                if (detail.getDiscount() == null) {
                    detail.setDiscount(BigDecimal.ZERO);
                }

                // Cálculo del subtotal considerando el descuento
                BigDecimal subtotalSinDescuento = detail.getUnitPrice()
                        .multiply(BigDecimal.valueOf(detail.getQuantity()));
                detail.setSubtotal(subtotalSinDescuento.subtract(detail.getDiscount()));

                totalAmount = totalAmount.add(detail.getSubtotal());
                productService.updateStock(product.getId(), -detail.getQuantity());
            }
        }

        sale.setTotalAmount(totalAmount);
        return saleRepository.save(sale);
    }


    @Override
    public List<Sale> listSales() {
        return saleRepository.findAll();
    }

    @Override
    public List<Sale> findSalesByDateRange(LocalDate start, LocalDate end) {
        return saleRepository.findByDateTimeBetween(start, end);
    }

    @Override
    @Transactional
    public void cancelSale(Long saleId) throws BusinessException {
        Sale sale = saleRepository.findById(saleId)
            .orElseThrow(() -> new ResourceNotFoundException("Venta no encontrada"));
            
        if (sale.isCancelled()) {
            throw new BusinessException("La venta ya está cancelada");
        }
        
        sale.getDetails().forEach(detail -> 
            productService.updateStock(detail.getProduct().getId(), detail.getQuantity())
        );
        
        sale.setCancelled(true);
        saleRepository.save(sale);
    }

    @Override
    public Sale findByInvoiceNumber(String invoiceNumber) {
        return saleRepository.findByInvoiceNumber(invoiceNumber)
            .orElseThrow(() -> new ResourceNotFoundException("Venta no encontrada"));
    }


}