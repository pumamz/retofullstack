package ec.edu.ucacue.proyectoReto.auth.service;

import ec.edu.ucacue.proyectoReto.auth.dto.AuthResponse;
import ec.edu.ucacue.proyectoReto.auth.dto.LoginRequest;
import ec.edu.ucacue.proyectoReto.auth.dto.RegisterRequest;
import ec.edu.ucacue.proyectoReto.exception.UserAlreadyExistsException;
import ec.edu.ucacue.proyectoReto.auth.util.JwtUtil;
import ec.edu.ucacue.proyectoReto.users.model.Role;
import ec.edu.ucacue.proyectoReto.users.model.User;
import ec.edu.ucacue.proyectoReto.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException("El usuario ya existe");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .enabled(true)
                .build();

        userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String token = jwtUtil.generateToken(userDetails);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .role(user.getRole().name())
                .firstName(user.getFirstName())
                .email(user.getEmail())
                .id(user.getId())
                .build();
    }
}