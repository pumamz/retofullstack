package ec.edu.ucacue.proyectoReto.users.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "usuarios")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    private String firstName;

    private String email;

    private String password;
    
    @Enumerated(EnumType.STRING)
    private Role role;
    
    private boolean enabled = true;
}