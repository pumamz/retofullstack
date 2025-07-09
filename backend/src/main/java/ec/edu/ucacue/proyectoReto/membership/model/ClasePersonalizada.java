package ec.edu.ucacue.proyectoReto.membership.model;

import ec.edu.ucacue.proyectoReto.users.model.Client;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "membresias_clases")
public class ClasePersonalizada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombreClase;
    private String descripcion;
    private LocalDate fecha;
    private LocalTime hora;
    private Double precio;
    private String metodoPago;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Client cliente;

}