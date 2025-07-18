package ec.edu.ucacue.proyectoReto.users.service;

import ec.edu.ucacue.proyectoReto.users.model.Client;

import java.util.List;

public interface ClientService {
    List<Client> listClient();

    List<Client> listEnabledClients();

    Client findClientById(Long id);

    void createClient(Client client);

    void editClient(Client client);

    List<Client> searchClients(String searchTerm);

    void toggleEnabled(Long id, boolean enabled);

}