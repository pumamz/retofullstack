package ec.edu.ucacue.proyectoReto.membership.repository;

import ec.edu.ucacue.proyectoReto.membership.model.PersonalizedClassSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PersonalizedClassSaleRepository extends JpaRepository<PersonalizedClassSale, Long> {

    List<PersonalizedClassSale> findByClientId(Long clientId);

    List<PersonalizedClassSale> findByStatus(String status);

    List<PersonalizedClassSale> findBySaleDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT pcs FROM PersonalizedClassSale pcs WHERE pcs.client.id = :clientId AND pcs.status = 'ACTIVE'")
    List<PersonalizedClassSale> findActiveByClientId(@Param("clientId") Long clientId);
}