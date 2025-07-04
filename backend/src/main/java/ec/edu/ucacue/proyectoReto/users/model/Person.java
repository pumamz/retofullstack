package ec.edu.ucacue.proyectoReto.users.model;

import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

@Data
@EqualsAndHashCode(callSuper = false)
@MappedSuperclass
public class Person implements Serializable {

    @NotBlank(message = "El DNI debe ser obligatorio")
    private String dni;

    @NotBlank(message = "El nombre debe ser obligatorio")
    private String firstName;

    @NotBlank(message = "El apellido debe ser obligatorio")
    private String lastName;

    @NotBlank(message = "El telefono debe ser obligatorio")
    private String phone;

    @NotBlank(message = "El email debe ser obligatorio")
    @Email(message = "Ingrese un correo valido")
    private String email;

}
