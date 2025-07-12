package ec.edu.ucacue.proyectoReto.membership.service;

import ec.edu.ucacue.proyectoReto.membership.model.MembershipSale;
import ec.edu.ucacue.proyectoReto.membership.repository.MembershipSaleRepository;
import ec.edu.ucacue.proyectoReto.users.model.Client;
import ec.edu.ucacue.proyectoReto.users.repository.ClientRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class MembershipMaintenanceService {

    @Autowired
    private MembershipSaleRepository membershipSaleRepository;

    @Autowired
    private ClientRepository clientRepository;

    //@Scheduled(fixedRate = 86400000)
    //@PostConstruct
    public void updateMembershipStatuses() {
        List<MembershipSale> activeSales = membershipSaleRepository.findAllByStatus("Active");

        LocalDate today = LocalDate.now();

        for (MembershipSale sale : activeSales) {
            Client client = sale.getClient();

            // Actualiza estado si la fecha de fin ha pasado
            if (sale.getEndDate().isBefore(today)) {
                sale.setStatus("Expired");
                client.setMembershipStatus("Expired");
                client.setRemainingDays(0);
            } else {
                int remainingDays = today.until(sale.getEndDate()).getDays();
                client.setRemainingDays(remainingDays);
                client.setMembershipStatus("Active");
            }
            client.setMembershipType(sale.getMembership().getName());

            clientRepository.save(client);
            membershipSaleRepository.save(sale);
        }
    }
}
