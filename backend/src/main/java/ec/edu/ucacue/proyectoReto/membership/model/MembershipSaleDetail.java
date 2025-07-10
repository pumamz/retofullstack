package ec.edu.ucacue.proyectoReto.membership.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "membership_sale_details")
public class MembershipSaleDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "membership_sale_id", nullable = false)
    private MembershipSale membershipSale;

    @Column(name = "membership_name", nullable = false)
    private String membershipName;

    @Column(name = "unit_price", nullable = false)
    private Double unitPrice;

    @Column(name = "duration_days", nullable = false)
    private Integer durationDays;

    @Column(name = "discount_percentage")
    private Double discountPercentage = 0.0;

    @Column(name = "discount_amount")
    private Double discountAmount = 0.0;

    @Column(name = "subtotal", nullable = false)
    private Double subtotal;

    private String notes;

    @Column(name = "creation_date", nullable = false)
    private LocalDateTime creationDate;

    @PrePersist
    protected void onCreate() {
        if (creationDate == null) {
            creationDate = LocalDateTime.now();
        }
    }
}