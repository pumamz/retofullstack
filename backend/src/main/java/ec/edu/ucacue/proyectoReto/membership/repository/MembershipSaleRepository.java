package ec.edu.ucacue.proyectoReto.membership.repository;

import ec.edu.ucacue.proyectoReto.membership.model.MembershipSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MembershipSaleRepository extends JpaRepository<MembershipSale, Long> {

    List<MembershipSale> findByClientId(Long clientId);

    List<MembershipSale> findByStatus(String status);

    List<MembershipSale> findBySaleDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT ms FROM MembershipSale ms WHERE ms.client.id = :clientId AND ms.status = 'ACTIVE'")
    Optional<MembershipSale> findActiveByClientId(@Param("clientId") Long clientId);

    @Query("SELECT ms FROM MembershipSale ms WHERE ms.endDate BETWEEN :startDate AND :endDate AND ms.status = 'ACTIVE'")
    List<MembershipSale> findMembershipsExpiringBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT ms FROM MembershipSale ms WHERE ms.endDate <= :date AND ms.status = 'ACTIVE'")
    List<MembershipSale> findExpiredMemberships(@Param("date") LocalDate date);
}