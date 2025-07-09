package ec.edu.ucacue.proyectoReto.users.repository;

import ec.edu.ucacue.proyectoReto.users.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client,Long> {
    List<Client> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
    Optional<Client> findByDni(String dni);
    List<Client> findByEnabled(boolean enabled);
}