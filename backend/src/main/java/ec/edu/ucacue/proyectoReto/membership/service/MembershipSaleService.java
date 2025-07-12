package ec.edu.ucacue.proyectoReto.membership.service;

import ec.edu.ucacue.proyectoReto.membership.model.MembershipSale;
import ec.edu.ucacue.proyectoReto.users.model.Client;

import java.time.LocalDate;
import java.util.List;

public interface MembershipSaleService {

    MembershipSale createMembershipSale(MembershipSale membershipSale);

    List<MembershipSale> getAllMembershipSales();

    MembershipSale getMembershipSaleById(Long id);

    void cancelMembershipSale(Long id);

    List<MembershipSale> getMembershipSalesByClient(Long clientId);

    List<MembershipSale> getMembershipSalesByDateRange(LocalDate startDate, LocalDate endDate);

    List<MembershipSale> getMembershipsExpiringBetween(LocalDate startDate, LocalDate endDate);

    List<MembershipSale> getExpiredMemberships();

    void updateExpiredMemberships();

    List<Client> getClientsWithMembershipsExpiringSoon(int days);
}