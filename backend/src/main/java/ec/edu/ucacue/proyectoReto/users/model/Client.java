package ec.edu.ucacue.proyectoReto.users.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "client")
public class Client extends Person {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Enter the gender")
    @Pattern(regexp = "^[MF]$", message = "Gender must be M or F")
    private String sex;

    @Min(value = 0, message = "Age cannot be negative")
    @Max(value = 120, message = "Age cannot be greater than 120 years")
    private int age;

    @DecimalMin(value = "0.0", inclusive = false, message = "Enter a correct height")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal height;

    @DecimalMin(value = "0.0", inclusive = false, message = "Enter a correct weight")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal weight;

    // Membership tracking fields
    @Column(name = "membership_type")
    private String membershipType;

    @Column(name = "membership_start_date")
    private LocalDate membershipStartDate;

    @Column(name = "membership_end_date")
    private LocalDate membershipEndDate;

    @Column(name = "membership_status")
    private String membershipStatus; // ACTIVE, EXPIRED, CANCELLED

    @Column(name = "remaining_days")
    private Integer remainingDays;

    // Helper methods
    public boolean isMembershipActive() {
        return "ACTIVE".equals(membershipStatus) &&
                membershipEndDate != null &&
                membershipEndDate.isAfter(LocalDate.now());
    }

    public boolean isMembershipExpiringSoon(int daysThreshold) {
        if (!"ACTIVE".equals(membershipStatus) || membershipEndDate == null) {
            return false;
        }
        return membershipEndDate.minusDays(daysThreshold).isBefore(LocalDate.now()) ||
                membershipEndDate.minusDays(daysThreshold).equals(LocalDate.now());
    }

    public void updateRemainingDays() {
        if (membershipEndDate != null && "ACTIVE".equals(membershipStatus)) {
            LocalDate today = LocalDate.now();
            if (membershipEndDate.isAfter(today)) {
                this.remainingDays = Math.toIntExact(today.until(membershipEndDate).getDays());
            } else {
                this.remainingDays = 0;
                this.membershipStatus = "EXPIRED";
            }
        } else {
            this.remainingDays = 0;
        }
    }
}