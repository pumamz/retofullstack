package ec.edu.ucacue.proyectoReto.exception;

import jakarta.validation.constraints.NotBlank;

public class BusinessException extends Throwable {
    public BusinessException(@NotBlank(message = "El nombre es obligatorio") String s) {
    }
}
