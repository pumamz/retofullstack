package ec.edu.ucacue.proyectoReto.membership.service;

import ec.edu.ucacue.proyectoReto.exception.ResourceNotFoundException;
import ec.edu.ucacue.proyectoReto.membership.model.Membership;
import ec.edu.ucacue.proyectoReto.membership.model.MembershipSale;
import ec.edu.ucacue.proyectoReto.membership.repository.MembershipRepository;
import ec.edu.ucacue.proyectoReto.membership.repository.MembershipSaleRepository;
import ec.edu.ucacue.proyectoReto.users.model.Client;
import ec.edu.ucacue.proyectoReto.users.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MembershipSaleServiceImpl implements MembershipSaleService {

    @Autowired
    private MembershipSaleRepository membershipSaleRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private MembershipRepository membershipRepository;

    @Override
    public MembershipSale createMembershipSale(MembershipSale membershipSale) {
        validateMembershipSaleData(membershipSale);

        // Check if client already has an active membership
        membershipSaleRepository.findActiveByClientId(membershipSale.getClient().getId())
                .ifPresent(existingMembership -> {
                    throw new IllegalArgumentException("Client already has an active membership");
                });

        // Get the membership details
        Membership membership = membershipRepository.findById(membershipSale.getMembership().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found"));

        // Calculate dates
        LocalDate startDate = membershipSale.getStartDate() != null ?
                membershipSale.getStartDate() : LocalDate.now();
        LocalDate endDate = startDate.plusDays(membership.getDurationDays());

        // Set calculated values
        membershipSale.setStartDate(startDate);
        membershipSale.setEndDate(endDate);
        membershipSale.setTotalAmount(membership.getPrice());
        membershipSale.setStatus("Active");
        membershipSale.setCreationDate(LocalDateTime.now());

        // Save membership sale
        MembershipSale savedSale = membershipSaleRepository.save(membershipSale);

        // Update client membership information
        updateClientMembershipInfo(membershipSale.getClient(), membership, startDate, endDate);

        return savedSale;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MembershipSale> getAllMembershipSales() {
        return membershipSaleRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public MembershipSale getMembershipSaleById(Long id) {
        return membershipSaleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership sale not found with ID: " + id));
    }

    @Override
    public void cancelMembershipSale(Long id) {
        MembershipSale membershipSale = getMembershipSaleById(id);

        if (!"Active".equals(membershipSale.getStatus())) {
            throw new IllegalArgumentException("Cannot cancel membership sale with status: " + membershipSale.getStatus());
        }

        membershipSale.setStatus("Cancelled");
        membershipSaleRepository.save(membershipSale);

        // Update client membership status
        Client client = membershipSale.getClient();
        client.setMembershipStatus("Cancelled");
        client.setRemainingDays(0);
        clientRepository.save(client);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MembershipSale> getMembershipSalesByClient(Long clientId) {
        return membershipSaleRepository.findByClientId(clientId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MembershipSale> getMembershipSalesByDateRange(LocalDate startDate, LocalDate endDate) {
        return membershipSaleRepository.findBySaleDateBetween(startDate, endDate);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MembershipSale> getMembershipsExpiringBetween(LocalDate startDate, LocalDate endDate) {
        return membershipSaleRepository.findMembershipsExpiringBetween(startDate, endDate);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MembershipSale> getExpiredMemberships() {
        return membershipSaleRepository.findExpiredMemberships(LocalDate.now());
    }

    @Override
    public void updateExpiredMemberships() {
        List<MembershipSale> expiredMemberships = getExpiredMemberships();

        for (MembershipSale membershipSale : expiredMemberships) {
            membershipSale.setStatus("Expired");
            membershipSaleRepository.save(membershipSale);

            // Update client status
            Client client = membershipSale.getClient();
            client.setMembershipStatus("Expired");
            client.setRemainingDays(0);
            clientRepository.save(client);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Client> getClientsWithMembershipsExpiringSoon(int days) {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(days);

        List<MembershipSale> expiringSales = getMembershipsExpiringBetween(today, endDate);

        return expiringSales.stream()
                .map(MembershipSale::getClient)
                .distinct()
                .collect(Collectors.toList());
    }

    private void validateMembershipSaleData(MembershipSale membershipSale) {
        if (membershipSale == null) {
            throw new IllegalArgumentException("Membership sale cannot be null");
        }
        if (membershipSale.getClient() == null || membershipSale.getClient().getId() == null) {
            throw new IllegalArgumentException("Client is required");
        }
        if (membershipSale.getMembership() == null || membershipSale.getMembership().getId() == null) {
            throw new IllegalArgumentException("Membership is required");
        }
        if (membershipSale.getPaymentMethod() == null || membershipSale.getPaymentMethod().trim().isEmpty()) {
            throw new IllegalArgumentException("Payment method is required");
        }

        // Verify client exists
        clientRepository.findById(membershipSale.getClient().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));

        // Verify membership exists and is active
        Membership membership = membershipRepository.findById(membershipSale.getMembership().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found"));

        if (!membership.getActive()) {
            throw new IllegalArgumentException("Cannot sell inactive membership");
        }
    }

    private void updateClientMembershipInfo(Client client, Membership membership, LocalDate startDate, LocalDate endDate) {
        // Get the full client object
        Client fullClient = clientRepository.findById(client.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));

        fullClient.setMembershipType(membership.getName());
        fullClient.setMembershipStartDate(startDate);
        fullClient.setMembershipEndDate(endDate);
        fullClient.setMembershipStatus("Active");
        fullClient.updateRemainingDays();

        clientRepository.save(fullClient);
    }
}