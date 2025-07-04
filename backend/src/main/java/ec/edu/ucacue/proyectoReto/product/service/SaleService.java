package ec.edu.ucacue.proyectoReto.product.service;

import ec.edu.ucacue.proyectoReto.product.model.Sale;

import java.util.List;

public interface SaleService {
    void registerSale(Sale sale);
    List<Sale> listSales();
}
