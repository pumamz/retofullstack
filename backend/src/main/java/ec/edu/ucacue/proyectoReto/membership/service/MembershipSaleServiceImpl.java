package ec.edu.ucacue.proyectoReto.membership.service;

import ec.edu.ucacue.proyectoReto.membership.model.MembershipSale;
import ec.edu.ucacue.proyectoReto.membership.repository.MembershipSaleDetailRepository;
import ec.edu.ucacue.proyectoReto.membership.repository.MembershipSaleRepository;
import ec.edu.ucacue.proyectoReto.users.model.Client;
import ec.edu.ucacue.proyectoReto.users.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;


@Service
public class MembershipSaleServiceImpl implements MembershipSaleService {

    private final MembershipSaleRepository membershipSaleRepository;

    private final MembershipSaleDetailRepository membershipSaleDetailRepository;

    private final ClientRepository clientRepository;

    public MembershipSaleServiceImpl(MembershipSaleRepository membershipSaleRepository, MembershipSaleDetailRepository membershipSaleDetailRepository, ClientRepository clientRepository) {
        this.membershipSaleRepository = membershipSaleRepository;
        this.membershipSaleDetailRepository = membershipSaleDetailRepository;
        this.clientRepository = clientRepository;
    }

    @Override
    public MembershipSale createMembershipSale(MembershipSale membershipSale) {
        return null;
    }

    @Override
    public List<MembershipSale> getAllMembershipSales() {
        return List.of();
    }

    @Override
    public MembershipSale getMembershipSaleById(Long id) {
        return null;
    }

    @Override
    public void cancelMembershipSale(Long id) {

    }

    @Override
    public List<MembershipSale> getMembershipSalesByClient(Long clientId) {
        return List.of();
    }

    @Override
    public List<MembershipSale> getMembershipSalesByDateRange(LocalDate startDate, LocalDate endDate) {
        return List.of();
    }

    @Override
    public List<MembershipSale> getMembershipsExpiringBetween(LocalDate startDate, LocalDate endDate) {
        return List.of();
    }

    @Override
    public List<MembershipSale> getExpiredMemberships() {
        return List.of();
    }

    @Override
    public void updateExpiredMemberships() {

    }

    @Override
    public List<Client> getClientsWithMembershipsExpiringSoon(int days) {
        return List.of();
    }
}
