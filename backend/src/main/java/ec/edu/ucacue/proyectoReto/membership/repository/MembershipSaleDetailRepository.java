package ec.edu.ucacue.proyectoReto.membership.repository;

import ec.edu.ucacue.proyectoReto.membership.model.MembershipSaleDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MembershipSaleDetailRepository extends JpaRepository<MembershipSaleDetail, Long> {

    List<MembershipSaleDetail> findByMembershipSaleId(Long membershipSaleId);
}