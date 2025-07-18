package ec.edu.ucacue.proyectoReto.membership.service;

import ec.edu.ucacue.proyectoReto.membership.model.MembershipSale;
import ec.edu.ucacue.proyectoReto.membership.repository.MembershipSaleRepository;
import ec.edu.ucacue.proyectoReto.users.model.Client;
import ec.edu.ucacue.proyectoReto.users.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class MembershipMaintenanceService {

    private final MembershipSaleRepository membershipSaleRepository;

    private final ClientRepository clientRepository;

    public MembershipMaintenanceService(MembershipSaleRepository membershipSaleRepository, ClientRepository clientRepository) {
        this.membershipSaleRepository = membershipSaleRepository;
        this.clientRepository = clientRepository;
    }

    public void updateMembershipStatuses() {
        List<MembershipSale> activeSales = membershipSaleRepository.findAllByStatus("Active");

        LocalDate today = LocalDate.now();

        for (MembershipSale sale : activeSales) {
            Client client = sale.getClient();

            if (sale.getEndDate().isBefore(today)) {
                sale.setStatus("Expired");
                client.setMembershipStatus("Expired");
                client.setRemainingDays(0);
            } else {
                long remainingDays = ChronoUnit.DAYS.between(today, sale.getEndDate());
                client.setRemainingDays((int) remainingDays);
                client.setMembershipStatus("Active");
            }

            client.setMembershipType(sale.getMembership().getName());

            clientRepository.save(client);
            membershipSaleRepository.save(sale);
        }
    }
}
