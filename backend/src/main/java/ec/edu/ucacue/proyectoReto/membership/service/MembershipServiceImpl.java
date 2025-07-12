package ec.edu.ucacue.proyectoReto.membership.service;

import ec.edu.ucacue.proyectoReto.exception.ResourceNotFoundException;
import ec.edu.ucacue.proyectoReto.membership.model.Membership;
import ec.edu.ucacue.proyectoReto.membership.repository.MembershipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
@Transactional
public class MembershipServiceImpl implements MembershipService {

    @Autowired
    private MembershipRepository membershipRepository;

    @Override
    public Membership createMembership(Membership membership) {
        validateMembershipData(membership);

        // Check if the membership name already exists
        if (membershipRepository.findByNameIgnoreCase(membership.getName()).isPresent()) {
            throw new IllegalArgumentException("A membership with this name already exists");
        }

        // Set a creation date if not provided
        if (membership.getCreationDate() == null) {
            membership.setCreationDate(LocalDate.now(ZoneId.of("America/Guayaquil")));
        }

        return membershipRepository.save(membership);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Membership> getAllMemberships() {
        return membershipRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Membership> getActiveMemberships() {
        return membershipRepository.findByActiveTrue();
    }

    @Override
    @Transactional(readOnly = true)
    public Membership getMembershipById(Long id) {
        return membershipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found with ID: " + id));
    }

    @Override
    public Membership updateMembership(Long id, Membership membership) {
        Membership existingMembership = getMembershipById(id);

        // Validate new data
        if (membership.getName() != null && !membership.getName().trim().isEmpty()) {
            // Check if another membership with the same name exists
            membershipRepository.findByNameIgnoreCase(membership.getName())
                    .ifPresent(existing -> {
                        if (!existing.getId().equals(id)) {
                            throw new IllegalArgumentException("Another membership with this name already exists");
                        }
                    });
            existingMembership.setName(membership.getName());
        }

        if (membership.getPrice() != null && membership.getPrice() > 0) {
            existingMembership.setPrice(membership.getPrice());
        }

        if (membership.getDurationDays() != null && membership.getDurationDays() > 0) {
            existingMembership.setDurationDays(membership.getDurationDays());
        }

        if (membership.getDescription() != null) {
            existingMembership.setDescription(membership.getDescription());
        }

        if (membership.getActive() != null) {
            existingMembership.setActive(membership.getActive());
        }

        return membershipRepository.save(existingMembership);
    }

    @Override
    public void deleteMembership(Long id) {
        Membership membership = getMembershipById(id);
        // Soft delete - deactivate instead of removing
        membership.setActive(false);
        membershipRepository.save(membership);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Membership> searchMemberships(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getActiveMemberships();
        }
        return membershipRepository.searchActiveMemberships(searchTerm);
    }

    @Override
    public void deactivateMembership(Long id) {
        Membership membership = getMembershipById(id);
        membership.setActive(false);
        membershipRepository.save(membership);
    }

    @Override
    public void activateMembership(Long id) {
        Membership membership = getMembershipById(id);
        membership.setActive(true);
        membershipRepository.save(membership);
    }

    private void validateMembershipData(Membership membership) {
        if (membership == null) {
            throw new IllegalArgumentException("Membership cannot be null");
        }
        if (membership.getName() == null || membership.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Membership name is required");
        }
        if (membership.getPrice() == null || membership.getPrice() <= 0) {
            throw new IllegalArgumentException("Price must be greater than zero");
        }
        if (membership.getDurationDays() == null || membership.getDurationDays() <= 0) {
            throw new IllegalArgumentException("Duration must be greater than zero days");
        }
    }
}