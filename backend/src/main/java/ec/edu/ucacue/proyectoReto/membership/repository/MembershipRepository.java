package ec.edu.ucacue.proyectoReto.membership.repository;

import ec.edu.ucacue.proyectoReto.membership.model.Membership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {

    List<Membership> findByEnabledTrue();

    Optional<Membership> findByNameIgnoreCase(String name);

    @Query("SELECT m FROM Membership m WHERE m.enabled = true AND " +
            "(LOWER(m.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(m.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Membership> searchEnabledMemberships(@Param("searchTerm") String searchTerm);
}
