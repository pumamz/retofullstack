package ec.edu.ucacue.proyectoReto.membership.service;

import ec.edu.ucacue.proyectoReto.membership.model.Membership;
import java.util.List;

public interface MembershipService {

    Membership createMembership(Membership membership);

    List<Membership> getAllMemberships();

    List<Membership> getEnabledMemberships();

    Membership getMembershipById(Long id);

    Membership updateMembership(Long id, Membership membership);

    List<Membership> searchMemberships(String searchTerm);

    void toggleEnabled(Long id, boolean enabled);
}