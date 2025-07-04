package ec.edu.ucacue.proyectoReto.auth.controller;


import ec.edu.ucacue.proyectoReto.auth.dto.AuthResponse;
import ec.edu.ucacue.proyectoReto.auth.dto.LoginRequest;
import ec.edu.ucacue.proyectoReto.auth.dto.RegisterRequest;
import ec.edu.ucacue.proyectoReto.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody @Valid RegisterRequest request) {
        authService.register(request);
        return authService.login(new LoginRequest(request.getUsername(), request.getPassword()));
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody @Valid LoginRequest request) {
        return authService.login(request);
    }
}
