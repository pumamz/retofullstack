package ec.edu.ucacue.proyectoReto.users.model;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
@MappedSuperclass
public abstract class Person implements Serializable {
    @NotBlank(message = "El DNI debe ser obligatorio")
    @Column(unique = true)
    private String dni;

    @NotBlank(message = "El nombre debe ser obligatorio")
    private String firstName;

    @NotBlank(message = "El apellido debe ser obligatorio")
    private String lastName;

    @NotBlank(message = "El telefono debe ser obligatorio")
    private String phone;

    @NotBlank(message = "El email debe ser obligatorio")
    @Email(message = "Ingrese un correo valido")
    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    private boolean enabled = true;

    @Column(nullable = false)
    private LocalDate createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDate.now();
    }
}