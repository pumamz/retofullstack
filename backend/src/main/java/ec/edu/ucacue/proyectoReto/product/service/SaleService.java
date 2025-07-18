package ec.edu.ucacue.proyectoReto.product.service;

import ec.edu.ucacue.proyectoReto.product.model.Sale;

import java.time.LocalDate;
import java.util.List;

public interface SaleService {
    Sale registerSale(Sale sale);

    List<Sale> listSales();

    List<Sale> findSalesByDateRange(LocalDate start, LocalDate end);

    Sale findByInvoiceNumber(String invoiceNumber);
}