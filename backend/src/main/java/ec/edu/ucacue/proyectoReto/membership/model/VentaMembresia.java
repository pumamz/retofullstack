package ec.edu.ucacue.proyectoReto.membership.model;

import ec.edu.ucacue.proyectoReto.users.model.Client;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "membership_sales")
public class VentaMembresia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fechaVenta;
    private String metodoPago;

    @ManyToOne(fetch = FetchType.EAGER) // Cambia a EAGER loading
    @JoinColumn(name = "cliente_id")
    private Client cliente;

    @ManyToOne(fetch = FetchType.EAGER) // Cambia a EAGER loading
    @JoinColumn(name = "membresia_id")
    private Membresia membresia;
}
