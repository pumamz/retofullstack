package ec.edu.ucacue.proyectoReto.users.repository;

import ec.edu.ucacue.proyectoReto.users.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client,Long>  {

}
