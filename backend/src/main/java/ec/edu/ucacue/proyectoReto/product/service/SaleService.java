package ec.edu.ucacue.proyectoReto.product.service;

import ec.edu.ucacue.proyectoReto.exception.BusinessException;
import ec.edu.ucacue.proyectoReto.product.model.Sale;
import java.time.LocalDate;
import java.util.List;

public interface SaleService {
    Sale registerSale(Sale sale);
    List<Sale> listSales();
    List<Sale> findSalesByDateRange(LocalDate start, LocalDate end);
    void cancelSale(Long saleId) throws BusinessException;
    Sale findByInvoiceNumber(String invoiceNumber);
}