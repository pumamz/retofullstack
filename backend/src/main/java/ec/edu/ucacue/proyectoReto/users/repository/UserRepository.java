package ec.edu.ucacue.proyectoReto.users.repository;

import ec.edu.ucacue.proyectoReto.users.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
