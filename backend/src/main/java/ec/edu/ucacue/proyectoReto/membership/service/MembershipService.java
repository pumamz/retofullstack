package ec.edu.ucacue.proyectoReto.membership.service;

import ec.edu.ucacue.proyectoReto.membership.model.Membership;
import java.util.List;

public interface MembershipService {

    Membership createMembership(Membership membership);

    List<Membership> getAllMemberships();

    List<Membership> getActiveMemberships();

    Membership getMembershipById(Long id);

    Membership updateMembership(Long id, Membership membership);

    void deleteMembership(Long id);

    List<Membership> searchMemberships(String searchTerm);

    void deactivateMembership(Long id);

    void activateMembership(Long id);
}