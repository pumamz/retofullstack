package ec.edu.ucacue.proyectoReto.membership.repository;

import ec.edu.ucacue.proyectoReto.membership.model.PersonalizedClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PersonalizedClassRepository extends JpaRepository<PersonalizedClass, Long> {

    List<PersonalizedClass> findByClientId(Long clientId);

    List<PersonalizedClass> findByDateBetween(LocalDate startDate, LocalDate endDate);

    List<PersonalizedClass> findByStatus(String status);

    @Query("SELECT pc FROM PersonalizedClass pc WHERE pc.client.id = :clientId AND pc.status = :status")
    List<PersonalizedClass> findByClientIdAndStatus(@Param("clientId") Long clientId, @Param("status") String status);

    @Query("SELECT pc FROM PersonalizedClass pc WHERE pc.date = :date AND pc.status = 'SCHEDULED'")
    List<PersonalizedClass> findScheduledClassesByDate(@Param("date") LocalDate date);
}