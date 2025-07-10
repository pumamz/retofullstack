package ec.edu.ucacue.proyectoReto.membership.repository;

import ec.edu.ucacue.proyectoReto.membership.model.PersonalizedClassSaleDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonalizedClassSaleDetailRepository extends JpaRepository<PersonalizedClassSaleDetail, Long> {

    List<PersonalizedClassSaleDetail> findByPersonalizedClassSaleId(Long personalizedClassSaleId);
}