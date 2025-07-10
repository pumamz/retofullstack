package ec.edu.ucacue.proyectoReto.users.repository;

import ec.edu.ucacue.proyectoReto.users.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {

    List<Client> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);

    Optional<Client> findByDni(String dni);

    List<Client> findByEnabled(boolean enabled);

    // Membership-related queries
    @Query("SELECT c FROM Client c WHERE c.membershipStatus = 'ACTIVE'")
    List<Client> findClientsWithActiveMemberships();

    @Query("SELECT c FROM Client c WHERE c.membershipStatus = 'ACTIVE' AND c.membershipEndDate BETWEEN :startDate AND :endDate")
    List<Client> findClientsWithMembershipsExpiringBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT c FROM Client c WHERE c.membershipStatus = 'ACTIVE' AND c.remainingDays <= :days AND c.remainingDays > 0")
    List<Client> findClientsWithMembershipsExpiringSoon(@Param("days") int days);

    @Query("SELECT c FROM Client c WHERE c.membershipStatus = 'EXPIRED'")
    List<Client> findClientsWithExpiredMemberships();

    @Query("SELECT c FROM Client c WHERE c.membershipType = :membershipType AND c.membershipStatus = 'ACTIVE'")
    List<Client> findClientsByMembershipType(@Param("membershipType") String membershipType);

    @Query("SELECT c FROM Client c WHERE c.membershipStatus IS NOT NULL AND c.membershipStatus != ''")
    List<Client> findClientsWithMemberships();
}