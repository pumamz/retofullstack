package ec.edu.ucacue.proyectoReto.users.service;

import ec.edu.ucacue.proyectoReto.users.model.Client;

import java.util.List;

public interface ClientService {
    List<Client> listClient();

    Client findClientById(Long id);

    void createClient(Client client);

    void deleteClientById(Long id);

    void editClient(Client client);

    List<Client> searchClients(String name, String dni);

    void toggleEnabled(Long id, boolean enabled);

    List<Client> findByEnabled(boolean enabled);
}