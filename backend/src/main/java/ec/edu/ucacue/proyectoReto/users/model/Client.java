package ec.edu.ucacue.proyectoReto.users.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "client")
public class Client extends Person {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Ingrese el sexo")
    @Pattern(regexp = "^[MF]$", message = "El sexo debe ser M o F")
    private String sex;

    @Min(value = 0, message = "La edad no puede ser negativa")
    @Max(value = 120, message = "La edad no puede ser mayor a 120 años")
    private int age;

    @DecimalMin(value = "0.0", inclusive = false, message = "Ingrese una altura correcta")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal height;

    @DecimalMin(value = "0.0", inclusive = false, message = "Ingrese un peso correcto")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal weight;

    @Column(name = "membership_type")
    private String membershipType;
}