package ec.edu.ucacue.proyectoReto.users.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "supplier")
public class Supplier extends Person {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Ingrese la empresa")
    private String company;

    @NotBlank(message = "Ingrese el ruc de la empresa")
    private String ruc;
}
