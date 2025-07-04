package ec.edu.ucacue.proyectoReto.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthResponse {
    private Long id;
    private String username;
    private String firstName;
    private String email;
    private String role;
    private String token;
}
